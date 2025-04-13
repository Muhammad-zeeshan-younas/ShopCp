"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ThreeDModelProps {
  modelPath: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function ThreeDModel({
  modelPath,
  containerRef,
}: ThreeDModelProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Control handlers
  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.max(10, cameraRef.current.fov - 10);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.min(100, cameraRef.current.fov + 10);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleResetView = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.z = 3;
      cameraRef.current.position.y = 1;
      cameraRef.current.fov = 50;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 5, 15);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 3;
    camera.position.y = 1;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    renderer.setClearColor(0x1a1a2e);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);

    // Controls with mobile adjustments
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false;
    controls.screenSpacePanning = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI * 0.9;

    // Mobile-specific settings
    if (isMobile) {
      controls.enablePan = false; // Disable panning on mobile
      controls.touchAction = "none"; // Prevent default touch behavior
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: null,
      };
    }
    controlsRef.current = controls;

    // Setup DRACO loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Load model
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.set(scale, scale, scale);

        scene.add(model);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        setError("Failed to load model");
        setLoading(false);
      }
    );

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Initial setup
    mountRef.current.appendChild(renderer.domElement);
    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(mountRef.current);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      observer.disconnect();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, isMobile]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden touch-none">
      {/* 3D Renderer Container */}
      <div ref={mountRef} className="w-full h-full touch-none" />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-pulse text-white">Loading model...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-red-400 text-center p-4">
            <div className="text-lg font-medium">{error}</div>
            <div className="text-sm mt-2">Please check the model file</div>
          </div>
        </div>
      )}

      {/* Control Panel - Mobile Bottom, Desktop Right */}
      <div
        className={`absolute ${
          isMobile
            ? "bottom-2 left-0 right-0 flex justify-center gap-2"
            : "bottom-4 right-4 flex flex-col gap-2"
        }`}
      >
        <button
          onClick={handleZoomIn}
          className="p-2 bg-gray-900/80 hover:bg-gray-800/90 rounded-full text-white backdrop-blur-sm transition-all"
          title="Zoom In"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-900/80 hover:bg-gray-800/90 rounded-full text-white backdrop-blur-sm transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-gray-900/80 hover:bg-gray-800/90 rounded-full text-white backdrop-blur-sm transition-all"
          title="Reset View"
        >
          <RotateCw className="h-5 w-5" />
        </button>
      </div>

      {/* Auto-rotate toggle - Mobile Hidden */}
      {!isMobile && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() =>
              controlsRef.current &&
              (controlsRef.current.autoRotate = !controlsRef.current.autoRotate)
            }
            className="px-3 py-1.5 text-xs bg-gray-900/80 hover:bg-gray-800/90 rounded-full text-white backdrop-blur-sm transition-all"
          >
            {controlsRef.current?.autoRotate ? "Stop Rotation" : "Auto Rotate"}
          </button>
        </div>
      )}
    </div>
  );
}
