/**
 * Clasificación de residuos desde imagen (canvas o video).
 * Modo demo: hash visual estable hasta integrar TensorFlow.js con tu modelo entrenado.
 */

export const WASTE_TYPES = {
  PLASTICO: {
    categoria: 'PLASTICO',
    nombre: 'Botella plástico (PET)',
    material: 'PET Polietileno',
    desc: 'Envase plástico transparente — reciclable',
    tag: 'Reciclable',
    apto: true,
    icon: 'shopping_bag',
    logClass: 'log-icon-secondary',
    tagClass: 'tag-primary',
  },
  ORGANICO: {
    categoria: 'ORGANICO',
    nombre: 'Restos orgánicos',
    material: 'Materia biodegradable',
    desc: 'Residuos compostables detectados',
    tag: 'Alta densidad',
    apto: true,
    icon: 'eco',
    logClass: 'log-icon-primary',
    tagClass: 'tag-secondary',
  },
  VIDRIO: {
    categoria: 'VIDRIO',
    nombre: 'Vidrio cristalino',
    material: 'Vidrio neutro',
    desc: 'Frasco o botella de vidrio — optimizado',
    tag: 'Reutilización elite',
    apto: true,
    icon: 'wine_bar',
    logClass: 'log-icon-tertiary',
    tagClass: 'tag-tertiary',
  },
  CARTON: {
    categoria: 'CARTON',
    nombre: 'Papel / cartón',
    material: 'Celulosa reciclable',
    desc: 'Papel o cartón detectado',
    tag: 'Reciclable',
    apto: true,
    icon: 'news',
    logClass: 'log-icon-neutral',
    tagClass: 'tag-primary',
  },
};

const TYPE_KEYS = Object.keys(WASTE_TYPES);

function hashImageData(imageData) {
  let h = 0;
  const step = 16;
  for (let i = 0; i < imageData.data.length; i += step * 4) {
    h = (h * 31 + imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) | 0;
  }
  return Math.abs(h);
}

function drawSourceToCanvas(source, canvas, maxSize = 224) {
  const ctx = canvas.getContext('2d');
  const w = source.videoWidth || source.naturalWidth || source.width;
  const h = source.videoHeight || source.naturalHeight || source.height;
  if (!w || !h) throw new Error('No se pudo leer la imagen');

  const scale = Math.min(maxSize / w, maxSize / h, 1);
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * @param {HTMLVideoElement | HTMLImageElement | HTMLCanvasElement} source
 * @returns {Promise<{ type: object, confianza: number, latencyMs: number, demo: boolean }>}
 */
export async function classifyWasteImage(source) {
  const start = performance.now();
  const canvas = document.createElement('canvas');
  const imageData = drawSourceToCanvas(source, canvas);
  const idx = hashImageData(imageData) % TYPE_KEYS.length;
  const type = WASTE_TYPES[TYPE_KEYS[idx]];
  const confianza = 0.88 + (hashImageData(imageData) % 120) / 1000;

  await new Promise((r) => setTimeout(r, 900));

  return {
    type,
    confianza: Math.min(0.998, Math.round(confianza * 1000) / 1000),
    latencyMs: Math.round(performance.now() - start),
    demo: true,
  };
}
