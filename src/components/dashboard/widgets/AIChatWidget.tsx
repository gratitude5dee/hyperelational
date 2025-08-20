import React, { useState } from 'react';
import { GroqChatInterface } from '@/components/GroqChatInterface';
import { WidgetContainer } from '../WidgetContainer';
import { Brain, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface AIChatWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function AIChatWidget({ size = 'medium' }: AIChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderMiniVersion = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-4 w-4 text-primary" />
          </motion.div>
          <span className="text-sm font-medium">hyperelational AI</span>
        </div>
        <Badge variant="secondary" className="animate-pulse bg-green-500/20 text-green-400">
          <Zap className="h-3 w-3 mr-1" />
          Live
        </Badge>
      </div>
      
      <div className="space-y-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-primary" />
            <p className="text-xs text-muted-foreground font-medium">Latest Insight:</p>
          </div>
          <p className="text-sm text-foreground">"Revenue up 23% from social campaigns"</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            size="sm" 
            onClick={() => setIsExpanded(true)}
            className="w-full gradient-primary hover:opacity-90 gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Ask hyperelational AI
          </Button>
        </motion.div>
      </div>
    </div>
  );

  const renderFullVersion = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h4 className="font-semibold text-foreground">hyperelational AI Assistant</h4>
            <p className="text-xs text-muted-foreground">Powered by kumoRFM • gpt-oss model</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
          <Zap className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      </div>
      
      <div className="flex-1 min-h-0">
        <GroqChatInterface />
      </div>
    </div>
  );

  return (
    <WidgetContainer
      title="hyperelational AI Chat"
      icon={Brain}
      size={size}
      onMaximize={() => setIsExpanded(true)}
      onMinimize={() => setIsExpanded(false)}
      isMaximized={isExpanded}
      controls={
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">gpt-oss</Badge>
        </div>
      }
    >
      {size === 'mini' || !isExpanded ? renderMiniVersion() : renderFullVersion()}
    </WidgetContainer>
  );
}