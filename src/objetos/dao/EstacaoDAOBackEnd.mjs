import Estacao from '../estacoes/Estacao.mjs';
import Observacao from '../observacoes/Observacao.mjs';

export default class EstacaoDAOBackEnd {
  constructor() {
    this.stationsUrl = import.meta.env.VITE_COGMO_STATIONS_URL;
    this.summaryBaseUrl = import.meta.env.VITE_COGMO_SUMMARY_BASE_URL;
  }

  async consultarJSON(url) {
    if (!url || url.includes('COLE_AQUI')) throw new Error('URL da API não configurada.');
    let resposta;
    try {
      resposta = await fetch(url, { headers: { Accept: 'application/json' } });
    } catch {
      throw new Error('Não foi possível conectar à API da Cogmo.');
    }

    let dados;
    try {
      dados = await resposta.json();
    } catch {
      throw new Error('A API retornou uma resposta que não é JSON válido.');
    }
    if (!resposta.ok) {
      throw Object.assign(new Error(dados?.error?.message || `Erro HTTP ${resposta.status}.`), {
        code: dados?.error?.code,
        status: resposta.status,
      });
    }
    return dados;
  }

  async listar() {
    const dados = await this.consultarJSON(this.stationsUrl);
    if (!Array.isArray(dados?.stations)) throw new Error('Lista de estações inválida.');
    return dados.stations.map(estacao => new Estacao(estacao))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }

  async obterResumo(stationId) {
    if (!stationId) throw new Error('Identificador da estação obrigatório.');
    if (!this.summaryBaseUrl || this.summaryBaseUrl.includes('COLE_AQUI')) {
      throw new Error('URL da API não configurada.');
    }
    const base = this.summaryBaseUrl?.replace(/\/$/, '');
    const dados = await this.consultarJSON(`${base}/${encodeURIComponent(stationId)}/summary`);
    if (!dados?.station || !dados?.latest) throw new Error('Resumo da estação inválido.');
    return {
      dataMode: dados.data_mode,
      message: dados.message,
      station: new Estacao(dados.station),
      latest: {
        level: new Observacao({ stationId, metric: 'level', unit: 'm',
          observedAt: dados.latest.level_observed_at, value: dados.latest.level_m }),
        rain: new Observacao({ stationId, metric: 'rain', unit: 'mm/h',
          observedAt: dados.latest.rain_observed_at, value: dados.latest.rain_mm_h }),
      },
    };
  }
}
