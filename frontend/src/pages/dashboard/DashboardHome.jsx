import { useAuth } from '../../context/AuthContext';

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="content-container">
      <section className="welcome-section">
        <div className="welcome-content">
          <div>
            <span className="status-badge">Estado del Sistema: Óptimo</span>
            <h2 className="welcome-title">Bienvenido de nuevo, {user?.nombre || 'Usuario'}</h2>
            <p className="welcome-text">
              Su ecosistema está funcionando con una eficiencia del 98%. Hemos procesado un excedente significativo de residuos hoy.
            </p>
          </div>
          <div className="sustainability-card glass-card">
            <div className="sustainability-icon">
              <span className="material-symbols-outlined">eco</span>
            </div>
            <div>
              <p className="card-label">Puntuación de Sostenibilidad</p>
              <p className="card-value">A+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="material-symbols-outlined stat-icon">delete_sweep</span>
            <span className="stat-badge">+12%</span>
          </div>
          <p className="stat-label">Total de Residuos Procesados</p>
          <p className="stat-value">24.5<span className="stat-unit">t</span></p>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="material-symbols-outlined stat-icon">psychology</span>
            <span className="stat-badge">Estable</span>
          </div>
          <p className="stat-label">Precisión de IA</p>
          <p className="stat-value">99.8<span className="stat-unit">%</span></p>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="material-symbols-outlined stat-icon">co2</span>
            <span className="stat-badge">-0.2t</span>
          </div>
          <p className="stat-label">CO2 Reducido</p>
          <p className="stat-value">1.4<span className="stat-unit">t</span></p>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="material-symbols-outlined stat-icon">sensors</span>
            <div className="pulse-dot"></div>
          </div>
          <p className="stat-label">Sensores Activos</p>
          <p className="stat-value">1,204</p>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="chart-card glass-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Rendimiento General</h3>
              <p className="chart-subtitle">Métricas de eficiencia del ecosistema en tiempo real</p>
            </div>
            <div className="chart-filters">
              <button type="button" className="filter-btn active">24h</button>
              <button type="button" className="filter-btn">7d</button>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-bar" style={{ height: '60%' }}>
              <div className="chart-bar-fill" style={{ height: '40%' }}></div>
            </div>
            <div className="chart-bar" style={{ height: '80%' }}>
              <div className="chart-bar-fill" style={{ height: '55%' }}></div>
            </div>
            <div className="chart-bar" style={{ height: '70%' }}>
              <div className="chart-bar-fill" style={{ height: '30%' }}></div>
            </div>
            <div className="chart-bar" style={{ height: '95%' }}>
              <div className="chart-bar-fill" style={{ height: '70%' }}></div>
            </div>
            <div className="chart-bar" style={{ height: '65%' }}>
              <div className="chart-bar-fill" style={{ height: '45%' }}></div>
            </div>
            <div className="chart-bar" style={{ height: '85%' }}>
              <div className="chart-bar-fill" style={{ height: '60%' }}></div>
            </div>
            <div className="chart-bar" style={{ height: '75%' }}>
              <div className="chart-bar-fill" style={{ height: '50%' }}></div>
            </div>
          </div>

          <div className="scanning-line"></div>
        </div>

        <div className="server-card glass-card">
          <div className="server-header">
            <span className="material-symbols-outlined">dns</span>
            <h3>Estado del Servidor</h3>
          </div>

          <div className="server-stats">
            <div className="server-stat">
              <div className="server-stat-header">
                <span className="server-stat-label">Tiempo Activo</span>
                <span className="server-stat-value">99.998%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '99.9%' }}></div>
              </div>
            </div>

            <div className="server-stat">
              <div className="server-stat-header">
                <span className="server-stat-label">Carga del Núcleo</span>
                <span className="server-stat-value">42%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '42%', opacity: 0.4 }}></div>
              </div>
            </div>
          </div>

          <div className="server-nodes">
            <div className="server-node">
              <div className="node-indicator active"></div>
              <span>Nodo Frankfurt: Principal</span>
            </div>
            <div className="server-node">
              <div className="node-indicator standby"></div>
              <span>Nodo Singapur: En Espera</span>
            </div>
          </div>
        </div>

        <div className="activity-card glass-card">
          <div className="activity-header">
            <h3>Actividad del Ecosistema</h3>
            <button type="button" className="view-history-btn">Ver Historial</button>
          </div>

          <div className="activity-grid">
            <div className="activity-item">
              <div className="activity-icon secondary">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <p className="activity-title">Optimizador IA activado</p>
                <p className="activity-time">Hace 12 min • Sector 7-G</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon primary">
                <span className="material-symbols-outlined">energy_savings_leaf</span>
              </div>
              <div>
                <p className="activity-title">Reducción de carga pico</p>
                <p className="activity-time">Hace 45 min • Almacenamiento Beta</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon error">
                <span className="material-symbols-outlined">report_problem</span>
              </div>
              <div>
                <p className="activity-title">Mantenimiento requerido</p>
                <p className="activity-time">Hace 2 horas • Sensor H-12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
