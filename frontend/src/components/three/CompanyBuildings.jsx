import { useMemo, useRef, useState } from "react";
import { Html, Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Skyscraper from "./Skyscraper";
import { project } from "@/lib/projection";

const SKYSCRAPER_FLOOR_THRESHOLD = 8;

export default function CompanyBuildings({ cities, onCompanyClick, selected, query = "" }) {
  const [hoverKey, setHoverKey] = useState(null);

  const buildings = useMemo(() => {
    const out = [];
    for (const c of cities) {
      const [cx, cz] = project(c.lat, c.lng);
      const sorted = [...c.companies].sort((a, b) => b.floors - a.floors);
      sorted.forEach((co, i) => {
        const angle = i * 2.39996;
        const r = i === 0 ? 0 : Math.sqrt(i) * 2.2;
        out.push({
          ...co,
          city: c.city,
          state: c.state,
          x: cx + r * Math.cos(angle),
          z: cz + r * Math.sin(angle),
          height: Math.max(co.floors * 1.6, 1.6),
          key: `${c.city}-${co.id}-${i}`,
        });
      });
    }
    return out;
  }, [cities]);

  const q = (query || "").trim().toLowerCase();
  const matchesQuery = (b) =>
    !q ||
    b.name.toLowerCase().includes(q) ||
    b.city.toLowerCase().includes(q) ||
    b.state.toLowerCase().includes(q);

  const tall = buildings.filter((b) => b.floors >= SKYSCRAPER_FLOOR_THRESHOLD);
  const regular = buildings.filter((b) => b.floors < SKYSCRAPER_FLOOR_THRESHOLD);

  const hovered = buildings.find((b) => b.key === hoverKey);

  return (
    <group>
      {/* Regular (short) buildings — single InstancedMesh */}
      <Instances limit={Math.max(regular.length, 8)} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1, 1.6]} />
        <meshStandardMaterial roughness={0.45} metalness={0.15} />
        {regular.map((b) => (
          <BuildingInstance
            key={b.key}
            b={b}
            hovered={hoverKey === b.key}
            selected={selected && selected.id === b.id && selected.city === b.city}
            dimmed={q ? !matchesQuery(b) : false}
            onPointerOver={() => setHoverKey(b.key)}
            onPointerOut={() => setHoverKey((cur) => (cur === b.key ? null : cur))}
            onClick={() => onCompanyClick?.(b)}
          />
        ))}
      </Instances>

      {/* Skyscrapers — distinctive multi-tier geometry */}
      {tall.map((b) => (
        <Skyscraper
          key={b.key}
          position={[b.x, 0, b.z]}
          height={b.height}
          baseWidth={1.8}
          color={b.color}
          highlight={
            hoverKey === b.key ||
            (selected && selected.id === b.id && selected.city === b.city)
          }
          dim={q ? !matchesQuery(b) : false}
          onClick={() => onCompanyClick?.(b)}
          onPointerOver={() => setHoverKey(b.key)}
          onPointerOut={() => setHoverKey((cur) => (cur === b.key ? null : cur))}
        />
      ))}

      {hovered && (
        <Html
          position={[hovered.x, hovered.height + 1.2, hovered.z]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div className="glass rounded-md px-3 py-2 text-xs whitespace-nowrap">
            <div className="font-mono text-[10px] tracking-widest text-white/50">
              {hovered.city.toUpperCase()}, {hovered.state}
            </div>
            <div className="font-semibold mt-0.5">{hovered.name}</div>
            <div className="font-mono text-[11px]" style={{ color: hovered.color }}>
              {hovered.floors} {hovered.floors === 1 ? "JOB" : "JOBS"}
              {hovered.floors >= SKYSCRAPER_FLOOR_THRESHOLD && " · SKYSCRAPER"}
            </div>
          </div>
        </Html>
      )}

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

function BuildingInstance({ b, hovered, selected, dimmed, onPointerOver, onPointerOut, onClick }) {
  const ref = useRef();
  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const color = useMemo(() => new THREE.Color(b.color || "#FFB24C"), [b.color]);
  const dimmedColor = useMemo(() => color.clone().multiplyScalar(0.2), [color]);
  const highlightColor = useMemo(() => new THREE.Color("#ffffff"), []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const t = selected ? 1.12 : hovered ? 1.06 : 1.0;
    targetScale.set(t, b.height, t);
    ref.current.scale.lerp(targetScale, Math.min(1, dt * 8));
    if (hovered || selected) ref.current.color.lerp(highlightColor, Math.min(1, dt * 6));
    else if (dimmed) ref.current.color.lerp(dimmedColor, Math.min(1, dt * 4));
    else ref.current.color.lerp(color, Math.min(1, dt * 6));
  });

  return (
    <Instance
      ref={ref}
      position={[b.x, b.height / 2, b.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver?.();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut?.();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    />
  );
}
