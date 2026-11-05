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
  await new Promise((resolve) => window.setTimeout(resolve, milliseconds))
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

export async function getStations(): Promise<StationsResponse> {
  await pause()
  return {
    data_mode: 'simulation',
    stations: stations.map((station) => ({ ...station, updated_at: hoursFromNow(0) })),
  }
}

export async function getSummary(stationId: string): Promise<SummaryResponse> {
  await pause()
  const stationIndex = Math.max(0, stations.findIndex((station) => station.id === stationId))
  const station = stations[stationIndex]
  return {
    data_mode: 'simulation',
    message: 'Amostra simulada. Não representa condições reais.',
    station,
    latest: {
      level_observed_at: hoursFromNow(0),
      rain_observed_at: hoursFromNow(0),
      level_m: makeValue(stationIndex, 72, 'level'),
      rain_mm_h: makeValue(stationIndex, 72, 'rain'),
    },
  }
}

export async function getSeries(stationId: string, metric: Metric, hours: number): Promise<SeriesResponse> {
  await pause()
  const stationIndex = Math.max(0, stations.findIndex((station) => station.id === stationId))
  const end = new Date()
  end.setUTCMinutes(0, 0, 0)
  const start = new Date(end.getTime() - hours * 60 * 60 * 1000)
  const points = scenario === 'empty'
    ? []
    : Array.from({ length: hours + 1 }, (_value, index) => ({
        timestamp: new Date(start.getTime() + index * 60 * 60 * 1000).toISOString(),
        value: makeValue(stationIndex, 72 - hours + index, metric),
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
