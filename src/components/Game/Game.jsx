import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Game.module.css";
import TeamPanel from "./TeamPanel.jsx";
import Arena from "./Arena.jsx";
import WinModal from "../Modal/WinModal.jsx";
import { useGame } from "../../context/GameContext.jsx";
import { useGameLogic } from "../../hooks/useGameLogic.js";
import { usePullAnimation } from "../../hooks/usePullAnimation.js";
import { t } from "../../utils/i18n.js";
import competitionVideo from "../../assets/videos/competition.mp4";
import blueWinVideo from "../../assets/videos/blue-win.mp4";
import redWinVideo from "../../assets/videos/red-win.mp4";

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1;
const ZOOM_STEP = 0.1;

export default function Game(){
  const navigate = useNavigate();
  const { state } = useGame();
  const lang = state.language;
  const teamBlueName = state.teamNames?.blue || "Blue";
  const teamRedName = state.teamNames?.red || "Red";

  const game = useGameLogic();
  const bgmRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const [zoom, setZoom] = useState(1);

  const clampZoom = (value) => {
    const rounded = Math.round(value * 100) / 100;
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, rounded));
  };

  const adjustZoom = (delta) => {
    setZoom(prev => clampZoom(prev + delta));
  };

  const resetZoom = () => setZoom(1);

  const zoomPercent = Math.round(zoom * 100);
  const canZoomOut = zoom > MIN_ZOOM + 0.001;
  const canZoomIn = zoom < MAX_ZOOM - 0.001;

  const arenaVideoSrc = useMemo(() => {
    if(state.gameStatus === "gameOver"){
      if(state.winner === "BLUE") return blueWinVideo;
      if(state.winner === "RED") return redWinVideo;
    }
    return competitionVideo;
  }, [state.gameStatus, state.winner]);

  useEffect(() => {
    // When entering /game from landing page, start immediately.
    // If user reloads and is idle, start too.
    if(state.gameStatus !== "playing"){
      game.startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePullAnimation({
    arenaRef: game.arenaRef,
    trackRef: game.trackRef,
    pullPosition: state.pullPosition
  });

  useEffect(() => {
    const audio = bgmRef.current;
    if(!audio) return;

    audio.volume = 0.35;
    audio.loop = true;

    function tryUnlock(){
      audio.play()
        .then(() => {
          audioUnlockedRef.current = true;
          window.removeEventListener("pointerdown", tryUnlock);
          window.removeEventListener("keydown", tryUnlock);
        })
        .catch(() => {});
    }

    if(!audioUnlockedRef.current){
      window.addEventListener("pointerdown", tryUnlock);
      window.addEventListener("keydown", tryUnlock);
    }

    return () => {
      window.removeEventListener("pointerdown", tryUnlock);
      window.removeEventListener("keydown", tryUnlock);
    };
  }, []);

  useEffect(() => {
    const audio = bgmRef.current;
    if(!audio) return;

    if(state.gameStatus === "playing"){
      audio.play().then(() => {
        audioUnlockedRef.current = true;
      }).catch(() => {});
    }else{
      audio.pause();
      audio.currentTime = 0;
    }
  }, [state.gameStatus]);

  useEffect(() => () => {
    const audio = bgmRef.current;
    if(audio){
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  function backHome(){
    game.teardown();
    navigate("/", { replace: true });
  }

  return (
    <div className={styles.page}>
      <audio ref={bgmRef} src="/audio/background-music.mpeg" preload="auto" hidden />
      <header className={styles.topbar}>
        <button className={styles.homeBtn} onClick={backHome} aria-label={t(lang, "backHome")}>
          <span aria-hidden="true">🏠</span><b>{t(lang, "home")}</b>
        </button>

        <h1 className={styles.title}>{t(lang, "titleGame")}</h1>
      </header>

      <div className={styles.playfield}>
        <div className={styles.zoomStage}>
          <div className={styles.zoomInner} style={{ transform: `scale(${zoom})` }}>
            <main className={styles.layout}>
              <div className={`${styles.panelCol} ${styles.panelColBlue}`}>
                <TeamPanel
                  team="blue"
                  title={teamBlueName}
                  score={state.teams.blue.score}
                  problem={state.teams.blue.currentProblem}
                  input={state.teams.blue.currentInput}
                  disabled={state.gameStatus !== "playing"}
                  locked={state.teams.blue.isLocked}
                  choiceHint={t(lang, "subjectChoiceHint")}
                  onDigit={(d) => game.pushDigit("blue", d)}
                  onClear={() => game.clearInput("blue")}
                  onSubmit={() => game.submit("blue")}
                  onOptionSelect={(choice) => game.submit("blue", choice)}
                />
              </div>

              <div className={styles.arenaCol}>
                <Arena
                  arenaRef={game.arenaRef}
                  trackRef={game.trackRef}
                  videoRef={game.videoRef}
                  videoSrc={arenaVideoSrc}
                  blueScore={state.teams.blue.score}
                  redScore={state.teams.red.score}
                  timerText={game.timerText}
                  status={state.statusMessage || t(lang, "statusDefault")}
                  tone={state.statusTone}
                />
              </div>

              <div className={`${styles.panelCol} ${styles.panelColRed}`}>
                <TeamPanel
                  team="red"
                  title={teamRedName}
                  score={state.teams.red.score}
                  problem={state.teams.red.currentProblem}
                  input={state.teams.red.currentInput}
                  disabled={state.gameStatus !== "playing"}
                  locked={state.teams.red.isLocked}
                  choiceHint={t(lang, "subjectChoiceHint")}
                  onDigit={(d) => game.pushDigit("red", d)}
                  onClear={() => game.clearInput("red")}
                  onSubmit={() => game.submit("red")}
                  onOptionSelect={(choice) => game.submit("red", choice)}
                />
              </div>
            </main>
          </div>
        </div>

        <div className={styles.zoomControls} aria-label="Zoom controls">
          <span className={styles.zoomLabel}>{zoomPercent}%</span>
          <div className={styles.zoomButtons}>
            <button
              type="button"
              className={styles.zoomBtn}
              onClick={() => adjustZoom(-ZOOM_STEP)}
              disabled={!canZoomOut}
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              className={styles.zoomBtn}
              onClick={() => adjustZoom(ZOOM_STEP)}
              disabled={!canZoomIn}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              className={`${styles.zoomBtn} ${styles.zoomReset}`}
              onClick={resetZoom}
              aria-label="Reset zoom"
            >
              ⤢
            </button>
          </div>
        </div>
      </div>

      <WinModal
        open={state.gameStatus === "gameOver"}
        winner={state.winner}
        blueScore={state.teams.blue.score}
        redScore={state.teams.red.score}
        difficulty={state.difficulty}
        lang={lang}
        blueName={teamBlueName}
        redName={teamRedName}
        onPlayAgain={() => game.startGame()}
        onBackHome={backHome}
      />
    </div>
  );
}
