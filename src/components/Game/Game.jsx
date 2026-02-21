import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Game.module.css";
import TeamPanel from "./TeamPanel.jsx";
import Arena from "./Arena.jsx";
import WinModal from "../Modal/WinModal.jsx";
import { useGame } from "../../context/GameContext.jsx";
import { useGameLogic } from "../../hooks/useGameLogic.js";
import { usePullAnimation } from "../../hooks/usePullAnimation.js";
import { t } from "../../utils/i18n.js";
import bgmTrack from "../../assets/audio/background-music.mpeg";
import competitionVideo from "../../assets/videos/competition.mp4";
import blueWinVideo from "../../assets/videos/blue-win.mp4";
import redWinVideo from "../../assets/videos/red-win.mp4";

export default function Game(){
  const navigate = useNavigate();
  const { state } = useGame();
  const lang = state.language;
  const teamBlueName = state.teamNames?.blue || "Blue";
  const teamRedName = state.teamNames?.red || "Red";

  const game = useGameLogic();
  const bgmRef = useRef(null);

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

    function unlockAudio(){
      audio.play().catch(() => {});
    }

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    return () => window.removeEventListener("pointerdown", unlockAudio);
  }, []);

  useEffect(() => {
    const audio = bgmRef.current;
    if(!audio) return;

    if(state.gameStatus === "playing"){
      audio.play().catch(() => {});
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
      <audio ref={bgmRef} src={bgmTrack} preload="auto" hidden />
      <header className={styles.topbar}>
        <button className={styles.homeBtn} onClick={backHome} aria-label={t(lang, "backHome")}>
          <span aria-hidden="true">🏠</span><b>{t(lang, "home")}</b>
        </button>

        <h1 className={styles.title}>{t(lang, "titleGame")}</h1>

        <div className={styles.langPill} title={t(lang, "language")}>
          🌐 {lang.toUpperCase()} • {state.difficulty.toUpperCase()}
        </div>
      </header>

      <main className={styles.layout}>
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
      </main>

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
