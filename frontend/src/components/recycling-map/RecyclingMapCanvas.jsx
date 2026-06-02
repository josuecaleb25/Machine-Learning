import { memo, useEffect, useMemo, useRef } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useTheme } from '../../context/ThemeContext';
import RecyclingPointPopup from './RecyclingPointPopup';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LIMA_CENTER } from '../../lib/geo';

/* ── Color por tipo de residuo ── */
export const WASTE_COLORS = {
  plastico:     '#3b82f6',
  vidrio:       '#06b6d4',
  carton:       '#f59e0b',
  metal:        '#6366f1',
  organico:     '#22c55e',
  electronicos: '#ef4444',
  default:      '#1a9e5c',
};

function getMarkerColor(tipos) {
  if (!tipos) return WASTE_COLORS.default;
  const first = tipos.split(/[,;/]/)[0]?.trim().toLowerCase();
  return WASTE_COLORS[first] ?? WASTE_COLORS.default;
}

const iconCache = new Map();

function createRecyclingIcon(color, size = 30, active = false) {
  const key = `${color}-${size}-${active}`;
  if (iconCache.has(key)) return iconCache.get(key);

  const s = active ? size + 8 : size;
  const pulse = active
    ? `<circle cx="${s/2}" cy="${s/2}" r="${s/2-1}" fill="none" stroke="${color}" stroke-width="2.5" opacity="0.3"/>`
    : '';
  const icon = L.divIcon({
    className: 'rm-marker-icon',
    html: `<div style="width:${s}px;height:${s}px;filter:drop-shadow(0 ${active?4:2}px ${active?12:6}px ${color}88)">
      <svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
        ${pulse}
        <circle cx="${s/2}" cy="${s/2}" r="${s/2-(active?6:4)}"
          fill="${color}" stroke="white" stroke-width="${active?3:2.5}"/>
        <text x="${s/2}" y="${s/2+4}" text-anchor="middle"
          font-size="${active?13:10}" fill="white"
          font-family="sans-serif" font-weight="bold">♻</text>
      </svg>
    </div>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    popupAnchor: [0, -(s / 2 + 4)],
  });
  iconCache.set(key, icon);
  return icon;
}

const userIcon = L.divIcon({
  className: 'rm-marker-icon',
  html: `<div style="width:36px;height:36px;position:relative;">
    <div style="position:absolute;inset:7px;border-radius:50%;
      background:#3b82f6;border:2.5px solid white;
      box-shadow:0 2px 10px rgba(59,130,246,0.5);"></div>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -22],
});

const RecyclingMarker = memo(function RecyclingMarker({ punto, active, onSelect }) {
  const icon = useMemo(
    () => createRecyclingIcon(getMarkerColor(punto.tipos_residuos), 30, active),
    [punto.tipos_residuos, active],
  );

  return (
    <Marker
      position={[punto.latitud, punto.longitud]}
      icon={icon}
      eventHandlers={{ click: () => onSelect?.(punto) }}
    >
      <Popup className="rm-popup" closeButton>
        <RecyclingPointPopup punto={punto} />
      </Popup>
    </Marker>
  );
});

function MapController({ center, zoom, flyVersion, selectedId, puntos }) {
  const map = useMap();
  const puntosRef = useRef(puntos);
  puntosRef.current = puntos;

  useEffect(() => {
    if (center?.lat != null && center?.lng != null) {
      map.flyTo([center.lat, center.lng], zoom ?? 14, { duration: 0.9, easeLinearity: 0.25 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.lat, center?.lng, zoom, flyVersion]);

  useEffect(() => {
    if (!selectedId) return;
    const p = puntosRef.current.find((x) => x.id === selectedId);
    if (p) map.flyTo([p.latitud, p.longitud], 15, { duration: 0.7, easeLinearity: 0.25 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return null;
}

function ZoomControl() {
  const map = useMap();
  useEffect(() => {
    const ctrl = L.control.zoom({ position: 'bottomright' });
    ctrl.addTo(map);
    return () => ctrl.remove();
  }, [map]);
  return null;
}

const TILE_LIGHT =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const TILE_DARK =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function RecyclingMapCanvas({
  puntos, userPosition, selectedId, onSelectPunto,
  flyTarget, flyVersion = 0, defaultZoom = 12,
}) {
  const { dark } = useTheme();
  const center = userPosition ?? LIMA_CENTER;
  const tileUrl = dark ? TILE_DARK : TILE_LIGHT;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={defaultZoom}
      className="rm-leaflet-map"
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom
      zoomControl={false}
      preferCanvas
    >
      <TileLayer
        key={dark ? 'dark' : 'light'}
        attribution={TILE_ATTR}
        url={tileUrl}
        updateWhenZooming={false}
        updateWhenIdle
        keepBuffer={4}
      />
      <ZoomControl />
      <MapController
        center={flyTarget}
        flyVersion={flyVersion}
        zoom={flyTarget ? 14 : undefined}
        selectedId={selectedId}
        puntos={puntos}
      />

      {userPosition && (
        <>
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon} />
          <Circle
            center={[userPosition.lat, userPosition.lng]}
            radius={userPosition.accuracy ?? 80}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.07,
              weight: 1.5,
              dashArray: '4 4',
            }}
          />
        </>
      )}

      {puntos.map((p) => (
        <RecyclingMarker
          key={p.id}
          punto={p}
          active={p.id === selectedId}
          onSelect={onSelectPunto}
        />
      ))}
    </MapContainer>
  );
}

export default memo(RecyclingMapCanvas);
