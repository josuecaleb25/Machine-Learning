export default function Impacto() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-background via-surface-container-low/30 to-background overflow-hidden" id="impacto">
      {/* Fondo ambiental futurista */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/[0.03] rounded-full blur-[150px]"></div>
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-secondary/[0.04] rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[120px]"></div>
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-secondary/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop">
        {/* Header cinematográfico */}
        <div className="mb-20 reveal">
          <span className="text-secondary font-label-md tracking-[0.15em] uppercase text-xs opacity-80">Proyecciones 2026</span>
          <h2 className="font-headline-md text-[2.75rem] md:text-[3.5rem] leading-[1.1] text-on-surface mt-5 mb-6 tracking-tight">
            Impacto Ambiental Proyectado
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Columna izquierda: Métricas premium */}
          <div className="lg:col-span-5 space-y-8 reveal">
            {/* Métrica principal CO2 */}
            <div className="impact-metric-card group relative overflow-hidden bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative w-20 h-20 rounded-full border-4 border-primary/30 flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm">
                    <span className="text-3xl font-bold text-primary">-15k</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-lg text-on-surface mb-1">Toneladas de CO₂ Evitadas</h5>
                  <p className="text-on-surface-variant/70 text-sm leading-relaxed">Reducción directa mediante logística circular optimizada</p>
                </div>
              </div>
              <div className="absolute -right-4 top-1/2 w-8 h-px bg-gradient-to-r from-primary/30 to-transparent hidden lg:block"></div>
            </div>

            {/* Progress bar premium */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm font-medium text-on-surface">Toneladas de Residuos Procesados</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-xs text-on-surface-variant/60 uppercase tracking-wider">En tiempo real</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">8,500 t</span>
              </div>
              <div className="relative h-3 bg-white/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/60 shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
                <div className="relative h-full w-[45%] bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg shadow-primary/30 transition-all duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
                <span className="material-symbols-outlined text-sm text-primary">trending_up</span>
                <span>Meta 2026 proyectada</span>
              </div>
            </div>

            {/* Mini cards premium */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group relative overflow-hidden bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 hover:border-primary/30 hover:shadow-lg transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-xl">forest</span>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-4xl font-bold text-primary block mb-1">120k+</span>
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant/70 font-medium">Árboles para 2026</span>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 hover:border-secondary/30 hover:shadow-lg transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-secondary text-xl">location_city</span>
                    <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <span className="text-4xl font-bold text-secondary block mb-1">450</span>
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant/70 font-medium">Ciudades Inteligentes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Visualización 3D futurista */}
          <div className="lg:col-span-7 reveal">
            <div className="relative h-[600px] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl"></div>
              
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(74, 101, 73, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 101, 73, 0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              {/* Badge de estado */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/60 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/60 shadow-lg">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping absolute"></div>
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span className="text-primary font-medium text-xs tracking-wide uppercase">Sistema de Monitoreo Activo</span>
              </div>

              {/* Contenedor del gráfico 3D */}
              <div className="absolute inset-0 flex items-end justify-center p-12 gap-3">
                {[
                  { height: '30%', year: '2024' },
                  { height: '50%', year: '2025' },
                  { height: '65%', year: '2026' },
                  { height: '75%', year: '2027' },
                  { height: '85%', year: '2028' },
                  { height: '95%', year: '2029' },
                  { height: '100%', year: '2030', isMeta: true }
                ].map((bar, index) => (
                  <div key={index} className="chart-bar-3d group relative flex-1 max-w-[70px]" style={{ height: bar.height }}>
                    <div className={`absolute inset-0 bg-gradient-to-t from-primary/${30 + index * 10} via-primary/${20 + index * 10} to-primary/${15 + index * 10} rounded-t-2xl backdrop-blur-sm border ${bar.isMeta ? 'border-2 border-primary' : 'border-primary/' + (30 + index * 10)} shadow-xl shadow-primary/${20 + index * 10} group-hover:shadow-primary/${30 + index * 10} transition-all duration-500 group-hover:scale-105`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/${30 + index * 10} to-transparent rounded-t-2xl"></div>
                      <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/${30 + index * 10} to-transparent`}></div>
                      {bar.isMeta && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                          Meta 2030
                        </div>
                      )}
                    </div>
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs ${bar.isMeta ? 'text-primary font-bold' : 'text-on-surface-variant/50'} font-medium whitespace-nowrap`}>{bar.year}</div>
                  </div>
                ))}
              </div>

              {/* Líneas de conexión tipo network */}
              <svg className="absolute inset-0 pointer-events-none opacity-20" style={{ filter: 'blur(0.5px)' }}>
                <line x1="15%" y1="70%" x2="85%" y2="30%" stroke="url(#gradient1)" strokeWidth="1" strokeDasharray="4,4">
                  <animate attributeName="stroke-dashoffset" from="0" to="8" dur="2s" repeatCount="indefinite" />
                </line>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'rgb(74,101,73)', stopOpacity: 0 }} />
                    <stop offset="50%" style={{ stopColor: 'rgb(74,101,73)', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(74,101,73)', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-primary/40 rounded-full blur-sm"></div>
              <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-secondary/30 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
