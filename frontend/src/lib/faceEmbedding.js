import * as faceapi from '@vladmandic/face-api';

const MODEL_BASE = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model';

/** Proporción mínima del rostro respecto al frame (ancho) */
const MIN_FACE_RATIO = 0.22;
/** Similitud mínima entre muestras del mismo registro */
const MIN_SAMPLE_CONSISTENCY = 0.82;
/** Número de muestras para registro robusto */
const REGISTRATION_SAMPLES = 5;

let loadPromise = null;

/** Configuración estricta: solo la primera pasada es permisiva, el resto exige confianza alta */
const DETECTOR_CONFIGS = [
  { net: 'ssd', minConfidence: 0.5 },
  { net: 'ssd', minConfidence: 0.4 },
  { net: 'tiny', inputSize: 608, threshold: 0.4 },
  { net: 'tiny', inputSize: 512, threshold: 0.35 },
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

/**
 * Similitud coseno entre dos vectores.
 */
export function cosineSimilarity(a, b) {
  if (!a?.length || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const mag = Math.sqrt(normA) * Math.sqrt(normB);
  return mag === 0 ? 0 : dot / mag;
}

/**
 * Promedia varios embeddings y normaliza el resultado (L2).
 */
export function averageEmbeddings(embeddings) {
  if (!embeddings.length) throw new Error('No hay embeddings para promediar');
  const dim = embeddings[0].length;
  const avg = new Array(dim).fill(0);

  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) avg[i] += emb[i];
  }
  for (let i = 0; i < dim; i++) avg[i] /= embeddings.length;

  const norm = Math.sqrt(avg.reduce((s, v) => s + v * v, 0));
  if (norm === 0) throw new Error('Embedding promedio inválido');
  return avg.map((v) => v / norm);
}

/**
 * Verifica que todas las muestras sean del mismo rostro.
 */
export function validateSampleConsistency(embeddings, minSimilarity = MIN_SAMPLE_CONSISTENCY) {
  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const sim = cosineSimilarity(embeddings[i], embeddings[j]);
      if (sim < minSimilarity) {
        console.warn(
          `⚠️ Muestras inconsistentes: similitud ${(sim * 100).toFixed(1)}% < ${(minSimilarity * 100).toFixed(0)}%`
        );
        return false;
      }
    }
  }
  return true;
}

async function detectAllFaces(source, config) {
  const options = getDetectorOptions(config);
  return faceapi
    .detectAllFaces(source, options)
    .withFaceLandmarks()
    .withFaceDescriptors();
}

async function detectSingleFace(source, config) {
  const options = getDetectorOptions(config);
  return faceapi
    .detectSingleFace(source, options)
    .withFaceLandmarks()
    .withFaceDescriptor();
}

/**
 * Valida un solo rostro y visibilidad completa.
 * @returns {{ valid: boolean, reason?: string, detection?: object }}
 */
export function validateFaceCapture(source, detections) {
  if (!detections?.length) {
    return { valid: false, reason: 'No se detectó ningún rostro. Centre su rostro en el marco.' };
  }

  if (detections.length > 1) {
    return {
      valid: false,
      reason: `Se detectaron ${detections.length} rostros. Solo debe haber una persona en pantalla.`,
    };
  }

  const detection = detections[0];
  const box = detection.detection.box;
  const frameW = source.width || source.videoWidth;
  const frameH = source.height || source.videoHeight;

  const faceRatio = box.width / frameW;
  if (faceRatio < MIN_FACE_RATIO) {
    return {
      valid: false,
      reason: 'El rostro no está completamente visible. Acérquese más a la cámara.',
    };
  }

  const margin = 0.04;
  if (
    box.x < frameW * margin ||
    box.y < frameH * margin ||
    box.x + box.width > frameW * (1 - margin) ||
    box.y + box.height > frameH * (1 - margin)
  ) {
    return {
      valid: false,
      reason: 'El rostro está parcialmente fuera del marco. Centre su rostro completamente.',
    };
  }

  return { valid: true, detection };
}

/**
 * Captura un embedding con validaciones estrictas.
 * @param {HTMLVideoElement} video
 * @param {number} maxRetries
 * @returns {Promise<number[]>}
 */
export async function captureFaceEmbedding(video, maxRetries = 4) {
  await loadFaceModels();

  console.log('📸 Capturando embedding facial...');
  console.log('Video ready:', video?.videoWidth, 'x', video?.videoHeight);

  if (!video?.videoWidth) {
    throw new Error('La cámara aún no está lista. Espera un momento e intenta de nuevo.');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const config = DETECTOR_CONFIGS[Math.min(attempt - 1, DETECTOR_CONFIGS.length - 1)];

    try {
      console.log(
        `🔍 Detectando rostro (intento ${attempt}/${maxRetries}, ${config.net})...`
      );

      const source = snapshotVideoFrame(video);
      const allDetections = await detectAllFaces(source, config);
      const validation = validateFaceCapture(source, allDetections);

      if (!validation.valid) {
        console.warn(`⚠️ Intento ${attempt}: ${validation.reason}`);
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 400 + attempt * 100));
          continue;
        }
        throw new Error(validation.reason);
      }

      const descriptor = Array.from(validation.detection.descriptor);
      console.log('✅ Rostro validado, descriptor length:', descriptor.length);
      return descriptor;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.error(`❌ Error en intento ${attempt}:`, err.message);
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 400 + attempt * 100));
    }
  }

  throw new Error(
    'No se detectó un rostro válido. Centre su rostro en el marco y asegúrese de que solo haya una persona visible.'
  );
}

/**
 * Captura múltiples muestras y genera un embedding robusto promediado.
 * @param {HTMLVideoElement} video
 * @param {number} sampleCount
 * @param {number} delayMs - Pausa entre muestras
 * @returns {Promise<number[]>}
 */
export async function captureRobustFaceEmbedding(
  video,
  sampleCount = REGISTRATION_SAMPLES,
  delayMs = 500
) {
  console.log(`📸 Iniciando captura robusta: ${sampleCount} muestras...`);
  const samples = [];

  for (let i = 0; i < sampleCount; i++) {
    console.log(`  Muestra ${i + 1}/${sampleCount}...`);
    const embedding = await captureFaceEmbedding(video, 3);
    samples.push(embedding);

    if (i < sampleCount - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  if (!validateSampleConsistency(samples)) {
    throw new Error(
      'Las muestras capturadas no son consistentes. Mantenga su rostro quieto e intente de nuevo.'
    );
  }

  const robust = averageEmbeddings(samples);
  console.log(`✅ Embedding robusto generado a partir de ${sampleCount} muestras`);
  return robust;
}
