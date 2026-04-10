//canvas 3D
"use client";

import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from './Experience'

export default function Scene() {
  return (
    <Canvas>
        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <color attach="background" args={['#000']} />
        <Experience />
    </Canvas>
  );
}


