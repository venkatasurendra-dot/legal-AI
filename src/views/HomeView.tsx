import React, { useState } from 'react';
import { 
  Scale, 
  Search, 
  ArrowRight, 
  Landmark, 
  BookOpen, 
  Gavel, 
  ShieldAlert, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Compass, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { AUTHORITATIVE_SOURCES } from '../data/legalDatabase';

interface HomeViewProps {
  onNavigate: (view: string, initialQuery?: string) => void;
  onOpenSearch: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('chat', searchQuery.trim());
    }
  };

  const sampleQueries = [
    { text: 'What is Article 21 and how was it expanded in Maneka Gandhi?', category: 'Constitution' },
    { text: 'How does anticipatory bail work under Section 482 BNSS 2023?', category: 'Criminal Procedure' },
    { text: 'What are the statutory requirements for cheque bounce under Section 138 NI Act?', category: 'Commercial Law' },
    { text: 'Is it legal to record audio phone calls without consent in India?', category: 'Legal vs Illegal' },
    { text: 'What is the step-by-step pathway to become an advocate after 12th or graduation?', category: 'Advocate Career' },
    { text: 'How do I decode my 16-digit eCourts CNR number to track a case?', category: 'Court System' },
  ];

  const pillars = [
    {
      id: 'constitution',
      title: 'Constitution of India',
      subtitle: 'Preamble, Fundamental Rights & Doctrines',
      desc: 'Explore Article 14 to 395, Basic Structure doctrine, 106 constitutional amendments, and landmark constitutional benches.',
      icon: Landmark,
      tag: 'Supreme Law'
    },
    {
      id: 'acts',
      title: 'Acts & Sections (New Criminal Laws)',
      subtitle: 'BNS, BNSS, BSA vs. IPC, CrPC, Evidence Act',
      desc: 'Interactive database distinguishing active 2024 enactments from repealed colonial codes with transition mapping.',
      icon: BookOpen,
      tag: 'BNS 2024 Updated'
    },
    {
      id: 'court-guide',
      title: 'Indian Court System Guide',
      subtitle: 'Supreme Court, High Courts, District Courts & Tribunals',
      desc: 'Understand case lifecycles, 16-digit CNR tracking, bail mechanics, cause lists, e-Filing, and free legal aid via NALSA.',
      icon: Gavel,
      tag: 'Judiciary'
    },
    {
      id: 'court-etiquette',
      title: 'How to Behave in Court',
      subtitle: 'Courtroom Etiquette & Decorum Standards',
      desc: 'Guidance on addressing judges, dress codes (advocates vs litigants), decorum rules, and court-specific procedural expectations.',
      icon: ShieldAlert,
      tag: 'Court Decorum'
    },
    {
      id: 'advocate-guide',
      title: 'Advocate Guide & Ethics',
      subtitle: 'Roles, Responsibilities & BCI Ethics Rules',
      desc: 'Distinguish lawyer vs advocate vs Senior Advocate vs AoR, client confidentiality (Sec 126 BSA), and conflict-of-interest principles.',
      icon: Briefcase,
      tag: 'Professional Practice'
    },
    {
      id: 'become-lawyer',
      title: 'How to Become an Advocate',
      subtitle: 'Complete Career & Licensing Roadmap',
      desc: 'Eligibility, 5-year vs 3-year LL.B, entrance exams (CLAT/AILET), State Bar enrollment, AIBE exam, and Certificate of Practice (CoP).',
      icon: GraduationCap,
      tag: 'Legal Career'
    },
    {
      id: 'document-analyzer',
      title: 'Legal Document Assistant',
      subtitle: 'Clauses, Obligations & Jargon Simplifier',
      desc: 'Upload agreements, legal notices, or tenancy contracts for automated clause breakdown, risk identification, and lawyer questions.',
      icon: FileText,
      tag: 'Document AI'
    },
    {
      id: 'judgment-explainer',
      title: 'Landmark Judgment Explainer',
      subtitle: 'Ratio Decidendi, Facts & Precedent Analysis',
      desc: 'Understand landmark Supreme Court verdicts (Kesavananda, Puttaswamy, Maneka Gandhi) broken down into issues, arguments, and holdings.',
      icon: Compass,
      tag: 'Precedents'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-800/80 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-6">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Powered Indian Legal Information & Research System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-100 tracking-tight leading-tight mb-4">
            Authoritative Insights into <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              Indian Law, Constitution & Courts
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            An educational legal intelligence assistant strictly grounded in official Government of India gazettes, Supreme Court judgments, India Code statutes, and the 2024 New Criminal Laws.
          </p>

          {/* Search / Ask Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center bg-[#151c28] border border-slate-700 hover:border-amber-500/50 focus-within:border-amber-500 rounded-2xl p-2 shadow-2xl transition-all">
              <Search className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask any question on Indian Law (e.g. Article 21, BNS Section 103, Bail, Cheque Bounce)..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* New Criminal Law Alert Banner */}
          <div className="max-w-3xl mx-auto bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 text-left flex items-start space-x-3 text-xs text-amber-200/90 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-semibold">Major Legal Transition (1 July 2024):</strong>{' '}
              Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), and Bharatiya Sakshya Adhiniyam (BSA 2023) are now the active criminal laws of India. Offences committed before 1 July 2024 continue to be prosecuted under IPC, CrPC, and Indian Evidence Act. LegalAI India explicitly tracks and distinguishes active vs repealed provisions.
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Questions Bar */}
      <section className="py-8 bg-[#121722] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Common Legal Inquiries</span>
            </h3>
            <span className="text-[11px] text-slate-400">Click any query to run in AI Legal Chat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('chat', q.text)}
                className="text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/30 transition-all text-xs text-slate-300 hover:text-white flex flex-col justify-between group"
              >
                <span className="leading-snug group-hover:text-amber-200 transition-colors">
                  "{q.text}"
                </span>
                <span className="text-[10px] text-amber-400/80 font-medium mt-2">
                  #{q.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Core Knowledge Pillars */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-slate-100 mb-2">
            Structured Legal Knowledge Architecture
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Comprehensive modules covering constitutional law, statutory acts, court workflows, courtroom etiquette, and legal practice in India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => onNavigate(pillar.id)}
                className="bg-[#131924] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-100 group-hover:text-amber-300 transition-colors mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-amber-400/70 font-medium mb-2">
                    {pillar.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Authoritative Sources Priority Section */}
      <section className="py-10 bg-[#0d1118] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-200">
                Authoritative Government & Judicial Sources
              </h3>
              <p className="text-xs text-slate-400">
                LegalAI India references primary statutory bodies. No unverified social blogs or unverified summaries.
              </p>
            </div>
            <button
              onClick={() => onNavigate('sources')}
              className="mt-3 md:mt-0 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>View All Authoritative Sources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AUTHORITATIVE_SOURCES.map((src) => (
              <a
                key={src.id}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-all text-center flex flex-col items-center justify-center group"
              >
                <span className="text-xs font-medium text-slate-300 group-hover:text-amber-300 transition-colors line-clamp-1">
                  {src.name.split('—')[0]}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                  <span>{src.type}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
