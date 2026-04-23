import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * Roadside traffic signs and traffic light. All placed at fixed Z positions
 * along the world; they appear to "pass" the car as the world is translated.
 */

type SignKind = "stop" | "speed" | "ped" | "left" | "right" | "roundabout";

interface SignDef {
  kind: SignKind;
  side: -1 | 1;
  z: number;
  speed?: number;
}

const SIGNS: SignDef[] = [
  { kind: "stop", side: -1, z: -8 },
  { kind: "speed", side: 1, z: -16, speed: 50 },
  { kind: "ped", side: -1, z: -26 },
  { kind: "left", side: 1, z: -36 },
  { kind: "speed", side: -1, z: -48, speed: 30 },
  { kind: "roundabout", side: 1, z: -60 },
  { kind: "right", side: -1, z: -72 },
  { kind: "stop", side: 1, z: -86 },
  { kind: "speed", side: -1, z: -100, speed: 60 },
  { kind: "ped", side: 1, z: -116 },
];

const Pole = () => (
  <mesh castShadow position={[0, 1.1, 0]}>
    <cylinderGeometry args={[0.05, 0.05, 2.2, 12]} />
    <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.35} />
  </mesh>
);

const SignFace = ({ kind, speed }: { kind: SignKind; speed?: number }) => {
  switch (kind) {
    case "stop":
      return (
        <group position={[0, 2.3, 0]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 8]}>
            <cylinderGeometry args={[0.45, 0.45, 0.06, 8]} />
            <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.4} emissive="#dc2626" emissiveIntensity={0.15} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#000">
            STOP
          </Text>
        </group>
      );
    case "speed":
      return (
        <group position={[0, 2.3, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.06, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <ringGeometry args={[0.36, 0.45, 32]} />
            <meshStandardMaterial color="#dc2626" side={THREE.DoubleSide} />
          </mesh>
          <Text position={[0, 0, 0.05]} fontSize={0.32} color="#111827" anchorX="center" anchorY="middle">
            {String(speed ?? 50)}
          </Text>
        </group>
      );
    case "ped":
      return (
        <group position={[0, 2.3, 0]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.7, 0.7, 0.06]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.2} />
          </mesh>
          <Text position={[0, 0, 0.06]} fontSize={0.34} color="#111827" anchorX="center" anchorY="middle">
            🚶
          </Text>
        </group>
      );
    case "left":
      return (
        <group position={[0, 2.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.55, 0.06]} />
            <meshStandardMaterial color="#1d4ed8" emissive="#1d4ed8" emissiveIntensity={0.2} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.4} color="#ffffff" anchorX="center" anchorY="middle">
            ←
          </Text>
        </group>
      );
    case "right":
      return (
        <group position={[0, 2.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.55, 0.06]} />
            <meshStandardMaterial color="#1d4ed8" emissive="#1d4ed8" emissiveIntensity={0.2} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.4} color="#ffffff" anchorX="center" anchorY="middle">
            →
          </Text>
        </group>
      );
    case "roundabout":
      return (
        <group position={[0, 2.3, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.06, 32]} />
            <meshStandardMaterial color="#1d4ed8" emissive="#1d4ed8" emissiveIntensity={0.2} />
          </mesh>
          <Text position={[0, 0, 0.04]} fontSize={0.42} color="#ffffff" anchorX="center" anchorY="middle">
            ↻
          </Text>
        </group>
      );
  }
};

const TrafficLight = ({ z, blink }: { z: number; blink: number }) => (
  <group position={[-3.85, 0, z]}>
    <Pole />
    <mesh castShadow position={[0.45, 2.3, 0]}>
      <boxGeometry args={[0.9, 0.06, 0.1]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    <group position={[0.85, 2.3, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.95, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Red */}
      <mesh position={[0, 0.32, 0.11]}>
        <circleGeometry args={[0.1, 20]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#ef4444" emissiveIntensity={blink > 0.66 ? 1.5 : 0.1} />
      </mesh>
      {/* Yellow */}
      <mesh position={[0, 0, 0.11]}>
        <circleGeometry args={[0.1, 20]} />
        <meshStandardMaterial color="#78350f" emissive="#facc15" emissiveIntensity={blink > 0.33 && blink <= 0.66 ? 1.5 : 0.1} />
      </mesh>
      {/* Green */}
      <mesh position={[0, -0.32, 0.11]}>
        <circleGeometry args={[0.1, 20]} />
        <meshStandardMaterial color="#064e3b" emissive="#22c55e" emissiveIntensity={blink <= 0.33 ? 1.5 : 0.1} />
      </mesh>
    </group>
  </group>
);

const Sign = ({ def }: { def: SignDef }) => (
  <group position={[def.side * 4.7, 0, def.z]}>
    <Pole />
    <SignFace kind={def.kind} speed={def.speed} />
  </group>
);

const Signs = () => {
  const ref = useRef<THREE.Group>(null);
  const blinkRef = useRef(0);

  useFrame((state) => {
    blinkRef.current = (state.clock.elapsedTime % 4) / 4;
  });

  return (
    <group ref={ref}>
      {SIGNS.map((s, i) => (
        <Sign key={i} def={s} />
      ))}
      <TrafficLight z={-44} blink={blinkRef.current} />
      <TrafficLight z={-92} blink={blinkRef.current} />
    </group>
  );
};

export default Signs;
