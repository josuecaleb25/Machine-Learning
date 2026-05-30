import { apiFetch } from './api.js';

const TOKEN_KEY = 'ecovision_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function registerManual({ nombre, email, password }) {
  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password }),
  });
  return res.data;
}

export async function loginManual({ email, password }) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export async function registerFace({ nombre, facialEmbedding }) {
  const res = await apiFetch('/auth/register-face', {
    method: 'POST',
    body: JSON.stringify({ nombre, facialEmbedding }),
  });
  return res.data;
}

export async function loginFace({ facialEmbedding }) {
  const res = await apiFetch('/auth/login-face', {
    method: 'POST',
    body: JSON.stringify({ facialEmbedding }),
  });
  return res.data;
}

export async function fetchMe() {
  const res = await apiFetch('/auth/me');
  return res.data.user;
}
