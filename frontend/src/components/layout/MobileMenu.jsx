import { useAuth } from '../../context/AuthContext.jsx';

const navLinks = [
  { href: '#hero', label: 'Inicio' },
  { href: '#metodologia', label: 'Metodología' },
  { href: '#impacto', label: 'Impacto' },
  { href: '#vision', label: 'Visión' },
  { href: '#metas', label: 'Metas' },
];

export default function MobileMenu({ isOpen, onClose, onAuthClick }) {
  const { user, logout } = useAuth();

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      id="mobileMenu"
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" id="mobileMenuOverlay" onClick={onClose}></div>
      <div
        className="absolute top-24 left-6 right-6 bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl p-8 transition-transform duration-500"
        id="mobileMenuPanel"
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(16px)' }}
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              className="group/mobile relative px-6 py-4 text-base font-medium text-on-surface-variant hover:text-on-surface rounded-2xl hover:bg-primary/5 transition-all duration-300"
              href={href}
              onClick={onClose}
            >
              <span className="relative z-10">{label}</span>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/mobile:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-primary text-lg">arrow_forward</span>
              </div>
            </a>
          ))}
          <div className="mt-4 pt-4 border-t border-outline-variant/20">
            {user ? (
              <>
                <p className="px-6 py-2 text-sm text-on-surface-variant">Sesión: {user.nombre}</p>
                <button
                  type="button"
                  className="w-full px-6 py-4 rounded-2xl border border-[#2d5a27] text-[#2d5a27] font-medium"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                type="button"
                className="w-full px-6 py-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-primary font-medium hover:border-primary/40 transition-all"
                onClick={() => {
                  onClose();
                  onAuthClick();
                }}
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
