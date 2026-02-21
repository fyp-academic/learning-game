import React, { useId, useState } from "react";
import styles from "./Arena.module.css";

export default function Arena({
  arenaRef,
  trackRef,
  videoRef,
  blueScore,
  redScore,
  blueLabel = "Blue",
  redLabel = "Red",
  timerText,
  status,
  tone = "neutral"
}){
  const statusId = useId();
  const [isPaused, setIsPaused] = useState(false);
  const statusClass =
    tone === "correct" ? styles.hintCorrect
    : tone === "wrong" ? styles.hintWrong
    : "";

  function toggleVideo(){
    const video = videoRef?.current;
    if(!video) return;

    try{
      if(isPaused){
        video.play?.();
      }else{
        video.pause?.();
      }
      setIsPaused(!isPaused);
    }catch{}
  }

  return (
    <section className={styles.arenaWrap} role="region" aria-labelledby={statusId}>
      <div className={styles.arenaTop}>
        <div className={styles.miniScore} aria-label={`${blueLabel} score`}>
          <div className={styles.miniLabel}>{blueLabel}</div>
          <div className={styles.miniValue}>{blueScore}</div>
        </div>

        <div className={styles.timer} aria-label="Timer">
          ⏱ <span>{timerText}</span>
        </div>

        <div className={`${styles.miniScore} ${styles.right}`} aria-label={`${redLabel} score`}>
          <div className={styles.miniLabel}>{redLabel}</div>
          <div className={styles.miniValue}>{redScore}</div>
        </div>
      </div>

      <div
        className={styles.arena}
        ref={arenaRef}
        tabIndex={0}
        aria-label="Arena animation"
        aria-describedby={statusId}
      >
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
            aria-hidden="true"
            title="Tug of war animation"
          />
        </div>
      </div>

      <div className={styles.arenaControls}>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={toggleVideo}
          aria-pressed={!isPaused}
        >
          {isPaused ? "Resume animation" : "Pause animation"}
        </button>
        <span className={styles.accessibilityHint}>Tap answers to pull the rope closer to your team.</span>
      </div>

      <div className={`${styles.hint} ${statusClass}`.trim()} id={statusId} aria-live="polite">{status}</div>
    </section>
  );
}
