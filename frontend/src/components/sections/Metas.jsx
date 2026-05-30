export default function Metas() {
  return (
    <section className="relative py-32 px-container-padding-mobile md:px-container-padding-desktop overflow-hidden" id="metas">
      {/* Fondo sutil con overlay mejorado */}
      <div className="absolute inset-0 opacity-[0.08]">
        <img 
          alt="Textura orgánica macro" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5fVkbxRYIZ2eMYBPeurtAh7tNhHcPZl2cVBk8aedVCQ2hNo0B7Inc9bmiov6aA-n_1PRGT9LGKaIfKr6j1v4JIawreEL49VRdn3wEOMIcZLutiQGljAmhDK_A4GXA42V46d5ZcvPySIheaY2T_MMKyCBssHkRFLuO40OFFExu8lMfVispcbQKgG7uBmhnE1Z9R8mjLfgG-Vu9REW3ETbzbh40VeQCeEop_Qpz2z3P2ZHV90Hjpv7_cBnURvRckU99UMUnSsWDhIXS" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface-container-low/50 to-background"></div>

      {/* Glow ambiental sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header de la sección */}
        <div className="text-center mb-16 reveal">
          <span className="text-primary font-label-md tracking-[0.15em] uppercase text-xs opacity-80">Metas 2030</span>
          <h2 className="font-headline-md text-[2.75rem] md:text-[3.5rem] leading-[1.1] text-on-surface mt-5 mb-6 tracking-tight">
            Impacto Proyectado
          </h2>
          <p className="text-on-surface-variant/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Transformando residuos en recursos mediante inteligencia artificial y gobernanza descentralizada
          </p>
        </div>

        {/* Grid de métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 reveal">
          {[
            { icon: 'recycling', value: '8.5k', label: 'Toneladas Recicladas', badge: '+340% vs 2024', color: 'primary' },
            { icon: 'home', value: '2.4M', label: 'Hogares Conectados', badge: 'Red descentralizada', color: 'secondary' },
            { icon: 'location_city', value: '450', label: 'Ciudades Inteligentes', badge: 'Iberoamérica', color: 'primary' }
          ].map((metric, index) => (
            <div key={index} className="metric-card group relative overflow-hidden bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/60 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-700">
              <div className={`absolute inset-0 bg-gradient-to-br from-${metric.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
              <div className={`absolute top-0 right-0 w-40 h-40 bg-${metric.color}/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${metric.color}/20 to-${metric.color}/10 rounded-2xl flex items-center justify-center text-${metric.color} shadow-sm`}>
                    <span className="material-symbols-outlined text-2xl">{metric.icon}</span>
                  </div>
                  <div className={`w-2 h-2 bg-${metric.color} rounded-full animate-pulse`} style={{ animationDelay: `${index * 0.3}s` }}></div>
                </div>
                <div className="text-5xl md:text-6xl font-bold text-on-surface mb-2 tracking-tight">{metric.value}</div>
                <div className="text-sm uppercase tracking-wider text-on-surface-variant/70 font-medium">{metric.label}</div>
                <div className="mt-4 pt-4 border-t border-outline-variant/20">
                  <span className={`text-xs text-${metric.color} font-medium`}>{metric.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid de mini métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 reveal">
          {[
            { value: '99.8%', label: 'Precisión IA' },
            { value: '-15k', label: 'Ton CO₂ Evitadas' },
            { value: '120k+', label: 'Árboles Plantados' },
            { value: '1,200', label: 'Módulos Activos' }
          ].map((mini, index) => (
            <div key={index} className="mini-metric bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 hover:bg-white/50 transition-all duration-500">
              <div className="text-3xl font-bold text-primary mb-1">{mini.value}</div>
              <div className="text-xs uppercase tracking-wider text-on-surface-variant/70">{mini.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Premium */}
        <div className="reveal">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white/60 to-secondary/10 backdrop-blur-2xl rounded-3xl p-12 md:p-16 border border-white/60 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-on-surface mb-4 tracking-tight">
                ¿Listo para cultivar el cambio?
              </h3>
              <p className="text-on-surface-variant/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Únete a la red descentralizada de gestión de residuos más avanzada de Iberoamérica
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input 
                  className="flex-1 bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl px-7 py-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/80 transition-all shadow-sm" 
                  placeholder="Tu correo electrónico" 
                  type="email" 
                />
                <button className="bg-primary text-on-primary font-semibold px-10 py-4 rounded-2xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap">
                  <span>Solicitar Demo</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
              </form>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-on-surface-variant/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Sin compromiso</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Respuesta en 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transición elegante hacia la siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-surface-container-lowest pointer-events-none"></div>
    </section>
  );
}
