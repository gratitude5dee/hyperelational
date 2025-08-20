import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WidgetContainer } from '../WidgetContainer';
import { 
  Activity, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Target,
  TrendingUp,
  TrendingDown,
  Play,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface RealTimeMetricsWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function RealTimeMetricsWidget({ size = 'large' }: RealTimeMetricsWidgetProps) {
  const { currentProject, industryMode } = useAppStore();
  const [metrics, setMetrics] = useState<any>(null);
  const [isRealTime, setIsRealTime] = useState(true);

  const generateMockData = async () => {
    // Use enhanced mock data service for consistency
    const module = await import('@/services/MockDataService');
    return module.MockDataService.generateRealTimeMetrics(industryMode);
  };

  useEffect(() => {
    const loadMetrics = async () => {
      const mockData = await generateMockData();
      setMetrics(mockData);
    };
    
    loadMetrics();
    
    if (isRealTime) {
      const interval = setInterval(async () => {
        const mockData = await generateMockData();
        setMetrics(mockData);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isRealTime, industryMode]);

  if (!metrics) {
    return (
      <WidgetContainer title="Real-Time Metrics" icon={Activity} size={size}>
        <div className="grid grid-cols-2 gap-4 h-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 bg-muted/20 rounded-lg animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </WidgetContainer>
    );
  }

  const getMetricConfig = () => {
    if (industryMode === 'fashion') {
      return [
        {
          icon: Users,
          label: 'Active Users',
          value: metrics.activeUsers?.toLocaleString() || '0',
          change: '+2.3%',
          trend: 'up' as const,
          color: 'from-blue-500/20 to-purple-500/20',
          iconColor: 'text-blue-400'
        },
        {
          icon: ShoppingBag,
          label: 'Daily Sales',
          value: `$${metrics.sales?.toLocaleString() || '0'}`,
          change: '+15.2%',
          trend: 'up' as const,
          color: 'from-green-500/20 to-emerald-500/20',
          iconColor: 'text-green-400'
        },
        {
          icon: DollarSign,
          label: 'Avg Order Value',
          value: `$${metrics.avgOrderValue?.toFixed(2) || '0.00'}`,
          change: '+$8.50',
          trend: 'up' as const,
          color: 'from-purple-500/20 to-pink-500/20',
          iconColor: 'text-purple-400'
        },
        {
          icon: Target,
          label: 'Conversion Rate',
          value: `${metrics.conversionRate?.toFixed(1) || '0.0'}%`,
          change: '+0.3%',
          trend: 'up' as const,
          color: 'from-orange-500/20 to-red-500/20',
          iconColor: 'text-orange-400'
        }
      ];
    } else {
      return [
        {
          icon: Play,
          label: 'Active Listeners',
          value: metrics.activeListeners?.toLocaleString() || '0',
          change: '+8.1%',
          trend: 'up' as const,
          color: 'from-cyan-500/20 to-blue-500/20',
          iconColor: 'text-cyan-400'
        },
        {
          icon: Activity,
          label: 'Total Streams',
          value: `${Math.floor((metrics.streams || 0) / 1000)}K`,
          change: '+12.4%',
          trend: 'up' as const,
          color: 'from-green-500/20 to-teal-500/20',
          iconColor: 'text-green-400'
        },
        {
          icon: Heart,
          label: 'Fan Engagement',
          value: `${(metrics.fanEngagement || 0).toFixed(1)}%`,
          change: '+2.8%',
          trend: 'up' as const,
          color: 'from-red-500/20 to-pink-500/20',
          iconColor: 'text-red-400'
        },
        {
          icon: MessageCircle,
          label: 'Social Mentions',
          value: (metrics.socialMentions || 0).toLocaleString(),
          change: '+24.1%',
          trend: 'up' as const,
          color: 'from-yellow-500/20 to-orange-500/20',
          iconColor: 'text-yellow-400'
        }
      ];
    }
  };

  const metricConfig = getMetricConfig();

  return (
    <WidgetContainer
      title="Real-Time Metrics"
      icon={Activity}
      size={size}
      controls={
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs text-muted-foreground">
            {isRealTime ? 'Live' : 'Paused'}
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4 h-full">
        {metricConfig.map((metric, index) => {
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 bg-gradient-to-br ${metric.color} rounded-lg border border-border/20
                hover:border-primary/30 transition-all duration-300 cursor-pointer group overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
                <span className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full 
                  bg-background/20 backdrop-blur-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendIcon className="h-3 w-3" />
                  {metric.change}
                </span>
              </div>
              
              <div className="relative z-10">
                <motion.div 
                  className="text-2xl font-bold text-foreground mb-1"
                  key={metric.value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {metric.value}
                </motion.div>
                <div className="text-xs text-muted-foreground font-medium">{metric.label}</div>
              </div>
              
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Real-time pulse animation */}
              {isRealTime && (
                <motion.div
                  className="absolute inset-0 rounded-lg border border-primary/30"
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(139, 92, 246, 0.4)', '0 0 0 4px rgba(139, 92, 246, 0)'] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </WidgetContainer>
  );
}