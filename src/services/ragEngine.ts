import { 
  CONSTITUTIONAL_ARTICLES, 
  MAJOR_LEGAL_ACTS, 
  KEY_LEGAL_SECTIONS, 
  LANDMARK_JUDGMENTS, 
  COURT_SYSTEM_GUIDE 
} from '../data/legalDatabase';
import { 
  COURTROOM_ETIQUETTE, 
  ADVOCATE_ROLES, 
  BECOME_A_LAWYER_PATHWAY, 
  CNR_NUMBER_GUIDE, 
  LEGAL_AID_NALSA_GUIDE 
} from '../data/guidesData';

export interface RetrievedDocument {
  id: string;
  type: 'Constitutional Article' | 'Legal Section' | 'Legal Act' | 'Landmark Judgment' | 'Court Guide' | 'Advocate Guide' | 'Etiquette' | 'Statutory Procedure';
  title: string;
  citationOrNumber?: string;
  status?: string;
  summary: string;
  fullContent: string;
  sourceUrl: string;
  effectiveDate?: string;
  relevanceScore: number;
}

export function searchLegalKnowledgeBase(query: string, options?: {
  filterStatus?: string;
  category?: string;
  limit?: number;
}): RetrievedDocument[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/[\s,./\-]+/).filter(t => t.length > 2);
  const results: RetrievedDocument[] = [];
  const limit = options?.limit || 6;

  // 1. Search Constitutional Articles
  for (const art of CONSTITUTIONAL_ARTICLES) {
    let score = 0;
    const artNumLower = art.articleNumber.toLowerCase();
    const titleLower = art.title.toLowerCase();
    const tagMatch = art.tags.some(tag => normalizedQuery.includes(tag.toLowerCase()));

    if (normalizedQuery.includes(artNumLower) || normalizedQuery.includes(artNumLower.replace('article ', 'art '))) {
      score += 150;
    }
    if (tagMatch) score += 50;
    for (const token of queryTokens) {
      if (titleLower.includes(token)) score += 20;
      if (art.currentTextSummary.toLowerCase().includes(token)) score += 10;
    }

    if (score > 15) {
      results.push({
        id: art.id,
        type: 'Constitutional Article',
        title: `${art.articleNumber}: ${art.title}`,
        citationOrNumber: art.articleNumber,
        status: art.status,
        summary: art.currentTextSummary,
        fullContent: `Part: ${art.part}\nCategory: ${art.category}\nOriginal 1950 Scope: ${art.originalTextSummary}\nCurrent Position: ${art.currentTextSummary}\nKey Amendments: ${art.keyAmendments?.join('; ') || 'None'}\nLandmark Precedents: ${art.landmarkJudgments?.join(', ') || 'None'}`,
        sourceUrl: art.sourceUrl,
        effectiveDate: art.effectiveDate,
        relevanceScore: score,
      });
    }
  }

  // 2. Search Legal Sections
  for (const sec of KEY_LEGAL_SECTIONS) {
    let score = 0;
    const secNumLower = sec.sectionNumber.toLowerCase();
    const actNameLower = sec.actName.toLowerCase();
    const titleLower = sec.title.toLowerCase();

    if (normalizedQuery.includes(secNumLower) || normalizedQuery.includes(secNumLower.replace('section ', 'sec '))) {
      score += 120;
    }
    if (sec.replacesOld && normalizedQuery.includes(sec.replacesOld.toLowerCase())) {
      score += 100;
    }
    if (sec.replacedBy && normalizedQuery.includes(sec.replacedBy.toLowerCase())) {
      score += 80;
    }
    for (const token of queryTokens) {
      if (actNameLower.includes(token)) score += 20;
      if (titleLower.includes(token)) score += 25;
      if (sec.tags.some(t => t.toLowerCase() === token)) score += 30;
      if (sec.summary.toLowerCase().includes(token)) score += 10;
    }

    if (score > 15) {
      results.push({
        id: sec.id,
        type: 'Legal Section',
        title: `${sec.actName} — ${sec.sectionNumber}: ${sec.title}`,
        citationOrNumber: `${sec.sectionNumber}, ${sec.actName}`,
        status: sec.status,
        summary: sec.summary,
        fullContent: `Act: ${sec.actName} (${sec.status})\nChapter: ${sec.chapter || 'N/A'}\nProvision Overview: ${sec.fullProvisionOverview}\nPunishment/Remedy: ${sec.punishmentOrRemedy || 'N/A'}\nTransition/Replaces: ${sec.replacesOld ? `Replaces former ${sec.replacesOld}` : sec.replacedBy ? `Replaced by ${sec.replacedBy}` : 'Direct statutory provision'}\nExceptions: ${sec.exceptions?.join('; ') || 'Standard statutory conditions apply.'}`,
        sourceUrl: sec.sourceUrl,
        effectiveDate: sec.effectiveDate,
        relevanceScore: score,
      });
    }
  }

  // 3. Search Major Legal Acts
  for (const act of MAJOR_LEGAL_ACTS) {
    let score = 0;
    const nameLower = act.name.toLowerCase();
    const codeLower = act.shortCode.toLowerCase();

    if (normalizedQuery.includes(codeLower) || normalizedQuery.includes(nameLower)) {
      score += 100;
    }
    for (const token of queryTokens) {
      if (nameLower.includes(token)) score += 25;
      if (act.overview.toLowerCase().includes(token)) score += 10;
    }

    if (score > 15) {
      results.push({
        id: act.id,
        type: 'Legal Act',
        title: act.name,
        citationOrNumber: act.shortCode,
        status: act.status,
        summary: act.overview,
        fullContent: `Status: ${act.status} (Effective: ${act.effectiveDate})\nTransition Notes: ${act.supersededByOrNotes || 'Active law'}\nOverview: ${act.overview}\nKey Sections: ${act.keySections.join(', ')}`,
        sourceUrl: act.sourceUrl,
        effectiveDate: act.effectiveDate,
        relevanceScore: score,
      });
    }
  }

  // 4. Search Landmark Judgments
  for (const judgment of LANDMARK_JUDGMENTS) {
    let score = 0;
    const caseNameLower = judgment.caseName.toLowerCase();
    const subjectLower = judgment.subject.toLowerCase();

    if (normalizedQuery.includes(judgment.caseName.split(' v.')[0].toLowerCase())) {
      score += 140;
    }
    for (const token of queryTokens) {
      if (caseNameLower.includes(token)) score += 30;
      if (subjectLower.includes(token)) score += 20;
      if (judgment.ratioDecidendi.toLowerCase().includes(token)) score += 15;
    }

    if (score > 15) {
      results.push({
        id: judgment.id,
        type: 'Landmark Judgment',
        title: judgment.caseName,
        citationOrNumber: judgment.citation,
        status: 'ACTIVE',
        summary: judgment.ratioDecidendi,
        fullContent: `Court: ${judgment.court} (${judgment.bench})\nYear: ${judgment.year}\nCitation: ${judgment.citation}\nSubject: ${judgment.subject}\nFacts: ${judgment.facts}\nKey Issues: ${judgment.issues.join('; ')}\nCourt Reasoning: ${judgment.courtReasoning}\nRatio Decidendi: ${judgment.ratioDecidendi}\nFinal Decision: ${judgment.finalDecision}\nDoctrine/Impact: ${judgment.doctrineOrImpact}`,
        sourceUrl: judgment.sourceUrl,
        effectiveDate: judgment.year.toString(),
        relevanceScore: score,
      });
    }
  }

  // 5. Search Court Guides & Judicial Workflow
  for (const court of COURT_SYSTEM_GUIDE) {
    let score = 0;
    const nameLower = court.name.toLowerCase();
    for (const token of queryTokens) {
      if (nameLower.includes(token)) score += 30;
      if (court.powers.some(p => p.toLowerCase().includes(token))) score += 15;
    }
    if (score > 15) {
      results.push({
        id: court.id,
        type: 'Court Guide',
        title: court.name,
        citationOrNumber: court.level,
        status: 'ACTIVE',
        summary: `Jurisdiction: ${court.jurisdiction}. Head: ${court.head}`,
        fullContent: `Powers: ${court.powers.join('; ')}\nAppeal Route: ${court.appealRoute}\nFiling Procedure: ${court.filingProcedures.join('; ')}\neCourts Tools: ${court.eCourtsFeatures.join(', ')}`,
        sourceUrl: court.sourceUrl,
        relevanceScore: score,
      });
    }
  }

  // 6. Search Courtroom Etiquette
  for (const item of COURTROOM_ETIQUETTE) {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    if (normalizedQuery.includes('etiquette') || normalizedQuery.includes('dress') || normalizedQuery.includes('behave') || normalizedQuery.includes('address')) {
      score += 40;
    }
    for (const token of queryTokens) {
      if (titleLower.includes(token)) score += 20;
    }
    if (score > 15) {
      results.push({
        id: item.title.replace(/\s+/g, '-').toLowerCase(),
        type: 'Etiquette',
        title: item.title,
        status: 'ACTIVE',
        summary: item.summary,
        fullContent: `Court Scope: ${item.courtTypeOrScope}\nGeneral vs Court-Specific: ${item.isCourtSpecific ? 'Court-Specific Rule' : 'Universal Judicial Etiquette'}\nRules: ${item.rules.join('\n')}\nDos: ${item.doAndDonts.dos.join('; ')}\nDonts: ${item.doAndDonts.donts.join('; ')}`,
        sourceUrl: 'http://www.barcouncilofindia.org',
        relevanceScore: score,
      });
    }
  }

  // 7. Search Advocate Guide & Career Pathway
  if (normalizedQuery.includes('become a lawyer') || normalizedQuery.includes('become an advocate') || normalizedQuery.includes('aibe') || normalizedQuery.includes('llb') || normalizedQuery.includes('clat')) {
    results.push({
      id: 'guide-become-advocate',
      type: 'Advocate Guide',
      title: 'How to Become an Advocate in India (Current Pathway)',
      citationOrNumber: 'Advocates Act 1961 & BCI Rules',
      status: 'ACTIVE',
      summary: 'Detailed statutory roadmap from high school/graduation through LL.B, State Bar Council provisional enrollment, AIBE examination, and Certificate of Practice (CoP).',
      fullContent: BECOME_A_LAWYER_PATHWAY.map(step => `Step ${step.stepNumber} [${step.stage}]: ${step.title} (${step.duration})\nDescription: ${step.description}\nRequirements: ${step.requirements.join('; ')}\nSource: ${step.authoritativeSource} (Checked: ${step.lastCheckedDate})`).join('\n\n'),
      sourceUrl: 'http://www.barcouncilofindia.org',
      effectiveDate: '2024-07-01',
      relevanceScore: 160,
    });
  }

  if (normalizedQuery.includes('cnr') || normalizedQuery.includes('case status') || normalizedQuery.includes('cause list') || normalizedQuery.includes('track case')) {
    results.push({
      id: 'guide-cnr-number',
      type: 'Statutory Procedure',
      title: CNR_NUMBER_GUIDE.title,
      citationOrNumber: 'eCourts 16-Digit CNR',
      status: 'ACTIVE',
      summary: CNR_NUMBER_GUIDE.explanation,
      fullContent: `Example: ${CNR_NUMBER_GUIDE.exampleFormat}\nBreakdown:\n${CNR_NUMBER_GUIDE.breakdown.map(b => `- ${b.code}: ${b.meaning}`).join('\n')}\nSearch Instructions:\n${CNR_NUMBER_GUIDE.howToSearch.join('\n')}`,
      sourceUrl: 'https://services.ecourts.gov.in',
      relevanceScore: 170,
    });
  }

  if (normalizedQuery.includes('legal aid') || normalizedQuery.includes('free lawyer') || normalizedQuery.includes('nalsa') || normalizedQuery.includes('indigent')) {
    results.push({
      id: 'guide-legal-aid-nalsa',
      type: 'Statutory Procedure',
      title: LEGAL_AID_NALSA_GUIDE.title,
      citationOrNumber: 'Sec 12, Legal Services Authorities Act 1987',
      status: 'ACTIVE',
      summary: 'Statutory framework for free legal services across India.',
      fullContent: `Statutory Basis: ${LEGAL_AID_NALSA_GUIDE.statutoryBasis}\nEligible Persons:\n${LEGAL_AID_NALSA_GUIDE.whoIsEligible.map(e => `- ${e}`).join('\n')}\nServices Covered:\n${LEGAL_AID_NALSA_GUIDE.servicesProvided.map(s => `- ${s}`).join('\n')}\nHow to Apply:\n${LEGAL_AID_NALSA_GUIDE.howToApply.join('\n')}`,
      sourceUrl: 'https://nalsa.gov.in',
      relevanceScore: 160,
    });
  }

  // Sort descending by relevanceScore
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top results
  return results.slice(0, limit);
}
