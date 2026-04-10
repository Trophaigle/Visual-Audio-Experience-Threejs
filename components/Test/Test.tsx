"use client";

import { Canvas, useFrame } from '@react-three/fiber'
import React, { use, useRef } from 'react'

import * as THREE from "three";

import { OrbitControls } from '@react-three/drei';

//tuto React Three Fiber and Drei
//https://www.youtube.com/watch?v=vTfMjI4rVSI
// React Three Fiber (R3F) library, which is built on top of ThreeJS.

const Cube = ({position, size, color} : {position: [number, number, number], size: [number, number, number], color: string}) => {
    
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {

        if(ref.current) {
            ref.current.rotation.x += delta * 0.5; //rotation de 0.5 radians par seconde
            ref.current.rotation.y += delta * 0.5;
            //ref.current.position.z += delta * 0.5;
            ref.current.position.z = Math.sin(state.clock.getElapsedTime()) * 2; //position oscillate entre -1 et 1 en fonction du temps écoulé, pour faire un effet de flottement
        }
        console.log(state) //state: {clock, camera, mouse, viewport, ...} à chaque frame, on peut accéder à ces propriétés pour faire des animations ou des interactions
        //console.log(delta) //delta: difference de temps entre chaque frame, pour que la rotation soit fluide même si le nombre de frames par seconde varie
        console.log(state.clock.getElapsedTime()) //getElapsedTime: temps écoulé depuis le début de l'animation, pour faire des animations basées sur le temps
    })
        
    
    return (
        <mesh position={position} scale={size} ref={ref}>
            <boxGeometry />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

const Sphere = ({position, size, color} : {position: [number, number, number], size: [number, number, number], color: string}) => {
    
    const ref = useRef<THREE.Mesh>(null);

    const [isHovered, setIsHovered] = React.useState(false);
    const [isClicked, setIsClicked] = React.useState(false);

    useFrame((state, delta) => {
        const speed = isHovered ? 2 : 0.5; //vitesse plus rapide quand la souris est dessus

        if(ref.current) {
            ref.current.rotation.x += delta * speed; //rotation de 0.5 radians par seconde
            ref.current.rotation.y += delta * speed;
            //ref.current.position.z += delta * 0.5;
            ref.current.position.z = Math.sin(state.clock.getElapsedTime()) * 2; //position oscillate entre -1 et 1 en fonction du temps écoulé, pour faire un effet de flottement
        }
        console.log(state) //state: {clock, camera, mouse, viewport, ...} à chaque frame, on peut accéder à ces propriétés pour faire des animations ou des interactions
        //console.log(delta) //delta: difference de temps entre chaque frame, pour que la rotation soit fluide même si le nombre de frames par seconde varie
        console.log(state.clock.getElapsedTime()) //getElapsedTime: temps écoulé depuis le début de l'animation, pour faire des animations basées sur le temps
    })
        

    return (
        <mesh position={position} 
        ref={ref} 
        onPointerEnter={(event) => {
            event.stopPropagation();
            setIsHovered(true);
        }}
        onPointerLeave={() => setIsHovered(false)}
        onClick={() => setIsClicked(!isClicked)} //si false alors true, si true alors false, pour faire un toggle
        scale={isClicked ? 1.5 : size}
        >
            <sphereGeometry />
            <meshStandardMaterial color={isHovered ? 'yellow' : color} wireframe={true} />
        </mesh>
    )
}

const Test = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={['#000']} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        
        {/* <group position={[0, -1, 0]}>
            <Cube position={[-1.5, 0, 0]} size={[1, 1, 1]} color="red" />
            <Cube position={[0, 0, 0]} size={[1, 1, 1]} color="green" />
            <Cube position={[1.5, 0, 0]} size={[1, 1, 1]} color="blue" />
        </group> */}

        {/* <Cube position={[0, 0, 0]} size={[1, 1, 1]} color="red" /> */}
        <Sphere position={[0, 0, 0]} size={[1, 1, 1]} color="blue" />
        <OrbitControls />
    </Canvas>   
  )
}

export default Test
