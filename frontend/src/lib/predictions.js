import { apiFetch } from './api.js';

export async function savePrediction({ residuoDetectado, categoria, confianza }) {
  return apiFetch('/predictions', {
    method: 'POST',
    body: JSON.stringify({ residuoDetectado, categoria, confianza }),
  });
}
