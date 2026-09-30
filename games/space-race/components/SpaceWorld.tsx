'use client';

import React from 'react';
import {
  MOON_R,
  MOON_CX,
  MOON_TOP_Y,
  MOON_CENTER_Y,
  SKY_OMEGA_FACTORS,
} from '../constants';
import {
  ORBIT_FAR_STARS,
  ORBIT_NEAR_STARS,
  ORBIT_ASTEROIDS,
  ORBIT_PLANETS,
  MOON_CRATERS,
  MOON_ROCKS,
  MOON_CRYSTALS,
} from '../engine/scenery';
import { GATES } from '../engine/laps';
import { Gate } from './Gate';

interface SpaceWorldProps {
  cameraS: number; // human ship track distance s_h
}

export function SpaceWorld({ cameraS }: SpaceWorldProps) {
  // Surface rotation angle in degrees: (-s_h / MOON_R) * (180 / PI)
  const surfaceAngleDeg = ((-cameraS / MOON_R) * 180) / Math.PI;

  // Sky rotation angles
  const farStarsAngleDeg = ((-SKY_OMEGA_FACTORS.starsFar * cameraS / MOON_R) * 180) / Math.PI;
  const nearStarsAngleDeg = ((-SKY_OMEGA_FACTORS.starsNear * cameraS / MOON_R) * 180) / Math.PI;
  const asteroidsAngleDeg = ((-SKY_OMEGA_FACTORS.asteroids * cameraS / MOON_R) * 180) / Math.PI;
  const setPiecesAngleDeg = ((-SKY_OMEGA_FACTORS.setPieces * cameraS / MOON_R) * 180) / Math.PI;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#050b18]">
      {/* 1. Deep Space Navy Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b18] via-[#09152b] to-[#0f1f3d]" />

      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <defs>
          {/* Moon Radial Gradient: Rim #7db5b1, Body #4f8b8c, Deep #37676c */}
          <radialGradient id="moonBodyGrad" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#7db5b1" />
            <stop offset="15%" stopColor="#629d9e" />
            <stop offset="50%" stopColor="#4f8b8c" />
            <stop offset="100%" stopColor="#2c5357" />
          </radialGradient>

          {/* Moon Atmosphere Glow */}
          <radialGradient id="moonAtmoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="90%" stopColor="rgba(120, 210, 210, 0.35)" />
            <stop offset="100%" stopColor="rgba(120, 210, 210, 0)" />
          </radialGradient>

          {/* Gate Pole Gradient */}
          <linearGradient id="gatePoleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="40%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* 2. Layer: Far Stars (Rotating around C with parallax) */}
        <g transform={`rotate(${farStarsAngleDeg} ${MOON_CX} ${MOON_CENTER_Y})`}>
          {ORBIT_FAR_STARS.map((star, i) => {
            const x = MOON_CX + star.radius * Math.sin(star.angle0);
            const y = MOON_CENTER_Y - star.radius * Math.cos(star.angle0);
            return (
              <circle
                key={`far_${i}`}
                cx={x}
                cy={y}
                r={star.size}
                fill="#ffffff"
                opacity={star.opacity}
              />
            );
          })}
        </g>

        {/* 3. Layer: Near Stars (Rotating around C with parallax) */}
        <g transform={`rotate(${nearStarsAngleDeg} ${MOON_CX} ${MOON_CENTER_Y})`}>
          {ORBIT_NEAR_STARS.map((star, i) => {
            const x = MOON_CX + star.radius * Math.sin(star.angle0);
            const y = MOON_CENTER_Y - star.radius * Math.cos(star.angle0);
            return (
              <circle
                key={`near_${i}`}
                cx={x}
                cy={y}
                r={star.size}
                fill="#93c5fd"
                opacity={star.opacity}
              />
            );
          })}
        </g>

        {/* 4. Layer: Giant Planet Set Pieces (Rotating around C with parallax) */}
        <g transform={`rotate(${setPiecesAngleDeg} ${MOON_CX} ${MOON_CENTER_Y})`}>
          {ORBIT_PLANETS.map((planet) => {
            const x = MOON_CX + planet.radius * Math.sin(planet.angle0);
            const y = MOON_CENTER_Y - planet.radius * Math.cos(planet.angle0);
            return (
              <g key={planet.id} transform={`translate(${x}, ${y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={planet.size / 2}
                  fill={planet.color}
                  className="drop-shadow-2xl"
                  opacity="0.9"
                />
                <ellipse cx="-15" cy="-10" rx={planet.size * 0.2} ry={planet.size * 0.12} fill="#000000" opacity="0.3" />
                <ellipse cx="20" cy="15" rx={planet.size * 0.25} ry={planet.size * 0.15} fill="#000000" opacity="0.3" />
              </g>
            );
          })}
        </g>

        {/* 5. Layer: Asteroids (Rotating around C with parallax) */}
        <g transform={`rotate(${asteroidsAngleDeg} ${MOON_CX} ${MOON_CENTER_Y})`}>
          {ORBIT_ASTEROIDS.map((ast) => {
            const x = MOON_CX + ast.radius * Math.sin(ast.angle0);
            const y = MOON_CENTER_Y - ast.radius * Math.cos(ast.angle0);
            return (
              <g key={ast.id} transform={`translate(${x}, ${y})`}>
                <polygon
                  points={`0,${-ast.size/2} ${ast.size/2},${-ast.size/4} ${ast.size/2},${ast.size/3} ${ast.size/6},${ast.size/2} ${-ast.size/2},${ast.size/3} ${-ast.size/2},${-ast.size/4}`}
                  fill={ast.color}
                  stroke="#1f2937"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              </g>
            );
          })}
        </g>

        {/* 6. Main Moon Atmosphere Glow Ring */}
        <circle
          cx={MOON_CX}
          cy={MOON_CENTER_Y}
          r={MOON_R + 14}
          fill="none"
          stroke="rgba(120, 210, 210, 0.25)"
          strokeWidth="16"
        />

        {/* 7. Surface World Group (Rotates by -s_h / MOON_R about C) */}
        <g transform={`rotate(${surfaceAngleDeg} ${MOON_CX} ${MOON_CENTER_Y})`}>
          {/* A. Moon Solid Disc Body */}
          <circle
            cx={MOON_CX}
            cy={MOON_CENTER_Y}
            r={MOON_R}
            fill="url(#moonBodyGrad)"
          />

          {/* B. Moon Rim Highlight Stroke */}
          <circle
            cx={MOON_CX}
            cy={MOON_CENTER_Y}
            r={MOON_R}
            fill="none"
            stroke="#a9d6cf"
            strokeWidth="3.5"
            opacity="0.75"
          />

          {/* C. Moon Surface Craters */}
          {MOON_CRATERS.map((crater) => {
            const phiDeg = (crater.phi0 * 180) / Math.PI;
            return (
              <g
                key={crater.id}
                transform={`rotate(${phiDeg} ${MOON_CX} ${MOON_CENTER_Y}) translate(${MOON_CX}, ${MOON_TOP_Y})`}
              >
                {/* Crater Inner Pit */}
                <ellipse cx="0" cy="0" rx={crater.rx} ry={crater.ry} fill="#2c5a5f" />
                {/* Crater Lighter Rim Lip */}
                <path
                  d={`M ${-crater.rx} 0 A ${crater.rx} ${crater.ry} 0 0 1 ${crater.rx} 0`}
                  fill="none"
                  stroke="#9fd0c8"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </g>
            );
          })}

          {/* D. Moon Surface Rocks */}
          {MOON_ROCKS.map((rock) => {
            const phiDeg = (rock.phi0 * 180) / Math.PI;
            return (
              <g
                key={rock.id}
                transform={`rotate(${phiDeg} ${MOON_CX} ${MOON_CENTER_Y}) translate(${MOON_CX}, ${MOON_TOP_Y})`}
              >
                <polygon
                  points={`0,${-rock.size} ${rock.size/2},0 ${-rock.size/2},0`}
                  fill={rock.color}
                />
              </g>
            );
          })}

          {/* E. Moon Surface Purple Crystals */}
          {MOON_CRYSTALS.map((cryst) => {
            const phiDeg = (cryst.phi0 * 180) / Math.PI;
            return (
              <g
                key={cryst.id}
                transform={`rotate(${phiDeg} ${MOON_CX} ${MOON_CENTER_Y}) translate(${MOON_CX}, ${MOON_TOP_Y})`}
              >
                <polygon points="0,0 6,-14 12,-2 10,0" fill={cryst.color} />
              </g>
            );
          })}

          {/* F. Four Gates (START, LAP 2, LAP 3, FINISH) planted on Moon */}
          <g transform={`translate(${MOON_CX}, ${MOON_CENTER_Y})`}>
            {GATES.map((gate) => (
              <Gate key={gate.id} gate={gate} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
