import React, { useEffect } from "react";
import styles from "./WinModal.module.css";
import { t } from "../../utils/i18n.js";

export default function WinModal({
  open,
  winner,
  blueScore,
  redScore,
  difficulty,
  lang,
  onPlayAgain,
  onBackHome
}){
  useEffect(() => {
    function onEsc(e){
      if(e.key === "Escape" && open) onBackHome?.();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onBackHome]);

  if(!open) return null;

  const winnerText =
    winner === "BLUE" ? "BLUE"
    : winner === "RED" ? "RED"
    : t(lang, "draw");

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Win modal">
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.badge}>{t(lang, "winner")}</div>
          <div className={styles.winner}>{winnerText}</div>
          <div className={styles.sub}>Difficulty: {difficulty.toUpperCase()}</div>
        </div>

        <div className={styles.scores}>
          <div className={styles.scoreBox}>
            <div className={styles.team}>Blue</div>
            <div className={styles.score}>{blueScore}</div>
          </div>
          <div className={styles.vs}>VS</div>
          <div className={styles.scoreBox}>
            <div className={styles.team}>Red</div>
            <div className={styles.score}>{redScore}</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={onPlayAgain}>
            {t(lang, "playAgain")}
          </button>
          <button className={styles.secondary} onClick={onBackHome}>
            {t(lang, "backHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
