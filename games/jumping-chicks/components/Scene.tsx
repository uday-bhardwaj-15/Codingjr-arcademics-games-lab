'use client';

import React from 'react';
import { PlatformCluster } from './PlatformCluster';

interface SceneProps {
  children: React.ReactNode;
}

export const Scene: React.FC<SceneProps> = ({ children }) => {
  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#76ded4] via-[#8ae6dc] to-[#bcf7ef] select-none">
      {/* Top Distant Upcoming Petal Clusters Row (Matches Screenshot 1 top row) */}
      <div className="absolute top-2 inset-x-4 flex justify-between items-center pointer-events-none opacity-85 z-0">
        <div className="transform scale-65 origin-top">
          <PlatformCluster count={4} index={-1} onClick={() => {}} disabled />
        </div>
        <div className="transform scale-65 origin-top">
          <PlatformCluster count={7} index={-1} onClick={() => {}} disabled />
        </div>
        <div className="transform scale-65 origin-top">
          <PlatformCluster count={1} index={-1} onClick={() => {}} disabled />
        </div>
        <div className="transform scale-65 origin-top">
          <PlatformCluster count={6} index={-1} onClick={() => {}} disabled />
        </div>
      </div>

      {/* Main Interactive Play Area */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
