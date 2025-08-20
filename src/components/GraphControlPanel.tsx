import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Settings,
  Eye,
  EyeOff,
  Layers,
  Zap,
  Grid3x3,
  Circle,
  Network
} from 'lucide-react';

export type LayoutMode = '3d-force' | '3d-sphere' | '3d-hierarchical' | '2d-force';

interface GraphControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  nodeTypes: string[];
  visibleNodeTypes: Set<string>;
  onToggleNodeType: (type: string) => void;
  onReset: () => void;
  onExport: () => void;
  totalNodes: number;
  totalEdges: number;
}

export function GraphControlPanel({
  isPlaying,
  onPlayPause,
  layoutMode,
  onLayoutChange,
  animationSpeed,
  onAnimationSpeedChange,
  nodeTypes,
  visibleNodeTypes,
  onToggleNodeType,
  onReset,
  onExport,
  totalNodes,
  totalEdges
}: GraphControlPanelProps) {
  const layoutModes: { key: LayoutMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      key: '3d-force',
      label: '3D Force',
      icon: <Network className="h-4 w-4" />,
      description: 'Physics-based 3D layout'
    },
    {
      key: '3d-sphere',
      label: '3D Sphere',
      icon: <Circle className="h-4 w-4" />,
      description: 'Spherical distribution'
    },
    {
      key: '3d-hierarchical',
      label: 'Hierarchical',
      icon: <Layers className="h-4 w-4" />,
      description: 'Layered by type'
    },
    {
      key: '2d-force',
      label: '2D Force',
      icon: <Grid3x3 className="h-4 w-4" />,
      description: 'Flat force-directed'
    }
  ];

  const getNodeTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      customer: '#3b82f6',
      product: '#8b5cf6',
      order: '#10b981',
      category: '#f59e0b',
      fan: '#06b6d4',
      artist: '#ef4444',
      song: '#10b981',
      venue: '#f59e0b',
      event: '#8b5cf6',
      merch: '#f59e0b'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="space-y-4">
      {/* Playback Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Animation</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={onPlayPause}
                className="gap-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Speed</span>
                <span className="text-sm text-muted-foreground">{animationSpeed}x</span>
              </div>
              <Slider
                value={[animationSpeed]}
                onValueChange={(value) => onAnimationSpeedChange(value[0])}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Layout Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold">Layout Mode</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {layoutModes.map((mode) => (
              <Button
                key={mode.key}
                variant={layoutMode === mode.key ? "default" : "outline"}
                size="sm"
                onClick={() => onLayoutChange(mode.key)}
                className="justify-start gap-2 h-auto p-3"
              >
                {mode.icon}
                <div className="text-left">
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-xs opacity-75">{mode.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Node Type Filters */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Node Types</h3>
          </div>
          
          <div className="space-y-2">
            {nodeTypes.map(type => (
              <Button
                key={type}
                variant={visibleNodeTypes.has(type) ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleNodeType(type)}
                className="w-full justify-start gap-2"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getNodeTypeColor(type) }}
                />
                {visibleNodeTypes.has(type) ? 
                  <Eye className="h-3 w-3" /> : 
                  <EyeOff className="h-3 w-3" />
                }
                <span className="capitalize">{type}</span>
              </Button>
            ))}
          </div>

          <Separator className="my-3" />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Visible: {Array.from(visibleNodeTypes).length}/{nodeTypes.length}</span>
          </div>
        </GlassCard>
      </motion.div>

      {/* Network Stats */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Network className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Quick Stats</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Nodes</span>
              <Badge variant="outline">{totalNodes.toLocaleString()}</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Connections</span>
              <Badge variant="outline">{totalEdges.toLocaleString()}</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Visible Nodes</span>
              <Badge variant="secondary">
                {nodeTypes.reduce((sum, type) => 
                  visibleNodeTypes.has(type) ? sum + 1 : sum, 0
                )}
              </Badge>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Export Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-warning" />
            <h3 className="font-semibold">Export</h3>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="w-full gap-2"
            >
              <Download className="h-4 w-4" />
              Export Graph
            </Button>
            
            <div className="text-xs text-muted-foreground text-center">
              Export as PNG, SVG, or JSON
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}