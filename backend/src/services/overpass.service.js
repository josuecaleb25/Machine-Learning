const OVERPASS_ENDPOINTS = [
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const USER_AGENT = 'SmartCity/1.0 (Lima recycling map; educational project)';

const LIMA_BBOX = { south: -12.5, west: -77.25, north: -11.75, east: -76.7 };

const OVERPASS_QUERY = `[out:json][timeout:55];
(
  nwr["amenity"="recycling"](${LIMA_BBOX.south},${LIMA_BBOX.west},${LIMA_BBOX.north},${LIMA_BBOX.east});
);
out center;`;

const CACHE_TTL_MS = 60 * 60 * 1000;
let cache = { expiresAt: 0, payload: null };

function parseElement(el) {
  let lat;
  let lng;

  if (el.type === 'node' && el.lat != null && el.lon != null) {
    lat = el.lat;
    lng = el.lon;
  } else if (el.center?.lat != null && el.center?.lon != null) {
    lat = el.center.lat;
    lng = el.center.lon;
  } else {
    return null;
  }

  const tags = el.tags ?? {};
  const materials = Object.entries(tags)
    .filter(([key]) => key.startsWith('recycling:'))
    .filter(([, value]) => value === 'yes' || value === 'only')
    .map(([key]) => key.replace('recycling:', '').replace(/_/g, ' '));

  return {
    id: `${el.type}/${el.id}`,
    lat,
    lng,
    name: tags.name ?? tags['name:es'] ?? 'Punto de reciclaje',
    type: tags.recycling_type ?? 'recycling',
    materials,
  };
}

function countUnderservedZones(points, gridSize = 8) {
  const { south, west, north, east } = LIMA_BBOX;
  const latStep = (north - south) / gridSize;
  const lngStep = (east - west) / gridSize;
  const counts = Array(gridSize * gridSize).fill(0);

  points.forEach((p) => {
    const row = Math.min(gridSize - 1, Math.floor((p.lat - south) / latStep));
    const col = Math.min(gridSize - 1, Math.floor((p.lng - west) / lngStep));
    counts[row * gridSize + col] += 1;
  });

  return counts.filter((c) => c === 0).length;
}

async function queryOverpass(endpoint) {
  const headers = { 'User-Agent': USER_AGENT };
  const encoded = encodeURIComponent(OVERPASS_QUERY);

  const attempts = [
    () =>
      fetch(`${endpoint}?data=${encoded}`, {
        headers,
        signal: AbortSignal.timeout(90000),
      }),
    () =>
      fetch(endpoint, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ data: OVERPASS_QUERY }).toString(),
        signal: AbortSignal.timeout(90000),
      }),
  ];

  let lastStatus;
  for (const attempt of attempts) {
    const res = await attempt();
    lastStatus = res.status;
    if (res.ok) {
      return res.json();
    }
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  throw new Error(`Overpass respondió ${lastStatus} en ${endpoint}`);
}

export async function getLimaRecyclingPoints() {
  if (cache.payload && Date.now() < cache.expiresAt) {
    return cache.payload;
  }

  let lastError;
  let json;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      json = await queryOverpass(endpoint);
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!json) {
    throw lastError ?? new Error('No se pudo consultar Overpass');
  }

  const points = (json.elements ?? [])
    .map(parseElement)
    .filter(Boolean);

  const payload = {
    points,
    total: points.length,
    criticalZones: countUnderservedZones(points),
    bbox: LIMA_BBOX,
    source: 'openstreetmap',
    attribution: '© OpenStreetMap contributors',
    fetchedAt: new Date().toISOString(),
  };

  cache = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
  return payload;
}
