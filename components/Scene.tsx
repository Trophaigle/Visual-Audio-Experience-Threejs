//canvas 3D
"use client";

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import AudioSphere from './AudioSphere';
import { useControls } from 'leva';


export default function Scene() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explode, setExplode] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

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

      <Canvas camera={{ position: [0, 0, 5] }}>
        <axesHelper args={[5]} />

        {/* <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#000000", 5, 20]} /> */}

        <ambientLight intensity={0.5} />
        <directionalLight intensity={1.5} position={[2, 2, 2]} />

        <AudioSphere
          analyser={analyser}
          audio={audio}
          bassMultiplier={bassMultiplier}
          gain={gain}
          smoothing={smoothing}
   
        />

        {/* <OrbitControls enableDamping /> */}

      </Canvas>
    </>
  );
}
