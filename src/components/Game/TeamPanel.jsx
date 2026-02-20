import React from "react";
import styles from "./TeamPanel.module.css";
import Keypad from "./Keypad.jsx";

export default function TeamPanel({
  team,
  title,
  score,
  question,
  input,
  disabled,
  locked,
  onDigit,
  onClear,
  onSubmit
}){
  return (
    <section className={`${styles.panel} ${team === "blue" ? styles.blue : styles.red}`}>
      <div className={styles.panelHeader}>
        <div className={styles.teamName}>{title}</div>
        <div className={styles.scorePill} aria-label={`${title} score`}>{score}</div>
      </div>

      <div className={styles.question} aria-live="polite">{question}</div>

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

      {locked ? <div className={styles.lockHint} aria-live="polite">…</div> : null}
    </section>
  );
}
