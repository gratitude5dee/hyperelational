import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export const RelationalLoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    nodes: THREE.Mesh[];
    connections: THREE.Line[];
  }>();

  const phases = [
    'Initializing relational intelligence...',
    'Recognizing data patterns...',
    'Forming connections...',
    'Building intelligence graph...',
    'Ready to explore relationships!'
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(600, 600);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create nodes
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const nodes: THREE.Mesh[] = [];
    const connections: THREE.Line[] = [];
    
    // Phase 1: Create scattered nodes
    for (let i = 0; i < 100; i++) {
      const hue = 0.6 + Math.random() * 0.2; // Blue to purple range
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.6),
        emissive: new THREE.Color().setHSL(hue, 0.8, 0.3),
        emissiveIntensity: 0,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
      });
      
      const node = new THREE.Mesh(nodeGeometry, material);
      node.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      
      nodes.push(node);
      scene.add(node);
    }

    sceneRef.current = { scene, camera, renderer, nodes, connections };

    // Animation timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
    });

    // Phase 1: Node appearance
    timeline
      .to({}, { duration: 0.5 })
      .add(() => setPhase(1))
      .add(() => {
        // Phase 2: Pulse nodes
        nodes.forEach((node, i) => {
          gsap.to(node.material, {
            emissiveIntensity: 0.5,
            duration: 0.3,
            delay: i * 0.01,
            yoyo: true,
            repeat: 3
          });
        });
      }, "+=0.5")
      .add(() => setPhase(2), "+=1")
      .add(() => {
        // Phase 3: Create connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            if (distance < 1.2 && Math.random() > 0.8) {
              const geometry = new THREE.BufferGeometry().setFromPoints([
                nodes[i].position,
                nodes[j].position
              ]);
              
              const material = new THREE.LineBasicMaterial({
                color: 0x6366f1,
                opacity: 0,
                transparent: true,
                linewidth: 2
              });
              
              const connection = new THREE.Line(geometry, material);
              connections.push(connection);
              scene.add(connection);
              
              gsap.to(material, {
                opacity: 0.4,
                duration: 0.3,
                delay: Math.random() * 0.5
              });
            }
          }
        }
      }, "+=0.5")
      .add(() => setPhase(3), "+=1")
      .add(() => {
        // Phase 4: Form intelligence clusters
        const clusters = 5;
        const nodesPerCluster = Math.floor(nodes.length / clusters);
        
        nodes.forEach((node, i) => {
          const cluster = Math.floor(i / nodesPerCluster);
          const angle = (cluster / clusters) * Math.PI * 2;
          const radius = 1.5;
          
          gsap.to(node.position, {
            x: Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3,
            y: Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3,
            z: (Math.random() - 0.5) * 0.3,
            duration: 2,
            ease: "power2.inOut"
          });
        });
      }, "+=0.5")
      .add(() => setPhase(4), "+=1.5");

    // Render loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Rotate camera
      const time = Date.now() * 0.0001;
      camera.position.x = Math.sin(time) * 3;
      camera.position.z = Math.cos(time) * 3;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      timeline.kill();
      renderer.dispose();
      scene.clear();
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="w-[600px] h-[600px] max-w-[90vw] max-h-[90vw]" 
        />
        
        {/* Loading text */}
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <motion.p 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/60 text-sm tracking-widest uppercase mb-4"
          >
            {phases[phase]}
          </motion.p>
          
          {/* Progress bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(phase + 1) * 20}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Powered by KumoRFM */}
          <motion.div 
            className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse" />
            <span>Powered by KumoRFM Relational Foundation Model</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};