import { WASTE_FILTERS } from '../../constants/wasteFilters';
import { WASTE_COLORS } from './RecyclingMapCanvas';

export default function RecyclingMapLegend({ onClose }) {
  return (
    <div className="rm-legend">
      <div className="rm-legend-head">
        <span className="rm-legend-title">Tipos de residuo</span>
        <button type="button" className="rm-legend-close" onClick={onClose} aria-label="Cerrar">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <ul className="rm-legend-list">
        {WASTE_FILTERS.map((f) => (
          <li key={f.id} className="rm-legend-item">
            <span
              className="rm-legend-swatch"
              style={{ background: WASTE_COLORS[f.id] ?? WASTE_COLORS.default }}
            />
            <span className="material-symbols-outlined rm-legend-icon">{f.icon}</span>
            {f.label}
          </li>
        ))}
        <li className="rm-legend-item">
          <span className="rm-legend-swatch" style={{ background: '#3b82f6' }} />
          <span className="material-symbols-outlined rm-legend-icon">person_pin_circle</span>
          Tu ubicación
        </li>
      </ul>
    </div>
  );
}
