import { useRef } from "react";
import * as THREE from "three";

export function useCameraDrop(controls: any) {
  const state = useRef({
    active: false,
    time: 0,
    duration: 2,
    startPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
  });

  const trigger = () => {
    const c = controls.current;
    if (!c) return;

    c.getPosition(state.current.startPos);
    c.getTarget(state.current.startTarget);

    state.current.active = true;
    state.current.time = 0;
  };

  const update = (delta: number) => {
    const c = controls.current;
    if (!c || !state.current.active) return;

    const s = state.current;
    s.time += delta;

    const t = s.time / s.duration;
    const ease = Math.sin(t * Math.PI);

    const zoom = Math.sin(t * Math.PI);
    const z = 5 + zoom * 2;

    c.setLookAt(s.startPos.x, s.startPos.y, z, 0, 0, 0, false);

    if (t >= 1) {
      s.active = false;

      c.setLookAt(
        s.startPos.x,
        s.startPos.y,
        s.startPos.z,
        s.startTarget.x,
        s.startTarget.y,
        s.startTarget.z,
        true
      );
    }
  };

  return { trigger, update };
}