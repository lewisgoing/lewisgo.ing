import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";
import { Canvas } from "@react-three/fiber";
import { Shader, Texture } from "shader-park-core";
import { OrbitControls } from "@react-three/drei";

interface AudioVisualizerProps {
  audioFile: File | null;
  width: string;
  height: string;
}

const AudioVisualizerBox: React.FC<AudioVisualizerProps> = ({
  audioFile,
  height,
  width,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  // Shader
  const shader = new Shader(`
      setStepSize(.8);
      setMaxIterations(40)
      let s = getSpace();
      
      let scale = input(.50, 0, 2)
      let time_scale = input(.5,0,2)
      let torus_width = input(.2,0,1)
      let torus_height = input(.2,0,1)
      let n = vectorContourNoise(s*scale+time*0.4, .05, 6)*.5+.5;
      n = pow(n, vec3(2))
      
      color(n)
      
      metal(3.4);
      setMaxReflections(.01)
      occlusion(-100)
      //displace(.1, 1, 1)
      let conto = getRayDirection().x * 10 * sin(time*time_scale + scale * 1);
      rotateX(PI / 2 + conto);
      
      let col = vec3(0, 1, conto);
      reflectiveColor(0.4, 1, 0.2)
      torus(torus_width,torus_height);
      expand(n.z* (scale / 2) )
      
      reset();  
    `);

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      audio: { value: 0 }, // Will be updated with audio
      scale: { value: 0.5 },
      time_scale: { value: 0.5 },
      torus_width: { value: 0.2 },
      torus_height: { value: 0.2 },
    },
    vertexShader: shader.vertex,
    fragmentShader: shader.fragment,
  });

  useEffect(() => {
    if (!canvasRef.current || !audioFile) return;

    // Audio Setup
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(
      new Audio(URL.createObjectURL(audioFile))
    );
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Three.js Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Geometry

    console.log("geomteoru:", geometry);

    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Render Loop
    const renderLoop = () => {
      requestAnimationFrame(renderLoop);

      analyser.getByteFrequencyData(dataArray);
      const avgAudio = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      material.uniforms.audio.value = avgAudio / 255;

      material.uniforms.time.value += 0.01;

      renderer.render(scene, camera);
    };

    renderLoop();
  }, [audioFile]);

  // const cube = new THREE.Mesh(geometry, material);
  return (
    <div className="rounded-3xl object-cover z-[2] flex items-center justify-center p-4">
      <Canvas ref={canvasRef} style={{ width, height }}>
        {/* <OrbitControls /> Optional for interactivity */}
        <mesh geometry={geometry} material={material} />
      </Canvas>
    </div>
  );
};

export default AudioVisualizerBox;
