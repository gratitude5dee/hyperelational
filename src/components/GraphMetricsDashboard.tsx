import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Users, 
  Link, 
  TrendingUp, 
  Zap, 
  Target,
  Brain,
  Activity
} from 'lucide-react';
import { GraphNode3D, GraphEdge3D } from '@/services/GraphDataService';

interface GraphMetricsDashboardProps {
  nodes: GraphNode3D[];
  edges: GraphEdge3D[];
  selectedNode: string | null;
  filterTypes: Set<string>;
}

export function GraphMetricsDashboard({ 
  nodes, 
  edges, 
  selectedNode, 
  filterTypes 
}: GraphMetricsDashboardProps) {
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

  const selectedNodeData = useMemo(() => 
    selectedNode ? nodes.find(n => n.id === selectedNode) : null,
    [selectedNode, nodes]
  );

  const dfsVisit = (nodeId: string, visited: Set<string>, edges: GraphEdge3D[]) => {
    visited.add(nodeId);
    edges.forEach(edge => {
      if (edge.source === nodeId && !visited.has(edge.target)) {
        dfsVisit(edge.target, visited, edges);
      }
      if (edge.target === nodeId && !visited.has(edge.source)) {
        dfsVisit(edge.source, visited, edges);
      }
    });
  };

  const metrics = useMemo(() => {
    // Handle empty arrays gracefully
    if (visibleNodes.length === 0) {
      return {
        totalNodes: 0,
        totalEdges: 0,
        density: 0,
        avgDegree: 0,
        communities: 0,
        degreeCentrality: {},
        topNodes: [],
        typeDistribution: {}
      };
    }

    const totalNodes = visibleNodes.length;
    const totalEdges = visibleEdges.length;
    const maxPossibleEdges = (totalNodes * (totalNodes - 1)) / 2;
    const density = maxPossibleEdges > 0 ? totalEdges / maxPossibleEdges : 0;
    const avgDegree = totalNodes > 0 ? (totalEdges * 2) / totalNodes : 0;

    // Calculate centrality scores
    const degreeCentrality: Record<string, number> = {};
    visibleNodes.forEach(node => {
      degreeCentrality[node.id] = visibleEdges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length;
    });

    // Find most connected nodes
    const topNodes = visibleNodes
      .sort((a, b) => (degreeCentrality[b.id] || 0) - (degreeCentrality[a.id] || 0))
      .slice(0, 5);

    // Node type distribution
    const typeDistribution: Record<string, number> = {};
    visibleNodes.forEach(node => {
      typeDistribution[node.type] = (typeDistribution[node.type] || 0) + 1;
    });

    // Community detection (simplified)
    const visited = new Set<string>();
    let communities = 0;
    visibleNodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfsVisit(node.id, visited, visibleEdges);
        communities++;
      }
    });

    return {
      totalNodes,
      totalEdges,
      density: Math.round(density * 10000) / 10000,
      avgDegree: Math.round(avgDegree * 100) / 100,
      communities,
      degreeCentrality,
      topNodes,
      typeDistribution
    };
  }, [visibleNodes, visibleEdges]);

  return (
    <div className="space-y-4">
      {/* Network Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Network className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Network Overview</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {metrics.totalNodes.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Nodes</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {metrics.totalEdges.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Connections</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-accent">
                {(metrics.density * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">Density</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
                {metrics.avgDegree.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Degree</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Communities</span>
              <Badge variant="outline">{metrics.communities}</Badge>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Selected Node Details */}
      {selectedNodeData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Selected Node</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: selectedNodeData.color }} 
                />
                <span className="font-medium">{selectedNodeData.label}</span>
                <Badge variant="outline">{selectedNodeData.type}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Connections:</span>
                  <div className="font-medium">{metrics.degreeCentrality[selectedNodeData.id]}</div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Importance:</span>
                  <div className="font-medium">{selectedNodeData.importance.toFixed(2)}</div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <div className="font-medium">{Math.round(selectedNodeData.size)}</div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Rank:</span>
                  <div className="font-medium">
                    #{metrics.topNodes.findIndex(n => n.id === selectedNodeData.id) + 1}
                  </div>
                </div>
              </div>

              {selectedNodeData.metadata && (
                <div className="pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Metadata:</div>
                  <div className="space-y-1 text-xs">
                    {Object.entries(selectedNodeData.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Node Type Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold">Node Distribution</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(metrics.typeDistribution).map(([type, count]) => (
              <div key={type} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm capitalize">{type}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
                <Progress 
                  value={(count / metrics.totalNodes) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Top Connected Nodes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Most Connected</h3>
          </div>
          
          <div className="space-y-2">
            {metrics.topNodes.map((node, index) => (
              <div 
                key={node.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                  <span className="text-sm font-medium">{node.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {node.type}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {metrics.degreeCentrality[node.id]} connections
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insights Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Activity className="h-4 w-4 mt-0.5 text-accent" />
              <span>Network density is {metrics.density > 0.1 ? 'high' : 'low'}, indicating {metrics.density > 0.1 ? 'strong' : 'weak'} interconnectedness.</span>
            </div>
            
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 mt-0.5 text-secondary" />
              <span>Most connected node type: {Object.entries(metrics.typeDistribution).length > 0 ? Object.entries(metrics.typeDistribution).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 'None'}</span>
            </div>
            
            {metrics.communities > 1 && (
              <div className="flex items-start gap-2">
                <Link className="h-4 w-4 mt-0.5 text-warning" />
                <span>Network shows {metrics.communities} distinct communities, suggesting natural clustering.</span>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}