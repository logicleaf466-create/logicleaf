import React, { useState } from 'react';
import { UserProfile, ScreenId } from '../../types';
import {
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Download,
  Share2,
  FileCheck,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

interface ProgressScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onOpenCopilot?: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ user, onNavigate, onOpenCopilot }) => {
  const [dossierGenerated, setDossierGenerated] = useState(false);

  const months = [
    { name: 'Apr', hours: 16, target: 15 },
    { name: 'May', hours: 22, target: 18 },
    { name: 'Jun', hours: 28, target: 20 },
    { name: 'Jul', hours: 34, target: 25 },
    { name: 'Aug', hours: 41, target: 30 },
    { name: 'Sep', hours: 26, target: 25 },
  ];

  const badges = [
    {
      title: 'Certified Public Procurement Officer (GFR 2024)',
      authority: 'National Institute of Financial Management (NIFM)',
      date: 'Aug 2024',
      code: 'BM-04',
      level: 'Apex Executive',
      kp: 250,
      color: 'bg-[#EDF1F7] border-[#C7D9FB]',
    },
    {
      title: 'Digital Governance & Cyber Vigilance Lead',
      authority: 'Ministry of Electronics & IT (MeitY) & NIC',
      date: 'Jul 2024',
      code: 'FR-01',
      level: 'Mastery',
      kp: 300,
      color: 'bg-[#FFE9CD] border-[#FFD2A1]',
    },
    {
      title: 'Sevottam Citizen Grievance Redressal Distinction',
      authority: 'DARPG, Government of India',
      date: 'May 2024',
      code: 'CC-01',
      level: 'Honorary Distinction',
      kp: 200,
      color: 'bg-[#FEF3C7] border-[#FDE68A]',
    },
    {
      title: 'Administrative Ethics & AI Oversight Fellow',
      authority: 'LBSNAA Mussoorie',
      date: 'Mar 2024',
      code: 'EV-02',
      level: 'Apex Executive',
      kp: 350,
      color: 'bg-[#EDF1F7] border-[#C7D9FB]',
    },
  ];

  const handleExportDossier = () => {
    setDossierGenerated(true);
    setTimeout(() => setDossierGenerated(false), 4000);
  };

  return (
    <section id="progress-screen" className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Officer Competency Passport Header Card: Light Blue Box (#EDF1F7) */}
      <div className="bg-[#EDF1F7] border border-[#C7D9FB] rounded-2xl p-6 md:p-8 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1B4CA1] text-white flex items-center justify-center font-black text-2xl ring-4 ring-[#FFA730] shadow-md shrink-0">
                {user.avatarInitials}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#1B4CA1] text-white px-2 py-0.5 rounded">
                  Official Competency Passport
                </span>
                <span className="text-xs text-[#0A66C2] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> CBC Accredited
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#1B4CA1] tracking-tight">
                {user.name}
              </h2>
              <p className="text-xs text-[#374151] mt-0.5 font-medium">
                {user.designation} • {user.department}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono text-[#4B5563]">
                <span className="bg-white px-2 py-0.5 rounded border border-[#C7D9FB] font-bold text-[#1B4CA1]">
                  ID: {user.karmayogiId}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-[#C7D9FB] font-bold text-[#EF951E]">
                  Cadre: {user.cadreLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportDossier}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#1B4CA1] border border-[#C7D9FB] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#EF951E]" />
              <span>{dossierGenerated ? 'Dossier Downloaded!' : 'Export FRAC Passport (PDF)'}</span>
            </button>
            <button
              onClick={onOpenCopilot}
              className="px-4 py-2.5 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Ask Ira for APAR Evaluation</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metrics: Light Blue Box, Skin Box, Yellow Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Light Blue Box */}
        <div className="bg-[#EDF1F7] p-6 rounded-2xl border border-[#C7D9FB] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider">Overall FRAC Readiness</span>
            <TrendingUp className="w-4 h-4 text-[#1B4CA1]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[#1B4CA1]">{user.competencyReadiness}%</h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              {user.readinessDelta} this quarter
            </span>
          </div>
          <p className="text-xs text-[#374151] mt-3">
            Exceeds the 80% national benchmark for Joint Secretary empaneled officers.
          </p>
        </div>

        {/* Metric 2: Skin Box */}
        <div className="bg-[#FFE9CD] p-6 rounded-2xl border border-[#FFD2A1] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#C37024] uppercase tracking-wider">Cumulative Learning Hours</span>
            <Calendar className="w-4 h-4 text-[#EF951E]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[#1B2133]">167 hrs</h3>
            <span className="text-xs font-bold text-[#C37024] bg-white border border-[#FFD2A1] px-2 py-0.5 rounded">
              +28 hrs vs target
            </span>
          </div>
          <p className="text-xs text-[#374151] mt-3">
            Accredited hours fulfilled under Mission Karmayogi continuous learning directive.
          </p>
        </div>

        {/* Metric 3: Yellow Box */}
        <div className="bg-[#FEF3C7] p-6 rounded-2xl border border-[#FDE68A] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">Cadre Standing & Rank</span>
            <Award className="w-4 h-4 text-[#DBA501]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-[#92400E]">Top 8%</h3>
            <span className="text-xs font-bold text-[#B45309] bg-white border border-[#FDE68A] px-2 py-0.5 rounded">
              92nd %ile
            </span>
          </div>
          <p className="text-xs text-[#B45309] mt-3 font-medium">
            National Leadership Honor Roll (DARPG & Capacity Building Commission).
          </p>
        </div>
      </div>

      {/* Main Grid: Learning Analytics Chart & Official Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Columns: Monthly Learning Hours Graph */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="text-base font-bold text-[#1B4CA1]">
                Continuous Capacity Velocity
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Monthly verified training hours against DoPT recommended baseline (20 hrs/mo)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              Compliant
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-4">
            {months.map((m) => {
              const heightPercent = Math.min(100, (m.hours / 45) * 100);
              const targetPercent = (m.target / 45) * 100;

              return (
                <div key={m.name} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#1B4CA1] text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    {m.hours} hrs completed (Target: {m.target}h)
                  </div>

                  <div className="w-full max-w-[36px] bg-[#EDF1F7] rounded-t-lg h-40 relative flex items-end overflow-hidden border border-[#C7D9FB]">
                    {/* Target line */}
                    <div
                      className="absolute w-full border-t border-dashed border-[#EF951E] z-10"
                      style={{ bottom: `${targetPercent}%` }}
                    ></div>

                    {/* Actual Bar */}
                    <div
                      className="w-full bg-[#1B4CA1] rounded-t-md transition-all duration-700 group-hover:bg-[#EF951E]"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>

                  <span className="text-xs font-bold text-[#374151] mt-1">{m.name}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#4B5563]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#1B4CA1]"></span> Verified Hours
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-[#EF951E]"></span> Mandated Target
              </span>
            </div>
            <span className="font-bold text-[#1B4CA1]">Total: 167 Hours</span>
          </div>
        </div>

        {/* Right 6 Columns: Verified Competency Micro-Credentials */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="text-base font-bold text-[#1B4CA1]">
                Verified Micro-Credentials ({badges.length})
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Statutorily verified digital credentials endorsed on the National Knowledge Grid
              </p>
            </div>
            <QrCode className="w-5 h-5 text-[#1B4CA1]" />
          </div>

          <div className="space-y-3">
            {badges.map((b, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 shadow-2xs ${b.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-current/20 text-[#1B4CA1] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Award className="w-4 h-4 text-[#EF951E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#1B2133] line-clamp-1">{b.title}</h4>
                      <span className="text-[9px] font-mono font-bold text-[#1B4CA1] bg-white border border-current/20 px-1 py-0.2 rounded">
                        {b.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4B5563] mt-0.5">{b.authority} • {b.date}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono">
                    DoPT Verified
                  </span>
                  <p className="text-[10px] text-[#0A66C2] font-semibold mt-1">
                    {b.level}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#4B5563]">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <FileCheck className="w-4 h-4" /> All 4 credentials synchronized with DoPT HRMS
            </span>
            <button
              onClick={() => onNavigate('library')}
              className="text-[#EF951E] hover:text-[#C37024] font-bold"
            >
              Earn Next Credential →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
