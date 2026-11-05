import type { Metric, SeriesResponse, StationsResponse, SummaryResponse } from './types'
import * as mockApi from './mockApi'

// Forçamos o modo mock para evitar o erro do import.meta
const mode = 'mock'
const baseUrl = 'http://localhost:3000'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(baseUrl + path, { headers: { Accept: 'application/json' } })
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const message = body?.error?.message || 'Não foi possível carregar os dados.'
    throw new Error(message)
  }
  return body as T
}

export function getStations(): Promise<StationsResponse> {
  if (mode === 'mock') return mockApi.getStations()
  return request('/api/stations')
}

export function getSummary(stationId: string): Promise<SummaryResponse> {
  if (mode === 'mock') return mockApi.getSummary(stationId)
  return request('/api/stations/' + encodeURIComponent(stationId) + '/summary')
}

export function getSeries(stationId: string, metric: Metric, hours: number): Promise<SeriesResponse> {
  if (mode === 'mock') return mockApi.getSeries(stationId, metric, hours)
  const query = new URLSearchParams({ metric, hours: String(hours) })
  return request('/api/stations/' + encodeURIComponent(stationId) + '/series?' + query.toString())
}
