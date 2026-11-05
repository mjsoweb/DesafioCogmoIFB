export type Metric = 'level' | 'rain'

export type Station = {
  id: string
  name: string
  river: string
  municipality: string
  updated_at: string | null
}

export type StationsResponse = {
  data_mode: 'simulation'
  stations: Station[]
}

export type SummaryResponse = {
  data_mode: 'simulation'
  message: string
  station: Omit<Station, 'updated_at'>
  latest: {
    level_observed_at: string | null
    level_m: number | null
    rain_observed_at: string | null
    rain_mm_h: number | null
  }
}

export type SeriesPoint = {
  timestamp: string
  value: number
}

export type SeriesResponse = {
  data_mode: 'simulation'
  station_id: string
  metric: Metric
  unit: 'm' | 'mm/h'
  interval_minutes: number
  from: string
  to: string
  points: SeriesPoint[]
}
