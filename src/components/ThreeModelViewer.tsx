import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { RotateCw, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';

export interface ModelData {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  category: string;
  categoryLabel: string;
  polygons: string;
  dimensions: string;
  software: string;
  description: string;
  color: string;
}

interface ThreeModelViewerProps {
  model: ModelData;
}

export const ThreeModelViewer: React.FC<ThreeModelViewerProps> = ({ model }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Controls & camera refs for external button triggers (zoom in/out/reset)
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setLoading(true);
    setLoadError(null);

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera centered directly at (0, 0, 0)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 3.8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.replaceChildren(renderer.domElement);

    // OrbitControls for 3D viewport navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 1.2;
    controls.maxDistance = 8.0;
    controls.target.set(0, 0, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // Lighting setup for engineering & CAD models
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight2.position.set(-6, -3, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    let activeMesh: THREE.Mesh | null = null;
    let activeGeo: THREE.BufferGeometry | null = null;
    let animId: number;

    // Load STL model
    const loader = new STLLoader();
    loader.load(
      model.fileUrl,
      (geometry) => {
        activeGeo = geometry;
        
        // Auto-orient CAD model: rotate Z-up to Y-up
        geometry.rotateX(-Math.PI / 2);
        
        // Center the geometry precisely at (0, 0, 0)
        geometry.center();
        geometry.computeVertexNormals();

        // Normalize scale to fit nicely in 3.8 distance camera viewport
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        if (box) {
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const targetSize = 2.4;
            const scale = targetSize / maxDim;
            geometry.scale(scale, scale, scale);
          }
        }

        const colorHex = parseInt(model.color.replace('#', '0x'), 16) || 0x38bdf8;
        const material = new THREE.MeshStandardMaterial({
          color: colorHex,
          metalness: 0.35,
          roughness: 0.35,
        });

        activeMesh = new THREE.Mesh(geometry, material);
        scene.add(activeMesh);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Error loading STL file:', err);
        setLoading(false);
        setLoadError('Не удалось загрузить файл модели');
      }
    );

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (activeGeo) activeGeo.dispose();
    };
  }, [model]);

  // Sync auto-rotation state with controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Zoom handlers
  const handleZoomIn = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const offset = camera.position.clone().sub(controls.target);
    if (offset.length() > controls.minDistance + 0.3) {
      offset.multiplyScalar(0.8);
      camera.position.copy(controls.target).add(offset);
    }
  };

  const handleZoomOut = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const offset = camera.position.clone().sub(controls.target);
    if (offset.length() < controls.maxDistance - 0.5) {
      offset.multiplyScalar(1.25);
      camera.position.copy(controls.target).add(offset);
    }
  };

  const handleResetView = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.target.set(0, 0, 0);
    camera.position.set(0, 0.5, 3.8);
    controls.update();
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] bg-neutral-900/50 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col justify-between group">
      {/* 3D Canvas Mount (Interactive OrbitControls) */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full"
      />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/75 backdrop-blur-xs z-20 pointer-events-none space-y-2">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          <span className="text-xs font-mono text-neutral-300">Загрузка STL геометрии ({model.fileName})...</span>
        </div>
      )}

      {/* Error overlay */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 z-20 pointer-events-none">
          <span className="text-xs font-mono text-red-400">{loadError}</span>
        </div>
      )}

      {/* Top Overlay: Badges and Format info */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur border border-neutral-700 text-neutral-300">
            {model.software}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur border border-neutral-700 text-neutral-400">
            {model.polygons}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur border border-neutral-700 text-neutral-400 hidden sm:inline-block">
            {model.dimensions}
          </span>
        </div>
        <div className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>STL 3D View</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-transparent flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="text-xs text-neutral-400 select-none flex items-center gap-2 font-mono">
          <span>Вращение: ЛКМ &bull; Масштаб: Колесико мыши</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            title="Приблизить (+)"
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            title="Отдалить (-)"
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            title="Сбросить ракурс"
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-neutral-800 mx-1" />

          {/* Auto-rotate Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            title="Авто-вращение"
            className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
              autoRotate
                ? 'bg-neutral-800 text-emerald-400 border-neutral-700'
                : 'bg-neutral-900/90 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
