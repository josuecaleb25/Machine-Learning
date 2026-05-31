import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';

const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';

const NOSE_TIP_INDEX = 1;
/** Proporción mínima del rostro respecto al frame */
const MIN_FACE_SIZE_RATIO = 0.18;

let landmarkerInstance = null;
let loadPromise = null;

export function analyzeFaceLandmarks(landmarks) {
  if (!landmarks?.length) {
    return { detected: false, centered: false, singleFace: true, fullyVisible: false };
  }

  if (landmarks.length > 1) {
    return { detected: true, centered: false, singleFace: false, fullyVisible: false };
  }

  const points = landmarks[0];
  const nose = points[NOSE_TIP_INDEX];
  if (!nose) {
    return { detected: true, centered: false, singleFace: true, fullyVisible: false };
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const faceWidth = maxX - minX;
  const faceHeight = maxY - minY;

  const dist = Math.hypot(nose.x - 0.5, nose.y - 0.5);
  const centered = dist < 0.11;
  const fullyVisible =
    faceWidth >= MIN_FACE_SIZE_RATIO &&
    faceHeight >= MIN_FACE_SIZE_RATIO &&
    minX > 0.04 &&
    minY > 0.04 &&
    maxX < 0.96 &&
    maxY < 0.96;

  return {
    detected: true,
    centered,
    singleFace: true,
    fullyVisible,
    faceSize: Math.max(faceWidth, faceHeight),
  };
}

export async function loadMediaPipeFaceLandmarker() {
  if (landmarkerInstance) return landmarkerInstance;

  if (!loadPromise) {
    loadPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
      const options = {
        runningMode: 'VIDEO',
        numFaces: 2,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      };

      try {
        landmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
          ...options,
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        });
      } catch {
        landmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
          ...options,
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
        });
      }

      return landmarkerInstance;
    })();
  }

  return loadPromise;
}

/**
 * @param {HTMLVideoElement} video
 * @param {HTMLCanvasElement} canvas
 * @param {{ onFrameState?: (state: { detected: boolean, centered: boolean }) => void }} options
 */
export function startLandmarkOverlay(video, canvas, options = {}) {
  const { onFrameState } = options;
  const ctx = canvas.getContext('2d');
  let rafId = null;
  let lastVideoTime = -1;
  let faceDetected = false;
  let faceCentered = false;
  let faceSingle = true;
  let faceFullyVisible = false;
  let stopped = false;
  let lastCenteredSpeak = 0;

  const syncCanvasSize = () => {
    const w = video.videoWidth || 480;
    const h = video.videoHeight || 480;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const emitState = (detected, centered, singleFace = true, fullyVisible = false) => {
    faceDetected = detected;
    faceCentered = centered;
    faceSingle = singleFace;
    faceFullyVisible = fullyVisible;
    onFrameState?.({ detected, centered, singleFace, fullyVisible });
  };

  const drawResults = (results) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.faceLandmarks?.length) {
      emitState(false, false, true, false);
      return;
    }

    const quality = analyzeFaceLandmarks(results.faceLandmarks);
    emitState(quality.detected, quality.centered, quality.singleFace, quality.fullyVisible);

    const drawer = new DrawingUtils(ctx);
    const lineColor = quality.centered
      ? 'rgba(116, 198, 157, 0.95)'
      : 'rgba(255, 120, 100, 0.85)';

    for (const landmarks of results.faceLandmarks) {
      drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, {
        color: quality.centered ? 'rgba(116, 198, 157, 0.32)' : 'rgba(255, 140, 100, 0.22)',
        lineWidth: 0.8,
      });
      drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
        color: lineColor,
        lineWidth: 2.2,
      });
      drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, {
        color: 'rgba(183, 228, 199, 0.95)',
        lineWidth: 1.5,
      });
      drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, {
        color: 'rgba(183, 228, 199, 0.95)',
        lineWidth: 1.5,
      });
      drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, {
        color: quality.centered ? 'rgba(64, 145, 108, 0.85)' : 'rgba(255, 160, 120, 0.75)',
        lineWidth: 1.5,
      });
      drawer.drawLandmarks(landmarks, {
        radius: quality.centered ? 1.6 : 1.2,
        color: quality.centered ? 'rgba(183, 228, 199, 0.95)' : 'rgba(255, 180, 150, 0.9)',
      });
    }
  };

  const loop = async () => {
    if (stopped) return;

    if (video.readyState >= 2 && !video.paused) {
      syncCanvasSize();
      try {
        const landmarker = await loadMediaPipeFaceLandmarker();
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const results = landmarker.detectForVideo(video, performance.now());
          drawResults(results);
        }
      } catch {
        /* frame suelto */
      }
    }

    rafId = requestAnimationFrame(loop);
  };

  loadMediaPipeFaceLandmarker().then(() => {
    if (!stopped) rafId = requestAnimationFrame(loop);
  });

  return {
    stop() {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      emitState(false, false);
    },

    getState() {
      return {
        detected: faceDetected,
        centered: faceCentered,
        singleFace: faceSingle,
        fullyVisible: faceFullyVisible,
      };
    },

    waitForStableFace({ minMs = 1400, timeoutMs = 18000, onNotCentered } = {}) {
      return new Promise((resolve, reject) => {
        const started = Date.now();
        let stableSince = null;

        const tick = () => {
          if (stopped) {
            reject(new Error('Escaneo cancelado'));
            return;
          }

          if (!faceSingle) {
            stableSince = null;
            if (onNotCentered) {
              const now = Date.now();
              if (now - lastCenteredSpeak > 4000) {
                lastCenteredSpeak = now;
                onNotCentered('multiple');
              }
            }
          } else if (faceDetected && faceCentered && faceFullyVisible) {
            if (!stableSince) stableSince = Date.now();
            if (Date.now() - stableSince >= minMs) {
              resolve();
              return;
            }
          } else {
            stableSince = null;
            if (faceDetected && onNotCentered) {
              const now = Date.now();
              if (now - lastCenteredSpeak > 4000) {
                lastCenteredSpeak = now;
                if (!faceCentered) onNotCentered('center');
                else if (!faceFullyVisible) onNotCentered('visibility');
              }
            }
          }

          if (!faceDetected && Date.now() - started > 3000 && onNotCentered) {
            const now = Date.now();
            if (now - lastCenteredSpeak > 4000) {
              lastCenteredSpeak = now;
              onNotCentered('none');
            }
          }

          if (Date.now() - started > timeoutMs) {
            reject(new Error('Por favor centre su rostro dentro del marco.'));
            return;
          }

          requestAnimationFrame(tick);
        };

        tick();
      });
    },
  };
}
