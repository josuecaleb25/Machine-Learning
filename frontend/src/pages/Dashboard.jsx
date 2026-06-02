import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationSystem from '../components/layout/NotificationSystem';
import DashboardHome from './dashboard/DashboardHome';
import WastePrediction from './dashboard/WastePrediction';
import Analytics from './dashboard/Analytics';
import RecyclingMapPage from './dashboard/RecyclingMapPage';
import PredictionHistory from './dashboard/PredictionHistory';
import './Dashboard.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Panel Principal', icon: 'grid' },
  { id: 'prediction', label: 'Predicción de Residuos', icon: 'query_stats' },
  { id: 'analytics', label: 'Analíticas', icon: 'analytics' },
  { id: 'recycling-map', label: 'Mapa de Reciclaje', icon: 'map' },
  { id: 'history', label: 'Historial', icon: 'history' },
];

function NavIcon({ type }) {
  if (type === 'grid') {
    return (
      <svg className="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    );
  }
  return <span className="material-symbols-outlined">{type}</span>;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const { dark, toggle: toggleTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState('');
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('es-ES', options));
  }, []);

  useEffect(() => {
    if (activeView !== 'analytics' && activeView !== 'recycling-map' && activeView !== 'history') return undefined;

    const lockClass = 'dashboard-analytics-scroll-lock';
    document.documentElement.classList.add(lockClass);
    document.body.classList.add(lockClass);

    return () => {
      document.documentElement.classList.remove(lockClass);
      document.body.classList.remove(lockClass);
    };
  }, [activeView]);

  const renderContent = () => {
    switch (activeView) {
      case 'prediction':
        return <WastePrediction onNavigate={setActiveView} />;
      case 'analytics':
        return <Analytics />;
      case 'recycling-map':
        return <RecyclingMapPage />;
      case 'history':
        return <PredictionHistory />;
      case 'dashboard':
        return <DashboardHome />;
      default:
        return (
          <div className="content-container dashboard-placeholder">
            <span className="material-symbols-outlined">construction</span>
            <h2>Próximamente</h2>
            <p>Esta sección estará disponible pronto.</p>
            <button type="button" className="dashboard-back-btn" onClick={() => setActiveView('dashboard')}>
              Volver al panel principal
            </button>
          </div>
        );
    }
  };

  return (
    <NotificationProvider>
      <NotificationSystem />
      <div
        className={`dashboard-wrapper${activeView === 'analytics' ? ' dashboard-wrapper--analytics' : ''}${activeView === 'recycling-map' ? ' dashboard-wrapper--recycling-map' : ''}${activeView === 'prediction' ? ' dashboard-wrapper--waste-prediction' : ''}${activeView === 'history' ? ' dashboard-wrapper--history' : ''}`}
      >
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Smart City</h1>
          <p className="sidebar-subtitle">Premium Management</p>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <NavIcon type={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <footer className="sidebar-footer">
          <a className="footer-item" href="#help">
            <span className="material-symbols-outlined">help</span>
            <span>Ayuda</span>
          </a>
          <button type="button" className="footer-item logout-btn" onClick={logout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </footer>
      </aside>

      <div className="dashboard-shell">
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
              <button
                type="button"
                className="icon-btn theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={dark ? 'Modo claro' : 'Modo oscuro'}
              >
                <span className="material-symbols-outlined">
                  {dark ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">{renderContent()}</main>
      </div>

      {activeView !== 'recycling-map' && (
        <button type="button" className="fab" aria-label="Acción rápida">
          <span className="material-symbols-outlined">bolt</span>
        </button>
      )}
    </div>
    </NotificationProvider>
  );
}
