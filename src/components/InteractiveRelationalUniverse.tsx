import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NodeData {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  connections: number[];
  personality: 'explorer' | 'connector' | 'cluster' | 'wanderer';
  energy: number;
  size: number;
  color: THREE.Color;
}

export const InteractiveRelationalUniverse: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const connectionsRef = useRef<THREE.Group>(null);
  const { mouse, viewport } = useThree();
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [isMouseActive, setIsMouseActive] = useState(false);

  // Initialize nodes with personalities and flocking behavior
  const initializeNodes = useMemo(() => {
    const nodeCount = 800;
    const newNodes: NodeData[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const personality = ['explorer', 'connector', 'cluster', 'wanderer'][Math.floor(Math.random() * 4)] as NodeData['personality'];
      
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 3 + Math.random() * 2;
      
      const position = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      );
      
      // Personality affects color and behavior
      let color: THREE.Color;
      let size: number;
      
      switch (personality) {
        case 'explorer':
          color = new THREE.Color().setHSL(0.75, 0.8, 0.7); // Purple
          size = 0.008;
          break;
        case 'connector':
          color = new THREE.Color().setHSL(0.6, 0.9, 0.6); // Blue
          size = 0.012;
          break;
        case 'cluster':
          color = new THREE.Color().setHSL(0.9, 0.8, 0.6); // Pink
          size = 0.006;
          break;
        default: // wanderer
          color = new THREE.Color().setHSL(0.5, 0.7, 0.8); // Cyan
          size = 0.004;
      }
      
      newNodes.push({
        id: i,
        position,
        velocity,
        connections: [],
        personality,
        energy: Math.random(),
        size,
        color
      });
    }
    
    // Create connections based on proximity and personality compatibility
    newNodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 5) + 2;
      const nearbyNodes = newNodes
        .filter((other, j) => j !== i)
        .sort((a, b) => 
          node.position.distanceTo(a.position) - node.position.distanceTo(b.position)
        )
        .slice(0, connectionCount * 2);
      
      for (let j = 0; j < Math.min(connectionCount, nearbyNodes.length); j++) {
        const other = nearbyNodes[j];
        if (Math.random() > 0.3 && node.position.distanceTo(other.position) < 2) {
          node.connections.push(other.id);
        }
      }
    });
    
    return newNodes;
  }, []);

  useEffect(() => {
    setNodes(initializeNodes);
  }, [initializeNodes]);

  // Generate positions and colors for Points component
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(nodes.length * 3);
    const colors = new Float32Array(nodes.length * 3);
    const sizes = new Float32Array(nodes.length);
    
    nodes.forEach((node, i) => {
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;
      
      colors[i * 3] = node.color.r;
      colors[i * 3 + 1] = node.color.g;
      colors[i * 3 + 2] = node.color.b;
      
      sizes[i] = node.size;
    });
    
    return [positions, colors, sizes];
  }, [nodes]);

  // Advanced flocking algorithm with cursor interaction
  useFrame((state) => {
    if (!pointsRef.current || nodes.length === 0) return;
    
    const time = state.clock.getElapsedTime();
    const mousePos = new THREE.Vector3(
      (mouse.x * viewport.width) / 2, 
      (mouse.y * viewport.height) / 2, 
      0
    );
    
    // Detect mouse activity
    const mouseMovement = mousePos.length();
    setIsMouseActive(mouseMovement > 0.1);
    
    // Update nodes with flocking behavior
    const updatedNodes = nodes.map((node, i) => {
      const newNode = { ...node };
      
      // Flocking forces
      let separation = new THREE.Vector3();
      let alignment = new THREE.Vector3();
      let cohesion = new THREE.Vector3();
      let neighborCount = 0;
      
      // Mouse attraction/repulsion based on personality
      const mouseDistance = node.position.distanceTo(mousePos);
      let mouseForce = new THREE.Vector3();
      
      if (mouseDistance < 3 && isMouseActive) {
        const direction = new THREE.Vector3().subVectors(mousePos, node.position).normalize();
        
        switch (node.personality) {
          case 'explorer':
            mouseForce = direction.multiplyScalar(0.002); // Attracted
            break;
          case 'connector':
            mouseForce = direction.multiplyScalar(0.003); // Strongly attracted
            break;
          case 'cluster':
            mouseForce = direction.multiplyScalar(-0.001); // Slightly repelled
            break;
          case 'wanderer':
            mouseForce = direction.multiplyScalar(0.001); // Weakly attracted
            break;
        }
        
        // Add gravitational ripple effect
        const rippleStrength = Math.sin(time * 3 + mouseDistance * 2) * 0.001;
        mouseForce.add(direction.multiplyScalar(rippleStrength));
      }
      
      // Calculate flocking forces from nearby nodes
      nodes.forEach((other, j) => {
        if (i === j) return;
        
        const distance = node.position.distanceTo(other.position);
        const direction = new THREE.Vector3().subVectors(other.position, node.position);
        
        if (distance < 1.5) {
          // Separation - avoid crowding
          if (distance < 0.5) {
            separation.add(direction.normalize().multiplyScalar(-0.001));
          }
          
          // Alignment - steer towards average heading
          alignment.add(other.velocity);
          
          // Cohesion - steer towards average position
          cohesion.add(other.position);
          
          neighborCount++;
        }
      });
      
      if (neighborCount > 0) {
        alignment.divideScalar(neighborCount).normalize().multiplyScalar(0.0005);
        cohesion.divideScalar(neighborCount).sub(node.position).normalize().multiplyScalar(0.0003);
      }
      
      // Personality-specific behaviors
      let personalityForce = new THREE.Vector3();
      
      switch (node.personality) {
        case 'explorer':
          // Tend to move outward
          personalityForce = node.position.clone().normalize().multiplyScalar(0.0002);
          break;
        case 'connector':
          // Seek center and other nodes
          personalityForce = node.position.clone().normalize().multiplyScalar(-0.0001);
          break;
        case 'cluster':
          // Form tight groups
          personalityForce = cohesion.multiplyScalar(2);
          break;
        case 'wanderer':
          // Random movement
          personalityForce = new THREE.Vector3(
            (Math.random() - 0.5) * 0.0001,
            (Math.random() - 0.5) * 0.0001,
            (Math.random() - 0.5) * 0.0001
          );
          break;
      }
      
      // Apply all forces
      newNode.velocity.add(separation)
        .add(alignment)
        .add(cohesion)
        .add(personalityForce)
        .add(mouseForce);
      
      // Limit velocity
      if (newNode.velocity.length() > 0.01) {
        newNode.velocity.normalize().multiplyScalar(0.01);
      }
      
      // Update position
      newNode.position.add(newNode.velocity);
      
      // Breathing effect - nodes pulse with data "heartbeat"
      const heartbeat = Math.sin(time * 2 + i * 0.1) * 0.3 + 0.7;
      newNode.energy = heartbeat;
      
      // Update color based on energy and connections
      const energyHue = 0.6 + newNode.energy * 0.3;
      newNode.color.setHSL(energyHue, 0.8, 0.6);
      
      // Keep nodes in bounds with elastic boundaries
      const maxDistance = 6;
      if (newNode.position.length() > maxDistance) {
        const returnForce = newNode.position.clone().normalize().multiplyScalar(-0.005);
        newNode.velocity.add(returnForce);
      }
      
      return newNode;
    });
    
    setNodes(updatedNodes);
    
    // Update positions for rendering
    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const colorAttribute = pointsRef.current.geometry.attributes.color;
    
    updatedNodes.forEach((node, i) => {
      positionAttribute.setXYZ(i, node.position.x, node.position.y, node.position.z);
      colorAttribute.setXYZ(i, node.color.r, node.color.g, node.color.b);
    });
    
    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
    
    // Create dynamic connections for data packet visualization
    if (connectionsRef.current && Math.floor(time * 10) % 10 === 0) {
      connectionsRef.current.clear();
      
      nodes.forEach((node) => {
        node.connections.forEach((connectionId) => {
          const other = nodes[connectionId];
          if (!other) return;
          
          const distance = node.position.distanceTo(other.position);
          if (distance < 2 && Math.random() > 0.8) {
            // Create data packet trail
            const points = [node.position.clone(), other.position.clone()];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
              color: new THREE.Color().setHSL(0.7, 0.8, 0.6),
              transparent: true,
              opacity: 0.3 + Math.sin(time * 5) * 0.2,
              linewidth: 2
            });
            
            const line = new THREE.Line(geometry, material);
            connectionsRef.current.add(line);
          }
        });
      });
    }
  });

  return (
    <group>
      {/* Main particle system */}
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.006}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Dynamic connections */}
      <group ref={connectionsRef} />
      
      {/* Ambient particle field */}
      <Points positions={useMemo(() => {
        const positions = new Float32Array(200 * 3);
        for (let i = 0; i < 200; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
      }, [])} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#6366f1"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};
