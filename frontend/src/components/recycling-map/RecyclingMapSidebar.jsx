import { WASTE_FILTERS } from '../../constants/wasteFilters';
import { formatDistance } from '../../lib/geo';
import RecyclingMapStatus from './RecyclingMapStatus';
import { WASTE_META, parseTypes } from './RecyclingPointPopup';

export default function RecyclingMapSidebar({
  embedded = false,
  search, onSearchChange,
  activeFilter, onFilterChange,
  puntos, selectedId, onSelectPunto,
  geoLoading, geoError,
  dataLoading, dataError,
  onRequestLocation,
  total,
  userPosition,
  showAllPoints = false,
  onToggleShowAll,
}) {
  const showEmpty = !dataLoading && !dataError && puntos.length === 0;
  const visibleList = showAllPoints ? puntos : puntos.slice(0, 6);

  return (
    <aside className={`rm-panel ${embedded ? 'rm-panel--embedded' : ''}`}>

      {/* ── Header ── */}
      {!embedded && (
        <div className="rm-panel-header">
          <div className="rm-panel-title-row">
            <h2 className="rm-panel-title">Mapa de Reciclaje</h2>
            <span className="rm-live-badge">
              <span className="rm-live-dot" />
              En vivo
            </span>
          </div>
          <p className="rm-panel-subtitle">
            {userPosition ? 'Ubicación detectada · Precisión alta' : 'Encuentra el punto más cercano'}
          </p>
        </div>
      )}

      {/* ── Body ── */}
      <div className="rm-panel-body">

        {/* Search + filter icon */}
        <div className="rm-search-wrap">
          <span className="material-symbols-outlined rm-search-icon">search</span>
          <input
            type="search"
            className="rm-search"
            placeholder="Buscar por nombre, dirección o residuo…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar puntos de reciclaje"
          />
          <button type="button" className="rm-search-filter-btn" aria-label="Filtros">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        {/* Filter chips */}
        <div>
          <div className="rm-filters-label">
            Filtrar por tipo de residuo
            {activeFilter && (
              <button type="button" className="rm-filters-clear" onClick={() => onFilterChange('')}>
                Limpiar filtros
              </button>
            )}
          </div>
          <div className="rm-filters" role="group" aria-label="Filtrar por tipo de residuo">
            {WASTE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`rm-filter-chip ${activeFilter === f.id ? 'rm-filter-chip--active' : 'rm-filter-chip--idle'}`}
                onClick={() => onFilterChange(activeFilter === f.id ? '' : f.id)}
              >
                <span className="material-symbols-outlined">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status messages */}
        {geoLoading  && <RecyclingMapStatus type="loading" message="Obteniendo tu ubicación…" />}
        {geoError    && (
          <RecyclingMapStatus type="error" message={geoError}>
            <button type="button" className="rm-btn-ghost" onClick={onRequestLocation}>Reintentar</button>
          </RecyclingMapStatus>
        )}
        {dataLoading && <RecyclingMapStatus type="loading" message="Cargando puntos…" />}
        {dataError   && <RecyclingMapStatus type="error" message={dataError} />}
        {showEmpty   && <RecyclingMapStatus type="empty" message="Sin resultados para tu búsqueda." />}

        {/* Point list */}
        {!embedded && !dataLoading && visibleList.length > 0 && (
          <>
            <div className="rm-list-header">
              <span className="rm-list-label">Puntos cercanos</span>
              <span className="rm-list-count">{total} encontrados</span>
            </div>

            <ul className="rm-point-list">
              {visibleList.map((p) => {
                const types = parseTypes(p.tipos_residuos).slice(0, 3);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`rm-point-card ${selectedId === p.id ? 'rm-point-card--selected' : ''}`}
                      onClick={() => onSelectPunto(p)}
                    >
                      <div className="rm-point-card-row1">
                        <span className="rm-point-card-name">{p.nombre}</span>
                        {p.distancia_km != null && (
                          <span className="rm-point-card-dist">{formatDistance(p.distancia_km)}</span>
                        )}
                      </div>
                      {p.direccion && (
                        <p className="rm-point-card-addr">{p.direccion}</p>
                      )}
                      <div className="rm-point-card-row2">
                        <div className="rm-point-card-dots">
                          {types.map((t) => {
                            const m = WASTE_META[t] ?? { icon:'delete', color:'#1a9e5c' };
                            return (
                              <span key={t} className="rm-type-dot" style={{ background: m.color }}>
                                <span className="material-symbols-outlined">{m.icon}</span>
                              </span>
                            );
                          })}
                        </div>
                        <span className="rm-point-card-arrow">
                          <span className="material-symbols-outlined">chevron_right</span>
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {total > 6 && onToggleShowAll && (
              <button type="button" className="rm-see-all" onClick={onToggleShowAll}>
                {showAllPoints ? 'Mostrar menos' : 'Ver todos los puntos'}
                <span className="material-symbols-outlined">
                  {showAllPoints ? 'expand_less' : 'arrow_forward'}
                </span>
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
