"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(60, Math.max(30, Math.floor((width * height) / 20000)));
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.15,
      });
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particleColor = "";
    let particleOpacity = 1;

    const readPalette = () => {
      const styles = getComputedStyle(document.documentElement);
      particleColor = styles.getPropertyValue("--particle-rgb").trim();
      particleOpacity = Number(styles.getPropertyValue("--particle-opacity"));
    };

    readPalette();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();

    const animate = () => {
      if (!ctx || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;
      timeRef.current += 0.008;
      // The page owns its background; the canvas only draws themed decoration.
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Simple flow field (using sin/cos but only once per particle)
        const flowX = Math.sin(p.y * 0.004 + timeRef.current) * 0.15;
        const flowY = Math.cos(p.x * 0.004 + timeRef.current * 0.8) * 0.15;

        p.vx += (flowX - p.vx) * 0.02;
        p.vy += (flowY - p.vy) * 0.02;

        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction - simplified
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > 0 && distSq < 40000) {
          const dist = Math.sqrt(distSq);
          const force = (200 - dist) / 200;
          p.vx -= (dx / dist) * force * 0.03;
          p.vy -= (dy / dist) * force * 0.03;
        }

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Simple dot (no glow gradients)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.alpha * particleOpacity})`;
        ctx.fill();
      }

      // Draw connections - simplified, fewer checks
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          if (Math.abs(dx) > 120 || Math.abs(dy) > 120) continue;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) {
            const alpha = 0.16 * particleOpacity * (1 - Math.sqrt(distSq) / 120);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${particleColor}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      if (!motionPreference.matches) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const redraw = () => {
      cancelAnimationFrame(animationRef.current);
      animate();
    };
    const onResize = () => {
      resize();
      redraw();
    };
    const observer = new MutationObserver(() => {
      readPalette();
      redraw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    motionPreference.addEventListener("change", redraw);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    animate();

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", redraw);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      aria-hidden="true"
    />
  );
}
