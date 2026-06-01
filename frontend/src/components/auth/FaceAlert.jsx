export default function FaceAlert({ show, variant, title, message, onClose }) {
  if (!show) return null;

  return (
    <div className={`face-alert face-alert--${variant}`}>
      <div className="face-alert-icon">
        <span className="material-symbols-outlined">
          {variant === 'success' ? 'check' : 'error'}
        </span>
      </div>
      <div className="face-alert-body">
        <p className="face-alert-title">{title}</p>
        <p className="face-alert-message">{message}</p>
      </div>
      <button className="face-alert-close" onClick={onClose}>
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
