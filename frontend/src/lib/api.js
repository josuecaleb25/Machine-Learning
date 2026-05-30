const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export function getApiUrl(path = '') {
  const base = API_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('ecovision_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(getApiUrl(path), { ...options, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(json.message ?? `Error HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return json;
}
