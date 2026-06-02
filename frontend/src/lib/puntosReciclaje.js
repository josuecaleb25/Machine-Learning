import { getApiUrl } from './api';

/**
 * Obtiene puntos de reciclaje con búsqueda, filtro y orden por cercanía.
 * @param {{ q?: string, tipo?: string, lat?: number, lng?: number }} params
 */
export async function fetchPuntosReciclaje(params = {}) {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.tipo) search.set('tipo', params.tipo);
  if (params.lat != null) search.set('lat', String(params.lat));
  if (params.lng != null) search.set('lng', String(params.lng));
  search.set('activo', 'true');

  const qs = search.toString();
  const url = getApiUrl(`/puntos-reciclaje${qs ? `?${qs}` : ''}`);

  const token = localStorage.getItem('ecovision_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message ?? `Error HTTP ${res.status}`);
  }

  return json.data ?? { puntos: [], total: 0 };
}
