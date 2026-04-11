"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Stars } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import AudioSphere from "@/components/AudioSphere";
import { useTimeline } from "@/hooks/useTimeline";
import { useCameraDrop } from "@/effects/useCameraDrop";
import { useControls } from "leva";
import React, { forwardRef, useImperativeHandle } from "react";
import { useCameraTravel } from "@/effects/useCameraTravel";

const SceneContent = forwardRef(function SceneContent({
  analyser,
  audio,
  bassMultiplier,
  gain,
  smoothing,
  isPlaying,
}: any, ref) {
  const controls = useRef<any>(null);

  // 🎧 timeline
  const { addEvent, update: updateTimeline, seek: seekTimeline } = useTimeline(audio);

  // 🎬 camera drop
  const { trigger: triggerCameraDrop, update: updateCameraDrop } = useCameraDrop(controls);

  // 🎬 camera travel
  const { trigger: triggerCameraTravel, update: updateCameraTravel } = useCameraTravel(controls);

  //explosion ref
  const explosionRef = useRef<() => void>(() => {});

  // skip audio
  const skip = (delta: number) => {
    if(!audio) return;
    
    audio.currentTime += delta;
    seekTimeline(audio.currentTime);
  };

  useImperativeHandle(ref, () => ({
      skip,
  }));

  // 🎯 TIMELINE EVENTS
  useEffect(() => {
    if(!audio) return;

    addEvent(85, () => {
      console.log("💥 DROP !");
      triggerCameraDrop(); // camera effect
      explosionRef.current?.(); // sphere effect
    });

    addEvent(139, () => {
      console.log("💥 DROP !");
      triggerCameraDrop(); // camera effect
      explosionRef.current?.(); // sphere effect
    });

    addEvent(157, () => {
      console.log("Camera Travel !");
      triggerCameraTravel();
    });

    addEvent(193, () => {
      console.log("💥 DROP !");
      triggerCameraDrop(); // camera effect
      explosionRef.current?.(); // sphere effect
    });

    addEvent(196, () => {
      console.log("Camera Travel !");
      triggerCameraTravel();
    });

  }, [audio]);

  // 🔁 global update loop
  useFrame((_, delta) => {
    if (!isPlaying || !audio) return; 

    updateTimeline();

        // 🎥 camera travel a PRIORITÉ
    const travelActive = updateCameraTravel(delta);

     if (!travelActive) {
      updateCameraDrop(delta);
    }
  });

  return (
    <>
    {/* 🎥 camera controls */}
    <CameraControls ref={controls} makeDefault />
    <Stars
      radius={100}
      depth={50}
      count={3000}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />

      {/* 💡 lights */}
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1.6} position={[2, 2, 2]} />

      {/* 🎯 debug */}
      {/* <axesHelper args={[5]} /> */}

      {/* 🌍 audio visual */}
      <AudioSphere
        analyser={analyser}
        bassMultiplier={bassMultiplier}
        gain={gain}
        smoothing={smoothing}
        onExplosionReady={(fn) => {
          explosionRef.current = fn;
        }}
      />
    </>
  );
});

export default function Scene() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sceneRef = useRef<any>(null);

  // 🎧 play / pause
  const handleToggle = async () => {
    if (!audio) {
      const audioEl = new Audio("/music/Love_Again_Instru.mp3");
      audioEl.crossOrigin = "anonymous";
      audioEl.volume = 0.5;

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const source =
        audioContextRef.current.createMediaElementSource(audioEl);

      const analyserNode = audioContextRef.current.createAnalyser();
      analyserNode.fftSize = 256;

      source.connect(analyserNode);
      analyserNode.connect(audioContextRef.current.destination);

      setAudio(audioEl);
      setAnalyser(analyserNode);

      await audioEl.play();
      setIsPlaying(true);
      return;
    }

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // 🎛️ Leva controls
  const { bassMultiplier } = useControls({
    bassMultiplier: {
      value: 1,
      min: 0.5,
      max: 3,
      step: 0.1,
    },
  });

  const { gain, smoothing } = useControls({
    gain: {
      value: 1,
      min: 0,
      max: 5,
      step: 0.1,
    },
    smoothing: {
      value: 0.1,
      min: 0.01,
      max: 0.3,
      step: 0.01,
    },
  });

  return (
    <>
      {/* 🎮 UI */}
      <button
        onClick={handleToggle}
        className="fixed top-5 left-5 z-50 px-5 py-2 rounded-xl 
        bg-white/10 text-white backdrop-blur-md 
        border border-white/20 shadow-lg
        hover:bg-white/20 hover:scale-105 
        active:scale-95 transition-all duration-200"
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>

      <button
        onClick={() => sceneRef.current?.skip(10)}
        className="fixed top-20 left-5 z-50 px-5 py-2 rounded-xl 
        bg-white/10 text-white backdrop-blur-md 
        border border-white/20 shadow-lg
        hover:bg-white/20 hover:scale-105 
        active:scale-95 transition-all duration-200"
      >
        Skip to 10s
      </button>

      {/* 🌌 3D */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <SceneContent
          ref={sceneRef}
          analyser={analyser}
          audio={audio}
          bassMultiplier={bassMultiplier}
          gain={gain}
          smoothing={smoothing}
          isPlaying={isPlaying}
        />
      </Canvas>
    </>
  );
}