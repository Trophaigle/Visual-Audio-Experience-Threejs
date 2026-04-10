"use client";

import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Explosion({ active }: { active: boolean }) {
  const cubesRef = useRef<THREE.Mesh[]>([]);

  const directions = useMemo(
    () =>
      Array.from({ length: 40 }).map(() =>
        new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      ),
    []
  );

  useFrame(() => {
    if (!active) return;

    cubesRef.current.forEach((cube, i) => {
      if (!cube) return;

      cube.position.addScaledVector(directions[i], 0.05);
    });
  });

  if (!active) return null;

  return (
    <>
      {directions.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) cubesRef.current[i] = el;
          }}
          position={[0, 0, 0]}
        >
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}
    </>
  );
}