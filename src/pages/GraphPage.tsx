import React from 'react';
import { motion } from 'framer-motion';
import { GraphVisualizer } from '@/components/GraphVisualizer';
import { DualModeToggle } from '@/components/DualModeToggle';
import { Activity, Network, Brain } from 'lucide-react';

export function GraphPage() {
  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Network className="h-8 w-8" />
            Relationship Explorer
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize connections and discover hidden patterns in your data
          </p>
        </div>
        <DualModeToggle />
      </motion.div>

      {/* Graph Visualizer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 min-h-0"
      >
        <GraphVisualizer />
      </motion.div>
    </div>
  );
}