import { getSeries } from '../api/api';
import Observacao from '../modelos/Observacao';

export default class ObservacaoDAO {
  async listarSerie(stationId, metric = 'level', hours = 24) {
    const resposta = await getSeries(stationId, metric, hours);
    return {
      dataMode: resposta.data_mode,
      stationId: resposta.station_id,
      metric: resposta.metric,
      unit: resposta.unit,
      intervalMinutes: resposta.interval_minutes,
      from: resposta.from,
      to: resposta.to,
      points: resposta.points.map(ponto => new Observacao({
        stationId: resposta.station_id, metric: resposta.metric, unit: resposta.unit,
        observedAt: ponto.timestamp, value: ponto.value,
      })),
    };
  }
}
