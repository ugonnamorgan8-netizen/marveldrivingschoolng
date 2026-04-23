import { useMemo } from "react";

/**
 * Roadside scenery: trees, street lamps, small buildings, grass tufts.
 * All procedurally placed deterministically along Z.
 */

const Tree = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.6, 0]}>
      <cylinderGeometry args={[0.08, 0.12, 1.2, 8]} />
      <meshStandardMaterial color="#5b3a1d" roughness={0.95} />
    </mesh>
    <mesh castShadow position={[0, 1.5, 0]}>
      <coneGeometry args={[0.7, 1.6, 10]} />
      <meshStandardMaterial color="#1f7a3a" roughness={0.85} />
    </mesh>
    <mesh castShadow position={[0, 2.1, 0]}>
      <coneGeometry args={[0.5, 1.1, 10]} />
      <meshStandardMaterial color="#26904a" roughness={0.85} />
    </mesh>
  </group>
);

const Lamp = ({ position, side }: { position: [number, number, number]; side: -1 | 1 }) => (
  <group position={position}>
    <mesh castShadow position={[0, 1.4, 0]}>
      <cylinderGeometry args={[0.05, 0.06, 2.8, 10]} />
      <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
    </mesh>
    <mesh castShadow position={[side * 0.45, 2.7, 0]}>
      <boxGeometry args={[0.9, 0.08, 0.12]} />
      <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
    </mesh>
    <mesh position={[side * 0.85, 2.62, 0]}>
      <sphereGeometry args={[0.13, 12, 12]} />
      <meshStandardMaterial color="#fff4c2" emissive="#fde68a" emissiveIntensity={1.2} />
    </mesh>
    <pointLight position={[side * 0.85, 2.5, 0]} intensity={0.6} distance={6} color="#fde68a" />
  </group>
);

const Building = ({ position, w, h, d, color }: { position: [number, number, number]; w: number; h: number; d: number; color: string }) => (
  <group position={position}>
    <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
    {/* Roof */}
    <mesh castShadow position={[0, h + 0.05, 0]}>
      <boxGeometry args={[w + 0.1, 0.1, d + 0.1]} />
      <meshStandardMaterial color="#374151" roughness={0.8} />
    </mesh>
    {/* Windows */}
    {Array.from({ length: Math.floor(h) }).map((_, row) =>
      Array.from({ length: Math.floor(w) }).map((_, col) => (
        <mesh
          key={`${row}-${col}`}
          position={[-w / 2 + 0.5 + col, 0.6 + row, d / 2 + 0.01]}
        >
          <planeGeometry args={[0.35, 0.45]} />
          <meshStandardMaterial color="#bae6fd" emissive="#7dd3fc" emissiveIntensity={0.25} />
        </mesh>
      ))
    )}
  </group>
);

const Scenery = ({ length = 200 }: { length?: number }) => {
  const items = useMemo(() => {
    const list: { type: "tree" | "lamp" | "building"; props: any }[] = [];
    const palette = ["#fef3c7", "#fde68a", "#fbcfe8", "#bfdbfe", "#fecaca", "#d9f99d"];
    let z = -4;
    let seed = 1;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    while (z > -length) {
      // alternate sides
      const side: -1 | 1 = rnd() > 0.5 ? -1 : 1;
      const r = rnd();
      if (r < 0.45) {
        list.push({ type: "tree", props: { position: [side * (7 + rnd() * 3), 0, z] } });
      } else if (r < 0.75) {
        list.push({
          type: "lamp",
          props: { position: [side * 6.3, 0, z], side },
        });
      } else {
        const w = 3 + Math.floor(rnd() * 3);
        const h = 2 + Math.floor(rnd() * 3);
        const d = 3 + Math.floor(rnd() * 3);
        list.push({
          type: "building",
          props: {
            position: [side * (10 + rnd() * 4), 0, z],
            w,
            h,
            d,
            color: palette[Math.floor(rnd() * palette.length)],
          },
        });
      }
      z -= 4 + rnd() * 4;
    }
    return list;
  }, [length]);

  return (
    <group>
      {items.map((it, i) => {
        if (it.type === "tree") return <Tree key={i} {...it.props} />;
        if (it.type === "lamp") return <Lamp key={i} {...it.props} />;
        return <Building key={i} {...it.props} />;
      })}
    </group>
  );
};

export default Scenery;
