import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Metodologia from './components/sections/Metodologia';
import Impacto from './components/sections/Impacto';
import Vision from './components/sections/Vision';
import Metas from './components/sections/Metas';
import Footer from './components/layout/Footer';
import PollenCanvas from './components/layout/PollenCanvas';
import MobileMenu from './components/layout/MobileMenu';
import FaceAuthModal from './components/auth/FaceAuthModal';
import './styles/global.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFaceAuthOpen, setIsFaceAuthOpen] = useState(false);

  useEffect(() => {
    // Parallax and Reveal Logic
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = document.getElementById('heroContent');
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
      }

      // Navbar scroll behavior premium
      const navbarContainer = document.getElementById('navbarContainer');
      if (navbarContainer) {
        if (scrolled > 50) {
          navbarContainer.style.background = 'rgba(255, 255, 255, 0.15)';
          navbarContainer.style.backdropFilter = 'blur(20px)';
          navbarContainer.style.webkitBackdropFilter = 'blur(20px)';
          navbarContainer.style.borderRadius = '9999px';
          navbarContainer.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        } else {
          navbarContainer.style.background = 'transparent';
          navbarContainer.style.backdropFilter = 'none';
          navbarContainer.style.webkitBackdropFilter = 'none';
          navbarContainer.style.borderRadius = '0';
          navbarContainer.style.boxShadow = 'none';
        }
      }

      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger first reveal
    handleScroll();

    // 3D Sway Interaction
    document.querySelectorAll('.glass-card').forEach(card => {
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      };

      const handleMouseLeave = () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed">
      <PollenCanvas />
      <Navbar 
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onAuthClick={() => setIsFaceAuthOpen(true)}
      />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        onAuthClick={() => setIsFaceAuthOpen(true)}
      />
      <FaceAuthModal 
        isOpen={isFaceAuthOpen}
        onClose={() => setIsFaceAuthOpen(false)}
      />
      <Hero />
      <Metodologia />
      <Impacto />
      <Vision />
      <Metas />
      <Footer />
    </div>
  );
}

export default App;
