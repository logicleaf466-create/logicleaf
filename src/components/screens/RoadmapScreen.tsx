import React, { useState } from 'react';
import { LearningModule, ScreenId } from '../../types';
import {
  Sparkles,
  Clock,
  Calendar,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

interface RoadmapScreenProps {
  modules: LearningModule[];
  onNavigate: (screen: ScreenId) => void;
  onOpenModule: (module: LearningModule) => void;
  onOpenCopilot?: () => void;
}

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({
  modules,
  onNavigate,
  onOpenModule,
}) => {
  const [pacing, setPacing] = useState<'express' | 'balanced' | 'intensive'>('balanced');
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibrationToast, setRecalibrationToast] = useState(false);

  const handleRecalibrate = () => {
    setIsRecalibrating(true);
    setTimeout(() => {
      setIsRecalibrating(false);
      setRecalibrationToast(true);
      setTimeout(() => setRecalibrationToast(false), 3500);
    }, 1000);
  };

  const phases = [
    {
      phaseNumber: 1,
      title: 'Workplace Governance & Life Safety',
      timeframe: 'Weeks 1 - 3',
      objective: 'Fulfill mandatory statutory certifications in PoSH Act 2013 and NBC hospital fire protection protocols.',
      moduleIds: ['do_113569878939262976132', 'do_1143052789530787841562'],
      badge: 'Critical Path',
      kpReward: 150,
      phaseBoxClass: 'bg-[#EDF1F7] border-[#C7D9FB]',
      pillClass: 'bg-[#1B4CA1] text-white',
    },
    {
      phaseNumber: 2,
      title: 'Disaster Management & Emergency Command',
      timeframe: 'Weeks 4 - 7',
      objective: 'Strengthen civil defence warden mobilization, emergency communications, and NDRF first-response networks.',
      moduleIds: ['do_1143166853070028801812'],
      badge: 'Strategic Growth',
      kpReward: 200,
      phaseBoxClass: 'bg-[#FFE9CD] border-[#FFD2A1]',
      pillClass: 'bg-[#EF951E] text-white',
    },
    {
      phaseNumber: 3,
      title: 'Participatory Governance & Jan Andolan',
      timeframe: 'Weeks 8 - 12',
      objective: 'Lead nationwide participatory sanitation, Safai Mitra Suraksha Shivirs, and Cleanliness Target Unit transformations.',
      moduleIds: ['do_1141533857591132161321'],
      badge: 'Mastery',
      kpReward: 100,
      phaseBoxClass: 'bg-[#FEF3C7] border-[#FDE68A]',
      pillClass: 'bg-[#DBA501] text-white',
    },
  ];

  return (
    <section id="roadmap-screen" className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Toast Notification */}
      {recalibrationToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1B4CA1] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#C7D9FB] animate-in slide-in-from-top duration-300 text-xs">
          <Sparkles className="w-4 h-4 text-[#FEF3C7]" />
          <span>Ira AI recalibrated pathway based on latest DoPT competency benchmarks!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-[#FFE9CD] text-[#C37024] border border-[#FFD2A1] px-2 py-0.5 rounded">
              Role Progression
            </span>
            <span className="text-xs text-[#1B4CA1] font-bold">Cadre Level 14 Career Pathway</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#1B4CA1] tracking-tight">
            Personalized Learning Pathway
          </h2>
          <p className="text-xs text-[#4B5563] mt-1 max-w-2xl leading-relaxed">
            Role-calibrated trajectory aligning your learning directly with the Capacity Building Commission (CBC) guidelines.
          </p>
        </div>

        {/* Pacing & Recalibration controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#EDF1F7] p-1 rounded-xl border border-[#C7D9FB] text-xs">
            {(['express', 'balanced', 'intensive'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPacing(mode)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all cursor-pointer ${
                  pacing === mode
                    ? 'bg-[#1B4CA1] text-white shadow-xs font-bold'
                    : 'text-[#374151] hover:text-[#1B4CA1]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={handleRecalibrate}
            disabled={isRecalibrating}
            className="px-3.5 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin' : ''}`} />
            <span>{isRecalibrating ? 'Recalibrating...' : 'Recalibrate AI'}</span>
          </button>
        </div>
      </div>

      {/* Pathway Summary Metrics - Matching Light Blue, Skin, and Yellow boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Box 1: Light Blue Box */}
        <div className="bg-[#EDF1F7] p-4 rounded-xl border border-[#C7D9FB] shadow-2xs">
          <p className="text-[11px] font-bold text-[#1B4CA1] uppercase">Estimated Hours</p>
          <p className="text-2xl font-extrabold text-[#1B4CA1] mt-1">14.5 hrs</p>
          <p className="text-[10px] text-[#4B5563] mt-1">~2.5 hrs / week at {pacing} pace</p>
        </div>

        {/* Box 2: Skin Box */}
        <div className="bg-[#FFE9CD] p-4 rounded-xl border border-[#FFD2A1] shadow-2xs">
          <p className="text-[11px] font-bold text-[#C37024] uppercase">Modules in Path</p>
          <p className="text-2xl font-extrabold text-[#1B2133] mt-1">5 Modules</p>
          <p className="text-[10px] text-emerald-700 font-bold mt-1">1 Completed • 1 In Progress</p>
        </div>

        {/* Box 3: Yellow Box */}
        <div className="bg-[#FEF3C7] p-4 rounded-xl border border-[#FDE68A] shadow-2xs">
          <p className="text-[11px] font-bold text-[#92400E] uppercase">Core Pillars</p>
          <p className="text-2xl font-extrabold text-[#B45309] mt-1">4 Domains</p>
          <p className="text-[10px] text-[#92400E] mt-1">Full FRAC 2.0 alignment</p>
        </div>

        {/* Box 4: Soft Light Blue Box */}
        <div className="bg-[#E6EEFF] p-4 rounded-xl border border-[#C7D9FB] shadow-2xs">
          <p className="text-[11px] font-bold text-[#1B4CA1] uppercase">Target Readiness</p>
          <p className="text-2xl font-extrabold text-[#1B4CA1] mt-1">94.2%</p>
          <p className="text-[10px] text-[#0A66C2] font-bold mt-1">+10% gain over baseline</p>
        </div>
      </div>

      {/* Timeline Phases */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const phaseModules = modules.filter((m) => phase.moduleIds.includes(m.id));

          return (
            <div
              key={phase.phaseNumber}
              className={`border rounded-2xl p-6 shadow-2xs relative ${phase.phaseBoxClass}`}
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-current/10">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${phase.pillClass}`}>
                    {phase.phaseNumber}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#1B2133]">{phase.title}</h3>
                    <p className="text-xs text-[#4B5563] mt-0.5">{phase.objective}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-[11px] font-semibold text-[#1B2133] bg-white/80 border border-current/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {phase.timeframe}
                  </span>
                  <span className="text-[11px] font-bold text-[#92400E] bg-white border border-[#FDE68A] px-2 py-1 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#DBA501]" /> DoPT Certified
                  </span>
                </div>
              </div>

              {/* Module Cards in Phase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {phaseModules.map((mod) => {
                  const isCompleted = mod.status === 'completed';
                  const isInProgress = mod.status === 'in-progress';

                  return (
                    <div
                      key={mod.id}
                      onClick={() => onOpenModule(mod)}
                      className="p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#C7D9FB] hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-[#1B4CA1] bg-[#EDF1F7] border border-[#C7D9FB] px-1.5 py-0.2 rounded">
                          {mod.competencyCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isInProgress
                              ? 'bg-[#EDF1F7] text-[#1B4CA1] border border-[#C7D9FB]'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {mod.status.replace('-', ' ')}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#1B2133] group-hover:text-[#EF951E] transition-colors line-clamp-1">
                        {mod.title}
                      </h4>
                      <p className="text-[11px] text-[#4B5563] mt-1 line-clamp-2">{mod.description}</p>

                      <div className="w-full bg-[#EDF1F7] h-2 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-600' : 'bg-[#EF951E]'
                          }`}
                          style={{ width: `${mod.progressPercent}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#4B5563] mt-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {mod.durationMinutes} mins
                        </span>
                        <span className="font-bold text-[#1B4CA1]">{mod.progressPercent}% complete</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
