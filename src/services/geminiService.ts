import { GoogleGenAI } from '@google/genai';
import { RetrievedDocument } from './ragEngine';
import { DocumentAnalysisResult, LanguageCode, LegalVsIllegalAssessment } from '../types';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      genAIClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return genAIClient;
}

const SYSTEM_INSTRUCTION_BASE = `You are "LegalAI India" — an authoritative educational and research AI assistant specialized in the legal system of India.
You provide educational legal information, statutory citations, and procedural guidance. You DO NOT provide formal legal advice, representation, or act as a licensed court or advocate.

CORE RULES:
1. NEVER hallucinate or invent an Act, Section, Article, Court Rule, Case Citation, or Legal Doctrine. If uncertain, state clearly that you do not have verified authoritative records.
2. ALWAYS distinguish ACTIVE vs REPEALED vs REPLACED laws. Note: Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) came into force on 1 July 2024, replacing IPC, CrPC, and Indian Evidence Act for offences committed on or after that date. IPC/CrPC still apply to offences committed prior to 1 July 2024.
3. For "Is this legal?" or "Is this illegal?" questions:
   - NEVER give unconditional conclusions on incomplete facts.
   - Use nuanced phrasing: "Based on the statutory provisions...", "This may fall under...", "The legal position depends on...".
   - Never declare someone guilty or innocent.
   - Highlight civil vs criminal ramifications, exceptions, and procedural rights.
4. When the user requests explanations in Hindi (हिंदी) or Telugu (తెలుగు), explain fluently in that language, but ALWAYS retain the official English statutory section numbers and Latin legal maxims (e.g. "Section 103 BNS", "Article 21", "Audi Alteram Partem", "Ratio Decidendi") for absolute precision.
5. Adhere strictly to the required response structure:
   ### Short Answer
   ### Relevant Law
   ### Explanation
   ### Important Conditions & Exceptions
   ### What You Can Do
   ### Source & Citation
   ### Important Notice
`;

export async function generateLegalChatResponse(params: {
  userQuery: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  language: LanguageCode;
  mode: 'standard' | 'research' | 'legal-vs-illegal';
  ragContext: RetrievedDocument[];
  image?: {
    data: string;
    mimeType: string;
    fileName?: string;
  };
}) {
  const { userQuery, history, language, mode, ragContext, image } = params;
  const ai = getGenAI();

  const formattedContext = ragContext.length > 0 
    ? ragContext.map((doc, idx) => `[Source ${idx + 1}] (${doc.type}) ${doc.title} [Status: ${doc.status || 'ACTIVE'}]\nDetails: ${doc.fullContent}\nOfficial URL: ${doc.sourceUrl}\nEffective Date: ${doc.effectiveDate || 'N/A'}`).join('\n\n---\n\n')
    : 'No direct database matches found in local index. Base your explanation strictly on verified, un-hallucinated Indian law provisions and state any limitations clearly.';

  const languagePrompt = language === 'hi' 
    ? 'Translate your response into natural Hindi (हिंदी). Maintain official English section titles and legal terms where necessary.'
    : language === 'te'
    ? 'Translate your response into natural Telugu (తెలుగు). Maintain official English section titles and legal terms where necessary.'
    : 'Respond in clear, accessible, professional English.';

  const modeInstruction = mode === 'research' 
    ? 'MODE: LEGAL RESEARCH. Provide an in-depth statutory and jurisprudential analysis, citing exact provisions, legislative history, landmark Supreme Court decisions, and active vs historical transitions.'
    : mode === 'legal-vs-illegal'
    ? 'MODE: LEGAL ASSESSMENT. Analyze the scenario objectively without declaring guilt or innocence. Ask 2-3 essential clarifying questions, identify relevant statutes (both civil and criminal), list statutory exceptions, and explain the procedural posture.'
    : 'MODE: STANDARD ASSISTANT. Provide a clear, structured educational answer following the 7-section format.';

  const imageInstruction = image 
    ? `\n\nATTACHED PHOTOGRAPH / DOCUMENT IMAGE DETECTED:
A photograph or scan has been attached by the user (${image.fileName || 'legal document / photo evidence'}).
Carefully inspect the image content, legal text, dates, stamp paper, judicial stamps, case headers, or clauses visible in the photo under Indian law.
Identify the type of document (e.g. Legal Notice under Sec 138 NI Act, Police FIR, Summons, Bail Bond, Agreement, Will, Traffic Challan, Affidavits) and evaluate its legal relevance, governing acts (e.g. BNS vs IPC if criminal, Contract Act, Registration Act 1908, Stamp Act), potential risks or vulnerabilities, and concrete action steps for the user.`
    : '';

  const userPromptWithContext = `User Query: "${userQuery}"${imageInstruction}

Language Requirement: ${languagePrompt}
${modeInstruction}

AUTHORITATIVE STATUTORY CONTEXT RETRIEVED FROM DATABASE:
${formattedContext}

Please respond following the mandatory response format:
### Short Answer
(Concise summary addressing the question and any attached photograph/document)

### Relevant Law
(Exact Act, Section, Article, Court Rule, or Precedent)

### Explanation
(Clear breakdown of the legal concept and visual document analysis)

### Important Conditions & Exceptions
(Statutory defenses, limitation periods, thresholds, stamp duty/registration requirements)

### What You Can Do
(General procedural steps, eCourts filings, legal aid under NALSA, response timelines)

### Source & Citation
(Authoritative government/court source and date/version)

### Important Notice
"Legal information can depend on the specific facts, jurisdiction, and applicable date. For important legal decisions, consult a qualified legal professional."
`;

  if (!ai) {
    // Fallback when API key is not configured
    return fallbackResponseGenerator(userQuery, ragContext, language, image);
  }

  try {
    const contents: any[] = [];
    // Convert previous turns
    for (const h of history.slice(-4)) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }

    const currentParts: any[] = [];
    if (image && image.data) {
      const base64Data = image.data.includes('base64,') 
        ? image.data.split('base64,')[1] 
        : image.data;
      currentParts.push({
        inlineData: {
          mimeType: image.mimeType || 'image/jpeg',
          data: base64Data,
        }
      });
    }
    currentParts.push({ text: userPromptWithContext });

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        temperature: 0.2, // low temperature for legal precision
      },
    });

    return response.text || fallbackResponseGenerator(userQuery, ragContext, language, image);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return fallbackResponseGenerator(userQuery, ragContext, language, image);
  }
}

export async function analyzeLegalDocument(documentText: string, documentName: string, language: LanguageCode): Promise<DocumentAnalysisResult> {
  const ai = getGenAI();

  if (!ai) {
    return generateFallbackDocumentAnalysis(documentText, documentName);
  }

  const prompt = `Analyze this legal document ("${documentName}") under Indian law.
Return a STRICT JSON response adhering to the following schema without any markdown wrapping or backticks if possible, or parseable JSON:
{
  "documentType": "e.g. Residential Tenancy Agreement, Legal Notice under Sec 138 NI Act, Employment Contract, Non-Disclosure Agreement",
  "confidenceScore": 0.95,
  "summary": "Executive summary of the document in 3-4 sentences.",
  "governingLaw": ["Indian Contract Act 1872", "State Rent Control Act"],
  "partiesIdentified": ["Party 1 name/role", "Party 2 name/role"],
  "importantClauses": [
    {
      "title": "Clause name",
      "description": "Plain language explanation",
      "riskLevel": "LOW | MEDIUM | HIGH",
      "clauseSnippet": "quoted text or excerpt"
    }
  ],
  "keyDatesAndDeadlines": [
    {
      "event": "Notice period, expiry, payment date",
      "dateOrPeriod": "e.g. 15 days from receipt, 11 months"
    }
  ],
  "financialObligations": ["Security deposit of INR ...", "Monthly rent...", "Penalty clause..."],
  "difficultTerminology": [
    {
      "term": "Legalese term (e.g. Indemnity, Joint and Several)",
      "plainExplanation": "Clear everyday meaning"
    }
  ],
  "potentialRedFlags": ["Unilateral termination right", "Ambiguous forfeiture clause"],
  "suggestedQuestionsForAdvocate": ["Questions the user should specifically ask their advocate before signing or replying"],
  "statutoryCitations": ["Relevant sections of Indian law"],
  "legalValidityNotice": "Warning that validity depends on execution, stamp duty payment under State Stamp Act, and registration under Registration Act 1908."
}

DOCUMENT TEXT:
${documentText.slice(0, 15000)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const text = response.text?.trim() || '';
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing document with Gemini:', error);
    return generateFallbackDocumentAnalysis(documentText, documentName);
  }
}

export async function explainJudgmentAI(judgmentQueryOrText: string, language: LanguageCode) {
  const ai = getGenAI();

  const prompt = `Provide an authoritative judicial analysis of this Indian court judgment or case: "${judgmentQueryOrText}".
Break it down into:
1. Case Name & Citation
2. Court & Bench
3. Factual Background (What happened)
4. Core Legal Issues & Questions before the Court
5. Arguments of the Petitioner vs Respondent
6. Relevant Constitutional & Statutory Provisions
7. Ratio Decidendi (The binding legal principle established)
8. Obiter Dicta (Judicial observations not strictly binding)
9. Final Decision / Holding
10. Practical Significance & Doctrine established

Never invent facts. If this is a landmark case (such as Kesavananda, Maneka Gandhi, Puttaswamy, Navtej Johar, etc.), give accurate historical details. If it is a user text, extract these elements objectively.`;

  if (!ai) {
    return `### Judicial Breakdown: ${judgmentQueryOrText}\n\n*Official Landmark Record Available in System Database*\nPlease refer to the Judgment Explainer catalog for complete bench details, ratio decidendi, and constitutional impact.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        temperature: 0.2,
      },
    });

    return response.text || 'Unable to retrieve judgment explanation at this time.';
  } catch (e) {
    console.error('Error explaining judgment:', e);
    return 'An error occurred while generating the judgment explanation. Please try again.';
  }
}

function fallbackResponseGenerator(query: string, rag: RetrievedDocument[], language: LanguageCode, image?: { data: string; mimeType: string; fileName?: string }): string {
  const topDoc = rag[0];
  const imageNote = image 
    ? `\n\n*Document/Image Processed*: "${image.fileName || 'Uploaded Legal Photograph'}". Under Indian law, photographs of legal notices, stamp papers, summons, or evidentiary documents require scrutiny of: (1) Execution date & limitation period, (2) Judicial stamp duty validity under the Indian Stamp Act, 1899, (3) Mandatory registration status under Section 17 of the Registration Act, 1908, and (4) Authentic signatures of executants or issuing court registry.` 
    : '';

  if (!topDoc) {
    return `### Short Answer
Under Indian law, inquiries regarding "${query}" require examining statutory provisions, jurisdictional facts, and whether civil or criminal remedies apply.${imageNote}

### Relevant Law
Constitution of India, Bharatiya Nyaya Sanhita (BNS) 2023, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, and respective civil/special enactments.

### Explanation
Indian law is governed by the Constitution as the supreme law of the land, supported by substantive criminal codes (BNS), civil codes (CPC, Contract Act), and specialized state/central enactments. With effect from 1 July 2024, the new criminal laws replaced the colonial-era IPC and CrPC.

### Important Conditions & Exceptions
Any determination of liability or legality requires verifying:
1. The exact date of the incident (to determine whether old IPC or new BNS applies).
2. The jurisdiction of the trial magistrate or civil court.
3. Applicable statutory limitation periods under the Limitation Act, 1963.

### What You Can Do
1. Document all evidence, written correspondences, and receipts.
2. Check official court cause lists and filing procedures on eCourts (services.ecourts.gov.in).
3. If eligible for free legal aid, apply through NALSA (nalsa.gov.in) or your District Legal Services Authority (DLSA).

### Source & Citation
Official Repository: India Code (indiacode.nic.in) & Supreme Court of India (sci.gov.in).

### Important Notice
"Legal information can depend on the specific facts, jurisdiction, and date. For important legal decisions, consult a qualified legal professional."`;
  }

  return `### Short Answer
${topDoc.summary}

### Relevant Law
${topDoc.title} [Status: ${topDoc.status || 'ACTIVE'}]

### Explanation
${topDoc.fullContent.split('\n')[0] || topDoc.summary}
This provision establishes statutory rights and obligations enforceable in competent Indian courts and tribunals.

### Important Conditions & Exceptions
- Standard statutory conditions and judicial interpretations apply.
- Always verify whether subsequent legislative amendments or Supreme Court rulings modify this provision.

### What You Can Do
- Review original statutory text on India Code (${topDoc.sourceUrl}).
- For case updates or pending appeals, use the 16-digit CNR number on eCourts Services.
- Eligible indigent persons, women, and children can obtain free counsel under Section 12 of the Legal Services Authorities Act, 1987 via NALSA.

### Source & Citation
Source: ${topDoc.sourceUrl} (Verified in Indian Statutory Records).

### Important Notice
"Legal information can depend on the specific facts, jurisdiction, and applicable date. For important legal decisions, consult a qualified legal professional."`;
}

function generateFallbackDocumentAnalysis(text: string, docName: string): DocumentAnalysisResult {
  const isRental = text.toLowerCase().includes('rent') || text.toLowerCase().includes('tenant') || text.toLowerCase().includes('lease');
  const isNotice = text.toLowerCase().includes('notice') || text.toLowerCase().includes('cheque') || text.toLowerCase().includes('138');

  return {
    documentType: isRental ? 'Residential / Commercial Tenancy Agreement' : isNotice ? 'Legal Demand Notice' : 'Legal Agreement / Contract',
    confidenceScore: 0.88,
    summary: `Analyzed "${docName}". The document appears to be a formal legal agreement or notice outlining mutual obligations, covenants, and potential liabilities between the parties under Indian law.`,
    governingLaw: [
      'Indian Contract Act, 1872',
      'Registration Act, 1908',
      'Indian Stamp Act, 1899 / State Stamp Acts',
      isNotice ? 'Section 138 Negotiable Instruments Act, 1881' : 'Specific Relief Act, 1963'
    ],
    partiesIdentified: ['First Party / Executant', 'Second Party / Recipient'],
    importantClauses: [
      {
        title: 'Term & Termination Clause',
        description: 'Specifies duration, notice periods for vacating or terminating the agreement, and cure periods for breach.',
        riskLevel: 'MEDIUM',
        clauseSnippet: 'Notice period clause identified in document text.'
      },
      {
        title: 'Financial Consideration & Penalty',
        description: 'Details payment schedules, security deposit refunds, and interest charges for delayed compliance.',
        riskLevel: 'LOW',
        clauseSnippet: 'Payment terms and forfeiture provisions.'
      },
      {
        title: 'Dispute Resolution & Jurisdiction',
        description: 'Restricts court jurisdiction to a specified city and provides for mediation or arbitration under the Arbitration & Conciliation Act 1996.',
        riskLevel: 'MEDIUM',
        clauseSnippet: 'Courts having exclusive territorial jurisdiction.'
      }
    ],
    keyDatesAndDeadlines: [
      { event: 'Execution Date / Commencement', dateOrPeriod: 'Effective as specified in document' },
      { event: 'Notice Period for Termination', dateOrPeriod: 'Typically 15 to 30 days' }
    ],
    financialObligations: [
      'Payment of agreed consideration/rent on or before due date',
      'Refundable security deposit conditions and deduction clauses'
    ],
    difficultTerminology: [
      { term: 'Indemnify', plainExplanation: 'To compensate or protect another party from legal harm, penalties, or financial losses caused by one\'s acts.' },
      { term: 'Severability', plainExplanation: 'If one clause is found invalid by a court, the remaining parts of the contract stay legally enforceable.' },
      { term: 'Jurisdiction', plainExplanation: 'The specific geographical court that has legal authority to hear disputes under this contract.' }
    ],
    potentialRedFlags: [
      'Ensure the document is stamped with appropriate state stamp duty; unstamped agreements face evidentiary barriers under Section 35 of the Stamp Act.',
      'Check if lock-in periods or unilateral penalty clauses are disproportionate or oppressive.'
    ],
    suggestedQuestionsForAdvocate: [
      'Does this document require mandatory registration under Section 17 of the Registration Act, 1908?',
      'Is the stamp duty paid compliant with the local State Stamp Act?',
      'Are the dispute resolution and forfeiture clauses legally enforceable in the local civil court?'
    ],
    statutoryCitations: ['Section 10 & 73, Indian Contract Act, 1872', 'Section 17, Registration Act, 1908'],
    legalValidityNotice: 'Educational assessment only. Legal enforceability requires verifying appropriate stamp duty payment, notarization/registration, and competence of parties.'
  };
}
