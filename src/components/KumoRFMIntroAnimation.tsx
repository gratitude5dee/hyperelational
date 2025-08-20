import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface IntroAnimationProps {
  onComplete?: () => void;
}

export const KumoRFMIntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    logoGroup: THREE.Group;
    particles: THREE.Points;
    connections: THREE.Line[];
    nodes: THREE.Mesh[];
  }>();

  const phases = [
    'Initializing KumoRFM Intelligence...',
    'Assembling Relational Foundation...',
    'Awakening Neural Networks...',
    'Forming Quantum Connections...',
    'Intelligence Networks Active!'
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Enhanced Three.js scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050a0f, 1, 15);
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(800, 600);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    camera.position.set(0, 0, 8);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0x00f0ff, 2, 20, Math.PI / 6, 0.5);
    spotLight.position.set(0, 5, 5);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);

    const rimLight = new THREE.DirectionalLight(0x8000ff, 1);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    // Create KumoRFM logo geometry (abstract representation)
    const logoGroup = new THREE.Group();
    
    // Main logo sphere (core)
    const coreGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8000ff,
      emissive: 0x4000aa,
      emissiveIntensity: 0.2,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.1,
      ior: 1.5,
    });
    const logoCore = new THREE.Mesh(coreGeometry, coreMaterial);
    logoCore.castShadow = true;
    logoCore.receiveShadow = true;
    logoGroup.add(logoCore);

    // Logo orbiting elements
    const orbitElements: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const elementGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const elementMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        emissive: 0x0088bb,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2,
      });
      const element = new THREE.Mesh(elementGeometry, elementMaterial);
      
      const angle = (i / 6) * Math.PI * 2;
      const radius = 1.5;
      element.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 0.5) * 0.3,
        Math.sin(angle) * radius
      );
      
      orbitElements.push(element);
      logoGroup.add(element);
    }

    logoGroup.scale.set(0, 0, 0);
    scene.add(logoGroup);

    // Create particle system
    const particleCount = 3000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Start particles in a distant sphere
      const radius = 10 + Math.random() * 5;
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      
      particlePositions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      // Color gradient from cyan to purple
      const t = Math.random();
      if (t < 0.3) {
        // Cyan particles
        particleColors[i * 3] = 0.0;     // R
        particleColors[i * 3 + 1] = 0.9; // G
        particleColors[i * 3 + 2] = 1.0; // B
      } else if (t < 0.7) {
        // Purple particles
        particleColors[i * 3] = 0.5;     // R
        particleColors[i * 3 + 1] = 0.0; // G
        particleColors[i * 3 + 2] = 1.0; // B
      } else {
        // Pink particles
        particleColors[i * 3] = 1.0;     // R
        particleColors[i * 3 + 1] = 0.4; // G
        particleColors[i * 3 + 2] = 0.7; // B
      }

      particleSizes[i] = Math.random() * 3 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        uniform float opacity;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float opacity;
        
        void main() {
          float r = 0.0, delta = 0.0, alpha = 1.0;
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          r = dot(cxy, cxy);
          if (r > 1.0) {
            discard;
          }
          alpha = 1.0 - smoothstep(0.1, 1.0, r);
          gl_FragColor = vec4(vColor, alpha * opacity);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Relational network nodes
    const nodes: THREE.Mesh[] = [];
    const connections: THREE.Line[] = [];

    sceneRef.current = { scene, camera, renderer, logoGroup, particles, connections, nodes };

    // Award-winning animation timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }
    });

    // Phase 1: Logo materialization (2s)
    timeline
      .to({}, { duration: 0.5 })
      .add(() => setPhase(0))
      .to(logoGroup.scale, {
        x: 1, y: 1, z: 1,
        duration: 2,
        ease: "elastic.out(1, 0.3)"
      })
      .to(coreMaterial, {
        emissiveIntensity: 0.8,
        duration: 1,
        yoyo: true,
        repeat: 3
      }, "-=1.5")
      
      // Phase 2: Particle assembly (2.5s)
      .add(() => setPhase(1))
      .to(particleMaterial.uniforms.opacity, {
        value: 1,
        duration: 1,
        ease: "power2.out"
      })
      .add(() => {
        // Animate particles towards logo
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const targetRadius = 2.5 + Math.random() * 1.5;
          const angle = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          gsap.to(positions, {
            [i * 3]: targetRadius * Math.cos(angle) * Math.sin(phi),
            [i * 3 + 1]: targetRadius * Math.sin(angle) * Math.sin(phi),
            [i * 3 + 2]: targetRadius * Math.cos(phi),
            duration: 2.5,
            delay: Math.random() * 0.5,
            ease: "power2.inOut",
            onUpdate: () => {
              particles.geometry.attributes.position.needsUpdate = true;
            }
          });
        }
      }, "-=0.5")

      // Phase 3: Neural network emergence (2s)
      .add(() => setPhase(2), "+=1")
      .add(() => {
        // Create neural network nodes
        for (let i = 0; i < 50; i++) {
          const nodeGeometry = new THREE.SphereGeometry(0.08, 12, 12);
          const nodeMaterial = new THREE.MeshPhysicalMaterial({
            color: i % 3 === 0 ? 0x8000ff : (i % 3 === 1 ? 0x00f0ff : 0xff4081),
            emissive: i % 3 === 0 ? 0x4000aa : (i % 3 === 1 ? 0x0088bb : 0xaa2055),
            emissiveIntensity: 0.6,
            metalness: 0.9,
            roughness: 0.1,
          });
          
          const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
          const radius = 3 + Math.random() * 2;
          const angle = Math.random() * Math.PI * 2;
          const height = (Math.random() - 0.5) * 4;
          
          node.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          );
          
          node.scale.set(0, 0, 0);
          nodes.push(node);
          scene.add(node);
          
          gsap.to(node.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5,
            delay: i * 0.02,
            ease: "back.out(1.7)"
          });
        }
      })

      // Phase 4: Quantum connections (2s)
      .add(() => setPhase(3), "+=0.5")
      .add(() => {
        // Create connections between nodes and logo
        nodes.forEach((node, i) => {
          if (Math.random() > 0.4) {
            const points = [
              node.position.clone(),
              logoGroup.position.clone().add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
              ))
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
              color: i % 2 === 0 ? 0x8000ff : 0x00f0ff,
              opacity: 0,
              transparent: true,
              linewidth: 2
            });
            
            const connection = new THREE.Line(geometry, material);
            connections.push(connection);
            scene.add(connection);
            
            gsap.to(material, {
              opacity: 0.6,
              duration: 0.8,
              delay: Math.random() * 0.5,
              ease: "power2.out"
            });
          }
        });
      })

      // Phase 5: Final transformation (2s)
      .add(() => setPhase(4), "+=1")
      .to(logoCore.material, {
        emissiveIntensity: 1.2,
        duration: 1,
        ease: "power2.inOut"
      })
      .to(camera.position, {
        z: 12,
        duration: 2,
        ease: "power2.inOut"
      }, "-=1")
      .to(logoGroup.rotation, {
        y: Math.PI * 2,
        duration: 2,
        ease: "power2.inOut"
      }, "-=2");

    // Enhanced render loop with post-processing effects
    let animationId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      
      // Update particle material time uniform
      if (particleMaterial.uniforms.time) {
        particleMaterial.uniforms.time.value = time;
      }
      
      // Animate orbit elements
      orbitElements.forEach((element, i) => {
        const speed = 0.5 + i * 0.1;
        const radius = 1.5 + Math.sin(time * speed) * 0.2;
        const angle = time * speed + (i / orbitElements.length) * Math.PI * 2;
        
        element.position.x = Math.cos(angle) * radius;
        element.position.y = Math.sin(angle * 0.5) * 0.3;
        element.position.z = Math.sin(angle) * radius;
      });
      
      // Subtle camera movement
      camera.position.x = Math.sin(time * 0.1) * 0.5;
      camera.position.y = Math.cos(time * 0.1) * 0.3;
      camera.lookAt(0, 0, 0);
      
      // Animate lighting
      spotLight.intensity = 2 + Math.sin(time * 2) * 0.5;
      rimLight.intensity = 1 + Math.cos(time * 1.5) * 0.3;
      
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-base-deep via-base-deep-lighter to-base-deep"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="w-[800px] h-[600px] max-w-[95vw] max-h-[70vh] rounded-2xl shadow-2xl" 
        />
        
        {/* Enhanced UI overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top branding */}
          <motion.div 
            className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center gap-3 px-6 py-3 glass-morph rounded-full">
              <img 
                src="/kumo-logo-pink.svg" 
                alt="KumoRFM" 
                className="h-8 w-auto opacity-90" 
              />
              <div className="h-6 w-px bg-highlight-interactive/30" />
              <span className="text-text-primary/90 text-lg font-heading tracking-wide">
                KumoRFM
              </span>
            </div>
          </motion.div>

          {/* Bottom status and progress */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center min-w-96">
            <motion.p 
              key={phase}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-text-primary/80 text-sm tracking-widest uppercase mb-6 font-heading"
            >
              {phases[phase]}
            </motion.p>
            
            {/* Enhanced progress bar */}
            <div className="relative w-80 h-2 bg-base-deep-lighter/50 rounded-full mx-auto overflow-hidden backdrop-blur-sm border border-highlight-interactive/20">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-primary via-highlight-interactive to-accent-primary-lighter rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(phase + 1) * 20}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full" />
            </div>
            
            {/* Powered by text */}
            <motion.div 
              className="mt-8 flex items-center justify-center gap-3 text-xs text-text-secondary/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse" />
              <span className="tracking-wider font-heading">
                Powered by Relational Foundation Model Technology
              </span>
              <div className="w-2 h-2 bg-highlight-interactive rounded-full animate-pulse" />
            </motion.div>
          </div>

          {/* Ambient glow effects */}
          <div className="absolute inset-0 bg-gradient-radial from-accent-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 transform -translate-x-1/2 -translate-y-1/2 bg-highlight-interactive/3 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};