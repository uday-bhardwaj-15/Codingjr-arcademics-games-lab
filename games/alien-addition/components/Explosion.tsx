'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { STAGE } from '../engine/ufoMotion';

type Kind = 'fire' | 'smoke' | 'spark' | 'debris';

type P = {
  k: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
  life: number;
  delay: number;
  r: number;
  rot: number;
  vr: number;
  col: string;
};

type Ring = { x: number; y: number; t: number; s: number };

export type ExplosionHandle = {
  burst: (x: number, y: number, shipColor: string, size?: number) => void;
};

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export const Explosion = forwardRef<ExplosionHandle>(function Explosion(_, ref) {
  const [mounted, setMounted] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null);
  const ps = useRef<P[]>([]);
  const rings = useRef<Ring[]>([]);
  const flash = useRef<{ x: number; y: number; t: number; s: number }[]>([]);
  const raf = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loop = (now: number) => {
    const c = cv.current;
    if (!c) return;
    const g = c.getContext('2d');
    if (!g) return;

    const dpr = window.devicePixelRatio || 1;
    const dt = Math.min((now - last.current) / 1000, 0.05);
    last.current = now;

    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, STAGE.w, STAGE.h);
    g.globalCompositeOperation = 'lighter';

    // 1. Flash
    flash.current = flash.current.filter((f) => (f.t += dt) < 0.16);
    flash.current.forEach((f) => {
      const a = 1 - f.t / 0.16;
      const gr = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.s);
      gr.addColorStop(0, `rgba(255,255,240,${a})`);
      gr.addColorStop(0.35, `rgba(255,200,120,${a * 0.6})`);
      gr.addColorStop(1, 'rgba(255,120,30,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(f.x, f.y, f.s, 0, Math.PI * 2);
      g.fill();
    });

    // 2. Shockwave Rings
    rings.current = rings.current.filter((r) => (r.t += dt) < 0.45);
    rings.current.forEach((r) => {
      const k = r.t / 0.45;
      g.strokeStyle = `rgba(255,230,200,${(1 - k) * 0.7})`;
      g.lineWidth = 5 * (1 - k) + 1;
      g.beginPath();
      g.arc(r.x, r.y, 20 + k * 150 * r.s, 0, Math.PI * 2);
      g.stroke();
    });

    // 3. Particles
    ps.current = ps.current.filter((p) => p.t < p.life);
    for (const p of ps.current) {
      if (p.delay > 0) {
        p.delay -= dt;
        continue;
      }
      p.t += dt;
      const k = p.t / p.life;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.k === 'spark') {
        p.vy += 620 * dt;
        p.vx *= 0.985;
        g.strokeStyle = `rgba(255,${Math.round(190 - 100 * k)},60,${1 - k})`;
        g.lineWidth = 1.6;
        g.beginPath();
        g.moveTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
        g.lineTo(p.x, p.y);
        g.stroke();
      } else if (p.k === 'fire') {
        p.vx *= 0.94;
        p.vy *= 0.94;
        const rad = p.r * (1 + k * 1.7);
        const col = k < 0.2 ? '255,245,210' : k < 0.55 ? '255,150,40' : '150,40,15';
        const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        gr.addColorStop(0, `rgba(${col},${0.85 * (1 - k)})`);
        gr.addColorStop(1, `rgba(${col},0)`);
        g.fillStyle = gr;
        g.beginPath();
        g.arc(p.x, p.y, rad, 0, Math.PI * 2);
        g.fill();
      } else if (p.k === 'smoke') {
        g.globalCompositeOperation = 'source-over';
        p.vy -= 25 * dt;
        const rad = p.r * (1 + k * 2.2);
        const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        gr.addColorStop(0, `rgba(50,44,56,${0.4 * (1 - k)})`);
        gr.addColorStop(1, 'rgba(50,44,56,0)');
        g.fillStyle = gr;
        g.beginPath();
        g.arc(p.x, p.y, rad, 0, Math.PI * 2);
        g.fill();
        g.globalCompositeOperation = 'lighter';
      } else {
        p.vy += 520 * dt;
        p.rot += p.vr * dt;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.globalCompositeOperation = 'source-over';
        g.globalAlpha = Math.min(1, (1 - k) * 2);
        g.fillStyle = p.col;
        g.fillRect(-p.r, -p.r * 0.35, p.r * 2, p.r * 0.7);
        g.restore();
        g.globalCompositeOperation = 'lighter';
      }
    }

    if (ps.current.length || flash.current.length || rings.current.length) {
      raf.current = requestAnimationFrame(loop);
    }
  };

  useImperativeHandle(ref, () => ({
    burst(x, y, shipColor, size = 1) {
      flash.current.push({ x, y, t: 0, s: 230 * size });
      rings.current.push({ x, y, t: 0, s: size });
      const add = (n: number, mk: () => P) => {
        for (let i = 0; i < n; i++) ps.current.push(mk());
      };
      const dir = (sp: number) => {
        const a = rnd(0, 6.283);
        return [Math.cos(a) * sp, Math.sin(a) * sp * 0.8];
      };

      add(22, () => {
        const [vx, vy] = dir(rnd(20, 170) * size);
        return {
          k: 'fire',
          x,
          y,
          vx,
          vy,
          t: 0,
          life: rnd(0.4, 0.75),
          delay: 0,
          r: rnd(22, 46) * size,
          rot: 0,
          vr: 0,
          col: '',
        };
      });

      add(12, () => {
        const [vx, vy] = dir(rnd(10, 70) * size);
        return {
          k: 'smoke',
          x,
          y,
          vx,
          vy,
          t: 0,
          life: rnd(0.9, 1.4),
          delay: rnd(0.08, 0.2),
          r: rnd(26, 50) * size,
          rot: 0,
          vr: 0,
          col: '',
        };
      });

      add(46, () => {
        const [vx, vy] = dir(rnd(180, 620) * size);
        return {
          k: 'spark',
          x,
          y,
          vx,
          vy,
          t: 0,
          life: rnd(0.3, 0.8),
          delay: 0,
          r: 1,
          rot: 0,
          vr: 0,
          col: '',
        };
      });

      add(14, () => {
        const [vx, vy] = dir(rnd(120, 380) * size);
        return {
          k: 'debris',
          x,
          y,
          vx,
          vy: vy - 90,
          t: 0,
          life: rnd(0.7, 1.1),
          delay: 0,
          r: rnd(4, 10) * size,
          rot: rnd(0, 6),
          vr: rnd(-14, 14),
          col: Math.random() < 0.25 ? '#cfd8e6' : shipColor,
        };
      });

      cancelAnimationFrame(raf.current);
      last.current = performance.now();
      raf.current = requestAnimationFrame(loop);
    },
  }));

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  if (!mounted) return null;

  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;

  return (
    <canvas
      ref={cv}
      width={STAGE.w * dpr}
      height={STAGE.h * dpr}
      className="pointer-events-none absolute left-0 top-0 z-40"
      style={{ width: STAGE.w, height: STAGE.h }}
    />
  );
});
