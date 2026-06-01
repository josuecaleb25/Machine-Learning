import { useState, useEffect, useRef, useCallback } from 'react';
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

export default function FaceAuthModal({ isOpen, onClose, initialPanel = 'login', onGoToManualLogin, onGoToManualRegister }) {
  const { loginWithSession } = useAuth();

  const [currentPanel, setCurrentPanel] = useState(initialPanel);
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
  const webglCanvasRef  = useRef(null);
  const dotsCanvasRef   = useRef(null);
  const linesCanvasRef  = useRef(null);
  const leavesCanvasRef = useRef(null);
  const cursorGlowRef   = useRef(null);
  const faceCardRef     = useRef(null);

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
    else setCurrentPanel(initialPanel);
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

  // ── WebGL organic background ──
  useEffect(() => {
    if (!isOpen || !webglCanvasRef.current) return;
    const wc = webglCanvasRef.current;
    const gl = wc.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) return;
    function resize() { wc.width = innerWidth; wc.height = innerHeight; gl.viewport(0,0,wc.width,wc.height); }
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
    function mkShader(type, src) { const s = gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); return s; }
    const pr = gl.createProgram();
    gl.attachShader(pr, mkShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, mkShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(pr,'p');
    gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
    const uT = gl.getUniformLocation(pr,'T'), uR = gl.getUniformLocation(pr,'R');
    let rafId;
    function loop(ts) { gl.uniform1f(uT,ts*.001); gl.uniform2f(uR,wc.width,wc.height); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); rafId=requestAnimationFrame(loop); }
    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize',resize); };
  }, [isOpen]);

  // ── Dots ──
  useEffect(() => {
    if (!isOpen || !dotsCanvasRef.current) return;
    const dc = dotsCanvasRef.current;
    const dx = dc.getContext('2d');
    const dots = Array.from({length:80}, () => ({ x:Math.random()*2000, y:Math.random()*1000, r:Math.random()*1.8+.5, a:Math.random()*.25+.05 }));
    function draw() { dx.clearRect(0,0,dc.width,dc.height); dots.forEach(d=>{ dx.beginPath(); dx.arc(d.x,d.y,d.r,0,Math.PI*2); dx.fillStyle=`rgba(100,130,90,${d.a})`; dx.fill(); }); }
    function resize() { dc.width=innerWidth; dc.height=innerHeight; draw(); }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isOpen]);

  // ── Lines + Rings + Leaves ──
  useEffect(() => {
    if (!isOpen || !linesCanvasRef.current || !leavesCanvasRef.current) return;
    const lc = linesCanvasRef.current, lx = lc.getContext('2d');
    const fc = leavesCanvasRef.current, fx = fc.getContext('2d');
    function resize() { lc.width=fc.width=innerWidth; lc.height=fc.height=innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    const lineCfgs = [
      {yBase:.12,amp:35,freq:.0018,speed:.25,phase:0,  alpha:.12,color:'100,140,85'},
      {yBase:.28,amp:25,freq:.0022,speed:.18,phase:1.2,alpha:.09,color:'120,155,100'},
      {yBase:.45,amp:40,freq:.0015,speed:.22,phase:2.4,alpha:.07,color:'90,125,75'},
      {yBase:.62,amp:30,freq:.002, speed:.28,phase:.8, alpha:.10,color:'110,145,90'},
      {yBase:.78,amp:20,freq:.0025,speed:.20,phase:1.8,alpha:.08,color:'100,135,82'},
      {yBase:.90,amp:45,freq:.0012,speed:.15,phase:3.1,alpha:.06,color:'95,128,78'},
      {yBase:.05,amp:60,freq:.001, speed:.12,phase:.5, alpha:.05,color:'130,160,110'},
      {yBase:.95,amp:55,freq:.0014,speed:.16,phase:2.0,alpha:.05,color:'115,148,95'},
    ];
    const leaves = Array.from({length:18}, () => ({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      size:Math.random()*30+15, angle:Math.random()*Math.PI*2,
      angleSpeed:(Math.random()-.5)*.003,
      vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.12,
      opacity:Math.random()*.35+.08, variant:Math.floor(Math.random()*3), t:Math.random()*100,
    }));
    function drawLeaf(ctx,cx,cy,size,angle,opacity,variant) {
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle); ctx.globalAlpha=opacity;
      const s=size;
      if(variant===0){
        ctx.beginPath(); ctx.moveTo(0,s*.5); ctx.bezierCurveTo(s*.55,s*.3,s*.6,-s*.2,0,-s*.5); ctx.bezierCurveTo(-s*.6,-s*.2,-s*.55,s*.3,0,s*.5);
        ctx.fillStyle='rgba(100,140,85,0.18)'; ctx.fill(); ctx.strokeStyle='rgba(80,120,65,0.3)'; ctx.lineWidth=.7; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,s*.5); ctx.lineTo(0,-s*.5); ctx.strokeStyle='rgba(80,120,65,0.25)'; ctx.lineWidth=.6; ctx.stroke();
        for(let i=-3;i<=3;i++){ if(i===0)continue; const py=i*(s*.15),px=s*.35*Math.sign(i)*(1-Math.abs(i)/5); ctx.beginPath(); ctx.moveTo(0,py); ctx.lineTo(px,py-s*.05); ctx.strokeStyle='rgba(80,120,65,0.15)'; ctx.lineWidth=.5; ctx.stroke(); }
      } else if(variant===1){
        ctx.beginPath(); ctx.moveTo(0,s*.55); ctx.bezierCurveTo(s*.7,s*.4,s*.8,-s*.1,s*.1,-s*.5); ctx.bezierCurveTo(0,-s*.6,-s*.1,-s*.6,-s*.1,-s*.5); ctx.bezierCurveTo(-s*.8,-s*.1,-s*.7,s*.4,0,s*.55);
        ctx.fillStyle='rgba(120,155,100,0.14)'; ctx.fill(); ctx.strokeStyle='rgba(90,130,70,0.25)'; ctx.lineWidth=.7; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,s*.55); ctx.bezierCurveTo(s*.1,0,0,-s*.3,0,-s*.5); ctx.strokeStyle='rgba(90,130,70,0.18)'; ctx.lineWidth=.5; ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(0,s*.6); ctx.bezierCurveTo(s*.3,s*.2,s*.25,-s*.3,0,-s*.6); ctx.bezierCurveTo(-s*.25,-s*.3,-s*.3,s*.2,0,s*.6);
        ctx.fillStyle='rgba(110,148,88,0.13)'; ctx.fill(); ctx.strokeStyle='rgba(85,122,65,0.22)'; ctx.lineWidth=.6; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,s*.6); ctx.lineTo(0,-s*.6); ctx.strokeStyle='rgba(85,122,65,0.18)'; ctx.lineWidth=.5; ctx.stroke();
      }
      ctx.restore();
    }
    let lt=0, rafId;
    function loop() {
      lt+=.012;
      lx.clearRect(0,0,lc.width,lc.height);
      const rcx=lc.width*.5, rcy=lc.height*.5;
      for(let r=80;r<Math.max(lc.width,lc.height);r+=90){ const a=Math.max(0,.06-r/6000); if(a<=0)break; lx.beginPath(); lx.arc(rcx,rcy,r,0,Math.PI*2); lx.strokeStyle=`rgba(100,135,85,${a})`; lx.lineWidth=.5; lx.stroke(); }
      lineCfgs.forEach(cfg=>{ const pts=[]; for(let xi=0;xi<=lc.width+40;xi+=8){ const y=lc.height*cfg.yBase+Math.sin(xi*cfg.freq+lt*cfg.speed+cfg.phase)*cfg.amp+Math.sin(xi*cfg.freq*2.3+lt*cfg.speed*.7)*cfg.amp*.35; pts.push([xi,y]); } lx.beginPath(); lx.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length-1;i++){ const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2; lx.quadraticCurveTo(pts[i][0],pts[i][1],mx,my); } lx.strokeStyle=`rgba(${cfg.color},${cfg.alpha})`; lx.lineWidth=1; lx.stroke(); });
      fx.clearRect(0,0,fc.width,fc.height);
      leaves.forEach(l=>{ l.t+=.008; l.x+=l.vx+Math.sin(l.t*.7)*.15; l.y+=l.vy+Math.cos(l.t*.5)*.12; l.angle+=l.angleSpeed+Math.sin(l.t)*.001; if(l.x<-60)l.x=fc.width+40; if(l.x>fc.width+60)l.x=-40; if(l.y<-60)l.y=fc.height+40; if(l.y>fc.height+60)l.y=-40; drawLeaf(fx,l.x,l.y,l.size,l.angle,l.opacity,l.variant); });
      rafId=requestAnimationFrame(loop);
    }
    rafId=requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize',resize); };
  }, [isOpen]);

  // ── Cursor glow ──
  useEffect(() => {
    if (!isOpen) return;
    let cx2=innerWidth/2, cy2=innerHeight/2, mx=cx2, my=cy2, rafId;
    function onMove(e) { mx=e.clientX; my=e.clientY; }
    window.addEventListener('mousemove', onMove);
    function loop() { cx2+=(mx-cx2)*.07; cy2+=(my-cy2)*.07; if(cursorGlowRef.current){ cursorGlowRef.current.style.left=cx2+'px'; cursorGlowRef.current.style.top=cy2+'px'; } rafId=requestAnimationFrame(loop); }
    rafId=requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('mousemove',onMove); };
  }, [isOpen]);

  // ── Card parallax ──
  useEffect(() => {
    if (!isOpen) return;
    let tx = 0, ty = 0, cx2 = 0, cy2 = 0, rafId;
    function onMove(e) {
      tx = (e.clientX / innerWidth  - 0.5) * 8;
      ty = (e.clientY / innerHeight - 0.5) * 6;
    }
    window.addEventListener('mousemove', onMove);
    function loop() {
      cx2 += (tx - cx2) * 0.08;
      cy2 += (ty - cy2) * 0.08;
      if (faceCardRef.current) {
        faceCardRef.current.style.transform = `translate(${cx2.toFixed(2)}px,${cy2.toFixed(2)}px)`;
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      if (faceCardRef.current) faceCardRef.current.style.transform = '';
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

      if (overlay) {
        overlay.stop();
        loginOverlayRef.current = null;
      }
      stopStream('login');

      setTimeout(() => finishAuth(data), 2400);
    } catch (err) {
      if (overlay) {
        overlay.stop();
        loginOverlayRef.current = null;
      }
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
        return;
      }

      speakLoginError();
      setLoginState('idle');
      
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

      setRegState('capturing');
      speakRegisterProcessing();

      await new Promise((r) => setTimeout(r, 150));
      const facialEmbedding = await captureRobustFaceEmbedding(regVideoRef.current);
      
      if (!facialEmbedding || facialEmbedding.length === 0) {
        throw new Error('No se pudo capturar el embedding facial. Por favor intente de nuevo.');
      }

      if (overlay) {
        overlay.stop();
        regOverlayRef.current = null;
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
      if (overlay) {
        overlay.stop();
        regOverlayRef.current = null;
      }
      stopStream('register');
      setRegState('idle');
      
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
      
      if (/centre su rostro/i.test(err?.message ?? '')) {
        speakFaceNotCentered();
        showToast('Por favor centre su rostro dentro del marco', false);
        return;
      }
      
      if (/no se detectó|no se pudo capturar/i.test(err?.message ?? '')) {
        showToast(err.message, false);
        return;
      }
      
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
      {/* Background layers */}
      <canvas ref={webglCanvasRef}  className="face-bg-layer face-bg-webgl" />
      <canvas ref={dotsCanvasRef}   className="face-bg-layer face-bg-dots" />
      <canvas ref={linesCanvasRef}  className="face-bg-layer face-bg-lines" />
      <canvas ref={leavesCanvasRef} className="face-bg-layer face-bg-leaves" />

      {/* CSS blobs */}
      <div className="face-eco-blob" style={{width:'700px',height:'600px',top:'-18%',left:'-12%',background:'radial-gradient(ellipse,rgba(180,210,170,0.28) 0%,transparent 65%)',filter:'blur(60px)'}}></div>
      <div className="face-eco-blob" style={{width:'550px',height:'650px',top:'25%',right:'-15%',background:'radial-gradient(ellipse,rgba(160,195,150,0.22) 0%,transparent 65%)',filter:'blur(70px)'}}></div>
      <div className="face-eco-blob" style={{width:'600px',height:'450px',bottom:'-20%',left:'25%',background:'radial-gradient(ellipse,rgba(200,220,190,0.2) 0%,transparent 65%)',filter:'blur(55px)'}}></div>
      <div className="face-eco-blob" style={{width:'300px',height:'300px',top:'10%',left:'38%',background:'radial-gradient(ellipse,rgba(220,235,210,0.18) 0%,transparent 70%)',filter:'blur(40px)'}}></div>

      {/* Cursor glow */}
      <div ref={cursorGlowRef} className="face-cursor-glow"></div>

      <div className="face-stage">
        <div className="face-card" ref={faceCardRef}>

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

          <div className="face-panels">
            {/* LOGIN PANEL */}
            <div className={`face-panel ${currentPanel === 'login' ? 'active' : 'hidden-left'}`}>
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

                  <div className="face-scan-line" />

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

              <p className="face-cam-status-text">{getLoginCamText()}</p>

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
                onClick={() => { onClose(); onGoToManualLogin?.(); }}
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
            <div className={`face-panel ${currentPanel === 'register' ? 'active' : 'hidden-right'}`}>
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
                disabled={regState !== 'idle' && regState !== 'already-exists'}
              >
                {regState === 'idle' && 'Registrar rostro'}
                {regState === 'scanning' && 'Capturando…'}
                {regState === 'capturing' && 'Procesando…'}
                {regState === 'success' && '✓ Registro completado'}
                {regState === 'already-exists' && 'Intentar de nuevo'}
              </button>

              <div className="face-divider">
                <div className="face-divider-line" />
                <span className="face-divider-text">o también</span>
                <div className="face-divider-line" />
              </div>

              <button
                className="face-btn-ghost"
                onClick={() => { onClose(); onGoToManualRegister?.(); }}
              >
                Registro con email
              </button>

              <div className="face-switch-row">
                <span>¿Ya tienes cuenta?</span>
                <button className="face-switch-link" onClick={goToLogin}>
                  ← Iniciar sesión
                </button>
              </div>

              <div className="face-eco-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22C6.5 17 2 13 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-4.5 9-10 14z" />
                </svg>
                Biometría 100% local · Sin datos en la nube
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