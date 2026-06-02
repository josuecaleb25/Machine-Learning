export default function RecyclingMapStatus({ type, message, children }) {
  if (!message && !children) return null;

  return (
    <div className={`rm-status rm-status--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {type === 'loading' && <span className="rm-spin" aria-hidden />}
      {type === 'error' && (
        <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
          error
        </span>
      )}
      {type === 'empty' && (
        <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
          search_off
        </span>
      )}
      <span>{message}</span>
      {children}
    </div>
  );
}
