import React from 'react';
import { ScreenId, UserProfile } from '../types';
import { ChevronRight, Bell, Search, Shield } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
}

const screenTitleMap: Record<ScreenId, string> = {
  'dashboard': 'Dashboard',
  'gap-analysis': 'Competency Gap Analysis',
  'roadmap': 'Personalized Learning Roadmap',
  'quiz-studio': 'AI Quiz Studio',
  'library': 'Learning Library',
  'progress': 'Progress & Performance Analytics',
};

export const Header: React.FC<HeaderProps> = ({ currentScreen, user, onNavigate }) => {
  return (
    <header
      id="app-header"
      class="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0A0B0D] shrink-0 z-10"
    >
      {/* Breadcrumb Navigation */}
      <div class="flex items-center gap-2 text-sm text-gray-400 font-medium">
        <button
          id="breadcrumb-home"
          onClick={() => onNavigate('dashboard')}
          class="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Shield class="w-4 h-4 text-amber-500/80" />
          <span>Executive Control Center</span>
        </button>
        <ChevronRight class="w-3.5 h-3.5 text-gray-600" />
        <span class="text-gray-200 font-semibold">{screenTitleMap[currentScreen]}</span>
      </div>

      {/* Right User & Actions Area */}
      <div class="flex items-center gap-5">
        {/* Quick Search trigger */}
        <div class="hidden md:flex items-center gap-2 bg-[#16181D] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-400 w-52 hover:border-gray-700 transition-colors">
          <Search class="w-3.5 h-3.5 text-gray-500" />
          <span class="text-gray-500">Search competencies...</span>
          <kbd class="ml-auto text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-mono">⌘K</kbd>
        </div>

        {/* Notification Bell */}
        <button
          id="btn-notifications"
          aria-label="Notifications"
          class="relative p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 transition-colors cursor-pointer"
        >
          <Bell class="w-4 h-4" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-[#0A0B0D]"></span>
        </button>

        <div class="h-6 w-px bg-gray-800 hidden sm:block"></div>

        {/* Profile Card matching Design HTML */}
        <div class="flex items-center gap-3 pl-1">
          <div class="text-right hidden sm:block">
            <p class="text-xs font-semibold text-white tracking-wide">{user.name}</p>
            <p class="text-[10px] text-gray-500 uppercase tracking-tight">{user.designation}</p>
          </div>
          <div class="w-10 h-10 rounded-full border border-amber-500/30 p-0.5 shadow-sm transition-transform hover:scale-105">
            <div class="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-amber-300 font-serif tracking-wider">
              {user.avatarInitials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
