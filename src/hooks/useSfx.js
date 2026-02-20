import { useMemo, useRef } from "react";

function beep(freq=660, duration=0.08, type="sine", gain=0.05){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close?.();
    }, duration * 1000);
  }catch{
    // ignore
  }
}

function makeAudio(src){
  const a = new Audio(src);
  a.preload = "auto";
  return a;
}

export function useSfx(){
  const readyRef = useRef(false);

  // Create Audio objects once
  const audios = useMemo(() => ({
    correct: makeAudio("/assets/sfx/correct.mp3"),
    wrong: makeAudio("/assets/sfx/wrong.mp3"),
    win: makeAudio("/assets/sfx/win.mp3")
  }), []);

  function unlock(){
    // Some browsers require a gesture before audio can play.
    readyRef.current = true;
    // also try to resume audio context via a tiny beep
    beep(440, 0.03, "sine", 0.02);
  }

  async function play(name){
    if(!readyRef.current){
      // Still allow beeps (won't throw)
      if(name === "correct") beep(740, 0.07, "sine", 0.05);
      if(name === "wrong") beep(220, 0.09, "square", 0.04);
      if(name === "win") beep(880, 0.12, "sine", 0.06);
      return;
    }

    const a = audios[name];
    if(!a){
      beep(500, 0.06);
      return;
    }

    try{
      a.currentTime = 0;
      await a.play();
    }catch{
      // fallback beep if mp3 missing/blocked
      if(name === "correct") beep(740, 0.07, "sine", 0.05);
      if(name === "wrong") beep(220, 0.09, "square", 0.04);
      if(name === "win") beep(880, 0.12, "sine", 0.06);
    }
  }

  return { play, unlock };
}
