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
  TrendingDown
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface RealTimeMetricsWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function RealTimeMetricsWidget({ size = 'large' }: RealTimeMetricsWidgetProps) {
  const { currentProject } = useAppStore();
  const [metrics, setMetrics] = useState({
    activeUsers: 1247,
    ordersPerMin: 3.7,
    avgCartValue: 127.45,
    conversionRate: 3.2,
    revenue: 24567,
    engagement: 0.84
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: Math.max(800, prev.activeUsers + Math.floor(Math.random() * 40 - 20)),
        ordersPerMin: Math.max(0, prev.ordersPerMin + (Math.random() - 0.5) * 0.8),
        avgCartValue: Math.max(50, prev.avgCartValue + (Math.random() - 0.5) * 10),
        conversionRate: Math.max(1, prev.conversionRate + (Math.random() - 0.5) * 0.3),
        revenue: prev.revenue + Math.floor(Math.random() * 500),
        engagement: Math.max(0.1, Math.min(1, prev.engagement + (Math.random() - 0.5) * 0.1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getMetricConfig = () => {
    const isEcommerce = currentProject?.type === 'fashion_ecommerce';
    
    if (isEcommerce) {
      return [
        {
          icon: Users,
          label: 'Active Users',
          value: metrics.activeUsers.toLocaleString(),
          change: '+2.3%',
          trend: 'up' as const,
          color: 'from-blue-500/20 to-purple-500/20',
          iconColor: 'text-blue-400'
        },
        {
          icon: ShoppingBag,
          label: 'Orders/Min',
          value: metrics.ordersPerMin.toFixed(1),
          change: '+1.2',
          trend: 'up' as const,
          color: 'from-green-500/20 to-emerald-500/20',
          iconColor: 'text-green-400'
        },
        {
          icon: DollarSign,
          label: 'Avg Cart Value',
          value: `$${metrics.avgCartValue.toFixed(2)}`,
          change: '-$3.20',
          trend: 'down' as const,
          color: 'from-purple-500/20 to-pink-500/20',
          iconColor: 'text-purple-400'
        },
        {
          icon: Target,
          label: 'Conversion Rate',
          value: `${metrics.conversionRate.toFixed(1)}%`,
          change: '+0.3%',
          trend: 'up' as const,
          color: 'from-orange-500/20 to-red-500/20',
          iconColor: 'text-orange-400'
        }
      ];
    } else {
      return [
        {
          icon: Users,
          label: 'Active Fans',
          value: metrics.activeUsers.toLocaleString(),
          change: '+5.1%',
          trend: 'up' as const,
          color: 'from-cyan-500/20 to-blue-500/20',
          iconColor: 'text-cyan-400'
        },
        {
          icon: Activity,
          label: 'Engagement Rate',
          value: `${(metrics.engagement * 100).toFixed(1)}%`,
          change: '+2.4%',
          trend: 'up' as const,
          color: 'from-green-500/20 to-teal-500/20',
          iconColor: 'text-green-400'
        },
        {
          icon: DollarSign,
          label: 'Revenue Today',
          value: `$${metrics.revenue.toLocaleString()}`,
          change: '+12.5%',
          trend: 'up' as const,
          color: 'from-purple-500/20 to-pink-500/20',
          iconColor: 'text-purple-400'
        },
        {
          icon: Target,
          label: 'Stream Rate',
          value: `${metrics.ordersPerMin.toFixed(1)}/s`,
          change: '+0.8',
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
              className={`p-4 bg-gradient-to-br ${metric.color} rounded-lg border border-border/20
                hover:border-primary/30 transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-3">
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
                <span className={`text-xs flex items-center gap-1 ${
                  metric.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendIcon className="h-3 w-3" />
                  {metric.change}
                </span>
              </div>
              
              <div>
                <motion.div 
                  className="text-2xl font-bold text-foreground mb-1"
                  key={metric.value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {metric.value}
                </motion.div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </div>
              
              {/* Pulse effect for real-time feel */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          );
        })}
      </div>
    </WidgetContainer>
  );
}