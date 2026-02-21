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

const HERO_TAGS = [
  { key: "heroChipLiveFeedback" },
  { key: "heroChipClassroom" },
  { key: "heroChipMobile" }
];

const METRICS = [
  { id: "rounds", valueKey: "metricRoundsValue", labelKey: "metricRoundsLabel" },
  { id: "engagement", valueKey: "metricEngagementValue", labelKey: "metricEngagementLabel" },
  { id: "availability", valueKey: "metricAvailabilityValue", labelKey: "metricAvailabilityLabel" }
];

const HIGHLIGHTS = [
  { id: "adaptive", icon: "⚡", titleKey: "highlightAdaptiveTitle", copyKey: "highlightAdaptiveCopy" },
  { id: "coach", icon: "🎯", titleKey: "highlightCoachTitle", copyKey: "highlightCoachCopy" },
  { id: "bilingual", icon: "🌍", titleKey: "highlightBilingualTitle", copyKey: "highlightBilingualCopy" }
];

const FOOTER_LINKS = [
  {
    titleKey: "footerProduct",
    items: [
      { key: "footerLinkLiveArenas" },
      { key: "footerLinkSkillAnalytics" },
      { key: "footerLinkCoachDashboard" },
      { key: "footerLinkOfflineMode" }
    ]
  },
  {
    titleKey: "footerResources",
    items: [
      { key: "footerLinkCurriculumKits" },
      { key: "footerLinkImplementation" },
      { key: "footerLinkWebinars" },
      { key: "footerLinkChangelog" }
    ]
  },
  {
    titleKey: "footerCompany",
    items: [
      { key: "footerLinkAbout" },
      { key: "footerLinkPartners" },
      { key: "footerLinkCareers" },
      { key: "footerLinkSupport" }
    ]
  }
];

const SOCIALS = [
  {
    id: "youtube",
    label: "YouTube",
    url: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path
          d="M22 8.2c-.2-1.5-1.2-2.5-2.7-2.7C17.1 5 12 5 12 5s-5.1 0-7.3.5C3.2 5.7 2.2 6.7 2 8.2 1.5 10.4 1.5 12 1.5 12s0 1.6.5 3.8c.2 1.5 1.2 2.5 2.7 2.7C6.9 19 12 19 12 19s5.1 0 7.3-.5c1.5-.2 2.5-1.2 2.7-2.7.5-2.2.5-3.8.5-3.8s0-1.6-.5-3.8Z"
          fill="currentColor"
        />
        <path d="M10 15.1V8.9l5 3.1-5 3.1Z" fill="#fff" />
      </svg>
    )
  },
  {
    id: "tiktok",
    label: "TikTok",
    url: "https://tiktok.com",
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path
          d="M9.5 7.4v10.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3 1-2.3 2.3-2.3c.4 0 .8.1 1.1.2V11c-3.1-.2-5.7 2.4-5.7 5.7S4.2 22.4 7.5 22.4s5.7-2.6 5.7-5.7V4.5h3.3c.5 2.4 2.4 4.3 4.8 4.8v3.3c-1.8-.1-3.6-.7-5.1-1.7v6.4c0 3.3-2.6 5.9-5.9 5.9s-5.9-2.6-5.9-5.9"
          fill="#fff"
        />
        <path
          d="M21.3 9.3c-2.4-.5-4.3-2.4-4.8-4.8h-3.3v10.1c0 3.3-2.6 5.9-5.9 5.9-1.3 0-2.6-.4-3.6-1.2a5.87 5.87 0 0 0 5.2 3.1c3.3 0 5.9-2.6 5.9-5.9v-6.4c1.5 1 3.3 1.6 5.1 1.7V9.3Z"
          fill="#25f4ee"
        />
        <path
          d="M9.5 17.6c0 1.3-1 2.3-2.3 2.3-.9 0-1.8-.5-2.1-1.3.4 1.4 1.7 2.3 3.2 2.3 1.3 0 2.3-1 2.3-2.3V4.5h-1.1v13.1Z"
          fill="#fe2c55"
        />
      </svg>
    )
  },
  {
    id: "telegram",
    label: "Telegram",
    url: "https://t.me",
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path
          d="M21.8 4.3 2.8 11.4c-.9.3-.9 1.6 0 1.9l4.9 1.7 2 6c.2.7 1.1.9 1.6.4l2.8-2.7 4.8 3.5c.6.4 1.4.1 1.6-.6l3.6-16c.2-.9-.7-1.6-1.3-1.3Z"
          fill="currentColor"
        />
        <path
          d="m9.3 15.1-.3 4.5 1.7-1.6 6.5-6.3-5.1 4.1-2.8-.7Z"
          fill="#fff"
          opacity=".85"
        />
      </svg>
    )
  },
  {
    id: "x",
    label: "X",
    url: "https://twitter.com",
    icon: (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path
          d="M17.5 2h3.2l-7 8.1 8.2 11.9h-6.4l-4.2-5.9-4.8 5.9H3.3l7.4-8.9L2.9 2h6.6l3.8 5.2L17.5 2Z"
          fill="currentColor"
        />
      </svg>
    )
  }
];

export default function LandingPage(){
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const lang = state.language;
  const year = new Date().getFullYear();
  const defaultBlueName = state.teamNames?.blue || "Team Blue";
  const defaultRedName = state.teamNames?.red || "Team Red";
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
    difficulty: state.difficulty
  });
  const [formErrorKey, setFormErrorKey] = useState("");
  const [countdown, setCountdown] = useState(null);
  const titleTarget = t(lang, "welcomeTitle");

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
      difficulty: state.difficulty
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
    setFormValues(prev => ({ ...prev, subject: id }));
  }

  function handleDifficultySelect(id){
    setFormValues(prev => ({ ...prev, difficulty: id }));
  }

  function persistTeamNames(blue, red){
    try{
      localStorage.setItem("tug_team_blue", blue);
      localStorage.setItem("tug_team_red", red);
    }catch{}
    dispatch({ type: "SET_TEAM_NAMES", payload: { blue, red } });
  }

  function applySettings(subject, difficulty){
    try{
      localStorage.setItem("tug_subject", subject);
      localStorage.setItem("tug_diff", difficulty);
    }catch{}
    dispatch({
      type: "SET_SETTINGS",
      payload: { language: state.language, subject, difficulty }
    });
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

    persistTeamNames(blueName, redName);
    applySettings(formValues.subject, formValues.difficulty);

    setStartModalOpen(false);
    setFormErrorKey("");
    setCountdown(3);
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarIntro}>
          <div className={styles.homeBtn} aria-label={t(lang, "home")}>
            <span aria-hidden="true">🏠</span><b>{t(lang, "home")}</b>
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
            <div className={styles.heroBadge}>
              <span>{t(lang, "heroBadgePrimary")}</span>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span>{t(lang, "heroBadgeSecondary")}</span>
            </div>
            <div className={styles.kicker}>{t(lang, "chooseMode")}</div>
            <div className={styles.heroTitle}>{t(lang, "readyCompetition")}</div>
            <div className={styles.heroSub}>{t(lang, "modeDesc")}</div>

            <div className={styles.heroChips}>
              {HERO_TAGS.map(tag => (
                <span key={tag.key} className={styles.heroChip}>
                  {t(lang, tag.key)}
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
        </section>

        <section className={styles.metricsStrip}>
          {METRICS.map(metric => (
            <article key={metric.id} className={styles.metricCard}>
              <div className={styles.metricValue}>{t(lang, metric.valueKey)}</div>
              <div className={styles.metricLabel}>{t(lang, metric.labelKey)}</div>
            </article>
          ))}
        </section>

        <section className={styles.featureGrid}>
          {HIGHLIGHTS.map(feature => (
            <article key={feature.id} className={styles.featureCard}>
              <div className={styles.featureIcon} aria-hidden="true">
                {feature.icon}
              </div>
              <div>
                <h3 className={styles.featureTitle}>{t(lang, feature.titleKey)}</h3>
                <p className={styles.featureCopy}>{t(lang, feature.copyKey)}</p>
              </div>
            </article>
          ))}
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerShell}>
            <div className={styles.footerBrand}>
              <div className={styles.footerBadge}>TUG</div>
              <p className={styles.footerSummary}>
                {t(lang, "footerSummary")}
              </p>
              <div className={styles.footerContact}>
                <a href="mailto:hamiskalira7@gmail.com">hamiskalira7@gmail.com</a>
                <span>+255 686 300 235</span>
              </div>
            </div>

            <div className={styles.footerLinks}>
              {FOOTER_LINKS.map(section => (
                <div key={section.titleKey} className={styles.footerColumn}>
                  <div className={styles.footerHeading}>{t(lang, section.titleKey)}</div>
                  <ul className={styles.footerList}>
                    {section.items.map(item => (
                      <li key={item.key}>
                        <a href="#" className={styles.footerLink}>
                          {t(lang, item.key)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className={styles.footerAside}>
              <div className={styles.footerTag}>{t(lang, "footerTagline")}</div>
              <button className={styles.footerCta}>{t(lang, "footerCta")}</button>
              <div className={styles.footerSocials}>
                {SOCIALS.map(social => (
                  <a
                    key={social.id}
                    href={social.url}
                    className={styles.socialBtn}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className={styles.srOnly}>{social.label}</span>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>© {year} Tug Learning Arena. {t(lang, "footerRights")}</span>
            <div className={styles.footerPolicies}>
              <a href="#">{t(lang, "footerPrivacy")}</a>
              <span aria-hidden="true">•</span>
              <a href="#">{t(lang, "footerTerms")}</a>
              <span aria-hidden="true">•</span>
              <a href="#">{t(lang, "footerAccessibility")}</a>
            </div>
          </div>
        </footer>
      </main>

      {startModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Setup match">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalKicker}>{t(lang, "prepareArena")}</p>
                <h2 className={styles.modalTitle}>{t(lang, "modalTitle")}</h2>
              </div>
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
                    <div className={styles.subjectHead}>
                      <div>
                        <div className={styles.subjectTitle}>{t(lang, s.key)}</div>
                        {s.descKey ? <p className={styles.subjectDesc}>{t(lang, s.descKey)}</p> : null}
                      </div>
                      {!s.ready ? (
                        <div className={styles.badgeSoon}>{t(lang, "comingSoon")}</div>
                      ) : (
                        <div className={styles.badgeReady}>{t(lang, "ready")}</div>
                      )}
                    </div>

                    <div className={styles.subjectMetaRow}>
                      {s.questionCount ? (
                        <span className={styles.subjectMeta}>
                          {s.questionCount} {t(lang, "subjectQuestionSuffix")}
                        </span>
                      ) : s.metaKey ? (
                        <span className={styles.subjectMeta}>{t(lang, s.metaKey)}</span>
                      ) : null}

                      <div className={styles.subjectTags}>
                        {(s.tags || []).map(tagKey => (
                          <span key={tagKey} className={styles.subjectTag}>{t(lang, tagKey)}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

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
