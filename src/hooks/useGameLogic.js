import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGame } from "../context/GameContext.jsx";
import {
  SIMULTANEOUS_WINDOW_MS,
  TEAM_LOCK_MS,
  WIN_STEPS
} from "../utils/constants.js";
import { t } from "../utils/i18n.js";
import { useSfx } from "./useSfx.js";
import { useTimer } from "./useTimer.js";

function fmtTime(sec){
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function useGameLogic(){
  const { state, dispatch } = useGame();
  const { play, unlock } = useSfx();

  const arenaRef = useRef(null);
  const trackRef = useRef(null);
  const videoRef = useRef(null);

  // movement scheduling for simultaneous-correct cancel
  const pendingMoveRef = useRef(null); // { team, at, timeoutId }
  const lockTimersRef = useRef({ blue: null, red: null });

  const timerText = useMemo(() => fmtTime(state.timer), [state.timer]);

  const clearPending = useCallback(() => {
    if(pendingMoveRef.current?.timeoutId){
      clearTimeout(pendingMoveRef.current.timeoutId);
    }
    pendingMoveRef.current = null;
  }, []);

  const teardown = useCallback(() => {
    clearPending();
    // clear locks
    for(const k of ["blue","red"]){
      if(lockTimersRef.current[k]){
        clearTimeout(lockTimersRef.current[k]);
        lockTimersRef.current[k] = null;
      }
    }
    // stop video
    try{
      const v = videoRef.current;
      if(v){
        v.pause();
        v.currentTime = 0;
      }
    }catch{}
  }, [clearPending]);

  const setStatus = useCallback((msgKeyOrText) => {
    const msg = (msgKeyOrText && msgKeyOrText.startsWith?.("i18n:"))
      ? t(state.language, msgKeyOrText.slice(5))
      : msgKeyOrText;

    dispatch({ type: "SET_STATUS", payload: msg });
  }, [dispatch, state.language]);

  const startGame = useCallback(() => {
    teardown();
    dispatch({ type: "START_GAME" });
    setStatus(t(state.language, "statusDefault"));
    // start video
    setTimeout(() => {
      try{
        videoRef.current?.play?.().catch(()=>{});
      }catch{}
    }, 0);
  }, [dispatch, setStatus, state.language, teardown]);

  const endGame = useCallback((winner) => {
    clearPending();
    dispatch({ type: "SET_WINNER", payload: winner });
    play("win");
    // stop video
    try{ videoRef.current?.pause?.(); }catch{}
  }, [clearPending, dispatch, play]);

  // Timer logic
  useTimer({
    enabled: state.gameStatus === "playing",
    seconds: state.timer,
    onTick: (updater) => dispatch({ type: "SET_TIMER", payload: typeof updater === "function" ? updater(state.timer) : updater }),
    onExpire: () => {
      // winner based on pull position
      if(state.pullPosition < 0) endGame("BLUE");
      else if(state.pullPosition > 0) endGame("RED");
      else endGame("DRAW");
    }
  });

  // Because we used onTick with direct state.timer above, keep a separate interval update pattern:
  // We'll override with a dedicated effect for correctness.
  useEffect(() => {
    if(state.gameStatus !== "playing") return;

    let alive = true;
    const id = setInterval(() => {
      if(!alive) return;
      dispatch({ type: "SET_TIMER", payload: Math.max(0, state.timer - 1) });
    }, 1000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [dispatch, state.gameStatus, state.timer]);

  useEffect(() => {
    if(state.gameStatus === "playing" && state.timer === 0){
      if(state.pullPosition < 0) endGame("BLUE");
      else if(state.pullPosition > 0) endGame("RED");
      else endGame("DRAW");
    }
  }, [state.gameStatus, state.timer, state.pullPosition, endGame]);

  // Unlock audio on first user gesture
  useEffect(() => {
    const handler = () => unlock();
    window.addEventListener("pointerdown", handler, { once: true });
    return () => window.removeEventListener("pointerdown", handler);
  }, [unlock]);

  const clearInput = useCallback((team) => {
    dispatch({ type: "TEAM_INPUT", payload: { team, input: "0" } });
  }, [dispatch]);

  const pushDigit = useCallback((team, digit) => {
    const current = state.teams[team].currentInput;
    let next = current === "0" ? String(digit) : current + String(digit);
    if(next.length > 4) next = next.slice(0, 4);
    dispatch({ type: "TEAM_INPUT", payload: { team, input: next } });
  }, [dispatch, state.teams]);

  const lockTeam = useCallback((team) => {
    dispatch({ type: "TEAM_LOCK", payload: { team, locked: true } });
    if(lockTimersRef.current[team]) clearTimeout(lockTimersRef.current[team]);

    lockTimersRef.current[team] = setTimeout(() => {
      dispatch({ type: "TEAM_LOCK", payload: { team, locked: false } });
      lockTimersRef.current[team] = null;
    }, TEAM_LOCK_MS);
  }, [dispatch]);

  const schedulePull = useCallback((team) => {
    // -1 toward blue, +1 toward red
    const delta = team === "blue" ? -1 : +1;

    clearPending();

    const at = performance.now();
    const timeoutId = setTimeout(() => {
      pendingMoveRef.current = null;
      dispatch({ type: "PULL_STEP", payload: { delta } });

      const next = Math.max(-WIN_STEPS, Math.min(WIN_STEPS, state.pullPosition + delta));

      // Check win after pull step
      if(next === -WIN_STEPS) endGame("BLUE");
      if(next === WIN_STEPS) endGame("RED");
    }, SIMULTANEOUS_WINDOW_MS);

    pendingMoveRef.current = { team, at, timeoutId };
  }, [clearPending, dispatch, endGame, state.pullPosition]);

  const handleCorrect = useCallback((team) => {
    dispatch({ type: "TEAM_SCORE_PLUS", payload: { team } });
    dispatch({ type: "TEAM_NEW_PROBLEM", payload: { team } });
    play("correct");

    const now = performance.now();
    const pending = pendingMoveRef.current;

    if(pending && pending.team !== team && (now - pending.at) <= SIMULTANEOUS_WINDOW_MS){
      // simultaneous correct: cancel movement
      clearPending();
      setStatus(t(state.language, "bothCorrect"));
      return;
    }

    setStatus(t(state.language, "correct"));
    schedulePull(team);
  }, [clearPending, dispatch, play, schedulePull, setStatus, state.language]);

  const handleWrong = useCallback((team) => {
    play("wrong");
    dispatch({ type: "TEAM_INPUT", payload: { team, input: "0" } });
    setStatus(t(state.language, "wrong"));
  }, [dispatch, play, setStatus, state.language]);

  const submit = useCallback((team) => {
    if(state.gameStatus !== "playing") return;
    const teamState = state.teams[team];
    if(teamState.isLocked) return;

    lockTeam(team);

    const val = parseInt(teamState.currentInput, 10);
    const correct = teamState.currentProblem?.answer;

    if(Number.isNaN(val)){
      handleWrong(team);
      return;
    }

    if(val === correct){
      handleCorrect(team);
    }else{
      handleWrong(team);
    }
  }, [handleCorrect, handleWrong, lockTeam, state.gameStatus, state.teams]);

  const setSettings = useCallback(({ language, subject, difficulty }) => {
    try{
      if(language) localStorage.setItem("tug_lang", language);
      if(subject) localStorage.setItem("tug_subject", subject);
      if(difficulty) localStorage.setItem("tug_diff", difficulty);
    }catch{}
    dispatch({ type: "SET_SETTINGS", payload: { language, subject, difficulty } });
  }, [dispatch]);

  return {
    state,
    dispatch,
    arenaRef,
    trackRef,
    videoRef,
    timerText,
    setSettings,
    startGame,
    teardown,
    pushDigit,
    clearInput,
    submit,
    setStatus
  };
}
