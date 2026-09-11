import React, { useState } from 'react';
import { Sparkles, X, Send, BookOpen, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface IraCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

interface Message {
  sender: 'user' | 'ira';
  text: string;
  citation?: string;
}

export const IraCopilotDrawer: React.FC<IraCopilotDrawerProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ira',
      text: `Namaste, ${user.name}. I am Ira AI, your official civil services capacity building copilot on iGOT Karmayogi Bharat. How can I assist with your FRAC competencies, GFR 2024 regulations, or learning pathways today?`,
      citation: 'DoPT Mission Karmayogi Intelligence Engine v2.4',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'How do I bridge my Digital Governance (FR-01) gap?',
    'What are the key changes in GFR 2024 Rule 149 for GeM?',
    'Explain the Sevottam Grievance Resolution timeline under CPGRAMS',
    'Recommend modules for Cadre Level 14 evaluation',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let reply: Message;
      const lower = text.toLowerCase();

      if (lower.includes('digital') || lower.includes('fr-01') || lower.includes('e-office')) {
        reply = {
          sender: 'ira',
          text: `Your current Digital Governance rating is 2.8 / 5.0 (Target: 4.5). The primary gap lies in e-Office 7.0 digital file encryption and compliance with the Digital Personal Data Protection (DPDP) Act 2023. I recommend completing module "e-Office 7.0 Protocols & Workflow Encryption Masterclass" by NIC, which provides complete FRAC competency accreditation.`,
          citation: 'NIC Standard e-Office Manual v7 & DPDP Rules 2023 Section 8(4)',
        };
      } else if (lower.includes('gfr') || lower.includes('gem') || lower.includes('financial')) {
        reply = {
          sender: 'ira',
          text: `Under GFR 2024 Rule 149, direct online purchases through GeM are permitted up to ₹50,000 without a comparison. Between ₹50,000 and ₹10 Lakhs, mandatory comparison of at least 3 distinct OEMs is required. For items exceeding ₹10 Lakhs, the buyer must use GeM online bidding/reverse auction.`,
          citation: 'Ministry of Finance, Dept of Expenditure - GFR 2024 Circular No. 12/2024',
        };
      } else if (lower.includes('cpgrams') || lower.includes('sevottam') || lower.includes('grievance')) {
        reply = {
          sender: 'ira',
          text: `Under the DARPG Sevottam Framework and revised CPGRAMS 7.0 guidelines, citizen grievances must be resolved within 30 days. For critical urgency or senior citizen complaints, the designated turnaround is 15 days, with mandatory root cause classification recorded in the e-Office action diary.`,
          citation: 'DARPG Citizen Charter Standards 2023 & Sevottam Accreditation Manual',
        };
      } else {
        reply = {
          sender: 'ira',
          text: `I have analyzed your request against your Cadre Level 14 role profile in DoPT. Your current overall competency readiness is ${user.competencyReadiness}%. You have 2 critical interventions pending in Digital Governance and Financial Management. Completing the recommended accredited courses will raise your readiness by +4.2% this quarter.`,
          citation: 'Capacity Building Commission (CBC) National Competency Matrix 2024',
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] text-[#1B2133]">
        {/* Drawer Header: Deep iGOT Blue (#1B4CA1) */}
        <div className="p-4 bg-[#1B4CA1] text-white flex items-center justify-between border-b border-[#002B6C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EF951E] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-white">Ira AI Copilot</h3>
                <span className="text-[10px] bg-white/20 text-[#FEF3C7] border border-white/30 px-1.5 py-0.2 rounded font-mono font-bold">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-blue-100">Civil Services Capacity Intelligence • iGOT Bharat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Copilot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar: Yellow Box (#FEF3C7) */}
        <div className="bg-[#FEF3C7] px-4 py-2 border-b border-[#FDE68A] flex items-center justify-between text-[11px] text-[#92400E]">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DBA501]" />
            Grounded in GFR 2024 & DoPT Regulations
          </span>
          <span className="text-[10px] font-mono text-[#B45309] font-bold">{user.cadreLevel}</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FEFAF4]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#1B4CA1] text-white rounded-br-none'
                    : 'bg-white border border-[#FFD2A1] text-[#1B2133] rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              {msg.citation && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-[#C37024] font-medium px-1">
                  <BookOpen className="w-3 h-3 text-[#EF951E]" />
                  <span>{msg.citation}</span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#C7D9FB] text-slate-500 text-xs w-fit">
              <span className="inline-block w-2 h-2 rounded-full bg-[#EF951E] animate-bounce"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#1B4CA1] animate-bounce [animation-delay:0.2s]"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#EF951E] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-[#1B4CA1] ml-1 font-bold">Consulting DoPT regulatory corpus...</span>
            </div>
          )}
        </div>

        {/* Quick Inquiries: Light Blue Boxes (#EDF1F7) */}
        <div className="p-3 bg-white border-t border-[#E5E7EB]">
          <p className="text-[10px] uppercase font-bold text-[#4B5563] tracking-wider mb-2">Suggested Inquiries</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] bg-[#EDF1F7] hover:bg-[#E6EEFF] hover:text-[#1B4CA1] border border-[#C7D9FB] px-2.5 py-1 rounded-full text-[#1B4CA1] transition-all text-left truncate max-w-full font-medium cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
            placeholder="Ask Ira about rules, modules, or competencies..."
            className="flex-1 text-xs bg-[#EDF1F7] border border-[#C7D9FB] rounded-lg px-3 py-2.5 text-[#1B2133] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4CA1] focus:bg-white transition-all"
          />
          <button
            onClick={() => handleSend(inputValue)}
            className="p-2.5 bg-[#EF951E] hover:bg-[#F08811] text-white rounded-lg transition-colors cursor-pointer shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
