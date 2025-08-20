import React, { useState, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Network, Share2, Eye, Activity, Zap, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';

interface NetworkVisualizationWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

interface NetworkNode {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'tertiary';
  connections: number;
  activity: number;
}

interface NetworkStats {
  totalNodes: number;
  totalLinks: number;
  activeConnections: number;
  networkHealth: number;
}

export function NetworkVisualizationWidget({ size = 'full' }: NetworkVisualizationWidgetProps) {
  const [view3D, setView3D] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalNodes: 127,
    totalLinks: 284,
    activeConnections: 43,
    networkHealth: 98
  });
  const { industryMode } = useAppStore();

  const generateNetworkNodes = (): NetworkNode[] => {
    const nodeTypes = industryMode === 'fashion' ? 
      ['Customers', 'Products', 'Campaigns', 'Influencers', 'Suppliers', 'Stores'] :
      ['Fans', 'Artists', 'Venues', 'Playlists', 'Events', 'Labels'];
    
    return nodeTypes.map((type, index) => ({
      id: `node-${index}`,
      label: type,
      type: index < 2 ? 'primary' : index < 4 ? 'secondary' : 'tertiary',
      connections: Math.floor(Math.random() * 50) + 10,
      activity: Math.floor(Math.random() * 100)
    }));
  };

  const [networkNodes] = useState(generateNetworkNodes());

  const renderMiniVersion = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Network</span>
        </div>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
          {networkStats.networkHealth}% Health
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
          <div className="text-lg font-bold text-blue-400">{networkStats.totalNodes}</div>
          <div className="text-xs text-muted-foreground">Nodes</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
          <div className="text-lg font-bold text-purple-400">{networkStats.totalLinks}</div>
          <div className="text-xs text-muted-foreground">Links</div>
        </div>
      </div>
      
      <div className="relative h-24 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs text-muted-foreground">Network Graph</div>
        </div>
        {/* Animated network visualization placeholder */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/60 rounded-full"
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${30 + Math.sin(i) * 20}%`
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderFullVersion = () => (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">Network Graph</h4>
          <p className="text-sm text-muted-foreground">
            {industryMode === 'fashion' ? 'Customer and product relationships' : 'Artist and fan connections'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={view3D ? "default" : "ghost"}
            size="sm"
            onClick={() => setView3D(!view3D)}
          >
            3D
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">{networkStats.totalNodes}</div>
            <div className="text-xs text-muted-foreground">Nodes</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Share2 className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-purple-400">{networkStats.totalLinks}</div>
            <div className="text-xs text-muted-foreground">Links</div>
          </div>
        </div>
      </div>

      {/* Main Network Visualization */}
      <div className="flex-1 relative bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 rounded-xl overflow-hidden border border-primary/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,69,255,0.1)_0%,transparent_70%)]" />
        
        {/* Explore Network Button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 px-8 py-3"
            >
              <Network className="h-5 w-5 mr-2" />
              Explore Network
            </Button>
          </motion.div>
        </div>

        {/* Animated Network Nodes */}
        <div className="absolute inset-0">
          {networkNodes.map((node, i) => (
            <motion.div
              key={node.id}
              className={`absolute cursor-pointer group rounded-full backdrop-blur-sm border border-white/20 ${
                node.type === 'primary' ? 'w-4 h-4' : 
                node.type === 'secondary' ? 'w-3 h-3' : 'w-2 h-2'
              }`}
              style={{
                left: `${15 + (i * 12)}%`,
                top: `${20 + Math.sin(i * 1.5) * 30}%`,
                background: node.type === 'primary' ? 
                  'linear-gradient(135deg, #8B5CF6, #EC4899)' :
                  node.type === 'secondary' ?
                  'linear-gradient(135deg, #3B82F6, #8B5CF6)' :
                  'linear-gradient(135deg, #06B6D4, #3B82F6)'
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
              onClick={() => setSelectedNode(node)}
            >
              {/* Connection Lines */}
              {i < networkNodes.length - 1 && (
                <motion.div
                  className="absolute w-16 h-px bg-gradient-to-r from-primary/40 to-transparent"
                  style={{
                    left: '100%',
                    top: '50%',
                    transformOrigin: 'left center',
                    transform: `rotate(${(i * 30) % 180 - 90}deg)`
                  }}
                  animate={{
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              )}
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                bg-black/80 backdrop-blur-sm border border-white/20 rounded px-2 py-1 text-xs text-white
                opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                {node.label}: {node.connections} connections
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Activity Indicators */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`activity-${i}`}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-card/50 border border-border rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-foreground">{selectedNode.label}</h5>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedNode(null)}
            >
              ×
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Connections:</span>
              <span className="ml-2 font-medium">{selectedNode.connections}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Activity:</span>
              <span className="ml-2 font-medium">{selectedNode.activity}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <WidgetContainer
      title="Network Visualization"
      icon={Network}
      size={size}
      controls={
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      }
    >
      {size === 'mini' ? renderMiniVersion() : renderFullVersion()}
    </WidgetContainer>
  );
}