import React, { useState, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { BarChart3, TrendingUp, Activity, Zap, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { 
  ComposedChart, 
  Area, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

interface PerformanceAnalyticsWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

interface MetricData {
  timestamp: string;
  primary: number;
  secondary: number;
  tertiary?: number;
}

interface PerformanceMetrics {
  primary: {
    value: number;
    change: number;
    label: string;
  };
  secondary: {
    value: number;
    change: number;
    label: string;
  };
  lastUpdated: string;
}

export function PerformanceAnalyticsWidget({ size = 'full' }: PerformanceAnalyticsWidgetProps) {
  const [chartType, setChartType] = useState<'composed' | 'area' | 'line' | 'bar'>('composed');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [isRealTime, setIsRealTime] = useState(true);
  const { industryMode } = useAppStore();

  const [performanceData, setPerformanceData] = useState<MetricData[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    primary: {
      value: 98.2,
      change: 12.5,
      label: industryMode === 'fashion' ? 'Conversion Rate' : 'Engagement Rate'
    },
    secondary: {
      value: 1247,
      change: -2.3,
      label: industryMode === 'fashion' ? 'Active Sessions' : 'Active Listeners'
    },
    lastUpdated: 'Just now'
  });

  useEffect(() => {
    // Generate sample performance data
    const generateData = () => {
      const data: MetricData[] = [];
      const now = new Date();
      const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
      
      for (let i = points - 1; i >= 0; i--) {
        const timestamp = new Date(now);
        if (timeRange === '24h') {
          timestamp.setHours(timestamp.getHours() - i);
        } else if (timeRange === '7d') {
          timestamp.setDate(timestamp.getDate() - i);
        } else {
          timestamp.setDate(timestamp.getDate() - i);
        }

        data.push({
          timestamp: timeRange === '24h' 
            ? timestamp.toLocaleTimeString('en-US', { hour: '2-digit' })
            : timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          primary: 50 + Math.random() * 50,
          secondary: 30 + Math.random() * 40,
          tertiary: 20 + Math.random() * 30
        });
      }
      return data;
    };

    setPerformanceData(generateData());
  }, [timeRange]);

  // Real-time updates
  useEffect(() => {
    if (!isRealTime) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        primary: {
          ...prev.primary,
          value: prev.primary.value + (Math.random() - 0.5) * 2,
          change: prev.primary.change + (Math.random() - 0.5) * 1
        },
        secondary: {
          ...prev.secondary,
          value: Math.round(prev.secondary.value + (Math.random() - 0.5) * 20),
          change: prev.secondary.change + (Math.random() - 0.5) * 1
        },
        lastUpdated: 'Just now'
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const renderMiniVersion = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Performance</span>
        </div>
        <Badge variant="secondary" className={isRealTime ? "animate-pulse bg-green-500/20 text-green-400" : ""}>
          {isRealTime ? 'Live' : 'Paused'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-primary">{metrics.primary.value.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">{metrics.primary.label}</div>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              metrics.primary.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {metrics.primary.change > 0 ? '+' : ''}{metrics.primary.change.toFixed(1)}%
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-secondary">{metrics.secondary.value}</div>
              <div className="text-xs text-muted-foreground">{metrics.secondary.label}</div>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              metrics.secondary.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {metrics.secondary.change > 0 ? '+' : ''}{metrics.secondary.change.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Updated: {metrics.lastUpdated}
      </div>
    </div>
  );

  const renderChart = () => {
    const chartProps = {
      data: performanceData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <ComposedChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="primary" 
              stackId="1"
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary) / 0.3)" 
            />
            <Area 
              type="monotone" 
              dataKey="secondary" 
              stackId="1"
              stroke="hsl(var(--secondary))" 
              fill="hsl(var(--secondary) / 0.3)" 
            />
          </ComposedChart>
        );
      
      case 'line':
        return (
          <ComposedChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="primary" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="secondary" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        );
      
      case 'bar':
        return (
          <ComposedChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="primary" fill="hsl(var(--primary) / 0.8)" />
            <Bar dataKey="secondary" fill="hsl(var(--secondary) / 0.8)" />
          </ComposedChart>
        );
      
      default: // composed
        return (
          <ComposedChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="tertiary" 
              stackId="1"
              stroke="hsl(var(--accent))" 
              fill="hsl(var(--accent) / 0.2)" 
            />
            <Bar dataKey="secondary" fill="hsl(var(--secondary) / 0.6)" />
            <Line 
              type="monotone" 
              dataKey="primary" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            />
            <Legend />
          </ComposedChart>
        );
    }
  };

  const renderFullVersion = () => (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">Multi-Metric Overview</h4>
          <p className="text-sm text-muted-foreground">
            Combined view of key performance indicators
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={chartType === 'composed' ? "default" : "ghost"}
            size="sm"
            onClick={() => setChartType('composed')}
          >
            Composed
          </Button>
          <Button
            variant={chartType === 'area' ? "default" : "ghost"}
            size="sm"
            onClick={() => setChartType('area')}
          >
            Area
          </Button>
          <Button
            variant={chartType === 'line' ? "default" : "ghost"}
            size="sm"
            onClick={() => setChartType('line')}
          >
            Line
          </Button>
          <Button
            variant={chartType === 'bar' ? "default" : "ghost"}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            Bar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold text-primary">{metrics.primary.value.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">{metrics.primary.label}</div>
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
            metrics.primary.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <TrendingUp className="h-3 w-3" />
            {metrics.primary.change > 0 ? '+' : ''}{metrics.primary.change.toFixed(1)}%
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-secondary/20 rounded-lg">
              <Activity className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">{metrics.secondary.value}</div>
              <div className="text-xs text-muted-foreground">{metrics.secondary.label}</div>
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
            metrics.secondary.change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <TrendingUp className="h-3 w-3" />
            {metrics.secondary.change > 0 ? '+' : ''}{metrics.secondary.change.toFixed(1)}%
          </div>
        </motion.div>
        
        <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Real-time</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRealTime(!isRealTime)}
              className={isRealTime ? "text-green-400" : "text-muted-foreground"}
            >
              {isRealTime ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Updated: {metrics.lastUpdated}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 bg-card/30 border border-border/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Time Range Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === '24h' ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange('24h')}
          >
            24H
          </Button>
          <Button
            variant={timeRange === '7d' ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7D
          </Button>
          <Button
            variant={timeRange === '30d' ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30D
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Primary Metric • Secondary Metric • Updated: Just now
        </div>
      </div>
    </div>
  );

  return (
    <WidgetContainer
      title="Performance Analytics"
      icon={BarChart3}
      size={size}
      controls={
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      }
    >
      {size === 'mini' ? renderMiniVersion() : renderFullVersion()}
    </WidgetContainer>
  );
}