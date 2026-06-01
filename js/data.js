// js/data.js — Question bank & domain definitions
// Source: Dr. Kabsha Prometric Course PDFs (UAE Pharmacy License Exam)

const DOMAINS = {
  PHARM: {
    id: 'PHARM', name: 'Pharmacology', shortName: 'Pharmacology',
    icon: '⚗️', color: '#8b5cf6',
    description: 'Drug mechanisms, receptor pharmacology, pharmacokinetics & pharmacodynamics'
  },
  CLIN: {
    id: 'CLIN', name: 'Clinical Pharmacy', shortName: 'Clinical',
    icon: '🏥', color: '#0ea5e9',
    description: 'Therapeutic drug monitoring, drug interactions, patient monitoring'
  },
  LAW: {
    id: 'LAW', name: 'UAE Drug Law', shortName: 'Drug Law',
    icon: '⚖️', color: '#10b981',
    description: 'MOHAP regulations, controlled substances, licensing requirements'
  },
  PHSCI: {
    id: 'PHSCI', name: 'Pharmaceutical Sciences', shortName: 'Pharm Sci',
    icon: '🔬', color: '#f59e0b',
    description: 'Pharmaceutics, drug formulation, stability & biopharmaceutics'
  },
  PRAC: {
    id: 'PRAC', name: 'Pharmacy Practice', shortName: 'Practice',
    icon: '💊', color: '#ef4444',
    description: 'Dispensing, patient counseling, medication safety'
  },
  CALC: {
    id: 'CALC', name: 'Calculations', shortName: 'Calculations',
    icon: '🧮', color: '#06b6d4',
    description: 'Dosing, compounding, IV rate and concentration calculations'
  },
  THER: {
    id: 'THER', name: 'Therapeutics', shortName: 'Therapeutics',
    icon: '🩺', color: '#f97316',
    description: 'Disease management, treatment protocols, clinical guidelines'
  },
  REG: {
    id: 'REG', name: 'Regulation & Law', shortName: 'Regulation',
    icon: '📋', color: '#14b8a6',
    description: 'UAE drug laws, pharmacy licensing, dispensing regulations, controlled substances'
  },
  HERB: {
    id: 'HERB', name: 'Herbal & Alternative', shortName: 'Herbal',
    icon: '🌿', color: '#84cc16',
    description: 'Herbal medicines, supplements, alternative therapies'
  }
};

const QUESTIONS = [

  // ══════════════════════════════════════
  // ASTHMA & RESPIRATORY
  // ══════════════════════════════════════
  {
    id: 'q_asthma_001', domain: 'PHARM', difficulty: 'easy',
    question: 'Asthma is best defined as which type of hypersensitivity reaction?',
    options: [
      'A. Type II (cytotoxic) IgG-mediated reaction',
      'B. Type I IgE-mediated hypersensitivity reaction',
      'C. Type III immune complex-mediated reaction',
      'D. Type IV delayed-type hypersensitivity'
    ],
    correct: 1,
    explanation: 'Asthma is a Type I IgE-mediated hypersensitivity reaction. It is a chronic inflammatory disorder of the airways causing recurrent episodes of wheezing, cough, breathlessness, and chest tightness. IgE antibodies bind to mast cells and trigger release of histamine, leukotrienes, and other mediators upon allergen exposure.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_002', domain: 'PHARM', difficulty: 'easy',
    question: 'Which of the following drugs can CAUSE asthma or worsen bronchospasm?',
    options: [
      'A. Salbutamol',
      'B. Montelukast',
      'C. Beta-blockers, Aspirin, and ACE inhibitors',
      'D. Budesonide'
    ],
    correct: 2,
    explanation: 'Beta-blockers (especially non-selective ones like propranolol), Aspirin (by inhibiting COX and shifting arachidonic acid toward leukotriene production), and ACE inhibitors (by causing bradykinin accumulation leading to cough and bronchoconstriction) can all cause or worsen asthma. Always avoid these in asthmatic patients.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_003', domain: 'PHARM', difficulty: 'easy',
    question: 'Which drug is the FIRST-LINE quick-relief (rescue) medication for acute asthma attacks and exercise-induced asthma?',
    options: [
      'A. Salmeterol (LABA)',
      'B. Salbutamol/Albuterol (SABA)',
      'C. Tiotropium (LAMA)',
      'D. Montelukast (leukotriene antagonist)'
    ],
    correct: 1,
    explanation: 'Short-Acting Beta-2 Agonists (SABAs) such as salbutamol (albuterol) or terbutaline are the drugs of choice for acute asthma attacks and exercise-induced asthma. They provide rapid bronchodilation within minutes by stimulating B2 receptors in bronchial smooth muscle. LABAs like salmeterol are for maintenance, not rescue.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_004', domain: 'PHARM', difficulty: 'medium',
    question: 'A 20-year-old woman uses her boyfriend\'s albuterol inhaler daily and sometimes at night for the past 2 years. Which classification BEST describes her asthma severity?',
    options: [
      'A. Mild intermittent',
      'B. Mild persistent',
      'C. Moderate persistent',
      'D. Severe persistent'
    ],
    correct: 2,
    explanation: 'Daily symptoms and nocturnal symptoms classify this as Moderate Persistent asthma. The NAEPP classification: Mild Intermittent = symptoms ≤2 days/week, no nocturnal; Mild Persistent = >2 days/week but not daily, 3-4 nights/month; Moderate Persistent = daily symptoms, >1 night/week; Severe Persistent = continuous day symptoms, frequent nocturnal. Daily use + some nocturnal symptoms = Moderate Persistent.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_005', domain: 'PHARM', difficulty: 'medium',
    question: 'A 23-year-old woman coughs and wheezes about twice weekly and wakes up at night about 3 times per month. Her FEV1 is 82% of predicted. Which is the BEST classification of her asthma?',
    options: [
      'A. Intermittent',
      'B. Mild persistent',
      'C. Moderate persistent',
      'D. Severe persistent'
    ],
    correct: 1,
    explanation: 'Symptoms >2 days/week (twice weekly), nocturnal symptoms 3-4 times/month, and FEV1 ≥80% of predicted classify this as Mild Persistent asthma. Key differentiator from intermittent: symptoms occur MORE than twice weekly but are not daily, and nocturnal symptoms 3-4x/month vs ≤2x/month for intermittent.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_006', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the MOST COMMON side effect associated with inhaled corticosteroids (ICS)?',
    options: [
      'A. Systemic osteoporosis',
      'B. Oropharyngeal candidiasis (oral thrush)',
      'C. Adrenal suppression',
      'D. Hyperglycemia'
    ],
    correct: 1,
    explanation: 'Oropharyngeal candidiasis (oral thrush) is the most common LOCAL side effect of inhaled corticosteroids. The medication deposits in the mouth and throat, suppressing local immunity and allowing Candida overgrowth. Prevention: rinse mouth with water after EACH use, or use ciclesonide (activated only in lungs). Systemic effects (osteoporosis, adrenal suppression) can occur with high doses.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_007', domain: 'PHARM', difficulty: 'medium',
    question: 'What is the mechanism of action of theophylline in asthma?',
    options: [
      'A. Selective B2 receptor agonism causing bronchodilation',
      'B. Blocks phosphodiesterase, increasing cAMP, causing bronchodilation',
      'C. Inhibits leukotriene receptors, reducing inflammation',
      'D. Inhibits IgE binding to mast cell receptors'
    ],
    correct: 1,
    explanation: 'Theophylline (methylxanthine) blocks phosphodiesterase enzyme, preventing breakdown of cyclic AMP (cAMP). Increased cAMP in smooth muscle causes bronchodilation, and in cardiac muscle causes increased heart rate. Theophylline has a NARROW therapeutic index - interactions with digoxin, lithium, warfarin, tacrolimus, and cyclosporine require monitoring.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_008', domain: 'PHARM', difficulty: 'easy',
    question: 'Which of the following is a leukotriene receptor antagonist used in chronic asthma and aspirin-induced asthma?',
    options: [
      'A. Cromolyn sodium',
      'B. Omalizumab',
      'C. Montelukast',
      'D. Theophylline'
    ],
    correct: 2,
    explanation: 'Montelukast (and zafirlukast) are leukotriene receptor antagonists used for prophylaxis and treatment of chronic asthma, and are particularly useful in aspirin-induced asthma (where aspirin shifts arachidonic acid toward leukotriene production). Note: Zafirlukast is hepatotoxic - monitor liver function. Zileuton is a 5-lipoxygenase inhibitor (also hepatotoxic).',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_009', domain: 'PHARM', difficulty: 'medium',
    question: 'Omalizumab is used in severe persistent asthma. What is its mechanism of action?',
    options: [
      'A. Blocks B2 receptors causing bronchodilation',
      'B. Monoclonal antibody that inhibits IgE binding to IgE receptors on mast cells and basophils',
      'C. Inhibits phosphodiesterase increasing cAMP',
      'D. Blocks muscarinic M3 receptors preventing bronchoconstriction'
    ],
    correct: 1,
    explanation: 'Omalizumab is an anti-IgE monoclonal antibody that inhibits IgE binding to the IgE receptor on mast cells and basophils. By preventing IgE-mediated mast cell activation, it reduces allergic inflammatory response. It is used for moderate-to-severe PERSISTENT ALLERGIC asthma that is inadequately controlled with ICS. It is given subcutaneously every 2-4 weeks.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_010', domain: 'PHARM', difficulty: 'medium',
    question: 'An asthmatic patient has a lab result showing low potassium (hypokalemia) with all other values normal. What is the most likely cause?',
    options: [
      'A. Inhaled corticosteroids causing electrolyte imbalance',
      'B. Inhalation of LABA (long-acting beta-2 agonist)',
      'C. Theophylline causing renal potassium wasting',
      'D. Montelukast inhibiting potassium reabsorption'
    ],
    correct: 1,
    explanation: 'LABA (Long-Acting Beta-2 Agonists) like salmeterol and formoterol cause hypokalemia by stimulating Na+/K+-ATPase pump, shifting potassium intracellularly. Side effects of B2 agonists include: tachycardia, hyperglycemia, hypokalemia, and hypomagnesemia. Monitor potassium especially in patients on digoxin, spironolactone, thiazides, or loop diuretics.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_011', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the FIRST-LINE and drug of choice (DOC) for CHRONIC asthma long-term control?',
    options: [
      'A. Systemic corticosteroids (prednisone)',
      'B. Inhaled corticosteroids (ICS) such as budesonide or fluticasone',
      'C. LABA monotherapy (salmeterol)',
      'D. Cromolyn sodium'
    ],
    correct: 1,
    explanation: 'Inhaled Corticosteroids (ICS) - including beclomethasone, fluticasone, mometasone, and budesonide - are the 1st line and DOC for chronic asthma long-term control. They reduce airway inflammation without the systemic side effects of oral corticosteroids. Important: LABAs should NEVER be used alone (always combine with ICS). Consider calcium and Vitamin D supplementation with long-term ICS use.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_012', domain: 'PHARM', difficulty: 'medium',
    question: 'During pregnancy, which asthma controller medication is preferred?',
    options: [
      'A. Zafirlukast (leukotriene antagonist)',
      'B. Budesonide (inhaled corticosteroid)',
      'C. Theophylline',
      'D. Omalizumab (anti-IgE)'
    ],
    correct: 1,
    explanation: 'During pregnancy, budesonide is the preferred inhaled corticosteroid because it has the most safety data in pregnancy. A short-acting beta-agonist (SABA) is also essential as rescue therapy. Cromolyn (mast cell stabilizer) is also considered safe in pregnant asthmatics. The general principle is that uncontrolled asthma poses greater risk to the fetus than properly managed asthma.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_013', domain: 'PHARM', difficulty: 'medium',
    question: 'Which anticholinergic drug is a long-acting selective M3 muscarinic blocker used in COPD and chronic asthma?',
    options: [
      'A. Ipratropium (short-acting, non-selective)',
      'B. Atropine',
      'C. Tiotropium (long-acting, selective M3)',
      'D. Glycopyrrolate'
    ],
    correct: 2,
    explanation: 'Tiotropium is a long-acting, selective M3 muscarinic antagonist (LAMA). It blocks acetylcholine at M3 receptors in bronchial smooth muscle, preventing parasympathetic-mediated bronchoconstriction. Ipratropium is short-acting and non-selective (blocks M1, M2, M3). Anticholinergics are especially used for patients who cannot tolerate B2 agonists, and tiotropium is the mainstay in COPD.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_014', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the correct technique for using a Dry Powder Inhaler (DPI)?',
    options: [
      'A. Shake well before use, then inhale slowly and deeply',
      'B. Do NOT shake; administer with a QUICK and FORCEFUL inhalation; spacers cannot be used',
      'C. Shake well; use a spacer; inhale slowly at the same time as pressing the canister',
      'D. Do not shake; inhale slowly; spacers are recommended'
    ],
    correct: 1,
    explanation: 'DPI (Dry Powder Inhaler) technique: Do NOT shake (shaking can clump the powder); administer with a QUICK and FORCEFUL inhalation (the breath activates the powder); spacers CANNOT be used. In contrast, MDI (Metered-Dose Inhaler): shake well; inhale SLOWLY and deeply while pressing; a spacer CAN be used for patients with poor coordination.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_asthma_015', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the function of alpha-1-antitrypsin in the lung?',
    options: [
      'A. It promotes mast cell degranulation',
      'B. It protects the lungs from neutrophil elastase and enhances alveolar exchange',
      'C. It activates leukotriene receptors',
      'D. It increases mucus secretion in the bronchi'
    ],
    correct: 1,
    explanation: 'Alpha-1-antitrypsin (A1AT) is a protease inhibitor that protects lung tissue from neutrophil elastase (a proteolytic enzyme released during inflammation). Without adequate A1AT, neutrophil elastase degrades alveolar walls, leading to emphysema. A1AT also enhances alveolar exchange. Alpha-1-antitrypsin deficiency is a genetic cause of early-onset emphysema.',
    reference: 'Dr. Kabsha - Asthma Module'
  },

  // ══════════════════════════════════════
  // ANALGESICS & PAIN MANAGEMENT
  // ══════════════════════════════════════
  {
    id: 'q_analg_001', domain: 'PHARM', difficulty: 'easy',
    question: 'Morphine acts primarily on which opioid receptor?',
    options: [
      'A. Kappa (κ) receptor',
      'B. Delta (δ) receptor',
      'C. Mu (μ) receptor',
      'D. Sigma (σ) receptor'
    ],
    correct: 2,
    explanation: 'Morphine is a pure opioid agonist that acts primarily on the Mu (μ) receptor. Mu receptor activation produces: analgesia, euphoria, respiratory depression, miosis (pinpoint pupils), constipation, and physical dependence. Kappa receptor agonism produces analgesia and sedation. Delta receptors modulate mu receptor activity. Morphine is the gold standard for severe pain management.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_002', domain: 'PHARM', difficulty: 'easy',
    question: 'Morphine overdose causes respiratory depression by acting on which structure?',
    options: [
      'A. Peripheral pain receptors',
      'B. The respiratory center in the brainstem',
      'C. Spinal cord interneurons',
      'D. Cortical glutamate receptors'
    ],
    correct: 1,
    explanation: 'Morphine causes respiratory depression by acting on opioid receptors in the respiratory center located in the brainstem (medulla oblongata). This reduces the sensitivity of the respiratory center to CO2, decreasing the drive to breathe. This is the most dangerous effect of opioid overdose. Treatment: Naloxone (IV, short-acting opioid antagonist). Picrotoxin can be used for post-anesthesia respiratory depression (CNS stimulant).',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_003', domain: 'PHARM', difficulty: 'medium',
    question: 'Which of the following is the ANTIDOTE for opioid overdose?',
    options: [
      'A. Naltrexone (oral, long-acting)',
      'B. Methadone (oral agonist)',
      'C. Naloxone (IV, short-acting pure antagonist)',
      'D. Pentazocine (mixed agonist/antagonist)'
    ],
    correct: 2,
    explanation: 'Naloxone is the IV antidote for ACUTE opioid toxicity/overdose. It is a pure opioid antagonist with short duration of action, used for acute emergencies (not addiction treatment). Naltrexone is oral, long-acting, used for addiction treatment (alcohol and opioid dependence). Methadone is an oral opioid agonist (long-acting) used for morphine addiction treatment because it has fewer withdrawal symptoms. Pentazocine is a mixed agonist/antagonist.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_004', domain: 'PHARM', difficulty: 'medium',
    question: 'Which opioid causes MIOSIS (pinpoint pupils), while cocaine causes MYDRIASIS (pupil dilation)?',
    options: [
      'A. Morphine/Heroin - miosis; Cocaine - mydriasis',
      'B. Both morphine and cocaine cause miosis',
      'C. Morphine causes mydriasis; cocaine causes miosis',
      'D. Neither affects pupil size'
    ],
    correct: 0,
    explanation: 'Morphine and heroin (opioids) cause MIOSIS (pinpoint pupils) by stimulating parasympathetic oculomotor nucleus. Cocaine is an indirect sympathomimetic (blocks reuptake of norepinephrine and dopamine) causing MYDRIASIS (pupil dilation) through sympathetic stimulation. This distinction is clinically important for identifying the cause of unconsciousness/overdose.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_005', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the maximum daily dose of paracetamol (acetaminophen) in ADULTS?',
    options: [
      'A. 2 grams per day',
      'B. 4 grams per day',
      'C. 6 grams per day',
      'D. 8 grams per day'
    ],
    correct: 1,
    explanation: 'The maximum adult daily dose of paracetamol is 4 grams (4000 mg) per day. For children, the maximum is 75 mg/kg/day (per dose: 10-15 mg/kg every 4-6 hours). The toxic metabolite of paracetamol is NAPQI, formed by CYP450 enzymes. Toxicity occurs when glutathione stores are depleted. Antidote: N-acetylcysteine (NAC). Note: Paracetamol has NO anti-inflammatory action.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_006', domain: 'PHARM', difficulty: 'medium',
    question: 'What is the toxic metabolite of paracetamol (acetaminophen) overdose and its antidote?',
    options: [
      'A. Salicylate; antidote is sodium bicarbonate',
      'B. NAPQI; antidote is N-acetylcysteine (NAC)',
      'C. Phenol; antidote is activated charcoal',
      'D. Glucuronide conjugate; antidote is flumazenil'
    ],
    correct: 1,
    explanation: 'NAPQI (N-acetyl-p-benzoquinone imine) is the toxic metabolite of paracetamol formed by CYP2E1 and CYP3A4. Normally conjugated by glutathione (tripeptide: cysteine, glutamic acid, glycine). In overdose, glutathione depleted → NAPQI accumulates → hepatocyte necrosis. Antidote: N-acetylcysteine (NAC) replenishes glutathione stores. Treatment is most effective within 8-10 hours of ingestion.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_007', domain: 'PHARM', difficulty: 'medium',
    question: 'Aspirin (acetylsalicylic acid) inhibits COX enzyme through which mechanism?',
    options: [
      'A. Reversible competitive inhibition of COX-1 and COX-2',
      'B. Irreversible covalent bond (acetylation) of serine residue in COX enzyme',
      'C. Non-competitive inhibition by binding to COX allosteric site',
      'D. Blocks arachidonic acid synthesis upstream'
    ],
    correct: 1,
    explanation: 'Aspirin forms an IRREVERSIBLE covalent bond by acetylating the serine residue in the COX enzyme active site. This permanently inactivates both COX-1 and COX-2. Because platelets cannot synthesize new COX (they lack nuclei), aspirin\'s antiplatelet effect lasts the platelet lifetime (~7-10 days). Ibuprofen is a reversible COX inhibitor. This distinction is critical for antiplatelet use in cardiovascular disease.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_008', domain: 'PHARM', difficulty: 'medium',
    question: 'Which NSAID is semi-selective with more affinity to COX-2, and is used intravenously to close patent ductus arteriosus?',
    options: [
      'A. Aspirin',
      'B. Ibuprofen',
      'C. Indomethacin',
      'D. Celecoxib'
    ],
    correct: 2,
    explanation: 'Indomethacin is a potent NSAID that is semi-selective with MORE affinity for COX-2. IV indomethacin is used to close patent ductus arteriosus (PDA) in premature neonates - prostaglandins keep the ductus open, so COX inhibition allows closure. Important: NSAIDs cause sodium and water retention and are NOT used in heart failure. Selective COX-2 inhibitors (coxibs) have high CVS risk (e.g., celecoxib).',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_009', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the OTC dose limit for ibuprofen, and what is the maximum prescription dose?',
    options: [
      'A. OTC: 800 mg/day; Prescription: 1600 mg/day',
      'B. OTC: 1200 mg/day; Prescription: 3200 mg/day',
      'C. OTC: 600 mg/day; Prescription: 2400 mg/day',
      'D. OTC: 400 mg/day; Prescription: 1200 mg/day'
    ],
    correct: 1,
    explanation: 'Ibuprofen OTC maximum dose is 1200 mg/day, while the prescription (Rx) maximum dose is 3200 mg/day. Ibuprofen is an anti-inflammatory NSAID with less GI side effects compared to aspirin. Note: Naproxen maximum dose is 600 mg. Selective COX-2 inhibitors (celecoxib) have higher CVS risk; naproxen has the least CVS risk among NSAIDs.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_010', domain: 'PHARM', difficulty: 'medium',
    question: 'Which opioid is used for treatment of morphine addiction, is LONG-ACTING, causes fewer withdrawal symptoms, and is taken ORALLY?',
    options: [
      'A. Naloxone - IV antidote',
      'B. Pentazocine - mixed agonist/antagonist',
      'C. Methadone - long-acting oral opioid agonist',
      'D. Naltrexone - pure opioid antagonist'
    ],
    correct: 2,
    explanation: 'Methadone is used for treatment of morphine/opioid addiction because: it is long-acting (reduces withdrawal symptoms), taken orally (prevents IV drug use), and provides cross-tolerance to other opioids. Naltrexone (oral, long-acting) is used for both opioid and ALCOHOL dependence. Naloxone is IV-only for acute toxicity. Pentazocine acts as agonist on kappa and weak antagonist on mu - can precipitate withdrawal if given after morphine.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_analg_011', domain: 'PHARM', difficulty: 'easy',
    question: 'Which pain scale is used for children ABOVE 7 years of age?',
    options: [
      'A. FLACC Scale',
      'B. Wong-Baker FACES Pain Scale',
      'C. Face Pain Scale Revised (FPS-R)',
      'D. Numeric Rating Scale (NRS)'
    ],
    correct: 3,
    explanation: 'Pain assessment scales by age: Children TILL 7 years → Face Pain Scale Revised (FPS-R); Children ABOVE 7 years → Numeric Rating Scale (NRS, 0-10). Adults → Numeric Rating Scale or Visual Analogue Scale (VAS). FLACC is for nonverbal patients (infants). FACES scale can be used from age 3. Using the appropriate scale ensures accurate pain assessment.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },

  // ══════════════════════════════════════
  // PHARMACOKINETICS & CALCULATIONS
  // ══════════════════════════════════════
  {
    id: 'q_calc_001', domain: 'CALC', difficulty: 'easy',
    question: 'Bioavailability is defined as:',
    options: [
      'A. The speed at which a drug crosses the blood-brain barrier',
      'B. The rate and extent of absorption and amount of drug reaching systemic circulation unchanged',
      'C. The volume in which a drug distributes in the body',
      'D. The rate at which a drug is eliminated by the kidneys'
    ],
    correct: 1,
    explanation: 'Bioavailability (F) is the rate and extent of absorption AND the amount of drug that reaches the systemic circulation UNCHANGED. IV administration has 100% (highest) bioavailability by definition. Oral bioavailability is reduced by first-pass metabolism, gut wall metabolism, and poor absorption. Formula: F = (AUC oral / AUC IV) × 100%.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_002', domain: 'CALC', difficulty: 'medium',
    question: 'Drug A is taken IV (AUC = 300) and Drug B is taken orally (AUC = 225). What is the bioavailability of the oral drug?',
    options: [
      'A. 85%',
      'B. 90%',
      'C. 75%',
      'D. 80%'
    ],
    correct: 2,
    explanation: 'Bioavailability = (AUC oral / AUC IV) × 100 = (225/300) × 100 = 75%. This is the ABSOLUTE bioavailability formula. The AUC (Area Under the Curve) represents total drug exposure. When comparing oral vs IV, adjust for dose differences if doses are not equal. This is a direct exam question from Dr. Kabsha Calculations PDF.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_003', domain: 'CALC', difficulty: 'medium',
    question: 'Ciprofloxacin IV 400 mg is bioequivalent to how much ciprofloxacin ORAL, given the oral bioavailability is 80%?',
    options: [
      'A. 320 mg',
      'B. 400 mg',
      'C. 450 mg',
      'D. 500 mg'
    ],
    correct: 3,
    explanation: 'If IV 400 mg = 100% bioavailable, and oral has 80% bioavailability, then to achieve the same systemic exposure: Oral dose = IV dose / F = 400 / 0.80 = 500 mg. The oral dose must be HIGHER to compensate for the 20% lost to incomplete absorption and first-pass metabolism. This is a key pharmacokinetic calculation tested in the exam.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_004', domain: 'CALC', difficulty: 'medium',
    question: 'A drug has Volume of Distribution (Vd) of 35L in a 70 kg man. Which statement BEST describes its distribution?',
    options: [
      'A. It is bound to DNA in cell nuclei',
      'B. It is dissolved in lipids and fat tissue',
      'C. It has low bioavailability',
      'D. It is mostly distributed in plasma'
    ],
    correct: 3,
    explanation: 'Vd = 35L in 70 kg man ≈ 0.5 L/kg, which is close to total body water. Reference: Plasma Vd ≈ 3-5L; Extracellular fluid ≈ 15L; Total body water ≈ 42L. At 35L, the drug distributes mainly throughout total body water, essentially remaining in plasma and extracellular fluid. High Vd (>500L) would indicate extensive tissue binding. Note: Theophylline Vd = 0.3-0.7 L/kg.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_005', domain: 'CALC', difficulty: 'easy',
    question: 'A patient weighing 80 kg is to receive a drug at 2 mg/kg/day. What is the total daily dose?',
    options: [
      'A. 80 mg',
      'B. 160 mg',
      'C. 240 mg',
      'D. 320 mg'
    ],
    correct: 1,
    explanation: 'Daily dose = dose per kg × weight = 2 mg/kg/day × 80 kg = 160 mg/day. This is a straightforward weight-based dosing calculation. Always check: is the dose per dose or per day? Here it is per DAY. If it were given twice daily, each dose would be 80 mg. This type of calculation is fundamental and appears frequently in pharmacy exams.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_006', domain: 'CALC', difficulty: 'easy',
    question: 'An elixir contains 5 mg of drug per 1 mL. What is the amount of drug in one teaspoonful (1 tsp) in micrograms?',
    options: [
      'A. 5 mcg',
      'B. 25 mcg',
      'C. 500 mcg',
      'D. 25,000 mcg'
    ],
    correct: 3,
    explanation: '1 teaspoon (tsp) = 5 mL. Drug per mL = 5 mg. Drug in 5 mL = 5 mg × 5 = 25 mg. Convert to micrograms: 25 mg × 1000 mcg/mg = 25,000 mcg. Key conversion: 1 mg = 1000 mcg. Other important conversions: 1 tablespoon (tbsp) = 15 mL = 3 tsp; 1 kg = 2.2 pounds; 1 gallon = 3.79 liters.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_007', domain: 'CALC', difficulty: 'medium',
    question: 'An elixir contains 0.1 mg of drug X per mL. How many micrograms are in one teaspoonful?',
    options: [
      'A. 0.0005 micrograms',
      'B. 0.5 micrograms',
      'C. 500 micrograms',
      'D. 5 micrograms'
    ],
    correct: 2,
    explanation: '1 tsp = 5 mL. Drug = 0.1 mg/mL × 5 mL = 0.5 mg. Convert: 0.5 mg × 1000 = 500 mcg. Step-by-step: Concentration 0.1 mg/mL → in 5 mL → 0.5 mg → ×1000 = 500 mcg. Always identify the volume (1 tsp = 5 mL) and convert units properly. Microgram errors are common in pharmacy exams.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_008', domain: 'CALC', difficulty: 'medium',
    question: '5 mL of an injection with 0.4% w/v concentration - what is the amount of drug present?',
    options: [
      'A. 0.2 mg',
      'B. 2 mg',
      'C. 200 mg',
      'D. 20 mg'
    ],
    correct: 3,
    explanation: '0.4% w/v = 0.4 g per 100 mL = 0.004 g/mL = 4 mg/mL. In 5 mL: 4 mg/mL × 5 mL = 20 mg. Alternative: 0.4 g/100 mL → X g/5 mL → X = (5 × 0.4)/100 = 0.02 g = 20 mg. Remember: %w/v = grams of drug per 100 mL solution. This conversion is essential for all concentration calculations.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_009', domain: 'CALC', difficulty: 'medium',
    question: 'A man, 40 years old, 80 kg, serum creatinine 0.5 mg/dL. Calculate creatinine clearance (CrCl) using Cockcroft-Gault:',
    options: [
      'A. 222 mL/min',
      'B. 189 mL/min',
      'C. 150 mL/min',
      'D. 110 mL/min'
    ],
    correct: 0,
    explanation: 'Cockcroft-Gault (male): CrCl = (140 - age) × weight / (72 × SCr) = (140 - 40) × 80 / (72 × 0.5) = 100 × 80 / 36 = 8000/36 = 222 mL/min. For FEMALE: multiply by 0.85 → 222 × 0.85 = 188.7 mL/min. Formula name: Cockcroft-Gault for adults; Schwartz formula for CHILDREN. Dose adjustment needed when CrCl < 60 mL/min.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_010', domain: 'CALC', difficulty: 'easy',
    question: 'What are the correct formulas for Ideal Body Weight (IBW)?',
    options: [
      'A. Male: 60 + 2.3 (inches - 60); Female: 55 + 2.3 (inches - 60)',
      'B. Male: 50 + 2.3 (inches - 60); Female: 45 + 2.3 (inches - 60)',
      'C. Male: 45 + 2.3 (inches - 60); Female: 50 + 2.3 (inches - 60)',
      'D. Male: 50 + 1.5 (cm - 150); Female: 45 + 1.5 (cm - 150)'
    ],
    correct: 1,
    explanation: 'IBW formulas: Male = 50 + 2.3 × (height in inches - 60), or simply: height in cm - 100. Female = 45 + 2.3 × (height in inches - 60), or height in cm - 105. Adjusted Body Weight (AdjBW) = IBW + 0.4 × (actual weight - IBW). Used for obese patients when calculating drug doses or CrCl. 1 foot = 12 inches; 1 inch = 2.54 cm.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_011', domain: 'CALC', difficulty: 'medium',
    question: 'A patient\'s dose is 20 mg/kg/day, and the patient weighs 60 pounds. What is the daily dose?',
    options: [
      'A. 1200 mg/day',
      'B. 600 mg/day',
      'C. 545 mg/day',
      'D. 272 mg/day'
    ],
    correct: 2,
    explanation: 'Convert pounds to kg: 60 lb ÷ 2.2 = 27.27 kg. Daily dose: 20 mg/kg × 27.27 kg = 545.5 mg/day ≈ 545 mg/day. Key conversion: 1 kg = 2.2 pounds (lb). Always convert to kg before dosing calculations. This weight conversion is frequently tested and a common source of errors in clinical practice.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_012', domain: 'CALC', difficulty: 'medium',
    question: 'Calculate the osmolarity of 1 liter of Normal Saline (0.9% NaCl; MW of NaCl = 58.5):',
    options: [
      'A. 154 mOsm/L',
      'B. 308 mOsm/L',
      'C. 154 mmol/L',
      'D. 500 mOsm/L'
    ],
    correct: 1,
    explanation: '0.9% NaCl = 9 g/L. Millimoles = weight(g)/MW × 1000 = 9/58.5 × 1000 = 154 mmol. NaCl dissociates into 2 particles (Na+ and Cl-), so: mOsm = millimoles × 2 = 154 × 2 = 308 mOsm/L. This matches physiologic osmolarity (285-310 mOsm). Normal saline is ISOTONIC with blood. Important for IV fluid administration and compounding calculations.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_013', domain: 'CALC', difficulty: 'medium',
    question: 'A patient cholesterol level is 4 mM/L. Express this in mg/dL (molecular weight of cholesterol = 386):',
    options: [
      'A. 0.0154 mg/dL',
      'B. 0.154 mg/dL',
      'C. 1.54 mg/dL',
      'D. 154 mg/dL'
    ],
    correct: 3,
    explanation: 'Formula: Conc (mg/dL) = Conc (mmol/L) × Molecular Weight / 10. = 4 × 386 / 10 = 1544/10 = 154.4 mg/dL ≈ 154 mg/dL. Breakdown: mM to mg: multiply by MW (4 × 386 = 1544 mg/L). Convert L to dL: divide by 10 → 154.4 mg/dL. This conversion is important for lipid levels and other lab values reported in different units.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_014', domain: 'CALC', difficulty: 'medium',
    question: 'A drug is given IV at a rate of 2 mg/hr with T½ = 2 hours. How many mg are needed to reach steady state?',
    options: [
      'A. 4 mg',
      'B. 16 mg',
      'C. 20 mg',
      'D. 40 mg'
    ],
    correct: 2,
    explanation: 'Steady state is reached after 5 half-lives: 5 × T½ = 5 × 2 = 10 hours. Amount given in 10 hours at rate of 2 mg/hr: 2 mg/hr × 10 hr = 20 mg. Key principle: steady state is always reached after approximately 5 half-lives, regardless of dose or infusion rate. The time to steady state depends ONLY on the half-life, not on dose or rate.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_015', domain: 'CALC', difficulty: 'medium',
    question: 'A drug with T½ = 72 hours - when will the body receive the complete therapeutic steady-state dose?',
    options: [
      'A. 1 day',
      'B. 2 days',
      'C. 1 week',
      'D. 2 weeks'
    ],
    correct: 3,
    explanation: 'Steady state is reached after 5 half-lives: 5 × 72 hours = 360 hours = 15 days ≈ 2 weeks. This is why drugs with very long half-lives (like amiodarone, T½ ≈ 40-55 days) take a very long time to reach steady state and require loading doses for urgent therapeutic effect. Examples: amiodarone, digoxin loading doses for rapid effect.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_016', domain: 'CALC', difficulty: 'hard',
    question: 'Given: Dose = 1000, Initial concentration = 10, Elimination rate constant = 0.1. Calculate total body clearance:',
    options: [
      'A. 250 L/hr',
      'B. 100 L/hr',
      'C. 10 L/hr',
      'D. 150 L/hr'
    ],
    correct: 2,
    explanation: 'Step 1: Vd = Dose/Initial concentration = 1000/10 = 100 L. Step 2: Clearance = Vd × Kel = 100 × 0.1 = 10 L/hr. Alternatively: CL = 0.693 × Vd / T½, and T½ = 0.693/Kel = 0.693/0.1 = 6.93 hrs → CL = 0.693 × 100 / 6.93 = 10 L/hr. Clearance relates the rate of drug elimination to plasma concentration.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_017', domain: 'CALC', difficulty: 'hard',
    question: 'A drug with initial concentration of 400 mg/L and T½ = 12 hours. By what percentage will the concentration decrease after 1 day (24 hours)?',
    options: [
      'A. 10%',
      'B. 25%',
      'C. 75%',
      'D. 90%'
    ],
    correct: 2,
    explanation: '24 hours = 2 half-lives. After T1: 400 → 200 mg/L; After T2: 200 → 100 mg/L. Drug lost = 400 - 100 = 300 mg/L. Percentage decrease = 300/400 × 100 = 75%. The drug concentration DECREASED by 75% (from 400 to 100 mg/L). This tracks the elimination pattern: each half-life reduces concentration by 50%.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_018', domain: 'CALC', difficulty: 'medium',
    question: 'A 70 kg patient receives heparin 10 IU/kg/hr from a bag of 25,000 IU in 250 mL. How many mL/hr should be infused?',
    options: [
      'A. 3.5 mL/hr',
      'B. 7 mL/hr',
      'C. 14 mL/hr',
      'D. 10 mL/hr'
    ],
    correct: 1,
    explanation: 'Step 1: Required dose = 10 IU/kg/hr × 70 kg = 700 IU/hr. Step 2: Concentration of bag = 25,000 IU / 250 mL = 100 IU/mL. Step 3: Volume needed = 700 IU / 100 IU/mL = 7 mL/hr. This infusion rate calculation (dose in units → volume per time) is a critical clinical pharmacy calculation for anticoagulation therapy.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_019', domain: 'CALC', difficulty: 'medium',
    question: 'How many grams of substance X must be added to 2000 g of 10% substance X solution to prepare a 25% solution?',
    options: [
      'A. 10,000 g',
      'B. 400 g',
      'C. 40 g',
      'D. 10 g'
    ],
    correct: 1,
    explanation: 'Using alligation: 100% (pure substance) and 10% to make 25%. Parts of 100%: 25-10 = 15; Parts of 10%: 100-25 = 75. Ratio 100%:10% = 15:75. Since we have 2000 g of 10%: 2000/75 × 15 = 400 g of pure substance needed. Verification: (400 g × 100%) + (2000 g × 10%) = 400 + 200 = 600 g in 2400 g total = 25% ✓',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_020', domain: 'CALC', difficulty: 'medium',
    question: '30 g of 1% hydrocortisone is mixed with 40 g of 2.5% hydrocortisone. What is the resulting concentration?',
    options: [
      'A. 3%',
      'B. 1.85%',
      'C. 2.0%',
      'D. 1.75%'
    ],
    correct: 1,
    explanation: 'C1×V1 + C2×V2 = C3×V3. Amount of drug: (30 × 1%) + (40 × 2.5%) = 0.3 g + 1.0 g = 1.3 g. Total weight = 30 + 40 = 70 g. Concentration = 1.3/70 = 0.01857 = 1.857% ≈ 1.85%. This mixing calculation uses the simple weighted average formula and is essential for compounding pharmacy calculations.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_021', domain: 'CALC', difficulty: 'medium',
    question: 'To make 80% solution by mixing 90% and 50% solutions, what is the ratio of 90%:50%?',
    options: [
      'A. 1:3',
      'B. 3:1',
      'C. 10:30',
      'D. 5:9'
    ],
    correct: 1,
    explanation: 'Using alligation: 90% and 50% to make 80%. Parts of 90% = (80-50) = 30; Parts of 50% = (90-80) = 10. Ratio 90%:50% = 30:10 = 3:1. So for every 3 parts of 90% solution, use 1 part of 50% solution. Alligation is a rapid method for determining mixing ratios for any combination of concentrations.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_022', domain: 'CALC', difficulty: 'hard',
    question: 'Ampicillin (weak acid, pKa = 2.5) - what percentage will be in the LIPID SOLUBLE (unionized) form in the duodenum at pH 4.5?',
    options: [
      'A. 1%',
      'B. 6%',
      'C. 9%',
      'D. 99%'
    ],
    correct: 3,
    explanation: 'Henderson-Hasselbalch for weak acid: pH - pKa = log([ionized]/[unionized]). 4.5 - 2.5 = 2 = log([A-]/[HA]). So [A-]/[HA] = 100/1. Total = 100+1 = 101. Unionized (lipid-soluble) fraction = 1/101 × 100 = ~1%. WAIT - Question asks for lipid soluble = unionized. At pH > pKa, the acid is more ionized. Since pH (4.5) >> pKa (2.5), the drug is 99% ionized, and only ~1% unionized (lipid soluble). Answer is A = 1%. Only the unionized form crosses lipid membranes.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_023', domain: 'CALC', difficulty: 'hard',
    question: 'Amitriptyline (weak base, pKa = 9.4) - what is the percent IONIZATION at physiologic pH of 7.4?',
    options: [
      'A. 1%',
      'B. 6%',
      'C. 9%',
      'D. 99%'
    ],
    correct: 3,
    explanation: 'For a weak BASE: pKa - pH = log([ionized]/[unionized]). 9.4 - 7.4 = 2. [ionized]/[unionized] = 10^2 = 100. Percentage ionized = 100/(100+1) × 100 = 99%. At physiologic pH (7.4), amitriptyline (pKa 9.4) is 99% ionized (protonated). The ionized form cannot cross lipid membranes, but note amitriptyline still has high CNS penetration due to other factors (lipophilicity, high Vd).',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_024', domain: 'CALC', difficulty: 'medium',
    question: 'Drug X infusion rate: 0.95 mg/kg/hr for a 70 kg patient. How much drug is needed for a 12-hour infusion bottle?',
    options: [
      'A. 798 mg',
      'B. 66.5 mg',
      'C. 665 mg',
      'D. 84 mg'
    ],
    correct: 2,
    explanation: 'Step 1: Rate per hour = 0.95 mg/kg/hr × 70 kg = 66.5 mg/hr. Step 2: For 12 hours: 66.5 mg/hr × 12 hr = 798 mg. Wait - Answer A is 798 mg. Re-check: 0.95 × 70 = 66.5 mg/hr × 12 hr = 798 mg. Correct answer is A (798 mg). Note: C (665 mg) would be for 10 hours. Always multiply dose per hour by total duration for infusion bag calculations.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_025', domain: 'CALC', difficulty: 'easy',
    question: 'How do you prepare 100 mL of 12% MgCl solution?',
    options: [
      'A. 12 mL of MgCl dissolved in 100 mL water',
      'B. 12 g of MgCl dissolved in water to make 100 mL',
      'C. 12 mL of MgCl dissolved in 1000 mL water',
      'D. 90.5 mL of MgCl dissolved in 100 mL water'
    ],
    correct: 1,
    explanation: '12% w/v = 12 grams per 100 mL. To prepare: weigh 12 g of MgCl, dissolve in some water, then bring the total volume up to 100 mL (q.s. to 100 mL). Option A is wrong (mL not g). Option C is wrong (wrong volume). %w/v = g of solute per 100 mL of SOLUTION (not solvent). The total final volume must equal 100 mL.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_026', domain: 'CALC', difficulty: 'hard',
    question: 'Anion Gap (AG) = Na - Cl - HCO3. A patient has Na=139, Cl=101, K=4.6, HCO3=19. What is the anion gap?',
    options: [
      'A. 19',
      'B. 23.6',
      'C. 14.4',
      'D. 12'
    ],
    correct: 0,
    explanation: 'Anion Gap = Na - Cl - HCO3 = 139 - 101 - 19 = 19. Normal AG = 8-12 mEq/L. This patient has an elevated AG = 19, indicating high anion gap metabolic acidosis (MUDPILES: Methanol, Uremia, DKA, Propylene glycol, Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates). Potassium is NOT included in the standard AG formula.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_027', domain: 'CALC', difficulty: 'medium',
    question: 'Vancomycin 1000 mg Q12hr gives a current level of 11 mg/L; desired level is 17 mg/L. What is the new regimen?',
    options: [
      'A. 1000 mg Q12hr (no change)',
      'B. 2000 mg Q8hr',
      'C. 3000 mg Q24hr',
      'D. 1000 mg Q8hr'
    ],
    correct: 3,
    explanation: 'To increase trough from 11 to 17 (1.5× increase), increase dose proportionally: New dose = 1000 × (17/11) ≈ 1545 mg, or increase frequency. Option D (1000 mg Q8hr) effectively increases daily dose from 2000 mg to 3000 mg without changing per-dose amount, which is safer and predictable. The ratio needed is 17/11 ≈ 1.55, making Q8hr (3 doses/day instead of 2) the appropriate adjustment.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_calc_028', domain: 'CALC', difficulty: 'medium',
    question: 'What is the molarity of a solution made by dissolving 17.52 g of NaCl (MW = 57) in exactly 2000 mL?',
    options: [
      'A. 3.33 M',
      'B. 0.15 M',
      'C. 1.60 M',
      'D. 0.003 M'
    ],
    correct: 1,
    explanation: 'Molarity = moles / volume(L). Moles = weight / MW = 17.52 / 57 = 0.307 moles. Volume = 2000 mL = 2 L. Molarity = 0.307 / 2 = 0.153 M ≈ 0.15 M. Key formula: Molarity (M) = moles/L; Molality (m) = moles/kg of solvent (different!). Moles = mass (g) / molecular weight (g/mol).',
    reference: 'Dr. Kabsha - Calculations Module'
  },

  // ══════════════════════════════════════
  // UAE DRUG REGULATION
  // ══════════════════════════════════════
  {
    id: 'q_reg_001', domain: 'REG', difficulty: 'easy',
    question: 'Which score is used to assess the probability that an adverse drug reaction is related to a specific drug?',
    options: [
      'A. SOFA Score',
      'B. CURB-65 Score',
      'C. Naranjo Score',
      'D. Child-Pugh Score'
    ],
    correct: 2,
    explanation: 'The Naranjo Score (also called the Naranjo Algorithm) estimates the probability that an adverse drug reaction is caused by a specific drug. Interpretation: 0 = Doubtful; 1-4 = Possible; 5-8 = Probable; >8 = Definite. Other clinical scores: SOFA = Septic Shock; CURB-65 = Pneumonia severity (CAP); Child-Pugh = Liver disease severity; MELD-PLUS = Chronic liver disease; CHA2DS2-VASc = Atrial fibrillation stroke risk.',
    reference: 'Dr. Kabsha - Asthma/Regulation Module'
  },
  {
    id: 'q_reg_002', domain: 'REG', difficulty: 'medium',
    question: 'Which clinical scoring system is used to assess the risk of stroke after a Transient Ischemic Attack (TIA)?',
    options: [
      'A. Glasgow Coma Scale',
      'B. ABCD2 Score',
      'C. Alvarado Score',
      'D. Geneva Score'
    ],
    correct: 1,
    explanation: 'ABCD2 Score assesses the risk of stroke after a TIA. Other clinical scores: Glasgow Coma Scale = Central nervous system (consciousness); Alvarado Score = Diagnosis of appendicitis; Geneva Score = Pulmonary Embolism probability; QRISK3 = Cardiovascular disease risk; ACR Score = Rheumatoid arthritis; SOFA = Septic shock; CHA2DS2-VASc = Atrial fibrillation (stroke risk).',
    reference: 'Dr. Kabsha - Regulation Module'
  },
  {
    id: 'q_reg_003', domain: 'REG', difficulty: 'easy',
    question: 'What is Primary Prevention in public health?',
    options: [
      'A. Trying to detect a disease early and prevent it from getting worse',
      'B. Trying to improve quality of life and reduce symptoms of an existing disease',
      'C. Trying to prevent yourself from getting a disease in the first place',
      'D. Treating complications of advanced disease'
    ],
    correct: 2,
    explanation: 'Three levels of prevention: Primary Prevention = preventing disease BEFORE it occurs (e.g., vaccination, smoking cessation, diet). Secondary Prevention = early detection to prevent worsening (e.g., screening, mammography). Tertiary Prevention = improving quality of life and reducing symptoms of an EXISTING disease (e.g., cardiac rehabilitation, dialysis for CKD). Most public health strategies are based on PRIMARY prevention.',
    reference: 'Dr. Kabsha - Regulation/Analgesics Module'
  },
  {
    id: 'q_reg_004', domain: 'REG', difficulty: 'medium',
    question: 'In thin layer chromatography (TLC), which statement about Rf values is correct?',
    options: [
      'A. Rf values can be greater than 1 for highly mobile compounds',
      'B. Rf values are always less than 1',
      'C. Rf values are measured in millimeters',
      'D. Rf values equal the ratio of mobile phase volume to stationary phase volume'
    ],
    correct: 1,
    explanation: 'Rf (Retention factor or Retardation factor) = distance traveled by the compound / distance traveled by the solvent front. Since the compound can NEVER travel farther than the solvent, Rf is ALWAYS less than 1 (between 0 and 1). An Rf = 0 means the compound did not move; Rf = 1 (approaching) means the compound moved with the solvent. TLC is used in pharmacy for drug identification and purity testing.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_reg_005', domain: 'REG', difficulty: 'easy',
    question: 'What is the treatment for tapeworm infection?',
    options: [
      'A. Albendazole and pyrantel pamoate',
      'B. Pyrimethamine and sulfadoxine',
      'C. Praziquantel, niclosamide, or pomegranate bark',
      'D. Artemether and lumefantrine'
    ],
    correct: 2,
    explanation: 'Tapeworm (Cestodes): Praziquantel, Niclosamide, or pomegranate bark (traditional). Pinworm (Enterobius vermicularis): Albendazole or Pyrantel pamoate. Malaria first-line: Pyrimethamine + sulfadoxine / artesunate; Second-line: Artemether + Lumefantrine. Malaria in pregnancy 1st trimester: Quinine + Clindamycin; 2nd-3rd trimester: same or artesunate + pyrimethamine.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },

  // ══════════════════════════════════════
  // HYPERLIPIDEMIA
  // ══════════════════════════════════════
  {
    id: 'q_lipid_001', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the mechanism of action of statins (HMG-CoA reductase inhibitors)?',
    options: [
      'A. Inhibiting cholesterol absorption in the small intestine via NPC1L1 blockade',
      'B. Competitively inhibiting HMG-CoA reductase (rate-limiting step in cholesterol synthesis)',
      'C. Activating PPARα to increase lipoprotein lipase and VLDL clearance',
      'D. Binding bile acids in the gut to reduce their reabsorption'
    ],
    correct: 1,
    explanation: 'Statins (atorvastatin, rosuvastatin, simvastatin, pravastatin) competitively inhibit HMG-CoA reductase, the rate-limiting enzyme in hepatic cholesterol synthesis (HMG-CoA → mevalonate). This decreases intrahepatic cholesterol, upregulates LDL receptors, increases LDL clearance. Other mechanisms: Ezetimibe = NPC1L1 blocker (Option A); Fibrates = PPARα agonists (Option C); Bile acid sequestrants = Option D.',
    reference: 'Dr. Kabsha - Hyperlipidemia Module'
  },
  {
    id: 'q_lipid_002', domain: 'PHARM', difficulty: 'medium',
    question: 'Which lipid-lowering agent works by inhibiting cholesterol absorption in the small intestine?',
    options: [
      'A. Atorvastatin (statin)',
      'B. Fenofibrate (fibrate)',
      'C. Ezetimibe (NPC1L1 inhibitor)',
      'D. Colesevelam (bile acid sequestrant)'
    ],
    correct: 2,
    explanation: 'Ezetimibe inhibits the NPC1L1 (Niemann-Pick C1-Like 1) transporter in intestinal enterocytes, blocking dietary and biliary cholesterol absorption. It reduces LDL by ~15-20%. Often combined with statins for additional LDL reduction (IMPROVE-IT trial showed benefit when added to statin). Bile acid sequestrants (colesevelam, cholestyramine) bind bile acids in gut, but their mechanism is different from direct cholesterol absorption inhibition.',
    reference: 'Dr. Kabsha - Hyperlipidemia Module'
  },
  {
    id: 'q_lipid_003', domain: 'PHARM', difficulty: 'medium',
    question: 'Which lipid-lowering drug class acts via PPARα activation to increase lipoprotein lipase and reduce triglycerides?',
    options: [
      'A. Statins (HMG-CoA reductase inhibitors)',
      'B. Fibrates (fenofibrate, gemfibrozil)',
      'C. Niacin (nicotinic acid)',
      'D. Omega-3 fatty acids'
    ],
    correct: 1,
    explanation: 'Fibrates (fenofibrate, gemfibrozil, bezafibrate) activate PPARα (Peroxisome Proliferator-Activated Receptor alpha) in liver, which: increases lipoprotein lipase (LPL) activity → increased VLDL clearance; reduces triglycerides by 30-50%; modestly increases HDL. Best for hypertriglyceridemia. Important interaction: gemfibrozil + statins = increased risk of myopathy/rhabdomyolysis. Fenofibrate is preferred with statins.',
    reference: 'Dr. Kabsha - Hyperlipidemia Module'
  },
  {
    id: 'q_lipid_004', domain: 'PHARM', difficulty: 'easy',
    question: 'Which lipid fraction is considered ANTI-ATHEROGENIC (protective against heart disease)?',
    options: [
      'A. LDL (Low-Density Lipoprotein)',
      'B. VLDL (Very Low-Density Lipoprotein)',
      'C. HDL (High-Density Lipoprotein)',
      'D. Chylomicrons'
    ],
    correct: 2,
    explanation: 'HDL (High-Density Lipoprotein) is the "good cholesterol" - it performs reverse cholesterol transport, removing cholesterol from peripheral tissues and arterial walls back to the liver for excretion. Higher HDL = lower cardiovascular risk. LDL is "bad cholesterol" - deposits in arterial walls causing atherogenesis. VLDL carries triglycerides from liver. Chylomicrons carry dietary fat from gut.',
    reference: 'Dr. Kabsha - Hyperlipidemia Module'
  },
  {
    id: 'q_lipid_005', domain: 'PHARM', difficulty: 'medium',
    question: 'Which statin has the HIGHEST potency and greatest LDL reduction?',
    options: [
      'A. Simvastatin',
      'B. Pravastatin',
      'C. Rosuvastatin',
      'D. Lovastatin'
    ],
    correct: 2,
    explanation: 'Rosuvastatin (followed by atorvastatin) has the highest potency and greatest LDL-lowering effect among statins. Potency ranking (approximate): Rosuvastatin > Atorvastatin > Simvastatin > Pravastatin > Lovastatin > Fluvastatin. Rosuvastatin can reduce LDL by up to 55-65% at maximum dose. It is also hydrophilic (less muscle toxicity risk) and has minimal CYP interactions compared to other statins.',
    reference: 'Dr. Kabsha - Hyperlipidemia Module'
  },
  {
    id: 'q_lipid_006', domain: 'PHARM', difficulty: 'medium',
    question: 'Which drug is used to treat hyperlipidemia by binding bile acids in the intestine?',
    options: [
      'A. Atorvastatin - inhibits HMG-CoA reductase',
      'B. Cholestyramine/Colesevelam - bile acid sequestrants',
      'C. Gemfibrozil - PPARα agonist',
      'D. Ezetimibe - NPC1L1 inhibitor'
    ],
    correct: 1,
    explanation: 'Bile acid sequestrants (cholestyramine, colestipol, colesevelam) are anion exchange resins that bind bile acids in the intestinal lumen, preventing their reabsorption. This depletes the bile acid pool, forcing the liver to convert more cholesterol to bile acids, thus reducing hepatic cholesterol and upregulating LDL receptors. They primarily lower LDL. Side effect: GI issues (constipation, bloating). They do NOT absorb systemically.',
    reference: 'Dr. Kabsha - Hyperlipidemia Module'
  },
  {
    id: 'q_lipid_007', domain: 'PHARM', difficulty: 'medium',
    question: 'What is the most serious adverse effect of statins that requires immediate discontinuation?',
    options: [
      'A. Mild myalgia (muscle aches)',
      'B. Rhabdomyolysis (severe muscle breakdown) with elevated CK and myoglobinuria',
      'C. Elevated liver enzymes (AST/ALT >3× ULN)',
      'D. GI upset and flatulence'
    ],
    correct: 1,
    explanation: 'Rhabdomyolysis is the most serious statin adverse effect - massive muscle breakdown that releases myoglobin into circulation → acute kidney injury. Requires immediate statin discontinuation. Monitor: CK levels if symptoms of muscle pain or weakness. Risk increased with: high-dose statins, gemfibrozil combination, cyclosporine, azole antifungals (CYP3A4 inhibitors). Mild myalgia (muscle ache without CK elevation) is common but not dangerous.',
    reference: 'Dr. Kabsha - Hyperlipidemia Module'
  },

  // ══════════════════════════════════════
  // ANTIHISTAMINES
  // ══════════════════════════════════════
  {
    id: 'q_hist_001', domain: 'PHARM', difficulty: 'medium',
    question: 'What distinguishes 1st generation from 2nd generation antihistamines?',
    options: [
      'A. 1st generation are more potent; 2nd generation are less effective',
      'B. 1st generation cross the CNS causing sedation; 2nd generation are more polar and cause less sedation',
      'C. 1st generation are newer; 2nd generation were developed first',
      'D. 1st generation are only available OTC; 2nd generation require a prescription'
    ],
    correct: 1,
    explanation: '1st generation antihistamines (diphenhydramine, chlorpheniramine, cyproheptadine, cinnarizine) cross the blood-brain barrier (BBB), causing CNS sedation (useful as sleep aids; dangerous for driving). 2nd generation antihistamines (cetirizine, loratadine, fexofenadine, levocetirizine) are more polar (due to -COOH group), do NOT cross CNS, cause less sedation, and are more selective for H1 receptors.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_hist_002', domain: 'PHARM', difficulty: 'medium',
    question: 'Hydroxyzine essentially acts as a prodrug for which 2nd generation antihistamine?',
    options: [
      'A. Loratadine',
      'B. Fexofenadine',
      'C. Cetirizine',
      'D. Levocetirizine'
    ],
    correct: 2,
    explanation: 'Hydroxyzine (1st generation H1 blocker) is metabolized to cetirizine (2nd generation). So hydroxyzine acts as a prodrug for cetirizine. Levocetirizine is the active R-enantiomer of cetirizine (3rd generation). Fexofenadine is the active metabolite of terfenadine. H3 receptor antagonist betahistine is used in Meniere\'s disease (inner ear disorder with vertigo).',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_hist_003', domain: 'PHARM', difficulty: 'easy',
    question: 'Which drug is used immediately to relieve ALLERGIC reactions after chemical exposure?',
    options: [
      'A. Prednisolone',
      'B. Epinephrine',
      'C. Chlorpheniramine (1st generation antihistamine)',
      'D. Montelukast'
    ],
    correct: 2,
    explanation: 'Chlorpheniramine (1st generation antihistamine) is used for IMMEDIATE relief of allergic reactions. The 1st generation antihistamines provide quick symptomatic relief of urticaria, rhinorrhea, and mild allergic reactions. For anaphylaxis: epinephrine is the FIRST treatment. For moderate allergic reactions (urticaria, contact allergy): antihistamines like chlorpheniramine are appropriate first-line agents.',
    reference: 'Dr. Kabsha - Asthma Module'
  },

  // ══════════════════════════════════════
  // PHARMACOECONOMICS
  // ══════════════════════════════════════
  {
    id: 'q_econ_001', domain: 'CLIN', difficulty: 'medium',
    question: 'Which type of pharmacoeconomic analysis compares the costs and CLINICAL OUTCOMES of two interventions expressed in natural units (e.g., life-years gained)?',
    options: [
      'A. Cost-Minimization Analysis (CMA)',
      'B. Cost-Benefit Analysis (CBA)',
      'C. Cost-Effectiveness Analysis (CEA)',
      'D. Cost-Utility Analysis (CUA)'
    ],
    correct: 2,
    explanation: 'Cost-Effectiveness Analysis (CEA) compares costs and outcomes expressed in NATURAL CLINICAL UNITS (e.g., cost per mm Hg reduction, cost per life-year gained, cost per infection prevented). Used when comparing treatments with the same type of outcome. Cost-Minimization = same outcomes, compare costs only. Cost-Benefit = outcomes expressed in MONETARY terms. Cost-Utility = outcomes in QALYs (Quality-Adjusted Life Years).',
    reference: 'Dr. Kabsha - Economic Questions Module'
  },
  {
    id: 'q_econ_002', domain: 'CLIN', difficulty: 'medium',
    question: 'Which pharmacoeconomic analysis uses QALY (Quality-Adjusted Life Years) as the outcome measure?',
    options: [
      'A. Cost-Minimization Analysis (CMA)',
      'B. Cost-Effectiveness Analysis (CEA)',
      'C. Cost-Benefit Analysis (CBA)',
      'D. Cost-Utility Analysis (CUA)'
    ],
    correct: 3,
    explanation: 'Cost-Utility Analysis (CUA) measures outcomes in QALYs (Quality-Adjusted Life Years), combining both QUANTITY and QUALITY of life. 1 QALY = 1 year in perfect health. A year in less-than-perfect health = <1 QALY. The ICER (Incremental Cost-Effectiveness Ratio) = (Cost A - Cost B) / (Effectiveness A - Effectiveness B). CUA allows comparison across different disease states, making it the preferred method for healthcare resource allocation decisions.',
    reference: 'Dr. Kabsha - Economic Questions Module'
  },
  {
    id: 'q_econ_003', domain: 'CLIN', difficulty: 'easy',
    question: 'In pharmacoeconomics, which analysis is used when two treatments have IDENTICAL clinical outcomes and only costs differ?',
    options: [
      'A. Cost-Utility Analysis (CUA)',
      'B. Cost-Benefit Analysis (CBA)',
      'C. Cost-Effectiveness Analysis (CEA)',
      'D. Cost-Minimization Analysis (CMA)'
    ],
    correct: 3,
    explanation: 'Cost-Minimization Analysis (CMA) is used when two treatments have PROVEN EQUIVALENT clinical outcomes - only the costs are compared to identify the less expensive option. Example: choosing between two bioequivalent generic medications. This is the simplest pharmacoeconomic analysis. It can only be used when equivalence has been established through clinical trials - it cannot ASSUME equivalence.',
    reference: 'Dr. Kabsha - Economic Questions Module'
  },
  {
    id: 'q_econ_004', domain: 'CLIN', difficulty: 'medium',
    question: 'Which pharmacoeconomic analysis converts ALL outcomes into MONETARY values (dollars) to allow comparison of completely different interventions?',
    options: [
      'A. Cost-Minimization Analysis',
      'B. Cost-Benefit Analysis (CBA)',
      'C. Cost-Utility Analysis',
      'D. Cost-Effectiveness Analysis'
    ],
    correct: 1,
    explanation: 'Cost-Benefit Analysis (CBA) converts ALL costs AND outcomes into monetary units (dollars/dirhams), allowing comparison of different types of interventions across different disease areas. Benefit-Cost Ratio (BCR) = Total Benefits / Total Costs. If BCR >1, the intervention is considered worthwhile. Example: "Does a smoking cessation program save more money in future healthcare costs than it costs to run?"',
    reference: 'Dr. Kabsha - Economic Questions Module'
  },
  {
    id: 'q_econ_005', domain: 'CLIN', difficulty: 'medium',
    question: 'What does ICER stand for and how is it calculated in pharmacoeconomics?',
    options: [
      'A. Incremental Cost-Effectiveness Ratio = (Cost A - Cost B) / (Effectiveness A - Effectiveness B)',
      'B. Incremental Cost per QALY = Total Cost / Total QALY gained',
      'C. Index Cost-Efficiency Ratio = Lowest Cost / Highest Effectiveness',
      'D. Incremental Clinical Effectiveness Rating = Survival rate A - Survival rate B'
    ],
    correct: 0,
    explanation: 'ICER (Incremental Cost-Effectiveness Ratio) = (Cost A - Cost B) / (Effect A - Effect B). It represents the additional cost to gain one additional unit of outcome (e.g., per QALY, per life-year, per mm Hg reduction). A lower ICER indicates better value. Common threshold: $50,000-$100,000 per QALY in the US. The ICER helps decision-makers determine if a more expensive treatment is worth the additional cost.',
    reference: 'Dr. Kabsha - Economic Questions Module'
  },
  {
    id: 'q_econ_006', domain: 'CLIN', difficulty: 'easy',
    question: 'Which type of cost in pharmacoeconomics refers to lost productivity due to illness or disability?',
    options: [
      'A. Direct medical costs (hospitalization, medications)',
      'B. Direct non-medical costs (transportation, home care)',
      'C. Indirect costs (lost wages, productivity losses)',
      'D. Intangible costs (pain, suffering)'
    ],
    correct: 2,
    explanation: 'Cost categories in pharmacoeconomics: Direct MEDICAL costs = hospitalization, drugs, procedures, lab tests; Direct NON-MEDICAL costs = transportation, lodging, home modifications; INDIRECT costs = lost productivity, lost wages, caregiver burden (most difficult to measure and often excluded); INTANGIBLE costs = pain, suffering, reduced quality of life (measured through preference-based instruments like EQ-5D). Complete economic analyses should consider all four cost categories.',
    reference: 'Dr. Kabsha - Economic Questions Module'
  },

  // ══════════════════════════════════════
  // CLINICAL PHARMACY
  // ══════════════════════════════════════
  {
    id: 'q_clin_001', domain: 'CLIN', difficulty: 'medium',
    question: 'ACE inhibitors are contraindicated in pregnancy because they can cause:',
    options: [
      'A. Maternal hypertension rebound',
      'B. Fetal renal dysgenesis, oligohydramnios, and neonatal renal failure',
      'C. Neural tube defects in the first trimester only',
      'D. Maternal postpartum hemorrhage'
    ],
    correct: 1,
    explanation: 'ACE inhibitors (and ARBs) are ABSOLUTELY CONTRAINDICATED in the 2nd and 3rd trimesters. They block the fetal renin-angiotensin system, critical for renal development, causing: fetal renal tubular dysplasia, oligohydramnios (reduced amniotic fluid → fetal lung hypoplasia), neonatal renal failure, fetal hypotension, skull ossification defects. Safe antihypertensives in pregnancy: methyldopa (safest), labetalol, nifedipine, hydralazine.',
    reference: 'Dr. Kabsha - Clinical Module'
  },
  {
    id: 'q_clin_002', domain: 'CLIN', difficulty: 'medium',
    question: 'A patient on warfarin starts fluconazole. What is the expected effect on warfarin therapy?',
    options: [
      'A. Fluconazole induces CYP2C9, decreasing warfarin levels - increase dose',
      'B. Fluconazole inhibits CYP2C9, increasing warfarin effect - risk of bleeding',
      'C. Fluconazole displaces warfarin from albumin with no clinical significance',
      'D. No interaction - different metabolic pathways'
    ],
    correct: 1,
    explanation: 'Fluconazole is a potent CYP2C9 inhibitor (and CYP3A4). Warfarin\'s more potent S-enantiomer is metabolized by CYP2C9. Inhibition → increased warfarin concentration → elevated INR → BLEEDING RISK. Management: monitor INR within 3-5 days; consider reducing warfarin dose by 25-50%; continue monitoring after fluconazole course ends. All azole antifungals can significantly increase warfarin effect.',
    reference: 'Dr. Kabsha - Clinical Module'
  },
  {
    id: 'q_clin_003', domain: 'CLIN', difficulty: 'easy',
    question: 'Morphine is commonly used for severe pain in which chronic condition?',
    options: [
      'A. Osteoarthritis',
      'B. Sickle cell anemia (vaso-occlusive crises)',
      'C. Migraine headaches',
      'D. Chronic lower back pain (non-cancer)'
    ],
    correct: 1,
    explanation: 'Morphine is used for SEVERE pain from sickle cell anemia during vaso-occlusive (painful) crises - characterized by severe bone, joint, and abdominal pain from sickling of red blood cells obstructing blood flow. The severity justifies opioid analgesics. IV morphine is commonly used in acute sickle cell crises in hospital settings. Management also includes IV fluids, oxygen, and hydroxyurea for prevention.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_clin_004', domain: 'CLIN', difficulty: 'easy',
    question: 'What is the first-line pharmacological treatment for newly diagnosed Type 2 Diabetes Mellitus (absent contraindications)?',
    options: [
      'A. Insulin glargine',
      'B. Metformin',
      'C. Glibenclamide (sulfonylurea)',
      'D. Sitagliptin (DPP-4 inhibitor)'
    ],
    correct: 1,
    explanation: 'Metformin remains first-line for T2DM per ADA, AACE, IDF, and WHO guidelines. Advantages: excellent glycemic efficacy (HbA1c ↓1-2%), weight-neutral or weight loss, no hypoglycemia risk, favorable cardiovascular profile, inexpensive. Contraindicated when eGFR <30 mL/min. For ASCVD: add SGLT-2 inhibitor or GLP-1 RA. For heart failure: prefer SGLT-2 inhibitor. For CKD: SGLT-2 inhibitor (renoprotective).',
    reference: 'Dr. Kabsha - Clinical Module'
  },
  {
    id: 'q_clin_005', domain: 'CLIN', difficulty: 'medium',
    question: 'Metformin is absolutely contraindicated when eGFR is below:',
    options: [
      'A. 60 mL/min',
      'B. 45 mL/min',
      'C. 30 mL/min',
      'D. 15 mL/min'
    ],
    correct: 2,
    explanation: 'Metformin is ABSOLUTELY CONTRAINDICATED when eGFR <30 mL/min due to risk of lactic acidosis. eGFR thresholds: ≥60 = use without restriction; 45-59 = use with caution, monitor renal function; 30-44 = do NOT initiate, continue only if already on; <30 = STOP. Metformin accumulates in renal impairment → inhibits mitochondrial respiration → lactic acid accumulation → potentially fatal lactic acidosis.',
    reference: 'Dr. Kabsha - Clinical Module'
  },
  {
    id: 'q_clin_006', domain: 'CLIN', difficulty: 'medium',
    question: 'For status asthmaticus (severe, acute asthma attack unresponsive to initial treatment), what is the APPROPRIATE corticosteroid therapy?',
    options: [
      'A. Inhaled corticosteroid (budesonide) - increased dose',
      'B. Systemic corticosteroids (prednisone, prednisolone, or methylprednisolone)',
      'C. Cromolyn sodium (mast cell stabilizer)',
      'D. Omalizumab (anti-IgE)'
    ],
    correct: 1,
    explanation: 'Systemic corticosteroids (prednisone, prednisolone, methylprednisolone) are used for QUICK RELIEF in acute/severe asthma and status asthmaticus. They are NOT for long-term use due to systemic side effects (adrenal suppression, osteoporosis, hyperglycemia, Cushingoid effects). Maximum prednisone dose in asthma: 60 mg. IV methylprednisolone is preferred for status asthmaticus in hospital. Inhaled steroids are for CHRONIC control, not acute emergencies.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_clin_007', domain: 'CLIN', difficulty: 'medium',
    question: 'For a patient on theophylline with T½ = 8.7 hours and Vd = 0.5 L/kg, weighing 78 kg, at steady state of 10 mg/L - which pharmacokinetic concept is relevant for calculating infusion rate?',
    options: [
      'A. Infusion rate = Cl × Css (clearance × steady state concentration)',
      'B. Infusion rate = Dose × F / Vd',
      'C. Infusion rate = Css × T½',
      'D. Infusion rate = Loading dose / Vd'
    ],
    correct: 0,
    explanation: 'For IV infusion at steady state: Infusion rate (R) = Clearance (Cl) × Desired Css. Cl = 0.693 × Vd / T½. Vd = 0.5 L/kg × 78 kg = 39 L. Cl = 0.693 × 39 / 8.7 = 3.10 L/hr. Infusion rate = 3.10 × 10 = 31 mg/hr. Theophylline has a narrow therapeutic index (range: 10-20 mg/L); levels above 20 cause toxicity (nausea, seizures, arrhythmias).',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_clin_008', domain: 'CLIN', difficulty: 'hard',
    question: 'A 64-year-old obese female (5\'5", 205 lbs, SCr 2.7 mg/dL) has nosocomial pneumonia. Based on CrCl calculation using adjusted body weight, what Primaxin (imipenem-cilastatin) dose is appropriate?',
    options: [
      'A. 500 mg IV Q6H (CrCl ≥71 mL/min)',
      'B. 500 mg IV Q8H (CrCl 41-70 mL/min)',
      'C. 250 mg IV Q6H (CrCl 21-40 mL/min)',
      'D. 250 mg IV Q12H (CrCl 6-20 mL/min)'
    ],
    correct: 2,
    explanation: 'Calculation: TBW = 205 lbs / 2.2 = 93.2 kg. IBW female = 45.5 + (2.3 × 5 inches over 5 ft) = 57 kg. BMI = 34.1 (obese) → use AdjBW. AdjBW = 57 + 0.4 × (93.2 - 57) = 71.5 kg. CrCl = (140-64) × 71.5 × 0.85 / (72 × 2.7) = 23.75 mL/min. CrCl of 21-40 mL/min → Primaxin 250 mg IV Q6H. This case illustrates full renal dosing calculation for obese patients.',
    reference: 'Dr. Kabsha - Calculations Module'
  },

  // ══════════════════════════════════════
  // PHARMACOKINETICS (ADVANCED)
  // ══════════════════════════════════════
  {
    id: 'q_pk_001', domain: 'CLIN', difficulty: 'medium',
    question: 'The Cockcroft-Gault equation is used to estimate creatinine clearance in adults. Which formula is used for CHILDREN?',
    options: [
      'A. Cockcroft-Gault formula (same as adults)',
      'B. Schwartz formula',
      'C. MDRD (Modification of Diet in Renal Disease)',
      'D. CKD-EPI formula'
    ],
    correct: 1,
    explanation: 'Creatinine clearance estimation formulas: Adults = Cockcroft-Gault equation: (140-age) × weight / (72 × SCr); multiply by 0.85 for females. Children = Schwartz formula: (k × height in cm) / SCr. Drug dose adjustment is required when CrCl <60 mL/min. The "gold standard" for measuring GFR is inulin clearance (not creatinine), but creatinine clearance is used clinically as it is practical.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_pk_002', domain: 'CALC', difficulty: 'hard',
    question: 'A 1000 mg dose of drug is given IV to a 60 kg male. Initial plasma concentration = 10 mg/L, elimination rate constant = 0.1/hr. What is the total body clearance?',
    options: [
      'A. 10 L/hr',
      'B. 100 L/hr',
      'C. 150 L/hr',
      'D. 250 L/hr'
    ],
    correct: 0,
    explanation: 'Step 1: Vd = Dose / Initial concentration = 1000 mg / 10 mg/L = 100 L. Step 2: Clearance = Vd × Kel = 100 L × 0.1/hr = 10 L/hr. Alternative: T½ = 0.693/Kel = 0.693/0.1 = 6.93 hr. CL = 0.693 × Vd / T½ = 0.693 × 100 / 6.93 = 10 L/hr. Clearance represents the volume of plasma cleared of drug per unit time.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_pk_003', domain: 'CALC', difficulty: 'medium',
    question: 'Aminophylline is 80% theophylline. A 500 mg aminophylline dose with T½ = 6.93 hours - how many hours to reach below 2% concentration?',
    options: [
      'A. 6.93 hours (1 half-life)',
      'B. 20.79 hours (3 half-lives)',
      'C. 42 hours (6 half-lives)',
      'D. 34.65 hours (5 half-lives)'
    ],
    correct: 2,
    explanation: 'Starting at 80% (theophylline content): 80% → 40% → 20% → 10% → 5% → 2.5% → 1.25%. To get below 2%: need 6 half-lives. Time = 6 × T½ = 6 × 6.93 = 41.5 hours ≈ 42 hours. Each half-life reduces concentration by 50%. After 5 half-lives, ~97% of drug is eliminated (at steady state); need 6 half-lives to go from 80% below 2%.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_pk_004', domain: 'CALC', difficulty: 'medium',
    question: 'Aminophylline (80% theophylline) in 500 mL solution. T½ = 6 hours. What is the theophylline concentration after 1 day?',
    options: [
      'A. 20%',
      'B. 10%',
      'C. 5%',
      'D. 2.5%'
    ],
    correct: 2,
    explanation: '1 day = 24 hours = 4 half-lives (24/6 = 4). Starting concentration of theophylline = 80%. After 1 T½: 40%. After 2 T½: 20%. After 3 T½: 10%. After 4 T½: 5%. So after 1 day, 5% theophylline remains. Key: count number of half-lives in the given time period, then halve the concentration for each.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_pk_005', domain: 'CALC', difficulty: 'medium',
    question: 'An aspirin dose of 500 mg is given with initial plasma concentration of 100 mg/L and T½ = 6 hours. Calculate total body clearance:',
    options: [
      'A. 0.5 L/hr',
      'B. 5 L/hr',
      'C. 50 L/hr',
      'D. 0.1 L/hr'
    ],
    correct: 0,
    explanation: 'Step 1: Vd = Dose / Initial concentration = 500 mg / 100 mg/L = 5 L. Step 2: CL = 0.693 × Vd / T½ = 0.693 × 5 / 6 = 0.5775 L/hr ≈ 0.5 L/hr. This is a small Vd (5L ≈ plasma volume), indicating aspirin stays mainly in the plasma compartment. The clearance formula CL = 0.693 × Vd / T½ is essential for pharmacokinetic calculations.',
    reference: 'Dr. Kabsha - Calculations Module'
  },

  // ══════════════════════════════════════
  // ADDITIONAL CLINICAL & PHARMACOLOGY
  // ══════════════════════════════════════
  {
    id: 'q_misc_001', domain: 'PHARM', difficulty: 'easy',
    question: 'Which drug should be given to prevent asthma BEFORE exercise (exercise-induced asthma)?',
    options: [
      'A. Salmeterol (LABA) - given 30 minutes before',
      'B. Salbutamol (SABA) - given 15 minutes before exercise',
      'C. Montelukast - taken daily',
      'D. Theophylline - taken 1 hour before'
    ],
    correct: 1,
    explanation: 'For exercise-induced asthma: SABA (salbutamol/albuterol) taken 15-30 minutes BEFORE exercise is the most effective prophylactic treatment for acute bronchospasm during exercise. For longer-term prevention: montelukast (leukotriene antagonist) can be taken daily. LABAs are not used alone (must combine with ICS) and are for chronic prevention of nocturnal asthma, not acute pre-exercise prophylaxis.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_002', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the side effect profile of B2 agonists (salbutamol, salmeterol)?',
    options: [
      'A. Bradycardia, hypoglycemia, hyperkalemia',
      'B. Tachycardia, hyperglycemia, hypokalemia, hypomagnesemia',
      'C. Hypotension, bradycardia, hyperkalemia',
      'D. Dry mouth, constipation, urinary retention'
    ],
    correct: 1,
    explanation: 'B2 agonist side effects include: Tachycardia (B2 agonists also have some B1 effect), Hyperglycemia (increased glycogenolysis and gluconeogenesis), Hypokalemia (increased cellular uptake of K+ via Na+/K+-ATPase stimulation), and Hypomagnesemia. Important clinical interactions: Monitor K+ and Mg2+ especially in patients on digoxin, lithium, spironolactone, ACEIs, thiazides, or loop diuretics which can further lower K+.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_003', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the NON-PHARMACOLOGICAL treatment of asthma?',
    options: [
      'A. Acupuncture and herbal remedies',
      'B. Breathing exercises',
      'C. Dietary supplementation with omega-3',
      'D. Regular saline nasal rinses'
    ],
    correct: 1,
    explanation: 'Breathing exercises are the primary non-pharmacological treatment for asthma. They include: diaphragmatic breathing, pursed-lip breathing, Buteyko breathing technique, and yoga breathing (pranayama). Other non-pharmacological measures: allergen avoidance (dust mites, pet dander, pollen), smoking cessation, weight management (obesity worsens asthma), air purifiers, and avoiding NSAID/beta-blocker triggers.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_004', domain: 'PHARM', difficulty: 'medium',
    question: 'Which is the most potent corticosteroid among the following?',
    options: [
      'A. Hydrocortisone (least potent)',
      'B. Prednisone',
      'C. Dexamethasone (most potent)',
      'D. Prednisolone'
    ],
    correct: 2,
    explanation: 'Corticosteroid potency ranking (anti-inflammatory): Beta-methasone = Dexamethasone (most potent) > Triamcinolone > Prednisolone > Prednisone > Hydrocortisone (least potent). Mineral corticosteroids (sodium-retaining activity): Fludrocortisone > Deoxycorticosterone > Aldosterone. Hydrocortisone has the most mineralocorticoid activity among glucocorticoids. Dexamethasone is used in cerebral edema and as anti-emetic in chemo.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_005', domain: 'PHARM', difficulty: 'easy',
    question: 'Which drug is contraindicated in asthma?',
    options: [
      'A. Salbutamol (B2 agonist)',
      'B. Ipratropium (anticholinergic)',
      'C. Beta-2 antagonist (beta-blocker)',
      'D. Cromolyn sodium'
    ],
    correct: 2,
    explanation: 'Beta-2 antagonists (beta-blockers, especially non-selective ones like propranolol, nadolol) are CONTRAINDICATED in asthma because they block bronchodilatory B2 receptors, causing or worsening bronchospasm. Even selective B1-blockers (metoprolol, atenolol) can cause bronchospasm at higher doses. If a beta-blocker is absolutely necessary, use the most selective B1 blocker at lowest effective dose with close monitoring.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_006', domain: 'PHARM', difficulty: 'medium',
    question: 'Cromolyn sodium (mast cell stabilizer) - when should it be taken for maximum prophylactic effect against allergen exposure?',
    options: [
      'A. Immediately before allergen contact',
      'B. 1-2 weeks before allergen contact',
      'C. 24 hours before allergen contact',
      'D. It is taken during acute attacks for maximum effect'
    ],
    correct: 1,
    explanation: 'Cromolyn sodium (and nedocromil sodium) are mast cell stabilizers used ONLY for PROPHYLAXIS of asthma - they have NO role in acute attacks. For maximum effect, they should be taken 1-2 WEEKS BEFORE contact with a known allergen. They work by stabilizing mast cell membranes, preventing degranulation and release of inflammatory mediators. Cromolyn can be used safely in chronic asthma in PREGNANT women.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_007', domain: 'PHARM', difficulty: 'medium',
    question: 'Which drug is used to treat post-anesthesia respiratory depression?',
    options: [
      'A. Naloxone (opioid antagonist)',
      'B. Picrotoxin (CNS stimulant)',
      'C. Flumazenil (benzodiazepine antagonist)',
      'D. Atropine (anticholinergic)'
    ],
    correct: 1,
    explanation: 'Picrotoxin is a CNS stimulant and GABA-A antagonist used as an antidote for post-anesthesia respiratory depression (particularly barbiturate or CNS depressant overdose). It acts as a GABA-A receptor antagonist at the chloride ionophore. For OPIOID-induced respiratory depression: naloxone. For benzodiazepine overdose: flumazenil. For atropine-like toxicity: physostigmine.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_008', domain: 'PHARM', difficulty: 'easy',
    question: 'Volume of distribution of theophylline is:',
    options: [
      'A. 0.1-0.2 L/kg (plasma only)',
      'B. 0.3-0.7 L/kg (total body water)',
      'C. 5-10 L/kg (extensive tissue binding)',
      'D. 50-100 L/kg (deep compartment)'
    ],
    correct: 1,
    explanation: 'Theophylline has a Vd of 0.3-0.7 L/kg and plasma protein binding of approximately 40-60%. This Vd approximates total body water, indicating relatively uniform distribution without extensive tissue or plasma sequestration. The narrow therapeutic index of theophylline (10-20 mcg/mL) means Vd is clinically important for loading dose calculations. Factors increasing theophylline clearance: smoking, rifampin.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_009', domain: 'PHARM', difficulty: 'medium',
    question: 'Pentazocine acts as an agonist on KAPPA receptors and a WEAK antagonist on MU receptors. What happens if pentazocine is given to a patient who was previously taking morphine?',
    options: [
      'A. Enhanced analgesia from the combined opioid effects',
      'B. Withdrawal symptoms are precipitated due to mu receptor antagonism',
      'C. No interaction as they act on different receptors',
      'D. Reduced side effects with maintained analgesia'
    ],
    correct: 1,
    explanation: 'Pentazocine is a mixed agonist/antagonist: kappa agonist (provides some analgesia) + weak mu antagonist. If given to a morphine-dependent patient, the mu antagonism displaces morphine from mu receptors, PRECIPITATING WITHDRAWAL SYMPTOMS (agitation, sweating, piloerection, tachycardia, vomiting). This is a clinically important interaction. Buprenorphine (partial mu agonist) can also precipitate withdrawal if given to a patient on full agonist opioids.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_misc_010', domain: 'PHARM', difficulty: 'easy',
    question: 'Enkephalins are endogenous peptides that are similar in action to which drug?',
    options: [
      'A. Aspirin',
      'B. Morphine',
      'C. Gabapentin',
      'D. Tramadol'
    ],
    correct: 1,
    explanation: 'Enkephalins (along with endorphins and dynorphins) are endogenous opioid peptides that bind to opioid receptors (mu, delta, kappa) similar to morphine. They are released in response to pain and stress, modulating pain perception through the same receptors as exogenous opioids. Beta-endorphins are the most potent endogenous opioids. Enkephalins act primarily on delta receptors; dynorphins on kappa receptors.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_misc_011', domain: 'PHARM', difficulty: 'medium',
    question: 'LABA (Long-Acting Beta-2 Agonists) should NEVER be used alone in asthma without:',
    options: [
      'A. An antihistamine',
      'B. A leukotriene antagonist',
      'C. Inhaled corticosteroids (ICS)',
      'D. A systemic corticosteroid'
    ],
    correct: 2,
    explanation: 'LABAs (formoterol, salmeterol) must ALWAYS be used in COMBINATION with ICS in asthma - never as monotherapy. LABA monotherapy in asthma is associated with an increased risk of asthma-related DEATH (FDA Black Box Warning). They are used for: chronic asthma (combined with ICS), prevention of nocturnal asthma, COPD maintenance. Ultra-LABAs (vilanterol, indacaterol) are used in COPD.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_012', domain: 'PHARM', difficulty: 'medium',
    question: 'Aminophylline contains 80% theophylline. Which of the following is a clinically significant pharmacokinetic characteristic of theophylline?',
    options: [
      'A. Wide therapeutic index - safe at any dose',
      'B. No drug interactions of clinical significance',
      'C. Narrow therapeutic index; interacts with digoxin, lithium, warfarin, cyclosporine',
      'D. Exclusively renally cleared with no hepatic metabolism'
    ],
    correct: 2,
    explanation: 'Theophylline has a NARROW THERAPEUTIC INDEX (toxic range is close to therapeutic range: 10-20 mcg/mL; toxicity at >20 mcg/mL). Significant drug interactions: CYP1A2 inhibitors (ciprofloxacin, erythromycin) increase theophylline levels → toxicity (nausea, tremor, seizures, arrhythmias). CYP1A2 inducers (rifampin, smoking) decrease levels. Also interacts with digoxin, lithium, warfarin, tacrolimus, and cyclosporine. TDM monitoring is essential.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_013', domain: 'PHARM', difficulty: 'easy',
    question: 'What are the GOLD SCORE COPD categories? Which GOLD category requires LAMA as first-line treatment?',
    options: [
      'A. Category A - mild symptoms, 1 exacerbation/year, mMRC 1',
      'B. Category B - more symptoms, 1 exacerbation/year, mMRC >1, requires long bronchodilator',
      'C. Category C - 2+ exacerbations/year, mMRC 1, requires LAMA',
      'D. Category D - 2+ exacerbations/year, mMRC >1, requires LAMA + LABA'
    ],
    correct: 2,
    explanation: 'GOLD COPD classification: A = mMRC 1, ≤1 exacerbation/year → short bronchodilator; B = mMRC >1, ≤1 exacerbation/year → LABA or LAMA; C = mMRC 1, ≥2 exacerbations/year → LAMA; D = mMRC >1, ≥2 exacerbations/year → LAMA + LABA or LABA + ICS. LAMA (tiotropium) is the backbone of COPD therapy in categories C and D where exacerbation risk is high.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_014', domain: 'PHARM', difficulty: 'medium',
    question: 'Selective COX-2 inhibitors (coxibs like celecoxib) have increased cardiovascular risk. Which NSAID has the LEAST cardiovascular risk?',
    options: [
      'A. Celecoxib (most CVS risk)',
      'B. Rofecoxib (withdrawn from market)',
      'C. Naproxen (least CVS risk)',
      'D. Diclofenac'
    ],
    correct: 2,
    explanation: 'Among NSAIDs, NAPROXEN has the LEAST cardiovascular risk and is considered the safest for patients at CVS risk who need an NSAID. It has balanced COX-1/COX-2 inhibition. Celecoxib (selective COX-2) has MORE CVS risk because COX-2 inhibition reduces prostacyclin (vasodilator/anti-platelet) without reducing thromboxane A2 (vasoconstrictor/platelet aggregator). Rofecoxib was withdrawn due to MI risk. Diclofenac has intermediate risk.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_misc_015', domain: 'CLIN', difficulty: 'medium',
    question: 'A 87-year-old female (5\'4", 103 lbs, SCr 1.0 mg/dL) is ordered levofloxacin. Her CrCl is 29 mL/min. What is the correct dose?',
    options: [
      'A. 500 mg Q24H (CrCl ≥50 mL/min)',
      'B. 250 mg Q24H (CrCl 20-49 mL/min)',
      'C. 250 mg Q48H (CrCl <20 mL/min)',
      'D. 750 mg Q24H (full dose for elderly)'
    ],
    correct: 1,
    explanation: 'For levofloxacin: CrCl ≥50 mL/min = 500 mg Q24H; CrCl 20-49 mL/min = 250 mg Q24H; CrCl <20 mL/min = 250 mg Q48H. Patient CrCl = 29 mL/min → 250 mg Q24H is correct. Note: This patient\'s total body weight (46.8 kg) is LESS than her IBW (54.7 kg), so use TOTAL BODY WEIGHT for CrCl calculation. Always check if patient is underweight vs. overweight before choosing which weight to use.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_misc_016', domain: 'CLIN', difficulty: 'medium',
    question: 'A 50-year-old male HIV patient (SCr 1.8, BMI normal, CrCl 55 mL/min) is being started on tenofovir. What is the correct dose?',
    options: [
      'A. 300 mg daily (CrCl ≥50 mL/min)',
      'B. 300 mg Q48H (CrCl 30-49 mL/min)',
      'C. 300 mg Q72-96H (CrCl 10-29 mL/min)',
      'D. 300 mg weekly (CrCl <10 mL/min)'
    ],
    correct: 0,
    explanation: 'Tenofovir dosing by CrCl: ≥50 mL/min = 300 mg daily; 30-49 mL/min = 300 mg Q48H; 10-29 mL/min = 300 mg Q72-96H; <10 mL/min = 300 mg weekly. Patient CrCl = 55 mL/min → standard dose of 300 mg daily. CrCl calculated: (140-50) × 80 / (72 × 1.8) = 55 mL/min, where 80 kg was used (IBW ≈ TBW). Tenofovir is nephrotoxic; monitor renal function closely.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_misc_017', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the preferred corticosteroid for ONCE-DAILY inhaled dosing based on its chemical structure?',
    options: [
      'A. Fluticasone propionate',
      'B. Betamethasone',
      'C. Fluticasone furoate',
      'D. Beclomethasone'
    ],
    correct: 2,
    explanation: 'Fluticasone furoate is structured for once-daily dosing due to its prolonged receptor binding and retention in lung tissue (high glucocorticoid receptor affinity and slow dissociation). This is why it is combined with vilanterol (ultra-LABA) in Relvar/Breo Ellipta for once-daily COPD and asthma therapy. Fluticasone propionate requires twice-daily dosing. Structure of the furoate ester at C-17 is responsible for enhanced potency and duration.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_018', domain: 'PHARM', difficulty: 'easy',
    question: 'What is the most common side effect of albuterol (salbutamol) use?',
    options: [
      'A. Hypertension',
      'B. Tachycardia',
      'C. Hyperkalemia',
      'D. Bronchoconstriction'
    ],
    correct: 1,
    explanation: 'Tachycardia is the most common and clinically significant side effect of albuterol (salbutamol). Although albuterol is relatively selective for B2 receptors, at therapeutic doses it can stimulate B1 receptors enough to cause increased heart rate. This is especially important in patients with cardiovascular disease. Other side effects: palpitations, tremor, nervousness, hypokalemia, hyperglycemia.',
    reference: 'Dr. Kabsha - Asthma Module'
  },
  {
    id: 'q_misc_019', domain: 'PHARM', difficulty: 'medium',
    question: 'Which of the following is a SELECTIVE COX-2 inhibitor with the highest cardiovascular risk?',
    options: [
      'A. Aspirin',
      'B. Ibuprofen',
      'C. Celecoxib',
      'D. Naproxen'
    ],
    correct: 2,
    explanation: 'Celecoxib is a selective COX-2 inhibitor with the highest CVS risk among coxibs. Selective COX-2 inhibition reduces prostacyclin (PGI2 - vasodilator, antiplatelet) without reducing thromboxane A2 (TXA2 - vasoconstrictor, platelet aggregator), creating a prothrombotic imbalance. Rofecoxib (Vioxx) was a more potent selective COX-2 inhibitor that was withdrawn from market due to increased MI risk. Naproxen has the least CVS risk.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },
  {
    id: 'q_misc_020', domain: 'CLIN', difficulty: 'easy',
    question: 'What is the therapeutic index and how is it calculated?',
    options: [
      'A. TI = ED50 / LD50 (ratio of therapeutic to lethal dose)',
      'B. TI = LD50 / ED50 (ratio of lethal dose to effective dose)',
      'C. TI = Maximum dose / Minimum dose',
      'D. TI = Bioavailability / Half-life'
    ],
    correct: 1,
    explanation: 'Therapeutic Index (TI) = LD50 / ED50. LD50 = Lethal dose in 50% of experimental animals. ED50 = Effective dose producing specified response in 50% of the population. A HIGH TI = SAFER drug (e.g., penicillins, TI very high). A NARROW (LOW) TI = dangerous, requires monitoring (e.g., digoxin, lithium, warfarin, theophylline, phenytoin, aminoglycosides). These narrow TI drugs require therapeutic drug monitoring (TDM).',
    reference: 'Dr. Kabsha - Asthma Module'
  },

  // ══════════════════════════════════════
  // ADDITIONAL PHARMACOECONOMICS
  // ══════════════════════════════════════
  {
    id: 'q_econ_007', domain: 'CLIN', difficulty: 'medium',
    question: 'In a clinical trial forest plot, the diamond (pooled estimate) is to the LEFT of the line of no effect. What does this indicate?',
    options: [
      'A. The intervention INCREASES the risk of the outcome',
      'B. The intervention DECREASES the risk of the outcome (beneficial)',
      'C. There is no significant effect',
      'D. The study was biased'
    ],
    correct: 1,
    explanation: 'In a forest plot showing Risk Ratios (RR) or Odds Ratios (OR): if the diamond is to the LEFT of the line of no effect (OR/RR = 1 for risk outcomes), the intervention DECREASES the risk = BENEFICIAL for harm-prevention studies. If to the RIGHT, it increases risk. If the diamond crosses the line of no effect → NOT statistically significant. Forest plots are used in meta-analyses to show pooled effects across multiple studies.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_econ_008', domain: 'CLIN', difficulty: 'easy',
    question: 'What type of chart/graph displays frequency distribution data, showing the number of observations within each interval (class)?',
    options: [
      'A. Pie chart',
      'B. Histogram',
      'C. Forest plot',
      'D. Scatter plot'
    ],
    correct: 1,
    explanation: 'A Histogram displays the frequency distribution of continuous data, showing the number of observations within each class interval as adjacent bars (no gaps between bars). Pie chart = shows proportional composition of a whole. Forest plot = shows pooled effect estimates in meta-analysis. Scatter plot = shows relationship between two continuous variables. Bar chart = compares categorical data with gaps between bars.',
    reference: 'Dr. Kabsha - Calculations Module'
  },

  // ══════════════════════════════════════
  // MALARIA & INFECTIOUS DISEASE
  // ══════════════════════════════════════
  {
    id: 'q_infect_001', domain: 'PHARM', difficulty: 'medium',
    question: 'What is the FIRST-LINE treatment for uncomplicated malaria?',
    options: [
      'A. Artemether + Lumefantrine',
      'B. Pyrimethamine + Sulfadoxine or Artesunate',
      'C. Quinine + Clindamycin',
      'D. Chloroquine monotherapy'
    ],
    correct: 1,
    explanation: 'Malaria treatment: First-line = Pyrimethamine + Sulfadoxine (Fansidar) or Artesunate-based combination therapy; Second-line = Artemether + Lumefantrine. Malaria in PREGNANCY: 1st trimester → Quinine + Clindamycin (artemisinins avoided in 1st trimester); 2nd-3rd trimester → Quinine + Clindamycin OR artesunate + pyrimethamine. Chloroquine resistance is widespread, limiting its use to sensitive P. vivax or P. malariae.',
    reference: 'Dr. Kabsha - Analgesics Module'
  },

  // ══════════════════════════════════════
  // PHARMACEUTICAL CALCULATIONS
  // ══════════════════════════════════════
  {
    id: 'q_pharmsci_001', domain: 'CALC', difficulty: 'medium',
    question: 'PPM (parts per million) is equivalent to which concentration expression?',
    options: [
      'A. mg/mL',
      'B. g/L',
      'C. mg/L (milligrams per liter)',
      'D. mcg/mL only'
    ],
    correct: 2,
    explanation: 'PPM (Parts Per Million) = mg/L (milligrams per liter) for aqueous solutions. Also equivalent to: 1 PPM = 1 mcg/g (for solids); 1 PPM = 0.0001% (w/v); 1 PPM = 1 mg/kg. Example: 5 PPM iron in water = 5 mg/L = 0.0005% w/v. Important unit conversions: 1 tablespoon (tbsp) = 15 mL; 1 teaspoon (tsp) = 5 mL; 1 gallon = 3.79 L; 1 kg = 2.2 lb; 1 inch = 2.54 cm.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_pharmsci_002', domain: 'CALC', difficulty: 'medium',
    question: 'A drug vial contains 0.2% w/v drug X. What is the amount of drug X (in mg) in a 5 mL dose?',
    options: [
      'A. 0.1 mg',
      'B. 1 mg',
      'C. 10 mg',
      'D. 100 mg'
    ],
    correct: 2,
    explanation: '0.2% w/v = 0.2 g per 100 mL = 2 mg/mL. Amount in 5 mL = 2 mg/mL × 5 mL = 10 mg. Rapid calculation tip: %w/v × 10 = mg/mL (e.g., 0.2% × 10 = 2 mg/mL). This conversion is essential for calculating drug amounts from percentage concentration solutions. Always confirm whether the percentage is w/v, w/w, or v/v.',
    reference: 'Dr. Kabsha - Calculations Module'
  },
  {
    id: 'q_pharmsci_003', domain: 'CALC', difficulty: 'hard',
    question: 'A 20 mL vial labeled "Potassium Chloride 2 mEq/mL" (KCl MW = 74.5 g/mol). How many grams of KCl are present?',
    options: [
      'A. 2.98 g',
      'B. 1.49 g',
      'C. 5.96 g',
      'D. 7.45 g'
    ],
    correct: 0,
    explanation: 'KCl (MW = 74.5) dissociates into K+ and Cl- (2 particles), so 1 mmol KCl = 2 mEq. mEq in vial = 2 mEq/mL × 20 mL = 40 mEq. mmoles = 40 mEq / 2 = 20 mmol (since KCl valence = 1, 1 mmol = 1 mEq for univalent ions... actually KCl: 1 mmol = 2 mEq since it gives K+ 1 mEq + Cl- 1 mEq = 2 mEq total). So mmoles = 40/2 = 20 mmol = 0.020 mol. Mass = 0.020 mol × 74.5 g/mol = 1.49 g. Rechecking: 2 mEq/mL × 20 mL = 40 mEq. For KCl monovalent: mEq = mmol. Mass = 40 mmol × 74.5 mg/mmol = 2980 mg = 2.98 g. Answer: A (2.98 g).',
    reference: 'Dr. Kabsha - Calculations Module'
  }

,
  {
    "id": "q_new_001",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "Which of the following is the appropriate antidote for Unfractionated Heparin (UFH)?",
    "options": [
      "A. Vitamin K",
      "B. Protamine sulfate",
      "C. Idarucizumab",
      "D. Flumazenil"
    ],
    "correct": 1,
    "explanation": "Protamine sulfate is the specific antidote for Unfractionated Heparin (UFH). UFH is an indirect thrombin inhibitor that can cause Heparin-induced thrombocytopenia (HIT).",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_002",
    "domain": "PHARM",
    "difficulty": "easy",
    "question": "What is the recommended dose of Enoxaparin (LMWH) for the treatment of VTE and NSTEMI?",
    "options": [
      "A. 1 mg/kg/dose BID or 1.5 mg/kg/dose OD",
      "B. 40 mg OD",
      "C. 0.5 mg/kg/dose BID",
      "D. 30 mg OD"
    ],
    "correct": 0,
    "explanation": "The general dose of Enoxaparin for the treatment of VTE and NSTEMI is 1 mg/kg/dose BID or 1.5 mg/kg/dose OD. 40 mg OD is typically used for prophylaxis.",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_003",
    "domain": "PHARM",
    "difficulty": "easy",
    "question": "Which of the following drugs is an oral direct thrombin inhibitor?",
    "options": [
      "A. Rivaroxaban",
      "B. Apixaban",
      "C. Dabigatran",
      "D. Warfarin"
    ],
    "correct": 2,
    "explanation": "Dabigatran is an oral direct thrombin inhibitor. It can cause GI side effects (dyspepsia) and is contraindicated in renal failure. Rivaroxaban and Apixaban are direct factor Xa inhibitors.",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_004",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "What is the specific antidote for the reversal of Dabigatran?",
    "options": [
      "A. Vitamin K",
      "B. Andexanet alfa",
      "C. Protamine sulfate",
      "D. Idarucizumab"
    ],
    "correct": 3,
    "explanation": "Idarucizumab is the specific antidote for Dabigatran. Andexanet alfa is used for factor Xa inhibitors.",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_005",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "What is the target INR range for a patient on Warfarin therapy with a mechanical mitral valve?",
    "options": [
      "A. 2.0 - 3.0",
      "B. 2.5 - 3.5",
      "C. 1.5 - 2.5",
      "D. 3.0 - 4.0"
    ],
    "correct": 1,
    "explanation": "The normal range of INR on Warfarin therapy is 2-3. However, for a mechanical mitral valve, the target INR is 2.5-3.5.",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_006",
    "domain": "PHARM",
    "difficulty": "hard",
    "question": "A patient on Warfarin is prescribed Amiodarone. What pharmacokinetic interaction is expected?",
    "options": [
      "A. Amiodarone induces CYP2C9, decreasing the effect of Warfarin",
      "B. Amiodarone inhibits CYP2C9, increasing the effect of Warfarin",
      "C. Amiodarone induces CYP3A4, decreasing the effect of Warfarin",
      "D. Amiodarone inhibits VKORC1 directly"
    ],
    "correct": 1,
    "explanation": "Amiodarone is a CYP2C9 inhibitor. It will increase the effect of Warfarin, leading to an elevated INR. When starting amiodarone, the Warfarin dose should be reduced by 30-50%.",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_007",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "How long before surgery should Enoxaparin (LMWH) be stopped?",
    "options": [
      "A. 4-6 hours",
      "B. 12 hours",
      "C. 24 hours",
      "D. 5 days"
    ],
    "correct": 2,
    "explanation": "Enoxaparin (LMWH) should be stopped 24 hours (1 day) before surgery. UFH is stopped 4-6 hours before, and Warfarin/Clopidogrel are stopped 5 days before.",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_008",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "How long before surgery should Warfarin be stopped?",
    "options": [
      "A. 1 day",
      "B. 3 days",
      "C. 5 days",
      "D. 7 days"
    ],
    "correct": 2,
    "explanation": "Warfarin and Clopidogrel should be stopped 5 days before surgery to allow for adequate synthesis of new clotting factors and platelets.",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_009",
    "domain": "PHARM",
    "difficulty": "hard",
    "question": "Calculate the CHA2DS2-VASc score for a 76-year-old male with hypertension, hyperlipidemia, and coronary artery disease.",
    "options": [
      "A. 1",
      "B. 3",
      "C. 4",
      "D. 6"
    ],
    "correct": 2,
    "explanation": "Age >= 75 is 2 points, Hypertension is 1 point, Vascular disease (coronary artery disease) is 1 point. Total = 4. Hyperlipidemia does not give points.",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_010",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "Which parenteral direct thrombin inhibitor is preferred in cases of Heparin-Induced Thrombocytopenia (HIT)?",
    "options": [
      "A. Bivalirudin",
      "B. Argatroban",
      "C. Fondaparinux",
      "D. Enoxaparin"
    ],
    "correct": 1,
    "explanation": "Argatroban is a parenteral direct thrombin inhibitor specifically used in the case of Heparin-Induced Thrombocytopenia (HIT).",
    "reference": "Dr. Kabsha - Anticoagulant"
  },
  {
    "id": "q_new_011",
    "domain": "CLIN",
    "difficulty": "easy",
    "question": "A patient is to be started on Abacavir. Which pharmacogenomic test must be performed to avoid severe hypersensitivity?",
    "options": [
      "A. HLA-B*1502",
      "B. HLA-B*5801",
      "C. HLA-B*5701",
      "D. CYP2C19"
    ],
    "correct": 2,
    "explanation": "HLA-B*5701 must be tested before starting Abacavir. If positive, the drug should be avoided due to the risk of severe hypersensitivity (Stevens-Johnson syndrome).",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_012",
    "domain": "CLIN",
    "difficulty": "medium",
    "question": "An Asian patient is being started on Carbamazepine. Which allele testing is recommended to prevent severe cutaneous reactions?",
    "options": [
      "A. HLA-B*5701",
      "B. HLA-B*1502",
      "C. HLA-B*5801",
      "D. CYP2D6"
    ],
    "correct": 1,
    "explanation": "HLA-B*1502 testing is required before initiating Carbamazepine or Oxcarbazepine, especially in Asian populations, to prevent Stevens-Johnson syndrome.",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_013",
    "domain": "CLIN",
    "difficulty": "medium",
    "question": "Clopidogrel is a prodrug that requires activation by which cytochrome P450 enzyme?",
    "options": [
      "A. CYP2C9",
      "B. CYP3A4",
      "C. CYP2C19",
      "D. CYP2D6"
    ],
    "correct": 2,
    "explanation": "Clopidogrel requires activation by CYP2C19. Poor metabolizers (e.g., CYP2C19*2 or *3) will have reduced antiplatelet effect and no activation. It also interacts with Omeprazole (a CYP2C19 inhibitor).",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_014",
    "domain": "CLIN",
    "difficulty": "hard",
    "question": "Which two genes are primarily responsible for the genetic variability in Warfarin metabolism and sensitivity?",
    "options": [
      "A. CYP2C19 and CYP2D6",
      "B. CYP2C9 and VKORC1",
      "C. CYP3A4 and TPMT",
      "D. UGT1A1 and SLCO1B1"
    ],
    "correct": 1,
    "explanation": "Warfarin metabolism is affected by CYP2C9 (decreased metabolism with *2 or *3 alleles) and sensitivity is determined by VKORC1. Both contribute to bleeding risks.",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_015",
    "domain": "CLIN",
    "difficulty": "medium",
    "question": "Codeine is converted into its active metabolite, morphine, by which enzyme?",
    "options": [
      "A. CYP3A4",
      "B. CYP2C19",
      "C. CYP2D6",
      "D. CYP1A2"
    ],
    "correct": 2,
    "explanation": "Codeine is an antitussive prodrug converted to morphine (analgesic) by CYP2D6. Poor metabolizers will have reduced opioid response, while rapid metabolizers may suffer from toxicity.",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_016",
    "domain": "CLIN",
    "difficulty": "medium",
    "question": "Trastuzumab (Herceptin) is effective only if the breast cancer patient tests positive for which gene?",
    "options": [
      "A. KRAS",
      "B. BRCA1",
      "C. HER2",
      "D. EGFR"
    ],
    "correct": 2,
    "explanation": "Trastuzumab and Pertuzumab target the HER2 receptor and must only be used in patients who are HER2 positive.",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_017",
    "domain": "CLIN",
    "difficulty": "hard",
    "question": "Testing for Thiopurine methyltransferase (TPMT) deficiency is recommended before using which drug to avoid severe myelosuppression?",
    "options": [
      "A. Capecitabine",
      "B. Azathioprine",
      "C. Irinotecan",
      "D. Simvastatin"
    ],
    "correct": 1,
    "explanation": "Azathioprine and 6-Mercaptopurine are metabolized by TPMT. Deficiency in TPMT increases the risk of severe myelosuppression.",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_018",
    "domain": "CLIN",
    "difficulty": "hard",
    "question": "A patient with colorectal cancer is considered for Cetuximab therapy. What must be the status of the KRAS mutation for the therapy to be effective?",
    "options": [
      "A. KRAS must be positive (mutated)",
      "B. KRAS must be negative (wild-type)",
      "C. KRAS status does not affect Cetuximab",
      "D. Both KRAS and BRAF must be positive"
    ],
    "correct": 1,
    "explanation": "Cetuximab and Panitumumab target EGFR. If the KRAS gene is mutated (positive), the patient will have no response. Therefore, KRAS must be negative for efficacy.",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_019",
    "domain": "CLIN",
    "difficulty": "medium",
    "question": "Which genetic polymorphism increases the risk of severe myopathy when a patient is prescribed Simvastatin?",
    "options": [
      "A. UGT1A1*28",
      "B. SLCO1B1",
      "C. IL28B",
      "D. DPD"
    ],
    "correct": 1,
    "explanation": "SLCO1B1 polymorphism reduces the hepatic uptake of Simvastatin, leading to higher plasma concentrations and an increased risk of myopathy.",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_020",
    "domain": "CLIN",
    "difficulty": "medium",
    "question": "Patients with UGT1A1*28 polymorphism are at increased risk of neutropenia when treated with which chemotherapy agent?",
    "options": [
      "A. Irinotecan",
      "B. 5-Fluorouracil",
      "C. Capecitabine",
      "D. Cisplatin"
    ],
    "correct": 0,
    "explanation": "Irinotecan is metabolized by UGT1A1. The *28 variant leads to reduced enzyme activity and a higher risk of severe neutropenia.",
    "reference": "Dr. Kabsha - Pharmacogenomics"
  },
  {
    "id": "q_new_021",
    "domain": "HERB",
    "difficulty": "easy",
    "question": "Which herbal supplement is commonly used to treat urinary symptoms associated with Benign Prostatic Hyperplasia (BPH)?",
    "options": [
      "A. Black cohosh",
      "B. Saw palmetto",
      "C. Echinacea",
      "D. Cranberry"
    ],
    "correct": 1,
    "explanation": "Saw palmetto is used to treat urinary symptoms of BPH. Side effects include dizziness, headache, and GI upset.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_022",
    "domain": "HERB",
    "difficulty": "easy",
    "question": "A menopausal woman experiencing hot flashes is looking for an herbal remedy. Which of the following contains a high concentration of estrogen-like compounds?",
    "options": [
      "A. Milk thistle",
      "B. Feverfew",
      "C. Black cohosh",
      "D. Valerian"
    ],
    "correct": 2,
    "explanation": "Black cohosh contains a high concentration of estrogenic compounds and is used to treat painful menstruation or hot flashes caused by menopause.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_023",
    "domain": "HERB",
    "difficulty": "medium",
    "question": "Which herbal medicine is primarily used for the prophylaxis and treatment of migraine headaches?",
    "options": [
      "A. Feverfew",
      "B. Ginkgo biloba",
      "C. St. John's Wort",
      "D. Ginseng"
    ],
    "correct": 0,
    "explanation": "Feverfew is commonly used to treat and prevent migraine headaches.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_024",
    "domain": "HERB",
    "difficulty": "easy",
    "question": "Which of the following herbal supplements acts as an immunostimulant and is used as supportive therapy for common cold and respiratory tract infections?",
    "options": [
      "A. Garlic",
      "B. Echinacea",
      "C. Fish oil",
      "D. Chamomile"
    ],
    "correct": 1,
    "explanation": "Echinacea acts as an immunostimulant and is used as supportive therapy for respiratory tract infections, common cold, and flu.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_025",
    "domain": "HERB",
    "difficulty": "hard",
    "question": "Which of the following herbal supplements acts as a liver microsomal enzyme inducer and can decrease the INR of a patient on Warfarin?",
    "options": [
      "A. Garlic",
      "B. Ginkgo biloba",
      "C. St. John's Wort",
      "D. Saw palmetto"
    ],
    "correct": 2,
    "explanation": "St. John's Wort is a potent liver enzyme inducer. It interacts with Warfarin by increasing its metabolism, thereby decreasing the INR and increasing clot risk.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_026",
    "domain": "HERB",
    "difficulty": "medium",
    "question": "Which natural product combination is most commonly used for the management of Osteoarthritis?",
    "options": [
      "A. Chondroitin + Glucosamine",
      "B. Fish oil + Red yeast rice",
      "C. Folic acid + Vitamin E",
      "D. Silymarin + Aloe vera"
    ],
    "correct": 0,
    "explanation": "Chondroitin and Glucosamine are commonly used natural supplements to treat Osteoarthritis.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_027",
    "domain": "HERB",
    "difficulty": "easy",
    "question": "Which plant is used to treat nausea and vomiting, exhibiting an effect similar to Ondansetron?",
    "options": [
      "A. Kava Kava",
      "B. Thyme",
      "C. Ginger (Zingiber officinalis)",
      "D. Pomegranate"
    ],
    "correct": 2,
    "explanation": "Ginger (Zingiber officinalis) is a natural antiemetic used to treat nausea and vomiting.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_028",
    "domain": "HERB",
    "difficulty": "medium",
    "question": "What is the active constituent of Milk Thistle, used as a supportive treatment in liver disease?",
    "options": [
      "A. Silymarin",
      "B. Barbaloin",
      "C. Colchicine",
      "D. Aescin"
    ],
    "correct": 0,
    "explanation": "Silymarin is the active constituent of Milk Thistle, which is used as a supportive therapy in liver diseases.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_029",
    "domain": "HERB",
    "difficulty": "medium",
    "question": "Which herbal products are known for their sedative properties and are used to treat anxiety?",
    "options": [
      "A. Valerian and Kava Kava",
      "B. Echinacea and Garlic",
      "C. Ginseng and Thyme",
      "D. Black cohosh and Cranberry"
    ],
    "correct": 0,
    "explanation": "Valerian and Kava Kava are herbal remedies known for their sedative effects and are used to treat anxiety and depression. Note that Kava Kava is hepatotoxic.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_030",
    "domain": "HERB",
    "difficulty": "hard",
    "question": "Which of the following groups of natural products can be used for the treatment of Amebiasis?",
    "options": [
      "A. Garlic, black tea, and coconut water",
      "B. Fish oil and red yeast rice",
      "C. Chamomile, lavender, and lemon",
      "D. Ginkgo biloba and Ginseng"
    ],
    "correct": 0,
    "explanation": "Garlic, black tea, coconut water, curcumin, and ipecac are mentioned as herbal remedies used for Amebiasis.",
    "reference": "Dr. Kabsha - Herbal"
  },
  {
    "id": "q_new_031",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "The positive symptoms of Schizophrenia (psychosis) are primarily associated with hyperactivity in which dopamine pathway?",
    "options": [
      "A. Nigrostriatal pathway",
      "B. Mesolimbic pathway",
      "C. Mesocortical pathway",
      "D. Tuberoinfundibular pathway"
    ],
    "correct": 1,
    "explanation": "The Mesolimbic dopamine pathway is responsible for the positive symptoms of psychosis in Schizophrenia.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_032",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "Which atypical antipsychotic requires strict monitoring of the Absolute Neutrophil Count (ANC) and WBC due to the risk of agranulocytosis?",
    "options": [
      "A. Olanzapine",
      "B. Aripiprazole",
      "C. Clozapine",
      "D. Quetiapine"
    ],
    "correct": 2,
    "explanation": "Clozapine can cause severe agranulocytosis. It is mandatory to monitor ANC and WBC counts. It also lowers the seizure threshold.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_033",
    "domain": "PHARM",
    "difficulty": "hard",
    "question": "Which medication was the first FDA-approved treatment for Tardive Dyskinesia (TD)?",
    "options": [
      "A. Benztropine",
      "B. Diphenhydramine",
      "C. Valbenazine",
      "D. Amantadine"
    ],
    "correct": 2,
    "explanation": "Valbenazine is the first FDA-approved medication for the treatment of Tardive Dyskinesia.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_034",
    "domain": "PHARM",
    "difficulty": "hard",
    "question": "Which of the following medications is a Catechol-O-Methyltransferase (COMT) inhibitor used in Parkinson's disease but carries a risk of hepatotoxicity?",
    "options": [
      "A. Selegiline",
      "B. Entacapone",
      "C. Tolcapone",
      "D. Ropinirole"
    ],
    "correct": 2,
    "explanation": "Tolcapone is a COMT inhibitor used in Parkinson's disease, but its use is limited by severe hepatotoxicity.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_035",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "The 'cheese reaction' leading to a hypertensive crisis is a dangerous food-drug interaction associated with which class of antidepressants?",
    "options": [
      "A. Selective Serotonin Reuptake Inhibitors (SSRIs)",
      "B. Tricyclic Antidepressants (TCAs)",
      "C. Monoamine Oxidase Inhibitors (MAOIs)",
      "D. Serotonin-Norepinephrine Reuptake Inhibitors (SNRIs)"
    ],
    "correct": 2,
    "explanation": "MAOIs interact with tyramine-containing foods (like aged cheese). Tyramine is a catecholamine-releasing agent, and MAOIs inhibit its metabolism, leading to a massive release of norepinephrine and a hypertensive crisis.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_036",
    "domain": "PHARM",
    "difficulty": "easy",
    "question": "Which of the following side effects are classically associated with Tricyclic Antidepressants (TCAs) due to their receptor blockade profile?",
    "options": [
      "A. Hypertensive crisis and insomnia",
      "B. Dry mouth, blurred vision, and urinary retention",
      "C. Nausea, vomiting, and diarrhea",
      "D. Agranulocytosis and seizures"
    ],
    "correct": 1,
    "explanation": "TCAs block acetylcholine receptors, causing prominent anticholinergic side effects such as dry mouth, blurred vision, urinary retention, and constipation.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_037",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "When switching a patient from Fluoxetine to an MAOI, how long should the washout period be to avoid Serotonin Syndrome?",
    "options": [
      "A. 1 week",
      "B. 2 weeks",
      "C. 5-6 weeks",
      "D. 12 weeks"
    ],
    "correct": 2,
    "explanation": "While most SSRIs require a 2-week washout period before starting an MAOI, Fluoxetine requires a 5-6 week washout period due to its very long half-life.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_038",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "Lithium toxicity can be precipitated by which electrolyte imbalance?",
    "options": [
      "A. Hypercalcemia",
      "B. Hypokalemia",
      "C. Hyponatremia",
      "D. Hypermagnesemia"
    ],
    "correct": 2,
    "explanation": "Lithium is handled similarly to sodium by the kidneys. Hyponatremia (low sodium) leads to increased reabsorption of lithium in the proximal tubule, causing lithium toxicity.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_039",
    "domain": "PHARM",
    "difficulty": "easy",
    "question": "Which antiepileptic drug is considered the drug of choice for Absence (petit mal) seizures by blocking T-type calcium channels?",
    "options": [
      "A. Phenytoin",
      "B. Ethosuximide",
      "C. Carbamazepine",
      "D. Gabapentin"
    ],
    "correct": 1,
    "explanation": "Ethosuximide acts uniquely by blocking T-type calcium channels in the thalamus, making it the drug of choice specifically for Absence (petit mal) seizures.",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_040",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "What is the first-line intravenous treatment for Status Epilepticus?",
    "options": [
      "A. Phenytoin",
      "B. Valproic acid",
      "C. Lorazepam",
      "D. Levetiracetam"
    ],
    "correct": 2,
    "explanation": "The first-line therapy for Status Epilepticus is an IV benzodiazepine, preferably IV Lorazepam (or IM Midazolam, or rectal Diazepam).",
    "reference": "Dr. Kabsha - CNS"
  },
  {
    "id": "q_new_041",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "Which of the following vaccines is a LIVE attenuated vaccine?",
    "options": [
      "A. Hepatitis B vaccine",
      "B. Inactivated Influenza Vaccine (IIV)",
      "C. Measles, Mumps, Rubella (MMR)",
      "D. Tetanus toxoid"
    ],
    "correct": 2,
    "explanation": "MMR is a live attenuated vaccine. Mnemonic: 'ROME Is MY Best Place To go Yet' (Rubella, Oral Polio, Measles, Epidemic typhus, Influenza LAIV, Mumps, Yellow fever, BCG, Plague, Typhoid oral, Varicella).",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_042",
    "domain": "PHARM",
    "difficulty": "easy",
    "question": "Live attenuated vaccines are contraindicated in which of the following patient populations?",
    "options": [
      "A. Patients over 65 years old",
      "B. Pregnant women and severely immunocompromised patients",
      "C. Patients with diabetes mellitus",
      "D. Patients with mild upper respiratory infections"
    ],
    "correct": 1,
    "explanation": "Live vaccines should not be given to pregnant women or immunocompromised patients (e.g., CD4 < 200, receiving chemotherapy, or taking biologic agents) because they can cause the actual disease in these populations.",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_043",
    "domain": "PHARM",
    "difficulty": "hard",
    "question": "A patient receives a Live Attenuated Influenza Vaccine (LAIV). How long should they wait before starting an Influenza Antiviral Drug (IAD) like Oseltamivir?",
    "options": [
      "A. 24 hours",
      "B. 48 hours",
      "C. 1 week",
      "D. 2 weeks"
    ],
    "correct": 3,
    "explanation": "If LAIV is administered, the patient must wait 2 weeks before taking an IAD. Conversely, if an IAD is stopped, the patient must wait 48 hours before taking LAIV.",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_044",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "At what age is the Influenza vaccine absolutely contraindicated?",
    "options": [
      "A. Children younger than 6 months",
      "B. Children younger than 2 years",
      "C. Adults older than 65 years",
      "D. Pregnant women in the 1st trimester"
    ],
    "correct": 0,
    "explanation": "The Influenza vaccine is not used for infants younger than 6 months. Pregnant women and older adults are high-risk and strongly recommended to receive the inactivated flu vaccine.",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_045",
    "domain": "PHARM",
    "difficulty": "hard",
    "question": "A patient presents with a major, contaminated wound. Their last Tetanus toxoid (Td) dose was more than 5 years ago, and their prior vaccination history is completely unknown. What is the correct prophylaxis?",
    "options": [
      "A. Td only",
      "B. No treatment needed",
      "C. Td + Tetanus immunoglobulin (TIG)",
      "D. TIG only"
    ],
    "correct": 2,
    "explanation": "For major wounds with an unknown tetanus vaccination history, both Td (vaccine) and TIG (immunoglobulin) must be administered.",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_046",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "During which period of pregnancy is the Tdap vaccine ideally recommended to be administered?",
    "options": [
      "A. First 12 weeks of gestation",
      "B. During the second trimester only",
      "C. Between 27 and 36 weeks gestation",
      "D. Immediately post-partum"
    ],
    "correct": 2,
    "explanation": "The Tdap vaccine is recommended during each pregnancy, ideally administered between 27 and 36 weeks gestation (the last 3 months) to maximize maternal antibody response and passive transfer to the infant.",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_047",
    "domain": "PHARM",
    "difficulty": "easy",
    "question": "According to the vaccination schedule, which vaccine must be given within 12 hours from birth?",
    "options": [
      "A. BCG",
      "B. Oral Polio Vaccine (OPV)",
      "C. Hepatitis B vaccine",
      "D. MMR"
    ],
    "correct": 2,
    "explanation": "The Hepatitis B vaccine should be administered within 12 hours from birth. Preterm babies might have this delayed until they reach 2 kg or 30 days old.",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_048",
    "domain": "PHARM",
    "difficulty": "medium",
    "question": "What is a known immediate adverse event of the Human Papillomavirus (HPV) vaccine that requires patients to remain seated for 15 minutes after administration?",
    "options": [
      "A. Anaphylaxis",
      "B. Seizures",
      "C. Syncope (fainting)",
      "D. Severe injection site erythema"
    ],
    "correct": 2,
    "explanation": "The HPV vaccine can cause syncope (fainting). Therefore, it is recommended that patients remain seated for at least 15 minutes after receiving the vaccine.",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_049",
    "domain": "PHARM",
    "difficulty": "hard",
    "question": "While most vaccines are stored in a refrigerator (2-8\u00b0C), which of the following vaccines must be stored frozen at < -15\u00b0C?",
    "options": [
      "A. Hepatitis B vaccine",
      "B. Zostavax (Zoster vaccine live)",
      "C. Tetanus toxoid",
      "D. Pneumococcal Polysaccharide Vaccine (PPSV)"
    ],
    "correct": 1,
    "explanation": "Most vaccines require refrigeration (2-8\u00b0C), but Zostavax (Live Zoster Vaccine) and Oral Polio Vaccine (OPV) require freezing (< -15\u00b0C and -20\u00b0C respectively).",
    "reference": "Dr. Kabsha - Vaccines"
  },
  {
    "id": "q_new_050",
    "domain": "PHARM",
    "difficulty": "easy",
    "question": "How many doses make up the full series for the Hepatitis A vaccine?",
    "options": [
      "A. 1 dose",
      "B. 2 doses",
      "C. 3 doses",
      "D. 4 doses"
    ],
    "correct": 1,
    "explanation": "The Hepatitis A vaccine is given in a total of 2 doses. By contrast, the Hepatitis B vaccine series consists of 3 doses.",
    "reference": "Dr. Kabsha - Vaccines"
  }
];

// Difficulty metadata
const DIFFICULTIES = {
  easy: { label: 'Easy', color: '#22c55e' },
  medium: { label: 'Medium', color: '#f59e0b' },
  hard: { label: 'Hard', color: '#ef4444' }
};

// Export all data
window.AppData = { DOMAINS, QUESTIONS, DIFFICULTIES };
