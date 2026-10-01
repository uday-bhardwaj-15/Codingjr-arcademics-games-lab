'use client';

import React from 'react';
import { RacerProgress } from '../types';
import { raceTheme } from '../raceTheme';

interface ProgressRailProps {
  racers: RacerProgress[];
  className?: string;
}

export const ProgressRail: React.FC<ProgressRailProps> = ({ racers, className = '' }) => {
  const trackHeight = 220;

  // Calculate vertical positions (in pixels from bottom)
  const dotPositions = racers.map((racer, index) => {
    const clamped = Math.min(1, Math.max(0, racer.progress));
    const yPx = clamped * (trackHeight - 22);
    return {
      racer,
      index,
      yPx,
      xOffset: 0,
    };
  });

  // If two dots are within 14px vertically, offset them sideways by 5px alternately
  for (let i = 0; i < dotPositions.length; i++) {
    for (let j = i + 1; j < dotPositions.length; j++) {
      if (Math.abs(dotPositions[i].yPx - dotPositions[j].yPx) < 14) {
        dotPositions[i].xOffset = dotPositions[i].index % 2 === 0 ? -4 : 4;
        dotPositions[j].xOffset = dotPositions[j].index % 2 === 0 ? -4 : 4;
      }
    }
  }

  return (
    <div
      className={`absolute right-[22px] top-[110px] z-30 flex flex-col items-center select-none pointer-events-none ${className}`}
      style={{ width: '28px' }}
    >
      {/* 1. Checkered Finish Flag at Top */}
      <div className="relative w-6 h-6 rounded-md overflow-hidden border-2 border-white shadow-md mb-1 bg-black">
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
          <div className="bg-white" />
          <div className="bg-black" />
          <div className="bg-black" />
          <div className="bg-white" />
        </div>
      </div>

      {/* 2. Vertical Teal Track Pill (18px wide) */}
      <div
        className="relative rounded-full border-2 border-white shadow-lg flex flex-col justify-end items-center"
        style={{
          width: '18px',
          height: `${trackHeight}px`,
          backgroundImage: 'linear-gradient(180deg, #1fa574 0%, #0d5e41 100%)',
        }}
      >
        {/* Subtle white center dash guide */}
        <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-0.5 border-r border-dashed border-white/30 pointer-events-none" />

        {/* 3. Four Colored Racer Progress Dots (Always visible & properly offset) */}
        {dotPositions.map(({ racer, yPx, xOffset }) => {
          const c = raceTheme.cars[racer.color as keyof typeof raceTheme.cars] || raceTheme.cars.blue;
          const isHuman = !racer.isBot;
          const translateY = -yPx;

          return (
            <div
              key={racer.id}
              className="absolute bottom-1 transition-transform duration-500 ease-out"
              style={{
                left: '50%',
                transform: `translateX(calc(-50% + ${xOffset}px)) translateY(${translateY}px)`,
                zIndex: isHuman ? 35 : 25,
              }}
            >
              {/* Circular Dot */}
              <div
                className={`rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all ${
                  isHuman ? 'w-[18px] h-[18px] ring-2 ring-sky-300' : 'w-[15px] h-[15px]'
                }`}
                style={{
                  backgroundColor: c.mid,
                  boxShadow: isHuman
                    ? '0 0 10px rgba(46, 139, 255, 0.8), 0 2px 4px rgba(0,0,0,0.5)'
                    : '0 2px 4px rgba(0,0,0,0.4)',
                }}
              >
                {/* Specular Glint */}
                <div className="w-1 h-1 rounded-full bg-white opacity-80 -mt-0.5 -ml-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
