import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  HelpCircle, 
  BookOpen, 
  Copy, 
  Check, 
  FileSearch,
  Scale
} from 'lucide-react';
import { DocumentAnalysisResult, LanguageCode } from '../types';

interface DocumentAnalyzerViewProps {
  language: LanguageCode;
  onAskDocQuery: (query: string) => void;
}

export const DocumentAnalyzerView: React.FC<DocumentAnalyzerViewProps> = ({ language, onAskDocQuery }) => {
  const [docText, setDocText] = useState('');
  const [docName, setDocName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleTemplates = [
    {
      name: 'Residential Tenancy Agreement (11 Months)',
      text: `RENT AGREEMENT
This Rent Agreement is made and executed on this 1st day of October 2024 at New Delhi between:
Mr. Ramesh Sharma, resident of Flat 402, Lotus Apartments, Saket, New Delhi (hereinafter called the "LESSOR / LANDLORD") of the FIRST PART;
AND
Ms. Ananya Roy, resident of Bangalore, currently working in Gurgaon (hereinafter called the "LESSEE / TENANT") of the SECOND PART.

WHEREAS the Lessor is the lawful owner of Flat No. 101, Saket, New Delhi.
NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:
1. TENURE: The tenancy shall be for a period of 11 (eleven) months commencing from 1st October 2024 to 31st August 2025.
2. MONTHLY RENT: The Lessee shall pay a monthly rent of INR 35,000/- (Thirty Five Thousand only) in advance on or before the 7th day of each English calendar month.
3. SECURITY DEPOSIT: The Lessee has deposited an interest-free refundable security deposit of INR 70,000/- (Rupees Seventy Thousand only) with the Lessor. The deposit shall be refunded upon vacating the premises, subject to deductions for damages or unpaid utilities.
4. TERMINATION & NOTICE: Either party may terminate this agreement by giving 1 (one) month's prior written notice or one month's rent in lieu thereof.
5. LOCK-IN PERIOD: Both parties agree to a lock-in period of 6 months. In case the Tenant vacates before 6 months, the entire security deposit shall stand forfeited.
6. INDEMNITY: The Lessee shall indemnify the Lessor against any fines, claims, or damages arising out of illegal activities on the premises.
7. JURISDICTION: Courts at New Delhi shall have exclusive jurisdiction over any disputes arising out of this agreement.`
    },
    {
      name: 'Legal Demand Notice under Section 138 NI Act',
      text: `LEGAL NOTICE
BY REGISTERED POST WITH ACKNOWLEDGEMENT DUE (RPAD) & SPEED POST
Date: 15th November 2024

To:
M/s Apex Global Traders Pvt. Ltd.
Through its Managing Director, Mr. Rajesh Verma
Nariman Point, Mumbai - 400021

Under instructions and authority on behalf of our client, M/s Shanti Logistics, we hereby serve upon you this Statutory Legal Demand Notice under Section 138 of the Negotiable Instruments Act, 1881:

1. That you, the Noticee, issued a Cheque bearing No. 445210 dated 28th October 2024 for an amount of INR 12,50,000/- (Twelve Lakh Fifty Thousand only) drawn on HDFC Bank in discharge of your legally enforceable debt towards logistics invoices.
2. That upon presentation by our client through State Bank of India, the said cheque was dishonoured and returned unpaid vide Bank Memo dated 3rd November 2024 with the remarks "FUNDS INSUFFICIENT".
3. That by dishonouring the said cheque issued towards existing debt, you have committed an offence punishable under Section 138 read with Section 141 of the Negotiable Instruments Act, 1881.
4. WE THEREFORE CALL UPON YOU to pay the said sum of INR 12,50,000/- to our client within 15 (FIFTEEN) DAYS of the receipt of this notice, failing which our client shall institute criminal complaint under Section 138 of the NI Act before the competent Judicial Magistrate / Metropolitan Magistrate at Mumbai, holding you liable for imprisonment up to 2 years and fine up to twice the cheque amount.`
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setDocText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRunAnalysis = async () => {
    if (!docText.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/document/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docText,
          documentName: docName || 'Pasted Legal Document',
          language,
        }),
      });

      if (!res.ok) throw new Error('Analysis request failed');
      const data = await res.json();
      setAnalysisResult(data);
    } catch (e: any) {
      console.error(e);
      alert('Error analyzing legal document. Please check your text.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!analysisResult) return;
    const summary = `DOCUMENT ANALYSIS: ${analysisResult.documentType}\n${analysisResult.summary}\n\nKEY CLAUSES:\n${analysisResult.importantClauses?.map(c => `[${c.riskLevel}] ${c.title}: ${c.description}`).join('\n')}\n\nRED FLAGS:\n${analysisResult.potentialRedFlags?.join('\n')}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>AI Legal Document & Contract Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight">
            Legal Document & Contract Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Upload or paste any agreement, lease, legal notice, employment contract, or petition. LegalAI India simplifies legal jargon, extracts financial obligations and deadlines, flags potential risks, and prepares essential questions to ask your advocate.
          </p>
        </div>

        {/* Input & Upload Workspace */}
        <div className="bg-[#131924] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Document Text Input
              </span>
              {docName && (
                <span className="text-xs font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {docName}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          {/* Sample template quick loaders */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 overflow-x-auto pb-1">
            <span className="text-[11px] shrink-0">Try Sample Templates:</span>
            {sampleTemplates.map((tpl, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDocName(tpl.name);
                  setDocText(tpl.text);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-[11px] shrink-0 transition-colors"
              >
                {tpl.name}
              </button>
            ))}
          </div>

          <textarea
            rows={8}
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            placeholder="Paste agreement text, clause, tenancy agreement, or Section 138 notice here..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-xs sm:text-sm font-mono text-slate-200 placeholder-slate-500 focus:outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              {docText.length} characters • Analyzed strictly under Indian contract & statutory law
            </span>
            <button
              onClick={handleRunAnalysis}
              disabled={isLoading || !docText.trim()}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 transition-all ${
                isLoading || !docText.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Analyzing Provisions...' : 'Analyze Document with AI'}</span>
            </button>
          </div>
        </div>

        {/* Analysis Results Display */}
        {analysisResult && (
          <div className="bg-[#131924] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in duration-200">
            {/* Top Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-serif font-bold text-amber-200">
                    {analysisResult.documentType}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                    {Math.round((analysisResult.confidenceScore || 0.9) * 100)}% Match
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 mt-1">
                  <span>Parties: {analysisResult.partiesIdentified?.join(' & ') || 'Executants'}</span>
                  <span>•</span>
                  <span className="text-amber-300">Governing Law: {analysisResult.governingLaw?.join(', ')}</span>
                </div>
              </div>

              <button
                onClick={handleCopyAnalysis}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 self-start sm:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Analysis'}</span>
              </button>
            </div>

            {/* Plain English Executive Summary */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-xs text-amber-300 uppercase tracking-wider block">
                Executive Plain-Language Summary:
              </strong>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>

            {/* Important Clauses & Risk Categorization */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <FileSearch className="w-4 h-4 text-amber-400" />
                <span>Extracted Key Clauses & Risk Assessment</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.importantClauses?.map((clause, cIdx) => {
                  const isHigh = clause.riskLevel === 'HIGH';
                  const isMed = clause.riskLevel === 'MEDIUM';
                  return (
                    <div
                      key={cIdx}
                      className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-xs text-slate-100 font-semibold">{clause.title}</strong>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            isHigh 
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800' 
                              : isMed 
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800' 
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          }`}>
                            {clause.riskLevel} Risk
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{clause.description}</p>
                      </div>

                      {clause.clauseSnippet && (
                        <div className="font-mono text-[10px] bg-slate-950/80 p-2 rounded text-slate-400 mt-2 border border-slate-800/80 italic">
                          "{clause.clauseSnippet}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Red Flags & Legalese Decoded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Potential Red Flags */}
              <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Potential Red Flags & Statutory Risks</span>
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-300">
                  {analysisResult.potentialRedFlags?.map((rf, rIdx) => (
                    <li key={rIdx}>{rf}</li>
                  ))}
                </ul>
              </div>

              {/* Jargon Translation */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Difficult Legal Jargon Explained</span>
                </div>
                <div className="space-y-2 text-xs">
                  {analysisResult.difficultTerminology?.map((term, tIdx) => (
                    <div key={tIdx} className="bg-slate-950/50 p-2 rounded border border-slate-800">
                      <strong className="text-amber-200">{term.term}:</strong>{' '}
                      <span className="text-slate-300">{term.plainExplanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions to Ask Your Advocate */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Recommended Questions to Ask Your Advocate Before Signing</span>
              </div>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-200">
                {analysisResult.suggestedQuestionsForAdvocate?.map((q, qIdx) => (
                  <li key={qIdx}>
                    <button
                      onClick={() => onAskDocQuery(`Regarding this document (${analysisResult.documentType}), explain: ${q}`)}
                      className="text-left hover:text-amber-200 underline decoration-slate-600 hover:decoration-amber-400 transition-colors"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Statutory Validity Notice */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
              <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-300">Enforceability Requirement:</strong> In India, the legal validity of contracts and notices depends on adequate stamp duty payment under the Indian Stamp Act / State Stamp Acts, and mandatory registration under Section 17 of the Registration Act, 1908 (where applicable).
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
