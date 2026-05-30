import { useState } from 'react';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop con blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-5xl h-[600px] bg-gradient-to-br from-white/80 via-white/70 to-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden animate-scaleIn">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-on-surface hover:bg-white/30 hover:rotate-90 transition-all duration-300"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Efectos de fondo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Grid de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(74, 101, 73, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 101, 73, 0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="relative h-full flex">
          {/* Panel deslizante - Login */}
          <div 
            className={`absolute inset-0 flex transition-all duration-700 ease-in-out ${
              isLogin 
                ? 'translate-x-0 opacity-100' 
                : isAnimating 
                  ? 'translate-x-full opacity-0 scale-95' 
                  : 'translate-x-full opacity-0'
            }`}
          >
            {/* Lado izquierdo - Formulario Login */}
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    </div>
                    <span className="font-semibold text-2xl text-on-surface tracking-tight">EcoSorteo AI</span>
                  </div>
                  <h2 className="text-4xl font-bold text-on-surface mb-3 tracking-tight">Bienvenido de vuelta</h2>
                  <p className="text-on-surface-variant/70">Ingresa tus credenciales para continuar</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Correo electrónico</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">mail</span>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/70 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Contraseña</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">lock</span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/70 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/40" />
                      <span className="text-on-surface-variant">Recordarme</span>
                    </label>
                    <a href="#" className="text-primary font-medium hover:underline">¿Olvidaste tu contraseña?</a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary font-semibold py-4 rounded-2xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <span>Iniciar Sesión</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>

                  <div className="text-center text-sm text-on-surface-variant">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-primary font-semibold hover:underline"
                    >
                      Regístrate aquí
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Lado derecho - Imagen decorativa Login */}
            <div className="hidden md:flex w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5fVkbxRYIZ2eMYBPeurtAh7tNhHcPZl2cVBk8aedVCQ2hNo0B7Inc9bmiov6aA-n_1PRGT9LGKaIfKr6j1v4JIawreEL49VRdn3wEOMIcZLutiQGljAmhDK_A4GXA42V46d5ZcvPySIheaY2T_MMKyCBssHkRFLuO40OFFExu8lMfVispcbQKgG7uBmhnE1Z9R8mjLfgG-Vu9REW3ETbzbh40VeQCeEop_Qpz2z3P2ZHV90Hjpv7_cBnURvRckU99UMUnSsWDhIXS"
                alt="Login background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12 text-white">
                <h3 className="text-3xl font-bold mb-3">Gestión Inteligente de Residuos</h3>
                <p className="text-white/90 text-lg">Únete a la revolución verde impulsada por IA</p>
              </div>
            </div>
          </div>

          {/* Panel deslizante - Registro */}
          <div 
            className={`absolute inset-0 flex transition-all duration-700 ease-in-out ${
              !isLogin 
                ? 'translate-x-0 opacity-100' 
                : isAnimating 
                  ? '-translate-x-full opacity-0 scale-95' 
                  : '-translate-x-full opacity-0'
            }`}
          >
            {/* Lado izquierdo - Imagen decorativa Registro */}
            <div className="hidden md:flex w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBILAS-ABKWilEllw0XsJ6VPUxZWp8stKzv8-NJNlyboxtYkLsvc0d7XsOM0ej9mZ8DzX6VFBtPCUxC5Y7TGZUEOwVlooy1WenfrkBE1UepCf2uOnl1HTCq-QbLMz6uCsA-Zj-XW_0IEnxo7thPoboW7htIigiR7EowEz4eimG_HahqwnIX3E0wN3JpQDToXRNW6tHXXar-0k_lX5dOPEqARj4A-hPub5eOYNyFDbrNEGYdKfqCJl8rcjMLJwQm-e1sbAkhSMc2Gx4S"
                alt="Register background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12 text-white">
                <h3 className="text-3xl font-bold mb-3">Comienza tu Impacto Ambiental</h3>
                <p className="text-white/90 text-lg">Crea tu cuenta y forma parte del cambio</p>
              </div>
            </div>

            {/* Lado derecho - Formulario Registro */}
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    </div>
                    <span className="font-semibold text-2xl text-on-surface tracking-tight">EcoSorteo AI</span>
                  </div>
                  <h2 className="text-4xl font-bold text-on-surface mb-3 tracking-tight">Crea tu cuenta</h2>
                  <p className="text-on-surface-variant/70">Únete a la red de gestión sostenible</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Nombre completo</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">person</span>
                      <input
                        type="text"
                        placeholder="Juan Pérez"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/70 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Correo electrónico</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">mail</span>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/70 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Contraseña</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">lock</span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/70 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Confirmar contraseña</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">lock</span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/70 transition-all"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer text-sm">
                    <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-outline-variant/30 text-secondary focus:ring-secondary/40" />
                    <span className="text-on-surface-variant">
                      Acepto los <a href="#" className="text-secondary font-medium hover:underline">términos y condiciones</a> y la <a href="#" className="text-secondary font-medium hover:underline">política de privacidad</a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full bg-secondary text-on-secondary font-semibold py-4 rounded-2xl hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
                  >
                    <span>Crear Cuenta</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>

                  <div className="text-center text-sm text-on-surface-variant">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-secondary font-semibold hover:underline"
                    >
                      Inicia sesión aquí
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
