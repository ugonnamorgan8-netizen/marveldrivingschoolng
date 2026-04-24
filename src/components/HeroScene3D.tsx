import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Sparkles, Cloud } from "@react-three/drei";
import * as THREE from "three";
import Car from "./hero3d/Car";
import Road from "./hero3d/Road";
import Scenery from "./hero3d/Scenery";
import Signs from "./hero3d/Signs";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Cinematic, scroll-driven hero scene.
 * - Animation only runs while the CarShowcase section is in the viewport.
 * - Lighter rendering on mobile to keep scrolling smooth.
 */

interface SceneProps {
  progress: number;
  speed: number;
  lite: boolean;
}

const ROAD_LENGTH = 220;
const TRAVEL_DISTANCE = 130;

const Scene = ({ progress, speed, lite }: SceneProps) => {
  const worldRef = useRef<THREE.Group>(null);
  const camTarget = useRef(new THREE.Vector3(0, 0.7, 0));
  const cameraOffset = useMemo(() => new THREE.Vector3(4.5, 2.6, 6.2), []);

  useFrame((state) => {
    if (worldRef.current) {
      const targetZ = progress * TRAVEL_DISTANCE;
      worldRef.current.position.z = THREE.MathUtils.lerp(
        worldRef.current.position.z,
        targetZ,
        0.12
      );
    }
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

  const steer = THREE.MathUtils.clamp(speed * 1.8, -0.6, 0.6);

  return (
    <>
      <fog attach="fog" args={["#f4d8b5", 14, 70]} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#ffe7c2", "#3a3020", 0.5]} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.8}
        color="#ffd9a8"
        castShadow={!lite}
        shadow-mapSize-width={lite ? 512 : 2048}
        shadow-mapSize-height={lite ? 512 : 2048}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />

      <mesh scale={[1, 1, 1]}>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#fde7c4" side={THREE.BackSide} />
      </mesh>

      <group ref={worldRef}>
        <Road length={ROAD_LENGTH} />
        <Scenery length={ROAD_LENGTH} />
        <Signs />
      </group>

      {!lite && (
        <Suspense fallback={null}>
          <group position={[-10, 8, -30]}>
            <Cloud seed={1} segments={20} bounds={[10, 1.5, 1]} volume={4} color="#ffffff" opacity={0.55} />
          </group>
          <group position={[12, 9, -45]}>
            <Cloud seed={3} segments={20} bounds={[10, 1.5, 1]} volume={4} color="#ffffff" opacity={0.5} />
          </group>
        </Suspense>
      )}

      {!lite && (
        <Sparkles count={50} scale={[6, 1.2, 6]} position={[0, 0.4, -2]} size={2} speed={0.5} opacity={0.55} color="#fef3c7" />
      )}

      <Suspense fallback={null}>
        <Car speed={speed * 4} steer={steer} />
      </Suspense>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={10} blur={2.4} far={5} />

      {!lite && (
        <Suspense fallback={null}>
          <Environment preset="sunset" />
        </Suspense>
      )}
    </>
  );
};

interface Props {
  containerRef: React.RefObject<HTMLElement>;
}

const HeroScene3D = ({ containerRef }: Props) => {
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [active, setActive] = useState(false);
  const lastP = useRef(0);
  const lastT = useRef(performance.now());
  const speedRef = useRef(0);
  const tickingRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use IntersectionObserver to know when the section is on screen.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        activeRef.current = visible;
        setActive(visible);
      },
      { rootMargin: "100px 0px", threshold: 0 }
    );
    io.observe(el);

    const compute = () => {
      tickingRef.current = false;
      if (!activeRef.current) return;

      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Local progress: 0 when section just entered, 1 when fully scrolled past.
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const p = THREE.MathUtils.clamp(traveled / total, 0, 1);

      const now = performance.now();
      const dt = Math.max(16, now - lastT.current) / 1000;
      const rawV = (p - lastP.current) / dt;

      // Boost when section is centered in viewport.
      const sectionCenter = rect.top + rect.height / 2;
      const dist = Math.abs(sectionCenter - vh / 2);
      const range = vh * 0.9 + rect.height / 2;
      const proximity = THREE.MathUtils.clamp(1 - dist / range, 0, 1);
      const boost = 1 + proximity * 2.5;

      const v = rawV * boost;
      lastP.current = p;
      lastT.current = now;
      speedRef.current = THREE.MathUtils.lerp(speedRef.current, v, 0.25);
      setProgress(p);
      setSpeed(speedRef.current);
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const decay = setInterval(() => {
      if (!activeRef.current) return;
      speedRef.current *= 0.85;
      setSpeed(speedRef.current);
    }, 120);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearInterval(decay);
    };
  }, [containerRef]);

  // Don't mount the heavy Canvas at all until the section is near.
  if (!active) {
    return <div className="absolute inset-0 pointer-events-none" aria-hidden />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        frameloop={active ? "always" : "demand"}
        camera={{ position: [4.5, 2.6, 6.2], fov: 38 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <Scene progress={progress} speed={speed} lite={isMobile} />
      </Canvas>
    </div>
  );
};

export default HeroScene3D;
