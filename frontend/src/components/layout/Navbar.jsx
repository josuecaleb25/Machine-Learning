const navLinks = [
  { href: '#hero', label: 'Inicio' },
  { href: '#metodologia', label: 'Metodología' },
  { href: '#impacto', label: 'Impacto' },
  { href: '#vision', label: 'Visión' },
  { href: '#metas', label: 'Metas' },
];

export default function Navbar({ onMobileMenuToggle }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-6 transition-all duration-500" id="mainHeader">
      <div className="max-w-7xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-[1px] opacity-0"></div>
          <div className="relative flex justify-between items-center px-8 py-4 transition-all duration-500" id="navbarContainer">

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
              </div>
              <span className="font-semibold text-lg text-on-surface tracking-tight">EcoSorteo AI</span>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1 relative z-10">
              {navLinks.map(({ href, label }) => (
                <a key={href} className="nav-link group/link relative px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors duration-300" href={href}>
                  <span className="relative z-10">{label}</span>
                  <div className="absolute inset-0 bg-primary/5 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover/link:w-8 transition-all duration-300"></div>
                </a>
              ))}
            </nav>

            {/* Login button */}
            <div className="relative z-10">
              <button
                className="group/btn relative overflow-hidden px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border-2 border-[#2d5a27] text-on-surface text-sm font-medium hover:bg-[#2d5a27] hover:text-white transition-all duration-500"
                onClick={() => alert('Funcionalidad de acceso próximamente')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Iniciar Sesión</span>
                  <span className="material-symbols-outlined text-base opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300">arrow_forward</span>
                </span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden relative z-10 w-10 h-10 rounded-full bg-primary/10 backdrop-blur-xl border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
              id="mobileMenuBtn"
              onClick={onMobileMenuToggle}
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
