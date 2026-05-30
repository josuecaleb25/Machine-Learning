import { useState, useEffect, useRef } from 'react';
import './FaceAuthModal.css';

export default function FaceAuthModal({ isOpen, onClose }) {
  const [currentPanel, setCurrentPanel] = useState('login');
  const [loginState, setLoginState] = useState('idle');
  const [regState, setRegState] = useState('idle');
  const [regName, setRegName] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', success: false });
  
  const loginVideoRef = useRef(null);
  const regVideoRef = useRef(null);
  const loginStreamRef = useRef(null);
  const regStreamRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopStream('login');
      stopStream('register');
      setCurrentPanel('login');
      setLoginState('idle');
      setRegState('idle');
    }
  }, [isOpen]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const showToast = (message, success = false) => {
    setToast({ show: true, message, success });
    setTimeout(() => setToast({ show: false, message: '', success: false }), 3200);
  };

  const startCamera = async (videoRef, placeholderId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 480, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = 'block';
        document.getElementById(placeholderId).style.display = 'none';
      }
      return stream;
    } catch (e) {
      showToast('Permiso de cámara denegado', false);
      return null;
    }
  };

  const stopStream = (panel) => {
    if (panel === 'login' && loginStreamRef.current) {
      loginStreamRef.current.getTracks().forEach(t => t.stop());
      loginStreamRef.current = null;
      if (loginVideoRef.current) {
        loginVideoRef.current.style.display = 'none';
        const placeholder = document.getElementById('login-placeholder');
        if (placeholder) placeholder.style.display = 'flex';
      }
    }
    if (panel === 'register' && regStreamRef.current) {
      regStreamRef.current.getTracks().forEach(t => t.stop());
      regStreamRef.current = null;
      if (regVideoRef.current) {
        regVideoRef.current.style.display = 'none';
        const placeholder = document.getElementById('reg-placeholder');
        if (placeholder) placeholder.style.display = 'flex';
      }
    }
  };

  const startFaceLogin = async () => {
    if (loginState !== 'idle') return;
    
    setLoginState('scanning');
    const stream = await startCamera(loginVideoRef, 'login-placeholder');
    if (!stream) {
      setLoginState('idle');
      return;
    }
    loginStreamRef.current = stream;

    await sleep(2200);
    await sleep(1600);
    await sleep(1200);

    stopStream('login');
    setLoginState('success');
    showToast('¡Bienvenido! Sesión iniciada correctamente', true);

    setTimeout(() => {
      setLoginState('idle');
      onClose();
    }, 2000);
  };

  const startFaceRegister = async () => {
    if (!regName.trim()) {
      showToast('Por favor ingresa tu nombre completo', false);
      return;
    }
    if (regState !== 'idle') return;

    setRegState('scanning');
    const stream = await startCamera(regVideoRef, 'reg-placeholder');
    if (!stream) {
      setRegState('idle');
      return;
    }
    regStreamRef.current = stream;

    await sleep(1800);
    await sleep(1500);
    await sleep(1500);
    await sleep(1200);

    stopStream('register');
    setRegState('success');
    showToast(`¡${regName}, tu Face ID fue registrado exitosamente!`, true);

    setTimeout(() => {
      setRegState('idle');
      setRegName('');
    }, 4500);
  };

  const goToRegister = () => {
    if (currentPanel === 'register') return;
    setCurrentPanel('register');
    stopStream('login');
  };

  const goToLogin = () => {
    if (currentPanel === 'login') return;
    setCurrentPanel('login');
    stopStream('register');
  };

  if (!isOpen) return null;

  return (
    <div className="face-auth-overlay">
      <canvas className="particle-canvas" id="face-particle-canvas"></canvas>
      
      <div className="face-blob face-blob-1"></div>
      <div className="face-blob face-blob-2"></div>
      <div className="face-blob face-blob-3"></div>

      <div className="face-stage">
        <div className="face-card">
          <button onClick={onClose} className="face-close-btn">
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="face-logo">
            <div className="face-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 0 20"/>
                <path d="M12 2C6.5 2 3 6 3 12c0 3 1.5 5.5 4 7"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span className="face-logo-text">Eco<span>Face</span></span>
          </div>

          <div className="face-panels">
            {/* LOGIN PANEL */}
            <div className={`face-panel ${currentPanel === 'login' ? 'active' : 'hidden-right'}`}>
              <div className="face-steps">
                <div className={`face-step-dot ${currentPanel === 'login' ? 'active' : ''}`}></div>
                <div className={`face-step-dot ${currentPanel === 'register' ? 'active' : ''}`}></div>
              </div>

              <h1 className="face-panel-title">Bienvenido</h1>
              <p className="face-panel-subtitle">Autentícate con tu rostro para continuar</p>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <div className="face-status-pill">
                  <div className="face-status-dot"></div>
                  <span>
                    {loginState === 'idle' && 'Cámara lista'}
                    {loginState === 'scanning' && 'Analizando rostro'}
                    {loginState === 'success' && 'Acceso concedido'}
                  </span>
                </div>
              </div>

              <div className="face-camera-wrapper scanning">
                <div className="face-camera-circle">
                  <video ref={loginVideoRef} autoPlay playsInline muted style={{ display: 'none', borderRadius: '50%' }}></video>
                  <div className="face-cam-placeholder" id="login-placeholder">
                    <svg className="face-cam-placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                  <div className="face-scan-line"></div>
                  <div className="face-scan-face-points" style={{ opacity: loginState === 'scanning' ? 1 : 0 }}>
                    <div className="face-point" style={{ top: '32%', left: '36%' }}></div>
                    <div className="face-point" style={{ top: '32%', left: '64%', animationDelay: '.3s' }}></div>
                    <div className="face-point" style={{ top: '45%', left: '30%', animationDelay: '.7s' }}></div>
                    <div className="face-point" style={{ top: '45%', left: '70%', animationDelay: '.5s' }}></div>
                    <div className="face-point" style={{ top: '55%', left: '50%', animationDelay: '.2s' }}></div>
                    <div className="face-point" style={{ top: '65%', left: '38%', animationDelay: '.9s' }}></div>
                    <div className="face-point" style={{ top: '65%', left: '62%', animationDelay: '.4s' }}></div>
                    <div className="face-point" style={{ top: '40%', left: '50%', animationDelay: '.6s' }}></div>
                  </div>
                </div>
                <div className="face-scan-overlay">
                  <div className="face-scan-ring"></div>
                  <div className="face-scan-dots">
                    <div className="face-scan-dot"></div>
                    <div className="face-scan-dot"></div>
                    <div className="face-scan-dot"></div>
                  </div>
                </div>
                <div className="face-cam-corners">
                  <div className="face-cam-corner"></div>
                  <div className="face-cam-corner"></div>
                  <div className="face-cam-corner"></div>
                  <div className="face-cam-corner"></div>
                </div>
              </div>

              <p className="face-cam-status-text">
                {loginState === 'idle' && 'Escaneando rostro…'}
                {loginState === 'scanning' && 'Verificando identidad…'}
                {loginState === 'success' && 'Bienvenido de vuelta ✦'}
              </p>
              <p className="face-cam-label">Coloca tu rostro dentro del círculo<br/>y mantén una expresión natural</p>

              <button 
                className="face-btn-primary" 
                onClick={startFaceLogin}
                disabled={loginState !== 'idle'}
                style={{ 
                  opacity: loginState === 'scanning' ? 0.75 : 1,
                  background: loginState === 'success' ? 'linear-gradient(135deg, #1b4332, #2D6A4F)' : ''
                }}
              >
                {loginState === 'idle' && 'Iniciar reconocimiento facial'}
                {loginState === 'scanning' && 'Escaneando…'}
                {loginState === 'success' && '✓ Identidad verificada'}
              </button>

              <div className="face-divider">
                <div className="face-divider-line"></div>
                <span className="face-divider-text">o también</span>
                <div className="face-divider-line"></div>
              </div>

              <button className="face-btn-ghost" onClick={() => showToast('Acceso manual no disponible en esta demo', false)}>
                Acceso con contraseña
              </button>

              <div className="face-switch-row">
                <span>¿Primera vez aquí?</span>
                <button className="face-switch-link" onClick={goToRegister}>Crear cuenta →</button>
              </div>

              <div className="face-eco-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22C6.5 17 2 13 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-4.5 9-10 14z"/>
                </svg>
                Autenticación 100% local · Sin datos en la nube
              </div>
            </div>

            {/* REGISTER PANEL */}
            <div className={`face-panel ${currentPanel === 'register' ? 'active' : 'hidden-left'}`}>
              <div className="face-steps">
                <div className={`face-step-dot ${currentPanel === 'login' ? 'active' : ''}`}></div>
                <div className={`face-step-dot ${currentPanel === 'register' ? 'active' : ''}`}></div>
              </div>

              <h1 className="face-panel-title">Crear cuenta</h1>
              <p className="face-panel-subtitle">Registra tu identidad facial en segundos</p>

              <div className="face-field-group">
                <label className="face-field-label">Nombre completo</label>
                <input 
                  type="text" 
                  className="face-field-input" 
                  placeholder="Ej. Josue Ramírez"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <div className="face-status-pill">
                  <div className="face-status-dot"></div>
                  <span>
                    {regState === 'idle' && 'Listo para escanear'}
                    {regState === 'scanning' && 'Capturando muestras'}
                    {regState === 'success' && 'Face ID guardado'}
                  </span>
                </div>
              </div>

              <div className="face-camera-wrapper scanning" style={{ maxWidth: '200px', marginBottom: '20px' }}>
                <div className="face-camera-circle">
                  <video ref={regVideoRef} autoPlay playsInline muted style={{ display: 'none', borderRadius: '50%' }}></video>
                  <div className="face-cam-placeholder" id="reg-placeholder">
                    <svg className="face-cam-placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                  <div className="face-scan-line"></div>
                  <div className="face-scan-face-points" style={{ opacity: regState === 'scanning' ? 1 : 0 }}>
                    <div className="face-point" style={{ top: '30%', left: '38%', animationDelay: '.1s' }}></div>
                    <div className="face-point" style={{ top: '30%', left: '62%', animationDelay: '.4s' }}></div>
                    <div className="face-point" style={{ top: '48%', left: '50%', animationDelay: '.8s' }}></div>
                    <div className="face-point" style={{ top: '62%', left: '40%', animationDelay: '.2s' }}></div>
                    <div className="face-point" style={{ top: '62%', left: '60%', animationDelay: '.6s' }}></div>
                  </div>
                </div>
                <div className="face-scan-overlay">
                  <div className="face-scan-ring"></div>
                  <div className="face-scan-dots">
                    <div className="face-scan-dot"></div>
                    <div className="face-scan-dot"></div>
                    <div className="face-scan-dot"></div>
                  </div>
                </div>
                <div className="face-cam-corners">
                  <div className="face-cam-corner"></div>
                  <div className="face-cam-corner"></div>
                  <div className="face-cam-corner"></div>
                  <div className="face-cam-corner"></div>
                </div>
              </div>

              <p className="face-cam-status-text">
                {regState === 'idle' && 'Listo para capturar…'}
                {regState === 'scanning' && 'Procesando biometría…'}
                {regState === 'success' && 'Registro completado ✦'}
              </p>
              <p className="face-cam-label" style={{ marginBottom: '20px' }}>
                Asegúrate de tener buena iluminación<br/>y mira directamente a la cámara
              </p>

              <button 
                className="face-btn-primary" 
                onClick={startFaceRegister}
                disabled={regState !== 'idle'}
                style={{ 
                  opacity: regState === 'scanning' ? 0.75 : 1,
                  background: regState === 'success' ? 'linear-gradient(135deg, #1b4332, #2D6A4F)' : ''
                }}
              >
                {regState === 'idle' && 'Registrar Face ID'}
                {regState === 'scanning' && 'Capturando…'}
                {regState === 'success' && `✓ ${regName} registrado`}
              </button>

              <div className="face-switch-row" style={{ marginTop: '20px' }}>
                <span>¿Ya tienes cuenta?</span>
                <button className="face-switch-link" onClick={goToLogin}>← Iniciar sesión</button>
              </div>

              <div className="face-eco-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22C6.5 17 2 13 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-4.5 9-10 14z"/>
                </svg>
                Tu biometría se procesa solo en tu dispositivo
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`face-toast ${toast.show ? 'show' : ''} ${toast.success ? 'green' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}
