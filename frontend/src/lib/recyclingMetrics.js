/** Métricas derivadas de la lista de puntos para el HUD. */
export function getClosestPoint(puntos) {
  const withDist = puntos.filter((p) => p.distancia_km != null);
  if (!withDist.length) return null;
  return withDist.reduce((a, b) => (a.distancia_km < b.distancia_km ? a : b));
}

export function getAverageDistanceKm(puntos) {
  const withDist = puntos.filter((p) => p.distancia_km != null);
  if (!withDist.length) return null;
  const sum = withDist.reduce((acc, p) => acc + p.distancia_km, 0);
  return sum / withDist.length;
}

export function getTopWasteType(puntos) {
  const counts = {};
  puntos.forEach((p) => {
    if (!p.tipos_residuos) return;
    p.tipos_residuos.split(/[,;/]/).forEach((raw) => {
      const t = raw.trim().toLowerCase();
      if (!t) return;
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return null;
  const [key, count] = entries[0];
  return { key, count, label: key.charAt(0).toUpperCase() + key.slice(1) };
}

export function isPuntoOpen(horario) {
  if (!horario) return true;
  const h = horario.toLowerCase();
  if (h.includes('cerrado')) return false;
  if (h.includes('24')) return true;
  return true;
}

export function openDirections(lat, lng, name) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name ?? 'Punto de reciclaje')}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
