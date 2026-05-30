export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Video de fondo */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover scale-125"
          >
            <source src="/kling_20260529_作品_Cinematic _5804_0.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="relative z-10 text-center px-container-padding-mobile md:px-container-padding-desktop flex flex-col items-center justify-center gap-5" id="heroContent">
        {/* Badge superior */}
        <div className="hero-badge">
          Inteligencia Ambiental · 2026
        </div>
        
        {/* Título */}
        <h1 className="hero-title-new">
          El Futuro se <br />
          <span className="hero-siembra-new">Siembra</span> Hoy
        </h1>
        
        {/* Subtítulo */}
        <p className="hero-subtitle-new">
          Inteligencia artificial al servicio de la tierra. Clasificamos, premiamos y restauramos ecosistemas a través de la gestión circular de residuos.
        </p>
        
        {/* Botones */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
          <button className="hero-btn-primary">
            <span className="material-symbols-outlined">eco</span> Comenzar Impacto
          </button>
          <a className="hero-btn-secondary" href="#vision">
            Ver Visión
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-pronounced opacity-50">
        <span className="material-symbols-outlined text-4xl text-white">keyboard_double_arrow_down</span>
      </div>
    </section>
  );
}
