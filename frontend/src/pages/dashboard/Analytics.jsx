import { useEffect, useRef } from 'react';
import RecyclingMapModule from '../../components/recycling-map/RecyclingMapModule';
import './Analytics.css';

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL'];

const REPORTS = [
  {
    icon: 'local_shipping',
    iconClass: 'an-report-icon-primary',
    title: 'Sector Norte A-12',
    meta: 'Hace 12 mins • 4.2 tons',
    badge: 'OPTIMAL',
    badgeClass: 'an-badge-optimal',
    opacity: 1,
  },
  {
    icon: 'factory',
    iconClass: 'an-report-icon-tertiary',
    title: 'Planta de Tratamiento',
    meta: 'Hace 24 mins • 12.8 tons',
    badge: 'ACTIVE',
    badgeClass: 'an-badge-active',
    opacity: 0.8,
  },
  {
    icon: 'warning',
    iconClass: 'an-report-icon-error',
    title: 'Centro Logístico',
    meta: 'Hace 1 hora • Error Sync',
    badge: 'ALERT',
    badgeClass: 'an-badge-alert',
    opacity: 0.6,
  },
];

const PARTNER_LOGOS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBolBfbvm7UmhpYSC_iyI0B3q35756KsaM61iPX39LUSvek11I93_BmtLeCgUnIP8GvnCCNxHbAnIugejcJDMWaeHYgx9MjHexEuxuOWcuH5Ks8U_9F5TVq_SO-IPfSvfsTKNg7R9SjRLVeeC4q-FJCyI_vd0s8jb9niiNalCl3PITO0sCrzf8jY6Fnyh2pVPWlFCaVcyWHlGojs9SLKGoHUzmThEaFxzkFoP7RrXhr-9LaeK0nFiZ5Kd68WJYX_KKF6gmm1rsMjlk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBgW0B29r03NofuATtHZ9lmOi8e02t3EqPOScyEKnKUBigG8rAeHwzfYnGjgtzmkoHIf_A8I2rrt2AYHsV9Izn1XG5pkpKwY1__zAlhq4O5vSpmjz3RgvemvyfECzo0QkcyeWUdU4zm9z-9udMt9b-qd1s9dHa16uIgGp4ECDCtRiC9-5Qj74XJmtyZ6SWI_brttpa6b7Ht6WUzTvOokf-iVWbrcePz2SmwsRG-UB4Oz2zqPx2BpRNt32W-tW35pdScCFBbXnbb90E',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAGNFa_QfvioTODZKwHxbAGMvspOQcJST1OZQyv-LMld8YS5JCC9hDVnjecpZL76s0LmZB6h_53FsHs9cU9p7nTZPntZ77mC9__9q_thm1DMCIMUaAOKkOJeg7_6XNRBVYMJ6AF-qf9u1wdAYhjTHQ-g6OcIxkYNZTfXT_ddDEybLya3bYISiNxE1oRM10zHcuOI815VHejf7yoNTGyKAYlQ3fxa5OH-loV-f_Vp_dBe4pVYp64rmkqIcTmgL36-IBifbDGK9BJWU',
];

export default function Analytics() {
  const pageRef = useRef(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return undefined;

    const cards = root.querySelectorAll('.an-glass-card');

    const cardHandlers = Array.from(cards).map((card) => {
      const onEnter = () => {
        card.style.transform = 'translateY(-4px)';
        card.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      };
      const onLeave = () => {
        card.style.transform = 'translateY(0)';
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      return { card, onEnter, onLeave };
    });

    return () => {
      cardHandlers.forEach(({ card, onEnter, onLeave }) => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <div ref={pageRef} className="an-page content-container">
      <div className="an-atmosphere" aria-hidden="true">
        <div className="an-blob an-blob-a" />
        <div className="an-blob an-blob-b" />
      </div>

      <header className="an-header">
        <div>
          <h2 className="an-title">Analíticas Avanzadas</h2>
          <p className="an-subtitle">
            Monitorización de flujo circular en tiempo real con precisión de grado industrial y métricas de impacto ecológico.
          </p>
        </div>
        <div className="an-header-actions">
          <div className="an-live-badge">
            <span className="an-live-dot" />
            <span className="an-live-text">Sincronización Live</span>
          </div>
          <button type="button" className="an-icon-round" aria-label="Calendario">
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
        </div>
      </header>

      <div className="an-bento">
        {/* Impacto Ambiental Mensual — col-span-8 */}
        <section className="an-glass-card an-area-chart col-8">
          <div className="an-area-head">
            <div>
              <span className="an-kicker an-tracking-widest">Métrica Principal</span>
              <h3 className="an-card-title">Impacto Ambiental Mensual</h3>
            </div>
            <div className="an-metrics-row">
              <div className="an-metric">
                <p className="an-metric-label">Reducción CO2</p>
                <p className="an-metric-value an-text-primary">-24.8%</p>
              </div>
              <div className="an-metric">
                <p className="an-metric-label">Agua Ahorrada</p>
                <p className="an-metric-value an-text-tertiary">12.4k L</p>
              </div>
            </div>
          </div>
          <div className="an-area-body">
            <svg className="an-area-svg" viewBox="0 0 800 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="an-gradient-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line className="an-chart-grid-line" x1="0" y1="60" x2="800" y2="60" strokeDasharray="4" />
              <line className="an-chart-grid-line" x1="0" y1="120" x2="800" y2="120" strokeDasharray="4" />
              <line className="an-chart-grid-line" x1="0" y1="180" x2="800" y2="180" strokeDasharray="4" />
              <path
                d="M0,180 Q100,160 200,100 T400,140 T600,60 T800,20 L800,240 L0,240 Z"
                fill="url(#an-gradient-area)"
              />
              <path
                d="M0,180 Q100,160 200,100 T400,140 T600,60 T800,20"
                fill="none"
                stroke="#006c49"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="200" cy="100" r="4" fill="#006c49" />
              <circle cx="400" cy="140" r="4" fill="#006c49" />
              <circle cx="600" cy="60" r="4" fill="#006c49" />
            </svg>
            <div className="an-axis-labels">
              {MONTHS.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Eficiencia Operativa — col-span-4 */}
        <section className="an-glass-card an-radar-card col-4">
          <div className="an-radar-head">
            <span className="an-kicker an-tracking-widest">Rendimiento</span>
            <h3 className="an-card-title">Eficiencia Operativa</h3>
          </div>
          <div className="an-radar-wrap">
            <svg className="an-radar-svg" viewBox="0 0 100 100">
              <polygon
                points="50,5 95,25 95,75 50,95 5,75 5,25"
                fill="none"
                stroke="rgba(108, 122, 113, 0.2)"
                strokeWidth="0.5"
              />
              <polygon
                points="50,20 80,35 80,65 50,80 20,65 20,35"
                fill="none"
                stroke="rgba(108, 122, 113, 0.2)"
                strokeWidth="0.5"
              />
              <polygon
                points="50,15 85,30 75,70 50,85 15,65 25,35"
                fill="#10b981"
                fillOpacity="0.2"
                stroke="#006c49"
                strokeWidth="1.5"
              />
              <line x1="50" y1="50" x2="50" y2="5" stroke="rgba(108, 122, 113, 0.1)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="95" y2="25" stroke="rgba(108, 122, 113, 0.1)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="95" y2="75" stroke="rgba(108, 122, 113, 0.1)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="95" stroke="rgba(108, 122, 113, 0.1)" strokeWidth="0.5" />
            </svg>
            <span className="an-radar-label an-radar-label-top">VELOCIDAD</span>
            <span className="an-radar-label an-radar-label-rt">ENERGÍA</span>
            <span className="an-radar-label an-radar-label-rb">COSTO</span>
            <span className="an-radar-label an-radar-label-bottom">CALIDAD</span>
          </div>
          <div className="an-radar-stats">
            <div className="an-radar-stat an-radar-stat-primary">
              <p>Global Score</p>
              <strong>92%</strong>
            </div>
            <div className="an-radar-stat an-radar-stat-tertiary">
              <p>Optimización</p>
              <strong>+14%</strong>
            </div>
          </div>
        </section>

        {/* Mapa — col-span-12 */}
        <section className="an-glass-card an-map-card col-12">
          <div className="an-map-head">
            <div>
              <span className="an-kicker an-tracking-widest">Geolocalización</span>
              <h3 className="an-card-title">Puntos de Recolección Activos</h3>
              <p className="an-map-subtitle">Lima · Supabase + mapa interactivo</p>
            </div>
          </div>
          <RecyclingMapModule embedded />
        </section>

        {/* Flujo de Residuos — col-span-7 */}
        <section className="an-glass-card an-flow-chart col-7">
          <div className="an-flow-head">
            <span className="an-kicker an-tracking-widest">Distribución Circular</span>
            <h3 className="an-card-title">Flujo de Residuos por Categoría</h3>
          </div>
          <div className="an-line-chart-box chart-grid">
            <svg className="an-flow-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
              <path
                d="M0,150 L50,130 L100,160 L150,110 L200,140 L250,90 L300,120 L350,100 L400,130 L450,80 L500,100"
                fill="none"
                stroke="#006c49"
                strokeWidth="2"
              />
              <path
                d="M0,120 L50,150 L100,110 L150,140 L200,90 L250,120 L300,100 L350,130 L400,80 L450,110 L500,70"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              <path
                d="M0,180 L50,160 L100,170 L150,150 L200,160 L250,140 L300,150 L350,130 L400,150 L450,120 L500,140"
                fill="none"
                stroke="#306d58"
                strokeWidth="2"
              />
            </svg>
            <div className="an-y-axis">
              <span>100t</span>
              <span>75t</span>
              <span>50t</span>
              <span>25t</span>
              <span>0</span>
            </div>
          </div>
          <div className="an-legend">
            <div className="an-legend-item">
              <span className="an-dot an-dot-primary" />
              <span>Orgánico</span>
            </div>
            <div className="an-legend-item">
              <span className="an-dot an-dot-container" />
              <span>Plástico</span>
            </div>
            <div className="an-legend-item">
              <span className="an-dot an-dot-secondary" />
              <span>Vidrio</span>
            </div>
            <div className="an-legend-item">
              <span className="an-dot an-dot-outline" />
              <span>Papel</span>
            </div>
          </div>
        </section>

        {/* Registros Recientes — col-span-5 */}
        <section className="an-glass-card an-reports-card col-5">
          <div className="an-reports-head">
            <h3 className="an-card-title">Registros Recientes</h3>
            <button type="button" className="an-link-btn">Ver Todo</button>
          </div>
          <div className="an-reports-list">
            {REPORTS.map((r) => (
              <div key={r.title} className="an-report-row" style={{ opacity: r.opacity }}>
                <div className="an-report-left">
                  <div className={`an-report-icon ${r.iconClass}`}>
                    <span className="material-symbols-outlined">{r.icon}</span>
                  </div>
                  <div>
                    <p className="an-report-title">{r.title}</p>
                    <p className="an-report-meta">{r.meta}</p>
                  </div>
                </div>
                <span className={`an-report-badge ${r.badgeClass}`}>{r.badge}</span>
              </div>
            ))}
          </div>
          <div className="an-insight-card group">
            <div className="an-insight-inner">
              <p className="an-insight-kicker">IA Insights</p>
              <p className="an-insight-text">
                El flujo de plásticos ha disminuido un 12% tras la optimización del sector este.
              </p>
            </div>
            <span className="material-symbols-outlined an-insight-deco">auto_awesome</span>
          </div>
        </section>
      </div>

      <section className="an-footer-section">
        <div className="an-glass-card an-commitment">
          <div className="an-commitment-icon-wrap">
            <span className="material-symbols-outlined an-commitment-icon">public</span>
          </div>
          <h4 className="an-commitment-title">Compromiso Neto Cero</h4>
          <p className="an-commitment-text">
            EcoTech OS utiliza algoritmos de optimización para reducir la huella de carbono de su logística urbana en un 40% anual.
          </p>
          <div className="an-partner-logos">
            {PARTNER_LOGOS.map((src, i) => (
              <img key={i} src={src} alt="" className="an-partner-logo" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
