import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";
import { useGame } from "../../context/GameContext.jsx";
import { t } from "../../utils/i18n.js";

const SUBJECTS = [
  {
    id: "math",
    key: "mathematics",
    ready: true,
    descKey: "mathDesc",
    metaKey: "mathCountLabel",
    tags: ["adaptiveTag"]
  },
  {
    id: "chemistry",
    key: "chemistry",
    ready: true,
    descKey: "chemistryDesc",
    questionCount: 20,
    tags: ["mcqTag"]
  },
  {
    id: "biology",
    key: "biology",
    ready: true,
    descKey: "biologyDesc",
    questionCount: 20,
    tags: ["mcqTag"]
  },
  {
    id: "physics",
    key: "physics",
    ready: true,
    descKey: "physicsDesc",
    questionCount: 20,
    tags: ["mcqTag"]
  }
];

const LANGS = [
  { id: "en", label: "EN" },
  { id: "sw", label: "SW" }
];

const DIFFS = [
  { id: "easy", key: "easy" },
  { id: "medium", key: "medium" },
  { id: "hard", key: "hard" }
];

const MATH_OPERATIONS = [
  { id: "+", key: "mathOpAdd" },
  { id: "-", key: "mathOpSubtract" },
  { id: "×", key: "mathOpMultiply" },
  { id: "÷", key: "mathOpDivide" }
];

const HERO_TAGS = [
  {
    key: "heroChipLiveFeedback",
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="m4 13 4-4 4 4 4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    key: "heroChipClassroom",
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="M5 7h14m-10 0v10m6-10v10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17h18v2H3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    key: "heroChipMobile",
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect x="7" y="3" width="10" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    )
  }
];

const METRICS = [
  { id: "rounds", valueKey: "metricRoundsValue", labelKey: "metricRoundsLabel" },
  { id: "engagement", valueKey: "metricEngagementValue", labelKey: "metricEngagementLabel" },
  { id: "availability", valueKey: "metricAvailabilityValue", labelKey: "metricAvailabilityLabel" }
];

const OBJECTIVES = [
  { id: "accuracy", icon: "🎯", titleKey: "objectiveAccuracyTitle", descKey: "objectiveAccuracyDesc" },
  { id: "speed", icon: "⚡", titleKey: "objectiveSpeedTitle", descKey: "objectiveSpeedDesc" },
  { id: "confidence", icon: "🏅", titleKey: "objectiveConfidenceTitle", descKey: "objectiveConfidenceDesc" },
  { id: "teamwork", icon: "🤝", titleKey: "objectiveTeamworkTitle", descKey: "objectiveTeamworkDesc" }
];

const HOW_STEPS = [
  { id: 1, icon: "⚙️", titleKey: "howStep1Title", descKey: "howStep1Desc" },
  { id: 2, icon: "▶️", titleKey: "howStep2Title", descKey: "howStep2Desc" },
  { id: 3, icon: "🏆", titleKey: "howStep3Title", descKey: "howStep3Desc" }
];

const KEY_FEATURES = [
  { id: "adaptive", icon: "🧠", titleKey: "featureAdaptiveTitle", descKey: "featureAdaptiveDesc" },
  { id: "tracking", icon: "📊", titleKey: "featureTrackingTitle", descKey: "featureTrackingDesc" },
  { id: "bilingual", icon: "🌐", titleKey: "featureBilingualTitle", descKey: "featureBilingualDesc" }
];

function parseDelimitedList(value){
  if(Array.isArray(value)) return value;
  if(typeof value === "string"){
    return value
      .split("|")
      .map(entry => entry.trim())
      .filter(Boolean);
  }
  return [];
}

export default function LandingPage(){
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const lang = state.language;
  const year = new Date().getFullYear();
  const defaultBlueName = state.teamNames?.blue || "Team Blue";
  const defaultRedName = state.teamNames?.red || "Team Red";
  const defaultMathOps = state.mathOps || MATH_OPERATIONS.map(op => op.id);
  const [theme, setTheme] = useState(() => {
    if(typeof window === "undefined") return "light";
    try {
      return localStorage.getItem("tug_theme") || "light";
    } catch {
      return "light";
    }
  });
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    blueName: defaultBlueName,
    redName: defaultRedName,
    subject: state.subject,
    difficulty: state.difficulty,
    mathOps: defaultMathOps
  });
  const [formErrorKey, setFormErrorKey] = useState("");
  const [countdown, setCountdown] = useState(null);
  const titleTarget = t(lang, "welcomeTitle");
  const footerEmails = parseDelimitedList(t(lang, "footerEmails"));
  const footerPhones = parseDelimitedList(t(lang, "footerPhones"));
  const footerDevelopers = parseDelimitedList(t(lang, "footerDevelopedByValue"));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("tug_theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    if(countdown === null) return;
    if(countdown === 0){
      const timeout = setTimeout(() => {
        setCountdown(null);
        navigate("/game");
      }, 500);
      return () => clearTimeout(timeout);
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev ?? 0) - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  function toggleTheme(){
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  }

  function setLanguage(next){
    try{ localStorage.setItem("tug_lang", next); }catch{}
    dispatch({ type: "SET_SETTINGS", payload: { language: next, subject: state.subject, difficulty: state.difficulty } });
  }

  function openStartModal(){
    setFormValues({
      blueName: state.teamNames?.blue || "Team Blue",
      redName: state.teamNames?.red || "Team Red",
      subject: state.subject,
      difficulty: state.difficulty,
      mathOps: state.mathOps || MATH_OPERATIONS.map(op => op.id)
    });
    setFormErrorKey("");
    setStartModalOpen(true);
  }

  function closeStartModal(){
    setStartModalOpen(false);
  }

  function handleInputChange(event){
    const { name, value } = event.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  }

  function handleSubjectSelect(id){
    const subjectEntry = SUBJECTS.find(s => s.id === id);
    if(!subjectEntry?.ready) return;
    setFormValues(prev => ({
      ...prev,
      subject: id,
      mathOps: id === "math" ? (prev.mathOps?.length ? prev.mathOps : defaultMathOps) : prev.mathOps
    }));
  }

  function handleDifficultySelect(id){
    setFormValues(prev => ({ ...prev, difficulty: id }));
  }

  function handleMathOpToggle(opId){
    setFormValues(prev => {
      const current = new Set(prev.mathOps || []);
      if(current.has(opId)){
        current.delete(opId);
      }else{
        current.add(opId);
      }
      return { ...prev, mathOps: Array.from(current) };
    });
  }

  function persistTeamNames(blue, red){
    try{
      localStorage.setItem("tug_team_blue", blue);
      localStorage.setItem("tug_team_red", red);
    }catch{}
    dispatch({ type: "SET_TEAM_NAMES", payload: { blue, red } });
  }

  function persistMathOps(ops){
    const clean = Array.isArray(ops) && ops.length ? ops : defaultMathOps;
    try{ localStorage.setItem("tug_math_ops", JSON.stringify(clean)); }catch{}
    dispatch({ type: "SET_MATH_OPS", payload: { ops: clean } });
  }

  function applySettings(subject, difficulty, mathOps){
    try{
      localStorage.setItem("tug_subject", subject);
      localStorage.setItem("tug_diff", difficulty);
    }catch{}
    dispatch({
      type: "SET_SETTINGS",
      payload: { language: state.language, subject, difficulty }
    });
    if(subject === "math" && Array.isArray(mathOps)){
      persistMathOps(mathOps);
    }
  }

  function handleSetupSubmit(event){
    event.preventDefault();
    setFormErrorKey("");

    const blueName = formValues.blueName.trim();
    const redName = formValues.redName.trim();

    if(!blueName || !redName){
      setFormErrorKey("errorTeamNames");
      return;
    }

    const subjectEntry = SUBJECTS.find(s => s.id === formValues.subject);
    if(!subjectEntry?.ready){
      setFormErrorKey("errorSubjectComing");
      return;
    }

    if(formValues.subject === "math" && (!formValues.mathOps || formValues.mathOps.length === 0)){
      setFormErrorKey("errorMathOps");
      return;
    }

    persistTeamNames(blueName, redName);
    if(formValues.subject !== "math"){
      persistMathOps(MATH_OPERATIONS.map(op => op.id));
    }else{
      persistMathOps(formValues.mathOps);
    }
    applySettings(formValues.subject, formValues.difficulty, formValues.mathOps);

    setStartModalOpen(false);
    setFormErrorKey("");
    setCountdown(3);
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarIntro}>
          <div className={styles.homeBtn} aria-label={t(lang, "home")}>
            <span className={styles.homeIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5.5v-5.1a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5V21H4a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className={styles.homeLabel}>{t(lang, "home")}</span>
          </div>

          <h1 className={styles.title}>{titleTarget}</h1>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.langPill} role="group" aria-label={t(lang, "language")}>
            {LANGS.map(l => (
              <button
                key={l.id}
                className={`${styles.langBtn} ${state.language === l.id ? styles.langBtnActive : ""}`}
                onClick={() => setLanguage(l.id)}
                aria-pressed={state.language === l.id}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`${styles.themeToggle} ${theme === "dark" ? styles.themeToggleDark : ""}`}
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label="Toggle dark mode"
          >
            <span aria-hidden="true" className={styles.themeIcon}>
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span className={styles.themeText}>{theme === "dark" ? t(lang, "themeDark") : t(lang, "themeLight")}</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.kicker}>{t(lang, "chooseMode")}</div>
            <div className={styles.heroTitle}>{t(lang, "readyCompetition")}</div>
            <div className={styles.heroSub}>{t(lang, "modeDesc")}</div>

            <div className={styles.heroChips}>
              {HERO_TAGS.map(tag => (
                <span key={tag.key} className={styles.heroChip}>
                  <span className={styles.heroChipIcon} aria-hidden="true">
                    {tag.icon}
                  </span>
                  <span>{t(lang, tag.key)}</span>
                </span>
              ))}
            </div>

            <div className={styles.ctaRow}>
              <button className={styles.primaryCta} onClick={openStartModal}>
                {t(lang, "start")}
              </button>

              <div className={styles.note}>{t(lang, "setupNote")}</div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.previewCard}>
              <div className={styles.previewBadgeRow}>
                <span className={`${styles.teamBadge} ${styles.teamBadgeBlue}`}>Team Blue</span>
                <span className={`${styles.teamBadge} ${styles.teamBadgeRed}`}>Team Red</span>
              </div>

              <div className={styles.previewMeter}>
                <div className={styles.meterBar}>
                  <div className={styles.meterBlue} />
                  <div className={styles.meterRed} />
                  <div className={styles.meterKnob}>
                    <span />
                  </div>
                </div>
                <div className={styles.meterAxis}>
                  <span />
                </div>
              </div>

              <div className={styles.previewScores}>
                <div className={styles.previewScoreCol}>
                  <div className={styles.previewScoreValue}>0</div>
                  <div className={styles.previewScoreLabel}>{t(lang, "correct")}</div>
                </div>
                <div className={styles.previewScoreCol}>
                  <div className={styles.previewScoreValue}>0</div>
                  <div className={styles.previewScoreLabel}>{t(lang, "correct")}</div>
                </div>
              </div>

              <p className={styles.previewNote}>{t(lang, "statusDefault")}</p>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>{t(lang, "featuresHeading")}</h2>
            <p className={styles.featuresSubtitle}>{t(lang, "featuresSubheading")}</p>
          </div>

          <div className={styles.featuresGrid}>
            {KEY_FEATURES.map(feature => (
              <article key={feature.id} className={styles.featureCard}>
                <div className={styles.featureGlyph} aria-hidden="true">{feature.icon}</div>
                <div>
                  <h3>{t(lang, feature.titleKey)}</h3>
                  <p>{t(lang, feature.descKey)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.objectivesSection}>
          <div className={styles.objectivesHeader}>
            <h2 className={styles.objectivesTitle}>{t(lang, "objectiveHeading")}</h2>
            <p className={styles.objectivesSubtitle}>{t(lang, "objectiveSubheading")}</p>
          </div>

          <div className={styles.objectivesGrid}>
            {OBJECTIVES.map(obj => (
              <article key={obj.id} className={styles.objectiveCard}>
                <div className={styles.objectiveIcon} aria-hidden="true">{obj.icon}</div>
                <h3>{t(lang, obj.titleKey)}</h3>
                <p>{t(lang, obj.descKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.howSection}>
          <div className={styles.howHeader}>
            <h2 className={styles.howTitle}>{t(lang, "howHeading")}</h2>
            <p className={styles.howSubtitle}>{t(lang, "howSubheading")}</p>
          </div>

          <div className={styles.howGrid}>
            {HOW_STEPS.map(step => (
              <article key={step.id} className={styles.howCard}>
                <div className={styles.howIcon} aria-hidden="true">{step.icon}</div>
                <div className={styles.howNumber}>{String(step.id).padStart(2, "0")}</div>
                <h3>{t(lang, step.titleKey)}</h3>
                <p>{t(lang, step.descKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerShell}>
            <div className={styles.footerMain}>
              <div className={styles.footerIntro}>
                <div>
                  <h3 className={styles.footerTitle}>{t(lang, "footerTitle")}</h3>
                  <a className={styles.footerSubtitle} href="#" rel="noreferrer">
                    {t(lang, "footerSubtitle")}
                  </a>

                  <dl className={styles.footerMeta}>
                    <div>
                      <dt>{t(lang, "footerDevelopedByLabel")}</dt>
                      <dd>
                        {footerDevelopers.length ? (
                          <ul className={styles.footerDevList}>
                            {footerDevelopers.map(name => (
                              <li key={name}>{name}</li>
                            ))}
                          </ul>
                        ) : (
                          t(lang, "footerDevelopedByValue")
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className={styles.footerInfoGrid}>
                <div className={styles.footerSection}>
                  <h4>{t(lang, "footerCourseLabel")}</h4>
                  <span className={styles.footerDetailValue}>{t(lang, "footerCourseValue")}</span>
                </div>

                <div className={styles.footerSection}>
                  <h4>{t(lang, "footerInstitutionLabel")}</h4>
                  <span className={styles.footerDetailValue}>{t(lang, "footerInstitutionValue")}</span>
                </div>

                <div className={styles.footerSection}>
                  <h4>{t(lang, "footerContactTitle")}</h4>
                  <div className={styles.footerContactList}>
                    {footerEmails.map(email => (
                      <a key={email} className={styles.footerContactLink} href={`mailto:${email}`}>
                        <span className={styles.contactIcon} aria-hidden="true">
                          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                            <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 0 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span>{email}</span>
                      </a>
                    ))}
                    {footerPhones.map(phone => {
                      const href = phone.replace(/[^+\d]/g, "");
                      return (
                        <a key={phone} className={styles.footerContactLink} href={`tel:${href}`}>
                          <span className={styles.contactIcon} aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                              <path d="M6.6 3h2.7c.4 0 .8.3.9.7l.6 3.1c.1.3 0 .6-.2.9l-1.7 1.7a12.2 12.2 0 0 0 5.4 5.4l1.7-1.7c.2-.2.6-.3.9-.2l3.1.6c.4.1.7.5.7.9v2.7c0 .5-.4.9-.9.9A15.9 15.9 0 0 1 5.7 4c0-.5.4-.9.9-.9Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span>{phone}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.footerSection}>
                  <h4>{t(lang, "footerResourcesTitle")}</h4>
                  <div className={styles.resourceLinks}>
                    {["footerResourcePrivacy", "footerResourceTerms", "footerResourceAccessibility"].map(key => (
                      <a key={key} href="#" className={styles.resourceLink}>
                        {t(lang, key)}
                        <svg viewBox="0 0 16 16" role="img" aria-hidden="true">
                          <path d="M6 3h7v7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.footerDivider} />
            <div className={styles.footerBottom}>
              <span>© {year} {t(lang, "footerBottomNote")}</span>
            </div>
          </div>
        </footer>
      </main>

      {startModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Setup match">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{t(lang, "prepareArena")}</h2>
              <button className={styles.modalClose} onClick={closeStartModal} aria-label="Close setup">
                ✕
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSetupSubmit}>
              <div className={styles.modalGrid}>
                <label className={styles.modalField}>
                  <span>{t(lang, "blueTeamLabel")}</span>
                  <input
                    type="text"
                    name="blueName"
                    value={formValues.blueName}
                    onChange={handleInputChange}
                    placeholder={t(lang, "defaultBlueName")}
                    autoFocus
                  />
                </label>

                <label className={styles.modalField}>
                  <span>{t(lang, "redTeamLabel")}</span>
                  <input
                    type="text"
                    name="redName"
                    value={formValues.redName}
                    onChange={handleInputChange}
                    placeholder={t(lang, "defaultRedName")}
                  />
                </label>
              </div>

              <div className={styles.modalSectionLabel}>{t(lang, "subject")}</div>
              <div className={styles.modalSubjects}>
                {SUBJECTS.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`${styles.subjectCard} ${formValues.subject === s.id ? styles.subjectCardActive : ""} ${!s.ready ? styles.subjectCardDisabled : ""}`}
                    onClick={() => handleSubjectSelect(s.id)}
                    disabled={!s.ready}
                    aria-disabled={!s.ready}
                  >
                    <div className={styles.subjectTitle}>{t(lang, s.key)}</div>
                  </button>
                ))}
              </div>

              {formValues.subject === "math" && (
                <div className={styles.modalOpsBlock}>
                  <div className={styles.modalSectionLabel}>{t(lang, "mathOpsLabel")}</div>
                  <p className={styles.modalOpsHint}>{t(lang, "mathOpsHint")}</p>
                  <div className={styles.modalOpsGrid} role="group" aria-label={t(lang, "mathOpsLabel")}>
                    {MATH_OPERATIONS.map(op => {
                      const active = formValues.mathOps?.includes(op.id);
                      return (
                        <button
                          key={op.id}
                          type="button"
                          className={`${styles.opChip} ${active ? styles.opChipActive : ""}`}
                          onClick={() => handleMathOpToggle(op.id)}
                          aria-pressed={active}
                        >
                          <span className={styles.opSymbol}>{op.id}</span>
                          <span>{t(lang, op.key)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className={styles.modalSectionLabel}>{t(lang, "difficulty")}</div>
              <div className={styles.modalSegmented} role="group" aria-label={t(lang, "difficulty")}>
                {DIFFS.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    className={`${styles.segBtn} ${formValues.difficulty === d.id ? styles.segBtnActive : ""}`}
                    onClick={() => handleDifficultySelect(d.id)}
                    aria-pressed={formValues.difficulty === d.id}
                  >
                    {t(lang, d.key)}
                  </button>
                ))}
              </div>

              {formErrorKey ? <div className={styles.modalError}>{t(lang, formErrorKey)}</div> : null}

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalSecondary} onClick={closeStartModal}>
                  {t(lang, "modalCancel")}
                </button>
                <button type="submit" className={styles.modalPrimary}>
                  {t(lang, "modalLaunch")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {countdown !== null && (
        <div className={styles.countdownOverlay} aria-live="assertive">
          <div className={styles.countdownCard}>
            <div className={styles.countdownNumber}>{countdown === 0 ? t(lang, "countdownGo") : countdown}</div>
            <div className={styles.countdownHint}>{t(lang, "countdownHint")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
