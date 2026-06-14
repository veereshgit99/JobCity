import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { project } from "@/lib/projection";

/**
 * Render company buildings clustered around each city center using a spiral layout.
 */
export default function CompanyBuildings({ cities, onCompanyClick, selected }) {
  const buildings = useMemo(() => {
    const out = [];
    for (const c of cities) {
      const [cx, cz] = project(c.lat, c.lng);
      const sorted = [...c.companies].sort((a, b) => b.floors - a.floors);
      sorted.forEach((co, i) => {
        // Spiral placement around city center
        const angle = i * 2.39996; // golden angle
        const r = i === 0 ? 0 : Math.sqrt(i) * 2.2;
        const x = cx + r * Math.cos(angle);
        const z = cz + r * Math.sin(angle);
        out.push({
          ...co,
          city: c.city,
          state: c.state,
          x,
          z,
          height: Math.max(co.floors * 1.6, 1.6),
        });
      });
    }
    return out;
  }, [cities]);

  return (
    <group>
      {buildings.map((b) => (
        <Building
          key={`${b.city}-${b.name}-${b.id}`}
          building={b}
          isSelected={selected && selected.id === b.id && selected.city === b.city}
          onClick={() => onCompanyClick?.(b)}
        />
      ))}
      {/* City label disks */}
      {cities.map((c) => {
        const [x, z] = project(c.lat, c.lng);
        return (
          <group key={`label-${c.city}`} position={[x, 0.02, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.4, 2.7, 32]} />
              <meshBasicMaterial color="#FFB24C" transparent opacity={0.45} />
            </mesh>
            <Html
              position={[0, 0.05, 3.0]}
              center
              distanceFactor={20}
              style={{ pointerEvents: "none" }}
            >
              <div className="label-mono whitespace-nowrap">
                {c.city.toUpperCase()} · {c.total_jobs}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function Building({ building, onClick, isSelected }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = isSelected ? 1.08 : hovered ? 1.04 : 1.0;
    ref.current.scale.x += (target - ref.current.scale.x) * Math.min(1, dt * 8);
    ref.current.scale.z += (target - ref.current.scale.z) * Math.min(1, dt * 8);
  });

  const color = building.color || "#FFB24C";
  const emissive = hovered || isSelected ? color : "#000000";

  return (
    <group position={[building.x, 0, building.z]}>
      <mesh
        ref={ref}
        position={[0, building.height / 2, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry args={[1.6, building.height, 1.6]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered || isSelected ? 0.55 : 0.05}
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
      {hovered && (
        <Html position={[0, building.height + 0.6, 0]} center style={{ pointerEvents: "none" }}>
          <div className="glass rounded-md px-3 py-2 text-xs whitespace-nowrap">
            <div className="font-mono text-[10px] tracking-widest text-white/50">
              {building.city.toUpperCase()}, {building.state}
            </div>
            <div className="font-semibold mt-0.5">{building.name}</div>
            <div className="font-mono text-[11px]" style={{ color: building.color }}>
              {building.floors} {building.floors === 1 ? "JOB" : "JOBS"}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
