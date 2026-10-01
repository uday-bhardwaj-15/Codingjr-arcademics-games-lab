"use client";

import React, { useEffect, useId, useState } from "react";

/**
 * Compact boat wake.
 *
 * Why this replaces the old one:
 * - 120 x 36 instead of 220 x 58 (scaled 1.15 on Y when surging). The old wake was almost as tall
 *   as the lane pitch (64), so it spilled into the neighbouring lanes and overlapped their wakes.
 *   This one stays within about +-18 px of the boat axis (+-26 px at max bend).
 * - No dark "displacement shadow" (it made the water look dirty). Only white / cyan foam.
 * - Stroke gradients use userSpaceOnUse. A bbox gradient on a near-horizontal stroke has ~0 height
 *   and can render invisible.
 * - Surge only stretches the wake in length (scaleX). `scale-x-130` is not a default Tailwind class,
 *   so it is done with an inline transform.
 * - Unique gradient ids per instance (useId), safe with 4 boats on screen and with SSR.
 *
 * Place it as a child of the boat group (so it follows x, y, yaw, bank and steering) and draw it
 * below the hull. It is anchored just inside the stern (right edge = 96% of the boat width).
 */

interface WakeTrailProps {
  active?: boolean;
  /** Boat is in a step surge: longer, brighter, thicker core. */
  isSurging?: boolean;
  /**
   * Swing of the wake tail in degrees, clamped to +-10. Positive = tail swings up.
   * Use it when the boat moves sideways or yaws (lane change, turn): pass the OPPOSITE of the
   * direction the boat is moving, e.g. boat steering down -> positive. Default 0.
   */
  bendDeg?: number;
  /** Turn the foam motion off (it is also off for prefers-reduced-motion). */
  animated?: boolean;
}

const W = 100;
const H = 36;
const CY = 18;

export function WakeTrail({
  active = true,
  isSurging = false,
  bendDeg = 0,
  animated = true,
}: WakeTrailProps) {
  const uid = useId().replace(/:/g, "");
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOk(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!active) return null;

  const run = animated && motionOk;
  const bend = Math.max(-10, Math.min(10, bendDeg));
  const coreW = isSurging ? 3.6 : 2.4;
  const dashDur = isSurging ? "0.35s" : "0.6s";

  const fan = `M ${W} ${CY - 7}
    C 96 ${CY - 9}, 58 ${CY - 10}, 18 ${CY - 11}
    Q 5 ${CY}, 18 ${CY + 11}
    C 58 ${CY + 10}, 96 ${CY + 9}, ${W} ${CY + 7} Z`;

  const edgeTop = `M ${W - 6} ${CY - 8} C 92 ${CY - 11}, 56 ${CY - 13}, 22 ${CY - 14}`;
  const edgeBottom = `M ${W - 6} ${CY + 8} C 92 ${CY + 11}, 56 ${CY + 13}, 22 ${CY + 14}`;
  const core1 = `M 114 ${CY - 1.5} C 92 ${CY - 1}, 58 ${CY}, 26 ${CY}`;
  const core2 = `M 112 ${CY + 3.5} C 90 ${CY + 3}, 64 ${CY + 3.5}, 40 ${CY + 3}`;

  return (
    <div
      aria-hidden
      className="absolute right-[96%] top-1/2 pointer-events-none select-none overflow-visible"
      style={{
        width: W,
        height: H,
        transformOrigin: "100% 50%",
        transform: `translateY(-50%) rotate(${-bend}deg) scaleX(${isSurging ? 1.35 : 1})`,
        opacity: isSurging ? 1 : 0.92,
        transition:
          "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease-out",
        willChange: "transform",
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="overflow-visible"
      >
        <defs>
          {/* Foam body: bright at the stern, fades into the water */}
          <linearGradient id={`${uid}-fan`} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="0.3" stopColor="#ecfdff" stopOpacity="0.72" />
            <stop offset="0.65" stopColor="#aee9f7" stopOpacity="0.24" />
            <stop offset="0.88" stopColor="#7fd8ef" stopOpacity="0.05" />
            <stop offset="1" stopColor="#7fd8ef" stopOpacity="0" />
          </linearGradient>
          {/* Strokes: userSpaceOnUse so thin horizontal lines still get a gradient */}
          <linearGradient
            id={`${uid}-line`}
            gradientUnits="userSpaceOnUse"
            x1={W}
            y1="0"
            x2="0"
            y2="0"
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={`${uid}-edge`}
            gradientUnits="userSpaceOnUse"
            x1={W}
            y1="0"
            x2="0"
            y2="0"
          >
            <stop offset="0" stopColor="#d8f6ff" stopOpacity="0.8" />
            <stop offset="0.6" stopColor="#9fe4f5" stopOpacity="0.35" />
            <stop offset="1" stopColor="#9fe4f5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. foam body (narrow V, widest point about 22 px) */}
        <path d={fan} fill={`url(#${uid}-fan)`} />

        {/* 2. thin V edges that define the shape */}
        <path
          d={edgeTop}
          fill="none"
          stroke={`url(#${uid}-edge)`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d={edgeBottom}
          fill="none"
          stroke={`url(#${uid}-edge)`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 3. flowing foam streaks (dash offset runs toward the tail) */}
        <path
          d={core1}
          fill="none"
          stroke={`url(#${uid}-line)`}
          strokeWidth={coreW}
          strokeLinecap="round"
          strokeDasharray="16 9"
        >
          {run && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="25"
              dur={dashDur}
              repeatCount="indefinite"
            />
          )}
        </path>
        <path
          d={core2}
          fill="none"
          stroke={`url(#${uid}-line)`}
          strokeWidth={isSurging ? 2.2 : 1.5}
          strokeLinecap="round"
          strokeDasharray="10 8"
          opacity="0.85"
        >
          {run && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="18"
              dur={isSurging ? "0.45s" : "0.8s"}
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* 4. engine foam right behind the stern */}
        <ellipse
          cx="111"
          cy={CY}
          rx="9"
          ry="6.5"
          fill="#ffffff"
          opacity="0.9"
        />
        <ellipse
          cx="102"
          cy={CY}
          rx="11"
          ry="4.5"
          fill="#ffffff"
          opacity="0.5"
        />

        {/* 5. a few bubbles that twinkle */}
        {[
          [92, CY - 5, 1.6, 0],
          [76, CY + 5, 1.3, 0.3],
          [60, CY - 3, 1.8, 0.6],
          [46, CY + 4, 1.2, 0.9],
          [32, CY - 1, 1.4, 1.2],
        ].map(([cx, cy, r, delay], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" opacity="0.7">
            {run && (
              <animate
                attributeName="opacity"
                values="0.15;0.85;0.15"
                dur="1.6s"
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
      </svg>
    </div>
  );
}
