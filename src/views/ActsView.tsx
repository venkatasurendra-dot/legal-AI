import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { MAJOR_LEGAL_ACTS, KEY_LEGAL_SECTIONS } from '../data/legalDatabase';
import { LegalStatus } from '../types';

interface ActsViewProps {
  onAskSection: (query: string) => void;
}

export const ActsView: React.FC<ActsViewProps> = ({ onAskSection }) => {
  const [activeTab, setActiveTab] = useState<'acts' | 'sections' | 'transition-table'>('transition-table');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Transition mapping for quick side-by-side reference
  const transitionMappings = [
    {
      offenceOrProcedure: 'Murder',
      oldCode: 'Indian Penal Code (IPC)',
      oldSection: 'Section 302',
      newCode: 'Bharatiya Nyaya Sanhita (BNS 2023)',
      newSection: 'Section 103(1)',
      notes: 'BNS Section 103(2) introduces specific minimum punishment (life/death) for mob lynching / murder on grounds of race, caste, or community.',
    },
    {
      offenceOrProcedure: 'Attempt to Murder',
      oldCode: 'IPC',
      oldSection: 'Section 307',
      newCode: 'BNS 2023',
      newSection: 'Section 109',
      notes: 'Punishment up to 10 years or life imprisonment.',
    },
    {
      offenceOrProcedure: 'Cheating & Dishonestly Inducing Delivery',
      oldCode: 'IPC',
      oldSection: 'Section 420',
      newCode: 'BNS 2023',
      newSection: 'Section 318(4)',
      notes: 'Cognizable, non-bailable, compoundable with permission of the court. Maximum 7 years imprisonment.',
    },
    {
      offenceOrProcedure: 'Theft',
      oldCode: 'IPC',
      oldSection: 'Section 379',
      newCode: 'BNS 2023',
      newSection: 'Section 303(2)',
      notes: 'BNS introduces community service as an alternative punishment for first-time theft of value less than ₹5,000 upon restitution.',
    },
    {
      offenceOrProcedure: 'Sedition (Repealed) -> Acts Endangering Sovereignty',
      oldCode: 'IPC',
      oldSection: 'Section 124A (Sedition)',
      newCode: 'BNS 2023',
      newSection: 'Section 152',
      notes: 'Word "Sedition" completely eliminated. Penalizes purposeful acts inciting armed rebellion, subversive activities, or endangering sovereignty of India.',
    },
    {
      offenceOrProcedure: 'First Information Report (FIR) & Zero FIR',
      oldCode: 'Code of Criminal Procedure (CrPC)',
      oldSection: 'Section 154',
      newCode: 'Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)',
      newSection: 'Section 173',
      notes: 'Statutorily recognizes Zero FIR (registration irrespective of jurisdiction) and e-FIR via electronic communication.',
    },
    {
      offenceOrProcedure: 'Anticipatory Bail',
      oldCode: 'CrPC',
      oldSection: 'Section 438',
      newCode: 'BNSS 2023',
      newSection: 'Section 482',
      notes: 'Power of High Court or Sessions Court to direct release on bail for person apprehending arrest for non-bailable offence.',
    },
    {
      offenceOrProcedure: 'Regular Bail (Non-Bailable Offences)',
      oldCode: 'CrPC',
      oldSection: 'Section 437 & 439',
      newCode: 'BNSS 2023',
      newSection: 'Section 480 & 483',
      notes: 'Statutory discretion and conditions for granting bail in non-bailable allegations.',
    },
    {
      offenceOrProcedure: 'Maximum Detention of Undertrial Prisoners',
      oldCode: 'CrPC',
      oldSection: 'Section 436A',
      newCode: 'BNSS 2023',
      newSection: 'Section 479',
      notes: 'Mandates release of first-time offenders who have undergone one-third of the maximum imprisonment period on personal bond.',
    },
    {
      offenceOrProcedure: 'Admissibility of Electronic Records',
      oldCode: 'Indian Evidence Act (IEA)',
      oldSection: 'Section 65B',
      newCode: 'Bharatiya Sakshya Adhiniyam (BSA 2023)',
      newSection: 'Section 63',
      notes: 'Streamlines admissibility of digital evidence, smartphones, servers, cloud records, and metadata.',
    },
  ];

  const filteredActs = MAJOR_LEGAL_ACTS.filter((act) => {
    const matchesStatus = statusFilter === 'ALL' || act.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      act.name.toLowerCase().includes(q) ||
      act.shortCode.toLowerCase().includes(q) ||
      act.overview.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const filteredSections = KEY_LEGAL_SECTIONS.filter((sec) => {
    const matchesStatus = statusFilter === 'ALL' || sec.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      sec.actName.toLowerCase().includes(q) ||
      sec.sectionNumber.toLowerCase().includes(q) ||
      sec.title.toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q) ||
      (sec.replacesOld && sec.replacesOld.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Central & State Statutes Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            Indian Acts, Codes & Sections
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Exhaustive database comparing the New Criminal Laws (BNS 2023, BNSS 2023, BSA 2023) with colonial-era predecessors (IPC, CrPC, IEA), alongside key commercial, civil, cyber, and procedural enactments.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131924] border border-slate-800 p-2 rounded-2xl">
          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setActiveTab('transition-table')}
              className={`px-3 py-2 rounded-xl font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'transition-table'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Old vs New Criminal Codes Transition</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`px-3 py-2 rounded-xl font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'sections'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Key Legal Sections ({filteredSections.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('acts')}
              className={`px-3 py-2 rounded-xl font-medium flex items-center space-x-1.5 transition-all ${
                activeTab === 'acts'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Major Legal Acts ({filteredActs.length})</span>
            </button>
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Status:</span>
            {['ALL', 'ACTIVE', 'REPEALED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-700 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Old vs New Transition Table */}
        {activeTab === 'transition-table' && (
          <div className="space-y-4">
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold">Statutory Transition Rule (1 July 2024):</strong>{' '}
                For offences committed <em>on or after 1 July 2024</em>, the charges, FIRs, and trials proceed under <strong>BNS 2023</strong> and <strong>BNSS 2023</strong>. For offences committed <em>prior to 1 July 2024</em>, substantive offences remain governed by the <strong>Indian Penal Code (IPC 1860)</strong> due to the constitutional protection against ex post facto laws (Article 20(1) of the Constitution).
              </div>
            </div>

            <div className="bg-[#131924] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Offence / Legal Procedure</th>
                      <th className="p-4">Former Colonial Code (Pre-2024)</th>
                      <th className="p-4 text-amber-400">Active Code (Effective 1 July 2024)</th>
                      <th className="p-4">Key Statutory Evolution & Changes</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {transitionMappings.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-semibold text-slate-100">
                          {row.offenceOrProcedure}
                        </td>
                        <td className="p-4">
                          <span className="text-rose-300 font-mono font-medium bg-rose-950/40 border border-rose-900/50 px-2 py-0.5 rounded text-[11px]">
                            {row.oldSection} ({row.oldCode})
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-emerald-300 font-mono font-bold bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-1 rounded text-[11px] inline-flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>{row.newSection}</span>
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{row.newCode}</div>
                        </td>
                        <td className="p-4 text-slate-300 max-w-md leading-relaxed">
                          {row.notes}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => onAskSection(`Explain the transition from ${row.oldSection} to ${row.newSection} under the new criminal laws.`)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 inline-flex items-center space-x-1 transition-colors"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Ask AI</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. Key Sections View */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sections by number (e.g. Section 103), act name, offence, or remedy..."
                className="w-full bg-[#131924] border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredSections.map((sec) => {
                const isExpanded = expandedSectionId === sec.id;
                const isRepealed = sec.status === 'REPEALED';
                return (
                  <div
                    key={sec.id}
                    className="bg-[#131924] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-serif font-bold text-sm sm:text-base text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                          {sec.sectionNumber}
                        </span>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base text-slate-100">
                            {sec.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{sec.actName}</span>
                            <span>•</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              isRepealed 
                                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' 
                                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                            }`}>
                              {sec.status}
                            </span>
                            {sec.replacesOld && (
                              <span className="text-amber-400/80 font-medium">
                                (Replaces {sec.replacesOld})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onAskSection(`Provide a detailed legal breakdown of ${sec.actName} ${sec.sectionNumber} (${sec.title}) including ingredients, punishments, and defenses.`)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 flex items-center space-x-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask AI</span>
                        </button>
                        <button
                          onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                        >
                          {isExpanded ? 'Less' : 'Details'}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                      {sec.summary}
                    </p>

                    {sec.punishmentOrRemedy && (
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs mb-3 flex items-start space-x-2">
                        <strong className="text-amber-300 shrink-0">Prescribed Punishment / Remedy:</strong>
                        <span className="text-slate-300">{sec.punishmentOrRemedy}</span>
                      </div>
                    )}

                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
                        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                          <strong className="text-amber-300 block mb-1">Full Statutory Provision Overview:</strong>
                          <p className="text-slate-300 leading-relaxed">{sec.fullProvisionOverview}</p>
                        </div>

                        {sec.exceptions && (
                          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                            <strong className="text-amber-300 block mb-1">Statutory Exceptions & Defenses:</strong>
                            <ul className="list-disc pl-4 space-y-1 text-slate-300">
                              {sec.exceptions.map((ex, exIdx) => <li key={exIdx}>{ex}</li>)}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>Effective Date: {sec.effectiveDate}</span>
                          <a
                            href={sec.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:underline flex items-center space-x-1"
                          >
                            <span>India Code Official Text</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Major Acts View */}
        {activeTab === 'acts' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActs.map((act) => {
                const isRepealed = act.status === 'REPEALED';
                return (
                  <div
                    key={act.id}
                    className="bg-[#131924] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          {act.shortCode}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          isRepealed 
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' 
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        }`}>
                          {act.status}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm sm:text-base text-slate-100 mb-2">
                        {act.name}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {act.overview}
                      </p>

                      {act.supersededByOrNotes && (
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-amber-200/90 mb-3">
                          <strong>Transition Notice:</strong> {act.supersededByOrNotes}
                        </div>
                      )}

                      <div className="mb-3">
                        <strong className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Key Sections:</strong>
                        <div className="flex flex-wrap gap-1">
                          {act.keySections.map((ks, kIdx) => (
                            <span key={kIdx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                              {ks}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Effective: {act.effectiveDate}</span>
                      <a
                        href={act.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 inline-flex items-center space-x-1"
                      >
                        <span>India Code</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
