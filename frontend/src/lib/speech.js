const MESSAGES = {
  // Login
  loginStarting: 'Iniciando reconocimiento facial. Por favor mire a la cámara.',
  loginScanning: 'Analizando su rostro. Manténgase quieto.',
  loginSuccess: (name) => `Bienvenido ${name}. Acceso concedido.`,
  loginNotFound: 'Usuario no registrado. Acceso denegado.',
  loginError: 'Error al iniciar sesión. Por favor intente de nuevo.',
  
  // Register
  registerStarting: 'Iniciando registro facial. Prepare su rostro.',
  registerScanning: 'Capturando su rostro. Manténgase en posición.',
  registerProcessing: 'Guardando su información biométrica.',
  registerSuccess: 'Registro completado correctamente. Ahora puede iniciar sesión.',
  registerAlreadyExists: 'Este rostro ya está registrado en nuestro sistema. Por favor inicie sesión.',
  
  // Camera & Face Detection
  cameraActivating: 'Activando cámara.',
  cameraError: 'No se pudo acceder a la cámara. Verifique los permisos.',
  faceNotDetected: 'No se detecta ningún rostro. Acérquese a la cámara.',
  faceNotCentered: 'Por favor centre su rostro dentro del marco.',
  faceMultiple: 'Solo debe haber una persona frente a la cámara.',
  faceNotVisible: 'Asegúrese de que su rostro esté completamente visible.',
  
  // General
  pleaseWait: 'Por favor espere.',
};

let speaking = false;
let voicesLoaded = false;

// Cargar voces al inicio
if (typeof window !== 'undefined' && window.speechSynthesis) {
  // Forzar la carga de voces
  window.speechSynthesis.getVoices();
  
  window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = true;
    console.log('Voces cargadas:', window.speechSynthesis.getVoices().length);
  };
  
  // Timeout para marcar como cargado después de 1 segundo
  setTimeout(() => {
    voicesLoaded = true;
  }, 1000);
}

function pickSpanishVoice() {
  if (!window.speechSynthesis) return null;
  
  const voices = window.speechSynthesis.getVoices();
  console.log('Voces disponibles:', voices.map(v => `${v.name} (${v.lang})`));
  
  return (
    voices.find((v) => v.lang.startsWith('es') && v.name.toLowerCase().includes('female')) ??
    voices.find((v) => v.lang.startsWith('es')) ??
    voices.find((v) => v.lang.includes('ES')) ??
    voices[0]
  );
}

export function speak(text) {
  if (!window.speechSynthesis || !text) {
    console.warn('SpeechSynthesis no disponible o texto vacío');
    return;
  }

  // Cancelar cualquier síntesis anterior
  window.speechSynthesis.cancel();

  // Esperar un momento antes de hablar
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voice = pickSpanishVoice();
    if (voice) {
      utterance.voice = voice;
      console.log('Usando voz:', voice.name);
    } else {
      console.warn('No se encontró voz en español');
    }

    speaking = true;
    
    utterance.onstart = () => {
      console.log('🔊 Reproduciendo:', text);
    };
    
    utterance.onend = () => {
      speaking = false;
      console.log('✅ Voz completada');
    };
    
    utterance.onerror = (event) => {
      speaking = false;
      // Solo mostrar error si no es "interrupted" (que es normal)
      if (event.error !== 'interrupted') {
        console.error('❌ Error en síntesis de voz:', event.error);
      }
    };
    
    window.speechSynthesis.speak(utterance);
  }, 150);
}

// ===== LOGIN =====
export function speakLoginStarting() {
  console.log('🔊 Hablando: Iniciando login');
  speak(MESSAGES.loginStarting);
}

export function speakLoginScanning() {
  console.log('🔊 Hablando: Escaneando rostro');
  speak(MESSAGES.loginScanning);
}

export function speakLoginSuccess(name) {
  console.log('🔊 Hablando: Login exitoso -', name);
  speak(MESSAGES.loginSuccess(name));
}

export function speakLoginNotFound() {
  console.log('🔊 Hablando: Usuario no encontrado');
  speak(MESSAGES.loginNotFound);
}

export function speakLoginError() {
  console.log('🔊 Hablando: Error de login');
  speak(MESSAGES.loginError);
}

// ===== REGISTER =====
export function speakRegisterStarting() {
  console.log('🔊 Hablando: Iniciando registro');
  speak(MESSAGES.registerStarting);
}

export function speakRegisterScanning() {
  console.log('🔊 Hablando: Escaneando para registro');
  speak(MESSAGES.registerScanning);
}

export function speakRegisterProcessing() {
  console.log('🔊 Hablando: Procesando registro');
  speak(MESSAGES.registerProcessing);
}

export function speakRegisterSuccess() {
  console.log('🔊 Hablando: Registro exitoso');
  speak(MESSAGES.registerSuccess);
}

export function speakRegisterAlreadyExists() {
  console.log('🔊 Hablando: Usuario ya registrado');
  speak(MESSAGES.registerAlreadyExists);
}

// ===== CAMERA & FACE =====
export function speakCameraActivating() {
  console.log('🔊 Hablando: Activando cámara');
  speak(MESSAGES.cameraActivating);
}

export function speakCameraError() {
  console.log('🔊 Hablando: Error de cámara');
  speak(MESSAGES.cameraError);
}

export function speakFaceNotDetected() {
  console.log('🔊 Hablando: Rostro no detectado');
  speak(MESSAGES.faceNotDetected);
}

export function speakFaceNotCentered(reason = 'center') {
  console.log('🔊 Hablando: Rostro no centrado');
  const messages = {
    center: MESSAGES.faceNotCentered,
    multiple: MESSAGES.faceMultiple,
    visibility: MESSAGES.faceNotVisible,
    none: MESSAGES.faceNotDetected,
  };
  speak(messages[reason] ?? MESSAGES.faceNotCentered);
}

// ===== GENERAL =====
export function speakPleaseWait() {
  console.log('🔊 Hablando: Por favor espere');
  speak(MESSAGES.pleaseWait);
}

// Mantener compatibilidad con nombres antiguos
export function speakUserNotRegistered() {
  speakLoginNotFound();
}

export function speakWelcome(name) {
  speakLoginSuccess(name);
}
