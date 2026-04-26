"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function ApertureBlade({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = angle + t * 0.15;
  });

  const x = Math.cos(angle) * 0.8;
  const y = Math.sin(angle) * 0.8;

  const shape = new THREE.Shape();
  shape.absellipse(0, 0, 0.35, 0.12, 0, Math.PI * 2);

  return (
    <mesh ref={ref} position={[x, y, 0]} rotation={[0, 0, angle]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color="#C9A96E"
        metalness={1}
        roughness={0.05}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ApertureScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
    }
  });

  const bladeCount = 8;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {Array.from({ length: bladeCount }).map((_, i) => (
          <ApertureBlade key={i} index={i} total={bladeCount} />
        ))}

        {/* Central circle */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.3, 64]} />
          <meshStandardMaterial
            color="#060608"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>

        {/* Inner ring */}
        <mesh>
          <torusGeometry args={[0.32, 0.02, 16, 64]} />
          <meshStandardMaterial color="#C9A96E" metalness={1} roughness={0} />
        </mesh>

        {/* Outer ring */}
        <mesh>
          <torusGeometry args={[1.15, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#C9A96E"
            metalness={1}
            roughness={0}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function FloatingAperture() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={3} color="#C9A96E" />
      <pointLight position={[-2, -2, 1]} intensity={1} color="#4466ff" />
      <ApertureScene />
    </Canvas>
  );
}
