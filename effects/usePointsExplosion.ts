import { useRef } from "react";
import * as THREE from "three";

export function usePointsExplosion(pointsRef: any) {
  const state = useRef({
    active: false,
    time: 0,
    phase: "idle", // "expand" | "shrink"
  });

  const trigger = () => {
    state.current.active = true;
    state.current.time = 0;
    state.current.phase = "expand";
  };

  const update = (delta: number) => {
    if (!pointsRef.current || !state.current.active) return;

    const s = state.current;
    s.time += delta;

    // 💥 PHASE 1 : EXPANSION (2s)
    if (s.phase === "expand") {
      const duration = 2;
      const t = Math.min(s.time / duration, 1);

      // easing smooth
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

      const scale = 1 + ease * 2; // 🔥 jusqu'à x3

      pointsRef.current.scale.set(scale, scale, scale);

      if (t >= 1) {
        s.phase = "shrink";
        s.time = 0;
      }
    }

    // ⚡ PHASE 2 : RETOUR RAPIDE (0.2s)
    if (s.phase === "shrink") {
      const duration = 0.2;
      const t = Math.min(s.time / duration, 1);

      const ease = t * t; // easeIn

      const scale = 3 - ease * 2; // revient vers 1

      pointsRef.current.scale.set(scale, scale, scale);

      if (t >= 1) {
        s.active = false;
        s.phase = "idle";

        // reset clean
        pointsRef.current.scale.set(1, 1, 1);
      }
    }
  };

  return { trigger, update };
}