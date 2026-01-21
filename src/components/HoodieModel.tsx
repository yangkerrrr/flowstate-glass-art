import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  scrollProgress: number;
}

const Hoodie = ({ scrollProgress }: ModelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
      groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.2;
    }
  });

  // Fabric material - realistic hoodie look with off-white accents
  const fabricMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a1f",
    roughness: 0.85,
    metalness: 0.05,
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: "#e8e4dc",
    emissive: "#e8e4dc",
    emissiveIntensity: 0.3,
    metalness: 0.4,
    roughness: 0.4,
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        {/* Main body - torso */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 2.2, 0.9]} />
          <primitive object={fabricMaterial} attach="material" />
        </mesh>

        {/* Hood - back part */}
        <mesh position={[0, 1.4, -0.2]}>
          <sphereGeometry args={[0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <primitive object={fabricMaterial.clone()} attach="material" />
        </mesh>

        {/* Hood opening rim */}
        <mesh position={[0, 1.1, 0.35]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.5, 0.08, 8, 16, Math.PI]} />
          <primitive object={fabricMaterial.clone()} attach="material" />
        </mesh>

        {/* Collar/neckline */}
        <mesh position={[0, 0.9, 0.3]}>
          <cylinderGeometry args={[0.35, 0.4, 0.3, 16]} />
          <primitive object={fabricMaterial.clone()} attach="material" />
        </mesh>

        {/* Left sleeve */}
        <mesh position={[-1.2, 0.3, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.28, 0.35, 1.5, 12]} />
          <primitive object={fabricMaterial.clone()} attach="material" />
        </mesh>

        {/* Right sleeve */}
        <mesh position={[1.2, 0.3, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.28, 0.35, 1.5, 12]} />
          <primitive object={fabricMaterial.clone()} attach="material" />
        </mesh>

        {/* Kangaroo pocket */}
        <mesh position={[0, -0.4, 0.48]}>
          <boxGeometry args={[1.2, 0.5, 0.1]} />
          <primitive object={fabricMaterial.clone()} attach="material" />
        </mesh>

        {/* Logo - triangle accent */}
        <mesh position={[0, 0.4, 0.5]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.2, 0.3, 3]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>

        {/* Drawstrings */}
        <mesh position={[-0.15, 0.7, 0.45]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
          <primitive object={accentMaterial.clone()} attach="material" />
        </mesh>
        <mesh position={[0.15, 0.7, 0.45]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
          <primitive object={accentMaterial.clone()} attach="material" />
        </mesh>
      </Float>

      {/* Floating accent - simplified with off-white tones */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[2, 1, -0.5]}>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color="#e8e4dc"
            emissive="#e8e4dc"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-2, -0.3, -0.3]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial
            color="#d4d0c8"
            emissive="#d4d0c8"
            emissiveIntensity={0.35}
          />
        </mesh>
      </Float>
    </group>
  );
};

interface HoodieModelProps {
  scrollProgress: number;
}

const HoodieModel = ({ scrollProgress }: HoodieModelProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, 2, 4]} intensity={0.4} color="#e8e4dc" />
      <pointLight position={[3, -2, 2]} intensity={0.3} color="#d4d0c8" />
      
      <Hoodie scrollProgress={scrollProgress} />
      
      <Environment preset="city" environmentIntensity={0.3} />
    </Canvas>
  );
};

export default HoodieModel;
