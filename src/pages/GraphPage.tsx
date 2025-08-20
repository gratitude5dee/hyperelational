import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Enhanced3DGraphVisualizer } from '@/components/Enhanced3DGraphVisualizer';
import { GraphMetricsDashboard } from '@/components/GraphMetricsDashboard';
import { GraphControlPanel, LayoutMode } from '@/components/GraphControlPanel';
import { AIInsightsPanel } from '@/components/AIInsightsPanel';
import { DualModeToggle } from '@/components/DualModeToggle';
import { useAppStore } from '@/stores/useAppStore';
import { Activity, Network, Brain, Sparkles, Zap, Palette, Music, TrendingUp, Users } from 'lucide-react';

export function GraphPage() {
  const { industryMode } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('3d-force');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filterTypes, setFilterTypes] = useState<Set<string>>(new Set());
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  // Mode configuration
  const modeConfig = {
    fashion: {
      title: 'Fashion Retail Network',
      subtitle: 'Customer-product relationship mapping with predictive analytics',
      icon: Palette,
      projectType: 'fashion_ecommerce',
      modeLabel: 'Fashion Retail',
      gradient: 'var(--fashion-gradient)',
      cardBg: 'var(--fashion-card-bg)'
    },
    artist: {
      title: 'Artist Network Universe',
      subtitle: 'Superfan connections, streaming patterns & tour optimization insights',
      icon: Music,
      projectType: 'creative_hub',
      modeLabel: 'Artist Management',
      gradient: 'var(--artist-gradient)',
      cardBg: 'var(--artist-card-bg)'
    }
  };

  const config = modeConfig[industryMode];

  // Generate comprehensive mock data based on industry mode
  React.useEffect(() => {
    const mockData = generateComprehensiveMockData(config.projectType);
    setGraphData(mockData);
    setFilterTypes(new Set(mockData.nodes.map(n => n.type)));
  }, [industryMode, config.projectType]);

  const generateComprehensiveMockData = (projectType: string) => {
    const nodes: any[] = [];
    const edges: any[] = [];

    if (projectType === 'creative_hub') {
      // Artist/Creative industry scenario
      const artistNames = ['Taylor Swift', 'Drake', 'Billie Eilish', 'The Weeknd', 'Ariana Grande', 'Ed Sheeran', 'Olivia Rodrigo', 'Harry Styles', 'Dua Lipa', 'Post Malone'];
      const songNames = ['Midnight Dreams', 'City Lights', 'Ocean Waves', 'Electric Nights', 'Golden Hour', 'Neon Glow', 'Starlight', 'Velvet Sky', 'Crystal Rain', 'Phoenix Rise'];
      const fanNames = ['Sarah M.', 'Alex K.', 'Jordan P.', 'Casey L.', 'Morgan T.', 'Riley C.', 'Jamie R.', 'Avery S.', 'Quinn D.', 'Blake H.', 'Parker W.', 'Sage F.', 'River G.', 'Phoenix B.', 'Rowan J.'];
      const venueNames = ['Madison Square Garden', 'Staples Center', 'The Forum', 'Red Rocks', 'Hollywood Bowl', 'First Avenue', 'The Fillmore', 'House of Blues'];

      // Create artists
      artistNames.forEach((name, i) => {
        nodes.push({
          id: `artist-${i}`,
          label: name,
          type: 'artist',
          size: 20 + Math.random() * 15,
          color: '#ef4444',
          position: [
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          ] as [number, number, number],
          connections: 0,
          importance: 0.7 + Math.random() * 0.3,
          metadata: {
            monthlyListeners: Math.floor(1000000 + Math.random() * 50000000),
            genre: ['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'Indie'][Math.floor(Math.random() * 5)],
            totalStreams: Math.floor(100000000 + Math.random() * 900000000),
            fanbaseGrowth: `${Math.floor(Math.random() * 50) + 10}% this month`
          }
        });
      });

      // Create songs
      songNames.forEach((name, i) => {
        nodes.push({
          id: `song-${i}`,
          label: name,
          type: 'song',
          size: 12 + Math.random() * 10,
          color: '#10b981',
          position: [
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          ] as [number, number, number],
          connections: 0,
          importance: 0.3 + Math.random() * 0.7,
          metadata: {
            streams: Math.floor(1000000 + Math.random() * 100000000),
            duration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            rating: 3.5 + Math.random() * 1.5,
            releaseDate: `${2020 + Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`
          }
        });
      });

      // Create fans
      fanNames.forEach((name, i) => {
        nodes.push({
          id: `fan-${i}`,
          label: name,
          type: 'fan',
          size: 8 + Math.random() * 8,
          color: '#06b6d4',
          position: [
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          ] as [number, number, number],
          connections: 0,
          importance: 0.1 + Math.random() * 0.6,
          metadata: {
            age: 16 + Math.floor(Math.random() * 40),
            engagementScore: Math.floor(Math.random() * 100),
            favoriteGenre: ['Pop', 'Hip-Hop', 'Rock', 'Electronic'][Math.floor(Math.random() * 4)],
            concertsAttended: Math.floor(Math.random() * 20)
          }
        });
      });

      // Create venues
      venueNames.forEach((name, i) => {
        nodes.push({
          id: `venue-${i}`,
          label: name,
          type: 'venue',
          size: 15 + Math.random() * 10,
          color: '#f59e0b',
          position: [
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          ] as [number, number, number],
          connections: 0,
          importance: 0.5 + Math.random() * 0.5,
          metadata: {
            capacity: Math.floor(5000 + Math.random() * 50000),
            location: ['New York', 'Los Angeles', 'Chicago', 'Nashville', 'Austin'][Math.floor(Math.random() * 5)],
            rating: 4.0 + Math.random() * 1.0,
            eventsPerYear: Math.floor(50 + Math.random() * 200)
          }
        });
      });

      // Create creative industry relationships
      const artistNodes = nodes.filter(n => n.type === 'artist');
      const songNodes = nodes.filter(n => n.type === 'song');
      const fanNodes = nodes.filter(n => n.type === 'fan');
      const venueNodes = nodes.filter(n => n.type === 'venue');

      // Artist-Song relationships
      artistNodes.forEach(artist => {
        const numSongs = 2 + Math.floor(Math.random() * 4);
        const artistSongs = songNodes.slice(0, numSongs);
        
        artistSongs.forEach(song => {
          edges.push({
            source: artist.id,
            target: song.id,
            strength: 0.8 + Math.random() * 0.2,
            type: 'created_song',
            sourcePos: artist.position,
            targetPos: song.position
          });
          artist.connections++;
          song.connections++;
        });
      });

      // Fan-Artist relationships (following/listening)
      fanNodes.forEach(fan => {
        const numArtists = 1 + Math.floor(Math.random() * 3);
        const followedArtists = artistNodes.slice(0, numArtists);
        
        followedArtists.forEach(artist => {
          edges.push({
            source: fan.id,
            target: artist.id,
            strength: 0.4 + Math.random() * 0.6,
            type: 'follows_artist',
            sourcePos: fan.position,
            targetPos: artist.position
          });
          fan.connections++;
          artist.connections++;
        });
      });

      // Fan-Song relationships (streaming)
      fanNodes.forEach(fan => {
        const numSongs = Math.floor(Math.random() * 5);
        for (let i = 0; i < numSongs; i++) {
          const song = songNodes[Math.floor(Math.random() * songNodes.length)];
          edges.push({
            source: fan.id,
            target: song.id,
            strength: 0.2 + Math.random() * 0.4,
            type: 'streams_song',
            sourcePos: fan.position,
            targetPos: song.position
          });
          fan.connections++;
          song.connections++;
        }
      });

      // Artist-Venue relationships (concerts)
      artistNodes.forEach(artist => {
        const numVenues = Math.floor(Math.random() * 3);
        for (let i = 0; i < numVenues; i++) {
          const venue = venueNodes[Math.floor(Math.random() * venueNodes.length)];
          edges.push({
            source: artist.id,
            target: venue.id,
            strength: 0.6 + Math.random() * 0.4,
            type: 'performed_at',
            sourcePos: artist.position,
            targetPos: venue.position
          });
          artist.connections++;
          venue.connections++;
        }
      });

    } else {
      // E-commerce scenario (existing code)
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

      // Create e-commerce relationships (existing relationship logic)
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
    }

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
          <div 
            className="glass-card p-3 rounded-xl"
            style={{ background: config.cardBg }}
          >
            <config.icon className="h-8 w-8 animate-glow" style={{ color: industryMode === 'fashion' ? '#ff6ab5' : '#8b5cf6' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              {config.title}
              <Sparkles className="h-6 w-6" style={{ color: industryMode === 'fashion' ? '#fbbf24' : '#06b6d4' }} />
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              {config.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="glass-card px-3 py-2 rounded-lg"
            style={{ background: config.cardBg }}
          >
            <div className="flex items-center gap-2 text-sm">
              <Network className="h-4 w-4" style={{ color: industryMode === 'fashion' ? '#ff6ab5' : '#8b5cf6' }} />
              <span className="text-muted-foreground">
                {config.modeLabel} Network
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
          <div style={{ background: config.cardBg }} className="glass-card rounded-xl p-1">
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
          </div>
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

          {/* AI Insights Panel - Center Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6"
            style={{ background: config.cardBg }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5" style={{ color: industryMode === 'fashion' ? '#ff6ab5' : '#8b5cf6' }} />
              <h3 className="font-semibold">
                {industryMode === 'fashion' ? 'Fashion Intelligence' : 'Artist Insights'}
              </h3>
              <Sparkles className="h-4 w-4 animate-pulse" style={{ color: industryMode === 'fashion' ? '#fbbf24' : '#06b6d4' }} />
            </div>
            
            <AIInsightsPanel
              nodes={graphData.nodes}
              edges={graphData.edges}
              selectedNode={selectedNode}
              projectType={config.projectType}
            />
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
          <div style={{ background: config.cardBg }} className="glass-card rounded-xl p-1">
            <GraphMetricsDashboard
              nodes={graphData.nodes}
              edges={graphData.edges}
              selectedNode={selectedNode}
              filterTypes={filterTypes}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}