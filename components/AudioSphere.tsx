"use client";

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { usePointsExplosion } from "@/effects/usePointsExplosion";

export default function AudioSphere({
  analyser,
  bassMultiplier,
  gain,
  smoothing,
  onExplosionReady,
}: {
  analyser: AnalyserNode | null;
  bassMultiplier: number;
  gain: number;
  smoothing: number;
  onExplosionReady?: (fn: () => void) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const bloomIntensity = useRef(0.8);
  const energyRef = useRef(0);

  const { trigger, update } = usePointsExplosion(pointsRef);

  useEffect(() => {
    onExplosionReady?.(trigger);
  }, []);

  useFrame((_, delta) => {
    update(delta);

    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    const avg =
      data.reduce((a, b) => a + b, 0) / data.length;

    // 🌊 smooth energy
    energyRef.current = THREE.MathUtils.lerp(
      energyRef.current,
      avg,
      smoothing
    );

    const bass = energyRef.current / 255;
    const intensity = bass * bassMultiplier * 0.2; // 🔥 plus subtil

    const time = performance.now() * 0.001;

    // 🌊 sphere scale
    const targetScale = 1 + (avg / 500) * bassMultiplier * gain;

    meshRef.current?.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // 🌈 color reactive
    if (materialRef.current) {
      const hue = energyRef.current / 255;
      materialRef.current.color.setHSL(hue, 0.6, 0.5);
    }

    // 🌀 rotation Y (gardée)
    if (pointsRef.current) {
      pointsRef.current.rotation.y += energyRef.current / 9000;
    }

    // 💥 RADIAL VIBRATION (clean & subtle)
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry as THREE.BufferGeometry;
      const pos = geometry.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const i3 = i * 3;

        const x = pos.array[i3];
        const y = pos.array[i3 + 1];
        const z = pos.array[i3 + 2];

        const dir = new THREE.Vector3(x, y, z).normalize();


        // 💥 radial push doux uniquement
        const offset = 1 + intensity / 1.5;

        pos.array[i3] = dir.x * offset * 2;
        pos.array[i3 + 1] = dir.y * offset * 2;
        pos.array[i3 + 2] = dir.z * offset * 2;
      }

      pos.needsUpdate = true;
    }

    // 💡 bloom smooth
    bloomIntensity.current = THREE.MathUtils.lerp(
      bloomIntensity.current,
      targetScale,
      0.1
    );
  });

  return (
    <>
      {/* 🌍 sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          emissive={"hotpink"}
          emissiveIntensity={0.3}
          color={"black"}
        />
      </mesh>

      {/* ✨ bloom */}
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity.current}
          luminanceThreshold={0}
        />
      </EffectComposer>

      {/* 🌀 points */}
      <points ref={pointsRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <pointsMaterial size={0.02} color="white" />
      </points>
    </>
  );
}