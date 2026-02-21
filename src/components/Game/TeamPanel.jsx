import React, { useId } from "react";
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
  const hintId = useId();
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

      <div className={styles.panelBody}>
        <div className={styles.questionShell}>
          <p className={styles.question} aria-live="polite">
            {questionText}
          </p>
        </div>

        {isMcq ? (
          <>
            {choiceHint ? (
              <div className={styles.mcqHelp} id={hintId}>
                <span className={styles.mcqIcon} aria-hidden="true">ⓘ</span>
                <span>{choiceHint}</span>
              </div>
            ) : null}

            <div
              className={styles.mcqGrid}
              role="group"
              aria-labelledby={choiceHint ? hintId : undefined}
            >
              {options.map((option, idx) => (
                <button
                  key={`${problem.id}_${idx}`}
                  type="button"
                  className={styles.mcqOption}
                  onClick={() => handleOptionClick(idx)}
                  disabled={disabled || locked}
                  aria-label={`Option ${idx + 1}: ${option}`}
                >
                  <span className={styles.optionIndex}>{idx + 1}</span>
                  <span className={styles.optionText}>{option}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.answerRegion}>
            <div className={styles.answerDisplay}>
              <label className={styles.answerLabel} htmlFor={`${team}-answer`}>
                {title} answer
              </label>
              <input
                id={`${team}-answer`}
                className={styles.answerBox}
                value={input}
                readOnly
                aria-label={`${title} answer input`}
              />
            </div>

            <Keypad
              team={team}
              disabled={disabled}
              locked={locked}
              onDigit={onDigit}
              onClear={onClear}
              onSubmit={onSubmit}
            />
          </div>
        )}
      </div>

      {locked ? <div className={styles.lockHint} aria-live="polite">…</div> : null}
    </section>
  );
}
