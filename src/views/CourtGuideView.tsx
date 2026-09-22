import React, { useState } from 'react';
import { 
  Gavel, 
  Search, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  AlertCircle, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  FileCheck,
  Building2,
  Compass
} from 'lucide-react';
import { COURT_SYSTEM_GUIDE } from '../data/legalDatabase';
import { CNR_NUMBER_GUIDE, LEGAL_AID_NALSA_GUIDE } from '../data/guidesData';

export const CourtGuideView: React.FC<{ onAskQuery: (q: string) => void }> = ({ onAskQuery }) => {
  const [activeSubTab, setActiveSubTab] = useState<'hierarchy' | 'cnr-decoder' | 'bail-guide' | 'legal-aid'>('hierarchy');
  const [inputCnr, setInputCnr] = useState('MHAM010045672024');
  const [decodedCnr, setDecodedCnr] = useState<any>(null);

  const handleDecodeCnr = (cnrToDecode: string) => {
    const clean = cnrToDecode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (clean.length === 16) {
      const state = clean.slice(0, 2);
      const district = clean.slice(2, 4);
      const establishment = clean.slice(4, 6);
      const caseNumber = clean.slice(6, 12);
      const year = clean.slice(12, 16);

      setDecodedCnr({
        raw: clean,
        isValid: true,
        state,
        district,
        establishment,
        caseNumber,
        year,
      });
    } else {
      setDecodedCnr({
        raw: clean,
        isValid: false,
        error: `Expected exactly 16 alphanumeric characters, but received ${clean.length}.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Gavel className="w-3.5 h-3.5" />
            <span>Judicial Architecture of India</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            Indian Court System, CNR Tracking & Bail Guide
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Understand the four-tier judicial hierarchy, decode your 16-digit eCourts CNR number, learn procedural pathways for regular and anticipatory bail under BNSS 2023, and access free legal aid under NALSA.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-[#131924] border border-slate-800 p-2 rounded-2xl max-w-3xl mx-auto">
          <button
            onClick={() => setActiveSubTab('hierarchy')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === 'hierarchy'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Court Hierarchy
          </button>

          <button
            onClick={() => {
              setActiveSubTab('cnr-decoder');
              handleDecodeCnr(inputCnr);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === 'cnr-decoder'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            16-Digit CNR Number Decoder
          </button>

          <button
            onClick={() => setActiveSubTab('bail-guide')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === 'bail-guide'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Bail in India (BNSS 2023)
          </button>

          <button
            onClick={() => setActiveSubTab('legal-aid')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeSubTab === 'legal-aid'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Free Legal Aid (NALSA)
          </button>
        </div>

        {/* 1. Court Hierarchy Tab */}
        {activeSubTab === 'hierarchy' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COURT_SYSTEM_GUIDE.map((court) => (
                <div
                  key={court.id}
                  className="bg-[#131924] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {court.level}
                      </span>
                      <Building2 className="w-4 h-4 text-slate-400" />
                    </div>

                    <h3 className="font-serif font-bold text-base text-slate-100 mb-1">
                      {court.name}
                    </h3>
                    <p className="text-xs text-amber-400/80 font-medium mb-3">
                      Head: {court.head}
                    </p>

                    <div className="space-y-2 text-xs text-slate-300 mb-4">
                      <p><strong className="text-slate-200">Jurisdiction:</strong> {court.jurisdiction}</p>
                      <p><strong className="text-slate-200">Appeals:</strong> {court.appealRoute}</p>
                    </div>

                    <div className="mb-4">
                      <strong className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Key Powers:</strong>
                      <ul className="list-disc pl-4 text-xs space-y-1 text-slate-300">
                        {court.powers.map((p, pIdx) => <li key={pIdx}>{p}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onAskQuery(`Explain the jurisdiction and powers of the ${court.name} in India.`)}
                      className="text-amber-400 hover:text-amber-300 font-medium"
                    >
                      Ask AI about this Court
                    </button>
                    <a
                      href={court.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. 16-Digit CNR Number Decoder */}
        {activeSubTab === 'cnr-decoder' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-amber-200 mb-1">
                  16-Digit eCourts CNR Number Decoder
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every case filed in Indian District Courts, Subordinate Courts, and High Courts is assigned a unique 16-character alphanumeric CNR (Case Number Record). Enter your CNR number to decode its structural components:
                </p>
              </div>

              {/* Input Form */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  maxLength={20}
                  value={inputCnr}
                  onChange={(e) => setInputCnr(e.target.value.toUpperCase())}
                  placeholder="e.g. MHAM01-004567-2024 or DLHC010012342023"
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 font-mono text-sm text-amber-300 uppercase tracking-wider focus:outline-none"
                />
                <button
                  onClick={() => handleDecodeCnr(inputCnr)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shrink-0"
                >
                  Decode CNR Number
                </button>
              </div>

              {/* Sample CNR pills */}
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="text-[11px]">Sample CNR Numbers:</span>
                {['MHAM010045672024', 'DLHC010012342023', 'KA01010078902022'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInputCnr(s);
                      handleDecodeCnr(s);
                    }}
                    className="font-mono text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2 py-0.5 rounded border border-slate-700"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Decoded Result */}
              {decodedCnr && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  {decodedCnr.isValid ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Valid 16-Character CNR Format: {decodedCnr.raw}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">State Code</span>
                          <span className="text-base font-mono font-bold text-amber-300">{decodedCnr.state}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">2 Letters</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">District Code</span>
                          <span className="text-base font-mono font-bold text-amber-300">{decodedCnr.district}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">2 Letters</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Court Complex</span>
                          <span className="text-base font-mono font-bold text-amber-300">{decodedCnr.establishment}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">2 Digits</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Case Serial</span>
                          <span className="text-base font-mono font-bold text-amber-300">{decodedCnr.caseNumber}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">6 Digits</span>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Filing Year</span>
                          <span className="text-base font-mono font-bold text-amber-300">{decodedCnr.year}</span>
                          <span className="text-[10px] text-slate-400 block mt-1">4 Digits</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                        <strong className="text-amber-300 block">How to Track Case Status using this CNR:</strong>
                        <ol className="list-decimal pl-4 space-y-1">
                          <li>Open the official portal: <a href="https://services.ecourts.gov.in" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">services.ecourts.gov.in</a> or the eCourts mobile app.</li>
                          <li>Click on <strong>"CNR Number Search"</strong>.</li>
                          <li>Input <code className="font-mono text-amber-300">{decodedCnr.raw}</code> and solve the captcha.</li>
                          <li>View the active cause list, pending orders, next listing date, and certified judgment downloads.</li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
                      {decodedCnr.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Bail Guide in India */}
        {activeSubTab === 'bail-guide' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="font-serif text-xl font-bold text-amber-200">
                  Statutory Guide to Bail in India (BNSS 2023 vs CrPC)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  "Bail is the rule, jail is the exception" — State of Rajasthan v. Balchand (1977)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">
                    Regular Bail
                  </span>
                  <h3 className="font-semibold text-slate-100 text-sm">
                    Section 480 & 483 BNSS
                  </h3>
                  <p className="text-slate-400 text-[11px]">(Formerly Sec 437 & 439 CrPC)</p>
                  <p className="text-slate-300 leading-relaxed">
                    Sought when an accused has already been arrested or surrendered before the Magistrate or Sessions/High Court.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                    <li>Non-bailable offences: court discretion based on gravity of charge.</li>
                    <li>Conditions imposed: surrender passport, cooperate with investigation, no tampering with witnesses.</li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">
                    Anticipatory Bail
                  </span>
                  <h3 className="font-semibold text-slate-100 text-sm">
                    Section 482 BNSS
                  </h3>
                  <p className="text-slate-400 text-[11px]">(Formerly Sec 438 CrPC)</p>
                  <p className="text-slate-300 leading-relaxed">
                    Directions for grant of bail to a person apprehending arrest in a non-bailable offence before actual physical arrest.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                    <li>Filed before Sessions Court or High Court.</li>
                    <li>Protects against frivolous or malicious arrest.</li>
                    <li>Subject to conditions under Section 482(2) BNSS.</li>
                  </ul>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">
                    Undertrial Relief
                  </span>
                  <h3 className="font-semibold text-slate-100 text-sm">
                    Section 479 BNSS
                  </h3>
                  <p className="text-slate-400 text-[11px]">(Formerly Sec 436A CrPC)</p>
                  <p className="text-slate-300 leading-relaxed">
                    Groundbreaking reform for undertrial prisoners: First-time offenders who have served one-third of the maximum statutory punishment must be released on personal bond.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                    <li>Applies to all offences except those punishable with death or life imprisonment.</li>
                    <li>Jail Superintendent has duty to apply for bail on behalf of indigent prisoner.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 text-xs space-y-2">
                <strong className="text-amber-300 block">Supreme Court Guidelines on Bail & Arrest:</strong>
                <p className="text-slate-300">
                  In <em>Arnesh Kumar v. State of Bihar (2014)</em> and reaffirmed in <em>Satender Kumar Antil (2022)</em>, the Supreme Court mandated that police must not automatically arrest in offences punishable with up to 7 years imprisonment without first issuing a Notice of Appearance under Section 35 BNSS (formerly Sec 41A CrPC).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Free Legal Aid under NALSA */}
        {activeSubTab === 'legal-aid' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold text-amber-200">
                    {LEGAL_AID_NALSA_GUIDE.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {LEGAL_AID_NALSA_GUIDE.statutoryBasis}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold inline-flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 mr-1" />
                    <span>Helpline: 15100</span>
                  </span>
                </div>
              </div>

              <div>
                <strong className="text-xs text-amber-300 uppercase tracking-wider block mb-2">
                  Who is Entitled to Free Legal Aid under Section 12:
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {LEGAL_AID_NALSA_GUIDE.whoIsEligible.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <strong className="text-xs text-amber-300 uppercase tracking-wider block mb-2">
                  How to Access Free Legal Counsel:
                </strong>
                <div className="space-y-2 text-xs text-slate-300">
                  {LEGAL_AID_NALSA_GUIDE.howToApply.map((step, idx) => (
                    <p key={idx} className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                      {step}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <a
                  href="https://nalsa.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center space-x-1"
                >
                  <span>Official NALSA Web Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-400 text-[11px]">Toll-Free National Helpline: 15100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
