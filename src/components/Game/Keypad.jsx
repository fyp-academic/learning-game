import React from "react";
import styles from "./Keypad.module.css";

const DIGITS = ["1","2","3","4","5","6","7","8","9","0"];

export default function Keypad({ team, disabled, locked, onDigit, onClear, onSubmit }){
  const isBlue = team === "blue";
  const subLabel = isBlue ? "Blue submit" : "Red submit";

  function handleKey(e){
    // keyboard support: numbers, enter, backspace
    if(disabled || locked) return;
    const k = e.key;
    if(k >= "0" && k <= "9") onDigit(k);
    if(k === "Enter") onSubmit();
    if(k === "Backspace" || k === "Delete") onClear();
  }

  return (
    <div
      className={styles.keypad}
      role="group"
      aria-label={`${team} keypad`}
      tabIndex={0}
      onKeyDown={handleKey}
    >
      {DIGITS.slice(0,9).map(d => (
        <button
          key={d}
          type="button"
          className={styles.btn}
          onClick={() => (!disabled && !locked) && onDigit(d)}
          disabled={disabled}
          aria-label={`Digit ${d}`}
        >
          {d}
        </button>
      ))}

      <button
        type="button"
        className={`${styles.btn} ${styles.danger}`}
        onClick={() => (!disabled && !locked) && onClear()}
        disabled={disabled}
        aria-label="Clear"
      >
        ✕
      </button>

      <button
        type="button"
        className={styles.btn}
        onClick={() => (!disabled && !locked) && onDigit("0")}
        disabled={disabled}
        aria-label="Digit 0"
      >
        0
      </button>

      <button
        type="button"
        className={`${styles.btn} ${isBlue ? styles.okBlue : styles.okRed}`}
        onClick={() => (!disabled && !locked) && onSubmit()}
        disabled={disabled}
        aria-label={subLabel}
      >
        ✓
      </button>
    </div>
  );
}
