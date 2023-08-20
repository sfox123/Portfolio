import { Suspense, useEffect, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Computers = ({ mobile, rotationValue }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");
  return (
    <mesh>
      <hemisphereLight intensity={0.75} groundColor="black" />
      <pointLight intensity={1} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive
        object={computer.scene}
        scale={mobile ? 0.4 : 0.5}
        position={mobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, rotationValue, 0]} // Use the rotation value here
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rotationValue, setRotationValue] = useState(50.5); // Initial rotation value

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 100; // Maximum scroll value (1 to 100)
      const scrollPercentage =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const newRotationValue = scrollPercentage * maxScroll * 0.1;
      setRotationValue(newRotationValue);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers mobile={isMobile} rotationValue={rotationValue} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
