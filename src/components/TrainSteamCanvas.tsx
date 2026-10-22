import React, { useEffect, useRef } from 'react';

interface TrainSteamCanvasProps {
  isDriving: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  type: 'steam' | 'stardust' | 'mist';
  hue?: number;
  rotation?: number;
  rotationSpeed?: number;
}

export const TrainSteamCanvas: React.FC<TrainSteamCanvasProps> = ({ isDriving }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let lastTime = performance.now();
    let startTime = isDriving ? performance.now() : 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // 1. Gentle plume of warm chimney steam from the locomotive smokestack
    const spawnGentleSteam = (w: number, h: number) => {
      const sx = w * 0.817 + (Math.random() - 0.5) * 8;
      const sy = h * 0.455 + (Math.random() - 0.5) * 4;

      particles.push({
        x: sx,
        y: sy,
        vx: -(Math.random() * 0.8 + 0.3), // gentle drift backward
        vy: -(Math.random() * 1.1 + 0.6), // gentle ascent
        radius: Math.random() * 8 + 6,
        maxRadius: Math.random() * 32 + 22,
        alpha: 0.55,
        decay: Math.random() * 0.009 + 0.007,
        type: 'steam',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
      });
    };

    // 2. Soft station ground mist (rolling along track floor as train eases to a halt)
    const spawnStationMist = (w: number, h: number) => {
      const mx = w * (0.2 + Math.random() * 0.55);
      const my = h * 0.53 + (Math.random() - 0.5) * 5;

      particles.push({
        x: mx,
        y: my,
        vx: -(Math.random() * 0.6 + 0.2),
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 10 + 6,
        maxRadius: Math.random() * 26 + 18,
        alpha: 0.38,
        decay: Math.random() * 0.011 + 0.008,
        type: 'mist',
      });
    };

    // 3. Magical golden reading stardust (twinkling softly around the train and platform)
    const spawnStardust = (w: number, h: number) => {
      const sx = w * (0.16 + Math.random() * 0.65);
      const sy = h * (0.36 + Math.random() * 0.17);

      particles.push({
        x: sx,
        y: sy,
        vx: -(Math.random() * 0.7 + 0.2),
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.6 + 0.8,
        maxRadius: 2.4,
        alpha: 0.85,
        decay: Math.random() * 0.016 + 0.012,
        type: 'stardust',
      });
    };

    const loop = (now: number) => {
      const dt = Math.min(50, now - lastTime);
      lastTime = now;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      if (isDriving) {
        const elapsed = (now - startTime) / 1000;

        // Steady, calming spawn rate matching station glide
        if (elapsed < 2.0) {
          if (Math.random() < 0.35) {
            spawnGentleSteam(w, h);
          }
          if (Math.random() < 0.28) {
            spawnStationMist(w, h);
          }
          if (Math.random() < 0.3) {
            spawnStardust(w, h);
          }
        }
      }

      // Update & render particles with soft, calming blending
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.alpha -= p.decay * (dt / 16);

        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed * (dt / 16);
        }

        // Expand steam smoothly like fluffy clouds
        if (p.type === 'steam' || p.type === 'mist') {
          p.radius = Math.min(p.maxRadius, p.radius + 0.22 * (dt / 16));
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();

        if (p.type === 'steam') {
          // Dreamy warm ivory and moonlight gradient
          const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(255, 252, 242, ${p.alpha * 0.6})`);
          grad.addColorStop(0.5, `rgba(242, 235, 220, ${p.alpha * 0.3})`);
          grad.addColorStop(1, 'rgba(215, 225, 245, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'mist') {
          // Low wheel mist
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(235, 240, 255, ${p.alpha * 0.4})`);
          grad.addColorStop(1, 'rgba(180, 200, 230, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'stardust') {
          // Warm reading stardust spark
          ctx.fillStyle = `rgba(255, 244, 195, ${p.alpha})`;
          ctx.shadowColor = '#ffe082';
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Continue animating while driving or while particles are gently fading out
      if (isDriving || particles.length > 0) {
        animId = requestAnimationFrame(loop);
      }
    };

    if (isDriving) {
      startTime = performance.now();
      animId = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isDriving]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full z-15"
    />
  );
};
