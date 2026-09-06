import React from 'react';
import { ScreenId } from '../types';
import {
  LayoutDashboard,
  BarChart3,
  Compass,
  Award,
  BookOpen,
  TrendingUp,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Control Center', icon: LayoutDashboard },
    { id: 'gap-analysis', label: 'Gap Analysis', icon: BarChart3, badge: '2 Critical' },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Compass },
    { id: 'quiz-studio', label: 'AI Quiz Studio', icon: Award, badge: 'New' },
    { id: 'library', label: 'Learning Library', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <aside id="app-sidebar" class="w-64 border-r border-gray-800 flex flex-col bg-[#0F1115] shrink-0 select-none z-20">
      {/* Brand Header */}
      <div class="p-6 flex items-center gap-3">
        <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xl shadow-md shadow-amber-500/20">
          I
        </div>
        <div>
          <h1 class="text-lg font-semibold tracking-tight text-white flex items-center gap-1.5">
            Ira <span class="text-amber-500 italic font-serif">AI</span>
          </h1>
          <p class="text-[10px] text-gray-500 tracking-wider uppercase font-medium">Civil Services Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav class="flex-1 px-3 space-y-1.5 mt-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              class={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-amber-500/10 text-amber-500 border-l-2 border-amber-500 pl-3.5 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <div class="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-200'
                  }`}
                />
                <span class="text-sm font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  class={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI System Status widget matching design */}
      <div class="p-4 m-4 rounded-xl bg-gradient-to-br from-amber-900/20 to-black border border-amber-900/30 relative overflow-hidden">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-1.5">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <p class="text-[10px] uppercase tracking-widest text-amber-500 font-bold">AI System Status</p>
          </div>
          <Sparkles class="w-3.5 h-3.5 text-amber-400 opacity-80" />
        </div>
        <p class="text-xs text-gray-400 leading-relaxed">
          Optimizing roadmap based on your latest performance data.
        </p>
        <div class="mt-2.5 pt-2 border-t border-amber-900/40 flex items-center justify-between text-[10px] text-gray-500">
          <span class="flex items-center gap-1">
            <ShieldCheck class="w-3 h-3 text-emerald-400" /> iGOT Verified
          </span>
          <span class="font-mono text-gray-400">v2.4 Live</span>
        </div>
      </div>
    </aside>
  );
};
