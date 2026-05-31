import { motion } from 'framer-motion';

export default function FaceConfidenceBar({ progress, similarity, visible, label }) {
  if (!visible) return null;

  const pct = similarity != null ? Math.round(similarity * 100) : Math.round(progress);
  const fillWidth = similarity != null ? Math.min(100, pct) : Math.min(100, progress);

  return (
    <motion.div
      className="face-confidence-block"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="face-confidence-header">
        <span>{label ?? 'Confianza de reconocimiento'}</span>
        <strong>{pct}%</strong>
      </div>
      <div className="face-confidence-track">
        <motion.div
          className="face-confidence-fill"
          initial={{ width: 0 }}
          animate={{ width: `${fillWidth}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {similarity != null && (
        <p className="face-confidence-sub">
          Similitud facial: {(similarity * 100).toFixed(1)}% — umbral mínimo: 92%
        </p>
      )}
    </motion.div>
  );
}
