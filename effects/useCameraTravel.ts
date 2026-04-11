import { useRef } from "react";
import * as THREE from "three";

export function useCameraTravel(controls: any) {
  const state = useRef({
    active: false,
    t: 0,
    duration: 6,
    startPos: new THREE.Vector3(),
  });

  const trigger = () => {
    if (!controls.current) return;

    state.current.active = true;
    state.current.t = 0;

    controls.current.getPosition(state.current.startPos);
  };

  const update = (delta: number) => {
    if (!state.current.active || !controls.current) return false;

    state.current.t += delta;

    const t = state.current.t / state.current.duration;

    // 🎯 easing cinematic
    const ease = 0.5 - Math.cos(t * Math.PI) / 2;

    if (t < 1) {
      // 🌌 BASE ORBIT RADIUS
      const baseRadius = 5;

      // 💥 DEPTH MOVEMENT (zoom in/out)
      const depthWave = Math.sin(t * Math.PI * 2) * 2; // +/- 2 units

      // 🌊 FINAL RADIUS (depth included)
      var radius = baseRadius + depthWave;
      radius += t *2;

      // 🎡 ORBIT ANGLE
      const angle = ease * Math.PI * 2;

      // 📍 POSITION
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // 🎢 vertical motion (slight cinematic tilt)
      const y = Math.sin(t * Math.PI * 2) * 1.5;

        // 💥 SHAKE (AJOUT ICI)
        const shake = Math.sin(state.current.t * 50) * 0.05;

      controls.current.setPosition(x, y, z, true);
      controls.current.setTarget(0, 0, 0, true);

      return true;
    }

    // 🔁 RETURN TO ORIGINAL POSITION
    controls.current.setPosition(
      state.current.startPos.x,
      state.current.startPos.y,
      state.current.startPos.z,
      true
    );

    controls.current.setTarget(0, 0, 0, true);

    state.current.active = false;

    return false;
  };

  return { trigger, update };
}