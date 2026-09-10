import React, { useState } from 'react';
import { CompetencyItem, LearningModule, ScreenId } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  FileText,
  Zap,
} from 'lucide-react';

interface GapAnalysisScreenProps {
  competencies: CompetencyItem[];
  modules: LearningModule[];
  onNavigate: (screen: ScreenId) => void;
  onOpenModule: (module: LearningModule) => void;
  onOpenCopilot?: () => void;
}

export const GapAnalysisScreen: React.FC<GapAnalysisScreenProps> = ({
  competencies,
  modules,
  onNavigate,
  onOpenModule,
  onOpenCopilot,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [activeCompetencyId, setActiveCompetencyId] = useState<string>(competencies[0]?.id || 'fr-01');
  const [simulatedGain, setSimulatedGain] = useState<{ [id: string]: boolean }>({});

  const domains = ['All', 'Digital Governance', 'Financial Management', 'Citizen Centricity', 'Public Policy', 'Administrative Ethics'];

  const filteredCompetencies = selectedDomain === 'All'
    ? competencies
    : competencies.filter(c => c.domain === selectedDomain);

  const activeItem = competencies.find(c => c.id === activeCompetencyId) || competencies[0];

  const handleTogglePlan = (id: string) => {
    setSimulatedGain(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="gap-analysis-screen" class="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Top Banner / Breadcrumb Action in Light Blue Container */}
      <div class="bg-[#EDF1F7] p-6 rounded-2xl border border-[#C7D9FB] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold tracking-wider uppercase bg-[#1B4CA1] text-white px-2 py-0.5 rounded">
              FRAC 2.0 Engine
            </span>
            <span class="text-xs text-[#1B4CA1] font-bold">DoPT Cadre Level 14 Mandate</span>
          </div>
          <h2 class="text-2xl font-extrabold text-[#1B4CA1] tracking-tight">
            Competency Gap Analysis
          </h2>
          <p class="text-xs text-[#374151] mt-1 max-w-2xl leading-relaxed">
            Role-Activity-Competency mapping benchmarked against the National Civil Services Competency Framework.
          </p>
        </div>
        <div class="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('roadmap')}
            class="px-3.5 py-2 text-xs font-bold text-[#1B4CA1] bg-white border border-[#C7D9FB] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>View Pathway</span>
            <ArrowRight class="w-3.5 h-3.5 text-[#EF951E]" />
          </button>
          <button
            onClick={onOpenCopilot}
            class="px-3.5 py-2 text-xs font-bold text-white bg-[#EF951E] hover:bg-[#F08811] rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles class="w-3.5 h-3.5 text-[#FEF3C7]" />
            <span>Consult Ira AI</span>
          </button>
        </div>
      </div>

      {/* Domain Filters Tabs */}
      <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            class={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDomain === domain
                ? 'bg-[#1B4CA1] text-white shadow-sm font-bold'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:border-[#C7D9FB] hover:bg-[#EDF1F7]'
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Main 2-Column Layout */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Competency Cards List */}
        <div class="lg:col-span-5 space-y-3">
          <div class="flex items-center justify-between text-xs text-[#4B5563] px-1 font-medium">
            <span>Mapped Competencies ({filteredCompetencies.length})</span>
            <span class="font-bold text-[#1B4CA1]">Target Level: 4.5 / 5.0</span>
          </div>

          {filteredCompetencies.map((comp) => {
            const isSelected = comp.id === activeItem.id;
            const isTargetMet = comp.priority === 'Target Met';
            const isCritical = comp.priority === 'Critical' || comp.priority === 'High';
            const isPlanned = simulatedGain[comp.id];

            // Card background styling matching exact iGOT combo:
            // Critical -> Light Blue Box (#EDF1F7)
            // Moderate -> Yellow Box (#FEF3C7)
            // Target Met -> Skin Box (#FFE9CD)
            const boxBg = isTargetMet
              ? 'bg-[#FFE9CD] border-[#FFD2A1]'
              : isCritical
              ? 'bg-[#EDF1F7] border-[#C7D9FB]'
              : 'bg-[#FEF3C7] border-[#FDE68A]';

            return (
              <div
                key={comp.id}
                id={`competency-item-${comp.id}`}
                onClick={() => setActiveCompetencyId(comp.id)}
                class={`p-4 rounded-xl border transition-all cursor-pointer relative ${boxBg} ${
                  isSelected
                    ? 'ring-2 ring-[#EF951E] shadow-md'
                    : 'hover:shadow-xs shadow-2xs'
                }`}
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-mono font-bold text-[#1B4CA1] bg-white border border-current/20 px-1.5 py-0.2 rounded">
                        {comp.code}
                      </span>
                      <h4 class="text-xs font-bold text-[#1B2133]">{comp.title}</h4>
                    </div>
                    <p class="text-[11px] text-[#4B5563] mt-1 line-clamp-1">{comp.description}</p>
                  </div>

                  <span
                    class={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      isTargetMet
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isCritical
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {comp.priority}
                  </span>
                </div>

                {/* Score Progress Bars */}
                <div class="mt-3.5 space-y-1.5">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-[#4B5563] font-medium">Proficiency Score:</span>
                    <div class="flex items-center gap-1 font-mono font-bold">
                      <span class={isPlanned ? 'text-emerald-700' : 'text-[#1B4CA1]'}>
                        {isPlanned ? '4.5' : comp.currentLevel}
                      </span>
                      <span class="text-[#4B5563]">/ 5.0</span>
                      {isPlanned && (
                        <span class="text-[10px] text-emerald-700 font-sans ml-1 font-bold">(+1.7 Target Met)</span>
                      )}
                    </div>
                  </div>

                  {/* Dual Bar Representation */}
                  <div class="w-full bg-white h-2 rounded-full overflow-hidden relative border border-current/15">
                    {/* Current Score */}
                    <div
                      class={`h-full rounded-full transition-all duration-500 ${
                        isTargetMet
                          ? 'bg-emerald-600'
                          : isCritical
                          ? 'bg-red-500'
                          : 'bg-[#DBA501]'
                      }`}
                      style={{ width: `${(comp.currentLevel / 5) * 100}%` }}
                    ></div>

                    {/* Simulated Gain Ghost Bar */}
                    {isPlanned && (
                      <div
                        class="absolute top-0 bottom-0 bg-emerald-400/60 rounded-full transition-all duration-500"
                        style={{
                          left: `${(comp.currentLevel / 5) * 100}%`,
                          width: `${((comp.targetLevel - comp.currentLevel) / 5) * 100}%`
                        }}
                      ></div>
                    )}
                  </div>
                </div>

                {/* Bottom Footer Info */}
                <div class="mt-3 pt-2.5 border-t border-current/10 flex items-center justify-between text-[11px] text-[#4B5563]">
                  <span class="font-medium">{comp.domain}</span>
                  <span class={`font-mono font-bold ${comp.gapPercent < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    Gap: {comp.gapPercent > 0 ? `+${comp.gapPercent}%` : `${comp.gapPercent}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Columns: Deep-Dive Diagnosis with Skin and Light Blue Boxes */}
        <div class="lg:col-span-7 space-y-4">
          <div class="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xs space-y-5">
            {/* Active Competency Header */}
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-mono font-bold text-white bg-[#1B4CA1] px-2 py-0.5 rounded">
                    {activeItem.code}
                  </span>
                  <span class="text-xs font-semibold text-[#4B5563]">{activeItem.domain}</span>
                </div>
                <h3 class="text-xl font-extrabold text-[#1B4CA1] tracking-tight">
                  {activeItem.title}
                </h3>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span
                  class={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    activeItem.priority === 'Target Met'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeItem.priority === 'Critical' || activeItem.priority === 'High'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeItem.priority}
                </span>
              </div>
            </div>

            {/* Diagnostic Details */}
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
                FRAC Gap Assessment
              </h4>
              <p class="text-xs text-[#374151] leading-relaxed bg-[#FEFAF4] p-3.5 rounded-xl border border-[#FFD2A1]">
                {activeItem.description}
              </p>
            </div>

            {/* AI Diagnosis: Skin Box (#FFE9CD) */}
            <div class="p-4 rounded-xl bg-[#FFE9CD] border border-[#FFD2A1] space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-[#C37024]">
                <Sparkles class="w-4 h-4 text-[#EF951E]" />
                <span>Ira AI Diagnostic Evaluation</span>
              </div>
              <p class="text-xs text-[#1B2133] leading-relaxed">
                {activeItem.aiDiagnosis}
              </p>
            </div>

            {/* Statutory Regulation Citation: Light Blue Box (#EDF1F7) */}
            <div class="p-4 rounded-xl bg-[#EDF1F7] border border-[#C7D9FB] space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-[#1B4CA1]">
                <FileText class="w-4 h-4 text-[#1B4CA1]" />
                <span>Statutory Authority & Guidelines Reference</span>
              </div>
              <p class="text-xs text-[#1B2133] leading-relaxed font-medium">
                {activeItem.ruleReference}
              </p>
            </div>

            {/* Recommended Learning Module & Action */}
            <div class="pt-2">
              <h4 class="text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-2.5">
                Accredited Capacity Intervention
              </h4>

              {/* Intervention Card: Yellow Box (#FEF3C7) */}
              <div class="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-[#1B4CA1] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen class="w-5 h-5 text-[#EF951E]" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-[#1B2133]">
                      {activeItem.recommendedModuleName}
                    </p>
                    <p class="text-[11px] text-[#92400E] mt-0.5 font-medium">
                      Accredited by LBSNAA / NIC • Self-Paced • DoPT Certified
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const mod = modules.find(m => m.id === activeItem.recommendedModuleId) || modules[0];
                      onOpenModule(mod);
                    }}
                    class="px-3.5 py-2 bg-[#1B4CA1] hover:bg-[#002B6C] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Launch Module
                  </button>
                  <button
                    onClick={() => handleTogglePlan(activeItem.id)}
                    class={`px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      simulatedGain[activeItem.id]
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-[#1B2133] border-[#FDE68A] hover:bg-white/80'
                    }`}
                  >
                    {simulatedGain[activeItem.id] ? '✓ In Pathway' : '+ Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
