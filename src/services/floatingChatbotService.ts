import { RetrievedDocument, searchLegalKnowledgeBase } from './ragEngine';
import { generateLegalChatResponse } from './geminiService';
import { LanguageCode } from '../types';

export interface FloatingAnswerSource {
  name: string;
  citation: string;
  url?: string;
  status?: string;
}

export interface FloatingAnswer {
  shortAnswer: {
    coreText: string;
    simpleMeaning: string;
    source: string;
    sourceUrl?: string;
    statusTag?: string;
  };
  detailedAnswer: {
    fullExplanation: string;
    relevantLaw: string;
    conditions: string[];
    exceptions: string[];
    examples: string[];
    relatedProvisions: string[];
    sources: FloatingAnswerSource[];
    dateOrVersion: string;
  };
}

export interface FloatingMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  queryText?: string;
  answer?: FloatingAnswer;
  isDetailedExpanded?: boolean;
  documentAttached?: {
    fileName: string;
    fileType: string;
    fileSize?: string;
    summaryPreview?: string;
    data?: string;
  };
  isResearchMode?: boolean;
}

// Curated high-precision responses for common legal questions in EN, HI, TE
export const CURATED_LEGAL_ANSWERS: Record<string, Record<LanguageCode, FloatingAnswer>> = {
  'what is article 21': {
    en: {
      shortAnswer: {
        coreText: "**Article 21** of the Constitution of India protects the right to life and personal liberty.",
        simpleMeaning: "No person can be deprived of their life or personal liberty except according to procedure established by law. It is the cornerstone of fundamental human dignity in India.",
        source: "Constitution of India — Article 21 (Part III, Fundamental Rights)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "Supreme Constitutional Law"
      },
      detailedAnswer: {
        relevantLaw: "Constitution of India, Article 21 (Fundamental Rights, Part III).",
        fullExplanation: "Article 21 guarantees that 'No person shall be deprived of his life or personal liberty except according to procedure established by law.' Through judicial interpretation by the Supreme Court of India, Article 21 has been expanded into the widest protective charter in Indian constitutional jurisprudence. It applies to citizens and foreigners alike.",
        conditions: [
          "Procedure Established by Law: Any deprivation must follow a validly enacted statute.",
          "Due Process & Fairness: As established in Maneka Gandhi (1978), the statutory procedure must be 'just, fair, and reasonable'—not arbitrary, oppressive, or fanciful.",
          "Non-Derogable Right: Under Article 359 (amended by the 44th Constitutional Amendment 1978), the right to protection of life and personal liberty under Article 21 cannot be suspended even during a proclaimed National Emergency."
        ],
        exceptions: [
          "Deprivation is permissible only if established by a valid legislative enactment complying with Articles 14 and 19.",
          "Does not protect unlawful activities prohibited by penal statutes (e.g., Bharatiya Nyaya Sanhita 2023)."
        ],
        examples: [
          "Right to Privacy: Affirmed as an intrinsic component of Article 21 in Justice K.S. Puttaswamy (2017).",
          "Right to Free Legal Aid: Declared fundamental for indigent accused in Hussainara Khatoon (1979).",
          "Right to Clean Environment & Water: Recognized under M.C. Mehta environmental precedents."
        ],
        relatedProvisions: [
          "Article 14 (Equality Before Law)",
          "Article 19 (Six Democratic Freedoms)",
          "Article 32 & 226 (Constitutional Writs of Habeas Corpus, Mandamus)",
          "Article 21A (Right to Free & Compulsory Elementary Education)"
        ],
        sources: [
          { name: "Constitution of India", citation: "Article 21", url: "https://www.indiacode.nic.in", status: "ACTIVE" },
          { name: "Supreme Court Landmark", citation: "Maneka Gandhi v. Union of India (1978) 1 SCC 248", url: "https://sci.gov.in", status: "LANDMARK" },
          { name: "Supreme Court 9-Judge Bench", citation: "Justice K.S. Puttaswamy (Retd.) v. Union of India (2017) 10 SCC 1", url: "https://sci.gov.in", status: "LANDMARK" }
        ],
        dateOrVersion: "Constitution of India 1950 (incorporating 44th Amendment Act 1978 and 106th Amendment Act 2023)"
      }
    },
    hi: {
      shortAnswer: {
        coreText: "**अनुच्छेद 21** भारतीय संविधान के तहत जीवन और व्यक्तिगत स्वतंत्रता के अधिकार की रक्षा करता है।",
        simpleMeaning: "विधि द्वारा स्थापित प्रक्रिया के बिना किसी भी व्यक्ति को उसके जीवन या व्यक्तिगत स्वतंत्रता से वंचित नहीं किया जा सकता। यह मानवीय गरिमा का सर्वोच्च अधिकार है।",
        source: "भारत का संविधान — अनुच्छेद 21 (भाग III, मौलिक अधिकार)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "सर्वोच्च संवैधानिक कानून"
      },
      detailedAnswer: {
        relevantLaw: "भारत का संविधान, अनुच्छेद 21 (मौलिक अधिकार, भाग III)।",
        fullExplanation: "अनुच्छेद 21 प्रावधान करता है कि किसी भी व्यक्ति को उसके प्राण या दैहिक स्वतंत्रता से विधि द्वारा स्थापित प्रक्रिया के अनुसार ही वंचित किया जाएगा, अन्यथा नहीं। मेनका गांधी बनाम भारत संघ (1978) में सर्वोच्च न्यायालय ने माना कि यह प्रक्रिया निष्पक्ष, न्यायसंगत और तर्कसंगत होनी चाहिए।",
        conditions: [
          "विधि द्वारा स्थापित प्रक्रिया अनिवार्य है।",
          "प्रक्रिया न्यायपूर्ण और मनमानी-रहित होनी चाहिए।",
          "44वें संविधान संशोधन (1978) के बाद राष्ट्रीय आपातकाल के दौरान भी अनुच्छेद 21 को निलंबित नहीं किया जा सकता।"
        ],
        exceptions: [
          "वैध कानूनी दंड या उचित कानून के तहत कारावास पर लागू प्रक्रिया।"
        ],
        examples: [
          "निजता का अधिकार (के.एस. पुट्टास्वामी मामला 2017)।",
          "स्वच्छ पर्यावरण का अधिकार (एम.सी. मेहता मामले)।",
          "त्वरित सुनवाई और निःशुल्क कानूनी सहायता का अधिकार।"
        ],
        relatedProvisions: [
          "अनुच्छेद 14 (समानता का अधिकार)",
          "अनुच्छेद 19 (स्वतंत्रता का अधिकार)",
          "अनुच्छेद 32 और 226 (संवैधानिक रिट याचिकाएं)"
        ],
        sources: [
          { name: "भारत का संविधान", citation: "अनुच्छेद 21", url: "https://www.indiacode.nic.in", status: "ACTIVE" },
          { name: "सर्वोच्च न्यायालय निर्णय", citation: "मेनका गांधी बनाम भारत संघ (1978) 1 SCC 248", url: "https://sci.gov.in", status: "LANDMARK" }
        ],
        dateOrVersion: "भारत का संविधान 1950 (44वां संशोधन 1978 एवं पुट्टास्वामी 2017)"
      }
    },
    te: {
      shortAnswer: {
        coreText: "**ఆర్టికల్ 21** జీవించే హక్కు మరియు వ్యక్తిగత స్వేచ్ఛను భారత రాజ్యాంగం ప్రకారం రక్షిస్తుంది.",
        simpleMeaning: "చట్టం నిర్దేశించిన పద్ధతి ప్రకారం తప్ప ఏ వ్యక్తి కూడా తన ప్రాణాన్ని లేదా వ్యక్తిగత స్వేచ్ఛను కోల్పోకూడదు. ఇది ప్రాథమిక మానవ హక్కులలో అత్యంత ముఖ్యమైనది.",
        source: "భారత రాజ్యాంగం — ఆర్టికల్ 21 (భాగం III, ప్రాథమిక హక్కులు)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "అత్యున్నత రాజ్యాంగ చట్టం"
      },
      detailedAnswer: {
        relevantLaw: "భారత రాజ్యాంగం, ఆర్టికల్ 21 (భాగం III, ప్రాథమిక హక్కులు).",
        fullExplanation: "ఆర్టికల్ 21 ప్రకారం, చట్టం ద్వారా స్థిరపరచబడిన ప్రక్రియ ద్వారా తప్ప ఏ వ్యక్తిని తన ప్రాణము లేదా వ్యక్తిగత స్వేచ్ఛ నుండి వంచించరాదు. మేనకా గాంధీ కేసు (1978) లో సుప్రీం కోర్టు ఆ ప్రక్రియ న్యాయబద్ధంగా, సహేతుకంగా ఉండాలని స్పష్టం చేసింది.",
        conditions: [
          "చట్టబద్ధమైన శాసన ప్రక్రియ తప్పనిసరి.",
          "ప్రక్రియ ఏకపక్షంగా లేదా అన్యాయంగా ఉండకూడదు.",
          "44వ రాజ్యాంగ సవరణ ప్రకారం జాతీయ అత్యవసర పరిస్థితి (Emergency) లో కూడా ఆర్టికల్ 21 ని రద్దు చేయలేరు."
        ],
        exceptions: [
          "చట్టబద్ధమైన క్రిమినల్ శిక్ష లేదా విచారణ నిబంధనలకు లోబడి ఉంటుంది."
        ],
        examples: [
          "గోప్యతా హక్కు (రైట్ టు ప్రైవసీ - పుట్టస్వామి తీర్పు 2017).",
          "స్వేచ్ఛాయుత న్యాయ సహాయ హక్కు (హుస్సేనారా ఖాతూన్ కేసు).",
          "పరిశుభ్రమైన వాతావరణం పొందే హక్కు."
        ],
        relatedProvisions: [
          "ఆర్టికల్ 14 (చట్టం ముందు సమానత్వం)",
          "ఆర్టికల్ 19 (వాక్ స్వాతంత్ర్యం మరియు ప్రాథమిక స్వేచ్ఛలు)",
          "ఆర్టికల్ 32 మరియు 226 (రిట్ పిటిషన్లు)"
        ],
        sources: [
          { name: "భారత రాజ్యాంగం", citation: "ఆర్టికల్ 21", url: "https://www.indiacode.nic.in", status: "ACTIVE" },
          { name: "సుప్రీంకోర్టు తీర్పు", citation: "మేనకా గాంధీ v. భారత ప్రభుత్వం (1978)", url: "https://sci.gov.in", status: "LANDMARK" }
        ],
        dateOrVersion: "భారత రాజ్యాంగం 1950 (106వ సవరణ వరకు అప్‌డేట్)"
      }
    }
  },

  'how can i become an advocate': {
    en: {
      shortAnswer: {
        coreText: "To become an advocate in India, you must complete an LL.B. degree, enroll with your State Bar Council, and clear the All India Bar Examination (AIBE).",
        simpleMeaning: "Study Law (3-year or 5-year LL.B.) → Provisional State Bar Enrollment → Pass AIBE Exam → Receive permanent Certificate of Practice (CoP).",
        source: "The Advocates Act, 1961 (Sections 24 & 29) & Bar Council of India Rules",
        sourceUrl: "http://www.barcouncilofindia.org",
        statusTag: "Statutory Practice Route"
      },
      detailedAnswer: {
        relevantLaw: "The Advocates Act, 1961 (Act No. 25 of 1961) — Section 24 (Persons admitted as advocates on a State roll) & Section 29.",
        fullExplanation: "Under Section 24 of the Advocates Act, 1961, an advocate is a person enrolled with a State Bar Council who holds the exclusive statutory right to plead and represent clients in courts of law throughout India. A law graduate becomes an advocate only upon formal enrollment.",
        conditions: [
          "Age & Nationality: Must be a citizen of India and at least 21 years of age.",
          "Recognized Degree: Must hold an LL.B. degree from a university recognized by the Bar Council of India (BCI) — either 5-year Integrated (BA/BBA/BCom LL.B.) after Class 12, or 3-year LL.B. after any Bachelor's graduation.",
          "State Bar Enrollment: Submit enrollment form, verification fee, character certificates, and take the official pledge before the State Bar Council.",
          "AIBE Certification: Within 2 years of provisional enrollment, must qualify the All India Bar Examination conducted by BCI to secure the permanent Certificate of Practice (CoP)."
        ],
        exceptions: [
          "Full-time government employees or corporate salaried professionals cannot hold active advocate status; their license must be kept in suspended animation while employed."
        ],
        examples: [
          "Path A: 10+2 with min 45% marks → Clear CLAT/SLAT/CUET-Law → 5-Year Integrated LL.B. → State Bar Enrollment → AIBE.",
          "Path B: Any 3/4-Year Bachelor's Degree → 3-Year LL.B. (DU LLB, NLS 3-Year, MH CET Law) → State Bar Enrollment → AIBE."
        ],
        relatedProvisions: [
          "Advocates Act 1961 Section 30 (Right of advocates to practice in all courts)",
          "Advocates Act 1961 Section 35 (Professional misconduct disciplinary proceedings)",
          "BCI Rules of Professional Conduct (Chapter II, Part VI)"
        ],
        sources: [
          { name: "Bar Council of India", citation: "Advocates Act, 1961 - Sections 24, 29, 30", url: "http://www.barcouncilofindia.org", status: "ACTIVE" },
          { name: "Supreme Court Ruling", citation: "Bar Council of India v. Bonnie Foi Law College (2023) 5 SCC 252 (Upheld AIBE validity)", url: "https://sci.gov.in", status: "LANDMARK" }
        ],
        dateOrVersion: "Advocates Act 1961 (as amended) & BCI Regulations 2024"
      }
    },
    hi: {
      shortAnswer: {
        coreText: "भारत में अधिवक्ता (Advocate) बनने के लिए आपको विधि (LL.B.) की डिग्री पूरी करनी होगी, राज्य बार काउंसिल में नामांकन कराना होगा और AIBE परीक्षा उत्तीर्ण करनी होगी।",
        simpleMeaning: "एलएलबी डिग्री → राज्य बार काउंसिल में अस्थायी नामांकन → अखिल भारतीय बार परीक्षा (AIBE) पास करना → स्थायी प्रैक्टिस प्रमाण पत्र (CoP) प्राप्त करना।",
        source: "अधिवक्ता अधिनियम, 1961 (धारा 24 और 29) एवं बार काउंसिल ऑफ इंडिया",
        sourceUrl: "http://www.barcouncilofindia.org",
        statusTag: "वैधानिक प्रक्रिया"
      },
      detailedAnswer: {
        relevantLaw: "अधिवक्ता अधिनियम, 1961 (Advocates Act, 1961) — धारा 24 व 30।",
        fullExplanation: "केवल कानून की डिग्री प्राप्त करने से व्यक्ति 'वकील' (Law Graduate) बनता है, लेकिन न्यायालयों में मुवक्किल का पक्ष रखने (Plead) का अधिकार केवल राज्य बार काउंसिल में पंजीकृत 'अधिवक्ता' को होता है।",
        conditions: [
          "न्यूनतम आयु 21 वर्ष और भारत का नागरिक होना आवश्यक है।",
          "BCI द्वारा मान्यता प्राप्त कॉलेज से 3-वर्षीय या 5-वर्षीय LL.B. डिग्री।",
          "राज्य बार काउंसिल (जैसे Bar Council of Delhi, UP, etc.) में पंजीकरण।",
          "नामांकन के 2 वर्ष के भीतर All India Bar Examination (AIBE) पास करना अनिवार्य।"
        ],
        exceptions: [
          "पूर्णकालिक सरकारी या निजी नौकरी करने वाले व्यक्ति सक्रिय वकालत का लाइसेंस नहीं रख सकते।"
        ],
        examples: [
          "12वीं के बाद CLAT देकर 5 साल का बीए एलएलबी करना।",
          "ग्रेजुएशन के बाद 3 साल का एलएलबी करना।"
        ],
        relatedProvisions: [
          "अधिवक्ता अधिनियम की धारा 30 (अखिल भारतीय न्यायालयों में वकालत का अधिकार)",
          "बीसीआई व्यावसायिक आचार संहिता नियम"
        ],
        sources: [
          { name: "बार काउंसिल ऑफ इंडिया", citation: "Advocates Act, 1961 Section 24", url: "http://www.barcouncilofindia.org", status: "ACTIVE" }
        ],
        dateOrVersion: "अधिवक्ता अधिनियम 1961 (अद्यतन 2024)"
      }
    },
    te: {
      shortAnswer: {
        coreText: "భారతదేశంలో న్యాయవాది (Advocate) కావడానికి మీరు లా డిగ్రీ (LL.B.) పూర్తి చేసి, రాష్ట్ర బార్ కౌన్సిల్‌లో నమోదు చేసుకొని, AIBE పరీక్షలో ఉత్తీర్ణత సాధించాలి.",
        simpleMeaning: "లా డిగ్రీ (LL.B.) పూర్తి చేయడం → స్టేట్ బార్ కౌన్సిల్ ఎన్‌రోల్‌మెంట్ → AIBE పరీక్ష పాస్ అవ్వడం → ప్రాక్టీస్ సర్టిఫికేట్ (CoP) అందుకోవడం.",
        source: "అడ్వొకేట్స్ యాక్ట్, 1961 (సెక్షన్ 24, 29) & బార్ కౌన్సిల్ ఆఫ్ ఇండియా",
        sourceUrl: "http://www.barcouncilofindia.org",
        statusTag: "చట్టబద్ధమైన నిబంధన"
      },
      detailedAnswer: {
        relevantLaw: "అడ్వొకేట్స్ యాక్ట్, 1961 — సెక్షన్ 24 మరియు 30.",
        fullExplanation: "లా గ్రాడ్యుయేట్ కోర్టులో వాదించలేరు. రాష్ట్ర బార్ కౌన్సిల్‌లో ఎన్‌రోల్ అయిన తర్వాత మాత్రమే వారు 'అడ్వొకేట్' హోదా పొంది భారతదేశంలోని అన్ని కోర్టులలో క్లయింట్ తరఫున వాదించే చట్టబద్ధమైన హక్కును పొందుతారు.",
        conditions: [
          "కనీస వయస్సు 21 సంవత్సరాలు మరియు భారత పౌరుడై ఉండాలి.",
          "BCI గుర్తింపు పొందిన కాలేజీ నుండి 5 సంవత్సరాల ఇంటిగ్రేటెడ్ లేదా 3 సంవత్సరాల LL.B. డిగ్రీ ఉండాలి.",
          "స్టేట్ బార్ కౌన్సిల్‌లో ఎన్‌రోల్‌మెంట్ ఫారమ్ మరియు ఫీజు సమర్పించి నమోదు చేసుకోవాలి.",
          "ఆల్ ఇండియా బార్ ఎగ్జామినేషన్ (AIBE) పాసై సర్టిఫికేట్ ఆఫ్ ప్రాక్టీస్ (CoP) పొందాలి."
        ],
        exceptions: [
          "పూర్తి సమయం వేతనం తీసుకునే ఉద్యోగులు ప్రాక్టీస్ లైసెన్స్ వాడకూడదు."
        ],
        examples: [
          "ఇంటర్ తర్వాత 5 సంవత్సరాల BA.LL.B.",
          "డిగ్రీ తర్వాత 3 సంవత్సరాల LL.B."
        ],
        relatedProvisions: [
          "అడ్వొకేట్స్ యాక్ట్ సెక్షన్ 30",
          "BCI ఎథిక్స్ నిబంధనలు"
        ],
        sources: [
          { name: "బార్ కౌన్సిల్ ఆఫ్ ఇండియా", citation: "అడ్వొకేట్స్ చట్టం 1961", url: "http://www.barcouncilofindia.org", status: "ACTIVE" }
        ],
        dateOrVersion: "అడ్వొకేట్స్ యాక్ట్ 1961 (2024 తాజా నిబంధనలు)"
      }
    }
  },

  'what is the difference between a lawyer and an advocate': {
    en: {
      shortAnswer: {
        coreText: "A **lawyer** is anyone with a recognized law degree (LL.B.), while an **advocate** is a lawyer who is officially enrolled with a State Bar Council and has the legal authority to represent and plead for clients in court.",
        simpleMeaning: "All advocates are lawyers, but not all lawyers are advocates. Without State Bar enrollment, you cannot stand before a judge to represent a client.",
        source: "The Advocates Act, 1961 (Section 2(1)(a) & Section 29)",
        sourceUrl: "http://www.barcouncilofindia.org",
        statusTag: "Statutory Distinction"
      },
      detailedAnswer: {
        relevantLaw: "The Advocates Act, 1961 — Section 2(1)(a) defines an 'advocate' as an advocate entered in any roll under the provisions of this Act. Section 29 creates a single class of practitioners.",
        fullExplanation: "In colloquial language, 'lawyer' is a generic term referring to anyone trained in the law. However, under Indian statutory framework, Section 29 of the Advocates Act recognizes only one single class of legal practitioners entitled to practice law, known exclusively as 'Advocates'. A legal advisor, legal journalist, or in-house corporate legal officer with an LL.B. is a lawyer, but only an enrolled practitioner is an advocate.",
        conditions: [
          "Lawyer: Holds LL.B. degree. Can provide legal advice, draft agreements, teach law, or work in corporate contracts.",
          "Advocate: Enrolled on State Roll + cleared AIBE. Holds statutory right of audience in courts, wears the advocate gown and white bands, and represents clients before judicial magistrates, judges, and tribunals."
        ],
        exceptions: [
          "Parties-in-person (litigants) can argue their own personal case without an advocate under Section 32 of the Advocates Act, with permission of the court."
        ],
        examples: [
          "Corporate In-House Counsel: Is a lawyer, handles company compliance, but cannot wear robes or argue in court.",
          "Litigation Counsel: Is an advocate, wears black coat and bands, and examines witnesses on the court record."
        ],
        relatedProvisions: [
          "Section 30 (Right of advocates to practice throughout territories of India)",
          "Section 32 (Power of Court to permit appearances in particular cases by non-advocates)",
          "Section 33 (Advocates alone entitled to practice in courts)"
        ],
        sources: [
          { name: "The Advocates Act, 1961", citation: "Sections 2(1)(a), 29, 30, 33", url: "https://www.indiacode.nic.in", status: "ACTIVE" }
        ],
        dateOrVersion: "The Advocates Act, 1961 (GoI Legislative Department)"
      }
    },
    hi: {
      shortAnswer: {
        coreText: "**वकील (Lawyer)** वह व्यक्ति है जिसके पास कानून (LL.B.) की डिग्री है, जबकि **अधिवक्ता (Advocate)** वह वकील है जो बार काउंसिल में नामांकित है और अदालत में बहस करने का कानूनी अधिकार रखता है।",
        simpleMeaning: "सभी अधिवक्ता वकील होते हैं, लेकिन सभी वकील अधिवक्ता नहीं होते। बार काउंसिल में पंजीकरण के बिना आप अदालत में मुवक्किल का पक्ष नहीं रख सकते।",
        source: "अधिवक्ता अधिनियम, 1961 (धारा 2(1)(a) व धारा 29)",
        sourceUrl: "http://www.barcouncilofindia.org",
        statusTag: "वैधानिक अंतर"
      },
      detailedAnswer: {
        relevantLaw: "अधिवक्ता अधिनियम, 1961 — धारा 2(1)(a) और धारा 29।",
        fullExplanation: "वकील एक सामान्य शब्द है जो कानून के स्नातक (Law Graduate) के लिए उपयोग होता है। अधिवक्ता वह व्यक्ति है जिसका नाम राज्य बार काउंसिल की नामावली में दर्ज है और जिसे धारा 30 के तहत भारत के किसी भी न्यायालय में वकालत करने का अधिकार प्राप्त है।",
        conditions: [
          "लॉयर: कानूनी सलाह दे सकता है, अनुबंध तैयार कर सकता है।",
          "एडवोकेट: अदालत में बहस कर सकता है, गाउन व बैंड पहनता है और मुवक्किल का प्रतिनिधित्व करता है।"
        ],
        exceptions: [
          "अदालत की अनुमति से कोई व्यक्ति अपना खुद का केस स्वयं लड़ सकता है (Party-in-person)।"
        ],
        examples: [
          "कंपनी में काम करने वाला लीगल एडवाइजर = लॉयर।",
          "कोर्ट रूम में जज के सामने जिरह करने वाला = एडवोकेट।"
        ],
        relatedProvisions: [
          "धारा 33: केवल अधिवक्ता ही न्यायालयों में वकालत करने के हकदार हैं।"
        ],
        sources: [
          { name: "अधिवक्ता अधिनियम 1961", citation: "Sections 29 & 33", url: "https://www.indiacode.nic.in", status: "ACTIVE" }
        ],
        dateOrVersion: "अधिवक्ता अधिनियम, 1961"
      }
    },
    te: {
      shortAnswer: {
        coreText: "**లాయర్ (Lawyer)** అంటే లా డిగ్రీ (LL.B.) ఉన్న వ్యక్తి. **అడ్వొకేట్ (Advocate)** అంటే బార్ కౌన్సిల్‌లో నమోదై కోర్టులో క్లయింట్ తరఫున వాదించే లైసెన్స్ ఉన్న న్యాయవాది.",
        simpleMeaning: "అడ్వొకేట్‌లందరూ లాయర్లే, కానీ లాయర్లందరూ అడ్వొకేట్లు కారు. బార్ కౌన్సిల్ ఎన్‌రోల్‌మెంట్ లేకుండా కోర్టులో వాదించే అధికారం ఉండదు.",
        source: "అడ్వొకేట్స్ యాక్ట్, 1961 (సెక్షన్ 2(1)(a) మరియు సెక్షన్ 29)",
        sourceUrl: "http://www.barcouncilofindia.org",
        statusTag: "చట్టపరమైన వ్యత్యాసం"
      },
      detailedAnswer: {
        relevantLaw: "అడ్వొకేట్స్ యాక్ట్, 1961 — సెక్షన్ 2(1)(a), సెక్షన్ 29.",
        fullExplanation: "లా చదివిన వారందరినీ సాధారణంగా 'లాయర్' అంటారు. కానీ అడ్వొకేట్స్ యాక్ట్ 1961 సెక్షన్ 29 ప్రకారం, కోర్టులలో అధికారికంగా వాదించే హక్కు బార్ కౌన్సిల్‌లో ఎన్‌రోల్ అయిన 'అడ్వొకేట్' లకు మాత్రమే ఉంటుంది.",
        conditions: [
          "లాయర్: లీగల్ అడ్వైస్ ఇవ్వవచ్చు, డాక్యుమెంట్స్ డ్రాఫ్ట్ చేయవచ్చు.",
          "అడ్వొకేట్: కోర్టు ముందు హాజరై వాదనలు వినిపించే చట్టపరమైన అధికారం కలిగి ఉంటారు."
        ],
        exceptions: [
          "కోర్టు అనుమతితో తన కేసును తానే స్వయంగా వాదించుకోవచ్చు (Party-in-person)."
        ],
        examples: [
          "కార్పొరేట్ కంపెనీలో పనిచేసే లీగల్ మేనేజర్ = లాయర్.",
          "కోర్టులో బ్లాక్ కోట్ వేసి సాక్షులను విచారించే వ్యక్తి = అడ్వొకేట్."
        ],
        relatedProvisions: [
          "అడ్వొకేట్స్ యాక్ట్ సెక్షన్ 33 (అడ్వొకేట్లు మాత్రమే కోర్టులలో వాదించాలి)"
        ],
        sources: [
          { name: "అడ్వొకేట్స్ చట్టం 1961", citation: "సెక్షన్ 29, 33", url: "https://www.indiacode.nic.in", status: "ACTIVE" }
        ],
        dateOrVersion: "భారత అడ్వొకేట్స్ చట్టం 1961"
      }
    }
  },

  'what does fir mean': {
    en: {
      shortAnswer: {
        coreText: "An **FIR (First Information Report)** is the earliest recorded document prepared by police when they receive information regarding the commission of a **cognizable offence**.",
        simpleMeaning: "It is the formal trigger for police criminal investigation. Under the new criminal procedure, an FIR can also be filed electronically (e-FIR) or at any police station regardless of jurisdiction (Zero FIR).",
        source: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 — Section 173 (Replacing CrPC Section 154)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "BNS 2024 Active Law"
      },
      detailedAnswer: {
        relevantLaw: "Section 173 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 (previously Section 154 of Code of Criminal Procedure, 1973).",
        fullExplanation: "An FIR is not a substantive piece of evidence on its own, but it sets the machinery of criminal law into motion. Under Section 173 BNSS, an officer in charge of a police station is statutorily bound to reduce cognizable offence information into writing, read it back to the informant, obtain their signature, and provide an immediate free copy of the FIR to the informant.",
        conditions: [
          "Mandatory Registration: In Lalita Kumari (2014), the Supreme Court ruled that registering an FIR is mandatory if information discloses a cognizable offence.",
          "Zero FIR: Under BNSS Section 173(1), information can be registered irrespective of the territorial jurisdiction where the crime took place, then transferred to the appropriate police station.",
          "Electronic FIR (e-FIR): Information can be given electronically, provided it is signed by the complainant within three days."
        ],
        exceptions: [
          "Non-cognizable offences: Police cannot register an FIR directly or arrest without a warrant; an entry is made in the Non-Cognizable Register (NCR) under Section 174 BNSS, requiring Magistrate permission to investigate."
        ],
        examples: [
          "Theft of property or robbery: Cognizable offence → Police must register FIR immediately.",
          "Simple non-injurious verbal abuse: Non-cognizable → NCR filed, police refer informant to Magistrate."
        ],
        relatedProvisions: [
          "Section 173 BNSS (Registration of Information in Cognizable Cases)",
          "Section 175 BNSS (Police officer's power to investigate cognizable cases)",
          "Section 176 BNSS (Procedure for investigation)"
        ],
        sources: [
          { name: "Bharatiya Nagarik Suraksha Sanhita, 2023", citation: "Section 173", url: "https://www.indiacode.nic.in", status: "ACTIVE" },
          { name: "Supreme Court Constitution Bench", citation: "Lalita Kumari v. Govt. of U.P. (2014) 2 SCC 1", url: "https://sci.gov.in", status: "LANDMARK" }
        ],
        dateOrVersion: "BNSS 2023 (In force from 1 July 2024)"
      }
    },
    hi: {
      shortAnswer: {
        coreText: "**FIR (प्रथम सूचना रिपोर्ट / First Information Report)** वह औपचारिक दस्तावेज है जिसे पुलिस किसी **संज्ञेय अपराध (Cognizable Offence)** की सूचना मिलने पर दर्ज करती है।",
        simpleMeaning: "यह पुलिस जांच शुरू करने का प्राथमिक कानूनी आधार है। नए आपराधिक कानूनों के तहत ई-एफआईआर और जीरो एफआईआर का स्पष्ट कानूनी प्रावधान है।",
        source: "भारतीय नागरिक सुरक्षा संहिता (BNSS) 2023 — धारा 173 (पूर्व धारा 154 CrPC)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "BNS 2024 लागू कानून"
      },
      detailedAnswer: {
        relevantLaw: "भारतीय नागरिक सुरक्षा संहिता (BNSS), 2023 — धारा 173।",
        fullExplanation: "जब किसी संज्ञेय अपराध (जैसे चोरी, हत्या, धोखाधड़ी) की जानकारी पुलिस को दी जाती है, तो पुलिस अधिकारी उसे लिखकर दर्ज करने और शिकायतकर्ता को तुरंत निःशुल्क प्रति देने के लिए बाध्य है। ललिता कुमारी मामले (2014) में सुप्रीम कोर्ट ने संज्ञेय अपराध में एफआईआर अनिवार्य की थी।",
        conditions: [
          "संज्ञेय अपराध में एफआईआर दर्ज करना अनिवार्य है।",
          "शिकायतकर्ता को एफआईआर की एक प्रति निःशुल्क पाने का अधिकार है।",
          "जीरो एफआईआर किसी भी थाने में दर्ज कराई जा सकती है चाहे घटना कहीं भी हुई हो।"
        ],
        exceptions: [
          "असंज्ञेय अपराधों में एफआईआर दर्ज नहीं होती, बल्कि एनसीआर (NCR) काटी जाती है और मजिस्ट्रेट की अनुमति आवश्यक होती है।"
        ],
        examples: [
          "वाहन चोरी होने पर ऑनलाइन ई-एफआईआर दर्ज कराना।"
        ],
        relatedProvisions: [
          "धारा 173 BNSS (संज्ञेय मामलों में सूचना)",
          "धारा 175 BNSS (जांच का अधिकार)"
        ],
        sources: [
          { name: "भारतीय नागरिक सुरक्षा संहिता 2023", citation: "धारा 173", url: "https://www.indiacode.nic.in", status: "ACTIVE" },
          { name: "सुप्रीम कोर्ट संविधान पीठ", citation: "Lalita Kumari v. Govt. of U.P. (2014)", url: "https://sci.gov.in", status: "LANDMARK" }
        ],
        dateOrVersion: "BNSS 2023 (1 जुलाई 2024 से प्रभावी)"
      }
    },
    te: {
      shortAnswer: {
        coreText: "**FIR (ఫస్ట్ ఇన్ఫర్మేషన్ రిపోర్ట్ / First Information Report)** అనేది ఏదైనా కాగ్నిజబుల్ నేరం (తీవ్రమైన నేరం) జరిగినప్పుడు పోలీసులకు అందిన సమాచారం ఆధారంగా నమోదు చేయబడే మొదటి రాతపూర్వక నివేదిక.",
        simpleMeaning: "ఇది పోలీసుల క్రిమినల్ దర్యాప్తును ప్రారంభించే ప్రాథమిక ప్రక్రియ. కొత్త చట్టం ప్రకారం జీరో ఎఫ్ఐఆర్ (Zero FIR), ఇ-ఎఫ్ఐఆర్ (e-FIR) సౌకర్యాలు అందుబాటులో ఉన్నాయి.",
        source: "భారతీయ నాగరిక్ సురక్ష సంహిత (BNSS) 2023 — సెక్షన్ 173 (పాత CrPC సెక్షన్ 154)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "BNS 2024 అమల్లో ఉన్న చట్టం"
      },
      detailedAnswer: {
        relevantLaw: "భారతీయ నాగరిక్ సురక్ష సంహిత (BNSS), 2023 — సెక్షన్ 173.",
        fullExplanation: "పోలీసు స్టేషన్ అధికారి కాగ్నిజబుల్ నేరం జరిగినట్లు సమాచారం అందిన వెంటనే ఎఫ్‌ఐఆర్‌ను నమోదు చేయాలి. సమాచారం ఇచ్చిన వ్యక్తికి ఎఫ్‌ఐఆర్ కాపీని ఉచితంగా వెంటనే అందజేయడం చట్టబద్ధమైన బాధ్యత.",
        conditions: [
          "కాగ్నిజబుల్ నేరంలో ఎఫ్‌ఐఆర్ నమోదు చేయడం తప్పనిసరి (లలితా కుమారి తీర్పు).",
          "సంఘటన ఎక్కడ జరిగినా ఏ పోలీస్ స్టేషన్‌లోనైనా 'జీరో ఎఫ్ఐఆర్' నమోదు చేయవచ్చు.",
          "ఎలక్ట్రానిక్ ద్వారా కూడా ఫిర్యాదు చేయవచ్చు (3 రోజుల్లో సంతకం చేయాలి)."
        ],
        exceptions: [
          "నాన్-కాగ్నిజబుల్ నేరాలలో నేరుగా ఎఫ్‌ఐఆర్ నమోదు చేయలేరు; మేజిస్ట్రేట్ అనుమతితో మాత్రమే దర్యాప్తు జరుగుతుంది."
        ],
        examples: [
          "దొంగతనం, మోసం, లేదా దాడి జరిగినప్పుడు పోలీస్ స్టేషన్‌లో ఎఫ్‌ఐఆర్ నమోదు."
        ],
        relatedProvisions: [
          "BNSS సెక్షన్ 173, 175 మరియు 176"
        ],
        sources: [
          { name: "భారతీయ నాగరిక్ సురక్ష సంహిత 2023", citation: "సెక్షన్ 173", url: "https://www.indiacode.nic.in", status: "ACTIVE" }
        ],
        dateOrVersion: "BNSS 2023 (1 జూలై 2024 నుండి అమల్లోకి వచ్చింది)"
      }
    }
  },

  'how does bail work': {
    en: {
      shortAnswer: {
        coreText: "**Bail** is the conditional, provisional release of an accused individual from custody pending trial or investigation, secured by personal bond or sureties.",
        simpleMeaning: "In India, the governing judicial rule established by Justice V.R. Krishna Iyer is: 'Bail is the rule, jail is the exception.'",
        source: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 — Chapter XXXV (Sections 478 to 496)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "BNS 2024 Criminal Procedure"
      },
      detailedAnswer: {
        relevantLaw: "Chapter XXXV of BNSS 2023: Section 478 (Bailable offences), Section 479 (Undertrial maximum detention), Section 480 (Non-bailable bail by Magistrate), Section 482 (Anticipatory bail), Section 483 (High Court/Sessions special bail).",
        fullExplanation: "Bail ensures that an individual's liberty under Article 21 is not needlessly curtailed while presuming innocence until proven guilty. In bailable offences, bail is an absolute statutory right that the police or Magistrate must grant. In non-bailable offences, bail is at judicial discretion based on the gravity of the charge, risk of fleeing, and risk of witness tampering.",
        conditions: [
          "Bailable Offence (Section 478 BNSS): Accused has an absolute right to be released on furnishing a personal bond or sureties.",
          "Non-Bailable Offence (Section 480 BNSS): Court considers nature of offence, potential punishment, likelihood of absconding or tampering with evidence.",
          "Anticipatory Bail (Section 482 BNSS): Directed to High Court or Sessions Court by a person apprehending arrest on an accusation of having committed a non-bailable offence.",
          "Statutory Default Bail (Section 187 BNSS): If chargesheet is not filed within 60 or 90 days of detention, the accused gets mandatory default bail."
        ],
        exceptions: [
          "Offences punishable with death or life imprisonment generally face stringent bail restrictions under Section 480(1) BNSS, unless the accused is under 16, a woman, or infirm."
        ],
        examples: [
          "Anticipatory Bail: Applied before police arrest when falsely implicated in a commercial or domestic complaint.",
          "Regular Bail: Applied after being formally arrested and remanded to judicial custody."
        ],
        relatedProvisions: [
          "Section 482 BNSS (Direction for grant of bail to person apprehending arrest)",
          "Section 479 BNSS (Relief for first-time offenders who have completed one-third of maximum sentence)"
        ],
        sources: [
          { name: "Bharatiya Nagarik Suraksha Sanhita, 2023", citation: "Sections 478, 480, 482", url: "https://www.indiacode.nic.in", status: "ACTIVE" },
          { name: "Supreme Court Benchmark", citation: "State of Rajasthan v. Balchand (1977) 4 SCC 308 ('Bail not Jail')", url: "https://sci.gov.in", status: "LANDMARK" }
        ],
        dateOrVersion: "BNSS 2023 (replaced CrPC 1973 effective 1 July 2024)"
      }
    },
    hi: {
      shortAnswer: {
        coreText: "**जमानत (Bail)** किसी आरोपी को मुकदमे या जांच के दौरान कुछ शर्तों, व्यक्तिगत मुचलके या जमानतदार के आधार पर हिरासत से रिहा करने की कानूनी व्यवस्था है।",
        simpleMeaning: "भारतीय न्यायशास्त्र का मूल सिद्धांत है: 'जमानत नियम है और जेल अपवाद (Bail is the rule, Jail is an exception)'।",
        source: "भारतीय नागरिक सुरक्षा संहिता (BNSS) 2023 — धारा 478 से 496",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "BNS 2024 लागू प्रक्रिया"
      },
      detailedAnswer: {
        relevantLaw: "भारतीय नागरिक सुरक्षा संहिता, 2023 — धारा 478 (जमानती अपराध), धारा 480 (गैर-जमानती), धारा 482 (अग्रिम जमानत / Anticipatory Bail)।",
        fullExplanation: "जमानती अपराधों में जमानत पाना अभियुक्त का वैधानिक अधिकार है। गैर-जमानती अपराधों में अदालत अपराध की गंभीरता, साक्ष्यों से छेड़छाड़ की संभावना और गवाहों के प्रभाव को देखकर अपने विवेक से जमानत देती है।",
        conditions: [
          "जमानती अपराध: मुचलका प्रस्तुत करने पर पुलिस या कोर्ट तुरंत जमानत देती है।",
          "गैर-जमानती अपराध: मजिस्ट्रेट या सत्र न्यायालय के विवेक पर निर्भर।",
          "अग्रिम जमानत (धारा 482 BNSS): गिरफ्तारी की आशंका होने पर सत्र न्यायालय या उच्च न्यायालय से ली जाती है।"
        ],
        exceptions: [
          "मृत्युदंड या आजीवन कारावास से दंडनीय अपराधों में सामान्यतः जमानत पर कड़े प्रतिबंध होते हैं।"
        ],
        examples: [
          "झूठे मुकदमे की आशंका पर अग्रिम जमानत याचिका दाखिल करना।"
        ],
        relatedProvisions: [
          "धारा 479 BNSS: पहली बार अपराध करने वाले विचाराधीन कैदियों के लिए विशेष राहत।"
        ],
        sources: [
          { name: "भारतीय नागरिक सुरक्षा संहिता 2023", citation: "धारा 478 व 482", url: "https://www.indiacode.nic.in", status: "ACTIVE" }
        ],
        dateOrVersion: "BNSS 2023"
      }
    },
    te: {
      shortAnswer: {
        coreText: "**బెయిల్ (Bail)** అంటే నేరారోపణ ఎదుర్కొంటున్న వ్యక్తిని విచారణ పూర్తయ్యే వరకు షరతులతో కూడిన బాండ్ లేదా పూచీకత్తు ద్వారా కస్టడీ నుండి విడుదల చేసే న్యాయ ప్రక్రియ.",
        simpleMeaning: "భారత న్యాయవ్యవస్థలో సూత్రం: 'బెయిల్ అనేది నియమం, జైలు అనేది మినహాయింపు' (Bail is the rule, jail is an exception).",
        source: "భారతీయ నాగరిక్ సురక్ష సంహిత (BNSS) 2023 — సెక్షన్ 478 నుండి 496",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "BNS 2024 క్రిమినల్ చట్టం"
      },
      detailedAnswer: {
        relevantLaw: "భారతీయ నాగరిక్ సురక్ష సంహిత (BNSS) 2023 — సెక్షన్ 478, 480, 482.",
        fullExplanation: "బెయిలబుల్ నేరాలలో బెయిల్ పొందడం ముద్దాయికి చట్టబద్ధమైన హక్కు. నాన్-బెయిలబుల్ నేరాలలో కోర్టు నేరం తీవ్రతను బట్టి బెయిల్ మంజూరు చేసే విచక్షణాధికారం కలిగి ఉంటుంది.",
        conditions: [
          "బెయిలబుల్ నేరాలు (సెక్షన్ 478): షూరిటీ సమర్పిస్తే వెంటనే విడుదల చేయాలి.",
          "నాన్-బెయిలబుల్ నేరాలు (సెక్షన్ 480): కోర్టు విచక్షణ ఆధారంగా మంజూరు.",
          "ముందస్తు బెయిల్ / యాంటిసిపేటరీ బెయిల్ (సెక్షన్ 482): అరెస్ట్ కాకముందే సెషన్స్ లేదా హైకోర్టులో దరఖాస్తు చేసుకోవచ్చు."
        ],
        exceptions: [
          "తీవ్రమైన నేరాలలో (జీవిత ఖైదు, మరణశిక్ష పడే అవకాశమున్న కేసుల్లో) బెయిల్ నిబంధనలు కఠినంగా ఉంటాయి."
        ],
        examples: [
          "పోలీస్ అరెస్ట్ భయమున్నప్పుడు సెషన్స్ కోర్టులో యాంటిసిపేటరీ బెయిల్ పిటిషన్ వేయడం."
        ],
        relatedProvisions: [
          "BNSS సెక్షన్ 482 (యాంటిసిపేటరీ బెయిల్)",
          "BNSS సెక్షన్ 479 (అండర్‌ట్రయల్ ఖైదీల ఉపశమనం)"
        ],
        sources: [
          { name: "భారతీయ నాగరిక్ సురక్ష సంహిత 2023", citation: "సెక్షన్ 482", url: "https://www.indiacode.nic.in", status: "ACTIVE" }
        ],
        dateOrVersion: "BNSS 2023"
      }
    }
  },

  'what is a fundamental right': {
    en: {
      shortAnswer: {
        coreText: "**Fundamental Rights** are basic human rights guaranteed by the Constitution of India in Part III (Articles 12 to 35) to all individuals against arbitrary state action.",
        simpleMeaning: "They are legally enforceable against the government through writ petitions under Article 32 (Supreme Court) and Article 226 (High Courts).",
        source: "Constitution of India — Part III (Articles 12 to 35)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "Basic Structure of Constitution"
      },
      detailedAnswer: {
        relevantLaw: "Constitution of India, Part III (Articles 12 through 35), forming part of the inviolable 'Basic Structure' doctrine under Kesavananda Bharati (1973).",
        fullExplanation: "The Constitution originally recognized seven Fundamental Rights; following the 44th Constitutional Amendment in 1978, the Right to Property was converted to a constitutional legal right under Article 300A, leaving six broad clusters of Fundamental Rights today.",
        conditions: [
          "1. Right to Equality (Articles 14–18): Equality before law, prohibition of discrimination.",
          "2. Right to Freedom (Articles 19–22): Freedom of speech, assembly, movement, and Article 21 personal liberty.",
          "3. Right against Exploitation (Articles 23–24): Prohibition of trafficking, forced labour, and child labour.",
          "4. Right to Freedom of Religion (Articles 25–28): Freedom of conscience and practice of religion.",
          "5. Cultural and Educational Rights (Articles 29–30): Protection of minority interests.",
          "6. Right to Constitutional Remedies (Article 32): The 'Heart and Soul' of the Constitution to approach the Supreme Court for writ enforcement."
        ],
        exceptions: [
          "Fundamental rights are not absolute; they are subject to 'Reasonable Restrictions' on grounds of public order, national security, morality, and sovereignty of India (e.g. Article 19(2))."
        ],
        examples: [
          "A citizen whose speech is arbitrarily suppressed can file an Article 32 writ directly before the Supreme Court in New Delhi."
        ],
        relatedProvisions: [
          "Article 13 (Laws inconsistent with or in derogation of fundamental rights are void)",
          "Article 32 & 226 (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari)",
          "Article 21A (Right to Free Education)"
        ],
        sources: [
          { name: "Constitution of India", citation: "Part III, Articles 12–35", url: "https://www.indiacode.nic.in", status: "ACTIVE" },
          { name: "Supreme Court 13-Judge Bench", citation: "Kesavananda Bharati v. State of Kerala (1973) 4 SCC 225", url: "https://sci.gov.in", status: "LANDMARK" }
        ],
        dateOrVersion: "Constitution of India (as amended up to 106th Amendment)"
      }
    },
    hi: {
      shortAnswer: {
        coreText: "**मौलिक अधिकार (Fundamental Rights)** भारतीय संविधान के भाग III (अनुच्छेद 12 से 35) में निहित वे मूलभूत अधिकार हैं जो प्रत्येक नागरिक को राज्य के मनमाने आचरण के विरुद्ध गारंटीकृत हैं।",
        simpleMeaning: "यदि सरकार या कोई प्राधिकारी इन अधिकारों का हनन करता है, तो आप अनुच्छेद 32 के तहत सीधे सर्वोच्च न्यायालय या अनुच्छेद 226 के तहत उच्च न्यायालय जा सकते हैं।",
        source: "भारत का संविधान — भाग III (अनुच्छेद 12 से 35)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "संविधान का मूल ढांचा"
      },
      detailedAnswer: {
        relevantLaw: "भारत का संविधान, भाग III (अनुच्छेद 12–35)।",
        fullExplanation: "वर्तमान में भारतीय संविधान 6 श्रेणियों में मौलिक अधिकार प्रदान करता है: समानता का अधिकार (अनुच्छेद 14-18), स्वतंत्रता का अधिकार (अनुच्छेद 19-22), शोषण के विरुद्ध अधिकार (अनुच्छेद 23-24), धार्मिक स्वतंत्रता का अधिकार (अनुच्छेद 25-28), संस्कृति एवं शिक्षा का अधिकार (अनुच्छेद 29-30), और संवैधानिक उपचारों का अधिकार (अनुच्छेद 32)।",
        conditions: [
          "ये अधिकार न्यायालय द्वारा प्रवर्तनीय (Justiciable) हैं।",
          "अनुच्छेद 32 को डॉ. बी.आर. अंबेडकर ने 'संविधान का हृदय और आत्मा' कहा था।"
        ],
        exceptions: [
          "मौलिक अधिकार पूर्णतः निरपेक्ष (Absolute) नहीं हैं; इन पर सार्वजनिक व्यवस्था और राष्ट्रीय सुरक्षा के आधार पर उचित प्रतिबंध (Reasonable Restrictions) लगाए जा सकते हैं।"
        ],
        examples: [
          "अवैध गिरफ्तारी होने पर बंदी प्रत्यक्षीकरण (Habeas Corpus) रिट दायर करना।"
        ],
        relatedProvisions: [
          "अनुच्छेद 13 (असंगत कानून शून्य होंगे)",
          "अनुच्छेद 32 और 226 (रिट अधिकारिता)"
        ],
        sources: [
          { name: "भारत का संविधान", citation: "भाग III", url: "https://www.indiacode.nic.in", status: "ACTIVE" }
        ],
        dateOrVersion: "भारत का संविधान 1950"
      }
    },
    te: {
      shortAnswer: {
        coreText: "**ప్రాథమిక హక్కులు (Fundamental Rights)** అంటే భారత రాజ్యాంగం పార్ట్ III (ఆర్టికల్స్ 12 నుండి 35) ద్వారా ప్రజలకు కల్పించిన అత్యున్నత రక్షణలు.",
        simpleMeaning: "ప్రభుత్వం లేదా అధికారుల నుండి పౌరుల స్వేచ్ఛను, సమానత్వాన్ని రక్షించే చట్టబద్ధమైన హక్కులు. వీటి ఉల్లంఘన జరిగితే నేరుగా సుప్రీంకోర్టును ఆశ్రయించవచ్చు.",
        source: "భారత రాజ్యాంగం — పార్ట్ III (ఆర్టికల్స్ 12–35)",
        sourceUrl: "https://www.indiacode.nic.in",
        statusTag: "రాజ్యాంగ ప్రాథమిక నిర్మాణం"
      },
      detailedAnswer: {
        relevantLaw: "భారత రాజ్యాంగం, భాగం III (ఆర్టికల్స్ 12 నుండి 35).",
        fullExplanation: "భారత రాజ్యాంగం ప్రస్తుతం 6 ముఖ్యమైన ప్రాథమిక హక్కులను అందిస్తుంది: సమానత్వ హక్కు (ఆర్టికల్ 14-18), స్వేచ్ఛా హక్కు (ఆర్టికల్ 19-22), దోపిడీని నిరోధించే హక్కు (ఆర్టికల్ 23-24), మత స్వాతంత్ర్య హక్కు (ఆర్టికల్ 25-28), విద్యా, సాంస్కృతిక హక్కులు (ఆర్టికల్ 29-30), రాజ్యాంగ పరిహారాల హక్కు (ఆర్టికల్ 32).",
        conditions: [
          "కోర్టుల ద్వారా అమలు చేయించగల హక్కులు (Justiciable Rights).",
          "ఆర్టికల్ 32 ద్వారా నేరుగా సుప్రీంకోర్టులో రిట్ పిటిషన్ దాఖలు చేయవచ్చు."
        ],
        exceptions: [
          "దేశ భద్రత, శాంతిభద్రతల పరిరక్షణ కోసం సహేతుకమైన పరిమితులు (Reasonable Restrictions) ఉంటాయి."
        ],
        examples: [
          "చట్టవిరుద్ధంగా నిర్బంధిస్తే హెబియస్ కార్పస్ రిట్ ద్వారా విడుదల పొందడం."
        ],
        relatedProvisions: [
          "ఆర్టికల్ 13, ఆర్టికల్ 32 మరియు ఆర్టికల్ 226"
        ],
        sources: [
          { name: "భారత రాజ్యాంగం", citation: "భాగం III", url: "https://www.indiacode.nic.in", status: "ACTIVE" }
        ],
        dateOrVersion: "భారత రాజ్యాంగం"
      }
    }
  }
};

// Normalizes query string for matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[?.,!/\\-_'"`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check for curated match
export function findCuratedAnswer(query: string, language: LanguageCode): FloatingAnswer | null {
  const norm = normalizeText(query);
  for (const [key, langMap] of Object.entries(CURATED_LEGAL_ANSWERS)) {
    if (norm.includes(key) || key.includes(norm)) {
      return langMap[language] || langMap['en'];
    }
  }
  return null;
}

// Convert raw markdown text into structured shortAnswer + detailedAnswer
export function parseLegalResponseToFloatingAnswer(
  rawMarkdown: string, 
  query: string, 
  ragDocs: RetrievedDocument[],
  isResearchMode: boolean = false
): FloatingAnswer {
  // Extract sections if present
  const extractSection = (headingRegex: RegExp): string => {
    const match = rawMarkdown.match(headingRegex);
    return match ? match[1].trim() : '';
  };

  const shortAnsRaw = extractSection(/### Short Answer([\s\S]*?)(?=### Relevant Law|### Explanation|$)/i);
  const relevantLawRaw = extractSection(/### Relevant Law([\s\S]*?)(?=### Explanation|### Important Conditions|$)/i);
  const explanationRaw = extractSection(/### Explanation([\s\S]*?)(?=### Important Conditions|### What You Can Do|$)/i);
  const conditionsRaw = extractSection(/### Important Conditions & Exceptions([\s\S]*?)(?=### What You Can Do|### Source|$)/i);
  const sourcesRaw = extractSection(/### Source & Citation([\s\S]*?)(?=### Important Notice|$)/i);

  const topDoc = ragDocs[0];

  const coreText = shortAnsRaw || rawMarkdown.slice(0, 260).replace(/###/g, '').trim();
  const simpleMeaning = explanationRaw 
    ? explanationRaw.split('\n\n')[0].replace(/\*\*/g, '').slice(0, 200) + '...'
    : 'Under Indian legal framework, rights and liabilities are determined by statutory enactments and applicable judicial precedents.';
  
  const sourceText = sourcesRaw || (topDoc ? `${topDoc.title} (${topDoc.type})` : 'Constitution of India / India Code (indiacode.nic.in)');
  const sourceUrl = topDoc ? topDoc.sourceUrl : 'https://www.indiacode.nic.in';

  // Parse conditions into bullet points
  const conditions = conditionsRaw
    ? conditionsRaw.split('\n').map(l => l.replace(/^[-*•\d.]\s*/, '').trim()).filter(l => l.length > 5)
    : ['Statutory limitation periods apply under the Limitation Act 1963.', 'Territorial and pecuniary jurisdiction must be verified with eCourts.'];

  const sourcesList: FloatingAnswerSource[] = ragDocs.slice(0, 3).map(doc => ({
    name: doc.title,
    citation: doc.citationOrNumber || doc.type,
    url: doc.sourceUrl,
    status: doc.status || 'ACTIVE'
  }));

  if (sourcesList.length === 0) {
    sourcesList.push({
      name: "Authoritative Indian Statutory Repository",
      citation: "India Code / Supreme Court of India",
      url: "https://www.indiacode.nic.in",
      status: "ACTIVE"
    });
  }

  return {
    shortAnswer: {
      coreText: coreText,
      simpleMeaning: simpleMeaning,
      source: sourceText.replace(/^###\s*/, '').trim(),
      sourceUrl: sourceUrl,
      statusTag: isResearchMode ? '🔎 Research Citations' : 'Statutory Reference'
    },
    detailedAnswer: {
      fullExplanation: (explanationRaw || rawMarkdown).replace(/### (Short Answer|Relevant Law|Explanation|Important Conditions & Exceptions|What You Can Do|Source & Citation|Important Notice)/g, '#### $1'),
      relevantLaw: relevantLawRaw || (topDoc ? `${topDoc.title} (${topDoc.status || 'ACTIVE'})` : 'Constitution of India, BNS 2023, and applicable Civil/Criminal Codes'),
      conditions: conditions.length > 0 ? conditions : ['Procedure established by law must be strictly adhered to.'],
      exceptions: [
        'Subject to lawful police/judicial processes and statutory exceptions.',
        'May vary according to state-level amendments and local court rules.'
      ],
      examples: [
        'Consult the eCourts services portal (ecourts.gov.in) to verify CNR tracking or cause list postings.',
        'Check NALSA (nalsa.gov.in) for legal aid eligibility under Section 12 of Legal Services Authorities Act 1987.'
      ],
      relatedProvisions: [
        'Bharatiya Nyaya Sanhita (BNS) 2023',
        'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
        'Bharatiya Sakshya Adhiniyam (BSA) 2023'
      ],
      sources: sourcesList,
      dateOrVersion: isResearchMode ? 'Comprehensive Jurisprudential Citation (Current through 2024 enactments)' : 'Standard Statutory Guidance (2024)'
    }
  };
}

// Main execution function for Floating Chatbot
export async function executeFloatingQuery(params: {
  query: string;
  language: LanguageCode;
  isResearchMode: boolean;
  attachedDocument?: {
    fileName: string;
    fileType: string;
    fileContent?: string;
    data?: string;
    mimeType?: string;
  };
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<FloatingAnswer> {
  const { query, language, isResearchMode, attachedDocument, history = [] } = params;

  // 1. Check curated knowledge base if no attached document and standard query
  if (!attachedDocument) {
    const curated = findCuratedAnswer(query, language);
    if (curated) {
      return curated;
    }
  }

  // 2. Perform RAG query
  const ragDocs = searchLegalKnowledgeBase(query, { limit: 4 });

  // 3. Document or Image context preparation
  let promptQuery = query;
  let attachedImgPayload = undefined;

  if (attachedDocument) {
    if (attachedDocument.data && (attachedDocument.fileType.includes('image') || attachedDocument.data.startsWith('data:image'))) {
      attachedImgPayload = {
        data: attachedDocument.data,
        mimeType: attachedDocument.mimeType || 'image/jpeg',
        fileName: attachedDocument.fileName
      };
      promptQuery = `[Document Analysis Request: ${attachedDocument.fileName}]\n${query}`;
    } else if (attachedDocument.fileContent) {
      promptQuery = `[Document Content Attached: ${attachedDocument.fileName}]\nExcerpt:\n${attachedDocument.fileContent.slice(0, 3000)}\n\nUser Question: ${query}`;
    }
  }

  // 4. Generate response via Gemini or fallback engine
  try {
    const rawMarkdown = await generateLegalChatResponse({
      userQuery: promptQuery,
      history: history,
      language: language,
      mode: isResearchMode ? 'research' : 'standard',
      ragContext: ragDocs,
      image: attachedImgPayload
    });

    return parseLegalResponseToFloatingAnswer(rawMarkdown, query, ragDocs, isResearchMode);
  } catch (error) {
    console.error('Error in executeFloatingQuery:', error);
    // Fallback parsing with RAG docs
    const fallbackMd = `### Short Answer\nUnder Indian law, inquiries regarding "${query}" require statutory verification of active provisions and jurisdictional rules.\n\n### Relevant Law\nConstitution of India and Bharatiya Nyaya Sanhita 2023.\n\n### Explanation\nIndian jurisprudence provides specific statutory procedures. Since 1 July 2024, the new criminal laws (BNS, BNSS, BSA) govern offences committed on or after that date.\n\n### Source & Citation\nIndia Code (indiacode.nic.in)`;
    return parseLegalResponseToFloatingAnswer(fallbackMd, query, ragDocs, isResearchMode);
  }
}
