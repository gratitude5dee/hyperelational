import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Filter,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface GraphNode {
  id: string;
  label: string;
  type: 'customer' | 'product' | 'fan' | 'artist' | 'venue' | 'song';
  size: number;
  color: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  strength: number;
  type: 'purchase' | 'influence' | 'similarity' | 'interaction';
}

export function GraphVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeStep, setTimeStep] = useState([0]);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [visibleNodeTypes, setVisibleNodeTypes] = useState<Set<string>>(new Set(['customer', 'product', 'fan', 'artist']));
  const { currentProject } = useAppStore();

  // Mock data generator
  const generateMockData = () => {
    const isEcommerce = currentProject?.type === 'fashion_ecommerce';
    
    if (isEcommerce) {
      const customers: GraphNode[] = Array.from({ length: 50 }, (_, i) => ({
        id: `customer-${i}`,
        label: `Customer ${i + 1}`,
        type: 'customer',
        size: Math.random() * 20 + 10,
        color: '#3b82f6',
        x: Math.random() * 800,
        y: Math.random() * 600,
      }));

      const products: GraphNode[] = Array.from({ length: 30 }, (_, i) => ({
        id: `product-${i}`,
        label: `Product ${i + 1}`,
        type: 'product',
        size: Math.random() * 15 + 8,
        color: '#8b5cf6',
        x: Math.random() * 800,
        y: Math.random() * 600,
      }));

      const edges: GraphEdge[] = [];
      customers.forEach(customer => {
        const numPurchases = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < numPurchases; i++) {
          const product = products[Math.floor(Math.random() * products.length)];
          edges.push({
            source: customer.id,
            target: product.id,
            strength: Math.random(),
            type: 'purchase'
          });
        }
      });

      return { nodes: [...customers, ...products], edges };
    } else {
      // Artist mode
      const fans: GraphNode[] = Array.from({ length: 60 }, (_, i) => ({
        id: `fan-${i}`,
        label: `Fan ${i + 1}`,
        type: 'fan',
        size: Math.random() * 18 + 8,
        color: '#06b6d4',
        x: Math.random() * 800,
        y: Math.random() * 600,
      }));

      const songs: GraphNode[] = Array.from({ length: 20 }, (_, i) => ({
        id: `song-${i}`,
        label: `Song ${i + 1}`,
        type: 'song',
        size: Math.random() * 25 + 10,
        color: '#10b981',
        x: Math.random() * 800,
        y: Math.random() * 600,
      }));

      const venues: GraphNode[] = Array.from({ length: 10 }, (_, i) => ({
        id: `venue-${i}`,
        label: `Venue ${i + 1}`,
        type: 'venue',
        size: Math.random() * 30 + 15,
        color: '#f59e0b',
        x: Math.random() * 800,
        y: Math.random() * 600,
      }));

      const edges: GraphEdge[] = [];
      fans.forEach(fan => {
        // Fan-song interactions
        const numInteractions = Math.floor(Math.random() * 8) + 1;
        for (let i = 0; i < numInteractions; i++) {
          const song = songs[Math.floor(Math.random() * songs.length)];
          edges.push({
            source: fan.id,
            target: song.id,
            strength: Math.random(),
            type: 'interaction'
          });
        }

        // Fan-venue interactions
        if (Math.random() > 0.7) {
          const venue = venues[Math.floor(Math.random() * venues.length)];
          edges.push({
            source: fan.id,
            target: venue.id,
            strength: Math.random(),
            type: 'interaction'
          });
        }
      });

      return { nodes: [...fans, ...songs, ...venues], edges };
    }
  };

  const [graphData, setGraphData] = useState(generateMockData());

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom
    ctx.save();
    ctx.scale(zoom, zoom);

    // Draw edges
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
    ctx.lineWidth = 1;
    
    graphData.edges.forEach(edge => {
      const sourceNode = graphData.nodes.find(n => n.id === edge.source);
      const targetNode = graphData.nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode && 
          visibleNodeTypes.has(sourceNode.type) && 
          visibleNodeTypes.has(targetNode.type)) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    graphData.nodes.forEach(node => {
      if (!visibleNodeTypes.has(node.type)) return;

      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
      ctx.fill();

      // Highlight selected node
      if (selectedNode?.id === node.id) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw label for larger nodes
      if (node.size > 15) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.size + 15);
      }
    });

    ctx.restore();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;

    // Find clicked node
    const clickedNode = graphData.nodes.find(node => {
      if (!visibleNodeTypes.has(node.type)) return false;
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.size / 2;
    });

    setSelectedNode(clickedNode || null);
  };

  const toggleNodeType = (nodeType: string) => {
    const newVisibleTypes = new Set(visibleNodeTypes);
    if (newVisibleTypes.has(nodeType)) {
      newVisibleTypes.delete(nodeType);
    } else {
      newVisibleTypes.add(nodeType);
    }
    setVisibleNodeTypes(newVisibleTypes);
  };

  const simulateForces = () => {
    const nodes = [...graphData.nodes];
    
    // Simple force simulation
    nodes.forEach(node => {
      if (!node.vx) node.vx = 0;
      if (!node.vy) node.vy = 0;
      
      // Apply small random movement
      node.vx += (Math.random() - 0.5) * 0.1;
      node.vy += (Math.random() - 0.5) * 0.1;
      
      // Damping
      node.vx *= 0.99;
      node.vy *= 0.99;
      
      // Update position
      node.x += node.vx;
      node.y += node.vy;
      
      // Keep within bounds
      node.x = Math.max(node.size, Math.min(800 - node.size, node.x));
      node.y = Math.max(node.size, Math.min(600 - node.size, node.y));
    });

    setGraphData(prev => ({ ...prev, nodes }));
  };

  const animate = () => {
    if (isPlaying) {
      simulateForces();
    }
    drawGraph();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, zoom, visibleNodeTypes, selectedNode]);

  useEffect(() => {
    setGraphData(generateMockData());
  }, [currentProject?.type]);

  const nodeTypes = Array.from(new Set(graphData.nodes.map(n => n.type)));

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGraphData(generateMockData())}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground min-w-[4ch] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Node Type Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {nodeTypes.map(nodeType => (
          <Button
            key={nodeType}
            variant={visibleNodeTypes.has(nodeType) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleNodeType(nodeType)}
            className="gap-2"
          >
            {visibleNodeTypes.has(nodeType) ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Graph Canvas */}
        <div className="lg:col-span-3">
          <GlassCard className="p-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-auto border border-border/20 rounded-lg cursor-pointer"
              onClick={handleCanvasClick}
            />
          </GlassCard>
        </div>

        {/* Node Details Sidebar */}
        <div className="space-y-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-3">Network Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nodes</span>
                <span className="text-sm font-medium">{graphData.nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Connections</span>
                <span className="text-sm font-medium">{graphData.edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Visible</span>
                <span className="text-sm font-medium">
                  {graphData.nodes.filter(n => visibleNodeTypes.has(n.type)).length}
                </span>
              </div>
            </div>
          </GlassCard>

          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-4">
                <h3 className="font-semibold mb-3">Node Details</h3>
                <div className="space-y-2">
                  <div>
                    <Badge variant="secondary">{selectedNode.type}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">{selectedNode.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Importance</span>
                    <span className="text-sm font-medium">{Math.round(selectedNode.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Connections</span>
                    <span className="text-sm font-medium">
                      {graphData.edges.filter(e => 
                        e.source === selectedNode.id || e.target === selectedNode.id
                      ).length}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          <Button variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Export Graph
          </Button>
        </div>
      </div>
    </div>
  );
}
