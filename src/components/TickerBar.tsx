import React from 'react';
import { Megaphone, Award, CheckCircle2, ChevronRight } from 'lucide-react';

interface TickerBarProps {
  onActionClick: () => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ onActionClick }) => {
  return (
    <div id="igot-ticker-bar" className="w-full bg-[#FFE9CD] border-b border-[#FFD2A1] text-xs py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 overflow-hidden">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="inline-flex items-center gap-1 bg-[#1B4CA1] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 shadow-xs">
          <Megaphone className="w-3 h-3 text-[#FFA730]" />
          <span>Notice</span>
        </span>
        <div className="text-[#374151] text-xs truncate flex items-center gap-2">
          <span className="font-bold text-[#1B4CA1]">Mission Karmayogi Bharat:</span>
          <span className="truncate">Annual Competency Framework (FRAC 2.0) updated with GFR 2024 Rule 149 & DPDP Act 2023 directives.</span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-[#0A66C2] font-semibold bg-white/80 border border-[#FFD2A1] px-1.5 py-0.2 rounded">
            <CheckCircle2 className="w-3 h-3 text-[#1B4CA1]" />
            DoPT Verified
          </span>
        </div>
      </div>

      <button
        onClick={onActionClick}
        className="shrink-0 hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#C37024] hover:text-[#EF951E] transition-colors cursor-pointer"
      >
        <Award className="w-3.5 h-3.5 text-[#EF951E]" />
        <span>Action Required (2 Gaps)</span>
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};
