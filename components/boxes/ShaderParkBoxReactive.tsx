// ShaderParkReactiveBox.tsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dynamic from "next/dynamic";
import { spCode } from "./spCode"; // Adjust the import path based on your directory structure

const createSculptureWithGeometry = dynamic(
  () =>
    import("shader-park-core").then((mod) => mod.createSculptureWithGeometry),
  { ssr: false }
);

const ShaderParkReactiveBox = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  let sound;

  const handlePlay = () => {
    if (isAudioLoaded) {
      sound.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (!mountRef.current) {console.log("mountRef.current = null/false")}   
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2; // Adjust the z position as needed to fit the shader sculpture

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("./whatever.mp3", (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      // if (isPlaying) sound.play();
      setIsAudioLoaded(true);
      console.log(sound, isAudioLoaded);
    });

    const analyser = new THREE.AudioAnalyser(sound, 32);

    const spCodeString = spCode(analyser.getAverageFrequency());

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.5;

    function onDivResize() {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      } else {
        console.log("onDivResize: mountRef.current is null")
      }
    }
    window.addEventListener("resize", onDivResize);

    const render = () => {
      requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.removeEventListener("resize", onDivResize);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div
        className="w-full h-full flex flex-row"
        style={{ border: "1px solid red" }}
      >
        <div style={{ border: "1px solid red" }}>
          {" "}
          <button
            className="button"
            onClick={() => setIsPlaying(true)}
            style={{ position: "absolute", zIndex: 1, border: "1px solid red" }}
          >
            Play Audio
          </button>
        </div>

        <div
          ref={mountRef}
          className="w-1/2 h-full"
          style={{ border: "1px solid red" }}
        />
      </div>
    </>
  );
};

export default ShaderParkReactiveBox;
