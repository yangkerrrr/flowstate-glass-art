import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface HoodieProps {
  scrollProgress: number;
}

function Hoodie({ scrollProgress }: HoodieProps) {
  const { scene } = useGLTF("/hoodie.glb");

  // Subtle premium motion only
  scene.rotation.y = scrollProgress * 1.55;
  scene.rotation.x = scrollProgress * 0.45;

  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      // Force realistic fabric response
      if (mesh.material) {
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#fbf7f5",
          roughness: 0.85,
          metalness: 0.03,
        });
      }
    }
  });

  return <primitive object={scene} scale={1.90} />;
}

export default function HoodieModel({ scrollProgress }: HoodieProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.75], fov: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      {/* Fabric lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={0.8} />

      <Hoodie scrollProgress={scrollProgress} />

      {/* Neutral studio reflection */}
      <Environment preset="studio" />
      
      {/* Landing page only — remove on /product */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
