import React, { useState } from 'react';
import {
  X,
  Globe,
  Type,
  Eye,
  Bell,
  ShieldCheck,
  Check,
  Volume2,
  Lock,
  Sliders,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'English' | 'हिन्दी';
  onLanguageChange: (lang: 'English' | 'हिन्दी') => void;
  fontSizeDelta: number;
  onFontSizeChange: (delta: number) => void;
  highContrast: boolean;
  onHighContrastToggle: () => void;
  onSkipToContent: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  fontSizeDelta,
  onFontSizeChange,
  highContrast,
  onHighContrastToggle,
  onSkipToContent,
}) => {
  const [activeTab, setActiveTab] = useState<'accessibility' | 'notifications' | 'gov-info'>('accessibility');
  const [omAlerts, setOmAlerts] = useState(true);
  const [aparAlerts, setAparAlerts] = useState(true);
  const [courseReminders, setCourseReminders] = useState(true);
  const [screenReaderOpt, setScreenReaderOpt] = useState(false);
  const [notificationSaved, setNotificationSaved] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header: Official Government Banner */}
        <div className="bg-[#1B4CA1] text-white p-5 flex items-center justify-between border-b-4 border-[#EF951E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5 text-[#FFA730]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {language === 'हिन्दी' ? 'पोर्टल सेटिंग्स एवं सुगमता' : 'Portal Settings & Accessibility'}
                </h3>
                <span className="text-[10px] font-bold bg-[#EF951E] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  GIGW 3.0
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Government of India • iGOT Karmayogi Bharat Preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-[#EDF1F7] px-4 pt-2 gap-2 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t-2 ${
              activeTab === 'accessibility'
                ? 'bg-white text-[#1B4CA1] border-[#1B4CA1] shadow-2xs font-extrabold'
                : 'text-slate-600 border-transparent hover:text-[#1B4CA1]'
            }`}
          >
            <Type className="w-4 h-4 text-[#EF951E]" />
            <span>Language & Display</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t-2 relative ${
              activeTab === 'notifications'
                ? 'bg-white text-[#1B4CA1] border-[#1B4CA1] shadow-2xs font-extrabold'
                : 'text-slate-600 border-transparent hover:text-[#1B4CA1]'
            }`}
          >
            <Bell className="w-4 h-4 text-[#EF951E]" />
            <span>Notifications & Circulars</span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </button>

          <button
            onClick={() => setActiveTab('gov-info')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t-2 ${
              activeTab === 'gov-info'
                ? 'bg-white text-[#1B4CA1] border-[#1B4CA1] shadow-2xs font-extrabold'
                : 'text-slate-600 border-transparent hover:text-[#1B4CA1]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#EF951E]" />
            <span>Govt Audit & Security</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
          {/* TAB 1: Accessibility & Language */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              {/* 1. Official Language Selection */}
              <div className="p-4 rounded-xl bg-[#FEFAF4] border border-[#FFD2A1] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#EF951E]" />
                    <span className="font-bold text-sm text-[#1B2133]">Official Language / राजभाषा चयन</span>
                  </div>
                  <span className="text-[10px] text-[#C37024] font-semibold bg-[#FFE9CD] px-2 py-0.5 rounded-full border border-[#FFD2A1]">
                    E-Governance Standard
                  </span>
                </div>
                <p className="text-xs text-[#4B5563]">
                  Select the primary display language for civil service competency frameworks and DoPT directives.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => onLanguageChange('English')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      language === 'English'
                        ? 'border-[#1B4CA1] bg-[#EDF1F7] text-[#1B4CA1] font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#1B4CA1]'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">English</p>
                      <p className="text-[10px] text-slate-500">Government Standard</p>
                    </div>
                    {language === 'English' && <Check className="w-4 h-4 text-[#1B4CA1]" />}
                  </button>

                  <button
                    onClick={() => onLanguageChange('हिन्दी')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      language === 'हिन्दी'
                        ? 'border-[#1B4CA1] bg-[#EDF1F7] text-[#1B4CA1] font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#1B4CA1]'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs font-['Noto_Sans_Devanagari',sans-serif]">हिन्दी (Hindi)</p>
                      <p className="text-[10px] text-slate-500">राजभाषा कार्यान्वयन</p>
                    </div>
                    {language === 'हिन्दी' && <Check className="w-4 h-4 text-[#1B4CA1]" />}
                  </button>
                </div>
              </div>

              {/* 2. Text Resizing / Typography */}
              <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#1B4CA1]" />
                    <span className="font-bold text-sm text-[#1B2133]">Font Size Scaling / पाठ आकार</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#1B4CA1] font-bold">
                    {fontSizeDelta === -1 ? '90% (A-)' : fontSizeDelta === 0 ? '100% (Standard A)' : fontSizeDelta === 1 ? '110% (A+)' : '120% (A++)'}
                  </span>
                </div>
                <p className="text-xs text-[#4B5563]">
                  Adjust typography scaling across portal modules to match your reading preferences.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onFontSizeChange(-1)}
                    className={`flex-1 py-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
                      fontSizeDelta === -1 ? 'bg-[#1B4CA1] text-white border-[#1B4CA1]' : 'bg-[#EDF1F7] text-[#1B4CA1] border-[#C7D9FB] hover:bg-slate-100'
                    }`}
                  >
                    A- (Smaller)
                  </button>
                  <button
                    onClick={() => onFontSizeChange(0)}
                    className={`flex-1 py-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
                      fontSizeDelta === 0 ? 'bg-[#1B4CA1] text-white border-[#1B4CA1]' : 'bg-[#EDF1F7] text-[#1B4CA1] border-[#C7D9FB] hover:bg-slate-100'
                    }`}
                  >
                    A (Default)
                  </button>
                  <button
                    onClick={() => onFontSizeChange(1)}
                    className={`flex-1 py-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
                      fontSizeDelta === 1 ? 'bg-[#1B4CA1] text-white border-[#1B4CA1]' : 'bg-[#EDF1F7] text-[#1B4CA1] border-[#C7D9FB] hover:bg-slate-100'
                    }`}
                  >
                    A+ (Large)
                  </button>
                  <button
                    onClick={() => onFontSizeChange(2)}
                    className={`flex-1 py-2.5 rounded-lg border text-center font-bold text-xs transition-all ${
                      fontSizeDelta === 2 ? 'bg-[#1B4CA1] text-white border-[#1B4CA1]' : 'bg-[#EDF1F7] text-[#1B4CA1] border-[#C7D9FB] hover:bg-slate-100'
                    }`}
                  >
                    A++ (Extra)
                  </button>
                </div>
              </div>

              {/* 3. Accessibility & Contrast Toggles */}
              <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#1B4CA1]" />
                  <span className="font-bold text-sm text-[#1B2133]">Visual & Screen Accessibility</span>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#EDF1F7] border border-[#C7D9FB]">
                    <div>
                      <p className="font-bold text-xs text-[#1B4CA1]">High Contrast View</p>
                      <p className="text-[11px] text-slate-600">Elevates contrast ratios for low-vision and sunlight environments.</p>
                    </div>
                    <button
                      onClick={onHighContrastToggle}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        highContrast ? 'bg-[#1B4CA1]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                          highContrast ? 'left-5.5' : 'left-0.5'
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#EDF1F7] border border-[#C7D9FB]">
                    <div>
                      <p className="font-bold text-xs text-[#1B4CA1]">Screen Reader Voice Assistance</p>
                      <p className="text-[11px] text-slate-600">Enables assistive tags and ARIA descriptions for speech engines.</p>
                    </div>
                    <button
                      onClick={() => setScreenReaderOpt(!screenReaderOpt)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        screenReaderOpt ? 'bg-[#1B4CA1]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                          screenReaderOpt ? 'left-5.5' : 'left-0.5'
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#FEFAF4] border border-[#FFD2A1]">
                    <div>
                      <p className="font-bold text-xs text-[#C37024]">Skip to Main Content</p>
                      <p className="text-[11px] text-slate-600">Directly jump keyboard focus to primary dashboard canvas.</p>
                    </div>
                    <button
                      onClick={() => {
                        onSkipToContent();
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#EF951E] hover:bg-[#F08811] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Jump to Content
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Notifications & Circulars */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FFE9CD] border border-[#FFD2A1] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#92400E]">
                  <AlertCircle className="w-4 h-4 text-[#EF951E]" />
                  <span>2 Active Statutory Circulars Pending Officer Review</span>
                </div>
                <button
                  onClick={() => setNotificationSaved(true)}
                  className="text-[11px] font-bold text-[#1B4CA1] hover:underline cursor-pointer"
                >
                  Mark all as acknowledged
                </button>
              </div>

              {/* Active Notices List */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-[#EDF1F7] border border-[#C7D9FB] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1B4CA1] text-white px-2 py-0.2 rounded">
                      DoPT OM Circular
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">18 August 2024</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1B4CA1]">
                    DoPT OM No. 14014/1/2024-AIS-I: Mandatory Annual Capacity Building Plan (ACBP 2024-25)
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    All Cadre Level 14 officers must complete accredited modules under FRAC 2.0 before the upcoming APAR evaluation cycle.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DBA501] text-white px-2 py-0.2 rounded">
                      Ministry of Finance (DoE)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">12 August 2024</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#92400E]">
                    GFR 2024 Rule 149 Direct Procurement Ceiling Revision on GeM 4.0
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Revised threshold limits and single-tender justification protocols for ministry procurement dockets.
                  </p>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="pt-2 space-y-2.5 border-t border-slate-200">
                <h4 className="text-xs font-bold text-[#1B2133]">Official Alert Preferences (SMS & NIC Email)</h4>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <span className="text-xs font-medium">DoPT Office Memorandums & Policy Circulars</span>
                  <input
                    type="checkbox"
                    checked={omAlerts}
                    onChange={(e) => setOmAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#1B4CA1] rounded accent-[#1B4CA1]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <span className="text-xs font-medium">Annual APAR & Competency Evaluation Deadlines</span>
                  <input
                    type="checkbox"
                    checked={aparAlerts}
                    onChange={(e) => setAparAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#1B4CA1] rounded accent-[#1B4CA1]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <span className="text-xs font-medium">Weekly Scenario Challenge & Assessment Updates</span>
                  <input
                    type="checkbox"
                    checked={courseReminders}
                    onChange={(e) => setCourseReminders(e.target.checked)}
                    className="w-4 h-4 text-[#1B4CA1] rounded accent-[#1B4CA1]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: Government Information & Security */}
          {activeTab === 'gov-info' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#EDF1F7] border border-[#C7D9FB] space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-xs font-bold text-[#1B4CA1]">National Programme for Civil Services Capacity Building</h4>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Mission Karmayogi Bharat is instituted by the Government of India under the aegis of the Capacity Building Commission (CBC) and the Department of Personnel and Training (DoPT).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-500 text-[10px] block">Portal Hosting Infrastructure:</span>
                  <span className="font-bold text-[#1B2133]">National Informatics Centre (NIC MeghRaj)</span>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-500 text-[10px] block">Compliance Standard:</span>
                  <span className="font-bold text-[#1B2133]">GIGW 3.0 & STQC Certified</span>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-500 text-[10px] block">Information Security:</span>
                  <span className="font-bold text-[#1B2133]">ISO/IEC 27001:2022 Certified</span>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-slate-500 text-[10px] block">FRAC Engine Version:</span>
                  <span className="font-bold text-[#1B2133]">v2.4.8 (DoPT Release 2024)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FEFAF4] border border-[#FFD2A1] space-y-1">
                <p className="font-bold text-xs text-[#C37024]">Official Nodal Officer Helpline</p>
                <p className="text-[11px] text-slate-600">
                  Toll Free: <strong>1800 111 555</strong> (09:00 to 18:00 IST) • Email: <strong>support@karmayogibharat.gov.in</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Government Session (gov.in)</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B4CA1] hover:bg-[#1146A2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
