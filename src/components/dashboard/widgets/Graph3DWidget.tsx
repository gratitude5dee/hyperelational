import React, { useState } from 'react';
import { Enhanced3DGraphVisualizer } from '@/components/Enhanced3DGraphVisualizer';
import { GraphVisualizer } from '@/components/GraphVisualizer';
import { WidgetContainer } from '../WidgetContainer';
import { Network, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/useAppStore';

interface Graph3DWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function Graph3DWidget({ size = 'large' }: Graph3DWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [is3D, setIs3D] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { currentProject } = useAppStore();

  const mockStats = {
    nodes: 127,
    connections: 384,
    clusters: 8,
    density: 0.67
  };

  const renderMiniVersion = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-secondary" />
          <span className="text-sm font-medium">Network Graph</span>
        </div>
        <Badge variant={is3D ? "default" : "secondary"}>
          {is3D ? '3D' : '2D'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-lg">
          <div className="text-lg font-bold text-primary">{mockStats.nodes}</div>
          <div className="text-xs text-muted-foreground">Nodes</div>
        </div>
        <div className="p-2 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg">
          <div className="text-lg font-bold text-secondary">{mockStats.connections}</div>
          <div className="text-xs text-muted-foreground">Links</div>
        </div>
      </div>
      
      <Button 
        size="sm" 
        onClick={() => setIsExpanded(true)}
        className="w-full"
        variant="outline"
      >
        Explore Network
      </Button>
    </div>
  );

  const renderFullVersion = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={is3D ? "default" : "outline"}
          size="sm"
          onClick={() => setIs3D(true)}
        >
          3D View
        </Button>
        <Button
          variant={!is3D ? "default" : "outline"}
          size="sm"
          onClick={() => setIs3D(false)}
        >
          2D View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Pause' : 'Animate'}
        </Button>
      </div>
      
      <div className="flex-1 min-h-0">
        {is3D ? (
          <Enhanced3DGraphVisualizer />
        ) : (
          <GraphVisualizer />
        )}
      </div>
    </div>
  );

  return (
    <WidgetContainer
      title="Network Visualization"
      icon={Network}
      size={size}
      onMaximize={() => setIsExpanded(true)}
      onMinimize={() => setIsExpanded(false)}
      isMaximized={isExpanded}
      controls={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIs3D(!is3D)}
        >
          {is3D ? '3D' : '2D'}
        </Button>
      }
    >
      {size === 'mini' || !isExpanded ? renderMiniVersion() : renderFullVersion()}
    </WidgetContainer>
  );
}