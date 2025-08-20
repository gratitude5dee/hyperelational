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
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  // Generate comprehensive mock data for demonstration
  React.useEffect(() => {
    const mockData = generateComprehensiveMockData();
    setGraphData(mockData);
    setFilterTypes(new Set(mockData.nodes.map(n => n.type)));
  }, []);

  const generateComprehensiveMockData = () => {
    const nodes: any[] = [];
    const edges: any[] = [];

    // E-commerce scenario with realistic relationships
    const customerNames = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Wilson'];
    const productNames = ['Designer Jeans', 'Silk Blouse', 'Leather Jacket', 'Summer Dress', 'Sneakers', 'Handbag', 'Sunglasses', 'Wool Sweater', 'Boots', 'Scarf'];
    const categories = ['Clothing', 'Accessories', 'Footwear', 'Outerwear'];

    // Create customers with varying characteristics
    customerNames.forEach((name, i) => {
      nodes.push({
        id: `customer-${i}`,
        label: name,
        type: 'customer',
        size: 15 + Math.random() * 10,
        color: '#3b82f6',
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ] as [number, number, number],
        connections: 0,
        importance: 0.3 + Math.random() * 0.7,
        metadata: {
          age: 20 + Math.floor(Math.random() * 40),
          lifetimeValue: 100 + Math.random() * 2000,
          segment: ['VIP', 'Regular', 'New'][Math.floor(Math.random() * 3)],
          lastPurchase: `${Math.floor(Math.random() * 30)} days ago`
        }
      });
    });

    // Create products
    productNames.forEach((name, i) => {
      nodes.push({
        id: `product-${i}`,
        label: name,
        type: 'product',
        size: 12 + Math.random() * 8,
        color: '#8b5cf6',
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ] as [number, number, number],
        connections: 0,
        importance: 0.2 + Math.random() * 0.8,
        metadata: {
          price: 50 + Math.random() * 300,
          rating: 3 + Math.random() * 2,
          category: categories[Math.floor(Math.random() * categories.length)],
          sales: Math.floor(Math.random() * 100)
        }
      });
    });

    // Create categories
    categories.forEach((name, i) => {
      nodes.push({
        id: `category-${i}`,
        label: name,
        type: 'category',
        size: 20 + Math.random() * 10,
        color: '#10b981',
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ] as [number, number, number],
        connections: 0,
        importance: 0.6 + Math.random() * 0.4,
        metadata: {
          totalProducts: Math.floor(Math.random() * 20),
          revenue: 1000 + Math.random() * 10000
        }
      });
    });

    // Create orders
    for (let i = 0; i < 15; i++) {
      nodes.push({
        id: `order-${i}`,
        label: `Order #${1000 + i}`,
        type: 'order',
        size: 8 + Math.random() * 6,
        color: '#f59e0b',
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ] as [number, number, number],
        connections: 0,
        importance: 0.1 + Math.random() * 0.5,
        metadata: {
          total: 50 + Math.random() * 500,
          status: ['completed', 'pending', 'shipped'][Math.floor(Math.random() * 3)],
          date: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`
        }
      });
    }

    // Create realistic relationships
    const customerNodes = nodes.filter(n => n.type === 'customer');
    const productNodes = nodes.filter(n => n.type === 'product');
    const orderNodes = nodes.filter(n => n.type === 'order');
    const categoryNodes = nodes.filter(n => n.type === 'category');

    // Customer-Order relationships
    customerNodes.forEach(customer => {
      const numOrders = 1 + Math.floor(Math.random() * 3);
      const customerOrders = orderNodes.slice(0, numOrders);
      
      customerOrders.forEach(order => {
        edges.push({
          source: customer.id,
          target: order.id,
          strength: 0.7 + Math.random() * 0.3,
          type: 'placed_order',
          sourcePos: customer.position,
          targetPos: order.position
        });
        customer.connections++;
        order.connections++;
      });
    });

    // Order-Product relationships
    orderNodes.forEach(order => {
      const numProducts = 1 + Math.floor(Math.random() * 3);
      const selectedProducts = [];
      
      for (let i = 0; i < numProducts; i++) {
        const product = productNodes[Math.floor(Math.random() * productNodes.length)];
        if (!selectedProducts.includes(product)) {
          selectedProducts.push(product);
          edges.push({
            source: order.id,
            target: product.id,
            strength: 0.6 + Math.random() * 0.4,
            type: 'contains_product',
            sourcePos: order.position,
            targetPos: product.position
          });
          order.connections++;
          product.connections++;
        }
      }
    });

    // Product-Category relationships
    productNodes.forEach(product => {
      const category = categoryNodes[Math.floor(Math.random() * categoryNodes.length)];
      edges.push({
        source: product.id,
        target: category.id,
        strength: 0.8 + Math.random() * 0.2,
        type: 'belongs_to_category',
        sourcePos: product.position,
        targetPos: category.position
      });
      product.connections++;
      category.connections++;
    });

    // Customer-Product direct interests (browsing, wishlist)
    customerNodes.forEach(customer => {
      const numInterests = Math.floor(Math.random() * 5);
      for (let i = 0; i < numInterests; i++) {
        const product = productNodes[Math.floor(Math.random() * productNodes.length)];
        edges.push({
          source: customer.id,
          target: product.id,
          strength: 0.2 + Math.random() * 0.3,
          type: 'interested_in',
          sourcePos: customer.position,
          targetPos: product.position
        });
        customer.connections++;
        product.connections++;
      }
    });

    return { nodes, edges };
  };

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
            totalNodes={graphData.nodes.length}
            totalEdges={graphData.edges.length}
          />
        </motion.div>

        {/* Center Column with Visualization and AI */}
        <div className="col-span-6 space-y-6">
          {/* 3D Graph Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl overflow-hidden relative h-[48rem]"
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
            
            <Enhanced3DGraphVisualizer
              nodes={graphData.nodes}
              edges={graphData.edges}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
              layoutMode={layoutMode}
              animationSpeed={animationSpeed}
              filterTypes={filterTypes}
            />
            
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

          {/* AI Insights Row - Horizontal Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* AI Insights Panel */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Insights</h3>
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              </div>
              
              <AIInsightsPanel
                nodes={graphData.nodes}
                edges={graphData.edges}
                selectedNode={selectedNode}
                projectType={currentProject?.type || 'fashion_ecommerce'}
              />
            </div>

            {/* Ask AI Component */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-secondary" />
                <h3 className="font-semibold">Ask AI</h3>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Ask questions about your graph data and get AI-powered insights.
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Ask about patterns, trends, or insights..." 
                    className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200">
                    Analyze Graph
                  </button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Example: "Which customers have the highest potential value?" or "Show me unusual patterns in the data"
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Metrics Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-3 space-y-4 overflow-y-auto scrollbar-thin"
        >
          {/* Metrics Dashboard */}
          <GraphMetricsDashboard
            nodes={graphData.nodes}
            edges={graphData.edges}
            selectedNode={selectedNode}
            filterTypes={filterTypes}
          />
        </motion.div>
      </div>
    </div>
  );
}