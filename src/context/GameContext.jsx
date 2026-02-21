import React, { createContext, useContext, useMemo, useReducer } from "react";
import { ROUND_SECONDS } from "../utils/constants.js";
import { generateProblem } from "../utils/mathProblems.js";

const GameContext = createContext(null);
const AVAILABLE_SUBJECTS = ["math", "chemistry", "biology", "physics"];

function normalizeSubject(value){
  return AVAILABLE_SUBJECTS.includes(value) ? value : "math";
}

function safeGet(key, fallback){
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function initState(){
  const language = safeGet("tug_lang", "en");
  const subject = normalizeSubject(safeGet("tug_subject", "math"));
  const difficulty = safeGet("tug_diff", "medium");
  const teamBlue = safeGet("tug_team_blue", "Team Blue");
  const teamRed = safeGet("tug_team_red", "Team Red");

  return {
    language,
    subject,
    difficulty,
    statusTone: "neutral",
    teamNames: {
      blue: teamBlue,
      red: teamRed
    },
    gameStatus: "idle", // idle | playing | gameOver
    timer: ROUND_SECONDS,
    pullPosition: 0, // -6..+6
    statusMessage: "",
    winner: null, // BLUE | RED | DRAW
    teams: {
      blue: {
        score: 0,
        currentInput: "0",
        currentProblem: generateProblem(subject, difficulty),
        isLocked: false
      },
      red: {
        score: 0,
        currentInput: "0",
        currentProblem: generateProblem(subject, difficulty),
        isLocked: false
      }
    }
  };
}

function reducer(state, action){
  switch(action.type){
    case "SET_SETTINGS": {
      const { language, subject, difficulty } = action.payload;
      const nextSubject = normalizeSubject(subject ?? state.subject);
      return {
        ...state,
        language,
        subject: nextSubject,
        difficulty,
        teams: {
          blue: {
            ...state.teams.blue,
            currentProblem: generateProblem(nextSubject, difficulty ?? state.difficulty)
          },
          red: {
            ...state.teams.red,
            currentProblem: generateProblem(nextSubject, difficulty ?? state.difficulty)
          }
        }
      };
    }
    case "START_GAME": {
      const diff = state.difficulty;
      const subj = state.subject;
      return {
        ...state,
        gameStatus: "playing",
        timer: ROUND_SECONDS,
        pullPosition: 0,
        statusMessage: "",
        winner: null,
        teams: {
          blue: {
            score: 0,
            currentInput: "0",
            currentProblem: generateProblem(subj, diff),
            isLocked: false
          },
          red: {
            score: 0,
            currentInput: "0",
            currentProblem: generateProblem(subj, diff),
            isLocked: false
          }
        }
      };
    }
    case "SET_TIMER":
      return { ...state, timer: action.payload };
    case "SET_STATUS":
      return { ...state, statusMessage: action.payload.message, statusTone: action.payload.tone ?? "neutral" };
    case "SET_WINNER":
      return { ...state, winner: action.payload, gameStatus: "gameOver" };
    case "TEAM_LOCK": {
      const { team, locked } = action.payload;
      return {
        ...state,
        teams: {
          ...state.teams,
          [team]: { ...state.teams[team], isLocked: locked }
        }
      };
    }
    case "TEAM_INPUT": {
      const { team, input } = action.payload;
      return {
        ...state,
        teams: {
          ...state.teams,
          [team]: { ...state.teams[team], currentInput: input }
        }
      };
    }
    case "TEAM_SCORE_PLUS": {
      const { team } = action.payload;
      return {
        ...state,
        teams: {
          ...state.teams,
          [team]: { ...state.teams[team], score: state.teams[team].score + 1 }
        }
      };
    }
    case "TEAM_NEW_PROBLEM": {
      const { team } = action.payload;
      return {
        ...state,
        teams: {
          ...state.teams,
          [team]: {
            ...state.teams[team],
            currentProblem: generateProblem(state.subject, state.difficulty),
            currentInput: "0"
          }
        }
      };
    }
    case "PULL_STEP": {
      const { delta } = action.payload; // -1 blue, +1 red
      const next = Math.max(-6, Math.min(6, state.pullPosition + delta));
      return { ...state, pullPosition: next };
    }
    case "SET_TEAM_NAMES": {
      const { blue, red } = action.payload;
      return {
        ...state,
        teamNames: {
          blue,
          red
        }
      };
    }
    default:
      return state;
  }
}

export function GameProvider({ children }){
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(){
  const ctx = useContext(GameContext);
  if(!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
