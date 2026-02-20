import { useEffect, useRef } from "react";

/**
 * Runs a countdown timer while enabled. Calls onTick(secondsLeft) every second.
 * Calls onExpire() when it reaches 0.
 */
export function useTimer({ enabled, seconds, onTick, onExpire }){
  const intervalRef = useRef(null);

  useEffect(() => {
    if(!enabled) return;

    if(intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      onTick((prev) => {
        if(prev <= 1){
          // expire
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if(intervalRef.current){
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, onTick, onExpire]);
}
