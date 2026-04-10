"use client";

import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

export default function AudioSphere({
  analyser,
  threshold,
  cooldown,
  bassMultiplier,
  gain,
  smoothing,
  onDrop,
}: {
  analyser: AnalyserNode | null;
  threshold: number;
  cooldown: number;
  bassMultiplier: number;  
  gain: number;
  smoothing: number;
  onDrop?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const energyRef = useRef(0);
  const lastTriggerRef = useRef(0);
  const cooldownRef = useRef(0);

  useFrame(({ camera }) => {
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

    const delta = avg - energyRef.current;

    // cooldown
    if (cooldownRef.current > 0) {
      cooldownRef.current -= 1;
    }

    // detection
    if (delta > threshold && cooldownRef.current === 0) {
      onDrop?.();
      cooldownRef.current = cooldown;
    }

    // 🌊 sphere scale smooth
    const targetScale = 1 + (avg / 500) * bassMultiplier * gain;

    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(
          targetScale,
          targetScale,
          targetScale
        ),
        0.1
      );
    }

    // 🌈 color reactive
    if (materialRef.current) {
      const hue = energyRef.current / 255;
      materialRef.current.color.setHSL(hue, 0.6, 0.5);
    }

    // 🌀 particles rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.y += energyRef.current / 15000;
      //pointsRef.current.rotation.x += delta / 10000;
    }

    // 🎥 camera breathing
    camera.position.x = Math.sin(energyRef.current / 120) * 0.3;
    camera.position.y = Math.cos(energyRef.current / 140) * 0.2;
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          emissive={"hotpink"}
          emissiveIntensity={0.25}
          color={"black"}
        />
      </mesh>

      <points ref={pointsRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <pointsMaterial size={0.02} color="white" />
      </points>
    </>
  );
}