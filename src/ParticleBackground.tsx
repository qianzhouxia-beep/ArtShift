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
        this.size = Math.random() * 20 + 10;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.6;
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
        const repelRadius = 150;

        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }

        // Wrap edges
        if (this.x < -this.size) this.x = canvas!.width + this.size;
        if (this.x > canvas!.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas!.height + this.size;
        if (this.y > canvas!.height + this.size) this.y = -this.size;

        // Pulse
        this.pulse += 0.02;
        this.currentSize = this.size + Math.sin(this.pulse) * 2;
      }

      draw() {
        const gradient = ctx!.createLinearGradient(
          this.x, this.y,
          this.x + this.currentSize, this.y + this.currentSize
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${this.opacity})`);

        ctx!.fillStyle = gradient;

        // Rounded rectangle (pixel block)
        const r = 4;
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

    const particles = Array.from({ length: 40 }, () => new Particle());
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
      // Subtle fade (much lighter so particles stay visible on white)
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

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
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
