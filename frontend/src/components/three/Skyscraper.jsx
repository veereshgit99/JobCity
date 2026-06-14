import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A multi-tier skyscraper rendered as 3 stacked boxes with slight setbacks,
 * a thin emissive window strip on each tier, and a spire on top.
 * Used for any building with a "tall" floor count so the skyline looks
 * dramatic rather than just being one tall plain box.
 */
export default function Skyscraper({
  position = [0, 0, 0],
  height = 10,
  baseWidth = 1.6,
  color = "#FFB24C",
  highlight = false,
  dim = false,
  onClick,
  onPointerOver,
  onPointerOut,
}) {
  const groupRef = useRef();
  const baseRef = useRef();
  const midRef = useRef();
  const topRef = useRef();

  // Split height across the three tiers
  const h1 = height * 0.55;
  const h2 = height * 0.3;
  const h3 = height * 0.15;
  const w1 = baseWidth;
  const w2 = baseWidth * 0.78;
  const w3 = baseWidth * 0.58;

  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const dimmedColor = useMemo(() => baseColor.clone().multiplyScalar(0.18), [baseColor]);
  const hotColor = useMemo(() => new THREE.Color("#ffffff"), []);

  useFrame((_, dt) => {
    const target = highlight ? 1.05 : 1.0;
    if (groupRef.current) {
      groupRef.current.scale.x += (target - groupRef.current.scale.x) * Math.min(1, dt * 8);
      groupRef.current.scale.z += (target - groupRef.current.scale.z) * Math.min(1, dt * 8);
    }
    [baseRef, midRef, topRef].forEach((r) => {
      if (!r.current) return;
      const mat = r.current.material;
      if (!mat) return;
      const targetCol = highlight ? hotColor : dim ? dimmedColor : baseColor;
      mat.color.lerp(targetCol, Math.min(1, dt * 6));
      mat.emissive.lerp(highlight ? hotColor : targetCol, Math.min(1, dt * 6));
      mat.emissiveIntensity = highlight ? 0.7 : dim ? 0.05 : 0.18;
    });
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver?.();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut?.();
        document.body.style.cursor = "";
      }}
    >
      {/* Base */}
      <mesh ref={baseRef} position={[0, h1 / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w1, h1, w1]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} />
      </mesh>
      {/* Mid */}
      <mesh ref={midRef} position={[0, h1 + h2 / 2, 0]} castShadow>
        <boxGeometry args={[w2, h2, w2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.25} />
      </mesh>
      {/* Top */}
      <mesh ref={topRef} position={[0, h1 + h2 + h3 / 2, 0]} castShadow>
        <boxGeometry args={[w3, h3, w3]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, height + 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
      </mesh>
      {/* Window light strip */}
      <mesh position={[0, h1 + h2 / 2, w2 / 2 + 0.001]}>
        <planeGeometry args={[w2 * 0.85, h2 * 0.7]} />
        <meshBasicMaterial color={highlight ? "#ffffff" : color} transparent opacity={highlight ? 0.55 : 0.18} />
      </mesh>
    </group>
  );
}
