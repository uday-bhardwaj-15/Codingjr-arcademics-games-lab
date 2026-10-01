"use client";

import React from "react";
import { RacerState } from "../types";
import { COLOR_PALETTES } from "../constants";
import { UI_THEME } from "../ui/theme";
import { WakeTrail } from "./WakeTrail";

interface JetSkiBoatProps {
  racer: RacerState;
  isRacing: boolean;
  isSurging?: boolean;
  rankBadge?: number;
}

export function JetSkiBoat({
  racer,
  isRacing,
  isSurging = false,
  rankBadge,
}: JetSkiBoatProps) {
  const pal = (UI_THEME.boats as any)[racer.color] || UI_THEME.boats.blue;
  const isHuman = !racer.isBot;
  const isWobbling = racer.wobbleUntil > Date.now();
  const { x, y, yawDeg } = racer.pose;
  // Amplify visual turn angle slightly so turns feel agile and dynamic
  const visualYaw = yawDeg * 1.35;

  return (
    <>
      <style>{`
        .boat-bob {
          animation: boatBobAnim 2s ease-in-out infinite alternate;
        }
        @keyframes boatBobAnim {
          0% { transform: translateY(-1.5px); }
          100% { transform: translateY(1.5px); }
        }
        .boat-wobble {
          animation: boatWobbleAnim 0.12s ease-in-out 3;
        }
        @keyframes boatWobbleAnim {
          0% { transform: rotate(0deg) scale(0.96); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
      <div
        className="absolute z-20 pointer-events-none select-none"
        style={{
          transform: `translate3d(${x}px, ${y}px, 0) rotate(${visualYaw}deg) translate(-100%, -50%)`,
          width: "94px",
          height: "44px",
          transformOrigin: "100% 50%",
          willChange: "transform",
        }}
      >
        {/* Animated Wake Foam Trail trailing behind the boat */}
        <WakeTrail active={isRacing} isSurging={isSurging} />

        <div
          className={`relative w-full h-full ${
            isWobbling ? "boat-wobble" : isRacing ? "boat-bob" : ""
          }`}
        >
          {/* 1. "YOU" Tag above human boat (46 x 32, floats 6px above) */}
          {isHuman && (
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-30"
              style={{ transform: `rotate(${-visualYaw}deg)` }}
            >
              <div className="px-3 py-0.5 rounded-full bg-[#f6a800] border border-[#d97706] text-[#1a1200] font-black text-[11px] tracking-wider shadow-[0_2px_6px_rgba(0,0,0,0.35)] uppercase">
                YOU
              </div>
              <div className="w-0 h-0 border-l-[4.5px] border-l-transparent border-r-[4.5px] border-r-transparent border-t-[5.5px] border-t-[#f6a800] -mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
            </div>
          )}

          {/* 2. Crossed Rank Badge ("1st", "2nd", etc.) */}
          {rankBadge !== undefined && (
            <div
              className="absolute -top-8 right-0 flex items-center justify-center pointer-events-none select-none z-30 animate-in zoom-in-75 duration-200"
              style={{ transform: `rotate(${-visualYaw}deg)` }}
            >
              <div className="px-2.5 py-1 rounded-md bg-[#f6a800] border-2 border-yellow-200 text-amber-950 font-black text-xs shadow-lg">
                {rankBadge === 1
                  ? "🥇 1st"
                  : rankBadge === 2
                    ? "🥈 2nd"
                    : rankBadge === 3
                      ? "🥉 3rd"
                      : "4th"}
              </div>
            </div>
          )}

          {/* 3. Under-Boat Water Ripple & Shadow Elements */}
          <svg
            viewBox="0 0 130 64"
            className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] overflow-visible"
          >
            <defs>
              {/* Outer Hull Gradient */}
              <linearGradient
                id={`boatHull_${racer.id}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={pal.deck} />
                <stop offset="25%" stopColor={pal.hull} />
                <stop offset="75%" stopColor={pal.hull} />
                <stop offset="100%" stopColor={pal.darkSide} />
              </linearGradient>

              {/* Inner Cockpit Deck Highlight */}
              <linearGradient
                id={`boatInner_${racer.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={pal.darkSide} />
                <stop offset="60%" stopColor={pal.hull} />
                <stop offset="100%" stopColor={pal.deck} />
              </linearGradient>

              {/* Dark Maroon Leather Cockpit Seat */}
              <linearGradient
                id="boatMaroonSeat"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={UI_THEME.boats.seat} />
                <stop offset="50%" stopColor="#2e1118" />
                <stop offset="100%" stopColor={UI_THEME.boats.seat} />
              </linearGradient>

              {/* Under-Boat Water Shadow */}
              <radialGradient id="underBoatShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#003049" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#003049" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#003049" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 0. Small Water Ripple & Shadow Elements Under the Boat */}
            <ellipse
              cx="60"
              cy="34"
              rx="58"
              ry="24"
              fill="url(#underBoatShadow)"
            />
            {/* Soft bow water spray ripples on water */}
            <path
              d="M 115 32 C 105 20, 85 14, 60 14"
              fill="none"
              stroke="#e0f7fa"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M 115 32 C 105 44, 85 50, 60 50"
              fill="none"
              stroke="#e0f7fa"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* A. Sleek Main Aerodynamic Hull */}
            <path
              d="M 12 12 C 30 11, 88 12, 122 32 C 88 52, 30 53, 12 52 C 8 52, 6 48, 6 32 C 6 16, 8 12, 12 12 Z"
              fill={`url(#boatHull_${racer.id})`}
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* B. Top Deck Hull Inset & Edge Trim */}
            <path
              d="M 16 16 C 32 15, 84 16, 114 32 C 84 48, 32 49, 16 48 C 12 48, 10 44, 10 32 C 10 20, 12 16, 16 16 Z"
              fill={`url(#boatInner_${racer.id})`}
              opacity="0.95"
            />

            {/* C. Dark Maroon Striped Cockpit Seating */}
            <rect
              x="24"
              y="22"
              width="44"
              height="20"
              rx="5"
              fill="url(#boatMaroonSeat)"
              stroke="#1b070c"
              strokeWidth="1.5"
            />
            {/* Lighter seat rib stripes (#7a3a46) */}
            <line
              x1="33"
              y1="22"
              x2="33"
              y2="42"
              stroke={UI_THEME.boats.seatStripe}
              strokeWidth="1.5"
            />
            <line
              x1="42"
              y1="22"
              x2="42"
              y2="42"
              stroke={UI_THEME.boats.seatStripe}
              strokeWidth="1.5"
            />
            <line
              x1="51"
              y1="22"
              x2="51"
              y2="42"
              stroke={UI_THEME.boats.seatStripe}
              strokeWidth="1.5"
            />
            <line
              x1="60"
              y1="22"
              x2="60"
              y2="42"
              stroke={UI_THEME.boats.seatStripe}
              strokeWidth="1.5"
            />

            {/* D. Small Dark Handlebar just ahead of seat */}
            <rect x="71" y="27" width="6" height="10" rx="2" fill="#1e293b" />
            <line
              x1="74"
              y1="18"
              x2="74"
              y2="46"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx="74"
              cy="19"
              r="2.5"
              fill="#cbd5e1"
              stroke="#0f172a"
              strokeWidth="1"
            />
            <circle
              cx="74"
              cy="45"
              r="2.5"
              fill="#cbd5e1"
              stroke="#0f172a"
              strokeWidth="1"
            />

            {/* E. Rear Engine Stern Mount */}
            <rect x="4" y="24" width="6" height="16" rx="2" fill="#0f172a" />
          </svg>
        </div>
      </div>
    </>
  );
}
