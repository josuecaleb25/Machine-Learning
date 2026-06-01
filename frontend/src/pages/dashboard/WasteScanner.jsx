import { useCallback, useEffect, useRef, useState } from 'react';

const DEMO_IMAGE = '/screen.png';

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

export default function WasteScanner() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

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
        </div>
      </div>

      {cameraError && <p className="wp-scanner-error">{cameraError}</p>}
    </div>
  );
}
