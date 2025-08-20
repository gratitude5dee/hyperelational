import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Enhanced3DGraphVisualizer } from '@/components/Enhanced3DGraphVisualizer';
import { GraphMetricsDashboard } from '@/components/GraphMetricsDashboard';
import { GraphControlPanel, LayoutMode } from '@/components/GraphControlPanel';
import { AIInsightsPanel } from '@/components/AIInsightsPanel';
import { DualModeToggle } from '@/components/DualModeToggle';
import { useAppStore } from '@/stores/useAppStore';
import { Activity, Network, Brain, Sparkles, Zap } from 'lucide-react';

export function GraphPage() {
  const { currentProject } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('3d-force');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filterTypes, setFilterTypes] = useState<Set<string>>(new Set());
  const [mockData, setMockData] = useState({ 
    nodes: [
      { id: '1', type: 'customer', label: 'Customer 1', size: 10, color: '#3b82f6', position: [0, 0, 0] as [number, number, number], connections: 3, importance: 0.8, metadata: {} },
      { id: '2', type: 'product', label: 'Product 1', size: 8, color: '#8b5cf6', position: [1, 1, 1] as [number, number, number], connections: 5, importance: 0.6, metadata: {} }
    ], 
    edges: [
      { source: '1', target: '2', strength: 0.7, type: 'purchase', sourcePos: [0, 0, 0] as [number, number, number], targetPos: [1, 1, 1] as [number, number, number] }
    ] 
  });

  // Initialize filter types immediately with mock data
  React.useEffect(() => {
    setFilterTypes(new Set(['customer', 'product']));
  }, []);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleLayoutChange = (mode: LayoutMode) => setLayoutMode(mode);
  const handleAnimationSpeedChange = (speed: number) => setAnimationSpeed(speed);
  const handleToggleNodeType = (type: string) => {
    const newTypes = new Set(filterTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setFilterTypes(newTypes);
  };
  const handleReset = () => {
    setSelectedNode(null);
    setIsPlaying(false);
  };
  const handleExport = () => {
    console.log('Export functionality would be implemented here');
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="glass-card p-3 rounded-xl">
            <Network className="h-8 w-8 text-primary animate-glow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              3D Relationship Explorer
              <Sparkles className="h-6 w-6 text-secondary" />
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI-powered network visualization with real-time insights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">
                {currentProject?.type === 'fashion_ecommerce' ? 'E-Commerce' : 'Creative Hub'} Mode
              </span>
            </div>
          </div>
          <DualModeToggle />
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Controls Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-3 space-y-4 overflow-y-auto scrollbar-thin"
        >
          <GraphControlPanel
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            layoutMode={layoutMode}
            onLayoutChange={handleLayoutChange}
            animationSpeed={animationSpeed}
            onAnimationSpeedChange={handleAnimationSpeedChange}
            nodeTypes={Array.from(filterTypes)}
            visibleNodeTypes={filterTypes}
            onToggleNodeType={handleToggleNodeType}
            onReset={handleReset}
            onExport={handleExport}
            totalNodes={mockData.nodes.length}
            totalEdges={mockData.edges.length}
          />
        </motion.div>

        {/* Center 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-6 glass-card rounded-2xl overflow-hidden relative"
        >
          <div className="absolute top-4 left-4 z-10">
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-foreground font-medium">
                  {layoutMode.replace('-', ' ').toUpperCase()} Layout
                </span>
              </div>
            </div>
          </div>
          
          <Enhanced3DGraphVisualizer />
          
          {/* Overlay Controls */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="glass-card px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                <span>Real-time Updates</span>
                {isPlaying && <div className="w-1 h-1 rounded-full bg-success animate-pulse" />}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Analytics & AI Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-3 space-y-4 overflow-y-auto scrollbar-thin"
        >
          {/* Metrics Dashboard */}
          <GraphMetricsDashboard
            nodes={mockData.nodes}
            edges={mockData.edges}
            selectedNode={selectedNode}
            filterTypes={filterTypes}
          />
          
          {/* AI Insights Panel */}
          <AIInsightsPanel
            nodes={mockData.nodes}
            edges={mockData.edges}
            selectedNode={selectedNode}
            projectType={currentProject?.type || 'fashion_ecommerce'}
          />
        </motion.div>
      </div>
    </div>
  );
}