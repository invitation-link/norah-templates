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

function createBundleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 90;
  canvas.height = 540;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#FF671F"; context.fillRect(0, 0, 90, 180);
  context.fillStyle = "#F7F3E8"; context.fillRect(0, 180, 90, 180);
  context.fillStyle = "#046A38"; context.fillRect(0, 360, 90, 180);
  const shade = context.createLinearGradient(0, 0, 90, 0);
  shade.addColorStop(0, "rgba(0,0,0,.36)"); shade.addColorStop(.3, "rgba(255,255,255,.2)"); shade.addColorStop(.62, "rgba(0,0,0,.18)"); shade.addColorStop(1, "rgba(255,255,255,.14)");
  context.fillStyle = shade; context.fillRect(0, 0, 90, 540);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
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

    const narrowScreen = window.matchMedia("(max-width: 600px)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: narrowScreen ? "default" : "high-performance" });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrowScreen ? 1.25 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
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
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 5.72, 6), new THREE.MeshBasicMaterial({ color: 0x756142 }));
    rope.position.set(-0.845, -1.12, 0.025);
    scene.add(rope);

    const geometry = new THREE.PlaneGeometry(3, 2, narrowScreen ? 22 : 32, narrowScreen ? 14 : 20);
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
    flag.scale.set(0.01, 1, 1);
    flag.visible = false;
    scene.add(flag);

    const bundleTexture = createBundleTexture();
    if (!bundleTexture) {
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      return;
    }
    const bundleGeometry = new THREE.PlaneGeometry(0.1, 1.25, 2, 8);
    const bundlePosition = bundleGeometry.attributes.position;
    for (let index = 0; index < bundlePosition.count; index += 1) bundlePosition.setX(index, bundlePosition.getX(index) + (index % 3 - 1) * 0.018);
    const bundleMaterial = new THREE.MeshStandardMaterial({ map: bundleTexture, side: THREE.DoubleSide, roughness: 0.82 });
    const bundle = new THREE.Mesh(bundleGeometry, bundleMaterial);
    bundle.position.set(-0.84, -1.88, 0.055);
    bundle.rotation.z = -0.035;
    scene.add(bundle);

    const ambient = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffd39a, 1.8);
    sun.position.set(4, 3, 5);
    scene.add(sun);

    let flagWidthScale = 1;
    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      flagWidthScale = camera.aspect < 0.7 ? 0.72 : 1;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let animationFrame = 0;
    let idleTimer = 0;
    let didNotifyReady = false;
    const startedAt = performance.now();
    const render = (now: number) => {
      const currentProgress = progressRef.current;
      const currentReveal = revealRef.current;
      flag.position.y = -2.3 + currentProgress * 3.4 + (narrowScreen ? currentProgress * 0.42 : 0);
      flag.scale.set(Math.max(0.01, currentReveal) * flagWidthScale, flagWidthScale, 1);
      flag.visible = currentReveal > 0.025;
      bundle.position.y = -1.88 + currentProgress * 3.4;
      bundle.scale.y = flagWidthScale;
      bundle.visible = currentReveal <= 0.12;
      uniforms.uTime.value = (now - startedAt) / 1000;
      uniforms.uWind.value = reducedMotion ? 0 : 0.22 + currentProgress * 0.42 + currentReveal * 0.52;
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
      if (document.hidden || (!activeRef.current && currentReveal >= 1)) {
        idleTimer = window.setTimeout(() => { animationFrame = requestAnimationFrame(render); }, 350);
      } else {
        animationFrame = requestAnimationFrame(render);
      }
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(idleTimer);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      bundleTexture.dispose();
      pole.geometry.dispose();
      poleMaterial.dispose();
      finial.geometry.dispose();
      (finial.material as THREE.Material).dispose();
      rope.geometry.dispose();
      (rope.material as THREE.Material).dispose();
      bundleGeometry.dispose();
      bundleMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [onReady, reducedMotion]);

  return <div ref={mountRef} aria-hidden="true" style={{ position: "absolute", zIndex: 1, inset: 0, pointerEvents: "none" }} />;
}
