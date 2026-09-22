import React from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  Award,
  Users,
  Lock
} from 'lucide-react';
import { ADVOCATE_ROLES } from '../data/guidesData';

export const AdvocateGuideView: React.FC<{ onAskQuery: (q: string) => void }> = ({ onAskQuery }) => {
  const roleComparison = [
    {
      title: 'Lawyer',
      qualification: 'LL.B Degree (3-year or 5-year)',
      license: 'Not formally licensed to practice in court',
      rightOfAudience: 'Cannot plead or represent clients in court without enrollment',
      scope: 'Can provide corporate legal advice, contract drafting, and legal research in non-court settings.',
    },
    {
      title: 'Advocate',
      qualification: 'LL.B + State Bar Council Enrollment + AIBE Qualified',
      license: 'Certificate of Practice (CoP) from Bar Council of India',
      rightOfAudience: 'Full right of audience across all courts, tribunals, and forums in India',
      scope: 'File pleadings, argue cases, examine witnesses, and represent litigants under Advocates Act, 1961.',
    },
    {
      title: 'Senior Advocate',
      qualification: 'Distinguished advocate designated by Supreme Court or High Court',
      license: 'Section 16, Advocates Act 1961 (Indira Jaising guidelines)',
      rightOfAudience: 'Supreme Court and High Courts (with special gowns)',
      scope: 'Cannot file Vakalatnama or draft pleadings directly; must be briefed by an Advocate-on-Record or Junior Advocate.',
    },
    {
      title: 'Advocate-on-Record (AoR)',
      qualification: 'Advocate + 1 year training under designated AoR + Passed AoR Examination',
      license: 'Supreme Court Rules, 2013',
      rightOfAudience: 'Exclusive authority to file matters and represent parties in the Supreme Court',
      scope: 'Sole statutory category entitled to file petitions, affidavits, and Vakalatnama in the Supreme Court of India.',
    },
  ];

  const ethicsRules = [
    {
      title: 'Privileged Professional Communication',
      statute: 'Section 126, Bharatiya Sakshya Adhiniyam, 2023 (formerly Evidence Act)',
      desc: 'An advocate cannot disclose any communication made to them by or on behalf of their client in the course and for the purpose of their employment, unless with the client\'s express consent.',
      icon: Lock,
    },
    {
      title: 'Strict Prohibition on Contingent Fees',
      statute: 'Bar Council of India Rules, Part VI, Chapter II, Rule 20',
      desc: 'An advocate shall not stipulate for a fee contingent on the results of litigation or agree to share the proceeds thereof. Charging a percentage of the awarded property or claim is professional misconduct.',
      icon: AlertTriangle,
    },
    {
      title: 'Conflict of Interest & Full Disclosure',
      statute: 'Bar Council of India Rules, Rule 21 & 22',
      desc: 'An advocate who has advised or prepared papers for one party shall not appear or plead for the opposite party in the same or connected matter, and must disclose any personal interest in the subject dispute.',
      icon: Scale,
    },
    {
      title: 'Prohibition on Commercial Advertising',
      statute: 'Bar Council of India Rules, Rule 36',
      desc: 'Law is recognized as a noble profession, not a commercial trade. Advocates are prohibited from soliciting clients through billboards, television commercials, search-engine sponsored ads, or touts.',
      icon: ShieldCheck,
    },
    {
      title: 'Duty to Render Free Legal Aid',
      statute: 'Bar Council of India Rules, Rule 46',
      desc: 'Every advocate shall in the practice of the profession bear in mind that anyone genuinely in need of a lawyer is entitled to legal assistance even though he cannot pay for it in whole or part.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Advocates Act, 1961 & Bar Council of India Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            Advocate Guide & Professional Ethics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Understand the distinction between lawyers, advocates, Senior Advocates, and Advocates-on-Record (AoR), along with statutory fiduciary duties and ethical mandates under the Bar Council of India.
          </p>
        </div>

        {/* Roles Comparison Table */}
        <div className="bg-[#131924] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-200">
                Classification of Legal Practitioners in India
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory hierarchy under the Advocates Act, 1961 and Supreme Court Rules
              </p>
            </div>
            <button
              onClick={() => onAskQuery('What is the difference between a lawyer, an advocate, a Senior Advocate, and an Advocate on Record (AoR) in India?')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Comparison</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Educational Qualification</th>
                  <th className="p-4">Licensing & Examination</th>
                  <th className="p-4 text-amber-400">Right of Audience in Court</th>
                  <th className="p-4">Professional Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {roleComparison.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-100 text-sm">
                      {r.title}
                    </td>
                    <td className="p-4 text-slate-300">
                      {r.qualification}
                    </td>
                    <td className="p-4 text-slate-300">
                      {r.license}
                    </td>
                    <td className="p-4 text-amber-300 font-medium">
                      {r.rightOfAudience}
                    </td>
                    <td className="p-4 text-slate-400 leading-relaxed max-w-xs">
                      {r.scope}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ethical Standards & BCI Mandates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-100">
                Bar Council of India (BCI) Professional Ethics & Conduct
              </h2>
              <p className="text-xs text-slate-400">
                Mandatory rules governing an advocate's fiduciary relationship with clients, the court, and the public.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ethicsRules.map((eth, idx) => {
              const Icon = eth.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#131924] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100 mb-1">
                      {eth.title}
                    </h3>
                    <p className="text-[11px] text-amber-400/80 font-mono mb-2">
                      {eth.statute}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {eth.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800">
                    <button
                      onClick={() => onAskQuery(`Explain the ethical rule and case precedents on "${eth.title}" under BCI rules.`)}
                      className="text-amber-400 hover:text-amber-300 text-xs font-medium flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Ask AI Precedents</span>
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
