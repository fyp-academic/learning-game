import { useEffect } from "react";
import {
  WIN_STEPS,
  MAX_SHIFT_PERCENTAGE,
  VIDEO_SCALE,
  BASE_OFFSET_PX
} from "../utils/constants.js";

export function usePullAnimation({ arenaRef, trackRef, pullPosition }){
  useEffect(() => {
    const arena = arenaRef.current;
    const track = trackRef.current;
    if(!arena || !track) return;

    function apply(){
      const w = arena.getBoundingClientRect().width;
      const maxShiftPx = w * MAX_SHIFT_PERCENTAGE;
      const stepPx = maxShiftPx / WIN_STEPS;
      const offset = BASE_OFFSET_PX + pullPosition * stepPx;
      track.style.transform = `translate3d(${offset}px,0,0) scale(${VIDEO_SCALE})`;
    }

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [arenaRef, trackRef, pullPosition]);
}
