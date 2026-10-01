'use client';

import React from 'react';
import { SceneryObjectType } from '../engine/scenery';

interface SceneryObjectSvgProps {
  type: SceneryObjectType;
}

export const SceneryObjectSvg: React.FC<SceneryObjectSvgProps> = React.memo(({ type }) => {
  switch (type) {
    // ── MEADOW BIOME (Bigger in height and canopy width) ──
    case 'tree_round':
      return (
        <svg viewBox="0 0 200 280" className="w-[200px] h-[280px] overflow-visible">
          {/* Ground Shadow */}
          <ellipse cx="100" cy="265" rx="65" ry="12" fill="#1C5217" opacity="0.45" />
          {/* Trunk with Bark Shadow */}
          <rect x="88" y="140" width="24" height="125" rx="5" fill="#5A2F10" />
          <rect x="88" y="140" width="9" height="125" rx="3" fill="#3D1D08" opacity="0.4" />
          {/* Deep Base Foliage */}
          <circle cx="100" cy="115" r="82" fill="#2E852A" />
          <circle cx="62" cy="105" r="60" fill="#3E9B3A" />
          <circle cx="138" cy="110" r="60" fill="#3E9B3A" />
          {/* Front Highlight Foliage */}
          <circle cx="95" cy="70" r="52" fill="#52B844" />
          <circle cx="125" cy="82" r="44" fill="#6CC24A" opacity="0.9" />
          <ellipse cx="95" cy="48" rx="32" ry="18" fill="#9AEB60" opacity="0.75" />
        </svg>
      );

    case 'tree_tall':
      return (
        <svg viewBox="0 0 170 320" className="w-[170px] h-[320px] overflow-visible">
          {/* Ground Shadow */}
          <ellipse cx="85" cy="305" rx="55" ry="11" fill="#1C5217" opacity="0.45" />
          {/* Trunk */}
          <rect x="76" y="170" width="18" height="135" rx="4" fill="#451A03" />
          {/* Pine Tiers (Bottom to Top) */}
          <polygon points="85,145 15,245 155,245" fill="#1B5E20" />
          <polygon points="85,100 28,195 142,195" fill="#2E7D32" />
          <polygon points="85,55 42,140 128,140" fill="#388E3C" />
          <polygon points="85,15 55,85 115,85" fill="#4CAF50" />
          {/* Highlights on Right Face */}
          <polygon points="85,15 115,85 85,85" fill="#81C784" opacity="0.6" />
          <polygon points="85,55 128,140 85,140" fill="#81C784" opacity="0.5" />
          <polygon points="85,100 142,195 85,195" fill="#81C784" opacity="0.4" />
        </svg>
      );

    case 'bush_green':
      return (
        <svg viewBox="0 0 170 120" className="w-[170px] h-[120px] overflow-visible">
          {/* Ground Shadow */}
          <ellipse cx="85" cy="108" rx="65" ry="10" fill="#1C5217" opacity="0.4" />
          {/* Back Dark Bush */}
          <circle cx="58" cy="68" r="46" fill="#1E6617" />
          <circle cx="112" cy="68" r="46" fill="#1E6617" />
          {/* Mid Bush */}
          <circle cx="85" cy="54" r="44" fill="#2E852A" />
          <circle cx="52" cy="56" r="36" fill="#3E9B3A" />
          <circle cx="118" cy="56" r="36" fill="#4CB834" />
          {/* Top Highlight Leaf */}
          <ellipse cx="85" cy="32" rx="28" ry="15" fill="#7EE04A" opacity="0.75" />
        </svg>
      );

    case 'flower_patch':
      return (
        <svg viewBox="0 0 120 80" className="w-[120px] h-[80px] overflow-visible">
          <ellipse cx="60" cy="68" rx="46" ry="8" fill="#1C5217" opacity="0.3" />
          <ellipse cx="42" cy="60" rx="18" ry="9" fill="#2E852A" />
          <ellipse cx="78" cy="60" rx="18" ry="9" fill="#3E9B3A" />
          {/* Daisy 1 */}
          <g transform="translate(36, 40) scale(1.15)">
            <circle cx="0" cy="0" r="5.5" fill="#FFC72C" />
            <circle cx="0" cy="-9" r="4.5" fill="#FFFFFF" />
            <circle cx="9" cy="0" r="4.5" fill="#FFFFFF" />
            <circle cx="0" cy="9" r="4.5" fill="#FFFFFF" />
            <circle cx="-9" cy="0" r="4.5" fill="#FFFFFF" />
            <circle cx="6.5" cy="-6.5" r="4" fill="#FFFFFF" />
            <circle cx="6.5" cy="6.5" r="4" fill="#FFFFFF" />
            <circle cx="-6.5" cy="6.5" r="4" fill="#FFFFFF" />
            <circle cx="-6.5" cy="-6.5" r="4" fill="#FFFFFF" />
          </g>
          {/* Daisy 2 */}
          <g transform="translate(84, 45) scale(1.05)">
            <circle cx="0" cy="0" r="5" fill="#FFC72C" />
            <circle cx="0" cy="-8" r="4" fill="#FFFFFF" />
            <circle cx="8" cy="0" r="4" fill="#FFFFFF" />
            <circle cx="0" cy="8" r="4" fill="#FFFFFF" />
            <circle cx="-8" cy="0" r="4" fill="#FFFFFF" />
            <circle cx="6" cy="-6" r="3.5" fill="#FFFFFF" />
            <circle cx="6" cy="6" r="3.5" fill="#FFFFFF" />
            <circle cx="-6" cy="6" r="3.5" fill="#FFFFFF" />
            <circle cx="-6" cy="-6" r="3.5" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'grey_rock':
      return (
        <svg viewBox="0 0 130 85" className="w-[130px] h-[85px] overflow-visible">
          <ellipse cx="65" cy="70" rx="52" ry="10" fill="#1C5217" opacity="0.35" />
          <path
            d="M 18 66 Q 30 26 65 22 Q 100 24 116 54 Q 112 68 65 70 Z"
            fill="#7B889B"
            stroke="#475569"
            strokeWidth="3"
          />
          <path d="M 38 32 Q 65 24 92 34 L 78 50 L 42 46 Z" fill="#94A3B8" opacity="0.8" />
          <ellipse cx="58" cy="30" rx="16" ry="5" fill="#E2E8F0" opacity="0.75" />
        </svg>
      );

    case 'wooden_fence':
      return (
        <svg viewBox="0 0 190 100" className="w-[190px] h-[100px] overflow-visible">
          <ellipse cx="24" cy="92" rx="14" ry="5" fill="#1C5217" opacity="0.3" />
          <ellipse cx="95" cy="92" rx="14" ry="5" fill="#1C5217" opacity="0.3" />
          <ellipse cx="166" cy="92" rx="14" ry="5" fill="#1C5217" opacity="0.3" />
          {/* Posts */}
          <polygon points="14,20 24,8 34,20 34,92 14,92" fill="#8E5528" stroke="#5A2F10" strokeWidth="2" />
          <polygon points="85,18 95,6 105,18 105,92 85,92" fill="#8E5528" stroke="#5A2F10" strokeWidth="2" />
          <polygon points="156,20 166,8 176,20 176,92 156,92" fill="#8E5528" stroke="#5A2F10" strokeWidth="2" />
          {/* 2 Continuous Rails */}
          <rect x="0" y="30" width="190" height="14" rx="3" fill="#BA7238" stroke="#5A2F10" strokeWidth="2" />
          <rect x="0" y="58" width="190" height="14" rx="3" fill="#A05F2C" stroke="#5A2F10" strokeWidth="2" />
        </svg>
      );

    // ── AUTUMN BIOME ──
    case 'tree_autumn_orange':
      return (
        <svg viewBox="0 0 200 280" className="w-[200px] h-[280px] overflow-visible">
          <ellipse cx="100" cy="265" rx="65" ry="12" fill="#4A260C" opacity="0.4" />
          <rect x="88" y="140" width="24" height="125" rx="5" fill="#451A03" />
          <circle cx="100" cy="115" r="82" fill="#C2410C" />
          <circle cx="62" cy="105" r="60" fill="#EA580C" />
          <circle cx="138" cy="110" r="60" fill="#F97316" />
          <circle cx="95" cy="70" r="52" fill="#FB923C" />
          <ellipse cx="95" cy="48" rx="30" ry="16" fill="#FED7AA" opacity="0.75" />
        </svg>
      );

    case 'tree_autumn_red':
      return (
        <svg viewBox="0 0 200 280" className="w-[200px] h-[280px] overflow-visible">
          <ellipse cx="100" cy="265" rx="65" ry="12" fill="#4A260C" opacity="0.4" />
          <rect x="88" y="140" width="24" height="125" rx="5" fill="#361002" />
          <circle cx="100" cy="115" r="82" fill="#7F1D1D" />
          <circle cx="62" cy="105" r="60" fill="#991B1B" />
          <circle cx="138" cy="110" r="60" fill="#DC2626" />
          <circle cx="95" cy="70" r="52" fill="#EF4444" />
          <ellipse cx="95" cy="48" rx="30" ry="16" fill="#FCA5A5" opacity="0.75" />
        </svg>
      );

    case 'tree_autumn_yellow':
      return (
        <svg viewBox="0 0 200 280" className="w-[200px] h-[280px] overflow-visible">
          <ellipse cx="100" cy="265" rx="65" ry="12" fill="#4A260C" opacity="0.4" />
          <rect x="88" y="140" width="24" height="125" rx="5" fill="#451A03" />
          <circle cx="100" cy="115" r="82" fill="#A16207" />
          <circle cx="62" cy="105" r="60" fill="#CA8A04" />
          <circle cx="138" cy="110" r="60" fill="#EAB308" />
          <circle cx="95" cy="70" r="52" fill="#FACC15" />
          <ellipse cx="95" cy="48" rx="30" ry="16" fill="#FEF08A" opacity="0.75" />
        </svg>
      );

    case 'haystack':
      return (
        <svg viewBox="0 0 150 110" className="w-[150px] h-[110px] overflow-visible">
          <ellipse cx="75" cy="96" rx="60" ry="10" fill="#4A260C" opacity="0.35" />
          <ellipse cx="75" cy="74" rx="58" ry="30" fill="#854D0E" />
          <ellipse cx="75" cy="56" rx="50" ry="40" fill="#CA8A04" />
          <ellipse cx="75" cy="36" rx="35" ry="25" fill="#FDE047" />
        </svg>
      );

    case 'pumpkin_patch':
      return (
        <svg viewBox="0 0 120 80" className="w-[120px] h-[80px] overflow-visible">
          <ellipse cx="60" cy="70" rx="46" ry="8" fill="#4A260C" opacity="0.3" />
          {/* Pumpkin 1 */}
          <ellipse cx="44" cy="52" rx="25" ry="19" fill="#EA580C" />
          <ellipse cx="44" cy="52" rx="17" ry="19" fill="#F97316" />
          <rect x="41" y="27" width="5" height="10" rx="1.5" fill="#15803D" />
          {/* Pumpkin 2 */}
          <ellipse cx="84" cy="58" rx="20" ry="15" fill="#EA580C" />
          <ellipse cx="84" cy="58" rx="14" ry="15" fill="#F97316" />
          <rect x="82" y="38" width="4.5" height="8" rx="1.5" fill="#15803D" />
        </svg>
      );

    case 'autumn_bush':
      return (
        <svg viewBox="0 0 170 120" className="w-[170px] h-[120px] overflow-visible">
          <ellipse cx="85" cy="108" rx="65" ry="10" fill="#4A260C" opacity="0.35" />
          <circle cx="58" cy="68" r="46" fill="#9A3412" />
          <circle cx="112" cy="68" r="46" fill="#C2410C" />
          <circle cx="85" cy="54" r="44" fill="#EA580C" />
          <circle cx="118" cy="56" r="36" fill="#F97316" />
          <ellipse cx="85" cy="32" rx="28" ry="15" fill="#FDBA74" opacity="0.75" />
        </svg>
      );

    // ── SEASIDE BIOME ──
    case 'palm_tree':
      return (
        <svg viewBox="0 0 200 280" className="w-[200px] h-[280px] overflow-visible">
          <ellipse cx="100" cy="265" rx="60" ry="12" fill="#78350F" opacity="0.35" />
          <path d="M 94 260 Q 120 150 98 65" stroke="#8E5528" strokeWidth="24" fill="none" strokeLinecap="round" />
          <path d="M 98 65 Q 32 40 14 95" stroke="#15803D" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M 98 65 Q 95 -12 45 -25" stroke="#16A34A" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M 98 65 Q 150 -6 182 20" stroke="#22C55E" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M 98 65 Q 170 50 190 110" stroke="#15803D" strokeWidth="9" fill="none" strokeLinecap="round" />
          <circle cx="90" cy="72" r="8" fill="#713F12" />
          <circle cx="106" cy="72" r="8" fill="#713F12" />
        </svg>
      );

    case 'beach_umbrella':
      return (
        <svg viewBox="0 0 160 180" className="w-[160px] h-[180px] overflow-visible">
          <ellipse cx="80" cy="170" rx="45" ry="8" fill="#78350F" opacity="0.3" />
          <line x1="80" y1="58" x2="80" y2="170" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
          <path d="M 12 65 Q 80 -20 148 65 Z" fill="#EF4444" />
          <path d="M 40 65 Q 80 -10 80 65 Z" fill="#FFFFFF" />
          <path d="M 80 65 Q 80 -10 120 65 Z" fill="#FFFFFF" />
        </svg>
      );

    case 'lighthouse':
      return (
        <svg viewBox="0 0 130 310" className="w-[130px] h-[310px] overflow-visible">
          <ellipse cx="65" cy="295" rx="50" ry="11" fill="#334155" opacity="0.4" />
          <polygon points="32,290 98,290 84,60 46,60" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
          <polygon points="36,245 94,245 89,190 41,190" fill="#EF4444" />
          <polygon points="44,145 86,145 81,100 49,100" fill="#EF4444" />
          {/* Lantern Top */}
          <rect x="44" y="26" width="42" height="34" fill="#FEF08A" stroke="#0F172A" strokeWidth="3" />
          <polygon points="36,26 94,26 65,5" fill="#0F172A" />
        </svg>
      );

    case 'small_boat':
      return (
        <svg viewBox="0 0 130 105" className="w-[130px] h-[105px] overflow-visible">
          <path d="M 20 78 Q 65 96 110 78 L 102 91 Q 65 101 28 91 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <line x1="65" y1="21" x2="65" y2="78" stroke="#78350F" strokeWidth="4" />
          <polygon points="65,26 102,55 65,55" fill="#38BDF8" />
        </svg>
      );

    case 'beach_rock':
    case 'seashell_patch':
    default:
      return (
        <svg viewBox="0 0 105 65" className="w-[105px] h-[65px] overflow-visible">
          <ellipse cx="52" cy="52" rx="40" ry="8" fill="#78350F" opacity="0.25" />
          <ellipse cx="52" cy="39" rx="34" ry="18" fill="#DFBA75" stroke="#A16207" strokeWidth="2.5" />
          <circle cx="36" cy="32" r="5.5" fill="#F43F5E" />
          <circle cx="62" cy="42" r="4.5" fill="#FFFFFF" />
        </svg>
      );
  }
});

SceneryObjectSvg.displayName = 'SceneryObjectSvg';
