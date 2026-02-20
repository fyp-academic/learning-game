import React, { useMemo } from "react";
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

export default function LandingPage(){
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const lang = state.language;

  const subjectMeta = useMemo(
    () => SUBJECTS.find(s => s.id === state.subject),
    [state.subject]
  );

  function setLanguage(next){
    try{ localStorage.setItem("tug_lang", next); }catch{}
    dispatch({ type: "SET_SETTINGS", payload: { language: next, subject: state.subject, difficulty: state.difficulty } });
  }

  function setSubject(next){
    try{ localStorage.setItem("tug_subject", next); }catch{}
    dispatch({ type: "SET_SETTINGS", payload: { language: state.language, subject: next, difficulty: state.difficulty } });
  }

  function setDifficulty(next){
    try{ localStorage.setItem("tug_diff", next); }catch{}
    dispatch({ type: "SET_SETTINGS", payload: { language: state.language, subject: state.subject, difficulty: next } });
  }

  function start(){
    if(!subjectMeta?.ready) return;
    navigate("/game");
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.homeBtn} aria-label={t(lang, "home")}>
          <span aria-hidden="true">🏠</span><b>{t(lang, "home")}</b>
        </div>

        <h1 className={styles.title}>{t(lang, "titleLanding")}</h1>

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
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.kicker}>{t(lang, "chooseMode")}</div>
            <div className={styles.heroTitle}>{t(lang, "readyCompetition")}</div>
            <div className={styles.heroSub}>{t(lang, "modeDesc")}</div>

            <div className={styles.block}>
              <div className={styles.label}>{t(lang, "subject")}</div>
              <div className={styles.cards}>
                {SUBJECTS.map(s => (
                  <button
                    key={s.id}
                    className={`${styles.subjectCard} ${state.subject === s.id ? styles.subjectCardActive : ""} ${!s.ready ? styles.subjectCardDisabled : ""}`}
                    onClick={() => setSubject(s.id)}
                    disabled={!s.ready}
                    aria-disabled={!s.ready}
                  >
                    <div className={styles.subjectTitle}>{t(lang, s.key)}</div>
                    {!s.ready ? <div className={styles.badgeSoon}>{t(lang, "comingSoon")}</div> : <div className={styles.badgeReady}>Ready</div>}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.block}>
                <div className={styles.label}>{t(lang, "difficulty")}</div>
                <div className={styles.segmented} role="group" aria-label={t(lang, "difficulty")}>
                  {DIFFS.map(d => (
                    <button
                      key={d.id}
                      className={`${styles.segBtn} ${state.difficulty === d.id ? styles.segBtnActive : ""}`}
                      onClick={() => setDifficulty(d.id)}
                      aria-pressed={state.difficulty === d.id}
                    >
                      {t(lang, d.key)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>{t(lang, "language")}</div>
                <div className={styles.segmented} role="group" aria-label={t(lang, "language")}>
                  {LANGS.map(l => (
                    <button
                      key={l.id}
                      className={`${styles.segBtn} ${state.language === l.id ? styles.segBtnActive : ""}`}
                      onClick={() => setLanguage(l.id)}
                      aria-pressed={state.language === l.id}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.ctaRow}>
              <button
                className={styles.primaryCta}
                onClick={start}
                disabled={!subjectMeta?.ready}
              >
                {t(lang, "start")}
              </button>

              <div className={styles.note}>
                {!subjectMeta?.ready ? t(lang, "scienceNote") : t(lang, "tip")}
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.previewCard}>
              <div className={styles.previewTitle}>Preview</div>
              <div className={styles.previewMock}>
                <div className={`${styles.miniPanel} ${styles.miniBlue}`}>Blue</div>
                <div className={styles.miniArena}>Video Arena</div>
                <div className={`${styles.miniPanel} ${styles.miniRed}`}>Red</div>
              </div>
              <div className={styles.previewHint}>
                {t(lang, "bothCorrect")}
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerCard}>
            <div><b>Professional UI</b> • Responsive layout • Smooth transitions</div>
            <div className={styles.muted}>React + Vite</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
