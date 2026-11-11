import type { Metric, SeriesResponse, StationsResponse, SummaryResponse } from './types'

const stations = [
  { id: 'EST-01', name: 'Estação Aurora', river: 'Rio Aurora', municipality: 'Vila Aurora' },
  { id: 'EST-02', name: 'Estação Vale Verde', river: 'Rio Verde', municipality: 'Vale Verde' },
  { id: 'EST-03', name: 'Estação Campo Alto', river: 'Rio do Campo', municipality: 'Campo Alto' },
]

const scenario = import.meta.env.VITE_DEMO_CENARIO || 'normal'
let errorAlreadyUsed = false

async function pause(): Promise<void> {
  const milliseconds = scenario === 'slow' ? 1800 : 350
  await new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds))
  if (scenario === 'error' && !errorAlreadyUsed) {
    errorAlreadyUsed = true
    throw new Error('Falha simulada ao consultar a API. Tente novamente.')
  }
}

function hoursFromNow(hoursAgo: number): string {
  const date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)
  if (hoursAgo === 0) date.setUTCMinutes(0, 0, 0)
  return date.toISOString()
}

function makeValue(stationIndex: number, hourIndex: number, metric: Metric): number {
  if (metric === 'level') {
    return Number((1.05 + stationIndex * 0.24 + 0.08 * Math.sin(hourIndex / 5 + stationIndex)).toFixed(2))
  }
  const wetHour = (hourIndex + stationIndex * 7) % 17 < 3
  return wetHour ? Number((0.4 + ((hourIndex + stationIndex) % 4) * 0.35).toFixed(2)) : 0
}

function erro(code: string, message: string, status: number): Error & { code: string; status: number } {
  return Object.assign(new Error(message), { code, status })
}

function stationIndex(stationId: string): number {
  const index = stations.findIndex((station) => station.id === stationId)
  if (index < 0) throw erro('station_not_found', 'Estação não encontrada.', 404)
  return index
}

function validarSerie(metric: string, hours: number): void {
  if (metric !== 'level' && metric !== 'rain') throw erro('invalid_metric', 'Métrica inválida.', 400)
  if (!Number.isInteger(hours) || hours < 1 || hours > 72) throw erro('invalid_hours', 'Período inválido.', 400)
}

export async function getStations(): Promise<StationsResponse> {
  await pause()
  return {
    data_mode: 'simulation',
    stations: stations.map((station) => ({ ...station, updated_at: hoursFromNow(0) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
  }
}

export async function getSummary(stationId: string): Promise<SummaryResponse> {
  await pause()
  const index = stationIndex(stationId)
  const station = stations[index]
  return {
    data_mode: 'simulation',
    message: 'Amostra simulada. Não representa condições reais.',
    station,
    latest: {
      level_observed_at: hoursFromNow(0),
      rain_observed_at: hoursFromNow(0),
      level_m: makeValue(index, 72, 'level'),
      rain_mm_h: makeValue(index, 72, 'rain'),
    },
  }
}

export async function getSeries(stationId: string, metric: Metric = 'level', hours = 24): Promise<SeriesResponse> {
  await pause()
  validarSerie(metric, hours)
  const index = stationIndex(stationId)
  const end = new Date()
  end.setUTCMinutes(0, 0, 0)
  const start = new Date(end.getTime() - hours * 60 * 60 * 1000)
  const points = scenario === 'empty'
    ? []
    : Array.from({ length: hours + 1 }, (_value, hourIndex) => ({
        timestamp: new Date(start.getTime() + hourIndex * 60 * 60 * 1000).toISOString(),
        value: makeValue(index, 72 - hours + hourIndex, metric),
      }))

  return {
    data_mode: 'simulation',
    station_id: stationId,
    metric,
    unit: metric === 'level' ? 'm' : 'mm/h',
    interval_minutes: 60,
    from: start.toISOString(),
    to: end.toISOString(),
    points,
  }
}
