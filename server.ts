import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { 
  searchLegalKnowledgeBase 
} from './src/services/ragEngine';
import { 
  generateLegalChatResponse, 
  analyzeLegalDocument, 
  explainJudgmentAI 
} from './src/services/geminiService';
import { 
  CONSTITUTIONAL_ARTICLES, 
  MAJOR_LEGAL_ACTS, 
  KEY_LEGAL_SECTIONS, 
  LANDMARK_JUDGMENTS, 
  AUTHORITATIVE_SOURCES,
  COURT_SYSTEM_GUIDE
} from './src/data/legalDatabase';
import { 
  COURTROOM_ETIQUETTE, 
  ADVOCATE_ROLES, 
  BECOME_A_LAWYER_PATHWAY, 
  CNR_NUMBER_GUIDE, 
  LEGAL_AID_NALSA_GUIDE 
} from './src/data/guidesData';
import { LanguageCode } from './src/types';

dotenv.config();

// In-memory writable extensions for Admin operations
let customArticles = [...CONSTITUTIONAL_ARTICLES];
let customSections = [...KEY_LEGAL_SECTIONS];
let customActs = [...MAJOR_LEGAL_ACTS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with 50MB limit for legal documents and PDFs
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'LegalAI India API',
      timestamp: new Date().toISOString(),
      activeCriminalLaws: 'Bharatiya Nyaya Sanhita (BNS 2023) active from 1 July 2024'
    });
  });

  // 1. Interactive Legal Chat with RAG (supports text, voice transcription, and document/camera photos)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [], language = 'en', mode = 'standard', image } = req.body;

      const hasText = message && typeof message === 'string' && message.trim().length > 0;
      const hasImage = image && image.data && typeof image.data === 'string' && image.data.length > 0;

      if (!hasText && !hasImage) {
        return res.status(400).json({ error: 'Please provide a message or an image to analyze.' });
      }

      const effectiveQuery = hasText 
        ? message.trim() 
        : (hasImage ? 'Please analyze this attached legal document / photo under Indian law. Explain its legal nature, key clauses, validity, governing statutes, and what actions are recommended.' : '');

      // RAG step: retrieve authoritative documents
      const ragResults = searchLegalKnowledgeBase(effectiveQuery, { limit: 5 });

      // LLM generation with retrieved legal citations and optional multimodal image
      const reply = await generateLegalChatResponse({
        userQuery: effectiveQuery,
        history,
        language: language as LanguageCode,
        mode,
        ragContext: ragResults,
        image: hasImage ? image : undefined,
      });

      // Extract clarifying questions if in legal-vs-illegal mode
      let clarifyingQuestions: string[] = [];
      if (mode === 'legal-vs-illegal' || message.toLowerCase().includes('is this legal') || message.toLowerCase().includes('is this illegal')) {
        clarifyingQuestions = [
          'What was the specific date of this occurrence (determines BNS vs IPC applicability)?',
          'Did any monetary exchange, written agreement, or electronic messages occur between the parties?',
          'Has a formal complaint or FIR been lodged at any local police station or before a magistrate?'
        ];
      }

      res.json({
        reply,
        sources: ragResults.map(r => ({
          title: r.title,
          citation: r.citationOrNumber,
          type: r.type,
          status: r.status,
          summary: r.summary,
          url: r.sourceUrl,
          effectiveDate: r.effectiveDate,
        })),
        clarifyingQuestions,
        mode,
        language,
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error.message || 'Internal server error during legal chat generation.' });
    }
  });

  // 2. Comprehensive Legal Search
  app.post('/api/search', (req, res) => {
    try {
      const { query, filterStatus, category, limit = 10 } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const results = searchLegalKnowledgeBase(query, { filterStatus, category, limit });
      res.json({ results });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. Document Analyzer
  app.post('/api/document/analyze', async (req, res) => {
    try {
      const { documentText, documentName = 'Uploaded Legal Document', language = 'en' } = req.body;
      if (!documentText || documentText.trim().length === 0) {
        return res.status(400).json({ error: 'Document text is required for analysis.' });
      }

      const analysis = await analyzeLegalDocument(documentText, documentName, language as LanguageCode);
      res.json(analysis);
    } catch (error: any) {
      console.error('Document analysis error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 4. Judgment Explainer
  app.post('/api/judgment/explain', async (req, res) => {
    try {
      const { query, language = 'en' } = req.body;
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ error: 'Case name, citation, or judgment text is required.' });
      }

      // Check if matches a curated landmark judgment
      const normalizedQuery = query.toLowerCase();
      const existingLandmark = LANDMARK_JUDGMENTS.find(j => 
        normalizedQuery.includes(j.caseName.toLowerCase().split(' v.')[0]) ||
        j.caseName.toLowerCase().includes(normalizedQuery) ||
        j.citation.toLowerCase().includes(normalizedQuery)
      );

      const aiExplanation = await explainJudgmentAI(query, language as LanguageCode);

      res.json({
        matchedLandmark: existingLandmark || null,
        aiExplanation,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 5. Legal vs Illegal Scenario Assessment
  app.post('/api/legal-vs-illegal', (req, res) => {
    try {
      const { scenario } = req.body;
      if (!scenario || scenario.trim().length === 0) {
        return res.status(400).json({ error: 'Scenario description is required.' });
      }

      const rag = searchLegalKnowledgeBase(scenario, { limit: 4 });
      const lower = scenario.toLowerCase();

      // Determine civil vs criminal aspects
      const isCriminal = lower.includes('cheat') || lower.includes('threat') || lower.includes('hit') || lower.includes('steal') || lower.includes('cyber') || lower.includes('hack') || lower.includes('kill') || lower.includes('police');
      const isCivil = lower.includes('contract') || lower.includes('agreement') || lower.includes('rent') || lower.includes('tenant') || lower.includes('money') || lower.includes('cheque') || lower.includes('property');

      res.json({
        scenario,
        clarifyingQuestions: [
          'What is the exact chronological timeline of events, and did any written agreement exist?',
          'Did the act occur before or after 1 July 2024 (determines BNS vs IPC, or BNSS vs CrPC)?',
          'Was any financial loss, physical harm, or digital data breach caused to either party?'
        ],
        potentiallyApplicableLaws: rag.map(r => ({
          act: r.title,
          section: r.citationOrNumber || 'General Provision',
          status: r.status || 'ACTIVE',
          summary: r.summary,
        })),
        civilVsCriminalAspects: isCriminal && isCivil 
          ? 'This matter exhibits both civil and criminal dimensions. A civil suit for damages/specific performance may lie alongside criminal proceedings if dishonest intent was present ab initio.'
          : isCriminal
          ? 'Primary remedies lie in criminal law before a Judicial Magistrate or by lodging a complaint under Section 173 BNSS (Zero FIR).'
          : 'Primarily a civil dispute governed by civil jurisprudence (Contract Act / CPC / Consumer Commission).',
        exceptionsAndDefenses: [
          'Lack of mens rea (guilty intention) for criminal charges unless strict liability applies.',
          'Doctrine of Frustration (Section 56 Contract Act) for unperformed contractual obligations.',
          'Statutory limitation periods under the Limitation Act, 1963.'
        ],
        legalUncertaintyFactors: [
          'Judicial determination depends strictly on witness testimonies, documentary proof, and cross-examination.',
          'Local State amendments or jurisdictional High Court precedents may apply.'
        ],
        recommendedImmediateSteps: [
          'Preserve all relevant digital records, emails, invoices, bank statements, and WhatsApp messages.',
          'Do not sign any unilateral settlement or confession without counsel present.',
          'Consult a practicing advocate in your jurisdiction for personalized representation.'
        ],
        officialSources: [
          'India Code (indiacode.nic.in)',
          'eCourts Services (services.ecourts.gov.in)'
        ],
        disclaimer: 'Legal information can depend on the specific facts, jurisdiction, and date. For important legal decisions, consult a qualified legal professional.'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 6. Knowledge Repository Data & Admin Endpoints
  app.get('/api/knowledge/stats', (req, res) => {
    res.json({
      totalArticles: customArticles.length,
      totalActs: customActs.length,
      totalSections: customSections.length,
      totalJudgments: LANDMARK_JUDGMENTS.length,
      activeLawsCount: customActs.filter(a => a.status === 'ACTIVE').length + customSections.filter(s => s.status === 'ACTIVE').length,
      repealedCount: customActs.filter(a => a.status === 'REPEALED').length + customSections.filter(s => s.status === 'REPEALED').length,
      sourcesCount: AUTHORITATIVE_SOURCES.length,
      lastUpdated: new Date().toISOString().split('T')[0],
      currentCriminalFramework: 'BNS, BNSS, BSA (Effective 1 July 2024)'
    });
  });

  app.get('/api/knowledge/all', (req, res) => {
    res.json({
      articles: customArticles,
      acts: customActs,
      sections: customSections,
      judgments: LANDMARK_JUDGMENTS,
      sources: AUTHORITATIVE_SOURCES,
      courtGuide: COURT_SYSTEM_GUIDE,
      courtEtiquette: COURTROOM_ETIQUETTE,
      advocateRoles: ADVOCATE_ROLES,
      becomeLawyerPathway: BECOME_A_LAWYER_PATHWAY,
      cnrGuide: CNR_NUMBER_GUIDE,
      legalAidGuide: LEGAL_AID_NALSA_GUIDE
    });
  });

  // Admin Add Document / Section
  app.post('/api/knowledge/item', (req, res) => {
    try {
      const { type, item } = req.body;
      if (!item || !item.title) {
        return res.status(400).json({ error: 'Item data is required' });
      }

      const newItem = {
        ...item,
        id: `custom-${Date.now()}`,
        status: item.status || 'ACTIVE',
        last_updated: new Date().toISOString().split('T')[0]
      };

      if (type === 'article') {
        customArticles.unshift(newItem);
      } else if (type === 'act') {
        customActs.unshift(newItem);
      } else {
        customSections.unshift(newItem);
      }

      res.status(201).json({ success: true, item: newItem });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin Update Status (Active / Repealed / Replaced)
  app.patch('/api/knowledge/item/:id', (req, res) => {
    const { id } = req.params;
    const { status, replacedBy, notes } = req.body;

    let found = false;
    customActs = customActs.map(a => {
      if (a.id === id) {
        found = true;
        return { ...a, status: status || a.status, supersededByOrNotes: notes || a.supersededByOrNotes };
      }
      return a;
    });

    if (!found) {
      customSections = customSections.map(s => {
        if (s.id === id) {
          found = true;
          return { ...s, status: status || s.status, replacedBy: replacedBy || s.replacedBy };
        }
        return s;
      });
    }

    if (!found) {
      customArticles = customArticles.map(art => {
        if (art.id === id) {
          found = true;
          return { ...art, status: status || art.status };
        }
        return art;
      });
    }

    res.json({ success: true, updatedId: id, newStatus: status });
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LegalAI India server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
