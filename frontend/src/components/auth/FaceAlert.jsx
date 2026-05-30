import { motion, AnimatePresence } from 'framer-motion';

export default function FaceAlert({ show, variant = 'error', title, message, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`face-alert face-alert--${variant}`}
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
        >
          <div className="face-alert-icon">
            {variant === 'success' ? (
              <span className="material-symbols-outlined">check_circle</span>
            ) : (
              <span className="material-symbols-outlined">person_off</span>
            )}
          </div>
          <div className="face-alert-body">
            {title && <p className="face-alert-title">{title}</p>}
            <p className="face-alert-message">{message}</p>
          </div>
          {onClose && (
            <button type="button" className="face-alert-close" onClick={onClose} aria-label="Cerrar">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
