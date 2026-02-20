import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Game.module.css";
import TeamPanel from "./TeamPanel.jsx";
import Arena from "./Arena.jsx";
import WinModal from "../Modal/WinModal.jsx";
import { useGame } from "../../context/GameContext.jsx";
import { useGameLogic } from "../../hooks/useGameLogic.js";
import { usePullAnimation } from "../../hooks/usePullAnimation.js";
import { t } from "../../utils/i18n.js";

export default function Game(){
  const navigate = useNavigate();
  const { state } = useGame();
  const lang = state.language;

  const game = useGameLogic();

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

  function backHome(){
    game.teardown();
    navigate("/", { replace: true });
  }

  return (
    <div className={styles.page}>
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
          title="Blue"
          score={state.teams.blue.score}
          question={state.teams.blue.currentProblem.text}
          input={state.teams.blue.currentInput}
          disabled={state.gameStatus !== "playing"}
          locked={state.teams.blue.isLocked}
          onDigit={(d) => game.pushDigit("blue", d)}
          onClear={() => game.clearInput("blue")}
          onSubmit={() => game.submit("blue")}
        />

        <Arena
          arenaRef={game.arenaRef}
          trackRef={game.trackRef}
          videoRef={game.videoRef}
          blueScore={state.teams.blue.score}
          redScore={state.teams.red.score}
          timerText={game.timerText}
          status={state.statusMessage || t(lang, "statusDefault")}
        />

        <TeamPanel
          team="red"
          title="Red"
          score={state.teams.red.score}
          question={state.teams.red.currentProblem.text}
          input={state.teams.red.currentInput}
          disabled={state.gameStatus !== "playing"}
          locked={state.teams.red.isLocked}
          onDigit={(d) => game.pushDigit("red", d)}
          onClear={() => game.clearInput("red")}
          onSubmit={() => game.submit("red")}
        />
      </main>

      <WinModal
        open={state.gameStatus === "gameOver"}
        winner={state.winner}
        blueScore={state.teams.blue.score}
        redScore={state.teams.red.score}
        difficulty={state.difficulty}
        lang={lang}
        onPlayAgain={() => game.startGame()}
        onBackHome={backHome}
      />
    </div>
  );
}
