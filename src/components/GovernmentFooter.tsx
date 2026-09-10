import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { KarmayogiLogo } from './KarmayogiLogo';

export const GovernmentFooter: React.FC = () => {
  return (
    <footer id="goi-portal-footer" class="w-full bg-[#1B2133] text-slate-300 text-xs border-t-4 border-[#EF951E] mt-auto">
      {/* Top Footer Segment: Important Links & Contact */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Karmayogi Bharat & Ira AI Mission */}
          <div class="space-y-3 md:col-span-1">
            <div class="bg-white/95 p-2.5 rounded-xl inline-block shadow-sm">
              <KarmayogiLogo size="sm" showMotto={true} />
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              National Programme for Civil Services Capacity Building (NPCSCB). Transforming civil servants through competency-driven, role-based governance.
            </p>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/30 border border-slate-700 text-[11px] text-[#FFA730]">
              <Sparkles class="w-3.5 h-3.5 text-[#FFA730]" />
              <span>Integrated with <strong>Ira AI</strong> Intelligence</span>
            </div>
          </div>

          {/* Col 2: Navigation Hubs */}
          <div>
            <h4 class="font-semibold text-white uppercase text-[11px] tracking-wider mb-3 border-b border-slate-700 pb-1.5">
              Portal Hubs & Modules
            </h4>
            <ul class="space-y-2 text-slate-300 text-xs">
              <li>
                <a href="#dashboard" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Executive Control Center</span>
                </a>
              </li>
              <li>
                <a href="#gap-analysis" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>FRAC Competency Framework</span>
                </a>
              </li>
              <li>
                <a href="#roadmap" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Personalized Learning Pathways</span>
                </a>
              </li>
              <li>
                <a href="#quiz-studio" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Ira AI Scenario Studio</span>
                </a>
              </li>
              <li>
                <a href="#library" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Accredited Courses (LBSNAA/ISTM)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Portals Network */}
          <div>
            <h4 class="font-semibold text-white uppercase text-[11px] tracking-wider mb-3 border-b border-slate-700 pb-1.5">
              National Initiatives
            </h4>
            <ul class="space-y-2 text-slate-300 text-xs">
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noreferrer" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>National Portal of India</span>
                  <ExternalLink class="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://dopt.gov.in" target="_blank" rel="noreferrer" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Dept of Personnel and Training (DoPT)</span>
                  <ExternalLink class="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://cbc.gov.in" target="_blank" rel="noreferrer" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Capacity Building Commission (CBC)</span>
                  <ExternalLink class="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://digitalindia.gov.in" target="_blank" rel="noreferrer" class="hover:text-[#FFA730] transition-colors flex items-center gap-1">
                  <span>Digital India</span>
                  <ExternalLink class="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Helpdesk & Support */}
          <div class="space-y-2.5">
            <h4 class="font-semibold text-white uppercase text-[11px] tracking-wider mb-3 border-b border-slate-700 pb-1.5">
              Support & Helpdesk
            </h4>
            <div class="flex items-start gap-2 text-xs">
              <MapPin class="w-4 h-4 text-[#FFA730] shrink-0 mt-0.5" />
              <span>Karmayogi Bharat, Old JNU Campus, New Delhi - 110067</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <Phone class="w-4 h-4 text-[#FFA730] shrink-0" />
              <span>Toll Free: 1800 111 555 (Mon-Fri, 9am-6pm)</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <Mail class="w-4 h-4 text-[#FFA730] shrink-0" />
              <span>support@karmayogibharat.gov.in</span>
            </div>
            <div class="pt-2">
              <span class="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
                <span>STQC Certified & ISO 27001 Compliant</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div class="border-t border-slate-800 bg-[#111625] py-4 text-[11px] text-slate-400">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-4 text-center sm:text-left">
            <span>Website content managed by <strong>Karmayogi Bharat (DoPT)</strong></span>
            <span>•</span>
            <span>Hosted by <strong>National Informatics Centre (NIC)</strong></span>
          </div>
          <div class="flex items-center gap-4">
            <a href="#terms" class="hover:text-slate-200 transition-colors">Terms of Use</a>
            <a href="#privacy" class="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#accessibility" class="hover:text-slate-200 transition-colors">Accessibility</a>
            <a href="#sitemap" class="hover:text-slate-200 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
