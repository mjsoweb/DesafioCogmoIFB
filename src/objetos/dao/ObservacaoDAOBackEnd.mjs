import Observacao from '../observacoes/Observacao.mjs';

export default class ObservacaoDAOBackEnd {
  constructor() {
    this.seriesBaseUrl = import.meta.env.VITE_COGMO_SERIES_BASE_URL;
  }

  async listarSerie(stationId, metric = 'level', hours = 24) {
    if (!stationId) throw new Error('Identificador da estação obrigatório.');
    if (metric !== 'level' && metric !== 'rain') {
      throw Object.assign(new Error('Métrica inválida.'), { code: 'invalid_metric', status: 400 });
    }
    if (![12, 24, 48].includes(hours)) {
      throw Object.assign(new Error('A janela deve ser de 12, 24 ou 48 horas.'), { code: 'invalid_hours', status: 400 });
    }
    if (!this.seriesBaseUrl || this.seriesBaseUrl.includes('COLE_AQUI')) {
      throw new Error('URL da API não configurada.');
    }
    const base = this.seriesBaseUrl.replace(/\/$/, '');
    const params = new URLSearchParams({ metric, hours: String(hours) });
    const url = `${base}/${encodeURIComponent(stationId)}/series?${params}`;

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
    if (!Array.isArray(dados?.points)) throw new Error('Série de observações inválida.');

    return {
      dataMode: dados.data_mode,
      stationId: dados.station_id,
      metric: dados.metric,
      unit: dados.unit,
      intervalMinutes: dados.interval_minutes,
      from: dados.from,
      to: dados.to,
      points: dados.points.map(ponto => new Observacao({
        stationId: dados.station_id, metric: dados.metric, unit: dados.unit,
        observedAt: ponto.timestamp, value: ponto.value,
      })),
    };
  }
}
