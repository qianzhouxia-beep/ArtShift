import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;
      currentSize: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 14 + 6; // 6-20px (smaller)
        this.speedX = (Math.random() - 0.5) * 0.3; // Slower
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.12 + 0.12; // 0.12-0.24 (subtle overlay)
        this.pulse = Math.random() * Math.PI * 2;
        this.currentSize = this.size;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse repel
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 120;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }

        // Wrap edges
        if (this.x < -this.size) this.x = canvas!.width + this.size;
        if (this.x > canvas!.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas!.height + this.size;
        if (this.y > canvas!.height + this.size) this.y = -this.size;

        // Pulse
        this.pulse += 0.015;
        this.currentSize = this.size + Math.sin(this.pulse) * 1.5;
      }

      draw() {
        const gradient = ctx!.createLinearGradient(
          this.x, this.y,
          this.x + this.currentSize, this.y + this.currentSize
        );
        gradient.addColorStop(0, `rgba(109, 40, 217, ${this.opacity})`); // #6D28D9
        gradient.addColorStop(1, `rgba(37, 99, 235, ${this.opacity})`);  // #2563EB

        ctx!.fillStyle = gradient;

        // Rounded rectangle (pixel block)
        const r = 3;
        const s = this.currentSize;
        ctx!.beginPath();
        ctx!.moveTo(this.x + r, this.y);
        ctx!.lineTo(this.x + s - r, this.y);
        ctx!.quadraticCurveTo(this.x + s, this.y, this.x + s, this.y + r);
        ctx!.lineTo(this.x + s, this.y + s - r);
        ctx!.quadraticCurveTo(this.x + s, this.y + s, this.x + s - r, this.y + s);
        ctx!.lineTo(this.x + r, this.y + s);
        ctx!.quadraticCurveTo(this.x, this.y + s, this.x, this.y + s - r);
        ctx!.lineTo(this.x, this.y + r);
        ctx!.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
        ctx!.closePath();
        ctx!.fill();
      }
    }

    // Reduce particles on mobile for performance
    const particleCount = window.innerWidth < 768 ? 18 : 35;
    const particles = Array.from({ length: particleCount }, () => new Particle());
    let frameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    function animate() {
      // Clear fully each frame — no trail accumulation
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      frameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
