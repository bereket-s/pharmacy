// js/i18n.js — Amharic / English localisation for PharmPrep UAE
const I18n = (() => {
  const T = {
    en: {
      // ── Navigation ──────────────────────────────
      nav_dashboard:   'Dashboard',
      nav_practice:    'Practice Questions',
      nav_library:     'Reference Library',
      nav_analytics:   'My Analytics',
      nav_bookmarks:   'Bookmarks',
      streak_label:    'day streak',
      // ── Dashboard ───────────────────────────────
      stat_today:      'Questions Today',
      stat_accuracy:   "Today's Accuracy",
      stat_total:      'Total Answered',
      stat_streak:     '🔥 Day Streak',
      section_domains: '📚 Domain Progress',
      section_attention:'⚠️ Needs Attention',
      btn_practice:    '❓ Start Practice',
      btn_library:     '📚 Open Library',
      btn_random:      '🎲 Random Question',
      // ── Practice ────────────────────────────────
      lbl_domain:      'Domain',
      lbl_difficulty:  'Difficulty',
      lbl_mode:        'Study Mode',
      lbl_num_q:       'Number of Questions',
      ready_practice:  'Ready to Practice?',
      btn_start:       '🚀 Start Session',
      tips_title:      '💡 Quick Tips',
      tip1: 'Press 1–4 to select an option by keyboard',
      tip2: 'Press → or Enter for next question',
      tip3: 'Tap ☆ to bookmark questions to revisit',
      tip4: 'Study Mode shows explanations after each answer',
      study_mode_label:'📖 Study Mode',
      study_mode_hint: 'See explanation after each answer',
      exam_mode_label: '⏱️ Exam Mode',
      exam_mode_hint:  'Timed — see results at end',
      all_domains:     'All Domains',
      all_levels:      'All Levels',
      // ── Library ─────────────────────────────────
      my_documents:    '📄 My Documents',
      btn_upload:      '⬆️ Upload PDF',
      no_doc_open:     'No document open',
      upload_hint:     'Upload a PDF from your device to start reading. Your reading progress is automatically saved.',
      local_hint:      'PDFs are processed locally — nothing is uploaded to any server.',
      // ── Analytics ───────────────────────────────
      lbl_total:       'Total Answered',
      lbl_accuracy:    'Overall Accuracy',
      lbl_streak:      'Current Streak',
      chart_radar:     'Accuracy by Domain',
      chart_bar:       'Domain Breakdown',
      chart_line:      '7-Day Accuracy Trend',
      weak_areas:      '⚠️ Weak Areas to Focus On',
      // ── Bookmarks ───────────────────────────────
      bm_title:        'Bookmarked Questions',
      bm_subtitle:     "Questions you've saved for review. Click any card to practice it.",
      // ── Quiz overlay ────────────────────────────
      quiz_explanation:'Explanation',
      quiz_next:       'Next Question →',
      quiz_try_again:  '🔁 Try Again',
      quiz_done:       '✅ Done',
      time_taken:      'Time Taken',
    },
    am: {
      // ── Navigation ──────────────────────────────
      nav_dashboard:   'ዳሽቦርድ',
      nav_practice:    'ልምምድ ጥያቄዎች',
      nav_library:     'ማጣቀሻ ቤተ-መጻሕፍት',
      nav_analytics:   'ትንታኔዬ',
      nav_bookmarks:   'ቡክማርክ',
      streak_label:    'ቀናት ተከታታይ',
      // ── Dashboard ───────────────────────────────
      stat_today:      'የዛሬ ጥያቄዎች',
      stat_accuracy:   'የዛሬ ትክክለኛነት',
      stat_total:      'ጠቅላላ ምላሽ',
      stat_streak:     '🔥 ቀናት ተከታታይ',
      section_domains: '📚 የርዕሰ-ጉዳይ እድገት',
      section_attention:'⚠️ ትኩረት ያስፈልጋል',
      btn_practice:    '❓ ልምምድ ጀምር',
      btn_library:     '📚 ቤተ-መጻሕፍት ክፈት',
      btn_random:      '🎲 አንድ ጥያቄ',
      // ── Practice ────────────────────────────────
      lbl_domain:      'ርዕሰ ጉዳይ',
      lbl_difficulty:  'ደረጃ',
      lbl_mode:        'አሰልጣኝ ሁነታ',
      lbl_num_q:       'የጥያቄ ቁጥር',
      ready_practice:  'ለልምምድ ዝግጁ?',
      btn_start:       '🚀 ጀምር',
      tips_title:      '💡 ፈጣን ምክሮች',
      tip1: '1–4 ቁልፍ ተጭነህ መልስ ምረጥ',
      tip2: '→ ወይም Enter ቀጣይ ጥያቄ',
      tip3: '☆ ቁልፍ ተጭነህ ጥያቄ ቡክማርክ አድርግ',
      tip4: 'የጥናት ሁነታ ከምላሽ በኋላ ማብራሪያ ያሳያል',
      study_mode_label:'📖 የጥናት ሁነታ',
      study_mode_hint: 'ከሁሉም ምላሽ በኋላ ማብራሪያ ይታያል',
      exam_mode_label: '⏱️ የፈተና ሁነታ',
      exam_mode_hint:  'ጊዜ ተወስኗል — ውጤት በመጨረሻ ይታያል',
      all_domains:     'ሁሉም ርዕሶች',
      all_levels:      'ሁሉም ደረጃዎች',
      // ── Library ─────────────────────────────────
      my_documents:    '📄 ሰነዶቼ',
      btn_upload:      '⬆️ ፒዲኤፍ ጫን',
      no_doc_open:     'ሰነድ አልተከፈተም',
      upload_hint:     'ፒዲኤፍ ጫን ለማንበብ። የንባብ ሂደትህ አውቶማቲክ ይቀመጣል።',
      local_hint:      'ፒዲኤፎቹ በአካባቢ ይሰሩ — ምንም ወደ ሰርቨር አይላክም።',
      // ── Analytics ───────────────────────────────
      lbl_total:       'ጠቅላላ ምላሽ',
      lbl_accuracy:    'አጠቃላይ ትክክለኛነት',
      lbl_streak:      'አሁናዊ ቀናት',
      chart_radar:     'በርዕሰ-ጉዳይ ትክክለኛነት',
      chart_bar:       'ርዕሰ-ጉዳይ ዝርዝር',
      chart_line:      '7-ቀን ዕድገት',
      weak_areas:      '⚠️ ትኩረት የሚፈልጉ አካባቢዎች',
      // ── Bookmarks ───────────────────────────────
      bm_title:        'የቡክማርክ ጥያቄዎች',
      bm_subtitle:     'ለማጥናት ያስቀመጧቸው ጥያቄዎች። ለልምምድ ማናቸውም ካርድ ይጫኑ።',
      // ── Quiz overlay ────────────────────────────
      quiz_explanation:'ማብራሪያ',
      quiz_next:       'ቀጣይ ጥያቄ →',
      quiz_try_again:  '🔁 እንደገና ሞክር',
      quiz_done:       '✅ ተጠናቋል',
      time_taken:      'የፈጀ ጊዜ',
    }
  };

  let lang = localStorage.getItem('pharmprep_lang') || 'en';

  const t = key => (T[lang]?.[key]) ?? (T.en[key]) ?? key;

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== undefined) el.textContent = val;
    });
  }

  function setLang(l) {
    if (!T[l]) return;
    lang = l;
    localStorage.setItem('pharmprep_lang', l);
    document.documentElement.lang = l;
    apply();
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'am' ? 'EN' : 'አማ';
  }

  const toggleLang = () => setLang(lang === 'en' ? 'am' : 'en');

  function init() {
    apply();
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'am' ? 'EN' : 'አማ';
  }

  return { t, setLang, toggleLang, init, getLang: () => lang };
})();
