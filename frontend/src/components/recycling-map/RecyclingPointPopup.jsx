import { formatDistance } from '../../lib/geo';
import { isPuntoOpen, openDirections } from '../../lib/recyclingMetrics';
import { WASTE_COLORS } from './RecyclingMapCanvas';

export const WASTE_META = {
  plastico: { icon: 'recycling', label: 'Plástico', color: WASTE_COLORS.plastico },
  vidrio: { icon: 'liquor', label: 'Vidrio', color: WASTE_COLORS.vidrio },
  carton: { icon: 'inventory_2', label: 'Cartón', color: WASTE_COLORS.carton },
  metal: { icon: 'precision_manufacturing', label: 'Metal', color: WASTE_COLORS.metal },
  organico: { icon: 'compost', label: 'Orgánico', color: WASTE_COLORS.organico },
  electronicos: { icon: 'devices', label: 'Electrónicos', color: WASTE_COLORS.electronicos },
};

export function parseTypes(tipos) {
  if (!tipos) return [];
  return tipos.split(/[,;/]/).map((t) => t.trim().toLowerCase()).filter(Boolean);
}

export default function RecyclingPointPopup({ punto }) {
  const types = parseTypes(punto.tipos_residuos);
  const isOpen = isPuntoOpen(punto.horario);

  return (
    <div className="rm-popup-inner">
      <div className="rm-popup-head">
        <p className="rm-popup-name">{punto.nombre}</p>
        <span className={`rm-popup-status ${isOpen ? 'rm-popup-status--open' : 'rm-popup-status--closed'}`}>
          <span className="rm-popup-status-dot" aria-hidden />
          {isOpen ? 'Abierto' : 'Cerrado'}
        </span>
      </div>

      {punto.direccion && (
        <p className="rm-popup-line">
          <span className="material-symbols-outlined rm-popup-line-icon">location_on</span>
          {punto.direccion}
        </p>
      )}

      {punto.horario && (
        <p className="rm-popup-line">
          <span className="material-symbols-outlined rm-popup-line-icon">schedule</span>
          {punto.horario}
        </p>
      )}

      {types.length > 0 && (
        <div className="rm-popup-chips">
          {types.slice(0, 5).map((t) => {
            const m = WASTE_META[t] ?? { label: t, color: '#10b981', icon: 'delete' };
            return (
              <span key={t} className="rm-popup-chip" style={{ background: m.color }}>
                <span className="material-symbols-outlined">{m.icon}</span>
                {m.label}
              </span>
            );
          })}
        </div>
      )}

      {punto.distancia_km != null && (
        <p className="rm-popup-distance">
          <span className="material-symbols-outlined">near_me</span>
          {formatDistance(punto.distancia_km)} desde tu ubicación
        </p>
      )}

      <button
        type="button"
        className="rm-popup-cta"
        onClick={() => openDirections(punto.latitud, punto.longitud, punto.nombre)}
      >
        <span className="material-symbols-outlined">directions</span>
        Cómo llegar
      </button>
    </div>
  );
}
