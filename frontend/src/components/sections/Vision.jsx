export default function Vision() {
  return (
    <section className="py-24 md:py-32 px-container-padding-mobile md:px-container-padding-desktop overflow-hidden" id="vision">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Contenido de texto - 55% */}
          <div className="w-full md:w-[55%] reveal space-y-8">
            <div className="max-w-xl">
              <span className="text-primary font-label-md tracking-[0.15em] uppercase text-xs opacity-80">Nuestra Visión</span>
              <h2 className="font-headline-md text-[2.5rem] md:text-[3rem] leading-[1.15] text-on-surface mt-5 mb-6 tracking-tight">
                Hacia una Civilización de Residuo Cero
              </h2>
              <p className="font-body-lg text-[1.125rem] leading-[1.75] text-on-surface-variant/90 max-w-lg">
                Nuestra visión para 2030 es establecer la red de gestión de residuos más grande y eficiente del mundo, impulsada por IA y gobernanza comunitaria. No solo gestionamos basura; transformamos la percepción del residuo en un activo renovable.
              </p>
            </div>

            {/* Mini Cards Modernas */}
            <div className="space-y-4 max-w-xl">
              <div className="vision-card group relative overflow-hidden bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex gap-5 items-start">
                  <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-[1.4rem]">language</span>
                  </div>
                  <div className="flex-1">
                    <h6 className="font-semibold text-on-surface text-[1.05rem] mb-1.5 tracking-tight">Ecosistema Global</h6>
                    <p className="text-on-surface-variant/80 text-[0.9rem] leading-relaxed">Conectar cada hogar a una red de economía circular descentralizada.</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              <div className="vision-card group relative overflow-hidden bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex gap-5 items-start">
                  <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center text-secondary shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-[1.4rem]">auto_awesome</span>
                  </div>
                  <div className="flex-1">
                    <h6 className="font-semibold text-on-surface text-[1.05rem] mb-1.5 tracking-tight">IA Regenerativa</h6>
                    <p className="text-on-surface-variant/80 text-[0.9rem] leading-relaxed">Algoritmos que no solo clasifican, sino que optimizan la biodiversidad local.</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </div>
          </div>

          {/* Imagen - 45% */}
          <div className="w-full md:w-[45%] reveal">
            <div className="vision-image-container group relative">
              <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                
                <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden shadow-2xl shadow-primary/10 group-hover:shadow-3xl group-hover:shadow-primary/20 transition-all duration-700">
                  <img 
                    alt="Visión de ciudad verde y sostenible" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5fVkbxRYIZ2eMYBPeurtAh7tNhHcPZl2cVBk8aedVCQ2hNo0B7Inc9bmiov6aA-n_1PRGT9LGKaIfKr6j1v4JIawreEL49VRdn3wEOMIcZLutiQGljAmhDK_A4GXA42V46d5ZcvPySIheaY2T_MMKyCBssHkRFLuO40OFFExu8lMfVispcbQKgG7uBmhnE1Z9R8mjLfgG-Vu9REW3ETbzbh40VeQCeEop_Qpz2z3P2ZHV90Hjpv7_cBnURvRckU99UMUnSsWDhIXS" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary/5 opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/20 opacity-30"></div>
                  
                  <div className="absolute top-6 right-6 w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-secondary/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>

                <div className="absolute -bottom-3 -right-3 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg border border-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-500">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div>
                    <span className="text-xs font-medium text-primary tracking-wide">VISIÓN 2030</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
