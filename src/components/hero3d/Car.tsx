import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import decalUrl from "@/assets/marvel-logo.jpg";

/**
 * Realistic volumetric training sedan, fully procedural.
 * - Body + cabin + bumpers built from rounded boxes
 * - Glossy white paint with PBR shading
 * - Tinted windows, chrome trim, headlights/taillights
 * - 4 wheels with hubcaps, spinning based on speed
 * - Marvel Driving School decal mapped onto both doors
 * - Subtle suspension bounce + steering sway
 */
interface CarProps {
  speed: number;
  steer: number;
}

const Car = ({ speed, steer }: CarProps) => {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Group[]>([]);
  const headlightL = useRef<THREE.SpotLight>(null);
  const headlightR = useRef<THREE.SpotLight>(null);

  const decal = useLoader(THREE.TextureLoader, decalUrl);
  useMemo(() => {
    decal.colorSpace = THREE.SRGBColorSpace;
    decal.anisotropy = 16;
    decal.needsUpdate = true;
  }, [decal]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (body.current) {
      // Suspension bounce
      body.current.position.y = 0.62 + Math.sin(t * 6) * 0.008 + Math.sin(t * 2.3) * 0.012;
      // Body roll from steering
      body.current.rotation.z = THREE.MathUtils.lerp(body.current.rotation.z, -steer * 0.05, 0.12);
    }
    if (root.current) {
      // Steering sway across the lane
      root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, steer * 0.5, 0.08);
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, -steer * 0.06, 0.1);
    }
    // Spin wheels relative to perceived speed
    const spin = (Math.abs(speed) * 8 + 1.2) * delta * Math.sign(speed || 1);
    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x -= spin;
    });
  });

  const setWheel = (i: number) => (el: THREE.Group | null) => {
    if (el) wheelRefs.current[i] = el;
  };

  // Geometry constants
  const bodyColor = "#f4f6f8";
  const trimColor = "#1f2937";

  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* Body */}
      <group ref={body} position={[0, 0.62, 0]}>
        {/* Lower chassis */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.85, 0.45, 4.1]} />
          <meshPhysicalMaterial
            color={bodyColor}
            metalness={0.65}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Hood */}
        <mesh castShadow position={[0, 0.18, 1.35]}>
          <boxGeometry args={[1.78, 0.2, 1.3]} />
          <meshPhysicalMaterial
            color={bodyColor}
            metalness={0.65}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Trunk */}
        <mesh castShadow position={[0, 0.18, -1.5]}>
          <boxGeometry args={[1.78, 0.22, 1]} />
          <meshPhysicalMaterial
            color={bodyColor}
            metalness={0.65}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Cabin (greenhouse) */}
        <mesh castShadow position={[0, 0.55, -0.05]}>
          <boxGeometry args={[1.72, 0.7, 2.3]} />
          <meshPhysicalMaterial
            color={bodyColor}
            metalness={0.6}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>

        {/* Roof sign — branded Marvel box */}
        <group position={[0, 1.0, 0]}>
          {/* Illuminated yellow housing */}
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.18, 0.5]} />
            <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.35} />
          </mesh>
          {/* Logo on front face (faces +Z, toward windshield/road ahead) */}
          <mesh position={[0, 0, 0.251]}>
            <planeGeometry args={[0.78, 0.15]} />
            <meshStandardMaterial map={decal} transparent alphaTest={0.02} toneMapped={false} />
          </mesh>
          {/* Logo on rear face (faces -Z) */}
          <mesh position={[0, 0, -0.251]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.78, 0.15]} />
            <meshStandardMaterial map={decal} transparent alphaTest={0.02} toneMapped={false} />
          </mesh>
          {/* Logo on left face (faces -X) */}
          <mesh position={[-0.451, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.42, 0.14]} />
            <meshStandardMaterial map={decal} transparent alphaTest={0.02} toneMapped={false} />
          </mesh>
          {/* Logo on right face (faces +X) */}
          <mesh position={[0.451, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.42, 0.14]} />
            <meshStandardMaterial map={decal} transparent alphaTest={0.02} toneMapped={false} />
          </mesh>
        </group>

        {/* Hood decal — flat on top of hood, lying parallel to surface */}
        <mesh position={[0, 0.281, 1.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 0.7]} />
          <meshStandardMaterial map={decal} transparent alphaTest={0.02} toneMapped={false} />
        </mesh>

        {/* Windshield */}
        <mesh position={[0, 0.62, 1.05]} rotation={[-0.5, 0, 0]}>
          <planeGeometry args={[1.55, 0.9]} />
          <meshPhysicalMaterial
            color="#0b1220"
            metalness={0.2}
            roughness={0.05}
            transmission={0.6}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Rear window */}
        <mesh position={[0, 0.62, -1.18]} rotation={[0.55, 0, 0]}>
          <planeGeometry args={[1.55, 0.85]} />
          <meshPhysicalMaterial
            color="#0b1220"
            metalness={0.2}
            roughness={0.05}
            transmission={0.6}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Side windows */}
        {[-0.87, 0.87].map((x, i) => (
          <mesh key={i} position={[x, 0.62, -0.05]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.05, 0.55]} />
            <meshPhysicalMaterial
              color="#0b1220"
              metalness={0.2}
              roughness={0.05}
              transmission={0.55}
              transparent
              opacity={0.82}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Door decals (both sides) — real Marvel logo on white backing */}
        {[-0.931, 0.931].map((x, i) => (
          <group key={`decal-${i}`} position={[x, 0.05, -0.05]} rotation={[0, (i === 0 ? -1 : 1) * Math.PI / 2, 0]}>
            <mesh position={[0, 0, -0.001]}>
              <planeGeometry args={[0.7, 0.7]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>
            <mesh>
              <planeGeometry args={[0.62, 0.62]} />
              <meshStandardMaterial map={decal} transparent alphaTest={0.02} toneMapped={false} />
            </mesh>
          </group>
        ))}

        {/* Headlights */}
        {[-0.55, 0.55].map((x, i) => (
          <mesh key={`hl-${i}`} position={[x, 0.05, 2.05]}>
            <boxGeometry args={[0.55, 0.18, 0.05]} />
            <meshStandardMaterial color="#fffbe6" emissive="#fff4c2" emissiveIntensity={1.2} />
          </mesh>
        ))}
        {/* Taillights */}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={`tl-${i}`} position={[x, 0.1, -2.05]}>
            <boxGeometry args={[0.5, 0.18, 0.05]} />
            <meshStandardMaterial color="#7f1d1d" emissive="#ef4444" emissiveIntensity={0.8} />
          </mesh>
        ))}

        {/* Front grille */}
        <mesh position={[0, -0.05, 2.04]}>
          <boxGeometry args={[1, 0.18, 0.04]} />
          <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Front bumper */}
        <mesh castShadow position={[0, -0.18, 2]}>
          <boxGeometry args={[1.85, 0.2, 0.18]} />
          <meshStandardMaterial color={trimColor} metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Rear bumper */}
        <mesh castShadow position={[0, -0.18, -2]}>
          <boxGeometry args={[1.85, 0.2, 0.18]} />
          <meshStandardMaterial color={trimColor} metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Side mirrors */}
        {[-1.0, 1.0].map((x, i) => (
          <mesh key={`mirror-${i}`} position={[x, 0.55, 0.85]}>
            <boxGeometry args={[0.18, 0.12, 0.18]} />
            <meshPhysicalMaterial color={bodyColor} metalness={0.6} roughness={0.2} clearcoat={1} />
          </mesh>
        ))}
      </group>

      {/* Wheels */}
      {[
        [-0.82, 0.32, 1.35],
        [0.82, 0.32, 1.35],
        [-0.82, 0.32, -1.35],
        [0.82, 0.32, -1.35],
      ].map((p, i) => (
        <group key={i} ref={setWheel(i)} position={p as [number, number, number]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.26, 28]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.85} metalness={0.2} />
          </mesh>
          {/* Hubcap */}
          <mesh position={[0.135 * (i % 2 === 0 ? -1 : 1), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 20]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Headlight beams */}
      <spotLight
        ref={headlightL}
        position={[-0.55, 0.7, 2.1]}
        target-position={[-1.5, 0, 8]}
        angle={0.5}
        penumbra={0.6}
        intensity={1.4}
        distance={14}
        color="#fff4c2"
        castShadow={false}
      />
      <spotLight
        ref={headlightR}
        position={[0.55, 0.7, 2.1]}
        target-position={[1.5, 0, 8]}
        angle={0.5}
        penumbra={0.6}
        intensity={1.4}
        distance={14}
        color="#fff4c2"
      />
    </group>
  );
};

export default Car;
