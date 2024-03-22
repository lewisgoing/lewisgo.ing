// AudioReactiveShader.tsx
import { useEffect, useRef } from 'react';
import { AudioListener, Audio, AudioLoader, AudioAnalyser, PerspectiveCamera, Scene, WebGLRenderer, Color, Clock, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createSculptureWithGeometry } from 'shader-park-core';
import { SphereGeometry } from 'three';
import { spCode } from '../assets/spCode'; // Adjust the path to where your sp-code function is located

const AudioReactiveShader = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.5;

    const renderer = new WebGLRenderer({ antialias: true, transparent: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new Color(1, 1, 1), 0);
    containerRef.current.appendChild(renderer.domElement);

    const clock = new Clock();

    // Audio setup
    const listener = new AudioListener();
    camera.add(listener);
    const sound = new Audio(listener);
    const audioLoader = new AudioLoader();
    const analyser = new AudioAnalyser(sound, 32);

    let state = {
      mouse: new Vector3(),
      currMouse: new Vector3(),
      pointerDown: 0.0,
      currPointerDown: 0.0,
      audio: 0.0,
      currAudio: 0.0,
      time: 0.0,
    };

    // Load and play audio
    audioLoader.load('./test.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });

    // Create Shader Park Sculpture
    const geometry = new SphereGeometry(2, 45, 45);
    const mesh = createSculptureWithGeometry(geometry, spCode(), () => ({
      time: state.time,
      pointerDown: state.pointerDown,
      audio: state.audio,
      mouse: state.mouse,
      _scale: 0.5,
    }));
    scene.add(mesh);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.5;

    // Resize handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Pointer events
    const pointerMoveHandler = (event: MouseEvent) => {
      state.currMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      state.currMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const pointerDownHandler = () => (state.currPointerDown = 1.0);
    const pointerUpHandler = () => (state.currPointerDown = 0.0);

    window.addEventListener('pointermove', pointerMoveHandler);
    window.addEventListener('pointerdown', pointerDownHandler);
    window.addEventListener('pointerup', pointerUpHandler);

    // Animation loop
    const render = () => {
      requestAnimationFrame(render);
      state.time += clock.getDelta();
      controls.update();

      if (analyser) {
        state.currAudio +=
          Math.pow((analyser.getFrequencyData()[2] / 255) * 0.81, 8) +
          clock.getDelta() * 0.5;
        state.audio = 0.2 * state.currAudio + 0.8 * state.audio;
      }

      state.pointerDown = 0.1 * state.currPointerDown + 0.9 * state.pointerDown;
      state.mouse.lerp(state.currMouse, 0.05);

      renderer.render(scene, camera);
    };
    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('pointermove', pointerMoveHandler);
      window.removeEventListener('pointerdown', pointerDownHandler);
      window.removeEventListener('pointerup', pointerUpHandler);

      // Stop audio to prevent errors on component unmount
      sound.stop();

      // Remove renderer and controls to clean up memory
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
        <p>Audio Reactive Shader</p>
      {/* Placeholder for any UI elements like a play button or indicators */}
    </div>
  );
};

export default AudioReactiveShader;

