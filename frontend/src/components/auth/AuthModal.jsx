import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { loginManual, registerManual } from '../../lib/auth.js';
import FaceAuthModal from './FaceAuthModal.jsx';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const { loginWithSession } = useAuth();
  
  const [currentPanel, setCurrentPanel] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ nombre: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState({ login: false, register: false });
  const [toast, setToast] = useState({ show: false, message: '', success: false });
  const [isFaceAuthOpen, setIsFaceAuthOpen] = useState(false);
  const [faceAuthPanel, setFaceAuthPanel] = useState('login');
  const [loading, setLoading] = useState(true);

  const webglCanvasRef = useRef(null);
  const dotsCanvasRef  = useRef(null);
  const linesCanvasRef = useRef(null);
  const leavesCanvasRef = useRef(null);
  const cursorGlowRef  = useRef(null);
  const cardRef        = useRef(null);

  // Loader
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(t);
  }, [isOpen]);

  // ── WebGL organic background ──
  useEffect(() => {
    if (!isOpen || !webglCanvasRef.current) return;
    const wc = webglCanvasRef.current;
    const gl = wc.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) return;

    function resize() { wc.width = innerWidth; wc.height = innerHeight; gl.viewport(0, 0, wc.width, wc.height); }
    resize();
    window.addEventListener('resize', resize);

    const VS = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
    const FS = `precision highp float;
uniform float T;uniform vec2 R;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float sn(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*sn(p);p*=2.1;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/R;vec2 q=uv*2.-1.;q.x*=R.x/R.y;
  float t=T*.09;
  float n1=fbm(q*1.1+vec2(t*.2,t*.15));
  float n2=fbm(q*1.8-vec2(t*.12,t*.25)+n1*.5);
  float n3=fbm(q*.6+vec2(t*.07,-t*.18)+n2*.4);
  float f=n1*.5+n2*.3+n3*.2;
  vec3 c0=vec3(.957,.965,.953);vec3 c1=vec3(.933,.949,.925);
  vec3 c2=vec3(.906,.929,.894);vec3 c3=vec3(.875,.906,.859);vec3 c4=vec3(.922,.941,.910);
  vec3 col=c0;
  col=mix(col,c1,smoothstep(.0,.3,f));col=mix(col,c2,smoothstep(.25,.52,f));
  col=mix(col,c3,smoothstep(.48,.72,f));col=mix(col,c4,smoothstep(.70,.92,f));
  col=mix(col,c1,smoothstep(.90,1.,f));
  float vg=smoothstep(0.,.9,length(q*.55));col=mix(col,c0,(.98-vg)*.2);
  col+=sn(q*22.+T*.5)*.006;
  gl_FragColor=vec4(col,1.);
}`;
    function mkShader(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    const pr = gl.createProgram();
    gl.attachShader(pr, mkShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, mkShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(pr, 'T'), uR = gl.getUniformLocation(pr, 'R');
    let rafId;
    function loop(ts) {
      gl.uniform1f(uT, ts * 0.001); gl.uniform2f(uR, wc.width, wc.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); };
  }, [isOpen]);

  // ── Dots ──
  useEffect(() => {
    if (!isOpen || !dotsCanvasRef.current) return;
    const dc = dotsCanvasRef.current;
    const dx = dc.getContext('2d');
    function resize() { dc.width = innerWidth; dc.height = innerHeight; draw(); }
    const dots = Array.from({ length: 80 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 1000,
      r: Math.random() * 1.8 + 0.5, a: Math.random() * 0.25 + 0.05
    }));
    function draw() {
      dx.clearRect(0, 0, dc.width, dc.height);
      dots.forEach(d => { dx.beginPath(); dx.arc(d.x, d.y, d.r, 0, Math.PI * 2); dx.fillStyle = `rgba(100,130,90,${d.a})`; dx.fill(); });
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isOpen]);

  // ── Lines + Rings + Leaves (shared loop) ──
  useEffect(() => {
    if (!isOpen || !linesCanvasRef.current || !leavesCanvasRef.current) return;
    const lc = linesCanvasRef.current;
    const lx = lc.getContext('2d');
    const fc = leavesCanvasRef.current;
    const fx = fc.getContext('2d');

    function resize() {
      lc.width = fc.width = innerWidth;
      lc.height = fc.height = innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const lineCfgs = [
      { yBase:.12, amp:35, freq:.0018, speed:.25, phase:0,   alpha:.12, color:'100,140,85' },
      { yBase:.28, amp:25, freq:.0022, speed:.18, phase:1.2, alpha:.09, color:'120,155,100' },
      { yBase:.45, amp:40, freq:.0015, speed:.22, phase:2.4, alpha:.07, color:'90,125,75' },
      { yBase:.62, amp:30, freq:.002,  speed:.28, phase:.8,  alpha:.10, color:'110,145,90' },
      { yBase:.78, amp:20, freq:.0025, speed:.20, phase:1.8, alpha:.08, color:'100,135,82' },
      { yBase:.90, amp:45, freq:.0012, speed:.15, phase:3.1, alpha:.06, color:'95,128,78' },
      { yBase:.05, amp:60, freq:.001,  speed:.12, phase:.5,  alpha:.05, color:'130,160,110' },
      { yBase:.95, amp:55, freq:.0014, speed:.16, phase:2.0, alpha:.05, color:'115,148,95' },
    ];

    const leaves = Array.from({ length: 18 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      size: Math.random() * 30 + 15, angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.003,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.12,
      opacity: Math.random() * 0.35 + 0.08, variant: Math.floor(Math.random() * 3),
      t: Math.random() * 100,
    }));

    function drawLeaf(ctx, cx, cy, size, angle, opacity, variant) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle); ctx.globalAlpha = opacity;
      const s = size;
      if (variant === 0) {
        ctx.beginPath(); ctx.moveTo(0, s*.5);
        ctx.bezierCurveTo(s*.55, s*.3, s*.6, -s*.2, 0, -s*.5);
        ctx.bezierCurveTo(-s*.6, -s*.2, -s*.55, s*.3, 0, s*.5);
        ctx.fillStyle = 'rgba(100,140,85,0.18)'; ctx.fill();
        ctx.strokeStyle = 'rgba(80,120,65,0.3)'; ctx.lineWidth = 0.7; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, s*.5); ctx.lineTo(0, -s*.5);
        ctx.strokeStyle = 'rgba(80,120,65,0.25)'; ctx.lineWidth = 0.6; ctx.stroke();
        for (let i = -3; i <= 3; i++) {
          if (i === 0) continue;
          const py = i * (s * 0.15), px = s * 0.35 * Math.sign(i) * (1 - Math.abs(i) / 5);
          ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(px, py - s * 0.05);
          ctx.strokeStyle = 'rgba(80,120,65,0.15)'; ctx.lineWidth = 0.5; ctx.stroke();
        }
      } else if (variant === 1) {
        ctx.beginPath(); ctx.moveTo(0, s*.55);
        ctx.bezierCurveTo(s*.7, s*.4, s*.8, -s*.1, s*.1, -s*.5);
        ctx.bezierCurveTo(0, -s*.6, -s*.1, -s*.6, -s*.1, -s*.5);
        ctx.bezierCurveTo(-s*.8, -s*.1, -s*.7, s*.4, 0, s*.55);
        ctx.fillStyle = 'rgba(120,155,100,0.14)'; ctx.fill();
        ctx.strokeStyle = 'rgba(90,130,70,0.25)'; ctx.lineWidth = 0.7; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, s*.55);
        ctx.bezierCurveTo(s*.1, 0, 0, -s*.3, 0, -s*.5);
        ctx.strokeStyle = 'rgba(90,130,70,0.18)'; ctx.lineWidth = 0.5; ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(0, s*.6);
        ctx.bezierCurveTo(s*.3, s*.2, s*.25, -s*.3, 0, -s*.6);
        ctx.bezierCurveTo(-s*.25, -s*.3, -s*.3, s*.2, 0, s*.6);
        ctx.fillStyle = 'rgba(110,148,88,0.13)'; ctx.fill();
        ctx.strokeStyle = 'rgba(85,122,65,0.22)'; ctx.lineWidth = 0.6; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, s*.6); ctx.lineTo(0, -s*.6);
        ctx.strokeStyle = 'rgba(85,122,65,0.18)'; ctx.lineWidth = 0.5; ctx.stroke();
      }
      ctx.restore();
    }

    let lt = 0, rafId;
    function loop() {
      lt += 0.012;
      // lines canvas
      lx.clearRect(0, 0, lc.width, lc.height);
      // concentric rings
      const rcx = lc.width * 0.5, rcy = lc.height * 0.5;
      for (let r = 80; r < Math.max(lc.width, lc.height); r += 90) {
        const alpha = Math.max(0, 0.06 - r / 6000);
        if (alpha <= 0) break;
        lx.beginPath(); lx.arc(rcx, rcy, r, 0, Math.PI * 2);
        lx.strokeStyle = `rgba(100,135,85,${alpha})`; lx.lineWidth = 0.5; lx.stroke();
      }
      // organic lines
      lineCfgs.forEach(cfg => {
        const pts = [];
        for (let xi = 0; xi <= lc.width + 40; xi += 8) {
          const y = lc.height * cfg.yBase + Math.sin(xi * cfg.freq + lt * cfg.speed + cfg.phase) * cfg.amp
                  + Math.sin(xi * cfg.freq * 2.3 + lt * cfg.speed * 0.7) * cfg.amp * 0.35;
          pts.push([xi, y]);
        }
        lx.beginPath(); lx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i][0] + pts[i+1][0]) / 2, my = (pts[i][1] + pts[i+1][1]) / 2;
          lx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
        }
        lx.strokeStyle = `rgba(${cfg.color},${cfg.alpha})`; lx.lineWidth = 1; lx.stroke();
      });
      // leaves canvas
      fx.clearRect(0, 0, fc.width, fc.height);
      leaves.forEach(l => {
        l.t += 0.008;
        l.x += l.vx + Math.sin(l.t * 0.7) * 0.15;
        l.y += l.vy + Math.cos(l.t * 0.5) * 0.12;
        l.angle += l.angleSpeed + Math.sin(l.t) * 0.001;
        if (l.x < -60) l.x = fc.width + 40;
        if (l.x > fc.width + 60) l.x = -40;
        if (l.y < -60) l.y = fc.height + 40;
        if (l.y > fc.height + 60) l.y = -40;
        drawLeaf(fx, l.x, l.y, l.size, l.angle, l.opacity, l.variant);
      });
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); };
  }, [isOpen]);

  // ── Cursor glow ──
  useEffect(() => {
    if (!isOpen) return;
    let cx2 = innerWidth / 2, cy2 = innerHeight / 2;
    let mx = cx2, my = cy2, rafId;
    function onMove(e) { mx = e.clientX; my = e.clientY; }
    window.addEventListener('mousemove', onMove);
    function loop() {
      cx2 += (mx - cx2) * 0.07; cy2 += (my - cy2) * 0.07;
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = cx2 + 'px';
        cursorGlowRef.current.style.top  = cy2 + 'px';
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('mousemove', onMove); };
  }, [isOpen]);

  // ── Card parallax ──
  useEffect(() => {
    if (!isOpen) return;
    let tx = 0, ty = 0, cx2 = 0, cy2 = 0, rafId;
    
    function onMove(e) {
      tx = (e.clientX / innerWidth  - 0.5) * 8;
      ty = (e.clientY / innerHeight - 0.5) * 6;
    }
    
    function loop() {
      cx2 += (tx - cx2) * 0.08;
      cy2 += (ty - cy2) * 0.08;
      if (cardRef.current) {
        cardRef.current.style.transform = `translate(${cx2.toFixed(2)}px,${cy2.toFixed(2)}px)`;
      }
      rafId = requestAnimationFrame(loop);
    }
    
    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(loop);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      if (cardRef.current) cardRef.current.style.transform = '';
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setCurrentPanel('login');
      setLoginData({ email: '', password: '' });
      setRegisterData({ nombre: '', email: '', password: '' });
      setIsFaceAuthOpen(false);
    }
  }, [isOpen]);

  const showToastMsg = (message, success) => {
    setToast({ show: true, message, success });
    setTimeout(() => setToast({ show: false, message: '', success: false }), 3400);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      showToastMsg('Por favor completa todos los campos', false);
      return;
    }

    try {
      const data = await loginManual(loginData);
      loginWithSession(data.token, data.user);
      showToastMsg('¡Bienvenido! Acceso concedido', true);
      setTimeout(() => onClose(), 500);
    } catch (err) {
      showToastMsg(err.message || 'Error al iniciar sesión', false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.nombre || !registerData.email || !registerData.password) {
      showToastMsg('Por favor completa todos los campos', false);
      return;
    }

    try {
      const data = await registerManual(registerData);
      loginWithSession(data.token, data.user);
      showToastMsg(`¡Bienvenido ${registerData.nombre}! Cuenta creada exitosamente`, true);
      setTimeout(() => onClose(), 500);
    } catch (err) {
      showToastMsg(err.message || 'Error al registrarse', false);
    }
  };

  const openFaceAuth = (panel = 'login') => {
    setFaceAuthPanel(panel);
    setIsFaceAuthOpen(true);
  };

  const closeFaceAuth = () => {
    setIsFaceAuthOpen(false);
  };

  const goToManualLogin = () => {
    setIsFaceAuthOpen(false);
    setCurrentPanel('login');
  };

  const goToManualRegister = () => {
    setIsFaceAuthOpen(false);
    setCurrentPanel('register');
  };

  const togglePassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (!isOpen) return null;

  const getPanelClass = (panel) => {
    if (panel === currentPanel) return 'panel active';
    return currentPanel === 'login' ? 'panel gone-right' : 'panel gone-left';
  };

  return (
    <>
      <div className="eco-auth-overlay">
        {/* Loader */}
        {loading && (
          <div className="loader-overlay">
            <div className="loader-logo">Eco<span>Face</span></div>
            <div className="loader-bar"><div className="loader-bar-fill"></div></div>
            <div className="loader-sub">Biometric Portal</div>
          </div>
        )}

        {/* Background layers */}
        <canvas ref={webglCanvasRef}  className="bg-layer bg-webgl"></canvas>
        <canvas ref={dotsCanvasRef}   className="bg-layer bg-dots"></canvas>
        <canvas ref={linesCanvasRef}  className="bg-layer bg-lines"></canvas>
        <canvas ref={leavesCanvasRef} className="bg-layer bg-leaves"></canvas>

        {/* CSS blobs */}
        <div className="eco-blob" style={{width:'700px',height:'600px',top:'-18%',left:'-12%',background:'radial-gradient(ellipse,rgba(180,210,170,0.28) 0%,transparent 65%)',filter:'blur(60px)'}}></div>
        <div className="eco-blob" style={{width:'550px',height:'650px',top:'25%',right:'-15%',background:'radial-gradient(ellipse,rgba(160,195,150,0.22) 0%,transparent 65%)',filter:'blur(70px)'}}></div>
        <div className="eco-blob" style={{width:'600px',height:'450px',bottom:'-20%',left:'25%',background:'radial-gradient(ellipse,rgba(200,220,190,0.2) 0%,transparent 65%)',filter:'blur(55px)'}}></div>
        <div className="eco-blob" style={{width:'300px',height:'300px',top:'10%',left:'38%',background:'radial-gradient(ellipse,rgba(220,235,210,0.18) 0%,transparent 70%)',filter:'blur(40px)'}}></div>

        {/* Cursor glow */}
        <div ref={cursorGlowRef} className="cursor-glow"></div>


        <div className="stage">
          <div className="card" ref={cardRef}>
            <div className="card-inner">
              <div className="logo-row">
                <div className="logo-gem">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                    <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
                  </svg>
                </div>
                <div className="logo-wordmark">
                  <div className="logo-name">Eco<span>Face</span></div>
                  <div className="logo-tagline">Biometric Platform</div>
                </div>
              </div>

              <div className="panels">

              {/* LOGIN PANEL */}
              <div className={getPanelClass('login')}>
                <div className="pdots">
                  <div className={`pdot ${currentPanel === 'login' ? 'a' : 'i'}`}></div>
                  <div className={`pdot ${currentPanel === 'register' ? 'a' : 'i'}`}></div>
                </div>

                <div className="panel-head">
                  <h1 className="panel-title">Bienvenido <em>de nuevo</em></h1>
                  <p className="panel-sub">Accede a tu espacio eco-inteligente</p>
                </div>

                <div className="social-row">
                  <button className="btn-face" onClick={() => openFaceAuth('login')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/>
                      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                    </svg>
                    Face ID
                  </button>
                </div>

                <div className="divider">
                  <div className="div-line"></div>
                  <span className="div-txt">o con email</span>
                  <div className="div-line"></div>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="field">
                    <label className="field-lbl">Correo electrónico</label>
                    <div className="field-wrap">
                      <span className="field-ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 7L2 7"/>
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="field-input"
                        placeholder="tu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-lbl">Contraseña</label>
                    <div className="field-wrap">
                      <span className="field-ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </span>
                      <input
                        type={showPassword.login ? 'text' : 'password'}
                        className="field-input"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                      <button className="field-eye" onClick={() => togglePassword('login')} type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          {showPassword.login ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-cta">
                    <div className="btn-cta-shine"></div>
                    Iniciar sesión
                  </button>
                </form>

                <div className="switch-row">
                  <span>¿Sin cuenta aún?</span>
                  <button className="switch-btn" onClick={() => setCurrentPanel('register')}>Crear cuenta →</button>
                </div>

                <div className="eco-foot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22C6.5 17 2 13 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-4.5 9-10 14z"/>
                  </svg>
                  <span className="eco-dot"></span>
                  Biometría local · Sin nube · Cero residuos
                </div>
              </div>
              {/* REGISTER PANEL */}
              <div className={getPanelClass('register')}>
                <div className="pdots">
                  <div className={`pdot ${currentPanel === 'login' ? 'a' : 'i'}`}></div>
                  <div className={`pdot ${currentPanel === 'register' ? 'a' : 'i'}`}></div>
                </div>

                <div className="panel-head">
                  <h1 className="panel-title">Únete a <em>EcoFace</em></h1>
                  <p className="panel-sub">Crea tu cuenta biométrica en segundos</p>
                </div>

                <div className="social-row">
                  <button className="btn-face" onClick={() => openFaceAuth('register')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/>
                      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                    </svg>
                    Face ID
                  </button>
                </div>

                <div className="divider">
                  <div className="div-line"></div>
                  <span className="div-txt">o con datos</span>
                  <div className="div-line"></div>
                </div>

                <form onSubmit={handleRegister}>
                  <div className="field">
                    <label className="field-lbl">Nombre completo</label>
                    <div className="field-wrap">
                      <span className="field-ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="Nombre Apellido"
                        value={registerData.nombre}
                        onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-lbl">Correo electrónico</label>
                    <div className="field-wrap">
                      <span className="field-ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 7L2 7"/>
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="field-input"
                        placeholder="tu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-lbl">Contraseña</label>
                    <div className="field-wrap">
                      <span className="field-ico">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </span>
                      <input
                        type={showPassword.register ? 'text' : 'password'}
                        className="field-input"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                      <button className="field-eye" onClick={() => togglePassword('register')} type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          {showPassword.register ? (
                            <>
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </>
                          ) : (
                            <>
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-cta">
                    <div className="btn-cta-shine"></div>
                    Crear cuenta
                  </button>
                </form>

                <div className="switch-row">
                  <span>¿Ya tienes cuenta?</span>
                  <button className="switch-btn" onClick={() => setCurrentPanel('login')}>← Iniciar sesión</button>
                </div>

                <div className="eco-foot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22C6.5 17 2 13 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-4.5 9-10 14z"/>
                  </svg>
                  <span className="eco-dot"></span>
                  Datos cifrados · Privacidad total
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        <div className={`toast ${toast.show ? 'show' : ''} ${toast.success ? 'ok' : 'err'}`}>
          {toast.message}
        </div>
      </div>

      {/* Face Auth Modal Original */}
      <FaceAuthModal 
        isOpen={isFaceAuthOpen}
        onClose={closeFaceAuth}
        initialPanel={faceAuthPanel}
        onGoToManualLogin={goToManualLogin}
        onGoToManualRegister={goToManualRegister}
      />
    </>
  );
}