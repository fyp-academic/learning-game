import React from "react";
import styles from "./Arena.module.css";

export default function Arena({
  arenaRef,
  trackRef,
  videoRef,
  blueScore,
  redScore,
  timerText,
  status
}){
  return (
    <section className={styles.arenaWrap}>
      <div className={styles.arenaTop}>
        <div className={styles.miniScore}>
          <div className={styles.miniLabel}>Blue</div>
          <div className={styles.miniValue}>{blueScore}</div>
        </div>

        <div className={styles.timer} aria-label="Timer">
          ⏱ <span>{timerText}</span>
        </div>

        <div className={`${styles.miniScore} ${styles.right}`}>
          <div className={styles.miniLabel}>Red</div>
          <div className={styles.miniValue}>{redScore}</div>
        </div>
      </div>

      <div className={styles.arena} ref={arenaRef} aria-label="Arena">
        <div className={styles.centerLine} aria-hidden="true"></div>

        <div className={styles.videoTrack} ref={trackRef}>
          <video
            ref={videoRef}
            className={styles.video}
            src="/assets/video/tug-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>
      </div>

      <div className={styles.hint} aria-live="polite">{status}</div>
    </section>
  );
}
