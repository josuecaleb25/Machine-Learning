import { useCallback, useEffect, useState } from 'react';
import { fetchPuntosReciclaje } from '../lib/puntosReciclaje';

/**
 * Carga puntos desde la API con búsqueda, filtro y coordenadas del usuario.
 */
export function usePuntosReciclaje({ q, tipo, lat, lng, enabled = true }) {
  const [puntos, setPuntos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPuntosReciclaje({
        q: q || undefined,
        tipo: tipo || undefined,
        lat,
        lng,
      });
      setPuntos(data.puntos ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err.message ?? 'Error al cargar puntos');
      setPuntos([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [q, tipo, lat, lng, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { puntos, total, loading, error, reload: load };
}
