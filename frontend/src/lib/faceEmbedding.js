import * as faceapi from '@vladmandic/face-api';

const MODEL_BASE = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model';

let loadPromise = null;

export function loadFaceModels() {
  if (!loadPromise) {
    loadPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_BASE),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_BASE),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_BASE),
    ]);
  }
  return loadPromise;
}

/**
 * Extrae el vector facial desde un elemento <video> (frame actual).
 * @param {HTMLVideoElement} video
 * @param {number} maxRetries - Número máximo de reintentos
 * @returns {Promise<number[]>}
 */
export async function captureFaceEmbedding(video, maxRetries = 3) {
  await loadFaceModels();

  console.log('📸 Capturando embedding facial...');
  console.log('Video ready:', video?.videoWidth, 'x', video?.videoHeight);

  if (!video?.videoWidth) {
    console.error('❌ Video no está listo');
    throw new Error('La cámara aún no está lista. Espera un momento e intenta de nuevo.');
  }

  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Detectando rostro (intento ${attempt}/${maxRetries})...`);
      
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.4 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        console.log('✅ Rostro detectado, descriptor length:', detection.descriptor.length);
        return Array.from(detection.descriptor);
      }
      
      console.warn(`⚠️ Intento ${attempt}: No se detectó rostro, reintentando...`);
      lastError = new Error('No se detectó un rostro en este intento.');
      
      // Esperar un poco antes del siguiente intento
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (err) {
      console.error(`❌ Error en intento ${attempt}:`, err);
      lastError = err;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }

  console.error('❌ No se pudo detectar rostro después de', maxRetries, 'intentos');
  throw new Error(`No se detectó un rostro después de ${maxRetries} intentos. Por favor, asegúrate de tener buena iluminación y que tu rostro esté bien centrado.`);
}
