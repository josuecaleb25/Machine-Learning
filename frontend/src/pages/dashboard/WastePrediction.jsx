import { useEffect, useState } from 'react';
import WasteScanner from './WasteScanner';
import './WastePrediction.css';

const COMPOSITION = [
  { label: 'Orgánico %', value: '42.5', tone: 'primary' },
  { label: 'Plástico %', value: '28.1', tone: 'secondary' },
  { label: 'Vidrio %', value: '14.9', tone: 'tertiary' },
  { label: 'Papel %', value: '14.5', tone: 'neutral' },
];

const LOGS = [
  {
    icon: 'eco',
    iconClass: 'log-icon-primary',
    title: 'Restos Orgánicos',
    time: '14:22:05',
    desc: 'Materia biodegradable detectada',
    tag: 'Alta Densidad',
    tagClass: 'tag-secondary',
  },
  {
    icon: 'shopping_bag',
    iconClass: 'log-icon-secondary',
    title: 'Envase Plástico (PET)',
    time: '14:21:48',
    desc: 'Botella transparente - Clasificada',
    tag: 'Reciclable',
    tagClass: 'tag-primary',
  },
  {
    icon: 'wine_bar',
    iconClass: 'log-icon-tertiary',
    title: 'Vidrio Cristalino',
    time: '14:19:30',
    desc: 'Vidrio neutro - Optimizado',
    tag: 'Reutilización Elite',
    tagClass: 'tag-tertiary',
  },
  {
    icon: 'news',
    iconClass: 'log-icon-neutral',
    title: 'Papel Mix',
    time: '14:15:12',
    desc: 'Celulosa reciclable detectada',
    tag: null,
    tagClass: '',
  },
];

const WEEKLY_BARS = [
  { label: 'Lun', height: 45, weight: '84kg', opacity: 0.2 },
  { label: 'Mar', height: 60, weight: '112kg', opacity: 0.3 },
  { label: 'Mié', height: 85, weight: '156kg', opacity: 0.4 },
  { label: 'Jue', height: 55, weight: '98kg', opacity: 0.25 },
  { label: 'Vie', height: 70, weight: '130kg', opacity: 0.5 },
  { label: 'Hoy', height: 95, weight: '178kg', opacity: 0.9, today: true },
  { label: 'Dom', height: 40, weight: '72kg', opacity: 0.3, muted: true },
];

export default function WastePrediction() {
  const [todayHeight, setTodayHeight] = useState(95);

  useEffect(() => {
    const cards = document.querySelectorAll('.wp-glass-card');
    const handlers = [];

    cards.forEach((card) => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y - rect.height / 2) / 25;
        const rotateY = (rect.width / 2 - x) / 25;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      };
      const onLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      handlers.push({ card, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTodayHeight((h) => {
        const variance = Math.floor(Math.random() * 5) - 2;
        return Math.min(100, Math.max(80, h + variance));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wp-page content-container">
      <header className="wp-header">
        <div>
          <h2 className="wp-title">Predicción de Residuos</h2>
          <div className="wp-status-row">
            <div className="wp-status-badge">
              <span className="wp-pulse-dot"></span>
              <span>Clasificación en Tiempo Real Activa</span>
            </div>
          </div>
        </div>
        <div className="wp-header-right">
          <p className="wp-header-label">Optimización de Logística</p>
          <div className="wp-collection-time">
            <span className="material-symbols-outlined">schedule</span>
            <span>Próxima recolección optimizada: 08:30 AM</span>
          </div>
        </div>
      </header>

      <div className="wp-grid-main">
        <section className="wp-scanner-section">
          <WasteScanner />
        </section>

        <section className="wp-logs-section">
          <div className="wp-glass-card wp-logs-card">
            <div className="wp-logs-header">
              <h3>Registros Recientes</h3>
              <span className="material-symbols-outlined wp-history-icon">history</span>
            </div>
            <div className="wp-logs-list">
              {LOGS.map((log) => (
                <div key={log.title} className="wp-log-item">
                  <div className={`wp-log-icon ${log.iconClass}`}>
                    <span className="material-symbols-outlined">{log.icon}</span>
                  </div>
                  <div className="wp-log-body">
                    <div className="wp-log-title-row">
                      <p className="wp-log-title">{log.title}</p>
                      <span className="wp-log-time">{log.time}</span>
                    </div>
                    <p className="wp-log-desc">{log.desc}</p>
                    {log.tag && <span className={`wp-log-tag ${log.tagClass}`}>{log.tag}</span>}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="wp-logs-footer-btn">
              Ver historial completo
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>

      <section className="wp-predictive-section">
        <div className="wp-predictive-grid">
          <div className="wp-predictive-copy">
            <h2 className="wp-section-title">Eficiencia Predictiva por IA</h2>
            <p className="wp-section-text">
              Nuestro modelo de red neuronal de vanguardia analiza los patrones de consumo locales para predecir la saturación de los contenedores con un 98.4% de precisión, optimizando las rutas de recogida en tiempo real.
            </p>
            <div className="wp-feature-list">
              <div className="wp-feature">
                <span className="material-symbols-outlined wp-feature-icon">bolt</span>
                <div>
                  <h4>Procesamiento Neural</h4>
                  <p>Clasificación instantánea mediante visión artificial</p>
                </div>
              </div>
              <div className="wp-feature">
                <span className="material-symbols-outlined wp-feature-icon">route</span>
                <div>
                  <h4>Rutas Dinámicas</h4>
                  <p>Reducción del 30% en emisiones de CO2 logística</p>
                </div>
              </div>
            </div>
          </div>

          <div className="wp-chart-wrap">
            <div className="wp-glass-card wp-weekly-chart">
              <div className="wp-chart-header">
                <h3>Proyección de Recolección Semanal</h3>
                <div className="wp-chart-tabs">
                  <button type="button" className="wp-tab active">En vivo</button>
                  <button type="button" className="wp-tab">Historial</button>
                </div>
              </div>
              <div className="wp-chart-area">
                <div className="wp-chart-grid-lines">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="wp-chart-grid-line"></div>
                  ))}
                </div>
                <div className="wp-chart-bars">
                  {WEEKLY_BARS.map((bar) => (
                    <div
                      key={bar.label}
                      className={`wp-week-bar ${bar.today ? 'today' : ''} ${bar.muted ? 'muted' : ''}`}
                      style={{
                        height: bar.today ? `${todayHeight}%` : `${bar.height}%`,
                        opacity: bar.opacity,
                      }}
                      title={bar.weight}
                    >
                      <span className="wp-bar-tooltip">{bar.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="wp-chart-labels">
                {WEEKLY_BARS.map((bar) => (
                  <span key={bar.label} className={bar.today ? 'today' : ''}>
                    {bar.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
