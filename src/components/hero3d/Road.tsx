import { useMemo } from "react";

/**
 * Procedural asphalt road segment with painted lane markings,
 * shoulders, grass and sidewalk strips. Tiled deeply along Z.
 */
const Road = ({ length = 200 }: { length?: number }) => {
  const dashes = useMemo(() => Array.from({ length: Math.floor(length / 3) }), [length]);

  return (
    <group>
      {/* Grass plane far wide */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -length / 2]} receiveShadow>
        <planeGeometry args={[120, length]} />
        <meshStandardMaterial color="#2f6d3a" roughness={1} />
      </mesh>

      {/* Asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -length / 2]} receiveShadow>
        <planeGeometry args={[8, length]} />
        <meshStandardMaterial color="#1e2430" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Subtle sheen overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -length / 2]}>
        <planeGeometry args={[8, length]} />
        <meshBasicMaterial color="#2a3140" transparent opacity={0.18} />
      </mesh>

      {/* Sidewalks */}
      {[-5.2, 5.2].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, -length / 2]} receiveShadow>
          <planeGeometry args={[1.6, length]} />
          <meshStandardMaterial color="#9aa3ad" roughness={0.9} />
        </mesh>
      ))}

      {/* Solid edge lines */}
      {[-3.85, 3.85].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, -length / 2]}>
          <planeGeometry args={[0.12, length]} />
          <meshStandardMaterial color="#f1f5f9" emissive="#f1f5f9" emissiveIntensity={0.1} />
        </mesh>
      ))}

      {/* Dashed center line */}
      {dashes.map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.013, -i * 3 - 1]}
        >
          <planeGeometry args={[0.16, 1.6]} />
          <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

export default Road;
