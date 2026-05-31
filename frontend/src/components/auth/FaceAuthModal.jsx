import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { loginFace, registerFace } from '../../lib/auth.js';
import { captureFaceEmbedding, captureRobustFaceEmbedding } from '../../lib/faceEmbedding.js';
import { startLandmarkOverlay } from '../../lib/faceLandmarksMediaPipe.js';
import { loadAllFaceModels } from '../../lib/loadFaceModels.js';
import {
  speakLoginStarting,
  speakLoginScanning,
  speakLoginSuccess,
  speakLoginNotFound,
  speakLoginError,
  speakRegisterStarting,
  speakRegisterScanning,
  speakRegisterProcessing,
  speakRegisterSuccess,
  speakRegisterAlreadyExists,
  speakCameraActivating,
  speakCameraError,
  speakFaceNotCentered,
} from '../../lib/speech.js';
import FaceAlert from './FaceAlert.jsx';
import FaceConfidenceBar from './FaceConfidenceBar.jsx';
import './FaceAuthModal.css';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isUserNotRegisteredError(err) {
  return (
    err?.status === 403 ||
    err?.status === 404 ||
    /no está registrado|rostro no registrado|acceso denegado|no se encontró coincidencia|not found|not registered|no match/i.test(err?.message ?? '')
  );
}

function isUserAlreadyRegisteredError(err) {
  return (
    err?.status === 409 ||
    /rostro ya está registrado|ya está registrado|duplicado|already registered|duplicate/i.test(err?.message ?? '')
  );
}

export default function FaceAuthModal({ isOpen, onClose }) {
  const { loginWithSession } = useAuth();

  const [currentPanel, setCurrentPanel] = useState('login');
  const [loginState, setLoginState] = useState('idle');
  const [regState, setRegState] = useState('idle');

  const [regName, setRegName] = useState('');

  const [modelsReady, setModelsReady] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', success: false });

  const [loginFrame, setLoginFrame] = useState({ detected: false, centered: false });
  const [regFrame, setRegFrame] = useState({ detected: false, centered: false });
  const [loginProgress, setLoginProgress] = useState(0);
  const [similarity, setSimilarity] = useState(null);

  const [faceAlert, setFaceAlert] = useState({
    show: false,
    variant: 'error',
    title: '',
    message: '',
  });

  const loginVideoRef = useRef(null);
  const regVideoRef = useRef(null);
  const loginCanvasRef = useRef(null);
  const regCanvasRef = useRef(null);
  const loginStreamRef = useRef(null);
  const regStreamRef = useRef(null);
  const loginOverlayRef = useRef(null);
  const regOverlayRef = useRef(null);

  // Particle canvas
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    loadAllFaceModels()
      .then(() => {
        setModelsReady(true);
      })
      .catch(() => showToast('No se pudieron cargar los modelos faciales', false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) resetModal();
  }, [isOpen]);

  // Progress bar animation for login
  useEffect(() => {
    if (loginState !== 'scanning' && loginState !== 'processing') return;
    const id = setInterval(() => {
      setLoginProgress((p) => {
        const cap =
          loginState === 'processing' ? 92 : loginFrame.centered ? 58 : loginFrame.detected ? 38 : 18;
        return Math.min(cap, p + 1.5);
      });
    }, 70);
    return () => clearInterval(id);
  }, [loginState, loginFrame]);

  // Particle animation
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 150,
        green: Math.floor(Math.random() * 80 + 120),
      };
    }

    for (let i = 0; i < 60; i++) particles.push(createParticle());

    function animParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        p.life++;
        const t = p.life / p.maxLife;
        const fadeAlpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45,${p.green},79,${p.alpha * fadeAlpha * 0.6})`;
        ctx.fill();
        if (p.life >= p.maxLife) particles[i] = createParticle();
      });
      animationId = requestAnimationFrame(animParticles);
    }
    animParticles();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isOpen]);

  const resetModal = () => {
    stopStream('login');
    stopStream('register');
    setCurrentPanel('login');
    setLoginState('idle');
    setRegState('idle');
    setRegName('');
    setLoginProgress(0);
    setSimilarity(null);
    setLoginFrame({ detected: false, centered: false });
    setRegFrame({ detected: false, centered: false });
    setFaceAlert({ show: false, variant: 'error', title: '', message: '' });
  };

  const showToast = (message, success = false) => {
    setToast({ show: true, message, success });
    setTimeout(() => setToast({ show: false, message: '', success: false }), 3200);
  };

  const showFaceAlert = (variant, title, message) => {
    setFaceAlert({ show: true, variant, title, message });
  };

  const finishAuth = (data) => {
    loginWithSession(data.token, data.user);
    setTimeout(() => onClose(), 1800);
  };

  const startCamera = async (videoRef, placeholderId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 640 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = 'block';
        videoRef.current.classList.add('active');
        const ph = document.getElementById(placeholderId);
        if (ph) ph.style.display = 'none';
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => resolve();
        });
        await videoRef.current.play();
      }
      return stream;
    } catch {
      speakCameraError();
      showToast('No se pudo acceder a la cámara.', false);
      return null;
    }
  };

  const stopLandmarkOverlay = (panel) => {
    if (panel === 'login' && loginOverlayRef.current) {
      loginOverlayRef.current.stop();
      loginOverlayRef.current = null;
    }
    if (panel === 'register' && regOverlayRef.current) {
      regOverlayRef.current.stop();
      regOverlayRef.current = null;
    }
  };

  const stopStream = useCallback((panel) => {
    stopLandmarkOverlay(panel);
    if (panel === 'login' && loginStreamRef.current) {
      loginStreamRef.current.getTracks().forEach((t) => t.stop());
      loginStreamRef.current = null;
      if (loginVideoRef.current) {
        loginVideoRef.current.style.display = 'none';
        loginVideoRef.current.classList.remove('active');
        const placeholder = document.getElementById('login-placeholder');
        if (placeholder) placeholder.style.display = 'flex';
      }
      setLoginFrame({ detected: false, centered: false });
    }
    if (panel === 'register' && regStreamRef.current) {
      regStreamRef.current.getTracks().forEach((t) => t.stop());
      regStreamRef.current = null;
      if (regVideoRef.current) {
        regVideoRef.current.style.display = 'none';
        regVideoRef.current.classList.remove('active');
        const placeholder = document.getElementById('reg-placeholder');
        if (placeholder) placeholder.style.display = 'flex';
      }
      setRegFrame({ detected: false, centered: false });
    }
  }, []);

  const startFaceLogin = async () => {
    if (loginState !== 'idle') return;
    if (!modelsReady) {
      showToast('Cargando modelos de reconocimiento…', false);
      return;
    }

    setFaceAlert((a) => ({ ...a, show: false }));
    setLoginProgress(0);
    setSimilarity(null);
    setLoginState('scanning');
    speakLoginStarting();

    speakCameraActivating();
    const stream = await startCamera(loginVideoRef, 'login-placeholder');
    if (!stream) {
      setLoginState('idle');
      return;
    }
    loginStreamRef.current = stream;

    let overlay = null;
    try {
      overlay = startLandmarkOverlay(loginVideoRef.current, loginCanvasRef.current, {
        onFrameState: setLoginFrame,
      });
      loginOverlayRef.current = overlay;

      speakLoginScanning();
      await overlay.waitForStableFace({
        onNotCentered: speakFaceNotCentered,
      });

      overlay.stop();
      loginOverlayRef.current = null;

      setLoginState('processing');
      setLoginProgress(72);

      await new Promise((r) => setTimeout(r, 150));
      const facialEmbedding = await captureFaceEmbedding(loginVideoRef.current);
      setLoginProgress(85);

      const data = await loginFace({ facialEmbedding });
      const sim = data.similarity ?? null;
      const simPct = sim != null ? (sim * 100).toFixed(1) : 'N/A';
      console.log(`🔐 Similitud facial obtenida: ${simPct}%`);
      console.log(`🔐 Usuario detectado: ${data.user?.nombre ?? '—'}`);
      console.log(`🔐 Resultado: ACCESO CONCEDIDO (${simPct}% ≥ umbral)`);

      setSimilarity(sim);
      setLoginProgress(100);
      setLoginState('success');

      const nombre = data.user?.nombre ?? 'Usuario';
      showFaceAlert('success', `Bienvenido, ${nombre}`, `Identidad verificada correctamente.`);
      speakLoginSuccess(nombre);

      stopStream('login');

      setTimeout(() => finishAuth(data), 2400);
    } catch (err) {
      stopStream('login');
      setLoginProgress(0);
      setSimilarity(null);

      if (isUserNotRegisteredError(err)) {
        console.log('🔐 Resultado: ACCESO DENEGADO — rostro no registrado o similitud insuficiente');
        setLoginState('not-found');
        showFaceAlert(
          'error',
          'Acceso denegado',
          'Rostro no registrado en el sistema.'
        );
        speakLoginNotFound();
        setTimeout(() => {
          setLoginState('idle');
          setFaceAlert((a) => ({ ...a, show: false }));
        }, 5000);
        return;
      }

      if (/centre su rostro/i.test(err?.message ?? '')) {
        speakFaceNotCentered();
        setLoginState('idle');
        // No mostrar toast, solo la voz
        return;
      }

      // Otros errores
      speakLoginError();
      setLoginState('idle');
      
      // Mostrar toast solo si hay un error real
      if (err?.message && !err?.message.includes('cancelado')) {
        showToast(err.message, false);
      }
    }
  };

  const startFaceRegister = async () => {
    if (!regName.trim()) {
      showToast('Por favor ingresa tu nombre completo', false);
      return;
    }
    if (regState !== 'idle' && regState !== 'already-exists') return;
    if (!modelsReady) {
      showToast('Cargando modelos de reconocimiento…', false);
      return;
    }

    setRegState('scanning');
    setFaceAlert((a) => ({ ...a, show: false }));
    speakRegisterStarting();

    speakCameraActivating();
    const stream = await startCamera(regVideoRef, 'reg-placeholder');
    if (!stream) {
      setRegState('idle');
      return;
    }
    regStreamRef.current = stream;

    let overlay = null;
    try {
      overlay = startLandmarkOverlay(regVideoRef.current, regCanvasRef.current, {
        onFrameState: setRegFrame,
      });
      regOverlayRef.current = overlay;

      speakRegisterScanning();
      await overlay.waitForStableFace({
        onNotCentered: speakFaceNotCentered,
      });

      overlay.stop();
      regOverlayRef.current = null;

      setRegState('capturing');
      speakRegisterProcessing();

      await new Promise((r) => setTimeout(r, 150));
      const facialEmbedding = await captureRobustFaceEmbedding(regVideoRef.current);
      
      if (!facialEmbedding || facialEmbedding.length === 0) {
        throw new Error('No se pudo capturar el embedding facial. Por favor intente de nuevo.');
      }

      stopStream('register');

      await registerFace({
        nombre: regName.trim(),
        facialEmbedding,
      });

      setRegState('success');
      showFaceAlert(
        'success',
        '¡Registro exitoso!',
        `${regName}, tu rostro ha sido registrado correctamente. Ahora puedes iniciar sesión.`
      );
      speakRegisterSuccess();

      setTimeout(() => {
        setRegState('idle');
        setRegName('');
        setFaceAlert((a) => ({ ...a, show: false }));
        setCurrentPanel('login');
      }, 4000);
    } catch (err) {
      console.error('Error en registro facial:', err);
      stopStream('register');
      setRegState('idle');
      
      // Verificar si el rostro ya está registrado
      if (isUserAlreadyRegisteredError(err)) {
        setRegState('already-exists');
        showFaceAlert(
          'error',
          'Rostro ya registrado',
          'Este rostro ya está registrado en nuestro sistema. Por favor inicie sesión en lugar de registrarse nuevamente.'
        );
        speakRegisterAlreadyExists();
        setTimeout(() => {
          setRegState('idle');
          setFaceAlert((a) => ({ ...a, show: false }));
        }, 5000);
        return;
      }
      
      // Error de rostro no centrado
      if (/centre su rostro/i.test(err?.message ?? '')) {
        speakFaceNotCentered();
        showToast('Por favor centre su rostro dentro del marco', false);
        return;
      }
      
      // Error de detección de rostro
      if (/no se detectó|no se pudo capturar/i.test(err?.message ?? '')) {
        showToast(err.message, false);
        return;
      }
      
      // Mostrar toast solo si hay un error real (no cuando se cancela)
      if (err?.message && !err?.message.includes('cancelado')) {
        showToast(err.message, false);
      }
    }
  };

  const goToRegister = () => {
    setCurrentPanel('register');
    stopStream('login');
    stopStream('register');
    setFaceAlert((a) => ({ ...a, show: false }));
  };

  const goToLogin = () => {
    setCurrentPanel('login');
    stopStream('login');
    stopStream('register');
    setFaceAlert((a) => ({ ...a, show: false }));
  };

  if (!isOpen) return null;

  const getLoginStatusText = () => {
    if (!modelsReady) return 'Inicializando IA…';
    if (loginState === 'idle') return 'Cámara lista';
    if (loginState === 'scanning') return 'Analizando rostro';
    if (loginState === 'processing') return 'Verificando identidad';
    if (loginState === 'success') return 'Acceso concedido';
    if (loginState === 'not-found') return 'Usuario no encontrado';
    return 'Cámara lista';
  };

  const getLoginCamText = () => {
    if (loginState === 'scanning') return 'Escaneando rostro…';
    if (loginState === 'processing') return 'Verificando identidad…';
    if (loginState === 'success') return 'Bienvenido de vuelta ✦';
    return 'Escaneando rostro…';
  };

  const getRegStatusText = () => {
    if (regState === 'idle') return 'Listo para escanear';
    if (regState === 'scanning') return 'Capturando muestra';
    if (regState === 'capturing') return 'Generando perfil facial';
    if (regState === 'success') return 'Face ID guardado';
    return 'Listo para escanear';
  };

  const getRegCamText = () => {
    if (regState === 'scanning') return 'Capturando…';
    if (regState === 'capturing') return 'Procesando 5 muestras…';
    if (regState === 'success') return 'Registro completado ✦';
    return 'Listo para capturar…';
  };

  // Determinar el estado del borde del círculo
  const getLoginCircleState = () => {
    if (loginState === 'success') return 'success';
    if (loginState === 'not-found') return 'error';
    if (loginState === 'scanning' || loginState === 'processing') {
      if (loginFrame.centered) return 'centered';
      if (loginFrame.detected) return 'detected';
      return 'no-face';
    }
    return 'idle';
  };

  const getRegCircleState = () => {
    if (regState === 'success') return 'success';
    if (regState === 'already-exists') return 'error';
    if (regState === 'scanning') {
      if (regFrame.centered) return 'centered';
      if (regFrame.detected) return 'detected';
      return 'no-face';
    }
    return 'idle';
  };

  return (
    <div className="face-auth-overlay">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="face-blob face-blob-1" />
      <div className="face-blob face-blob-2" />
      <div className="face-blob face-blob-3" />

      <div className="face-stage">
        <div className="face-card">
          <button type="button" onClick={onClose} className="face-close-btn">
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Logo */}
          <div className="face-logo">
            <div className="face-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 0 20" />
                <path d="M12 2C6.5 2 3 6 3 12c0 3 1.5 5.5 4 7" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="face-logo-text">
              Eco<span>Face</span>
            </span>
          </div>

          <FaceAlert
            show={faceAlert.show}
            variant={faceAlert.variant}
            title={faceAlert.title}
            message={faceAlert.message}
            onClose={() => setFaceAlert((a) => ({ ...a, show: false }))}
          />

          {/* Panels container */}
          <div className="face-panels">
            {/* LOGIN PANEL */}
            <div className={`face-panel ${currentPanel === 'login' ? 'active' : 'hidden-left'}`} id="login-panel">
              <div className="face-steps">
                <div className={`face-step-dot ${currentPanel === 'login' ? 'active' : ''}`} />
                <div className={`face-step-dot ${currentPanel === 'register' ? 'active' : ''}`} />
              </div>

              <h1 className="face-panel-title">Bienvenido</h1>
              <p className="face-panel-subtitle">Autentícate con tu rostro para continuar</p>

              <div className="face-status-row">
                <div className="face-status-pill">
                  <div className={`face-status-dot face-status-dot--${getLoginCircleState()}`} />
                  <span>{getLoginStatusText()}</span>
                </div>
              </div>

              {/* Camera */}
              <div className={`face-camera-wrapper face-camera-wrapper--${getLoginCircleState()} ${loginState === 'scanning' || loginState === 'processing' ? 'scanning' : ''}`}>
                <div className="face-camera-circle">
                  <video
                    ref={loginVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="face-camera-video"
                  />
                  <canvas
                    ref={loginCanvasRef}
                    className="face-camera-canvas"
                  />
                  <div className="face-camera-placeholder" id="login-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>

                  {/* Scan line inside */}
                  <div className="face-scan-line" />

                  {/* Face mapping points */}
                  <div className="face-scan-face-points">
                    <div className="face-point" style={{ top: '32%', left: '36%' }} />
                    <div className="face-point" style={{ top: '32%', left: '64%', animationDelay: '.3s' }} />
                    <div className="face-point" style={{ top: '45%', left: '30%', animationDelay: '.7s' }} />
                    <div className="face-point" style={{ top: '45%', left: '70%', animationDelay: '.5s' }} />
                    <div className="face-point" style={{ top: '55%', left: '50%', animationDelay: '.2s' }} />
                    <div className="face-point" style={{ top: '65%', left: '38%', animationDelay: '.9s' }} />
                    <div className="face-point" style={{ top: '65%', left: '62%', animationDelay: '.4s' }} />
                    <div className="face-point" style={{ top: '40%', left: '50%', animationDelay: '.6s' }} />
                  </div>
                </div>

                {/* Outer ring */}
                <div className="face-scan-overlay">
                  <div className="face-scan-ring" />
                  <div className="face-scan-dots">
                    <div className="face-scan-dot" />
                    <div className="face-scan-dot" />
                    <div className="face-scan-dot" />
                  </div>
                </div>

                {/* Corner brackets */}
                <div className="face-cam-corners">
                  <div className="face-cam-corner" />
                  <div className="face-cam-corner" />
                  <div className="face-cam-corner" />
                  <div className="face-cam-corner" />
                </div>
              </div>

              <p className="face-cam-status-text">{getLoginCamText()}</p>

              {/* Confidence Bar */}
              <FaceConfidenceBar
                visible={
                  loginState === 'scanning' ||
                  loginState === 'processing' ||
                  loginState === 'success'
                }
                progress={loginProgress}
                similarity={similarity}
              />

              <p className="face-cam-label">
                Coloca tu rostro dentro del círculo
                <br />y mantén una expresión natural
              </p>

              <button
                className="face-btn-primary"
                onClick={startFaceLogin}
                disabled={loginState !== 'idle' && loginState !== 'not-found'}
              >
                {loginState === 'idle' && 'Iniciar reconocimiento facial'}
                {loginState === 'scanning' && 'Escaneando…'}
                {loginState === 'processing' && 'Verificando identidad…'}
                {loginState === 'success' && '✓ Identidad verificada'}
                {loginState === 'not-found' && 'Intentar de nuevo'}
              </button>

              <div className="face-divider">
                <div className="face-divider-line" />
                <span className="face-divider-text">o también</span>
                <div className="face-divider-line" />
              </div>

              <button
                className="face-btn-ghost"
                onClick={() => showToast('Acceso manual no disponible en esta demo', false)}
              >
                Acceso con contraseña
              </button>

              <div className="face-switch-row">
                <span>¿Primera vez aquí?</span>
                <button className="face-switch-link" onClick={goToRegister}>
                  Crear cuenta →
                </button>
              </div>

              <div className="face-eco-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22C6.5 17 2 13 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-4.5 9-10 14z" />
                </svg>
                Autenticación 100% local · Sin datos en la nube
              </div>
            </div>

            {/* REGISTER PANEL */}
            <div className={`face-panel ${currentPanel === 'register' ? 'active' : 'hidden-right'}`} id="register-panel">
              <div className="face-steps">
                <div className={`face-step-dot ${currentPanel === 'login' ? 'active' : ''}`} />
                <div className={`face-step-dot ${currentPanel === 'register' ? 'active' : ''}`} />
              </div>

              <h1 className="face-panel-title">Crear cuenta</h1>
              <p className="face-panel-subtitle">Registra tu identidad facial en segundos</p>

              <div className="face-field-group">
                <label className="face-field-label" htmlFor="reg-name">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="reg-name"
                  className="face-field-input"
                  placeholder="Ej. Josué Ramírez"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  disabled={regState === 'scanning'}
                />
              </div>

              <div className="face-status-row">
                <div className="face-status-pill">
                  <div className={`face-status-dot face-status-dot--${getRegCircleState()}`} />
                  <span>{getRegStatusText()}</span>
                </div>
              </div>

              {/* Camera - MISMO TAMAÑO QUE LOGIN */}
              <div className={`face-camera-wrapper face-camera-wrapper--${getRegCircleState()} ${regState === 'scanning' ? 'scanning' : ''}`}>
                <div className="face-camera-circle">
                  <video
                    ref={regVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="face-camera-video"
                  />
                  <canvas
                    ref={regCanvasRef}
                    className="face-camera-canvas"
                  />
                  <div className="face-camera-placeholder" id="reg-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>

                  <div className="face-scan-line" />

                  <div className="face-scan-face-points">
                    <div className="face-point" style={{ top: '30%', left: '38%', animationDelay: '.1s' }} />
                    <div className="face-point" style={{ top: '30%', left: '62%', animationDelay: '.4s' }} />
                    <div className="face-point" style={{ top: '48%', left: '50%', animationDelay: '.8s' }} />
                    <div className="face-point" style={{ top: '62%', left: '40%', animationDelay: '.2s' }} />
                    <div className="face-point" style={{ top: '62%', left: '60%', animationDelay: '.6s' }} />
                  </div>
                </div>

                <div className="face-scan-overlay">
                  <div className="face-scan-ring" />
                  <div className="face-scan-dots">
                    <div className="face-scan-dot" />
                    <div className="face-scan-dot" />
                    <div className="face-scan-dot" />
                  </div>
                </div>

                <div className="face-cam-corners">
                  <div className="face-cam-corner" />
                  <div className="face-cam-corner" />
                  <div className="face-cam-corner" />
                  <div className="face-cam-corner" />
                </div>
              </div>

              <p className="face-cam-status-text">{getRegCamText()}</p>
              <p className="face-cam-label" style={{ marginBottom: '20px' }}>
                Asegúrate de tener buena iluminación
                <br />y mira directamente a la cámara
              </p>

              <button
                className="face-btn-primary"
                onClick={startFaceRegister}
                disabled={regState === 'scanning' || regState === 'capturing' || regState === 'success' || regState === 'already-exists'}
              >
                {regState === 'idle' && 'Registrar Face ID'}
                {regState === 'scanning' && 'Capturando…'}
                {regState === 'capturing' && 'Procesando muestras…'}
                {regState === 'success' && `✓ ${regName} registrado`}
                {regState === 'already-exists' && 'Rostro ya registrado'}
              </button>

              <div className="face-switch-row" style={{ marginTop: '20px' }}>
                <span>¿Ya tienes cuenta?</span>
                <button className="face-switch-link" onClick={goToLogin}>
                  ← Iniciar sesión
                </button>
              </div>

              <div className="face-eco-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22C6.5 17 2 13 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-4.5 9-10 14z" />
                </svg>
                Tu biometría se procesa solo en tu dispositivo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`face-toast ${toast.show ? 'show' : ''} ${toast.success ? 'green' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}
