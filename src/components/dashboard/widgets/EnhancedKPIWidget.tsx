import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WidgetContainer } from '../WidgetContainer';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Target,
  Play,
  Heart,
  Music,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/useAppStore';

interface KPIData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  description: string;
}

interface EnhancedKPIWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
  title?: string;
  kpiType?: 'primary' | 'secondary' | 'engagement' | 'financial';
}

export function EnhancedKPIWidget({ 
  size = 'medium', 
  title = 'Key Metrics',
  kpiType = 'primary'
}: EnhancedKPIWidgetProps) {
  const { industryMode } = useAppStore();
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateKPIData = async () => {
      setLoading(true);
      
      try {
        const module = await import('@/services/MockDataService');
        const metrics = module.MockDataService.generateRealTimeMetrics(industryMode);
        
        let data: KPIData[] = [];
        
        if (industryMode === 'fashion') {
          switch (kpiType) {
            case 'primary':
              data = [
                {
                  label: 'Total Revenue',
                  value: `$${metrics.sales?.toLocaleString() || '0'}`,
                  change: 15.2,
                  trend: 'up',
                  icon: DollarSign,
                  color: 'text-green-400',
                  description: 'Monthly revenue growth'
                },
                {
                  label: 'Active Customers',
                  value: metrics.activeUsers?.toLocaleString() || '0',
                  change: 8.7,
                  trend: 'up',
                  icon: Users,
                  color: 'text-blue-400',
                  description: 'Unique active users'
                }
              ];
              break;
            case 'engagement':
              data = [
                {
                  label: 'Conversion Rate',
                  value: `${metrics.conversionRate?.toFixed(1) || '0.0'}%`,
                  change: 12.3,
                  trend: 'up',
                  icon: Target,
                  color: 'text-purple-400',
                  description: 'Visitor to customer conversion'
                },
                {
                  label: 'Cart Abandonment',
                  value: `${metrics.cartAbandonment?.toFixed(1) || '0.0'}%`,
                  change: -5.2,
                  trend: 'down',
                  icon: ShoppingBag,
                  color: 'text-orange-400',
                  description: 'Reduced abandonment rate'
                }
              ];
              break;
          }
        } else {
          switch (kpiType) {
            case 'primary':
              data = [
                {
                  label: 'Total Streams',
                  value: `${Math.floor((metrics.streams || 0) / 1000)}K`,
                  change: 18.5,
                  trend: 'up',
                  icon: Play,
                  color: 'text-green-400',
                  description: 'Monthly streaming growth'
                },
                {
                  label: 'Active Listeners',
                  value: metrics.activeListeners?.toLocaleString() || '0',
                  change: 12.1,
                  trend: 'up',
                  icon: Users,
                  color: 'text-blue-400',
                  description: 'Unique monthly listeners'
                }
              ];
              break;
            case 'engagement':
              data = [
                {
                  label: 'Fan Engagement',
                  value: `${(metrics.fanEngagement || 0).toFixed(1)}%`,
                  change: 9.3,
                  trend: 'up',
                  icon: Heart,
                  color: 'text-red-400',
                  description: 'Average engagement rate'
                },
                {
                  label: 'New Followers',
                  value: (metrics.newFollowers || 0).toLocaleString(),
                  change: 24.7,
                  trend: 'up',
                  icon: Music,
                  color: 'text-purple-400',
                  description: 'Daily follower growth'
                }
              ];
              break;
          }
        }
        
        setKpiData(data);
      } catch (error) {
        console.error('Error generating KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    generateKPIData();
  }, [industryMode, kpiType]);

  if (loading) {
    return (
      <WidgetContainer title={title} icon={TrendingUp} size={size}>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer
      title={title}
      icon={TrendingUp}
      size={size}
      controls={
        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
          Live Data
        </Badge>
      }
    >
      <div className="space-y-6">
        {kpiData.map((kpi, index) => {
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          const IconComponent = kpi.icon;
          
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-card/50 border border-border/20 
                    group-hover:border-primary/30 transition-colors duration-200`}>
                    <IconComponent className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {kpi.label}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      {kpi.description}
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                  ${kpi.trend === 'up' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                  }`}>
                  <TrendIcon className="h-3 w-3" />
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              
              <motion.div 
                className="text-3xl font-bold text-foreground mb-1"
                key={kpi.value}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {kpi.value}
              </motion.div>
              
              {/* Progress bar visualization */}
              <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    kpi.trend === 'up' ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(kpi.change) * 2, 100)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </WidgetContainer>
  );
}