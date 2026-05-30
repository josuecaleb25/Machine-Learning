import * as faceapi from '@vladmandic/face-api';

const MODEL_BASE = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model';

let loadPromise = null;

/** Estrategias progresivas: más tolerantes en cada reintento (útil con lentes/reflejos). */
const DETECTOR_CONFIGS = [
  { net: 'tiny', inputSize: 512, threshold: 0.35 },
  { net: 'tiny', inputSize: 512, threshold: 0.25 },
  { net: 'tiny', inputSize: 608, threshold: 0.2 },
  { net: 'ssd', minConfidence: 0.35 },
  { net: 'ssd', minConfidence: 0.25 },
  { net: 'ssd', minConfidence: 0.15 },
];

export function loadFaceModels() {
  if (!loadPromise) {
    loadPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_BASE),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_BASE),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_BASE),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_BASE),
    ]);
  }
  return loadPromise;
}

function snapshotVideoFrame(video) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(video, 0, 0);
  return canvas;
}

function getDetectorOptions(config) {
  if (config.net === 'tiny') {
    return new faceapi.TinyFaceDetectorOptions({
      inputSize: config.inputSize,
      scoreThreshold: config.threshold,
    });
  }
  return new faceapi.SsdMobilenetv1Options({ minConfidence: config.minConfidence });
}

async function detectFaceDescriptor(source, config) {
  const options = getDetectorOptions(config);
  const detection = await faceapi
    .detectSingleFace(source, options)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection;
}

/**
 * Extrae el vector facial desde un elemento <video> (frame actual).
 * @param {HTMLVideoElement} video
 * @param {number} maxRetries - Número máximo de reintentos
 * @returns {Promise<number[]>}
 */
export async function captureFaceEmbedding(video, maxRetries = 6) {
  await loadFaceModels();

  console.log('📸 Capturando embedding facial...');
  console.log('Video ready:', video?.videoWidth, 'x', video?.videoHeight);

  if (!video?.videoWidth) {
    console.error('❌ Video no está listo');
    throw new Error('La cámara aún no está lista. Espera un momento e intenta de nuevo.');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const config = DETECTOR_CONFIGS[Math.min(attempt - 1, DETECTOR_CONFIGS.length - 1)];

    try {
      console.log(
        `🔍 Detectando rostro (intento ${attempt}/${maxRetries}, ${config.net}, umbral ${config.threshold ?? config.minConfidence})...`
      );

      const source = snapshotVideoFrame(video);
      const detection = await detectFaceDescriptor(source, config);

      if (detection) {
        console.log('✅ Rostro detectado, descriptor length:', detection.descriptor.length);
        return Array.from(detection.descriptor);
      }

      console.warn(`⚠️ Intento ${attempt}: No se detectó rostro, reintentando...`);
    } catch (err) {
      console.error(`❌ Error en intento ${attempt}:`, err);
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 350 + attempt * 80));
    }
  }

  console.error('❌ No se pudo detectar rostro después de', maxRetries, 'intentos');
  throw new Error(
    'No se detectó un rostro después de varios intentos. Asegúrate de tener buena iluminación, ' +
      'centra tu rostro en el marco y, si usas lentes, inclínalos ligeramente para reducir reflejos.'
  );
}
