import { formatDistance } from '../../lib/geo';

/**
 * Panel HUD derecho: telemetría + controles flotantes (diseño Mission Control).
 */
export default function RecyclingMapHud({
  total,
  closest,
  avgDistanceKm,
  topWaste,
  geoLoading,
  dataLoading,
  hasGps,
  showLegend,
  onToggleLegend,
  onMyLocation,
  onRoutes,
  onFullscreen,
  isFullscreen,
}) {
  return (
    <div className="rm-hud-right">
      <div className="rm-hud-stats">
        <div className="rm-glass-card rm-glass-card--glow">
          <div className="rm-hud-card-head">
            <div className="rm-hud-icon-wrap rm-hud-icon-wrap--primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                eco
              </span>
            </div>
            <div>
              <h3 className="rm-hud-card-title">Puntos activos</h3>
              <p className="rm-hud-card-kicker">RED EN LIMA METRO</p>
            </div>
          </div>
          <div className="rm-hud-metric-row">
            <span className="rm-hud-metric-label">Total registrados</span>
            <span className="rm-hud-metric-value">{dataLoading ? '…' : total}</span>
          </div>
          <div className="rm-hud-progress">
            <div
              className="rm-hud-progress-fill"
              style={{ width: dataLoading ? '0%' : `${Math.min(100, (total / 20) * 100)}%` }}
            />
          </div>
        </div>

        <div className="rm-glass-card">
          <div className="rm-hud-card-head">
            <div className="rm-hud-icon-wrap rm-hud-icon-wrap--tertiary">
              <span className="material-symbols-outlined">near_me</span>
            </div>
            <div>
              <h3 className="rm-hud-card-title">Más cercano</h3>
              <p className="rm-hud-card-kicker">
                {closest ? formatDistance(closest.distancia_km) : 'Activa GPS'}
              </p>
            </div>
          </div>
          <p className="rm-hud-big-value">
            {closest ? (
              <>
                {closest.nombre.length > 22 ? `${closest.nombre.slice(0, 22)}…` : closest.nombre}
              </>
            ) : (
              '—'
            )}
          </p>
          {avgDistanceKm != null && (
            <p className="rm-hud-footnote">
              Promedio {formatDistance(avgDistanceKm)} · {topWaste ? `Top: ${topWaste.label}` : 'Sin clasificar'}
            </p>
          )}
        </div>
      </div>

      <div className="rm-hud-controls">
        <div className="rm-glass-card rm-hud-status-bar">
          <div className="rm-hud-status-item">
            <span className="rm-status-dot rm-status-dot--live" />
            <span>{dataLoading ? 'Sincronizando…' : 'Datos en vivo'}</span>
          </div>
          <div className="rm-hud-status-item">
            <span className={`rm-status-dot ${hasGps ? 'rm-status-dot--gps' : 'rm-status-dot--warn'}`} />
            <span>{geoLoading ? 'GPS…' : hasGps ? 'Ubicación OK' : 'Sin GPS'}</span>
          </div>
          <div className="rm-hud-status-item">
            <span className="rm-status-dot rm-status-dot--alert" />
            <span>{total} puntos</span>
          </div>
        </div>

        <div className="rm-fab-row">
          <button
            type="button"
            className={`rm-fab-circle ${showLegend ? 'rm-fab-circle--active' : ''}`}
            onClick={onToggleLegend}
            aria-label="Leyenda de residuos"
            title="Leyenda"
          >
            <span className="material-symbols-outlined">layers</span>
          </button>
          <button
            type="button"
            className="rm-fab-circle"
            onClick={onMyLocation}
            aria-label="Mi ubicación"
            title="Mi ubicación"
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
          <button
            type="button"
            className="rm-fab-circle"
            onClick={onFullscreen}
            aria-label={isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}
            title="Pantalla completa"
          >
            <span className="material-symbols-outlined">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
          <button
            type="button"
            className="rm-fab-circle rm-fab-circle--primary"
            onClick={onRoutes}
            aria-label="Ruta al punto más cercano"
            title="Ruta"
          >
            <span className="material-symbols-outlined">directions</span>
          </button>
        </div>
      </div>
    </div>
  );
}
