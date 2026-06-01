import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('es-ES', options));
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-wrapper">
      {/* SideNavBar Shell */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">EcoTech OS</h1>
          <p className="sidebar-subtitle">Premium Management</p>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="#dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Panel Principal</span>
          </a>
          <a className="nav-item" href="#prediction">
            <span className="material-symbols-outlined">query_stats</span>
            <span>Predicción de Residuos</span>
          </a>
          <a className="nav-item" href="#analytics">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analíticas</span>
          </a>
          <a className="nav-item" href="#biometrics">
            <span className="material-symbols-outlined">fingerprint</span>
            <span>Biometría</span>
          </a>
          <a className="nav-item" href="#ecosystem">
            <span className="material-symbols-outlined">eco</span>
            <span>Ecosistema</span>
          </a>
          <a className="nav-item" href="#security">
            <span className="material-symbols-outlined">verified_user</span>
            <span>Seguridad</span>
          </a>
        </nav>

        <div className="sidebar-action">
          <button className="btn-new-report">
            <span className="material-symbols-outlined">add</span>
            Nuevo Reporte
          </button>
        </div>

        <footer className="sidebar-footer">
          <a className="footer-item" href="#help">
            <span className="material-symbols-outlined">help</span>
            <span>Ayuda</span>
          </a>
          <button className="footer-item logout-btn" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </footer>
      </aside>

      {/* TopNavBar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="mobile-menu-btn">
            <span className="material-symbols-outlined">menu</span>
          </div>
          <div className="topbar-date">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input type="text" placeholder="Buscar datos..." />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-btn">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="user-avatar">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxE2Um_9xowLaVsHZlD5mUmnbWMr3xU7GNjKjQyaBqnoMC2nidrlpYsMpBEYW-JA_4toaPxid68Xh1tA2zckxS1aHPcEk1XJtTxCZFFXBr2hcBuYyVnsImfz7gxeSeziKXgGDdc5vFr554bVa_BG9ttxGRyjStk80Cv6pSKiJ_UCeONIeROhY0rDH_AkfpC58URnw7AygdjiXc6oQ5neDssn0DU_KUtUDAeK5p9PGJu_NMelRd9UjhOmC859gmASTSFz8sF6S9--M" 
                alt="Perfil de usuario" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {/* Welcome Header */}
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

          {/* Stats Grid */}
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

          {/* Main Interactive Section */}
          <div className="dashboard-grid">
            {/* Performance Chart */}
            <div className="chart-card glass-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Rendimiento General</h3>
                  <p className="chart-subtitle">Métricas de eficiencia del ecosistema en tiempo real</p>
                </div>
                <div className="chart-filters">
                  <button className="filter-btn active">24h</button>
                  <button className="filter-btn">7d</button>
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

            {/* Server Status */}
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

            {/* Activity Feed */}
            <div className="activity-card glass-card">
              <div className="activity-header">
                <h3>Actividad del Ecosistema</h3>
                <button className="view-history-btn">Ver Historial</button>
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
      </main>

      {/* FAB */}
      <button className="fab">
        <span className="material-symbols-outlined">bolt</span>
      </button>
    </div>
  );
}
