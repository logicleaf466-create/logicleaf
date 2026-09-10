import React, { useState } from 'react';
import { ScreenId, UserProfile } from '../types';
import { KarmayogiLogo } from './KarmayogiLogo';
import {
  LayoutGrid,
  BookOpen,
  Target,
  Compass,
  Award,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Settings,
} from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onOpenCopilot: () => void;
  onOpenSettings: () => void;
}

interface HubTab {
  id: ScreenId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  user,
  onNavigate,
  onOpenCopilot,
  onOpenSettings,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const hubTabs: HubTab[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutGrid },
    { id: 'library', label: 'Learn Hub', icon: BookOpen },
    { id: 'gap-analysis', label: 'FRAC Competencies', icon: Target, badge: '2 Gaps', badgeColor: 'bg-[#FFE9CD] text-[#C37024] border-[#FFD2A1]' },
    { id: 'roadmap', label: 'Pathways', icon: Compass },
    { id: 'quiz-studio', label: 'AI Quiz Studio', icon: Award, badge: 'Weekly', badgeColor: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' },
    { id: 'progress', label: 'Competency Passport', icon: ShieldCheck },
  ];

  return (
    <header id="igot-main-header" class="w-full bg-white border-b border-[#E5E7EB] shadow-xs z-30 sticky top-0">
      {/* Primary Row: Official Brand Emblem, Ira AI Tag, Settings, User Profile */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Unit: Official Karmayogi Bharat Emblem & Typographic Identity */}
        <div class="flex items-center gap-3 cursor-pointer select-none" onClick={() => onNavigate('dashboard')}>
          <KarmayogiLogo size="md" showMotto={true} />
          
          <div class="hidden xl:flex items-center gap-1.5 text-[11px] text-[#C37024] font-semibold bg-[#FFE9CD] border border-[#FFD2A1] px-2.5 py-1 rounded-full self-center">
            <Sparkles class="w-3 h-3 text-[#EF951E]" />
            <span>Ira AI Active</span>
          </div>
        </div>

        {/* Central Official Government Badge */}
        <div class="hidden lg:flex items-center gap-2 text-xs text-[#1B4CA1] bg-[#EDF1F7] border border-[#C7D9FB] px-3 py-1.5 rounded-full font-semibold">
          <ShieldCheck class="w-4 h-4 text-emerald-600" />
          <span>National Competency Framework (FRAC 2.0) Active</span>
        </div>

        {/* Right Tools: Ask Ira AI, Settings Button, User Profile */}
        <div class="flex items-center gap-2.5 sm:gap-3">
          {/* Ask Ira AI Trigger Button */}
          <button
            id="btn-ask-ira-header"
            onClick={onOpenCopilot}
            class="hidden sm:flex items-center gap-1.5 bg-[#EF951E] hover:bg-[#F08811] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Sparkles class="w-3.5 h-3.5 text-[#FEF3C7]" />
            <span>Ask Ira AI</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            class="p-2 rounded-lg text-slate-600 hover:text-[#1B4CA1] hover:bg-[#EDF1F7] transition-colors cursor-pointer border border-transparent hover:border-[#C7D9FB]"
            title="Portal Settings & Accessibility"
            aria-label="Settings"
          >
            <Settings class="w-4 h-4 text-slate-700" />
          </button>

          <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* User Profile Badge */}
          <div class="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              class="flex items-center gap-2 p-1 rounded-lg hover:bg-[#EDF1F7] transition-colors cursor-pointer text-left"
            >
              <div class="w-8 h-8 rounded-full bg-[#1B4CA1] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#FFA730] shadow-xs">
                {user.avatarInitials}
              </div>
              <div class="hidden lg:block leading-tight">
                <p class="text-xs font-bold text-[#1B2133] truncate max-w-[140px]">{user.name}</p>
                <p class="text-[10px] text-slate-500 truncate max-w-[140px]">{user.cadreLevel}</p>
              </div>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {showProfileMenu && (
              <div class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div class="w-10 h-10 rounded-full bg-[#1B4CA1] text-white flex items-center justify-center font-bold text-sm ring-2 ring-[#FFA730]">
                    {user.avatarInitials}
                  </div>
                  <div>
                    <p class="font-bold text-[#1B2133]">{user.name}</p>
                    <p class="text-[11px] text-slate-500">{user.designation}</p>
                    <p class="text-[10px] text-[#C37024] font-mono mt-0.5">{user.karmayogiId}</p>
                  </div>
                </div>
                <div class="py-3 space-y-2 border-b border-slate-100 text-slate-700">
                  <div class="flex justify-between">
                    <span class="text-slate-500">Department:</span>
                    <span class="font-medium text-right text-[11px]">{user.department}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Readiness Score:</span>
                    <span class="font-bold text-emerald-700">{user.competencyReadiness}%</span>
                  </div>
                </div>
                <div class="pt-2 flex justify-between items-center text-[11px]">
                  <button
                    onClick={() => {
                      onNavigate('progress');
                      setShowProfileMenu(false);
                    }}
                    class="text-[#1B4CA1] font-bold hover:underline cursor-pointer"
                  >
                    View Official Passport
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenSettings();
                    }}
                    class="text-slate-600 font-semibold hover:text-[#1B4CA1] flex items-center gap-1 cursor-pointer"
                  >
                    <Settings class="w-3 h-3" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Row: Official iGOT Karmayogi Bharat Hub Navigation Bar */}
      <nav id="igot-hub-navigation" class="border-t border-[#E5E7EB] bg-white px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {hubTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;

            return (
              <button
                key={tab.id}
                id={`hub-nav-${tab.id}`}
                onClick={() => onNavigate(tab.id)}
                class={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-[#1B4CA1] bg-[#EDF1F7] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-[#1B4CA1] hover:bg-[#F8F9FF]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#EF951E]' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span class={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}

                {/* Orange active indicator underline */}
                {isActive && (
                  <span class="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#EF951E] rounded-t-sm"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
