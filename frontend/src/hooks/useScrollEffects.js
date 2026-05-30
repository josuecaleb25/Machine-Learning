import { useEffect } from 'react';

export function useScrollEffects() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;

      // Parallax hero
      const hero = document.getElementById('heroContent');
      if (hero) hero.style.transform = `translateY(${scrolled * 0.3}px)`;

      // Navbar blur on scroll
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

      // Reveal on scroll
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 150) {
          el.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // trigger on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

export function useGlassCardTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll('.glass-card');
    const handlers = [];

    cards.forEach(card => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top) - rect.height / 2) / 20;
        const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      };
      const onLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
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
}
