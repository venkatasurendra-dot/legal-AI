import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  Building2, 
  Smartphone, 
  UserCheck,
  Scale
} from 'lucide-react';
import { COURTROOM_ETIQUETTE } from '../data/guidesData';

export const CourtEtiquetteView: React.FC<{ onAskQuery: (q: string) => void }> = ({ onAskQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredEtiquette = COURTROOM_ETIQUETTE.filter(
    item => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Judicial Protocol & Decorum Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            How to Behave in an Indian Courtroom
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Essential etiquette, dress codes, forms of address for judges, and decorum guidelines for litigants, witnesses, advocates, and visitors in Indian courts. Avoid procedural errors and contempt of court.
          </p>
        </div>

        {/* Quick Golden Rules Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#131924] border border-slate-800 rounded-2xl p-4 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider mb-1">
                Addressing the Judge
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Your Honour" or "Sir / Madam" is accepted across all courts. "My Lord" is customary in High Courts and the Supreme Court.
              </p>
            </div>
          </div>

          <div className="bg-[#131924] border border-slate-800 rounded-2xl p-4 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider mb-1">
                Mobile Phones & Recording
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Phones must be switched off or on silent. Audio/video recording is strictly prohibited and attracts contempt proceedings.
              </p>
            </div>
          </div>

          <div className="bg-[#131924] border border-slate-800 rounded-2xl p-4 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider mb-1">
                Dress Code & Demeanour
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modest, formal, or sober attire. Stand when speaking or when the Judge enters/exits. Bow slightly when crossing the bar threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center space-x-2 text-xs">
          {['ALL', 'Addressing the Bench', 'Attire & Appearance', 'Courtroom Decorum'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-[#131924] text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Etiquette Guidelines' : cat}
            </button>
          ))}
        </div>

        {/* Etiquette Sections */}
        <div className="space-y-6">
          {filteredEtiquette.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-md space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-serif text-lg font-bold text-slate-100">{item.title}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-800 text-amber-300 border border-slate-700">
                      {item.isCourtSpecific ? 'Court Specific' : 'Universal Protocol'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.courtTypeOrScope}</p>
                </div>

                <button
                  onClick={() => onAskQuery(`What is the courtroom etiquette for ${item.title} in an Indian court?`)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 flex items-center space-x-1 shrink-0 self-start sm:self-auto"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ask AI Guidance</span>
                </button>
              </div>

              {/* Rules List */}
              <div className="space-y-2">
                <strong className="text-xs text-slate-300 uppercase tracking-wider block">Prescribed Standards:</strong>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {item.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dos & Don'ts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Dos */}
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Things You MUST Do</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {item.doAndDonts.dos.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
                    <XCircle className="w-4 h-4" />
                    <span>Things to Strictly AVOID</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {item.doAndDonts.donts.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start space-x-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
