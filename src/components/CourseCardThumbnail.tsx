import React from 'react';
import { Clock } from 'lucide-react';

interface CourseCardThumbnailProps {
  theme?: 'posh' | 'fire-safety' | 'ndrf' | 'swachhata' | 'default';
  durationDisplay?: string;
  title: string;
}

export const CourseCardThumbnail: React.FC<CourseCardThumbnailProps> = ({
  theme = 'default',
  durationDisplay = '1h 30m',
  title,
}) => {
  return (
    <div className="relative w-full aspect-16/9 overflow-hidden bg-slate-900 select-none">
      {theme === 'posh' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1B4CA1] flex flex-col justify-between p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-[#EF951E] text-white px-2 py-0.5 rounded">
                ISTM Masterclass
              </span>
              <p className="text-[10px] text-slate-300 font-semibold tracking-wide">DoPT Statutory Mandate</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold">
              ⚖️
            </div>
          </div>

          <div className="my-auto py-1">
            <h4 className="text-sm font-black leading-tight text-[#FEFAF4] drop-shadow-sm line-clamp-2">
              PREVENTION OF SEXUAL HARASSMENT
            </h4>
            <p className="text-[10px] text-amber-200/90 font-medium tracking-wide mt-0.5">
              OF WOMEN AT THE WORKPLACE (PoSH ACT 2013)
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-[#FFA730]" />
              <span>{durationDisplay}</span>
            </div>
            <span className="text-[9px] text-slate-300 font-medium">Internal Complaints Committee</span>
          </div>
        </div>
      )}

      {theme === 'fire-safety' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#7F1D1D] via-[#991B1B] to-[#1E3A8A] flex flex-col justify-between p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-[#DC2626] text-white px-2 py-0.5 rounded">
                MoHFW & NBC 2016
              </span>
              <p className="text-[10px] text-red-100 font-semibold tracking-wide">Hospital Life Safety Advisory</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-400/40 flex items-center justify-center text-[11px]">
              🧯
            </div>
          </div>

          <div className="my-auto py-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚨</span>
              <h4 className="text-sm font-black leading-tight text-white drop-shadow-sm">
                FIRE SAFETY IN HEALTHCARE FACILITIES
              </h4>
            </div>
            <p className="text-[10px] text-orange-200 font-medium tracking-wide mt-0.5">
              Evacuation Drills • Smoke Dampers • Intensive Care Life Lines
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-[#FFA730]" />
              <span>{durationDisplay}</span>
            </div>
            <span className="text-[9px] text-red-200 font-medium">Emergency Protocols</span>
          </div>
        </div>
      )}

      {theme === 'ndrf' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#1E3A8A] flex flex-col justify-between p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-[#D97706] text-white px-2 py-0.5 rounded">
                NDRF & NDMA
              </span>
              <p className="text-[10px] text-emerald-100 font-semibold tracking-wide">National Disaster Response Doctrine</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-400/40 flex items-center justify-center text-[11px]">
              🇮🇳
            </div>
          </div>

          <div className="my-auto py-1">
            <h4 className="text-sm font-black leading-tight text-white drop-shadow-sm">
              नागरिक सुरक्षा सेवाएँ
            </h4>
            <p className="text-[11px] text-emerald-200 font-bold tracking-wide mt-0.5">
              CIVIL DEFENCE SERVICES
            </p>
            <p className="text-[9px] text-emerald-100/80 mt-0.5 line-clamp-1">
              Disaster Volunteer Network • Crisis Comm • Warden System
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-[#FFA730]" />
              <span>{durationDisplay}</span>
            </div>
            <span className="text-[9px] text-emerald-200 font-medium">Civil Defence Act 1968</span>
          </div>
        </div>
      )}

      {theme === 'swachhata' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#EA580C] via-[#0284C7] to-[#15803D] flex flex-col justify-between p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-[#15803D] text-white px-2 py-0.5 rounded">
                MoHUA • Swachh Bharat
              </span>
              <p className="text-[10px] text-amber-100 font-semibold tracking-wide">जन आन्दोलन राष्ट्रव्यापी अभियान</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[12px]">
              🧹
            </div>
          </div>

          <div className="my-auto py-1">
            <h4 className="text-sm font-black leading-tight text-white drop-shadow-sm">
              स्वच्छता ही सेवा - 2024
            </h4>
            <p className="text-[11px] text-amber-200 font-bold tracking-wide mt-0.5">
              प्रशिक्षण मॉड्यूल (Training Module)
            </p>
            <p className="text-[9px] text-blue-100/90 mt-0.5 line-clamp-1">
              Safai Mitra Suraksha • Cleanliness Target Units (CTUs)
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-[#FFA730]" />
              <span>{durationDisplay}</span>
            </div>
            <span className="text-[9px] text-amber-200 font-medium">SHS 2024 Certified</span>
          </div>
        </div>
      )}

      {theme === 'default' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4CA1] to-[#0A66C2] flex flex-col justify-between p-4 text-white">
          <span className="text-[9px] uppercase tracking-wider font-extrabold bg-white/20 px-2 py-0.5 rounded w-fit">
            iGOT Karmayogi
          </span>
          <h4 className="text-sm font-bold leading-tight">{title}</h4>
          <div className="inline-flex items-center gap-1.5 bg-black/60 text-white text-[11px] font-bold px-2 py-0.5 rounded-md w-fit">
            <Clock className="w-3 h-3 text-[#FFA730]" />
            <span>{durationDisplay}</span>
          </div>
        </div>
      )}
    </div>
  );
};
