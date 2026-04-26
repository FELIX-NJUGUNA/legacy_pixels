"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Sparkles,
  Environment,
  Image as DreiImage,
} from "@react-three/drei";
import * as THREE from "three";

/* ══════════════════════════════════════════════
   UNSPLASH IMAGE CATALOG
══════════════════════════════════════════════ */
const IMAGES = [
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85", label: "Mountain Reverie" },
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85", label: "Sacred Vows" },
  { url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=85", label: "Craft & Detail" },
  { url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=85", label: "Dust & Motion" },
  { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=85", label: "Bloom Story" },
  { url: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900&q=85", label: "Infinite Horizon" },
  { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85", label: "Forest Cathedral" },
  { url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&q=85", label: "Frame & Light" },
];

/* ══════════════════════════════════════════════
   SKEUOMORPHIC PHOTO PANEL
══════════════════════════════════════════════ */
function PhotoPanel({
  url,
  position,
  rotation,
  scale = 1,
  scrollY,
  parallaxFactor,
  index,
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  scrollY: React.MutableRefObject<number>;
  parallaxFactor: number;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const hoverProgress = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    const parallaxY = scrollY.current * parallaxFactor * 0.008;
    const parallaxZ = scrollY.current * parallaxFactor * 0.003;

    const floatY = Math.sin(t * 0.4 + index * 1.3) * 0.08;
    const floatX = Math.cos(t * 0.28 + index * 0.9) * 0.04;
    const sway   = Math.sin(t * 0.18 + index * 0.7) * 0.012;

    groupRef.current.position.set(
      position[0] + floatX,
      position[1] + floatY - parallaxY,
      position[2] - parallaxZ
    );
    groupRef.current.rotation.set(
      rotation[0] + Math.cos(t * 0.15 + index) * 0.015,
      rotation[1] + sway,
      rotation[2]
    );

    hoverProgress.current += ((hovered ? 1 : 0) - hoverProgress.current) * 0.08;
    const s = scale * (1 + hoverProgress.current * 0.08);
    groupRef.current.scale.setScalar(s);
  });

  const W = 1.72, H = 1.22;

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Drop shadow */}
      <mesh position={[0.04, -0.06, -0.18]}>
        <planeGeometry args={[W + 0.12, H + 0.12]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.28} roughness={1} />
      </mesh>

      {/* Brushed metal frame */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[W, H, 0.1]} />
        <meshStandardMaterial
          color="#b8934a"
          metalness={0.95}
          roughness={0.08}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Corner rivets */}
      {[[-W/2+0.08, H/2-0.08], [W/2-0.08, H/2-0.08], [-W/2+0.08, -H/2+0.08], [W/2-0.08, -H/2+0.08]].map(([cx, cy], i) => (
        <mesh key={i} position={[cx, cy, -0.005]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
          <meshStandardMaterial color="#E8D5A3" metalness={1} roughness={0.05} />
        </mesh>
      ))}

      {/* Inner bevel */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[W - 0.1, H - 0.1, 0.06]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Mat board */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[W - 0.14, H - 0.14, 0.025]} />
        <meshStandardMaterial color="#f2ede4" metalness={0} roughness={0.9} />
      </mesh>

      {/* Photo */}
      <DreiImage
        url={url}
        position={[0, 0, 0.025]}
        scale={[W - 0.22, H - 0.22, 1]}
        transparent
      />

      {/* Glassmorphism glare */}
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[W - 0.14, H - 0.14]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0}
          transparent
          opacity={hovered ? 0.05 : 0.11}
        />
      </mesh>

      {/* Diagonal specular streak */}
      <mesh position={[-0.18, 0.22, 0.055]} rotation={[0, 0, -0.6]}>
        <planeGeometry args={[0.28, 0.9]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={hovered ? 0.03 : 0.08} roughness={0} metalness={0} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════
   GLASSMORPHISM FLOATING CARD
══════════════════════════════════════════════ */
function GlassCard({
  position,
  size,
  scrollY,
  parallaxFactor,
  tiltX = 0,
  tiltY = 0,
}: {
  position: [number, number, number];
  size: [number, number];
  scrollY: React.MutableRefObject<number>;
  parallaxFactor: number;
  tiltX?: number;
  tiltY?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const py = scrollY.current * parallaxFactor * 0.006;
    ref.current.position.y = position[1] - py + Math.sin(t * 0.3 + parallaxFactor) * 0.06;
    ref.current.position.x = position[0] + Math.sin(t * 0.2 + parallaxFactor * 2) * 0.04;
  });

  return (
    <mesh ref={ref} position={position} rotation={[tiltX, tiltY, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color="#C9A96E"
        transparent
        opacity={0.06}
        roughness={0.1}
        metalness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════
   FEATURED LARGE PANEL
══════════════════════════════════════════════ */
function FeaturedPanel({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % IMAGES.length), 4000);
    return () => clearInterval(id);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const py = scrollY.current * 0.004;
    groupRef.current.position.y = 0.4 - py + Math.sin(t * 0.22) * 0.06;
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, 0.4, -1.5]}>
      {/* Glow behind frame */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshStandardMaterial color="#E8610A" transparent opacity={0.07} emissive="#E8610A" emissiveIntensity={0.4} />
      </mesh>

      {/* Outer frame */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[3.2, 2.3, 0.22]} />
        <meshStandardMaterial color="#8B6030" metalness={1} roughness={0.08} envMapIntensity={2} />
      </mesh>

      {/* Inset bevel */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[2.96, 2.08, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Mat */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[2.88, 2.0, 0.03]} />
        <meshStandardMaterial color="#ede8e0" roughness={0.95} />
      </mesh>

      {/* Photo */}
      <DreiImage
        url={IMAGES[idx].url}
        position={[0, 0, 0.04]}
        scale={[2.78, 1.9, 1]}
        transparent
      />

      {/* Glass glare */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[2.88, 2.0]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.08} roughness={0} metalness={0.2} />
      </mesh>

      {/* Diagonal highlight */}
      <mesh position={[-0.5, 0.45, 0.075]} rotation={[0, 0, -0.5]}>
        <planeGeometry args={[0.4, 2.1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.07} roughness={0} />
      </mesh>

      {/* Corner studs */}
      {[[-1.45, 0.98], [1.45, 0.98], [-1.45, -0.98], [1.45, -0.98]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#E8D5A3" metalness={1} roughness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════
   ORBITAL RINGS
══════════════════════════════════════════════ */
function OrbitalRings({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scroll = scrollY.current;
    if (r1.current) { r1.current.rotation.x = t * 0.18 + scroll * 0.001; r1.current.rotation.y = t * 0.12; }
    if (r2.current) { r2.current.rotation.x = -t * 0.14 + scroll * 0.0008; r2.current.rotation.z = t * 0.22; }
    if (r3.current) { r3.current.rotation.y = t * 0.28 + scroll * 0.0012; r3.current.rotation.z = -t * 0.1; }
  });

  return (
    <group>
      <mesh ref={r1}>
        <torusGeometry args={[5.5, 0.012, 24, 200]} />
        <meshStandardMaterial color="#C9A96E" metalness={1} roughness={0} transparent opacity={0.18} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[7.0, 0.007, 24, 200]} />
        <meshStandardMaterial color="#E8D5A3" metalness={1} roughness={0} transparent opacity={0.1} />
      </mesh>
      <mesh ref={r3} rotation={[0.2, Math.PI / 4, Math.PI / 5]}>
        <torusGeometry args={[4.2, 0.016, 24, 200]} />
        <meshStandardMaterial color="#E8610A" metalness={1} roughness={0} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════
   CAMERA RIG
══════════════════════════════════════════════ */
function CameraRig({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0.5, z: 9 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 1.6;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 1.0;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const scroll = scrollY.current;
    const targetZ = 9 + scroll * 0.005;
    const targetY = 0.5 - scroll * 0.002;

    cur.current.x += (mouse.current.x * 1.2 - cur.current.x) * 0.04;
    cur.current.y += (targetY + mouse.current.y * 0.6 - cur.current.y) * 0.04;
    cur.current.z += (targetZ - cur.current.z) * 0.04;

    camera.position.set(cur.current.x, cur.current.y, cur.current.z);
    camera.lookAt(0, 0.2, -1);
  });

  return null;
}

/* ══════════════════════════════════════════════
   DUST FIELD
══════════════════════════════════════════════ */
function DustField({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const count = 500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
  }

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    ref.current.rotation.x = scrollY.current * 0.0003;
    ref.current.position.y = -scrollY.current * 0.003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C9A96E" size={0.04} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

/* ══════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════ */
function Scene({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const panels = [
    { img: IMAGES[0], pos: [-5.0,  1.4, -2.8] as [number,number,number], rot: [0,  0.38,  0.03] as [number,number,number], scale: 0.88, pf: 0.6 },
    { img: IMAGES[1], pos: [ 4.8,  1.0, -3.0] as [number,number,number], rot: [0, -0.34, -0.02] as [number,number,number], scale: 0.90, pf: 0.8 },
    { img: IMAGES[2], pos: [-3.8,  2.6, -4.5] as [number,number,number], rot: [0.04, 0.18, 0.04] as [number,number,number], scale: 0.78, pf: 1.2 },
    { img: IMAGES[3], pos: [ 3.6, -0.4, -3.8] as [number,number,number], rot: [0.06,-0.26,-0.04] as [number,number,number], scale: 0.82, pf: 1.0 },
    { img: IMAGES[4], pos: [-5.6, -0.8, -4.2] as [number,number,number], rot: [-0.02, 0.5,  0.05] as [number,number,number], scale: 0.74, pf: 1.4 },
    { img: IMAGES[5], pos: [ 5.4, -1.2, -4.8] as [number,number,number], rot: [ 0.04,-0.48, 0.02] as [number,number,number], scale: 0.76, pf: 1.6 },
    { img: IMAGES[6], pos: [-2.0,  3.4, -5.5] as [number,number,number], rot: [ 0.08, 0.1,  0.02] as [number,number,number], scale: 0.70, pf: 1.8 },
    { img: IMAGES[7], pos: [ 2.2, -2.0, -6.0] as [number,number,number], rot: [ 0.1, -0.1,  0.04] as [number,number,number], scale: 0.68, pf: 2.0 },
  ];

  return (
    <>
      <CameraRig scrollY={scrollY} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[6, 8, 5]} intensity={1.4} color="#f5e6d3" castShadow />
      <directionalLight position={[-5, 2, 3]} intensity={0.5} color="#7799ff" />
      <directionalLight position={[0, 4, -6]} intensity={0.9} color="#C9A96E" />
      <pointLight position={[3, 2, 2]}  intensity={0.6} color="#E8610A" distance={12} />
      <pointLight position={[-3, 1, 2]} intensity={0.4} color="#6688ff" distance={10} />
      <pointLight position={[0, -2, 3]} intensity={0.3} color="#ffffff"  distance={8} />

      <Environment preset="sunset" background={false} />

      <FeaturedPanel scrollY={scrollY} />

      {panels.map((p, i) => (
        <PhotoPanel
          key={i}
          index={i}
          url={p.img.url}
          position={p.pos}
          rotation={p.rot}
          scale={p.scale}
          scrollY={scrollY}
          parallaxFactor={p.pf}
        />
      ))}

      <GlassCard position={[-2.5,  2.0, -1.5]} size={[1.8, 2.4]} scrollY={scrollY} parallaxFactor={0.5} tiltY={0.4} />
      <GlassCard position={[ 2.8, -1.5, -1.8]} size={[2.0, 1.4]} scrollY={scrollY} parallaxFactor={0.7} tiltY={-0.35} />
      <GlassCard position={[ 0.0,  3.0, -3.0]} size={[4.0, 0.8]} scrollY={scrollY} parallaxFactor={1.1} tiltX={0.2} />

      <OrbitalRings scrollY={scrollY} />
      <DustField scrollY={scrollY} />
      <Sparkles count={300} scale={16} size={0.5} speed={0.15} color="#C9A96E" opacity={0.2} />
      <Sparkles count={120} scale={10} size={0.2} speed={0.08} color="#ffffff"  opacity={0.1} />
    </>
  );
}

/* ══════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════ */
export default function HeroScene() {
  const scrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="absolute inset-0" style={{ zIndex: 1 }}>
      <div
        className="absolute inset-y-0 left-0 w-[55%] pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.5) 60%, transparent 100%)",
          zIndex: 10,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(6,6,8,1) 0%, transparent 100%)",
          zIndex: 10,
        }}
      />

      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        style={{
          background: "radial-gradient(ellipse at 65% 45%, #12090a 0%, #060608 70%)",
        }}
        shadows
      >
        <Scene scrollY={scrollY} />
      </Canvas>
    </div>
  );
}