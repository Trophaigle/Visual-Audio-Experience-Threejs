# Music Reactive Sphere

An interactive audio-reactive visualization built with **React**, **Three.js**, and the **Web Audio API**.

The project transforms music into a real-time 3D experience where different visual systems react independently to frequency ranges, creating a coherent relationship between sound, motion, lighting, and camera effects.

## Image



## Live Demo

🌐 **Try it here:**
[Music Reactive Sphere](https://visual-audio-experience-threejs.vercel.app/)

---

## Features

### Audio Analysis

* Real-time frequency analysis using the Web Audio API
* Separate handling of bass and treble frequencies
* Dynamic visual feedback based on music intensity
* Synchronization between audio playback and visual systems

### Dual Sphere System

#### Inner Sphere

The inner sphere primarily reacts to:

* High frequencies
* Musical rhythm
* Intensity peaks

Effects include:

* Dynamic radius deformation
* Gradient color transitions
* Smooth procedural animations

#### Outer Particle Sphere

The outer sphere is composed of particles and primarily reacts to:

* Low frequencies
* Bass energy

This creates a visual distinction similar to the relationship between a tweeter and a subwoofer, producing a more readable and coherent audio visualization.

### Timeline Events

Specific musical moments trigger predefined events:

* Drop effects
* Radius boosts
* Visual transitions
* Camera movements

These events are synchronized through a timeline system to enhance important sections of the music.

### User Interaction

Users can freely explore the scene:

* Orbit around the visualization
* Zoom in and out
* Pause music
* Resume playback
* Seek through the track
* Skip forward and backward

All visual systems remain synchronized with the current playback position.

### Visual Effects

* Bloom post-processing
* Dynamic lighting
* Real-time shaders
* Particle rendering
* Smooth camera transitions

---

## Technologies

* React
* TypeScript
* Three.js
* React Three Fiber
* Web Audio API
* Postprocessing

---

## Project Goals

This project was created to explore:

* Real-time audio analysis
* Procedural animation
* Interactive 3D graphics
* Music-driven visual systems
* Synchronization between audio and rendering pipelines
* Modern web graphics development

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Trophaigle/Visual-Audio-Experience-Threejs.git
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Future Improvements

* Additional visualization modes
* Advanced beat detection
* User-uploaded audio files
* Mobile optimization
* More post-processing effects
* Custom visual themes

---

## License

MIT License

