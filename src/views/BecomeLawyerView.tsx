import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  Award, 
  ExternalLink, 
  Sparkles,
  Layers,
  Clock,
  Building2,
  FileCheck
} from 'lucide-react';
import { BECOME_A_LAWYER_PATHWAY } from '../data/guidesData';

export const BecomeLawyerView: React.FC<{ onAskQuery: (q: string) => void }> = ({ onAskQuery }) => {
  const [selectedCourseType, setSelectedCourseType] = useState<'5-year' | '3-year'>('5-year');

  const entranceExams = [
    { name: 'CLAT (UG & PG)', conducts: 'Consortium of 26 National Law Universities (NLUs)', eligibility: '10+2 for UG / LL.B for PG', scoreUsedBy: 'NLSIU Bangalore, NALSAR Hyderabad, WBNUJS, etc.' },
    { name: 'AILET', conducts: 'National Law University, Delhi (NLU Delhi)', eligibility: '10+2 with min 45% aggregate', scoreUsedBy: 'NLU Delhi exclusively' },
    { name: 'CUET-PG (Law)', conducts: 'National Testing Agency (NTA)', eligibility: 'Graduation in any discipline', scoreUsedBy: 'Delhi University (CLC/LC1/LC2), BHU, Central Universities' },
    { name: 'MH-CET Law', conducts: 'State CET Cell, Maharashtra', eligibility: '10+2 (5-year) or Graduation (3-year)', scoreUsedBy: 'GLC Mumbai, ILS Pune, and 140+ law colleges in Maharashtra' },
    { name: 'SLAT', conducts: 'Symbiosis International University', eligibility: '10+2 with min 45% aggregate', scoreUsedBy: 'Symbiosis Law School Pune, Noida, Hyderabad, Nagpur' },
  ];

  const careerAvenues = [
    { title: 'Judicial Services (Civil Judge / Magistrate)', desc: 'State Public Service Commission examinations. Selected officers preside over Court of Civil Judge Junior Division & Judicial Magistrate First Class.', icon: Building2 },
    { title: 'Trial & Appellate Court Litigation', desc: 'Independent court practice before District Courts, High Courts, and the Supreme Court in civil, criminal, constitutional, or commercial disputes.', icon: Briefcase },
    { title: 'Corporate Law & In-House Counsel', desc: 'Corporate legal departments of multinationals, banks, fintechs, and premier law firms handling M&A, contracts, compliance, and IP.', icon: Award },
    { title: 'Public Prosecution (APP / Public Prosecutor)', desc: 'Representing the State in criminal prosecutions before Magistrates and Sessions Courts under Section 18 & 24 BNSS (formerly CrPC).', icon: FileCheck },
    { title: 'Arbitration & Alternative Dispute Resolution (ADR)', desc: 'Domestic and international commercial arbitrations, institutional mediation, and conciliation under the Arbitration & Conciliation Act, 1996.', icon: Layers },
    { title: 'Civil Services (IAS / IPS) & Academia', desc: 'UPSC Civil Services examination, or pursuing LL.M & Ph.D. to become law professors and constitutional scholars.', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Bar Council of India Legal Education & Licensing Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            How to Become an Advocate in India
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The complete statutory roadmap: from high school (10+2) or undergraduate degree, law school entrance exams, internships, State Bar Council enrollment, to clearing the All India Bar Examination (AIBE) and obtaining your Certificate of Practice.
          </p>
        </div>

        {/* 5-Year vs 3-Year Comparison Card */}
        <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-200">
                Course Selection: 5-Year Integrated LL.B vs. 3-Year LL.B
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Both pathways are fully recognized by the Bar Council of India for court practice.
              </p>
            </div>
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedCourseType('5-year')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedCourseType === '5-year' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                5-Year Integrated Course
              </button>
              <button
                onClick={() => setSelectedCourseType('3-year')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedCourseType === '3-year' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                3-Year LL.B Degree
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <strong className="text-amber-300 text-sm block">
                {selectedCourseType === '5-year' ? '5-Year Integrated Course (BA / BBA / B.Com / B.Sc LL.B)' : '3-Year LL.B (Bachelor of Laws)'}
              </strong>
              <p className="text-slate-300 leading-relaxed">
                {selectedCourseType === '5-year'
                  ? 'Designed for students immediately after clearing Class 12 (10+2). Integrates graduation in humanities, management, commerce, or science with professional legal education. Saves one full academic year.'
                  : 'Designed for graduates who have completed a 3 or 4-year Bachelor degree in any academic stream (B.A., B.Sc., B.Com, B.Tech, MBBS, etc.). Focuses purely on substantive and procedural law subjects.'}
              </p>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <p><strong className="text-slate-200">Minimum Marks:</strong> 45% aggregate in qualifying exam (40% for SC/ST candidates).</p>
                <p><strong className="text-slate-200">Key Entrance Exams:</strong> {selectedCourseType === '5-year' ? 'CLAT-UG, AILET, SLAT, MH-CET 5-Yr, LSAT-India' : 'CUET-PG (Law), MH-CET 3-Yr, NLSAT (3-Yr NLSIU), IIT Kharagpur LLB'}</p>
                <p><strong className="text-slate-200">Mandatory Internships:</strong> Minimum 20 weeks (5-year) or 12 weeks (3-year) across court chambers, NGOs, and law firms.</p>
              </div>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <strong className="text-amber-300 text-sm block mb-2">Core BCI Mandated Subjects:</strong>
                <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                  <span>• Constitutional Law</span>
                  <span>• Bharatiya Nyaya Sanhita (BNS)</span>
                  <span>• Bharatiya Nagarik Suraksha (BNSS)</span>
                  <span>• Bharatiya Sakshya Adhiniyam</span>
                  <span>• Code of Civil Procedure (CPC)</span>
                  <span>• Law of Contracts & Specific Relief</span>
                  <span>• Family Laws (Hindu & Muslim)</span>
                  <span>• Corporate & Company Law</span>
                  <span>• Alternative Dispute Resolution</span>
                  <span>• Professional Ethics & BCI Rules</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => onAskQuery(`What is the difference between a 5-year integrated law course and a 3-year LL.B under Bar Council of India rules?`)}
                  className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI for Personalized Career Advice</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-step Statutory Roadmap */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-slate-100">
              The 6-Stage Statutory Licensing Pathway
            </h2>
            <span className="text-xs text-slate-400">Section 24, Advocates Act, 1961</span>
          </div>

          <div className="space-y-3">
            {BECOME_A_LAWYER_PATHWAY.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-[#131924] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4 hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-serif font-bold text-lg flex items-center justify-center shrink-0">
                  {step.stepNumber}
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-slate-100">
                      {step.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                        {step.stage}
                      </span>
                      <span className="text-slate-400">Duration: {step.duration}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <strong className="text-amber-300 block mb-1 text-[11px] uppercase tracking-wider">Key Requirements & Conditions:</strong>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      {step.requirements.map((req, rIdx) => <li key={rIdx}>{req}</li>)}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Statutory Authority: {step.authoritativeSource}</span>
                    <span>Last Checked: {step.lastCheckedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post-Enrollment Career Pathways */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-slate-100">
            Career Horizons for Licensed Indian Advocates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerAvenues.map((av, idx) => {
              const Icon = av.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#131924] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100 mb-1.5">
                      {av.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {av.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800">
                    <button
                      onClick={() => onAskQuery(`What is the preparation strategy and syllabus for ${av.title} in India?`)}
                      className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ask AI Preparation Plan</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
