import { useCallback, useEffect, useRef, useState } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as tmImage from '@teachablemachine/image';
import { usePredictions } from '../../hooks/usePredictions';
import { useNotificationContext } from '../../context/NotificationContext';

const DEMO_IMAGE = '/screen.png';

// URLs del modelo de Teachable Machine
const MODEL_URL = '/models/model.json';
const METADATA_URL = '/models/metadata.json';

// Mapa de etiquetas del modelo → categoría del backend (enum CATEGORIA_RESIDUO)
const LABEL_TO_CATEGORIA = {
  'Plástico': 'PLASTICO',
  'Cartón':   'CARTON',
  'Vidrio':   'VIDRIO',
  'Orgánico': 'ORGANICO',
};

async function openCameraStream() {
  const attempts = [
    { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
    { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
    { video: true, audio: false },
  ];

  let lastError;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error('No camera');
}

export default function WasteScanner({ onNewPrediction }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const lastSavedPrediction = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const { createPrediction } = usePredictions();
  const { success, error: showError } = useNotificationContext();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCameraOn(false);
    setIsScanning(false);
    setPrediction(null);
  }, []);

  // Cargar el modelo de Teachable Machine
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        const loadedModel = await tmImage.load(MODEL_URL, METADATA_URL);
        setModel(loadedModel);
        setIsModelLoading(false);
        success('Modelo de IA cargado correctamente', {
          title: 'Sistema listo'
        });
      } catch (error) {
        console.error('Error loading model:', error);
        setIsModelLoading(false);
        showError('Error al cargar el modelo de IA. Verifica que los archivos estén disponibles.', {
          title: 'Error del sistema'
        });
      }
    };
    loadModel();
  }, [success, showError]);

  // Función para realizar predicciones
  const predictFromVideo = useCallback(async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.readyState !== 4) return; // Video no está listo
    
    // Configurar canvas con las dimensiones del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujar el frame actual del video en el canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    try {
      const predictions = await model.predict(canvas);
      const topPrediction = predictions.reduce((max, pred) => 
        pred.probability > max.probability ? pred : max
      );
      
      if (topPrediction.probability > 0.7) {
        setPrediction((prevPrediction) => {
          const sameClass = prevPrediction?.className === topPrediction.className;
          const sameConfidence = prevPrediction && Math.abs(prevPrediction.probability - topPrediction.probability) < 0.01;
          return sameClass && sameConfidence ? prevPrediction : topPrediction;
        });

        // Guardar en backend si es diferente al último o han pasado 10s
        const now = Date.now();
        const isDifferent = lastSavedPrediction.current?.className !== topPrediction.className;
        const isOldEnough = !lastSavedPrediction.current || (now - lastSavedPrediction.current.timestamp > 10000);

        if (isDifferent || isOldEnough) {
          const categoria = LABEL_TO_CATEGORIA[topPrediction.className];
          if (!categoria) {
            console.warn('Categoría no reconocida:', topPrediction.className);
            return;
          }

          try {
            const predictionData = {
              residuoDetectado: topPrediction.className,
              categoria,
              confianza: topPrediction.probability, // backend espera 0-1
            };

            await createPrediction(predictionData);
            lastSavedPrediction.current = { ...topPrediction, timestamp: now };

            success(`${topPrediction.className} detectado`, {
              title: 'Residuo clasificado',
              duration: 3000,
            });

            if (onNewPrediction) onNewPrediction(predictionData);
          } catch (err) {
            console.error('Error saving prediction:', err);
            showError('No se pudo guardar la predicción', { title: 'Error de conexión' });
          }
        }
      } else {
        // Si la confianza baja del umbral, limpiar la predicción mostrada
        setPrediction(null);
      }
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  }, [model, createPrediction, onNewPrediction]);

  // Iniciar predicciones continuas cuando la cámara está activa
  useEffect(() => {
    if (cameraOn && model && !intervalRef.current) {
      setIsScanning(true);
      intervalRef.current = setInterval(predictFromVideo, 1000); // Predecir cada segundo
    } else if (!cameraOn && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsScanning(false);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cameraOn, model, predictFromVideo]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // Conectar el stream cuando el <video> ya está montado en el DOM
  useEffect(() => {
    if (!cameraOn) return undefined;

    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return undefined;

    video.srcObject = stream;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        /* el navegador puede exigir un segundo intento tras loadedmetadata */
      }
    };

    playVideo();
    video.addEventListener('loadedmetadata', playVideo);

    return () => {
      video.removeEventListener('loadedmetadata', playVideo);
      video.srcObject = null;
    };
  }, [cameraOn]);

  const startCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Tu navegador no soporta acceso a la cámara.');
      return;
    }

    try {
      const stream = await openCameraStream();
      streamRef.current = stream;
      setCameraOn(true);
    } catch {
      setCameraError('No se pudo abrir la cámara. Revisa los permisos del navegador.');
      stopCamera();
    }
  };

  return (
    <div className="wp-glass-card wp-scanner-card">
      <div className="wp-scanner-gradient"></div>

      <div className="wp-scanner-media">
        {cameraOn && (
          <video
            ref={videoRef}
            className="wp-scanner-video"
            playsInline
            autoPlay
            muted
          />
        )}
        {!cameraOn && (
          <img src={DEMO_IMAGE} alt="Visualización de escaneo IA de residuos" />
        )}

        <div className="wp-scanner-hud">
          <div className="wp-hud-top">
            <div className="wp-hud-pill">
              <span className="material-symbols-outlined">videocam</span>
              <span>{cameraOn ? 'CAM_FEED_01_ACTIVE' : 'CAM_FEED_01_STANDBY'}</span>
            </div>
            <div className="wp-hud-pill">
              <span>Latencia: 12ms</span>
            </div>
          </div>

          {cameraOn && <div className="wp-scan-line"></div>}

          <div className="wp-scanner-actions">
            {!cameraOn ? (
              <button type="button" className="wp-scan-btn primary" onClick={startCamera}>
                <span className="material-symbols-outlined">videocam</span>
                Activar cámara
              </button>
            ) : (
              <button type="button" className="wp-scan-btn secondary" onClick={stopCamera}>
                <span className="material-symbols-outlined">videocam_off</span>
                Detener cámara
              </button>
            )}
          </div>

          {/* HUD inferior: mostrar predicción real o demo */}
          {!cameraOn && (
            <div className="wp-hud-bottom">
              <div className="wp-target-card">
                <p className="wp-target-label">Objeto detectado</p>
                <p className="wp-target-value">PET Polietileno</p>
                <p className="wp-target-confidence">Puntuación de confianza: 99.82%</p>
              </div>
              <div className="wp-fit-card">
                <span className="material-symbols-outlined">recycling</span>
                <span>Apto</span>
              </div>
            </div>
          )}
          
          {/* Mostrar predicción en tiempo real cuando la cámara está activa */}
          {cameraOn && (
            <div className="wp-hud-bottom">
              <div className="wp-target-card">
                <p className="wp-target-label">
                  {prediction ? 'Objeto detectado' : 'Escaneando...'}
                </p>
                <p className="wp-target-value">
                  {prediction ? prediction.className : 'Buscando objetos'}
                </p>
                <p className="wp-target-confidence">
                  {prediction
                    ? `Puntuación de confianza: ${(prediction.probability * 100).toFixed(2)}%`
                    : 'Analizando imagen...'}
                </p>
              </div>
              <div className="wp-fit-card">
                <span className="material-symbols-outlined">recycling</span>
                <span>{prediction ? 'Apto' : 'Esperando'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {cameraError && <p className="wp-scanner-error">{cameraError}</p>}
      
      {isModelLoading && (
        <p className="wp-scanner-status">Cargando modelo de IA...</p>
      )}
      
      {/* Canvas oculto para procesamiento de imágenes */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
