import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, HeatmapLayer, Marker, useJsApiLoader } from '@react-google-maps/api';
import { apiFetch } from '../../lib/api';
import './CollectionPointsMap.css';

const LIMA_CENTER = { lat: -12.0464, lng: -77.0428 };
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4e8e0' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f4f7f5' }] },
  ],
};

const HEATMAP_GRADIENT = [
  'rgba(0, 108, 73, 0)',
  'rgba(16, 185, 129, 0.35)',
  'rgba(0, 108, 73, 0.55)',
  'rgba(0, 76, 51, 0.85)',
  'rgba(0, 50, 35, 1)',
];

export default function CollectionPointsMap({ onStatsChange }) {
  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const [points, setPoints] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const onStatsRef = useRef(onStatsChange);
  onStatsRef.current = onStatsChange;

  const { isLoaded, loadError: mapsLoadError } = useJsApiLoader({
    id: 'ecotech-google-maps',
    googleMapsApiKey: mapsKey,
    libraries: ['visualization'],
  });

  const downloadGeoJson = useCallback((pts) => {
    const geojson = {
      type: 'FeatureCollection',
      features: pts.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: { name: p.name, type: p.type, materials: p.materials },
      })),
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'puntos-recoleccion-lima.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setDataLoading(true);
      setLoadError(null);
      try {
        const res = await apiFetch('/recoleccion/lima');
        if (cancelled) return;
        const data = res.data ?? {};
        const pts = data.points ?? [];
        setPoints(pts);
        setMeta(data);
        onStatsRef.current?.({
          total: data.total ?? 0,
          criticalZones: data.criticalZones ?? 0,
          loading: false,
          attribution: data.attribution,
          downloadGeoJson: () => downloadGeoJson(pts),
        });
      } catch (err) {
        if (cancelled) return;
        setLoadError(err.message ?? 'No se pudieron cargar los puntos');
        onStatsRef.current?.({ total: 0, criticalZones: 0, loading: false });
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [downloadGeoJson]);

  const heatmapData = useMemo(() => {
    if (!isLoaded || !window.google?.maps || points.length === 0) return [];
    return points.map(
      (p) => new window.google.maps.LatLng(p.lat, p.lng)
    );
  }, [isLoaded, points]);

  const onMapLoad = useCallback((map) => {
    if (points.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
  }, [points]);

  if (!mapsKey) {
    return (
      <div className="an-map-shell an-map-shell--placeholder">
        <span className="material-symbols-outlined an-map-placeholder-icon">map</span>
        <p className="an-map-placeholder-title">Google Maps no configurado</p>
        <p className="an-map-placeholder-text">
          Añade <code>VITE_GOOGLE_MAPS_API_KEY</code> en <code>frontend/.env</code> (Maps JavaScript API
          activada en Google Cloud).
        </p>
      </div>
    );
  }

  if (mapsLoadError) {
    return (
      <div className="an-map-shell an-map-shell--placeholder">
        <p className="an-map-placeholder-title">Error al cargar Google Maps</p>
        <p className="an-map-placeholder-text">{mapsLoadError.message}</p>
      </div>
    );
  }

  return (
    <div className="an-map-shell">
      {(dataLoading || !isLoaded) && (
        <div className="an-map-loading" aria-live="polite">
          <span className="an-map-loading-spinner" />
          <span>Cargando mapa y puntos en Lima…</span>
        </div>
      )}

      {loadError && (
        <div className="an-map-error-banner" role="alert">
          {loadError}
        </div>
      )}

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={LIMA_CENTER}
          zoom={11}
          options={MAP_OPTIONS}
          onLoad={onMapLoad}
        >
          {heatmapData.length > 0 && (
            <HeatmapLayer
              data={heatmapData}
              options={{
                radius: 22,
                opacity: 0.65,
                dissipating: true,
                gradient: HEATMAP_GRADIENT,
              }}
            />
          )}

          {points.slice(0, 80).map((p) => (
            <Marker
              key={p.id}
              position={{ lat: p.lat, lng: p.lng }}
              title={p.name}
              onClick={() => setSelected(p)}
              icon={
                selected?.id === p.id
                  ? {
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: '#006c49',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }
                  : {
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 7,
                      fillColor: '#10b981',
                      fillOpacity: 0.9,
                      strokeColor: '#ffffff',
                      strokeWeight: 1.5,
                    }
              }
            />
          ))}
        </GoogleMap>
      )}

      {selected && (
        <div className="an-map-info-card">
          <button
            type="button"
            className="an-map-info-close"
            onClick={() => setSelected(null)}
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <p className="an-map-info-title">{selected.name}</p>
          <p className="an-map-info-meta">{selected.type}</p>
          {selected.materials?.length > 0 && (
            <p className="an-map-info-materials">
              {selected.materials.slice(0, 4).join(' · ')}
            </p>
          )}
        </div>
      )}

      {meta?.attribution && (
        <p className="an-map-attribution">{meta.attribution}</p>
      )}

      <button
        type="button"
        className="an-map-download-fab"
        onClick={() => downloadGeoJson(points)}
        disabled={points.length === 0}
        title="Descargar GeoJSON"
      >
        <span className="material-symbols-outlined">download</span>
      </button>
    </div>
  );
}
