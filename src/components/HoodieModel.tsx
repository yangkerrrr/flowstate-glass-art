import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  scrollProgress: number;
}

const Hoodie = ({ scrollProgress }: ModelProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Rotate based on scroll
      groupRef.current.rotation.y = scrollProgress * Math.PI * 2;
      groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Main hoodie body - abstract geometric representation */}
        <mesh ref={meshRef} position={[0, 0.3, 0]}>
          <boxGeometry args={[2, 2.5, 1.2]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={0.95}
            roughness={0.1}
            thickness={0.5}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.2}
            color="#1a1f35"
          />
        </mesh>

        {/* Hood */}
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={0.9}
            roughness={0.15}
            thickness={0.3}
            ior={1.4}
            chromaticAberration={0.04}
            color="#1a1f35"
          />
        </mesh>

        {/* Logo accent - triangle */}
        <mesh position={[0, 0.8, 0.65]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.3, 0.4, 3]} />
          <meshStandardMaterial
            color="#66d9ff"
            emissive="#66d9ff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Sleeves */}
        <mesh position={[-1.3, 0.2, 0]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.35, 0.4, 1.8, 16]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={256}
            transmission={0.9}
            roughness={0.15}
            thickness={0.2}
            color="#1a1f35"
          />
        </mesh>
        <mesh position={[1.3, 0.2, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.35, 0.4, 1.8, 16]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={256}
            transmission={0.9}
            roughness={0.15}
            thickness={0.2}
            color="#1a1f35"
          />
        </mesh>
      </Float>

      {/* Floating accent elements */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[2.5, 1.5, -1]}>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#66d9ff"
            emissive="#66d9ff"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[-2.5, -0.5, -0.5]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial
            color="#ff66b2"
            emissive="#ff66b2"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
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
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        color="#66d9ff"
      />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
        color="#ff66b2"
      />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />
      
      <Hoodie scrollProgress={scrollProgress} />
      
      <Environment preset="city" />
    </Canvas>
  );
};

export default HoodieModel;
