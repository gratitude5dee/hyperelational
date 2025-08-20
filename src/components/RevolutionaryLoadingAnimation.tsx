import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export const RevolutionaryLoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    connections: THREE.Group;
    logo: THREE.Group;
  }>();

  const phases = [
    'Initializing neural network...',
    'Forming synaptic connections...',
    'Processing data streams...',
    'Crystallizing relational patterns...',
    'Welcome to the future of data intelligence'
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
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

    // Phase 1: Neural Network Formation (0-30%)
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Scattered positions in 3D space
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      // Color transitions: Deep purple → Electric blue → Bright cyan
      const phase = Math.random();
      if (phase < 0.33) {
        // Deep Purple
        colors[i * 3] = 0.6; // R
        colors[i * 3 + 1] = 0.2; // G
        colors[i * 3 + 2] = 1.0; // B
      } else if (phase < 0.66) {
        // Electric Blue
        colors[i * 3] = 0.3;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Bright Cyan
        colors[i * 3] = 0.2;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      }

      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for advanced effects
    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      varying float vDistance;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDistance = length(mvPosition.xyz);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vDistance;
      uniform float time;
      
      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        
        if (dist > 0.5) discard;
        
        float alpha = 1.0 - dist * 2.0;
        float pulse = sin(time * 3.0 + vDistance * 0.5) * 0.3 + 0.7;
        
        gl_FragColor = vec4(vColor * pulse, alpha * 0.8);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 }
      }
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connections group for Phase 2
    const connections = new THREE.Group();
    scene.add(connections);

    // Logo group for Phase 3
    const logo = new THREE.Group();
    scene.add(logo);

    sceneRef.current = { scene, camera, renderer, particles, connections, logo };

    // Master animation timeline
    const masterTimeline = gsap.timeline({
      onUpdate: () => {
        const progress = masterTimeline.progress();
        setProgress(progress * 100);
        
        if (progress < 0.3) setPhase(0);
        else if (progress < 0.5) setPhase(1);
        else if (progress < 0.7) setPhase(2);
        else if (progress < 0.9) setPhase(3);
        else setPhase(4);
      },
      onComplete: () => {
        setTimeout(() => onComplete?.(), 1000);
      }
    });

    // Phase 1: Neural Network Formation (0-30%)
    masterTimeline
      .to({}, { duration: 1, ease: "power2.out" })
      .call(() => {
        // Animate particles to form network structure
        const positionAttribute = particles.geometry.attributes.position;
        const currentPositions = positionAttribute.array as Float32Array;
        
        // Create target positions for spherical distribution with clusters
        const targetPositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
          const cluster = Math.floor(i / (particleCount / 5));
          const angle = (cluster / 5) * Math.PI * 2;
          const radius = 2 + Math.random() * 1;
          
          targetPositions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
          targetPositions[i * 3 + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5;
          targetPositions[i * 3 + 2] = (Math.random() - 0.5) * 1;
        }

        // Animate each particle individually to target position
        for (let i = 0; i < particleCount; i++) {
          const startX = currentPositions[i * 3];
          const startY = currentPositions[i * 3 + 1];
          const startZ = currentPositions[i * 3 + 2];
          
          const targetX = targetPositions[i * 3];
          const targetY = targetPositions[i * 3 + 1];
          const targetZ = targetPositions[i * 3 + 2];
          
          gsap.to({}, {
            duration: 2,
            ease: "power2.inOut",
            delay: i * 0.002, // Stagger effect
            onUpdate: function() {
              const progress = this.progress();
              currentPositions[i * 3] = startX + (targetX - startX) * progress;
              currentPositions[i * 3 + 1] = startY + (targetY - startY) * progress;
              currentPositions[i * 3 + 2] = startZ + (targetZ - startZ) * progress;
              positionAttribute.needsUpdate = true;
            }
          });
        }
      }, [], 0.5)

      // Phase 2: Data Stream Visualization (30-70%)
      .call(() => {
        // Create flowing connections between particles
        for (let i = 0; i < particleCount; i += 10) {
          for (let j = i + 1; j < Math.min(i + 10, particleCount); j++) {
            const points = [
              new THREE.Vector3().fromArray(positions, i * 3),
              new THREE.Vector3().fromArray(positions, j * 3)
            ];
            
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const connectionMaterial = new THREE.LineBasicMaterial({
              color: new THREE.Color().setHSL(0.7 + Math.random() * 0.2, 0.8, 0.6),
              transparent: true,
              opacity: 0
            });
            
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            connections.add(connection);
            
            gsap.to(connectionMaterial, {
              opacity: 0.6,
              duration: 0.5,
              delay: Math.random() * 0.5,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut"
            });
          }
        }
      }, [], 1.5)

      // Phase 3: Logo Crystallization (70-100%)
      .call(() => {
        // Create holographic logo effect
        const logoGeometry = new THREE.TorusGeometry(1, 0.1, 16, 100);
        const logoMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color().setHSL(0.75, 1, 0.6),
          transparent: true,
          opacity: 0,
          emissive: new THREE.Color().setHSL(0.75, 1, 0.3),
          emissiveIntensity: 0.5,
          metalness: 1,
          roughness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0
        });
        
        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.add(logoMesh);
        
        gsap.to(logoMaterial, {
          opacity: 0.8,
          duration: 1,
          ease: "power2.out"
        });
        
        gsap.to(logoMesh.rotation, {
          y: Math.PI * 4,
          duration: 3,
          ease: "power2.inOut"
        });
      }, [], 2.5);

    // Render loop with optimizations
    let animationId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const elapsed = clock.getElapsedTime();
      
      // Update shader uniforms
      if (material.uniforms) {
        material.uniforms.time.value = elapsed;
      }
      
      // Smooth camera movement
      camera.position.x = Math.sin(elapsed * 0.1) * 0.5;
      camera.position.y = Math.cos(elapsed * 0.1) * 0.3;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle mouse interactions for magnetic attraction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Create ripple effect
      const ripple = new THREE.RingGeometry(0, 0.1, 32);
      const rippleMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.5
      });
      const rippleMesh = new THREE.Mesh(ripple, rippleMaterial);
      rippleMesh.position.set(mouseX * 3, mouseY * 3, 0);
      scene.add(rippleMesh);
      
      gsap.to(ripple.parameters, {
        outerRadius: 2,
        duration: 1,
        ease: "power2.out"
      });
      
      gsap.to(rippleMaterial, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          scene.remove(rippleMesh);
        }
      });
    };

    canvasRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      masterTimeline.kill();
      renderer.dispose();
      scene.clear();
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'hsl(0 0% 2%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-gradient-neural opacity-50" />
      
      {/* Main canvas */}
      <div className="relative z-10">
        <canvas 
          ref={canvasRef} 
          className="w-[600px] h-[600px] max-w-[90vw] max-h-[90vw]" 
        />
        
        {/* Phase indicator */}
        <div className="absolute bottom-0 left-0 right-0 text-center space-y-6">
          <motion.p 
            key={phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-foreground/80 text-lg tracking-wide font-light"
          >
            {phases[phase]}
          </motion.p>
          
          {/* Neural progress bar */}
          <div className="w-80 h-2 bg-muted/20 rounded-full mx-auto overflow-hidden backdrop-blur-sm">
            <motion.div 
              className="h-full bg-gradient-primary relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-data-flow" />
            </motion.div>
          </div>
          
          {/* Powered by indicator */}
          <motion.div 
            className="flex items-center justify-center gap-3 text-sm text-foreground/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-neural-pulse" />
            <span className="font-mono">Powered by KumoRFM Relational Foundation Model</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-neural-pulse" style={{ animationDelay: '0.5s' }} />
          </motion.div>

          {/* Performance indicator for reduced motion */}
          {typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches && (
            <motion.div
              className="mt-4 text-xs text-foreground/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Optimized for accessibility
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};