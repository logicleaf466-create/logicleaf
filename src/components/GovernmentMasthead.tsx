import React from 'react';
import { ShieldCheck, Settings } from 'lucide-react';

interface GovernmentMastheadProps {
  onOpenSettings: () => void;
  language?: 'English' | 'हिन्दी';
}

export const GovernmentMasthead: React.FC<GovernmentMastheadProps> = ({
  onOpenSettings,
  language = 'English',
}) => {
  return (
    <div id="goi-masthead" className="w-full bg-[#0B1E36] text-slate-200 text-xs border-b border-slate-700/60 select-none">
      {/* Indian National Tricolor Top Stripe (Saffron, White, Green) */}
      <div className="india-tricolor-bar"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Official Ashoka Stambh Emblem & Government Credentials */}
        <div className="flex items-center gap-3">
          {/* Ashoka Stambh Lion Capital Icon */}
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 100 100"
              className="w-6 h-6 text-amber-400 drop-shadow-sm shrink-0 fill-current"
              aria-label="State Emblem of India"
            >
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3" />
              <path
                d="M50 14 C44 14 38 18 36 24 C34 30 36 38 42 42 C44 43 45 45 45 48 L45 74 L32 74 L32 82 L68 82 L68 74 L55 74 L55 48 C55 45 56 43 58 42 C64 38 66 30 64 24 C62 18 56 14 50 14 Z"
                fill="currentColor"
              />
              <circle cx="50" cy="62" r="6" fill="#0B1E36" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="42" cy="24" r="2.5" fill="#0B1E36" />
              <circle cx="58" cy="24" r="2.5" fill="#0B1E36" />
              <circle cx="50" cy="23" r="2.5" fill="#0B1E36" />
              <path d="M40 84 L60 84" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wide text-white font-['Noto_Sans_Devanagari',sans-serif]">भारत सरकार</span>
                <span className="text-slate-400">|</span>
                <span className="font-semibold tracking-wide text-slate-200">Government of India</span>
              </div>
              <p className="text-[10px] text-slate-300 truncate max-w-[280px] sm:max-w-none">
                {language === 'हिन्दी'
                  ? 'कार्मिक, लोक शिकायत तथा पेंशन मंत्रालय • कार्मिक एवं प्रशिक्षण विभाग (DoPT)'
                  : 'Ministry of Personnel, Public Grievances & Pensions • Dept of Personnel & Training (DoPT)'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Official Mission Tag, Gov.in Verification & Settings Button */}
        <div className="flex items-center gap-3 text-[11px]">
          {/* Mission Tag */}
          <span className="hidden md:inline-block text-[10px] text-slate-300 font-medium tracking-wide">
            राष्ट्रीय सिविल सेवा क्षमता विकास कार्यक्रम (NPCSCB)
          </span>

          <div className="h-3 w-px bg-slate-700 hidden md:block"></div>

          {/* Secure .gov.in Badge */}
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded font-mono font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>gov.in</span>
          </div>

          {/* Clean Portal Settings & Accessibility Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer text-[11px] font-semibold"
            title="Portal Settings, Accessibility & Notifications"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'हिन्दी' ? 'सेटिंग्स' : 'Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
