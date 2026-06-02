import { useState, useCallback } from 'react';
import { apiFetch } from '../lib/api.js';

export const usePredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPrediction = useCallback(async ({ residuoDetectado, categoria, confianza }) => {
    try {
      setError(null);
      const result = await apiFetch('/predictions', {
        method: 'POST',
        body: JSON.stringify({ residuoDetectado, categoria, confianza }),
      });
      return result.data.prediction;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const fetchPredictions = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFetch(`/predictions/history?limit=${limit}&offset=${offset}`);
      const items = result.data?.items ?? [];
      setPredictions(items);
      return result.data ?? { items: [], total: 0 };
    } catch (err) {
      setError(err.message);
      return { items: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePrediction = useCallback(async (predictionId) => {
    try {
      setError(null);
      await apiFetch(`/predictions/history/${predictionId}`, { method: 'DELETE' });
      setPredictions(prev => prev.filter(p => p.id !== predictionId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return { predictions, loading, error, createPrediction, fetchPredictions, deletePrediction };
};
