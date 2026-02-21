import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";
import { useGame } from "../../context/GameContext.jsx";
import { t } from "../../utils/i18n.js";

const SUBJECTS = [
  { id: "math", key: "mathematics", ready: true },
  { id: "science", key: "science", ready: false }
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
  { id: "ln", label: "in", url: "https://linkedin.com" },
  { id: "yt", label: "+", url: "https://youtube.com" },
  { id: "tw", label: "x", url: "https://twitter.com" }
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
  const heroTitleTarget = t(lang, "readyCompetition");
  const [typedHero, setTypedHero] = useState("");
  const [isHeroDeleting, setIsHeroDeleting] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("tug_theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    setTypedHero("");
    setIsHeroDeleting(false);
  }, [heroTitleTarget]);

  useEffect(() => {
    let timeout;

    if(!isHeroDeleting && typedHero === heroTitleTarget){
      timeout = setTimeout(() => setIsHeroDeleting(true), 1400);
    } else if(isHeroDeleting && typedHero === ""){
      timeout = setTimeout(() => setIsHeroDeleting(false), 500);
    } else {
      timeout = setTimeout(() => {
        setTypedHero(prev => {
          if(isHeroDeleting){
            const nextLength = Math.max(prev.length - 1, 0);
            return heroTitleTarget.slice(0, nextLength);
          }
          const nextLength = Math.min(prev.length + 1, heroTitleTarget.length);
          return heroTitleTarget.slice(0, nextLength);
        });
      }, isHeroDeleting ? 45 : 85);
    }

    return () => clearTimeout(timeout);
  }, [heroTitleTarget, isHeroDeleting, typedHero]);

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
            <div className={styles.heroTitle} aria-label={heroTitleTarget}>
              <span className={styles.heroTyping}>{typedHero || heroTitleTarget}</span>
              <span className={styles.heroCursor} aria-hidden="true" />
            </div>
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
                    aria-label={social.id}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {social.label}
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
                    <div className={styles.subjectTitle}>{t(lang, s.key)}</div>
                    {!s.ready ? (
                      <div className={styles.badgeSoon}>{t(lang, "comingSoon")}</div>
                    ) : (
                      <div className={styles.badgeReady}>{t(lang, "ready")}</div>
                    )}
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
