"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type FlagSceneProps = {
  progress: number;
  reveal: number;
  active: boolean;
  reducedMotion: boolean;
  onReady?: () => void;
};

function createFlagTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 600;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#FF671F";
  context.fillRect(0, 0, 900, 200);
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 200, 900, 200);
  context.fillStyle = "#046A38";
  context.fillRect(0, 400, 900, 200);

  const cx = 450;
  const cy = 300;
  const radius = 75;
  context.strokeStyle = "#06038D";
  context.lineWidth = 7;
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.stroke();
  context.lineWidth = 3;
  context.fillStyle = "#06038D";
  context.beginPath();
  context.arc(cx, cy, 7, 0, Math.PI * 2);
  context.fill();
  for (let index = 0; index < 24; index += 1) {
    const angle = Math.PI * 2 * index / 24;
    context.beginPath();
    context.moveTo(cx + Math.cos(angle) * 10, cy + Math.sin(angle) * 10);
    context.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export default function FlagScene({ progress, reveal, active, reducedMotion, onReady }: FlagSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const revealRef = useRef(reveal);
  const activeRef = useRef(active);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { revealRef.current = reveal; }, [reveal]);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0.3, 0.1, 8.1);

    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0xadb7ba, metalness: 0.72, roughness: 0.35 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.047, 6.4, 12), poleMaterial);
    pole.position.set(-0.9, -1.05, 0);
    scene.add(pole);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 14), new THREE.MeshStandardMaterial({ color: 0xd2a43f, metalness: 0.72, roughness: 0.25 }));
    finial.position.set(-0.9, 2.2, 0);
    scene.add(finial);
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 5.75, 6), new THREE.MeshBasicMaterial({ color: 0xbcae8b }));
    rope.position.set(-0.81, -1.1, 0.02);
    scene.add(rope);

    const geometry = new THREE.PlaneGeometry(3, 2, 32, 20);
    geometry.translate(1.5, 0, 0);
    const texture = createFlagTexture();
    if (!texture) {
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      return;
    }

    const uniforms = {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uWind: { value: 0.08 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      side: THREE.DoubleSide,
      vertexShader: `
        uniform float uTime;
        uniform float uWind;
        varying vec2 vUv;
        varying float vShade;
        void main() {
          vUv = uv;
          float edge = pow(uv.x, 1.55);
          float broad = sin(uv.x * 6.8 - uTime * 1.7) * 0.09;
          float ripple = sin(uv.x * 15.0 - uTime * 2.5 + uv.y * 3.0) * 0.033;
          float flutter = sin(uv.y * 23.0 + uTime * 3.5) * 0.012;
          float wave = (broad + ripple + flutter) * edge * uWind;
          vec3 displaced = position;
          displaced.z += wave;
          displaced.y += wave * 0.26;
          vShade = 0.92 + wave * 2.4;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        varying float vShade;
        void main() {
          vec4 color = texture2D(uTexture, vUv);
          gl_FragColor = vec4(color.rgb * clamp(vShade, 0.78, 1.08), color.a);
        }
      `,
    });
    const flag = new THREE.Mesh(geometry, material);
    flag.position.set(-0.86, -2.3, 0.05);
    flag.scale.set(0.08, 1, 1);
    scene.add(flag);

    const ambient = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffd39a, 1.8);
    sun.position.set(4, 3, 5);
    scene.add(sun);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let animationFrame = 0;
    let didNotifyReady = false;
    const startedAt = performance.now();
    const render = (now: number) => {
      const currentProgress = progressRef.current;
      const currentReveal = revealRef.current;
      flag.position.y = -2.3 + currentProgress * 3.4;
      flag.scale.x = Math.max(0.075, currentReveal);
      uniforms.uTime.value = (now - startedAt) / 1000;
      uniforms.uWind.value = reducedMotion ? 0.32 : 0.22 + currentProgress * 0.42 + currentReveal * 0.52;
      camera.position.y = reducedMotion ? 0.1 : 0.1 + currentProgress * 0.24;
      camera.position.z = 8.1 - currentProgress * 0.25;
      camera.lookAt(-0.05, -0.1 + currentProgress * 0.18, 0);
      if (activeRef.current || currentReveal < 1) {
        renderer.render(scene, camera);
        if (!didNotifyReady) {
          didNotifyReady = true;
          onReady?.();
        }
      }
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      pole.geometry.dispose();
      poleMaterial.dispose();
      finial.geometry.dispose();
      (finial.material as THREE.Material).dispose();
      rope.geometry.dispose();
      (rope.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onReady, reducedMotion]);

  return <div ref={mountRef} aria-hidden="true" style={{ position: "absolute", zIndex: 1, inset: 0 }} />;
}
