/**
 * Estilos inline solo para funcionalidad (MediaPipe overlay).
 * No modifica FaceAuthModal.css ni el diseño visual.
 */
export const MESH_CANVAS_STYLE = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 3,
  transform: 'scaleX(-1)',
  borderRadius: '50%',
};

export function getCircleFeedbackStyle(isScanning, frame) {
  if (!isScanning) return undefined;
  if (!frame.detected) {
    return { boxShadow: '0 0 0 2px rgba(220, 80, 70, 0.85), 0 20px 60px rgba(0,0,0,0.15)' };
  }
  if (frame.centered) {
    return { boxShadow: '0 0 0 2px rgba(116, 198, 157, 0.95), 0 0 24px rgba(116, 198, 157, 0.35)' };
  }
  return { boxShadow: '0 0 0 2px rgba(255, 170, 80, 0.75), 0 20px 60px rgba(0,0,0,0.15)' };
}

export function isUserNotRegisteredError(err) {
  return (
    err?.status === 403 ||
    /no está registrado|acceso denegado|no se encontró coincidencia/i.test(err?.message ?? '')
  );
}
