import React, { useMemo } from 'react';
import { PodState } from '../types';
import { COURSE_LENGTH, LANE_OFFSETS } from '../constants';
import { Pod } from './Pod';
import { LaunchTower } from './LaunchTower';
import { FinishRing } from './FinishRing';
import { getCoursePointAt, getAllCoursePoints } from '../engine/course';

interface SpaceSceneProps {
  pods: PodState[];
  cameraX: number;
  cameraY: number;
  status: string;
}

// Seeded pseudo-random number generator for deterministic star generation
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SpaceScene: React.FC<SpaceSceneProps> = ({
  pods,
  cameraX,
  cameraY,
  status,
}) => {
  // Deterministic seeded stars
  const stars = useMemo(() => {
    const rng = mulberry32(421337);
    const starList: Array<{
      x: number;
      y: number;
      r: number;
      color: string;
      isSparkle: boolean;
      twinkleDelay: number;
      layer: number; // 0 (far) or 1 (near)
    }> = [];

    for (let i = 0; i < 220; i++) {
      const x = rng() * 4500 - 500;
      const y = rng() * 900 - 150;
      const r = rng() > 0.85 ? rng() * 2.2 + 1.2 : rng() * 1.5 + 0.6;
      const isPink = rng() > 0.75;
      const isSparkle = rng() > 0.88;
      const color = isPink ? '#f472b6' : rng() > 0.5 ? '#93c5fd' : '#ffffff';
      const twinkleDelay = rng() * 3;
      const layer = rng() > 0.5 ? 1 : 0;

      starList.push({ x, y, r, color, isSparkle, twinkleDelay, layer });
    }
    return starList;
  }, []);

  // Course points for drawing the track guide path
  const coursePoints = useMemo(() => getAllCoursePoints(), []);

  // Track path SVG d
  const trackPathD = useMemo(() => {
    return coursePoints
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
  }, [coursePoints]);

  const startPt = coursePoints[0] || { x: 200, y: 280, angle: 0 };
  const endPt = coursePoints[coursePoints.length - 1] || { x: 3200, y: 280, angle: 0 };

  // Find human pod for relative gap indicators
  const humanPod = pods.find((p) => p.isHuman) || pods[0];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#02082e] select-none">
      {/* Deep Nebula & Space Radial Gradient (Layer 0.05) */}
      <div
        className="absolute w-[6000px] h-[2000px] -left-[1000px] -top-[500px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 60% at 30% 40%, rgba(30, 58, 138, 0.45) 0%, rgba(15, 23, 42, 0.9) 60%, #02082e 100%), radial-gradient(circle at 75% 30%, rgba(88, 28, 135, 0.3) 0%, transparent 60%)',
          transform: `translate3d(${-cameraX * 0.05}px, ${-cameraY * 0.05}px, 0)`,
        }}
      />

      {/* Star Layer 1 (Far Parallax 0.1) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(${-cameraX * 0.1}px, ${-cameraY * 0.1}px, 0)`,
        }}
      >
        <svg className="w-[5000px] h-[1000px] overflow-visible">
          {stars
            .filter((s) => s.layer === 0)
            .map((s, idx) =>
              s.isSparkle ? (
                <g
                  key={idx}
                  transform={`translate(${s.x}, ${s.y})`}
                  style={{ animation: `pulse 2.5s infinite ease-in-out ${s.twinkleDelay}s` }}
                >
                  <line x1="-6" y1="0" x2="6" y2="0" stroke={s.color} strokeWidth="1.2" />
                  <line x1="0" y1="-6" x2="0" y2="6" stroke={s.color} strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                </g>
              ) : (
                <circle
                  key={idx}
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill={s.color}
                  opacity={0.8}
                  style={{ animation: `pulse 3s infinite ease-in-out ${s.twinkleDelay}s` }}
                />
              )
            )}
        </svg>
      </div>

      {/* Star Layer 2 (Near Parallax 0.2) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(${-cameraX * 0.2}px, ${-cameraY * 0.2}px, 0)`,
        }}
      >
        <svg className="w-[5000px] h-[1000px] overflow-visible">
          {stars
            .filter((s) => s.layer === 1)
            .map((s, idx) =>
              s.isSparkle ? (
                <g
                  key={idx}
                  transform={`translate(${s.x}, ${s.y})`}
                  style={{ animation: `pulse 2s infinite ease-in-out ${s.twinkleDelay}s` }}
                >
                  <line x1="-9" y1="0" x2="9" y2="0" stroke={s.color} strokeWidth="1.5" />
                  <line x1="0" y1="-9" x2="0" y2="9" stroke={s.color} strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="2" fill="#ffffff" />
                </g>
              ) : (
                <circle
                  key={idx}
                  cx={s.x}
                  cy={s.y}
                  r={s.r * 1.3}
                  fill={s.color}
                  opacity={0.9}
                  style={{ animation: `pulse 2.2s infinite ease-in-out ${s.twinkleDelay}s` }}
                />
              )
            )}
        </svg>
      </div>

      {/* Far Scenery (Parallax 0.4): Ringed Purple Gas Giant & Distant Moons (Screenshot 3) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(${-cameraX * 0.4}px, ${-cameraY * 0.4}px, 0)`,
        }}
      >
        {/* Ringed Giant at x=900, y=180 */}
        <div className="absolute left-[780px] top-[40px] w-[360px] h-[360px]">
          <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible drop-shadow-[0_0_50px_#7c3aed55]">
            <defs>
              {/* Gas Planet Gradient */}
              <linearGradient id="gasPlanetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="35%" stopColor="#818cf8" />
                <stop offset="70%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>

              {/* Rings Gradient */}
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#cbd5e1" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#475569" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.6" />
              </linearGradient>

              {/* Planet sphere clip */}
              <clipPath id="planetClip">
                <circle cx="200" cy="200" r="90" />
              </clipPath>
            </defs>

            {/* Back Ring Half */}
            <g transform="rotate(-28 200 200)">
              <ellipse
                cx="200"
                cy="200"
                rx="190"
                ry="45"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="28"
              />
              <ellipse
                cx="200"
                cy="200"
                rx="160"
                ry="36"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
                opacity="0.6"
              />
            </g>

            {/* Planet Body */}
            <circle cx="200" cy="200" r="90" fill="url(#gasPlanetGrad)" />

            {/* Atmosphere bands across sphere */}
            <g clipPath="url(#planetClip)">
              <path d="M 90 160 Q 200 200 310 160 L 310 190 Q 200 230 90 190 Z" fill="#9333ea" opacity="0.4" />
              <path d="M 90 195 Q 200 235 310 195 L 310 215 Q 200 255 90 215 Z" fill="#3b82f6" opacity="0.3" />
              <path d="M 90 220 Q 200 260 310 220 L 310 240 Q 200 280 90 240 Z" fill="#6366f1" opacity="0.4" />
              {/* Shadow on lower right */}
              <circle cx="230" cy="230" r="90" fill="#020617" opacity="0.55" />
            </g>

            {/* Front Ring Half */}
            <g transform="rotate(-28 200 200)">
              <path
                d="M 10 200 A 190 45 0 0 0 390 200"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="28"
              />
            </g>
          </svg>
        </div>

        {/* Small icy moon at x=2300, y=120 */}
        <div className="absolute left-[2250px] top-[100px] w-16 h-16">
          <svg viewBox="0 0 60 60" className="w-full h-full overflow-visible">
            <circle cx="30" cy="30" r="18" fill="#93c5fd" />
            <circle cx="34" cy="32" r="18" fill="#1e3a8a" opacity="0.5" />
            <circle cx="24" cy="24" r="3" fill="#60a5fa" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Mid Scenery (Parallax 0.7): Cratered Asteroids (Screenshots 2, 3, 4) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate3d(${-cameraX * 0.7}px, ${-cameraY * 0.7}px, 0)`,
        }}
      >
        {/* Teal Asteroid (Screenshot 2: Top-Left at Start) */}
        <div className="absolute left-[140px] top-[20px] w-28 h-28">
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible drop-shadow-lg">
            <path
              d="M 30 20 Q 60 10 90 25 Q 115 50 105 85 Q 75 115 40 105 Q 10 85 15 50 Q 15 30 30 20 Z"
              fill="#5f8f96"
              stroke="#3a6067"
              strokeWidth="4"
            />
            {/* Craters */}
            <ellipse cx="45" cy="45" rx="14" ry="10" fill="#3a6067" stroke="#254247" strokeWidth="2" />
            <ellipse cx="43" cy="43" rx="10" ry="7" fill="#4d777d" />
            <ellipse cx="80" cy="70" rx="10" ry="8" fill="#3a6067" stroke="#254247" strokeWidth="2" />
            <ellipse cx="70" cy="35" rx="7" ry="5" fill="#3a6067" />
          </svg>
        </div>

        {/* Purple Asteroid (Screenshot 2: Bottom-Left at Start) */}
        <div className="absolute left-[130px] top-[420px] w-32 h-32">
          <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible drop-shadow-lg">
            <path
              d="M 35 25 Q 75 15 110 35 Q 130 75 115 115 Q 70 135 30 115 Q 10 75 20 45 Z"
              fill="#7a66b0"
              stroke="#4c3d73"
              strokeWidth="4"
            />
            {/* Craters */}
            <ellipse cx="55" cy="65" rx="18" ry="14" fill="#4c3d73" stroke="#31264c" strokeWidth="2.5" />
            <ellipse cx="52" cy="62" rx="14" ry="10" fill="#675398" />
            <ellipse cx="90" cy="90" rx="12" ry="9" fill="#4c3d73" />
            <ellipse cx="85" cy="45" rx="8" ry="6" fill="#4c3d73" />
          </svg>
        </div>

        {/* Teal Asteroid (Screenshot 4: S-Curve Middle) */}
        <div className="absolute left-[1480px] top-[140px] w-36 h-36">
          <svg viewBox="0 0 130 130" className="w-full h-full overflow-visible drop-shadow-lg">
            <path
              d="M 40 20 Q 80 15 110 40 Q 125 80 100 115 Q 60 125 30 100 Q 10 70 25 35 Z"
              fill="#5f8f96"
              stroke="#3a6067"
              strokeWidth="4"
            />
            <ellipse cx="65" cy="60" rx="18" ry="14" fill="#3a6067" />
            <ellipse cx="62" cy="58" rx="14" ry="10" fill="#4d777d" />
            <ellipse cx="95" cy="45" rx="10" ry="7" fill="#3a6067" />
          </svg>
        </div>

        {/* Purple Asteroid (Screenshot 4: S-Curve Bottom) */}
        <div className="absolute left-[1540px] top-[370px] w-32 h-32">
          <svg viewBox="0 0 130 130" className="w-full h-full overflow-visible drop-shadow-lg">
            <path
              d="M 30 25 Q 70 15 105 35 Q 125 75 110 110 Q 70 130 35 110 Q 15 70 20 40 Z"
              fill="#7a66b0"
              stroke="#4c3d73"
              strokeWidth="4"
            />
            <ellipse cx="55" cy="60" rx="16" ry="12" fill="#4c3d73" />
            <ellipse cx="85" cy="85" rx="12" ry="8" fill="#4c3d73" />
          </svg>
        </div>
      </div>

      {/* Near Layer (1.0 Parallax): World Stage (Course, Tower, Finish, Pods) */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${-cameraX}px, ${-cameraY}px, 0)`,
        }}
      >
        {/* Course Line Guide */}
        <svg className="w-[4000px] h-[800px] overflow-visible pointer-events-none">
          {/* Outer glow path */}
          <path
            d={trackPathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="6"
            strokeDasharray="16 12"
            opacity="0.3"
          />
          {/* Core path */}
          <path
            d={trackPathD}
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity="0.5"
          />
        </svg>

        {/* Launch Tower (at s = 0) */}
        <LaunchTower x={startPt.x} y={startPt.y} />

        {/* Finish Ring Gate (at s = COURSE_LENGTH) */}
        <FinishRing x={endPt.x} y={endPt.y} angle={endPt.angle} />

        {/* Pods Sorted by displayS for proper layering */}
        {[...pods]
          .sort((a, b) => a.displayS - b.displayS)
          .map((pod) => {
            const coursePt = getCoursePointAt(pod.displayS);
            const laneOffset = LANE_OFFSETS[pod.lane] ?? 0;

            // Compute world position = spline point + lane offset along normal
            const worldX = coursePt.x + coursePt.nx * laneOffset;
            const worldY = coursePt.y + coursePt.ny * laneOffset;

            // Calculate boost ratio = (logicalS - displayS) / 200
            const boostDelta = Math.max(0, pod.logicalS - pod.displayS);
            const boostRatio = Math.min(1, boostDelta / 150);

            // Step gap relative to human pod
            const gapSteps = pod.isHuman
              ? 0
              : Math.round((pod.logicalS - humanPod.logicalS) / 200);

            return (
              <div
                key={pod.id}
                className="absolute z-10 transition-transform"
                style={{
                  left: `${worldX}px`,
                  top: `${worldY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Pod
                  color={pod.color}
                  name={pod.name}
                  isHuman={pod.isHuman}
                  heading={pod.heading}
                  boostRatio={boostRatio}
                  gapSteps={gapSteps}
                  status={pod.status}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
