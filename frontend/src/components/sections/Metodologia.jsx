export default function Metodologia() {
  return (
    <section className="relative py-32 px-container-padding-mobile md:px-container-padding-desktop bg-gradient-to-b from-background via-surface-container-low/20 to-background overflow-hidden" id="metodologia">
      {/* Fondo ambiental futurista */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-primary/40 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-secondary/35 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header cinematográfico */}
        <div className="mb-20 text-center reveal">
          <span className="text-primary font-label-md tracking-[0.15em] uppercase text-xs opacity-80">Nuestra Metodología</span>
          <h2 className="font-headline-md text-[2.75rem] md:text-[3.5rem] leading-[1.1] text-on-surface mt-5 mb-6 tracking-tight">
            Eco-Módulos Inteligentes
          </h2>
          <p className="text-on-surface-variant/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Infraestructura de reciclaje impulsada por inteligencia artificial de próxima generación
          </p>
        </div>

        {/* Layout asimétrico moderno */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-16">
          {/* Imagen principal premium - 7 columnas */}
          <div className="lg:col-span-7 reveal">
            <div className="methodology-hero group relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden">
                <img 
                  alt="Estación de gestión de residuos de diseño minimalista" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBILAS-ABKWilEllw0XsJ6VPUxZWp8stKzv8-NJNlyboxtYkLsvc0d7XsOM0ej9mZ8DzX6VFBtPCUxC5Y7TGZUEOwVlooy1WenfrkBE1UepCf2uOnl1HTCq-QbLMz6uCsA-Zj-XW_0IEnxo7thPoboW7htIigiR7EowEz4eimG_HahqwnIX3E0wN3JpQDToXRNW6tHXXar-0k_lX5dOPEqARj4A-hPub5eOYNyFDbrNEGYdKfqCJl8rcjMLJwQm-e1sbAkhSMc2Gx4S" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>

                {/* Badge de estado superior */}
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/30 shadow-lg">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping absolute"></div>
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-white font-medium text-xs tracking-wide uppercase">Sistema Activo</span>
                </div>

                {/* Líneas de escaneo IA */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-pulse"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Contenido inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl"></div>
                      <div className="relative bg-white/15 backdrop-blur-xl w-16 h-16 rounded-2xl flex items-center justify-center border border-white/30">
                        <span className="material-symbols-outlined text-3xl text-white">precision_manufacturing</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30">
                      <span className="text-white text-sm font-bold">99.8% Precisión</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-[1.75rem] mb-3 text-white tracking-tight">Clasificación por IA</h3>
                  <p className="font-body-md text-white/90 max-w-md leading-relaxed">Sensores ópticos de última generación que identifican materiales con precisión en milisegundos</p>
                </div>

                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/60 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary/80 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>

              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 -z-10"></div>
            </div>
          </div>

          {/* Módulos inteligentes - 5 columnas */}
          <div className="lg:col-span-5 space-y-6 reveal">
            {/* Módulo 1: Plástico & Vidrio */}
            <div className="methodology-module group relative overflow-hidden bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-2xl rounded-2xl p-8 border border-white/60 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="absolute -left-4 top-1/2 w-4 h-px bg-gradient-to-r from-primary/40 to-transparent hidden lg:block"></div>
              
              <div className="relative flex items-start gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-primary text-2xl">recycling</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-on-surface text-lg tracking-tight">Plástico & Vidrio</h4>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-on-surface-variant/80 text-sm leading-relaxed">Transformamos envases en materia prima para impresión 3D arquitectónica sostenible</p>
                </div>
              </div>
            </div>

            {/* Módulo 2: Orgánico & Compost */}
            <div className="methodology-module group relative overflow-hidden bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-2xl rounded-2xl p-8 border border-white/60 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="absolute -left-4 top-1/2 w-4 h-px bg-gradient-to-r from-secondary/40 to-transparent hidden lg:block"></div>
              
              <div className="relative flex items-start gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary/20 rounded-xl blur-lg"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-on-surface text-lg tracking-tight">Orgánico & Compost</h4>
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <p className="text-on-surface-variant/80 text-sm leading-relaxed">Sistemas de degradación acelerada para reforestar cuencas y suelos locales agotados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flujo del proceso */}
        <div className="mt-20 reveal">
          <div className="relative bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/60 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl"></div>
            
            <div className="absolute inset-0 opacity-[0.02] rounded-3xl" style={{ backgroundImage: 'linear-gradient(rgba(74, 101, 73, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 101, 73, 0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative">
              <h3 className="text-center text-on-surface font-semibold text-xl mb-10 tracking-tight">Flujo del Ecosistema Inteligente</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: 'sensors', title: 'Captura', subtitle: 'Sensores ópticos', color: 'primary' },
                  { icon: 'psychology', title: 'Clasificación IA', subtitle: '99.8% precisión', color: 'primary' },
                  { icon: 'factory', title: 'Procesamiento', subtitle: 'Transformación', color: 'secondary' },
                  { icon: 'eco', title: 'Impacto', subtitle: 'Regeneración', color: 'primary', fill: true }
                ].map((step, index) => (
                  <div key={index} className="process-step group text-center">
                    <div className="relative mx-auto w-16 h-16 mb-4">
                      <div className={`absolute inset-0 bg-${step.color}/20 rounded-full blur-xl group-hover:blur-2xl transition-all`}></div>
                      <div className={`relative w-full h-full bg-gradient-to-br from-${step.color}/30 to-${step.color}/10 rounded-full flex items-center justify-center border border-${step.color}/30 group-hover:scale-110 transition-transform duration-500`}>
                        <span className={`material-symbols-outlined text-${step.color} text-2xl`} style={step.fill ? { fontVariationSettings: "'FILL' 1" } : {}}>{step.icon}</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-on-surface mb-1">{step.title}</div>
                    <div className="text-xs text-on-surface-variant/70">{step.subtitle}</div>
                    {index < 3 && <div className={`hidden md:block absolute top-8 -right-3 w-6 h-px bg-gradient-to-r from-${step.color}/40 to-transparent`}></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
