import React, { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { WidgetContainer } from '../WidgetContainer';
import { Brain, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIChatWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function AIChatWidget({ size = 'medium' }: AIChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderMiniVersion = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Assistant</span>
        </div>
        <Badge variant="secondary" className="animate-pulse">
          Online
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <p className="text-xs text-muted-foreground">Latest Insight:</p>
          <p className="text-sm">"Revenue up 23% from social campaigns"</p>
        </div>
        
        <Button 
          size="sm" 
          onClick={() => setIsExpanded(true)}
          className="w-full gradient-primary"
        >
          Ask AI Anything
        </Button>
      </div>
    </div>
  );

  const renderFullVersion = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );

  return (
    <WidgetContainer
      title="AI Chat Assistant"
      icon={Brain}
      size={size}
      onMaximize={() => setIsExpanded(true)}
      onMinimize={() => setIsExpanded(false)}
      isMaximized={isExpanded}
    >
      {size === 'mini' || !isExpanded ? renderMiniVersion() : renderFullVersion()}
    </WidgetContainer>
  );
}