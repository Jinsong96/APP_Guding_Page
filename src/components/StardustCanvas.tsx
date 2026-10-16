import React, { useEffect, useRef } from 'react';

interface StardustCanvasProps {
  active?: boolean;
  intensity?: 'gentle' | 'vibrant';
  emitterPos?: { x: number; y: number } | null;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
}

export const StardustCanvas: React.FC<StardustCanvasProps> = ({
  active = true,
  intensity = 'gentle',
  emitterPos,
  className = 'absolute inset-0 pointer-events-none'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const colors = [
    '#F59E0B', // Warm Amber
    '#FBBF24', // Golden
    '#D97706', // Deep Brass Gold
    '#FEF3C7', // Stardust White Gold
    '#E0E7FF'  // Ethereal Starlight
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 300);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial ambient particles
    const maxParticles = intensity === 'vibrant' ? 45 : 25;
    particlesRef.current = Array.from({ length: maxParticles }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.2,
      maxLife: 100 + Math.random() * 100,
      life: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Add particles from emitter if active
      if (active && emitterPos) {
        for (let i = 0; i < (intensity === 'vibrant' ? 3 : 1); i++) {
          if (particlesRef.current.length < maxParticles + 15) {
            particlesRef.current.push({
              x: emitterPos.x + (Math.random() - 0.5) * 12,
              y: emitterPos.y + (Math.random() - 0.5) * 12,
              vx: (Math.random() - 0.5) * 1.2,
              vy: (Math.random() - 0.5) * 1.2 - 0.3,
              size: Math.random() * 2.5 + 1.2,
              alpha: 0.9,
              maxLife: 60 + Math.random() * 40,
              life: 0,
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          }
        }
      }

      // Update and draw particles
      particlesRef.current.forEach((p, idx) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        let currentAlpha = p.alpha;
        if (progress > 0.7) {
          currentAlpha = p.alpha * (1 - (progress - 0.7) / 0.3);
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Cross star glimmer on larger particles
        if (p.size > 2.2 && Math.sin(p.life * 0.1) > 0.5) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 2, p.y);
          ctx.lineTo(p.x + p.size * 2, p.y);
          ctx.moveTo(p.x, p.y - p.size * 2);
          ctx.lineTo(p.x, p.y + p.size * 2);
          ctx.stroke();
        }

        ctx.restore();

        // Respawn ambient particles
        if (p.life >= p.maxLife) {
          p.x = Math.random() * width;
          p.y = height + 5;
          p.life = 0;
          p.alpha = Math.random() * 0.7 + 0.2;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = -Math.random() * 0.5 - 0.1;
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, intensity, emitterPos]);

  return <canvas ref={canvasRef} className={className} />;
};
