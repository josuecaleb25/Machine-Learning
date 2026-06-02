import { puntoReciclajeRepository } from '../repositories/puntoReciclaje.repository.js';
import { haversineKm, mapPuntoRow } from '../utils/geo.js';

const TIPO_KEYWORDS = {
  plastico: ['plastico', 'plástico', 'pet', 'pead', 'envase'],
  vidrio: ['vidrio'],
  carton: ['carton', 'cartón', 'papel', 'papelero'],
  metal: ['metal', 'lata', 'aluminio', 'fierro'],
  organico: ['organico', 'orgánico', 'compost', 'biodegradable'],
  electronicos: ['electronico', 'electrónico', 'raee', 'e-waste', 'pilas', 'bateria'],
};

function matchesTipoFilter(tiposResiduos, tipo) {
  if (!tipo) return true;
  const keywords = TIPO_KEYWORDS[tipo.toLowerCase()];
  if (!keywords) return true;
  const text = (tiposResiduos ?? '').toLowerCase();
  return keywords.some((kw) => text.includes(kw));
}

export const puntoReciclajeService = {
  async listPuntos({ q, tipo, lat, lng, activo }) {
    const rows = await puntoReciclajeRepository.findAll({ activo });

    let puntos = rows.map(mapPuntoRow).filter((p) => matchesTipoFilter(p.tipos_residuos, tipo));

    if (q?.trim()) {
      const term = q.trim().toLowerCase();
      puntos = puntos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(term) ||
          p.direccion.toLowerCase().includes(term) ||
          p.tipos_residuos.toLowerCase().includes(term)
      );
    }

    const userLat = lat != null ? Number(lat) : null;
    const userLng = lng != null ? Number(lng) : null;
    const hasUserLocation =
      userLat != null && userLng != null && !Number.isNaN(userLat) && !Number.isNaN(userLng);

    if (hasUserLocation) {
      puntos = puntos.map((p) => ({
        ...p,
        distancia_km: haversineKm(userLat, userLng, p.latitud, p.longitud),
      }));
      puntos.sort((a, b) => a.distancia_km - b.distancia_km);
    }

    return {
      puntos,
      total: puntos.length,
      user_location: hasUserLocation ? { lat: userLat, lng: userLng } : null,
    };
  },
};
