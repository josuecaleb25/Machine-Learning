import { motion } from 'framer-motion';

const RING_LABELS = {
  idle: 'Listo para escanear',
  'no-face': 'Sin rostro detectado',
  detected: 'Rostro detectado',
  centered: 'Rostro centrado',
  processing: 'Procesando reconocimiento…',
  success: 'Usuario encontrado',
  error: 'Usuario no encontrado',
};

export default function FaceCameraView({
  videoRef,
  canvasRef,
  placeholderId,
  ringState = 'idle',
  isScanning = false,
  scanLine = true,
}) {
  return (
    <div className="face-camera-wrapper">
      <motion.div
        className={`face-camera-ring face-camera-ring--${ringState}`}
        animate={
          ringState === 'centered'
            ? { scale: [1, 1.02, 1], boxShadow: ['0 0 0 0 rgba(116,198,157,0.4)', '0 0 0 12px rgba(116,198,157,0)', '0 0 0 0 rgba(116,198,157,0)'] }
            : ringState === 'processing'
              ? { rotate: 360 }
              : {}
        }
        transition={
          ringState === 'centered'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : ringState === 'processing'
              ? { duration: 8, repeat: Infinity, ease: 'linear' }
              : { duration: 0.35 }
        }
      >
        <div className="face-camera-circle">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="face-camera-mirror"
            style={{ display: 'none' }}
          />
          <canvas
            ref={canvasRef}
            className={`face-mesh-canvas face-camera-mirror${isScanning ? ' is-active' : ''}`}
          />
          <div className="face-cam-placeholder" id={placeholderId}>
            <svg className="face-cam-placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span className="face-placeholder-hint">Vista previa facial</span>
          </div>
          {scanLine && isScanning && <div className="face-scan-line" />}
        </div>
      </motion.div>

      <p className="face-ring-status-label">{RING_LABELS[ringState] ?? RING_LABELS.idle}</p>
    </div>
  );
}
