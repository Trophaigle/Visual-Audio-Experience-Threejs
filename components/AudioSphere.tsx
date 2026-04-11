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
  onExplosionReady
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

    const avg = data.reduce((a, b) => a + b, 0) / data.length;

    // smooth energy
    energyRef.current = THREE.MathUtils.lerp(
      energyRef.current,
      avg,
      smoothing
    );

    // 🌊 sphere scale smooth
    const targetScale = 1 + (avg / 500) * bassMultiplier * gain;
   
    meshRef.current?.scale.lerp(
      new THREE.Vector3(
        targetScale,
        targetScale,
        targetScale
      ),
      0.1
    );
    
    // 🌈 color reactive
    if (materialRef.current) {
      const hue = energyRef.current / 255;
      materialRef.current.color.setHSL(hue, 0.6, 0.5);
    }

    // 🌀 particles rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.y += energyRef.current / 9000;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          emissive={"hotpink"}
          emissiveIntensity={0.3}
          color={"black"}
        />
      </mesh>
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0} />
      </EffectComposer>

      <points ref={pointsRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <pointsMaterial size={0.02} color="white" />
      </points>
    </>
  );
}