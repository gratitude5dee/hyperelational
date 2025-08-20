import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { GraphDataService } from '@/services/GraphDataService';

interface GraphNode3D {
  id: string;
  label: string;
  type: string;
  size: number;
  color: string;
  position: [number, number, number];
  connections: number;
  importance: number;
  metadata?: any;
}

interface GraphEdge3D {
  source: string;
  target: string;
  strength: number;
  type: string;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
}

interface GraphVisualizerProps {
  nodes: GraphNode3D[];
  edges: GraphEdge3D[];
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  layoutMode: '3d-force' | '3d-sphere' | '3d-hierarchical' | '2d-force';
  animationSpeed: number;
  filterTypes: Set<string>;
}

function Node3D({ 
  node, 
  isSelected, 
  isHighlighted, 
  onClick 
}: { 
  node: GraphNode3D; 
  isSelected: boolean; 
  isHighlighted: boolean; 
  onClick: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.position[0]) * 0.1;
      
      // Rotation for visual interest
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      // Scale animation on selection/hover
      const targetScale = isSelected ? 1.3 : hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const nodeColor = useMemo(() => {
    if (isSelected) return '#60a5fa'; // blue-400
    if (isHighlighted) return '#34d399'; // emerald-400
    return node.color;
  }, [isSelected, isHighlighted, node.color]);

  return (
    <group position={node.position}>
      <Sphere
        ref={meshRef}
        args={[node.size * 0.02, 16, 16]}
        onClick={() => onClick(node.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={nodeColor} 
          transparent 
          opacity={0.8}
          emissive={nodeColor}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0.1}
        />
      </Sphere>
      
      {(isSelected || hovered) && (
        <Html distanceFactor={10}>
          <div className="glass-card p-2 pointer-events-none whitespace-nowrap">
            <div className="text-xs font-medium text-foreground">{node.label}</div>
            <div className="text-xs text-muted-foreground">{node.type}</div>
            <div className="text-xs text-muted-foreground">{node.connections} connections</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Edge3D({ edge }: { edge: GraphEdge3D }) {
  const points = useMemo(() => [
    new THREE.Vector3(...edge.sourcePos),
    new THREE.Vector3(...edge.targetPos)
  ], [edge.sourcePos, edge.targetPos]);

  return (
    <Line
      points={points}
      color="rgba(255, 255, 255, 0.2)"
      lineWidth={edge.strength * 2}
      transparent
      opacity={0.6}
    />
  );
}

function Scene({ 
  nodes, 
  edges, 
  selectedNode, 
  onNodeSelect, 
  filterTypes 
}: GraphVisualizerProps) {
  // Filter visible nodes and edges
  const visibleNodes = useMemo(() => 
    nodes.filter(node => filterTypes.has(node.type)), 
    [nodes, filterTypes]
  );

  const visibleEdges = useMemo(() => 
    edges.filter(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      return sourceNode && targetNode && 
             filterTypes.has(sourceNode.type) && 
             filterTypes.has(targetNode.type);
    }), 
    [edges, nodes, filterTypes]
  );

  const highlightedNodes = useMemo(() => {
    if (!selectedNode) return new Set();
    const connected = new Set([selectedNode]);
    visibleEdges.forEach(edge => {
      if (edge.source === selectedNode) connected.add(edge.target);
      if (edge.target === selectedNode) connected.add(edge.source);
    });
    return connected;
  }, [selectedNode, visibleEdges]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
      
      {/* Render edges first (behind nodes) */}
      {visibleEdges.map((edge, index) => (
        <Edge3D key={`edge-${index}`} edge={edge} />
      ))}
      
      {/* Render nodes */}
      {visibleNodes.map(node => (
        <Node3D
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          isHighlighted={highlightedNodes.has(node.id) && selectedNode !== node.id}
          onClick={onNodeSelect}
        />
      ))}
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxDistance={50}
        minDistance={5}
      />
    </>
  );
}

interface Enhanced3DGraphVisualizerProps {
  nodes?: GraphNode3D[];
  edges?: GraphEdge3D[];
  selectedNode?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
  layoutMode?: '3d-force' | '3d-sphere' | '3d-hierarchical' | '2d-force';
  animationSpeed?: number;
  filterTypes?: Set<string>;
}

export function Enhanced3DGraphVisualizer({
  nodes: propNodes = [],
  edges: propEdges = [],
  selectedNode: propSelectedNode = null,
  onNodeSelect: propOnNodeSelect = () => {},
  layoutMode: propLayoutMode = '3d-force',
  animationSpeed: propAnimationSpeed = 1,
  filterTypes: propFilterTypes = new Set()
}: Enhanced3DGraphVisualizerProps = {}) {
  const [graphData, setGraphData] = useState<{ nodes: GraphNode3D[]; edges: GraphEdge3D[] }>({ 
    nodes: propNodes, 
    edges: propEdges 
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update internal state when props change
  useEffect(() => {
    if (propNodes.length > 0) {
      setGraphData({ nodes: propNodes, edges: propEdges });
    }
  }, [propNodes, propEdges]);

  // Apply layout algorithm when layout mode changes
  useEffect(() => {
    if (graphData.nodes.length === 0) return;

    const layoutNodes = [...graphData.nodes];
    
    switch (propLayoutMode) {
      case '3d-sphere':
        applySphereLayout(layoutNodes);
        break;
      case '3d-hierarchical':
        applyHierarchicalLayout(layoutNodes);
        break;
      case '3d-force':
      default:
        applyForceLayout(layoutNodes);
        break;
    }

    // Update edge positions
    const layoutEdges = graphData.edges.map(edge => {
      const sourceNode = layoutNodes.find(n => n.id === edge.source);
      const targetNode = layoutNodes.find(n => n.id === edge.target);
      return {
        ...edge,
        sourcePos: sourceNode?.position || [0, 0, 0] as [number, number, number],
        targetPos: targetNode?.position || [0, 0, 0] as [number, number, number],
      };
    });

    setGraphData({ nodes: layoutNodes, edges: layoutEdges });
  }, [propLayoutMode, propNodes.length]);

  const applySphereLayout = (nodes: GraphNode3D[]) => {
    const radius = 8;
    nodes.forEach((node, index) => {
      const phi = Math.acos(-1 + (2 * index) / nodes.length);
      const theta = Math.sqrt(nodes.length * Math.PI) * phi;
      
      node.position = [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ];
    });
  };

  const applyHierarchicalLayout = (nodes: GraphNode3D[]) => {
    const typeGroups: Record<string, GraphNode3D[]> = {};
    nodes.forEach(node => {
      if (!typeGroups[node.type]) typeGroups[node.type] = [];
      typeGroups[node.type].push(node);
    });

    let yOffset = 0;
    Object.entries(typeGroups).forEach(([type, typeNodes]) => {
      typeNodes.forEach((node, index) => {
        const angle = (index / typeNodes.length) * 2 * Math.PI;
        const radius = Math.max(3, typeNodes.length * 0.3);
        
        node.position = [
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius
        ];
      });
      yOffset += 6;
    });
  };

  const applyForceLayout = (nodes: GraphNode3D[]) => {
    // Simple force-directed layout
    for (let iter = 0; iter < 100; iter++) {
      nodes.forEach(node => {
        let fx = 0, fy = 0, fz = 0;
        
        // Repulsion from other nodes
        nodes.forEach(other => {
          if (node.id === other.id) return;
          
          const dx = node.position[0] - other.position[0];
          const dy = node.position[1] - other.position[1];
          const dz = node.position[2] - other.position[2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance > 0) {
            const force = 0.1 / (distance * distance);
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
            fz += (dz / distance) * force;
          }
        });
        
        // Apply forces
        node.position[0] += fx * 0.1;
        node.position[1] += fy * 0.1;
        node.position[2] += fz * 0.1;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background/50 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Scene
          nodes={graphData.nodes}
          edges={graphData.edges}
          selectedNode={propSelectedNode}
          onNodeSelect={propOnNodeSelect}
          layoutMode={propLayoutMode}
          animationSpeed={propAnimationSpeed}
          filterTypes={propFilterTypes}
        />
      </Canvas>
    </div>
  );
}