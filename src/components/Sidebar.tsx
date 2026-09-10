import React from 'react';
import { ScreenId } from '../types';
import {
  LayoutGrid,
  BookOpen,
  Target,
  Compass,
  Award,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  isOpen = false,
  onClose,
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Executive Home', icon: LayoutGrid },
    { id: 'library', label: 'Learn Hub (Courses)', icon: BookOpen },
    { id: 'gap-analysis', label: 'FRAC Competencies', icon: Target, badge: '2 Critical', badgeColor: 'bg-red-100 text-red-700' },
    { id: 'roadmap', label: 'Learning Pathways', icon: Compass },
    { id: 'quiz-studio', label: 'AI Quiz Studio', icon: Award, badge: 'Weekly', badgeColor: 'bg-orange-100 text-orange-700' },
    { id: 'progress', label: 'Competency Passport', icon: ShieldCheck },
  ];

  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <aside
        id="app-sidebar-mobile"
        class="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-200"
      >
        {/* Mobile Header with Karmayogi Brand & Close */}
        <div class="p-4 bg-[#0F294A] text-white flex items-center justify-between border-b border-blue-900">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-md bg-[#FF7722] flex items-center justify-center font-extrabold text-white text-lg">
              K
            </div>
            <div>
              <div class="flex items-center gap-1 font-bold text-sm">
                <span>iGOT</span>
                <span class="text-orange-400">KARMAYOGI</span>
              </div>
              <p class="text-[10px] text-blue-200">Ira AI Capacity Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            class="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Close Navigation"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
            Capacity Hubs
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                class={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-[#0F294A] border-l-3 border-[#FF7722] pl-3 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-[#0F294A] hover:bg-slate-50'
                }`}
              >
                <div class="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#FF7722]' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span class={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mission Karmayogi Info Strip */}
        <div class="p-3.5 m-3 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950">
          <div class="flex items-center gap-1.5 font-bold text-orange-900 mb-1">
            <Sparkles class="w-3.5 h-3.5 text-orange-600" />
            <span>Mission Karmayogi Bharat</span>
          </div>
          <p class="text-[11px] text-orange-800 leading-snug">
            Shifting civil services governance from rule-based to role-based competency readiness.
          </p>
          <div class="mt-2 pt-2 border-t border-orange-200/80 flex items-center justify-between text-[10px] text-orange-700">
            <span>DoPT Verified</span>
            <span class="font-mono">v2.4 Live</span>
          </div>
        </div>
      </aside>
    </div>
  );
};
