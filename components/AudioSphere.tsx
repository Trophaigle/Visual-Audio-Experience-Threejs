"use client";

import { useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function AudioSphere({
  analyser,
  audio,
  bassMultiplier,
  gain,
  smoothing,
}: {
  analyser: AnalyserNode | null;
  audio: HTMLAudioElement | null; 
  bassMultiplier: number;  
  gain: number;
  smoothing: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const controls = useRef<CameraControls>(null);

  const timelineRef = useRef<
    { time: number; triggered: boolean; action: () => void }[]
    >([]);

  const addEvent = (time: number, action: () => void) => {
    timelineRef.current.push({
      time,
      triggered: false,
      action,
    });
  };

    
  useEffect(() => {
    addEvent(30, () => {
        console.log("💥 Drop 1");
          //event
    });
    
  }, []);

  const energyRef = useRef(0);

  useFrame(({ camera }) => {
    if (!analyser) return;

        if (audio) {
      const t = audio.currentTime;

      timelineRef.current.forEach((event) => {
        if (t >= event.time && !event.triggered) {
          event.triggered = true;
          event.action();
        }
      });

      // 🔁 reset si replay
      if (t < 0.5) {
        timelineRef.current.forEach((e) => (e.triggered = false));
      }
    }

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
      pointsRef.current.rotation.y += energyRef.current / 9000;
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

      <CameraControls ref={controls} />
    </>
  );
}