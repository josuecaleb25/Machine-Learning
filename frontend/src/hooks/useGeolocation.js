import { useCallback, useEffect, useState } from 'react';
import { LIMA_CENTER } from '../lib/geo';

/**
 * Geolocalización del usuario con estados de carga y error.
 * Si falla o se deniega, usa Lima centro como referencia del mapa.
 */
export function useGeolocation({ requestOnMount = true } = {}) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(requestOnMount);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        const messages = {
          1: 'Permiso de ubicación denegado. Actívalo en el navegador.',
          2: 'No se pudo obtener tu ubicación.',
          3: 'Tiempo de espera agotado al obtener ubicación.',
        };
        setError(messages[err.code] ?? 'Error de geolocalización.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    if (requestOnMount) requestLocation();
  }, [requestOnMount, requestLocation]);

  const fallbackCenter = position ?? LIMA_CENTER;

  return {
    position,
    fallbackCenter,
    loading,
    error,
    requestLocation,
    hasUserPosition: Boolean(position),
  };
}
