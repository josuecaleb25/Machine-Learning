import { useEffect } from 'react';

export function usePollenCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('pollenCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function initCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
      }
      update() {
        this.x += this.speedX + Math.sin(this.angle) * 0.5;
        this.y += this.speedY;
        this.angle += this.spin;
        if (this.y > canvas.height) this.reset();
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 168, 136, ${this.opacity})`;
        ctx.fill();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }

    const onResize = () => initCanvas();
    window.addEventListener('resize', onResize);

    initCanvas();
    particles = Array.from({ length: 60 }, () => new Particle());
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);
}
