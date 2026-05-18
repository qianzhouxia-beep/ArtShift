import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Simple particle: position, velocity, color
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: (Math.random() - 0.5) * 1.2,
      // HIGHLY VISIBLE on white: dark colors
      color: ['#1e1b4b', '#312e81', '#4c1d95', '#1e40af'][Math.floor(Math.random() * 4)],
    }));

    let frameId: number;

    function draw() {
      // NO FADE — clear each frame so particles stay visible on white bg
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((p) => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas!.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.speedY *= -1;

        // Draw circle with dark color (visible on white)
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.fill();
      });

      frameId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
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
