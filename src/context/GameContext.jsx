import React, { createContext, useContext, useMemo, useReducer } from "react";
import { ROUND_SECONDS, DEFAULT_MATH_OPS, WIN_STEPS } from "../utils/constants.js";
import { generateProblem } from "../utils/mathProblems.js";

const GameContext = createContext(null);
const AVAILABLE_SUBJECTS = ["math", "chemistry", "biology", "physics"];

function normalizeSubject(value){
  return AVAILABLE_SUBJECTS.includes(value) ? value : "math";
}

function safeGet(key, fallback){
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function sanitizeMathOps(ops){
  if(Array.isArray(ops)){
    const filtered = ops.filter(op => DEFAULT_MATH_OPS.includes(op));
    if(filtered.length) return filtered;
  }
  return DEFAULT_MATH_OPS;
}

function safeGetMathOps(){
  try {
    const raw = localStorage.getItem("tug_math_ops");
    if(!raw) return DEFAULT_MATH_OPS;
    const parsed = JSON.parse(raw);
    return sanitizeMathOps(parsed);
  } catch {
    return DEFAULT_MATH_OPS;
  }
}

function initState(){
  const language = safeGet("tug_lang", "en");
  const subject = normalizeSubject(safeGet("tug_subject", "math"));
  const difficulty = safeGet("tug_diff", "medium");
  const teamBlue = safeGet("tug_team_blue", "Team Blue");
  const teamRed = safeGet("tug_team_red", "Team Red");
  const mathOps = safeGetMathOps();
  const opsForSubject = subject === "math" ? mathOps : undefined;

  return {
    language,
    subject,
    difficulty,
    mathOps,
    statusTone: "neutral",
    teamNames: {
      blue: teamBlue,
      red: teamRed
    },
    gameStatus: "idle", // idle | playing | gameOver
    timer: 0,
    pullPosition: 0, // -WIN_STEPS..+WIN_STEPS
    statusMessage: "",
    winner: null, // BLUE | RED | DRAW
    teams: {
      blue: {
        score: 0,
        currentInput: "0",
        currentProblem: generateProblem(subject, difficulty, opsForSubject),
        isLocked: false
      },
      red: {
        score: 0,
        currentInput: "0",
        currentProblem: generateProblem(subject, difficulty, opsForSubject),
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
      const opsForSubject = nextSubject === "math" ? state.mathOps : undefined;
      return {
        ...state,
        language,
        subject: nextSubject,
        difficulty,
        teams: {
          blue: {
            ...state.teams.blue,
            currentProblem: generateProblem(nextSubject, difficulty ?? state.difficulty, opsForSubject)
          },
          red: {
            ...state.teams.red,
            currentProblem: generateProblem(nextSubject, difficulty ?? state.difficulty, opsForSubject)
          }
        }
      };
    }
    case "START_GAME": {
      const diff = state.difficulty;
      const subj = state.subject;
      const opsForSubject = subj === "math" ? state.mathOps : undefined;
      return {
        ...state,
        gameStatus: "playing",
        timer: 0,
        pullPosition: 0,
        statusMessage: "",
        winner: null,
        teams: {
          blue: {
            score: 0,
            currentInput: "0",
            currentProblem: generateProblem(subj, diff, opsForSubject),
            isLocked: false
          },
          red: {
            score: 0,
            currentInput: "0",
            currentProblem: generateProblem(subj, diff, opsForSubject),
            isLocked: false
          }
        }
      };
    }
    case "SET_TIMER":
      return { ...state, timer: action.payload };
    case "TICK_TIMER":
      return { ...state, timer: state.timer + 1 };
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
      const opsForSubject = state.subject === "math" ? state.mathOps : undefined;
      return {
        ...state,
        teams: {
          ...state.teams,
          [team]: {
            ...state.teams[team],
            currentProblem: generateProblem(state.subject, state.difficulty, opsForSubject),
            currentInput: "0"
          }
        }
      };
    }
    case "PULL_STEP": {
      const { delta } = action.payload; // -1 blue, +1 red
      const next = Math.max(-WIN_STEPS, Math.min(WIN_STEPS, state.pullPosition + delta));
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
    case "SET_MATH_OPS": {
      const ops = sanitizeMathOps(action.payload?.ops);
      return {
        ...state,
        mathOps: ops
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
