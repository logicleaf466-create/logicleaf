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
  Shield,
  Star,
  Sparkles
} from 'lucide-react';

interface ProgressScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ user, onNavigate }) => {
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
      title: 'Certified Public Procurement Officer',
      authority: 'National Institute of Financial Management',
      date: 'Aug 2024',
      code: 'BM-04',
      level: 'Apex Executive',
    },
    {
      title: 'Digital Governance & Cyber Vigilance Lead',
      authority: 'MeitY & NIC',
      date: 'Jul 2024',
      code: 'FR-01',
      level: 'Mastery',
    },
    {
      title: 'Sevottam Citizen Grievance Redressal Award',
      authority: 'DARPG, Government of India',
      date: 'May 2024',
      code: 'CC-01',
      level: 'Honorary Distinction',
    },
    {
      title: 'Administrative Ethics & AI Oversight Fellow',
      authority: 'LBSNAA Mussoorie',
      date: 'Mar 2024',
      code: 'EV-02',
      level: 'Apex Executive',
    },
  ];

  const handleGenerateDossier = () => {
    setDossierGenerated(true);
  };

  return (
    <section id="progress-screen" class="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <TrendingUp class="w-5 h-5 text-amber-500" />
            <h2 class="text-2xl font-serif text-white font-semibold tracking-wide">
              Progress & Executive Analytics
            </h2>
          </div>
          <p class="text-xs text-gray-400">
            Validated learning telemetry, assessment percentiles, and official iGOT Karmayogi Bharat competency records.
          </p>
        </div>

        <button
          id="btn-generate-apar-dossier"
          onClick={handleGenerateDossier}
          class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download class="w-3.5 h-3.5" />
          <span>Export APAR Learning Dossier</span>
        </button>
      </div>

      {dossierGenerated && (
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between transition-all">
          <div class="flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-400" />
            <span>Executive Performance Appraisal Dossier generated for Dr. Rajesh Varma (Cadre Level 14). Ready for submission.</span>
          </div>
          <button
            onClick={() => setDossierGenerated(false)}
            class="text-[10px] uppercase font-bold text-gray-400 hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top 4 KPI Metric Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <p class="text-xs text-gray-400 font-medium">Verified Learning Hours</p>
          <h3 class="text-3xl font-serif text-white font-bold mt-2">167.5</h3>
          <p class="text-[10px] text-emerald-400 mt-2 font-mono">+18.5 hrs this month</p>
        </div>
        <div class="bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <p class="text-xs text-gray-400 font-medium">Competencies Certified</p>
          <h3 class="text-3xl font-serif text-white font-bold mt-2">18 / 20</h3>
          <p class="text-[10px] text-amber-400 mt-2 font-mono">90% FRAC Coverage</p>
        </div>
        <div class="bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <p class="text-xs text-gray-400 font-medium">Quiz Assessment Accuracy</p>
          <h3 class="text-3xl font-serif text-white font-bold mt-2">94.2%</h3>
          <p class="text-[10px] text-emerald-400 mt-2 font-mono">Top Tier Distinction</p>
        </div>
        <div class="bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <p class="text-xs text-gray-400 font-medium">National Cadre Percentile</p>
          <h3 class="text-3xl font-serif text-white font-bold mt-2">Top 4%</h3>
          <p class="text-[10px] text-amber-400 mt-2 font-mono">Among Joint Secretaries</p>
        </div>
      </div>

      {/* 2-Column Split: Monthly Velocity Chart & Cadre Distribution */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Velocity Chart (7 cols) */}
        <div class="lg:col-span-7 bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div class="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <h3 class="text-base font-serif text-white font-semibold">
                Monthly Learning Velocity
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">Hours logged against recommended quarterly targets</p>
            </div>
            <span class="text-xs text-amber-400 font-mono font-medium">FY 2024-25</span>
          </div>

          {/* Bar chart visualization in Tailwind */}
          <div class="space-y-4 pt-2">
            <div class="flex items-end justify-between gap-4 h-48 px-2 pb-2 border-b border-gray-800/80">
              {months.map((m, idx) => {
                const heightPercent = Math.min(100, (m.hours / 45) * 100);

                return (
                  <div key={idx} class="flex-1 flex flex-col items-center gap-2 group">
                    <div class="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {m.hours}h
                    </div>
                    <div class="w-full bg-gray-800/60 rounded-t-lg relative flex items-end justify-center h-full overflow-hidden">
                      <div
                        class="w-full bg-amber-500 rounded-t-lg group-hover:bg-amber-400 transition-all duration-500 shadow-md shadow-amber-500/20"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span class="text-xs text-gray-400 font-medium group-hover:text-amber-400 transition-colors">
                      {m.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div class="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span>
                Logged Study Hours
              </span>
              <span>Cadre Average: 18 hrs / month</span>
            </div>
          </div>
        </div>

        {/* Cadre Competency Radar / Benchmark (5 cols) */}
        <div class="lg:col-span-5 bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div class="border-b border-gray-800 pb-4 mb-4">
              <h3 class="text-base font-serif text-white font-semibold">
                FRAC Framework Distribution
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">Competency readiness balance by domain pillar</p>
            </div>

            <div class="space-y-3.5">
              {[
                { name: 'Behavioral Competencies', score: 92, color: 'bg-emerald-500' },
                { name: 'Functional Governance (GFR/GeM)', score: 76, color: 'bg-amber-500' },
                { name: 'Domain Specialization (Public Admin)', score: 88, color: 'bg-emerald-500' },
                { name: 'Digital & Cybersecurity Architecture', score: 68, color: 'bg-red-500' },
                { name: 'Citizen Centricity (CPGRAMS)', score: 96, color: 'bg-emerald-500' },
              ].map((domain, idx) => (
                <div key={idx} class="space-y-1">
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-300 font-medium">{domain.name}</span>
                    <span class="text-amber-400 font-mono font-semibold">{domain.score}%</span>
                  </div>
                  <div class="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      class={`${domain.color} h-full rounded-full`}
                      style={{ width: `${domain.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-gray-300 flex items-center gap-3">
            <Sparkles class="w-4 h-4 text-amber-500 shrink-0" />
            <span>AI recommends focusing on Digital & Cybersecurity to cross 90% overall threshold.</span>
          </div>
        </div>
      </div>

      {/* Official Verified Badges & Certifications */}
      <div class="bg-[#16181D] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div class="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h3 class="text-base font-serif text-white font-semibold">
              Accredited iGOT Karmayogi Certifications
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">Cryptographically signed credentials eligible for Civil List recording</p>
          </div>
          <span class="text-xs text-amber-500 font-semibold">{badges.length} Verified</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              class="p-4 rounded-xl bg-[#0F1115] border border-gray-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Shield class="w-4 h-4" />
                  </div>
                  <span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-400 border border-gray-800">
                    {badge.code}
                  </span>
                </div>
                <h4 class="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {badge.title}
                </h4>
                <p class="text-[10px] text-gray-400 mt-1">{badge.authority}</p>
              </div>

              <div class="mt-4 pt-2.5 border-t border-gray-800/60 flex items-center justify-between text-[10px] text-gray-500">
                <span>{badge.date}</span>
                <span class="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 class="w-3 h-3" /> Validated
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
