import React from 'react';
import { ScreenId, UserProfile, CompetencyItem, LearningModule } from '../../types';
import {
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  Play,
  Clock,
  Award,
  Target,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  competencies: CompetencyItem[];
  modules: LearningModule[];
  onNavigate: (screen: ScreenId) => void;
  onOpenModule: (module: LearningModule) => void;
  onOpenCopilot?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  competencies,
  modules,
  onNavigate,
  onOpenModule,
  onOpenCopilot,
}) => {
  // Find current in-progress module (or default to mod-1)
  const activeModule = modules.find((m) => m.status === 'in-progress') || modules[0];

  return (
    <section id="dashboard-screen" class="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* 1. Official Government Officer Welcome Banner */}
      <div class="bg-gradient-to-r from-[#1B4CA1] via-[#1146A2] to-[#002B6C] rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        {/* Subtle Watermark Motif */}
        <div class="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-end pr-6">
          <svg viewBox="0 0 100 100" class="w-64 h-64 fill-white">
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" fill="none" />
            <path d="M50 5 L50 95 M5 50 L95 50" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[10px] font-bold tracking-widest uppercase bg-[#EF951E] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                Civil Services Executive Portal
              </span>
              <span class="text-xs text-blue-100 flex items-center gap-1 font-semibold">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" /> DoPT Verified
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Namaste, {user.name}
            </h1>
            <p class="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
              {user.department} • <span class="text-[#FFA730] font-semibold">{user.cadreLevel}</span>. Profile synchronized with National Competency Framework (FRAC 2.0).
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenModule(activeModule)}
              class="px-4 py-2.5 bg-[#EF951E] hover:bg-[#F08811] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play class="w-3.5 h-3.5 fill-current" />
              <span>Resume Current Learning</span>
            </button>
            <button
              onClick={onOpenCopilot}
              class="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles class="w-3.5 h-3.5 text-[#FEF3C7]" />
              <span>Consult Ira AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Executive Telemetry Metrics (Official iGOT Colors: Light Blue, Skin, Yellow) */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* BOX 1: LIGHT BLUE BOX (#EDF1F7 / #C7D9FB / #1B4CA1) */}
        <div
          id="card-competency-readiness"
          onClick={() => onNavigate('gap-analysis')}
          class="bg-[#EDF1F7] p-5 sm:p-6 rounded-2xl border border-[#C7D9FB] shadow-2xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-[#1B4CA1] uppercase tracking-wider">Competency Readiness</span>
            <div class="w-8 h-8 rounded-lg bg-[#1B4CA1] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <ArrowUpRight class="w-4 h-4" />
            </div>
          </div>
          <div class="flex items-baseline gap-3">
            <h2 class="text-3xl font-extrabold text-[#1B4CA1] tracking-tight">{user.competencyReadiness}%</h2>
            <span class="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
              {user.readinessDelta}
            </span>
          </div>
          <div class="w-full bg-white h-2.5 rounded-full overflow-hidden mt-3.5 border border-[#C7D9FB]/60">
            <div
              class="bg-gradient-to-r from-[#1B4CA1] to-[#EF951E] h-full rounded-full transition-all duration-700"
              style={{ width: `${user.competencyReadiness}%` }}
            ></div>
          </div>
          <p class="text-[11px] text-[#374151] mt-3 flex items-center justify-between">
            <span>Cadre Benchmark: <strong>90.0%</strong></span>
            <span class="text-[#C37024] font-bold">5.8% to Target</span>
          </p>
        </div>

        {/* BOX 2: SKIN COLOUR BOX (#FFE9CD / #FFD2A1 / #C37024) */}
        <div
          id="card-active-learning-path"
          onClick={() => onNavigate('roadmap')}
          class="bg-[#FFE9CD] p-5 sm:p-6 rounded-2xl border border-[#FFD2A1] shadow-2xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-[#C37024] uppercase tracking-wider">Active FRAC Pathway</span>
            <div class="w-8 h-8 rounded-lg bg-[#EF951E] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <ArrowUpRight class="w-4 h-4" />
            </div>
          </div>
          <h2 class="text-lg font-bold text-[#1B2133] truncate tracking-tight mb-2">
            {user.activePath}
          </h2>
          <div class="w-full bg-white h-2.5 rounded-full overflow-hidden border border-[#FFD2A1]/70">
            <div
              class="bg-[#EF951E] h-full rounded-full transition-all duration-700"
              style={{ width: `${user.activePathProgress}%` }}
            ></div>
          </div>
          <div class="flex items-center justify-between mt-3 text-[11px] text-[#374151]">
            <span class="font-bold text-[#C37024]">{user.activePathProgress}% Completed</span>
            <span class="text-[#4B5563]">3 modules remaining</span>
          </div>
        </div>

        {/* BOX 3: YELLOW BOX (#FEF3C7 / #FDE68A / #DBA501 / #92400E) */}
        <div
          id="card-ai-insight-score"
          onClick={() => onNavigate('progress')}
          class="bg-[#FEF3C7] p-5 sm:p-6 rounded-2xl border border-[#FDE68A] shadow-2xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-[#92400E] uppercase tracking-wider">Cadre Standing</span>
            <div class="w-8 h-8 rounded-lg bg-[#DBA501] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Award class="w-4 h-4" />
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <h2 class="text-3xl font-extrabold text-[#92400E] tracking-tight">Top 8%</h2>
            <span class="text-xs font-bold text-[#B45309] uppercase">In Cadre</span>
          </div>
          <div class="flex items-center gap-1.5 mt-3.5">
            <div class="w-5 h-2 bg-[#DBA501] rounded-full"></div>
            <div class="w-5 h-2 bg-[#DBA501] rounded-full"></div>
            <div class="w-5 h-2 bg-[#DBA501] rounded-full"></div>
            <div class="w-5 h-2 bg-[#DBA501] rounded-full"></div>
            <div class="w-5 h-2 bg-white/80 rounded-full border border-[#FDE68A]"></div>
            <span class="text-xs font-bold text-[#92400E] ml-2">92nd Percentile</span>
          </div>
          <p class="text-[11px] text-[#B45309] mt-2.5 font-medium">
            Exemplary administrative compliance
          </p>
        </div>
      </div>

      {/* Official Government Directive Banner: DoPT OM Circular Bulletin */}
      <div class="bg-white border-l-4 border-l-[#1B4CA1] border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-[10px] font-bold uppercase tracking-wider bg-[#1B4CA1] text-white px-2 py-0.5 rounded shrink-0">
            DoPT Gazette OM
          </span>
          <div class="text-xs text-[#1B2133] truncate">
            <span class="font-bold">No. 14014/1/2024-AIS-I:</span>
            <span class="text-slate-600 ml-1.5 truncate">
              Mandatory Annual Capacity Building Plan (ACBP 2024-25) compliance under Mission Karmayogi.
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0 text-[11px]">
          <span class="text-slate-500 font-medium">DoPT Compliance Cycle: <strong>Q3</strong></span>
          <span class="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            Cadre 14 Synchronized
          </span>
        </div>
      </div>

      {/* 3. Streamlined Executive Surface (Action Priorities + Active Focus & Gateways) */}
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left 3 Columns: Immediate Officer Priorities */}
        <div
          id="panel-executive-priorities"
          class="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xs flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E5E7EB]">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base sm:text-lg font-bold text-[#1B4CA1] tracking-tight">
                    Immediate Officer Priorities
                  </h3>
                  <span class="text-[10px] bg-[#EDF1F7] text-[#1B4CA1] border border-[#C7D9FB] font-bold px-2 py-0.5 rounded-full">
                    2 Pending Actions
                  </span>
                </div>
                <p class="text-xs text-[#4B5563] mt-0.5">
                  High-priority compliance actions requiring officer completion this quarter
                </p>
              </div>
              <button
                onClick={() => onNavigate('gap-analysis')}
                class="text-xs text-[#EF951E] hover:text-[#C37024] font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Full Audit</span>
                <ChevronRight class="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Priority Item 1: Healthcare Fire Safety & NBC */}
            <div class="space-y-3">
              <div class="p-4 rounded-xl bg-[#EDF1F7] border border-[#C7D9FB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100 shrink-0 mt-1"></div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs font-bold text-[#1B4CA1]">Emergency Preparedness & Fire Safety (FR-01)</h4>
                      <span class="text-[10px] text-red-800 bg-red-100 border border-red-200 px-1.5 py-0.2 rounded font-mono font-bold">
                        Gap: -24%
                      </span>
                    </div>
                    <p class="text-[11px] text-[#374151] mt-0.5">
                      Statutory mandate: NBC 2016 hospital life safety & evacuation protocols.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenModule(modules.find(m => m.id === 'do_1143052789530787841562') || activeModule)}
                  class="px-3.5 py-2 bg-[#1B4CA1] hover:bg-[#1146A2] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
                >
                  <Play class="w-3 h-3 fill-current" />
                  <span>Start (1h 23m)</span>
                </button>
              </div>

              {/* Priority Item 2: Civil Defence Services */}
              <div class="p-4 rounded-xl bg-[#FFE9CD] border border-[#FFD2A1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="w-2.5 h-2.5 rounded-full bg-[#EF951E] ring-4 ring-amber-100 shrink-0 mt-1"></div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-xs font-bold text-[#C37024]">Disaster Management & Civil Defence (BM-04)</h4>
                      <span class="text-[10px] text-[#92400E] bg-white border border-[#FFD2A1] px-1.5 py-0.2 rounded font-mono font-bold">
                        Gap: -12%
                      </span>
                    </div>
                    <p class="text-[11px] text-[#374151] mt-0.5">
                      Emergency volunteer network, warden hierarchy & NDRF triage protocols.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenModule(modules.find(m => m.id === 'do_1143166853070028801812') || activeModule)}
                  class="px-3.5 py-2 bg-white hover:bg-slate-50 text-[#C37024] border border-[#FFD2A1] text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
                >
                  <Play class="w-3 h-3 fill-current" />
                  <span>Resume (1h 17m)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reassurance Footer */}
          <div class="mt-5 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#4B5563]">
            <span class="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              3 of 5 competencies accredited & meeting national standards
            </span>
            <button
              onClick={() => onNavigate('gap-analysis')}
              class="text-[#EF951E] hover:text-[#C37024] font-bold"
            >
              View Full Competency Audit →
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Active Focus & Operational Gateways */}
        <div class="lg:col-span-2 flex flex-col gap-4">
          {/* Active Course In-Progress Card */}
          <div class="bg-[#EDF1F7] border border-[#C7D9FB] rounded-2xl p-5 shadow-2xs">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#1B4CA1] bg-white px-2 py-0.5 rounded border border-[#C7D9FB]">
                Current Learning Unit
              </span>
              <span class="text-xs text-[#1B4CA1] font-bold flex items-center gap-1">
                <Clock class="w-3.5 h-3.5 text-[#EF951E]" /> {activeModule.durationMinutes} mins
              </span>
            </div>

            <h4 class="text-sm font-bold text-[#1B4CA1] line-clamp-1 mt-2">
              {activeModule.title}
            </h4>
            <p class="text-xs text-[#4B5563] mt-0.5">
              {activeModule.provider}
            </p>

            {/* Progress status */}
            <div class="mt-3">
              <div class="flex items-center justify-between text-[11px] text-[#374151] mb-1 font-semibold">
                <span>Course Progress</span>
                <span class="text-[#1B4CA1] font-bold">{activeModule.progressPercent}%</span>
              </div>
              <div class="w-full bg-white h-2 rounded-full overflow-hidden border border-[#C7D9FB]">
                <div
                  class="bg-[#EF951E] h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeModule.progressPercent}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => onOpenModule(activeModule)}
              class="w-full mt-4 py-2 bg-[#EF951E] hover:bg-[#F08811] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play class="w-3.5 h-3.5 fill-current" />
              <span>Continue Lesson</span>
            </button>
          </div>

          {/* Operational Gateways: Clean 2x2 Grid */}
          <div class="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('gap-analysis')}
              class="p-3.5 bg-white hover:bg-[#EDF1F7] border border-[#E5E7EB] hover:border-[#C7D9FB] rounded-xl text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div class="w-7 h-7 rounded-lg bg-[#EDF1F7] text-[#1B4CA1] flex items-center justify-center mb-2 group-hover:bg-[#1B4CA1] group-hover:text-white transition-colors">
                <Target class="w-4 h-4" />
              </div>
              <p class="text-xs font-bold text-[#1B4CA1]">FRAC Audit</p>
              <p class="text-[10px] text-[#4B5563] mt-0.5">2 Gaps Pending</p>
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              class="p-3.5 bg-white hover:bg-[#FFE9CD] border border-[#E5E7EB] hover:border-[#FFD2A1] rounded-xl text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div class="w-7 h-7 rounded-lg bg-[#FFE9CD] text-[#C37024] flex items-center justify-center mb-2 group-hover:bg-[#EF951E] group-hover:text-white transition-colors">
                <Compass class="w-4 h-4" />
              </div>
              <p class="text-xs font-bold text-[#C37024]">Pathway</p>
              <p class="text-[10px] text-[#4B5563] mt-0.5">Phase 1 Active</p>
            </button>

            <button
              onClick={() => onNavigate('quiz-studio')}
              class="p-3.5 bg-white hover:bg-[#FEF3C7] border border-[#E5E7EB] hover:border-[#FDE68A] rounded-xl text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div class="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mb-2 group-hover:bg-[#DBA501] group-hover:text-white transition-colors">
                <Award class="w-4 h-4" />
              </div>
              <p class="text-xs font-bold text-[#92400E]">Scenario Lab</p>
              <p class="text-[10px] text-[#4B5563] mt-0.5">Weekly Assessment</p>
            </button>

            <button
              onClick={() => onNavigate('progress')}
              class="p-3.5 bg-white hover:bg-[#EDF1F7] border border-[#E5E7EB] hover:border-[#C7D9FB] rounded-xl text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div class="w-7 h-7 rounded-lg bg-[#EDF1F7] text-[#1B4CA1] flex items-center justify-center mb-2 group-hover:bg-[#1B4CA1] group-hover:text-white transition-colors">
                <Zap class="w-4 h-4 fill-current" />
              </div>
              <p class="text-xs font-bold text-[#1B4CA1]">Passport</p>
              <p class="text-[10px] text-[#4B5563] mt-0.5">4 Badges Verified</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
