import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WidgetContainer } from '../WidgetContainer';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';

interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: Date;
}

interface AIInsightsWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function AIInsightsWidget({ size = 'medium' }: AIInsightsWidgetProps) {
  const { currentProject } = useAppStore();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const generateInsights = () => {
      const isEcommerce = currentProject?.type === 'fashion_ecommerce';
      
      const ecommerceInsights: Omit<AIInsight, 'id' | 'timestamp'>[] = [
        {
          type: 'success',
          title: 'Revenue Surge Detected',
          description: 'Social media campaigns driving 23% revenue increase',
          confidence: 92,
          impact: 'high',
          actionable: true
        },
        {
          type: 'warning',
          title: 'Cart Abandonment Alert',
          description: 'Mobile cart abandonment rate increasing by 8%',
          confidence: 87,
          impact: 'medium',
          actionable: true
        },
        {
          type: 'prediction',
          title: 'Peak Sales Forecast',
          description: 'Predicted sales spike Tuesday 2-4 PM EST',
          confidence: 78,
          impact: 'high',
          actionable: true
        },
        {
          type: 'info',
          title: 'Customer Lifetime Value',
          description: 'LTV improved by 15% in premium segment',
          confidence: 95,
          impact: 'medium',
          actionable: false
        }
      ];

      const artistInsights: Omit<AIInsight, 'id' | 'timestamp'>[] = [
        {
          type: 'success',
          title: 'Fan Engagement Spike',
          description: 'New single driving 45% engagement increase',
          confidence: 94,
          impact: 'high',
          actionable: true
        },
        {
          type: 'prediction',
          title: 'Tour City Optimization',
          description: 'Denver and Austin show highest fan density',
          confidence: 89,
          impact: 'high',
          actionable: true
        },
        {
          type: 'info',
          title: 'Playlist Performance',
          description: 'Spotify playlist adds increased 67% this week',
          confidence: 96,
          impact: 'medium',
          actionable: false
        },
        {
          type: 'warning',
          title: 'Streaming Platform Shift',
          description: 'Fan migration from Apple Music to Spotify detected',
          confidence: 83,
          impact: 'medium',
          actionable: true
        }
      ];

      const baseInsights = isEcommerce ? ecommerceInsights : artistInsights;
      
      return baseInsights.map((insight, index) => ({
        ...insight,
        id: `insight-${index}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000) // Random time in last hour
      }));
    };

    setInsights(generateInsights());
  }, [currentProject?.type]);

  // Auto-rotate insights
  useEffect(() => {
    if (insights.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [insights.length]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'prediction':
        return Sparkles;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'success':
        return 'from-success/20 to-success/10 border-success/30';
      case 'warning':
        return 'from-warning/20 to-warning/10 border-warning/30';
      case 'prediction':
        return 'from-primary/20 to-secondary/10 border-primary/30';
      case 'info':
        return 'from-info/20 to-info/10 border-info/30';
      default:
        return 'from-muted/20 to-muted/10 border-border/30';
    }
  };

  const getImpactBadgeVariant = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const renderMiniVersion = () => {
    if (insights.length === 0) return <div>Loading insights...</div>;
    
    const currentInsight = insights[currentIndex];
    const Icon = getInsightIcon(currentInsight.type);
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentInsight.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Insights</span>
            </div>
            <Badge variant={getImpactBadgeVariant(currentInsight.impact)}>
              {currentInsight.impact.toUpperCase()}
            </Badge>
          </div>
          
          <div className={`p-3 bg-gradient-to-r ${getInsightColor(currentInsight.type)} 
            rounded-lg border backdrop-blur-sm`}>
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">{currentInsight.title}</h4>
              <span className="text-xs text-muted-foreground">{currentInsight.confidence}%</span>
            </div>
            <p className="text-xs text-muted-foreground">{currentInsight.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {insights.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} of {insights.length}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderFullVersion = () => (
    <div className="space-y-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-lg font-semibold">AI Performance Score: 94.7%</span>
        </div>
        <Button size="sm" variant="outline">
          Configure AI
        </Button>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 bg-gradient-to-r ${getInsightColor(insight.type)} 
                rounded-lg border backdrop-blur-sm hover:border-primary/50 
                transition-all cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background/50 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    <Badge variant={getImpactBadgeVariant(insight.impact)} className="mt-1">
                      {insight.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">
                    {insight.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {insight.timestamp.toLocaleTimeString()}
                </span>
                {insight.actionable && (
                  <Button size="sm" variant="ghost" className="text-xs">
                    Take Action
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <WidgetContainer
      title="AI-Powered Insights"
      icon={Brain}
      size={size}
    >
      {size === 'mini' ? renderMiniVersion() : renderFullVersion()}
    </WidgetContainer>
  );
}