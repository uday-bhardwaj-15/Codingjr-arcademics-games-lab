import React from 'react';
import { RacerProgress } from '../types';
import { CAR_COLORS } from '../constants';

interface DistanceBarProps {
  racers: RacerProgress[];
}

export const DistanceBar: React.FC<DistanceBarProps> = ({ racers }) => {
  return (
    <div className="absolute right-4 sm:right-6 bottom-8 sm:bottom-12 top-28 w-3 sm:w-4 bg-black/40 backdrop-blur-xs rounded-full border border-white/40 flex flex-col justify-between items-center py-2 z-20 select-none shadow-xl">
      {/* Finish Checkered Flag Top */}
      <div className="w-4 sm:w-5 h-2.5 sm:h-3 rounded-xs overflow-hidden border border-white flex flex-wrap">
        <div className="w-1/2 h-1/2 bg-white" />
        <div className="w-1/2 h-1/2 bg-black" />
        <div className="w-1/2 h-1/2 bg-black" />
        <div className="w-1/2 h-1/2 bg-white" />
      </div>

      {/* Track Spine */}
      <div className="relative flex-1 w-full my-1">
        {racers.map((racer) => {
          const progress = Math.min(1, Math.max(0, racer.progress));
          const bottomPercent = progress * 92; // 0% to 92% from bottom
          const c = CAR_COLORS[racer.color] || CAR_COLORS.blue;

          return (
            <div
              key={racer.id}
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 flex items-center justify-center pointer-events-none"
              style={{ bottom: `${bottomPercent}%` }}
            >
              {/* Marker Pip / Little Car Color Flag */}
              <div
                className="w-4 sm:w-5 h-2 sm:h-2.5 rounded-sm shadow-md border border-white"
                style={{ backgroundColor: c.primary }}
              />
            </div>
          );
        })}
      </div>

      {/* Start Line Bottom */}
      <div className="w-2.5 h-1 bg-white/70 rounded-full" />
    </div>
  );
};
