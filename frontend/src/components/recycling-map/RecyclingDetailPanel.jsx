import RecyclingPointPopup from './RecyclingPointPopup';

/** Tarjeta flotante sobre el mapa al seleccionar un punto (desktop). */
export default function RecyclingDetailPanel({ punto, onClose }) {
  if (!punto) return null;

  return (
    <div className="rm-detail-float">
      <button type="button" className="rm-detail-close" onClick={onClose} aria-label="Cerrar detalle">
        <span className="material-symbols-outlined">close</span>
      </button>
      <RecyclingPointPopup punto={punto} />
    </div>
  );
}
