import React from 'react';

interface MinistryLogoProps {
  type: 'istm' | 'mohfw' | 'ndrf' | 'mohua' | 'default';
  className?: string;
}

export const MinistryLogo: React.FC<MinistryLogoProps> = ({ type, className = 'w-5 h-5' }) => {
  if (type === 'istm') {
    return (
      <svg viewBox="0 0 100 100" class={`${className} shrink-0 text-[#1B4CA1]`} aria-label="ISTM Logo">
        <circle cx="50" cy="50" r="46" fill="#1B4CA1" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#FFA730" strokeWidth="2.5" />
        {/* Open book */}
        <path
          d="M 28 42 Q 40 38 50 42 Q 60 38 72 42 L 72 66 Q 60 62 50 66 Q 40 62 28 66 Z"
          fill="#FFFFFF"
          stroke="#1B4CA1"
          strokeWidth="1.5"
        />
        <line x1="50" y1="42" x2="50" y2="66" stroke="#1B4CA1" strokeWidth="2" />
        {/* Ashoka wheel rays in center top */}
        <circle cx="50" cy="30" r="8" fill="#FFA730" />
        <circle cx="50" cy="30" r="5" fill="#1B4CA1" />
        {/* Wheat ears / laurel */}
        <path d="M 22 55 Q 20 68 30 76" stroke="#FFA730" strokeWidth="2.5" fill="none" />
        <path d="M 78 55 Q 80 68 70 76" stroke="#FFA730" strokeWidth="2.5" fill="none" />
      </svg>
    );
  }

  if (type === 'mohfw') {
    return (
      <svg viewBox="0 0 100 100" class={`${className} shrink-0 text-[#1B2133]`} aria-label="MoHFW Emblem">
        <circle cx="50" cy="50" r="46" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Ashoka Lion Stambh */}
        <path
          d="M50 20 C44 20 38 24 36 30 C34 36 36 44 42 48 C44 49 45 51 45 54 L45 74 L32 74 L32 80 L68 80 L68 74 L55 74 L55 54 C55 51 56 49 58 48 C64 44 66 36 64 30 C62 24 56 20 50 20 Z"
          fill="#1B2133"
        />
        <circle cx="50" cy="65" r="5" fill="#EF951E" />
        <path d="M36 82 L64 82" stroke="#1B2133" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'ndrf') {
    return (
      <svg viewBox="0 0 100 100" class={`${className} shrink-0`} aria-label="NDRF Logo">
        <circle cx="50" cy="50" r="46" fill="#FEFAF4" stroke="#DBA501" strokeWidth="2" />
        <circle cx="50" cy="50" r="38" fill="#1B4CA1" />
        {/* NDRF Lifebuoy & Rescue Wings */}
        <circle cx="50" cy="50" r="22" fill="#FFFFFF" stroke="#EF951E" strokeWidth="4" />
        <circle cx="50" cy="50" r="12" fill="#1B4CA1" />
        {/* Tricolor in center */}
        <rect x="42" y="44" width="16" height="4" fill="#EF951E" />
        <rect x="42" y="48" width="16" height="4" fill="#FFFFFF" />
        <rect x="42" y="52" width="16" height="4" fill="#15803D" />
        {/* Laurel / wings */}
        <path d="M 22 45 Q 16 35 28 26 Q 34 36 30 50" fill="#FFA730" />
        <path d="M 78 45 Q 84 35 72 26 Q 66 36 70 50" fill="#FFA730" />
      </svg>
    );
  }

  if (type === 'mohua') {
    return (
      <svg viewBox="0 0 100 100" class={`${className} shrink-0`} aria-label="MoHUA Swachh Bharat Logo">
        <circle cx="50" cy="50" r="46" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
        {/* Gandhi spectacles (Chashma) - Swachh Bharat icon */}
        <circle cx="36" cy="48" r="14" fill="none" stroke="#15803D" strokeWidth="4" />
        <circle cx="64" cy="48" r="14" fill="none" stroke="#15803D" strokeWidth="4" />
        <path d="M 50 48 Q 50 44 50 48" stroke="#15803D" strokeWidth="4" />
        <line x1="22" y1="46" x2="14" y2="40" stroke="#15803D" strokeWidth="3" />
        <line x1="78" y1="46" x2="86" y2="40" stroke="#15803D" strokeWidth="3" />
        {/* Swachh Bharat text representation */}
        <rect x="25" y="70" width="50" height="8" rx="4" fill="#EF951E" />
      </svg>
    );
  }

  return (
    <div class={`${className} rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-700`}>
      GOI
    </div>
  );
};
