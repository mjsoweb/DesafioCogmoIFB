import { getStations, getSummary } from '../api/api';
import Estacao from '../modelos/Estacao';
import Observacao from '../modelos/Observacao';

export default class EstacaoDAO {
  async listar() {
    const resposta = await getStations();
    return resposta.stations.map(dados => new Estacao(dados))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }

  async obterResumo(stationId) {
    const resposta = await getSummary(stationId);
    const { latest } = resposta;
    return {
      dataMode: resposta.data_mode,
      message: resposta.message,
      station: new Estacao(resposta.station),
      latest: {
        level: new Observacao({ stationId, metric: 'level', unit: 'm',
          observedAt: latest.level_observed_at, value: latest.level_m }),
        rain: new Observacao({ stationId, metric: 'rain', unit: 'mm/h',
          observedAt: latest.rain_observed_at, value: latest.rain_mm_h }),
      },
    };
  }
}
