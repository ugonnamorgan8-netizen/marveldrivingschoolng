import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Sparkles, Cloud } from "@react-three/drei";
import * as THREE from "three";
import Car from "./hero3d/Car";
import Road from "./hero3d/Road";
import Scenery from "./hero3d/Scenery";
import Signs from "./hero3d/Signs";

/**
 * Cinematic, scroll-driven hero scene.
 * - Real volumetric Marvel training car with spinning wheels
 * - Procedural road, scenery, traffic signs and lights
 * - Camera tracks the car with subtle parallax
 * - Scroll position drives world translation (reversible)
 */

interface SceneProps {
  progress: number;
  speed: number;
}

const ROAD_LENGTH = 220;
const TRAVEL_DISTANCE = 130; // how far the world scrolls past the car

const Scene = ({ progress, speed }: SceneProps) => {
  const worldRef = useRef<THREE.Group>(null);
  const camTarget = useRef(new THREE.Vector3(0, 0.7, 0));
  const cameraOffset = useMemo(() => new THREE.Vector3(4.5, 2.6, 6.2), []);

  useFrame((state) => {
    // Translate the world toward the camera based on scroll progress.
    if (worldRef.current) {
      const targetZ = progress * TRAVEL_DISTANCE;
      worldRef.current.position.z = THREE.MathUtils.lerp(
        worldRef.current.position.z,
        targetZ,
        0.12
      );
    }
    // Camera tracking with slight parallax sway
    const t = state.clock.elapsedTime;
    const sway = Math.sin(t * 0.5) * 0.15;
    const desired = new THREE.Vector3(
      cameraOffset.x + sway,
      cameraOffset.y + Math.sin(t * 0.7) * 0.05,
      cameraOffset.z
    );
    state.camera.position.lerp(desired, 0.05);
    state.camera.lookAt(camTarget.current);
  });

  // Steering responds to scroll speed
  const steer = THREE.MathUtils.clamp(speed * 1.8, -0.6, 0.6);

  return (
    <>
      {/* Atmosphere — late afternoon */}
      <fog attach="fog" args={["#f4d8b5", 14, 70]} />

      {/* Lighting rig */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#ffe7c2", "#3a3020", 0.5]} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.8}
        color="#ffd9a8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />

      {/* Sky/background tint via gradient sphere */}
      <mesh scale={[1, 1, 1]}>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#fde7c4" side={THREE.BackSide} />
      </mesh>

      {/* World group: everything that scrolls past the car */}
      <group ref={worldRef}>
        <Road length={ROAD_LENGTH} />
        <Scenery length={ROAD_LENGTH} />
        <Signs />
      </group>

      {/* Distant clouds */}
      <Suspense fallback={null}>
        <group position={[-10, 8, -30]}>
          <Cloud seed={1} segments={20} bounds={[10, 1.5, 1]} volume={4} color="#ffffff" opacity={0.55} />
        </group>
        <group position={[12, 9, -45]}>
          <Cloud seed={3} segments={20} bounds={[10, 1.5, 1]} volume={4} color="#ffffff" opacity={0.5} />
        </group>
      </Suspense>

      {/* Dust particles around the car */}
      <Sparkles count={50} scale={[6, 1.2, 6]} position={[0, 0.4, -2]} size={2} speed={0.5} opacity={0.55} color="#fef3c7" />

      {/* The car stays at world origin; world moves around it */}
      <Suspense fallback={null}>
        <Car speed={speed * 4} steer={steer} />
      </Suspense>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={10} blur={2.4} far={5} />

      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>
    </>
  );
};

interface Props {
  containerRef: React.RefObject<HTMLElement>;
}

const HeroScene3D = ({ containerRef }: Props) => {
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const lastP = useRef(0);
  const lastT = useRef(performance.now());
  const speedRef = useRef(0);

  useEffect(() => {
    const update = () => {
      // Drive animation from overall page scroll, not section visibility
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const maxScroll = Math.max(1, (doc.scrollHeight || 0) - (window.innerHeight || 0));
      const p = THREE.MathUtils.clamp(scrollTop / maxScroll, 0, 1);
      const now = performance.now();
      const dt = Math.max(16, now - lastT.current) / 1000;
      const v = (p - lastP.current) / dt;
      lastP.current = p;
      lastT.current = now;
      // Smooth speed signal
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, v, 0.25);
      setProgress(p);
      setSpeed(speedRef.current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Decay speed when not scrolling
    const decay = setInterval(() => {
      speedRef.current *= 0.85;
      setSpeed(speedRef.current);
    }, 80);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearInterval(decay);
    };
  }, [containerRef]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4.5, 2.6, 6.2], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <Scene progress={progress} speed={speed} />
      </Canvas>
    </div>
  );
};

export default HeroScene3D;
