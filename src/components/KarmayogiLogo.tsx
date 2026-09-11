import React from 'react';

interface KarmayogiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showMotto?: boolean;
}

export const KarmayogiLogo: React.FC<KarmayogiLogoProps> = ({
  className = '',
  size = 'md',
  showMotto = true,
}) => {
  // Size mapping
  const sizeConfig = {
    sm: { emblemH: 34, titleText: 'text-base sm:text-lg', mottoText: 'text-[9px]' },
    md: { emblemH: 44, titleText: 'text-xl sm:text-2xl', mottoText: 'text-[10px] sm:text-[11px]' },
    lg: { emblemH: 56, titleText: 'text-2xl sm:text-3xl', mottoText: 'text-xs sm:text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Karmayogi Bharat Official Stylized Emblem: Pen-Nib, Solar Aura, Geometric Lotus Wings & Mouse */}
      <svg
        viewBox="0 0 140 125"
        style={{ height: `${sizeConfig.emblemH}px`, width: 'auto' }}
        className="shrink-0 overflow-visible drop-shadow-2xs"
        aria-label="Karmayogi Bharat Emblem"
      >
        <defs>
          {/* Subtle gradient for faceted wing petals */}
          <linearGradient id="facetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E6F0FA" stopOpacity="0.85" />
          </linearGradient>

          {/* Golden Solar Aura gradient */}
          <radialGradient id="solarAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="60%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#EF951E" />
          </radialGradient>

          {/* Royal Navy Nib Gradient */}
          <linearGradient id="nibNavy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1B4CA1" />
            <stop offset="100%" stopColor="#0B2B68" />
          </linearGradient>
        </defs>

        {/* 1. LEFT WING / LOTUS PETALS (Faceted geometric origami wireframe) */}
        <g stroke="#EF951E" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          {/* Upper Outer Petal */}
          <polygon points="70,46 54,26 44,8 58,16" fill="url(#facetGrad)" />
          <polygon points="58,16 44,8 34,22 48,30" fill="#FFFFFF" />
          
          {/* Mid Upper Petal */}
          <polygon points="48,30 34,22 18,28 32,40" fill="url(#facetGrad)" />
          <polygon points="54,46 48,30 32,40 44,48" fill="#FFFFFF" />

          {/* Mid Lower Petal */}
          <polygon points="44,48 32,40 12,46 28,58" fill="url(#facetGrad)" />
          <polygon points="56,58 44,48 28,58 40,64" fill="#FFFFFF" />

          {/* Lower Base Petal */}
          <polygon points="40,64 28,58 14,68 34,74" fill="url(#facetGrad)" />
          <polygon points="60,68 40,64 34,74 52,76" fill="#FFFFFF" />
        </g>

        {/* 2. RIGHT WING / LOTUS PETALS (Mirror symmetry) */}
        <g stroke="#EF951E" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          {/* Upper Outer Petal */}
          <polygon points="70,46 86,26 96,8 82,16" fill="url(#facetGrad)" />
          <polygon points="82,16 96,8 106,22 92,30" fill="#FFFFFF" />

          {/* Mid Upper Petal */}
          <polygon points="92,30 106,22 122,28 108,40" fill="url(#facetGrad)" />
          <polygon points="86,46 92,30 108,40 96,48" fill="#FFFFFF" />

          {/* Mid Lower Petal */}
          <polygon points="96,48 108,40 128,46 112,58" fill="url(#facetGrad)" />
          <polygon points="84,58 96,48 112,58 100,64" fill="#FFFFFF" />

          {/* Lower Base Petal */}
          <polygon points="100,64 112,58 126,68 106,74" fill="url(#facetGrad)" />
          <polygon points="80,68 100,64 106,74 88,76" fill="#FFFFFF" />
        </g>

        {/* 3. CENTRAL HUMAN FIGURE / PEN NIB */}
        {/* Solar Halo (Glowing Sun Head) */}
        <circle cx="70" cy="38" r="8" fill="url(#solarAura)" stroke="#EF951E" strokeWidth="1" />
        <circle cx="70" cy="38" r="4" fill="#FFFFFF" opacity="0.6" />

        {/* Pen Nib Body (Civil Servant Torso & Instrument) */}
        <path
          d="M62 48 L78 48 L76 60 L73 70 L70 82 L67 70 L64 60 Z"
          fill="url(#nibNavy)"
          stroke="#EF951E"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Nib Breather Hole & Split Line */}
        <circle cx="70" cy="62" r="2" fill="#FFFFFF" />
        <line x1="70" y1="64" x2="70" y2="82" stroke="#EF951E" strokeWidth="1.4" strokeLinecap="round" />

        {/* Gold Accent Tips on Nib */}
        <polygon points="68,76 72,76 70,82" fill="#FFA726" />

        {/* 4. DIGITAL EMPOWERMENT: CORD LOOP & COMPUTER MOUSE */}
        {/* Looping Cord (Digital civil services & connectivity) */}
        <path
          d="M70 82 C70 94 92 88 94 98 C96 108 72 110 58 96 C48 86 34 88 38 106 C39 110 40 114 44 116"
          fill="none"
          stroke="#1B2133"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Computer Mouse at cord termination */}
        <g transform="translate(36, 102) rotate(-22)">
          <rect
            x="0"
            y="0"
            width="12"
            height="18"
            rx="5"
            fill="#1B2133"
            stroke="#1B4CA1"
            strokeWidth="0.8"
          />
          {/* Mouse buttons dividing seam */}
          <line x1="6" y1="2" x2="6" y2="7" stroke="#EF951E" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="1.5" y1="7" x2="10.5" y2="7" stroke="#94A3B8" strokeWidth="0.6" />
          {/* Scroll wheel */}
          <rect x="5" y="3" width="2" height="3" rx="0.8" fill="#EF951E" />
        </g>
      </svg>

      {/* Official Text: "कर्मयोगी भारत" and "—— लोकहितं मम करणीयम् ——" */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-black tracking-tight ${sizeConfig.titleText} flex items-baseline gap-1.5`}>
          {/* Saffron: कर्मयोगी */}
          <span className="text-[#EF951E] font-extrabold" style={{ fontFamily: "'Noto Sans Devanagari', 'Segoe UI', system-ui, sans-serif" }}>
            कर्मयोगी
          </span>
          {/* Royal Navy: भारत */}
          <span className="text-[#1B4CA1] font-extrabold" style={{ fontFamily: "'Noto Sans Devanagari', 'Segoe UI', system-ui, sans-serif" }}>
            भारत
          </span>
        </div>

        {showMotto && (
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[#1B2133] opacity-95">
            <span className="h-[1px] w-4 sm:w-6 bg-[#1B2133]/60"></span>
            <span
              className={`font-semibold tracking-wider text-[#1B2133] whitespace-nowrap ${sizeConfig.mottoText}`}
              style={{ fontFamily: "'Noto Sans Devanagari', 'Segoe UI', system-ui, sans-serif" }}
            >
              लोकहितं मम करणीयम्
            </span>
            <span className="h-[1px] w-4 sm:w-6 bg-[#1B2133]/60"></span>
          </div>
        )}
      </div>
    </div>
  );
};
