import { useCallback, useEffect, useRef, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { usePuntosReciclaje } from '../../hooks/usePuntosReciclaje';
import {
  getAverageDistanceKm,
  getClosestPoint,
  getTopWasteType,
  openDirections,
} from '../../lib/recyclingMetrics';
import RecyclingDetailPanel from './RecyclingDetailPanel';
import RecyclingMapCanvas from './RecyclingMapCanvas';
import RecyclingMapHud from './RecyclingMapHud';
import RecyclingMapLegend from './RecyclingMapLegend';
import RecyclingMapSidebar from './RecyclingMapSidebar';
import './recycling-map.css';

export default function RecyclingMapModule({ embedded = false }) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [flyVersion, setFlyVersion] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showAllPoints, setShowAllPoints] = useState(false);

  const pageRef = useRef(null);
  const glowRef = useRef(null);
  const glowRafRef = useRef(0);
  const glowPendingRef = useRef({ x: 0, y: 0 });
  const initialFlyDone = useRef(false);

  const { position, loading: geoLoading, error: geoError, requestLocation, hasUserPosition } =
    useGeolocation({ requestOnMount: true });

  const { puntos, total, loading: dataLoading, error: dataError } = usePuntosReciclaje({
    q: debouncedSearch,
    tipo: activeFilter,
    lat: position?.lat,
    lng: position?.lng,
    enabled: mounted,
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const flyTo = useCallback((coords) => {
    if (!coords) return;
    setFlyTarget({ lat: coords.lat, lng: coords.lng });
    setFlyVersion((v) => v + 1);
  }, []);

  const handleMyLocation = useCallback(() => {
    if (position) {
      flyTo(position);
      return;
    }
    requestLocation();
  }, [position, requestLocation, flyTo]);

  useEffect(() => {
    if (position && !initialFlyDone.current) {
      initialFlyDone.current = true;
      flyTo(position);
    }
  }, [position, flyTo]);

  const toggleFullscreen = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  /* Actualiza el glow en DOM directo (sin setState) para no re-renderizar el mapa al mover el ratón */
  const handleMouseMove = useCallback((e) => {
    const glowEl = glowRef.current;
    const pageEl = pageRef.current;
    if (!glowEl || !pageEl) return;
    glowPendingRef.current = { x: e.clientX, y: e.clientY };
    if (glowRafRef.current) return;
    glowRafRef.current = requestAnimationFrame(() => {
      glowRafRef.current = 0;
      const rect = pageEl.getBoundingClientRect();
      const { x, y } = glowPendingRef.current;
      glowEl.style.left = `${x - rect.left}px`;
      glowEl.style.top = `${y - rect.top}px`;
    });
  }, []);

  useEffect(() => () => {
    if (glowRafRef.current) cancelAnimationFrame(glowRafRef.current);
  }, []);

  const handleSelect = useCallback((p) => setSelectedId(p.id), []);
  const handleCloseDetail = useCallback(() => setSelectedId(null), []);

  const handleRoutes = useCallback(() => {
    const closest = getClosestPoint(puntos);
    if (closest) {
      openDirections(closest.latitud, closest.longitud, closest.nombre);
      return;
    }
    if (position) {
      handleMyLocation();
    } else {
      requestLocation();
    }
  }, [puntos, position, handleMyLocation, requestLocation]);

  const selectedPunto = puntos.find((p) => p.id === selectedId) ?? null;
  const closest = getClosestPoint(puntos);
  const avgKm = getAverageDistanceKm(puntos);
  const topWaste = getTopWasteType(puntos);
  const listPuntos = showAllPoints ? puntos : puntos;

  if (embedded) {
    return (
      <div className="rm-embedded">
        <RecyclingMapSidebar
          embedded
          search={search}
          onSearchChange={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          puntos={listPuntos}
          selectedId={selectedId}
          onSelectPunto={handleSelect}
          geoLoading={geoLoading}
          geoError={geoError}
          dataLoading={dataLoading}
          dataError={dataError}
          onRequestLocation={requestLocation}
          total={total}
          userPosition={hasUserPosition ? position : null}
          showAllPoints={showAllPoints}
          onToggleShowAll={() => setShowAllPoints((v) => !v)}
        />
        <div className="rm-embedded-map">
          {mounted && (
            <RecyclingMapCanvas
              puntos={puntos}
              userPosition={hasUserPosition ? position : null}
              selectedId={selectedId}
              onSelectPunto={handleSelect}
              flyTarget={flyTarget}
              flyVersion={flyVersion}
              defaultZoom={11}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="rm-page"
      onMouseMove={handleMouseMove}
      role="region"
      aria-label="Mapa de puntos de reciclaje"
    >
      <div ref={glowRef} className="rm-page-glow" aria-hidden />

      <div className="rm-map-bg">
        {mounted && (
          <RecyclingMapCanvas
            puntos={puntos}
            userPosition={hasUserPosition ? position : null}
            selectedId={selectedId}
            onSelectPunto={handleSelect}
            flyTarget={flyTarget}
            flyVersion={flyVersion}
            defaultZoom={12}
          />
        )}
      </div>

      <div className="rm-hud">
        <RecyclingMapSidebar
          search={search}
          onSearchChange={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          puntos={listPuntos}
          selectedId={selectedId}
          onSelectPunto={handleSelect}
          geoLoading={geoLoading}
          geoError={geoError}
          dataLoading={dataLoading}
          dataError={dataError}
          onRequestLocation={requestLocation}
          total={total}
          userPosition={hasUserPosition ? position : null}
          showAllPoints={showAllPoints}
          onToggleShowAll={() => setShowAllPoints((v) => !v)}
        />

        <RecyclingMapHud
          total={total}
          closest={closest}
          avgDistanceKm={avgKm}
          topWaste={topWaste}
          geoLoading={geoLoading}
          dataLoading={dataLoading}
          hasGps={hasUserPosition}
          showLegend={showLegend}
          onToggleLegend={() => setShowLegend((v) => !v)}
          onMyLocation={handleMyLocation}
          onRoutes={handleRoutes}
          onFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />
      </div>

      {showLegend && <RecyclingMapLegend onClose={() => setShowLegend(false)} />}

      <RecyclingDetailPanel punto={selectedPunto} onClose={handleCloseDetail} />
    </div>
  );
}
