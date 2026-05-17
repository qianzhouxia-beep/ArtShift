import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  particleCount?: number;
  repelRadius?: number;
  className?: string;
}

export default function ParticleBackground({
  particleCount = 40,
  repelRadius = 100,
  className = ''
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    pulse: number;
    currentSize: number;

    constructor(width: number, height: number) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 20 + 10;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.4 + 0.5; // 0.5-0.9 for white bg (increased visibility)
      this.pulse = Math.random() * Math.PI * 2;
      this.currentSize = this.size;
    }

    update(width: number, height: number, mouseX: number, mouseY: number, radius: number) {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction (repel)
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && mouseX > 0 && mouseY > 0) {
        const force = (radius - distance) / radius;
        this.x -= (dx / distance) * force * 3;
        this.y -= (dy / distance) * force * 3;
      }

      // Wrap around edges
      if (this.x < -this.size) this.x = width + this.size;
      if (this.x > width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = height + this.size;
      if (this.y > height + this.size) this.y = -this.size;

      // Pulsing effect
      this.pulse += 0.02;
      this.currentSize = this.size + Math.sin(this.pulse) * 2;
    }

    draw(ctx: CanvasRenderingContext2D) {
      const gradient = ctx.createLinearGradient(
        this.x, this.y,
        this.x + this.currentSize, this.y + this.currentSize
      );
      gradient.addColorStop(0, `rgba(139, 92, 246, ${this.opacity})`);
      gradient.addColorStop(1, `rgba(59, 130, 246, ${this.opacity})`);

      ctx.fillStyle = gradient;

      // Draw rounded rectangle
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(this.x + radius, this.y);
      ctx.lineTo(this.x + this.currentSize - radius, this.y);
      ctx.quadraticCurveTo(this.x + this.currentSize, this.y, this.x + this.currentSize, this.y + radius);
      ctx.lineTo(this.x + this.currentSize, this.y + this.currentSize - radius);
      ctx.quadraticCurveTo(this.x + this.currentSize, this.y + this.currentSize, this.x + this.currentSize - radius, this.y + this.currentSize);
      ctx.lineTo(this.x + radius, this.y + this.currentSize);
      ctx.quadraticCurveTo(this.x, this.y + this.currentSize, this.x, this.y + this.currentSize - radius);
      ctx.lineTo(this.x, this.y + radius);
      ctx.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle(width, height));

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      // White fade trail
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(width, height, mouseRef.current.x, mouseRef.current.y, repelRadius);
        particle.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [particleCount, repelRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}
