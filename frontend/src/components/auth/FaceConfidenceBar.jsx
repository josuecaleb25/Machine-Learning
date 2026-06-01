export default function FaceConfidenceBar({ visible, progress, similarity }) {
  if (!visible) return null;

  const simPct = similarity != null ? (similarity * 100).toFixed(1) : null;

  return (
    <div className="face-confidence-block">
      <div className="face-confidence-header">
        <span>Confianza biométrica</span>
        {simPct != null && <strong>{simPct}%</strong>}
      </div>
      <div className="face-confidence-track">
        <div
          className="face-confidence-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      {simPct != null && (
        <p className="face-confidence-sub">
          Similitud coseno: {simPct}%
        </p>
      )}
    </div>
  );
}
