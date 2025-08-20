import React from 'react';
import { motion } from 'framer-motion';
import { ChatInterface } from '@/components/ChatInterface';
import { GlassCard } from '@/components/ui/glass-card';
import { DualModeToggle } from '@/components/DualModeToggle';
import { Brain, Sparkles, Code2 } from 'lucide-react';

export function ChatPage() {
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
            <Brain className="h-8 w-8" />
            AI Chat Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Ask questions in natural language and get PQL queries with insights
          </p>
        </div>
        <DualModeToggle />
      </motion.div>

      {/* Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Natural Language Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-secondary" />
              <span>PQL Query Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" />
              <span>Predictive Analytics</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 min-h-0"
      >
        <GlassCard className="h-full">
          <ChatInterface />
        </GlassCard>
      </motion.div>
    </div>
  );
}