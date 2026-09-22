export interface EtiquetteGuideline {
  category: string;
  title: string;
  summary: string;
  isCourtSpecific: boolean;
  courtTypeOrScope: string;
  rules: string[];
  doAndDonts: {
    dos: string[];
    donts: string[];
  };
}

export interface AdvocatePathwayStep {
  stepNumber: number;
  stage: string;
  title: string;
  duration: string;
  description: string;
  requirements: string[];
  authoritativeSource: string;
  lastCheckedDate: string;
}

export interface AdvocateRoleDetail {
  title: string;
  definition: string;
  keyResponsibilities: string[];
  statutoryBasis: string;
  ethicalDuties: string[];
}

export const COURTROOM_ETIQUETTE: EtiquetteGuideline[] = [
  {
    category: 'Addressing the Bench',
    title: 'How to Address the Presiding Judge',
    summary: 'Standard honorifics and forms of address across Indian courts.',
    isCourtSpecific: true,
    courtTypeOrScope: 'Supreme Court, High Courts, and Subordinate Courts',
    rules: [
      'In the Supreme Court and High Courts, the customary address has traditionally been "My Lord" or "Your Lordship" (or "Your Ladyship" for female judges).',
      'In 2006, the Bar Council of India approved a resolution stating that addressing the court as "Your Honour", or simply "Sir" or "Madam" in any court is respectful, appropriate, and lawful.',
      'In District and Magistrate courts, "Your Honour" or "Sir / Madam" is the standard and widely accepted form of address.',
      'Always stand when speaking to the Judge or when the Judge speaks to you.',
      'Never interrupt the Judge while they are speaking or dictating an order.'
    ],
    doAndDonts: {
      dos: [
        'Say "May it please Your Honour / My Lord..." when beginning an argument.',
        'Address female judges respectfully as "Madam" or "Your Ladyship".',
        'Maintain a moderate, calm, and audible tone without shouting.'
      ],
      donts: [
        'Do not address the Judge as "Mister", "Judge", or informal titles.',
        'Do not raise your voice in anger or argue after an adverse order is dictated.',
        'Do not speak while the Judge is conferring with court staff or opposing counsel.'
      ]
    }
  },
  {
    category: 'Attire & Appearance',
    title: 'Court Dress Code: Advocates vs. Litigants / Public',
    summary: 'Prescribed attire under Bar Council of India rules and general courtroom standards.',
    isCourtSpecific: false,
    courtTypeOrScope: 'Universal across Indian Courts',
    rules: [
      'Advocates (Male): Black buttoned-up coat, chapkan, achkan, black sherwani and white bands with advocate gown; or black open collar coat, white shirt, white collar, stiff or soft, and white bands with advocate gown.',
      'Advocates (Female): Black and white formal dress, sarees or salwar kameez in white, cream or subdued colours, with black coat and white bands.',
      'Advocate Gowns: Mandatory in Supreme Court and High Courts. In subordinate courts, gowns are generally dispensed with during summer months as per High Court notifications.',
      'Litigants & Public: Modest, sober, clean clothing. Dark or neutral formal/semi-formal clothing is recommended. Avoid flashy or casual beachwear.',
    ],
    doAndDonts: {
      dos: [
        'Wear formal, subdued clothing (collared shirts, formal trousers, sarees, or salwar suits).',
        'Tuck in shirts and wear formal closed footwear.',
        'Ensure grooming is neat and conservative.'
      ],
      donts: [
        'Do NOT wear shorts, graphic t-shirts, sleeveless tops, or casual slippers.',
        'Never wear hats, caps, or sunglasses inside the courtroom unless for certified medical reasons.',
        'Non-advocates must never wear advocate bands or black advocate gowns.'
      ]
    }
  },
  {
    category: 'Courtroom Decorum',
    title: 'General Behaviour, Decorum and Electronic Devices',
    summary: 'Maintaining judicial decorum and avoiding criminal contempt under the Contempt of Courts Act, 1971.',
    isCourtSpecific: false,
    courtTypeOrScope: 'All Courts and Tribunals in India',
    rules: [
      'Bow slightly towards the dais / National Emblem upon entering and when leaving the courtroom while court is in session.',
      'Stand in silence when the Judge enters or exits the courtroom until the Judge is seated.',
      'Mobile Phones: Must be switched off or placed in strict silent mode. A ringing phone in court can attract a fine or seizure of device.',
      'Photography & Audio/Video Recording: Strictly forbidden inside court halls without express written permission of the Chief Justice or Registrar.',
      'Item Numbers & Cause Lists: Check the daily cause list on notice boards or eCourts app for your item number. Enter quietly when your item is called.',
    ],
    doAndDonts: {
      dos: [
        'Keep mobile devices switched off or on silent mode.',
        'Arrive at least 30 minutes before the court convenes (typically 10:30 AM).',
        'Step forward to the bar table or podium only when your case item number is called.'
      ],
      donts: [
        'Do not chew gum, eat snacks, or sip drinks inside the courtroom.',
        'Do not take phone calls or converse loudly in the public gallery.',
        'Do not record audio or take photos under any circumstance (constitutes contempt of court).'
      ]
    }
  },
];

export const ADVOCATE_ROLES: AdvocateRoleDetail[] = [
  {
    title: 'Advocate vs. Lawyer vs. Senior Advocate vs. AoR',
    definition: 'A "Lawyer" is someone who holds a recognized Bachelor of Laws (LL.B) degree. An "Advocate" is a lawyer who is formally enrolled on the roll of a State Bar Council under the Advocates Act, 1961, has cleared the All India Bar Examination (AIBE), and has the exclusive right of audience in Indian courts.',
    keyResponsibilities: [
      'Client Representation: Plead, argue, and represent parties before judicial, quasi-judicial, and tribunal authorities.',
      'Drafting & Pleadings: Draft plaints, written statements, writ petitions, legal notices, and affidavits.',
      'Officer of the Court: Assist the court in administering justice; duty to the court supersedes client instructions.',
      'Legal Research & Advisory: Interpret statutory provisions, precedents, and advise on legal liabilities.'
    ],
    statutoryBasis: 'Advocates Act, 1961 (Act No. 25 of 1961), Bar Council of India Rules, Part VI.',
    ethicalDuties: [
      'Privileged Professional Communication: Under Section 126 of Bharatiya Sakshya Adhiniyam, 2023 (formerly Sec 126 Evidence Act), an advocate cannot disclose client communications without express consent.',
      'No Contingency Fees: An advocate shall not stipulate for a fee contingent on the results of litigation or agree to share the proceeds.',
      'No Conflict of Interest: Cannot represent a party against a former client in the same or closely related matter.',
      'Prohibition on Solicitation: Under Rule 36 of BCI Rules, advocates cannot advertise or solicit work through commercials, banners, or touts.',
      'Legal Aid: Duty under Rule 46 to render free legal assistance to indigent and oppressed persons.'
    ]
  }
];

export const BECOME_A_LAWYER_PATHWAY: AdvocatePathwayStep[] = [
  {
    stepNumber: 1,
    stage: 'Academic Foundation',
    title: 'Select Law Pathway: 5-Year Integrated vs. 3-Year LL.B',
    duration: '5 Years or 3 Years (+ graduation)',
    description: 'Candidates can choose between two main routes recognized by the Bar Council of India: (A) 5-Year Integrated Law (BA LLB, BBA LLB, B.Com LLB, B.Sc LLB) directly after 10+2 high school, or (B) 3-Year LL.B after completing a Bachelor degree in any academic discipline (Arts, Science, Commerce, Engineering, etc.).',
    requirements: [
      '5-Year Course: Minimum 45% aggregate in 10+2 (40% for SC/ST).',
      '3-Year Course: Minimum 45% in undergraduate degree from a recognized university.',
      'Law entrance exams: CLAT, AILET, LSAT-India, SLAT, MH-CET Law, CUET PG.'
    ],
    authoritativeSource: 'Bar Council of India Legal Education Rules, 2008',
    lastCheckedDate: '2024-07-01'
  },
  {
    stepNumber: 2,
    stage: 'Law School Education',
    title: 'Complete LL.B Degree with Mandatory Internships',
    duration: 'Full course duration',
    description: 'Study core legal subjects mandated by BCI: Constitutional Law, Criminal Laws (BNS, BNSS, BSA), Civil Procedure Code, Law of Contracts, Torts, Property Law, Company Law, Administrative Law, and Alternative Dispute Resolution (ADR).',
    requirements: [
      'Maintain required university attendance (minimum 70%).',
      'Complete minimum 12 weeks (3-year) or 20 weeks (5-year) of internships with advocates, trial courts, NGOs, commissions, or corporate legal departments.',
      'Pass all semester theory, clinical legal education, and moot court examinations.'
    ],
    authoritativeSource: 'Bar Council of India Curriculum Guidelines',
    lastCheckedDate: '2024-07-01'
  },
  {
    stepNumber: 3,
    stage: 'Bar Enrollment',
    title: 'Provisional Enrollment with State Bar Council',
    duration: '1 to 2 months post-graduation',
    description: 'Upon passing all LL.B exams and receiving provisional/final degree certificates, submit an enrollment application to the respective State Bar Council (e.g., Bar Council of Delhi, Bar Council of Maharashtra & Goa, Bar Council of Uttar Pradesh, Bar Council of Andhra Pradesh/Telangana).',
    requirements: [
      'Indian citizenship, age 21+.',
      'Submission of character certificates, degree verification, and prescribed state enrollment fees.',
      'Receives State Bar Council Provisional Enrollment Number and identity card.'
    ],
    authoritativeSource: 'Section 24 of the Advocates Act, 1961',
    lastCheckedDate: '2024-07-01'
  },
  {
    stepNumber: 4,
    stage: 'Qualifying Examination',
    title: 'Clear the All India Bar Examination (AIBE)',
    duration: 'Within 2 years of State Enrollment',
    description: 'A national-level certifying exam conducted by the Bar Council of India to evaluate basic analytical skills and foundational knowledge of substantive and procedural Indian law.',
    requirements: [
      'Must appear and pass AIBE within 2 years of provisional enrollment to retain right of practice.',
      'Pass mark is 45% for General/OBC and 40% for SC/ST candidates.',
      'Allows use of Bare Acts without notes or commentary.'
    ],
    authoritativeSource: 'Bar Council of India All India Bar Examination Rules (as amended)',
    lastCheckedDate: '2024-07-01'
  },
  {
    stepNumber: 5,
    stage: 'Practice Certification',
    title: 'Issuance of Certificate of Practice (CoP)',
    duration: 'Lifelong with periodic verification',
    description: 'On passing AIBE, the Bar Council of India issues the Certificate of Practice (CoP). With the CoP, the advocate is fully licensed to plead and appear in any court, tribunal, or forum across India.',
    requirements: [
      'Join local Bar Association (District Court / High Court Bar Association).',
      'Affix Welfare Fund stamps on every filed Vakalatnama.',
      'Comply with the Bar Council of India Certificate and Place of Practice (Verification) Rules.'
    ],
    authoritativeSource: 'BCI Certificate and Place of Practice Rules',
    lastCheckedDate: '2024-07-01'
  },
  {
    stepNumber: 6,
    stage: 'Specialized Progression',
    title: 'Supreme Court Advocate-on-Record (AoR) or Senior Designation',
    duration: 'Advanced Career Milestones',
    description: 'To file cases in the Supreme Court of India, advocates must qualify the Advocate-on-Record (AoR) Examination. Experienced advocates with distinguished standing may also be designated as "Senior Advocates" by the Full Court under Section 16 of the Advocates Act.',
    requirements: [
      'AoR: 4 years of continuous practice + 1 year of training under a designated AoR + passing 4 written papers set by Supreme Court.',
      'Senior Advocate: Minimum 10 years of practice, evaluated on reported judgments, pro bono work, and legal acumen under Supreme Court / High Court guidelines.'
    ],
    authoritativeSource: 'Supreme Court Rules, 2013 & Indira Jaising Guidelines',
    lastCheckedDate: '2024-07-01'
  }
];

export const CNR_NUMBER_GUIDE = {
  title: 'Understanding the 16-Digit CNR Number',
  explanation: 'CNR stands for "Case Number Record". It is a unique 16-character alphanumeric identifier assigned to every single case filed across any district or subordinate court complex in India through the eCourts platform.',
  exampleFormat: 'MHAM01-004567-2024',
  breakdown: [
    { code: 'MH', meaning: 'State Code (2 Letters) — e.g., MH for Maharashtra, DL for Delhi, UP for Uttar Pradesh, TS for Telangana, KA for Karnataka.' },
    { code: 'AM', meaning: 'District Code (2 Letters) — e.g., AM for Amravati, SC for South Central, etc.' },
    { code: '01', meaning: 'Court Establishment Code (2 Digits) — identifies the specific court complex within the district.' },
    { code: '004567', meaning: 'Case Registration Serial Number (6 Digits) — sequential number assigned in that calendar year.' },
    { code: '2024', meaning: 'Year of Registration (4 Digits) — the year the case was formally registered in the court system.' }
  ],
  howToSearch: [
    'Visit https://services.ecourts.gov.in or download the official eCourts Services mobile app.',
    'Click on "CNR Search" option.',
    'Enter your 16-character CNR number without spaces or dashes.',
    'Instantly view: Current Stage of Case, Next Hearing Date, Coram / Presiding Judge, Business on Date, Daily Orders, and Final Judgments.'
  ]
};

export const LEGAL_AID_NALSA_GUIDE = {
  title: 'Free Legal Aid under NALSA (Legal Services Authorities Act, 1987)',
  statutoryBasis: 'Section 12 of the Legal Services Authorities Act, 1987 (Act No. 39 of 1987) & Article 39A of the Constitution of India.',
  whoIsEligible: [
    'Women and children',
    'Members of Scheduled Castes (SC) or Scheduled Tribes (ST)',
    'Industrial workmen',
    'Victims of human trafficking or beggar as referred to in Article 23 of the Constitution',
    'Persons with disability (including mental or physical disabilities)',
    'Persons in custody (undertrial prisoners, juveniles in remand homes, psychiatric patients)',
    'Victims of mass disasters, ethnic violence, caste atrocities, floods, droughts, earthquakes, or industrial disasters',
    'General citizens whose annual income is less than statutory state limits (typically ₹1,00,000 to ₹3,00,000 depending on the state, or ₹5,00,000 for cases before the Supreme Court Legal Services Committee).'
  ],
  servicesProvided: [
    'Provision of an experienced panel lawyer at government expense.',
    'Payment of court fees, process fees, drafting expenses, typing, and paper books.',
    'Expenses for certified copies of orders and judgments.',
    'Representation in Civil suits, Criminal trials, Bail applications, Writs, and Appeals.'
  ],
  howToApply: [
    'Online: Submit an application through the NALSA Legal Services Portal (nalsa.gov.in) or State Legal Services Authority (SLSA) website.',
    'Offline: Walk into the Front Office of the District Legal Services Authority (DLSA) situated in every District Court complex or Taluk Legal Services Committee (TLSC).',
    'National Legal Helpline: Dial toll-free national number 15100.'
  ]
};
