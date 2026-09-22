export type LegalStatus = 'ACTIVE' | 'AMENDED' | 'REPEALED' | 'REPLACED' | 'HISTORICAL';

export type LegalCategory = 
  | 'Constitutional'
  | 'Criminal'
  | 'Civil & Commercial'
  | 'Cyber & Data Privacy'
  | 'Consumer & Property'
  | 'Family & Personal'
  | 'Labour & Employment'
  | 'Procedure & Evidence'
  | 'Judiciary & Advocates'
  | 'Human Rights & Environment';

export type LanguageCode = 'en' | 'hi' | 'te';

export interface AuthoritativeSource {
  id: string;
  name: string;
  type: 'Government' | 'Supreme Court' | 'High Court' | 'eCourts' | 'Statutory Body' | 'Official Gazette';
  url: string;
  description: string;
  reliabilityRank: number;
}

export interface ConstitutionalArticle {
  id: string;
  articleNumber: string;
  title: string;
  part: string;
  category: string;
  originalTextSummary: string;
  currentTextSummary: string;
  keyAmendments?: string[];
  landmarkJudgments?: string[];
  status: LegalStatus;
  sourceUrl: string;
  effectiveDate: string;
  tags: string[];
}

export interface LegalSection {
  id: string;
  actId: string;
  actName: string;
  sectionNumber: string;
  title: string;
  chapter?: string;
  summary: string;
  fullProvisionOverview: string;
  punishmentOrRemedy?: string;
  exceptions?: string[];
  status: LegalStatus;
  replacedBy?: string; // e.g., IPC 302 -> BNS 103(1)
  replacesOld?: string; // e.g., BNS 103(1) -> IPC 302
  effectiveDate: string;
  sourceUrl: string;
  tags: string[];
}

export interface LegalAct {
  id: string;
  name: string;
  shortCode: string;
  year: number;
  category: LegalCategory;
  enactedBy: string;
  effectiveDate: string;
  status: LegalStatus;
  supersededByOrNotes?: string;
  overview: string;
  totalSectionsCount?: number;
  sourceUrl: string;
  keySections: string[]; // section numbers
}

export interface LandmarkJudgment {
  id: string;
  caseName: string;
  citation: string;
  year: number;
  court: 'Supreme Court of India' | 'High Court';
  bench: string;
  subject: string;
  facts: string;
  issues: string[];
  arguments: {
    petitioner?: string;
    respondent?: string;
  };
  relevantProvisions: string[];
  courtReasoning: string;
  ratioDecidendi: string;
  obiterDicta?: string;
  finalDecision: string;
  doctrineOrImpact: string;
  sourceUrl: string;
}

export interface CourtStructureItem {
  id: string;
  level: 'Apex' | 'State' | 'District' | 'Subordinate' | 'Tribunal';
  name: string;
  jurisdiction: string;
  head: string;
  powers: string[];
  appealRoute: string;
  filingProcedures: string[];
  eCourtsFeatures: string[];
  sourceUrl: string;
}

export interface DocumentAnalysisResult {
  documentType: string;
  confidenceScore: number;
  summary: string;
  governingLaw: string[];
  partiesIdentified: string[];
  importantClauses: Array<{
    title: string;
    description: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    clauseSnippet?: string;
  }>;
  keyDatesAndDeadlines: Array<{
    event: string;
    dateOrPeriod: string;
  }>;
  financialObligations: string[];
  difficultTerminology: Array<{
    term: string;
    plainExplanation: string;
  }>;
  potentialRedFlags: string[];
  suggestedQuestionsForAdvocate: string[];
  statutoryCitations: string[];
  legalValidityNotice: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  language?: LanguageCode;
  structuredAnswer?: {
    shortAnswer: string;
    relevantLaw: string;
    explanation: string;
    importantConditions: string;
    whatYouCanDo: string;
    source: string;
    sourceUrl?: string;
    disclaimer: string;
  };
  sourcesCited?: Array<{
    title: string;
    citation: string;
    url?: string;
    status?: LegalStatus;
    type?: string;
  }>;
  mode?: 'standard' | 'research' | 'legal-vs-illegal';
  clarifyingQuestions?: string[];
  attachedImage?: {
    data: string; // base64 data URL or pure base64
    mimeType: string;
    fileName?: string;
  };
  audioUrl?: string;
}

export interface LegalVsIllegalAssessment {
  scenario: string;
  clarifyingQuestions: string[];
  potentiallyApplicableLaws: Array<{
    act: string;
    section: string;
    status: LegalStatus;
    summary: string;
  }>;
  civilVsCriminalAspects: string;
  exceptionsAndDefenses: string[];
  legalUncertaintyFactors: string[];
  recommendedImmediateSteps: string[];
  officialSources: string[];
  disclaimer: string;
}
