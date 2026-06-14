import { useMemo } from "react";
import * as THREE from "three";
import { USA_OUTLINE, project } from "@/lib/projection";

/**
 * Extruded USA landmass + grid lines for the Jobs City scene.
 */
export default function USAMap({ accent = "#FFB24C" }) {
  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    USA_OUTLINE.forEach(([lng, lat], i) => {
      const [x, z] = project(lat, lng);
      // We need (x, y) in 2D shape space where y == z in 3D — three.js will rotate the shape
      if (i === 0) shape.moveTo(x, -z);
      else shape.lineTo(x, -z);
    });
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.25,
      bevelThickness: 0.25,
    });
  }, []);

  return (
    <group>
      <mesh
        geometry={geom}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.6, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={"#2A1F1D"} roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Top emissive trim */}
      <mesh
        geometry={geom}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
      >
        <meshBasicMaterial color={accent} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}
