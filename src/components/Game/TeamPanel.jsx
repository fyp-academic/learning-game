import React from "react";
import styles from "./TeamPanel.module.css";
import Keypad from "./Keypad.jsx";

export default function TeamPanel({
  team,
  title,
  score,
  problem,
  input,
  disabled,
  locked,
  choiceHint,
  onDigit,
  onClear,
  onSubmit,
  onOptionSelect
}){
  const isMcq = problem?.type === "mcq";
  const questionText = problem?.text ?? "";
  const options = Array.isArray(problem?.options) ? problem.options : [];

  function handleOptionClick(index){
    if(disabled || locked || !onOptionSelect) return;
    onOptionSelect(index + 1);
  }

  return (
    <section className={`${styles.panel} ${team === "blue" ? styles.blue : styles.red}`}>
      <div className={styles.panelHeader}>
        <div className={styles.teamName}>{title}</div>
        <div className={styles.scorePill} aria-label={`${title} score`}>{score}</div>
      </div>

      <div className={styles.question} aria-live="polite">{questionText}</div>

      {isMcq ? (
        <>
          {choiceHint ? <div className={styles.mcqHelp}>{choiceHint}</div> : null}
          <div className={styles.mcqGrid}>
            {options.map((option, idx) => (
              <button
                key={`${problem.id}_${idx}`}
                type="button"
                className={styles.mcqOption}
                onClick={() => handleOptionClick(idx)}
                disabled={disabled || locked}
              >
                <span className={styles.optionIndex}>{idx + 1}.</span>
                <span className={styles.optionText}>{option}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <input
            className={styles.answerBox}
            value={input}
            readOnly
            aria-label={`${title} answer input`}
          />

          <Keypad
            team={team}
            disabled={disabled}
            locked={locked}
            onDigit={onDigit}
            onClear={onClear}
            onSubmit={onSubmit}
          />
        </>
      )}

      {locked ? <div className={styles.lockHint} aria-live="polite">…</div> : null}
    </section>
  );
}
