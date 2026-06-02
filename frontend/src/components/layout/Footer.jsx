export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest py-20 px-container-padding-desktop flex flex-col md:flex-row justify-between items-center gap-8 w-full border-t border-outline-variant/30">
      <div className="flex flex-col gap-4 text-center md:text-left">
        <div className="font-headline-md text-headline-md text-primary">Smart City</div>
        <p className="text-on-surface-variant max-w-xs font-body-md">© 2024 Smart City. Cosechando un futuro más verde.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {['Reporte Sostenibilidad', 'Ética de Privacidad', 'Términos de Servicio', 'Contacto'].map(link => (
          <a key={link} className="text-on-surface-variant hover:text-secondary font-body-md transition-colors" href="#">{link}</a>
        ))}
      </div>
      <div className="flex gap-4">
        <a className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#">
          <span className="material-symbols-outlined">public</span>
        </a>
        <a className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#">
          <span className="material-symbols-outlined">share</span>
        </a>
      </div>
    </footer>
  );
}
