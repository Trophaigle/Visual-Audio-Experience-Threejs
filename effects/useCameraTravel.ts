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

  // return: true = animation active, false = inactive
  const update = (delta: number) => {
    if (!state.current.active || !controls.current) return false;

    state.current.t += delta;

    const t = state.current.t / state.current.duration;
    const ease = 0.5 - Math.cos(t * Math.PI) / 2;

    if (t < 1) {
      const radius = 5;

      const angle = ease * Math.PI * 2;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle * 2) * 1.2;

      controls.current.setPosition(x, y, z, true);
      controls.current.setTarget(0, 0, 0, true);

      return true;
    }

    // retour position initiale
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