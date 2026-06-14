import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EXP_COLORS } from "@/lib/colors";

const SPACING = 2.4;

export default function ApplicantBuildings({ applicants, selectedIds = [], onClick, highlightId }) {
  return (
    <group>
      {applicants.map((a) => (
        <ApplicantBuilding
          key={a.id}
          a={a}
          isSelected={selectedIds.includes(a.id)}
          isHighlighted={highlightId === a.id}
          onClick={() => onClick?.(a)}
        />
      ))}
    </group>
  );
}

function ApplicantBuilding({ a, isSelected, isHighlighted, onClick }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const height = Math.max(a.floors * 0.55, 0.55);
  const x = a.grid_x * SPACING;
  const z = a.grid_z * SPACING;
  const base = EXP_COLORS[a.experience_level] || EXP_COLORS.entry;
  const accent = isHighlighted ? "#FF007F" : isSelected ? "#00FFCC" : base;

  useFrame((_, dt) => {
    if (!ref.current) return;
    const t = isHighlighted ? 1.15 : isSelected ? 1.08 : hovered ? 1.04 : 1.0;
    ref.current.scale.x += (t - ref.current.scale.x) * Math.min(1, dt * 8);
    ref.current.scale.z += (t - ref.current.scale.z) * Math.min(1, dt * 8);
  });

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={ref}
        position={[0, height / 2, 0]}
        castShadow
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
        <boxGeometry args={[1.3, height, 1.3]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={hovered || isSelected || isHighlighted ? 0.7 : 0.18}
          roughness={0.3}
          metalness={0.45}
        />
      </mesh>
      {/* Antenna for github */}
      {a.has_github && (
        <mesh position={[0, height + 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 6]} />
          <meshStandardMaterial color="#00FFCC" emissive="#00FFCC" emissiveIntensity={0.8} />
        </mesh>
      )}
      {hovered && (
        <Html position={[0, height + 1.2, 0]} center style={{ pointerEvents: "none" }}>
          <div className="glass rounded-md px-3 py-2 text-xs whitespace-nowrap">
            <div className="font-mono text-[10px] tracking-widest text-white/50">
              {a.experience_level.toUpperCase()}
            </div>
            <div className="font-semibold">{a.display_name}</div>
            <div className="font-mono text-[11px] text-[#00FFCC]">
              {a.floors} {a.floors === 1 ? "APPLICATION" : "APPLICATIONS"}
            </div>
            {a.has_github && (
              <div className="font-mono text-[10px] text-white/50 mt-0.5">
                ⌁ {a.github_commits_30d} commits / 30d
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
