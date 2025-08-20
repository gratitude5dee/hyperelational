import React, { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { 
  BarChart3, 
  Activity, 
  TrendingUp
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  ComposedChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';

interface AdvancedChartWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function AdvancedChartWidget({ size = 'full' }: AdvancedChartWidgetProps) {
  const [chartType, setChartType] = useState<'composed' | 'area' | 'line' | 'bar'>('composed');
  const { industryMode } = useAppStore();

  const generateTimeSeriesData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      users: Math.floor(Math.random() * 500) + 200,
      conversion: +(Math.random() * 5 + 2).toFixed(2),
      predicted: Math.floor(Math.random() * 12000) + 6000,
      engagement: Math.floor(Math.random() * 80) + 20
    }));
  };

  const data = generateTimeSeriesData();

  const chartConfigs = {
    composed: {
      title: 'Multi-Metric Overview',
      description: 'Combined view of key performance indicators'
    },
    area: {
      title: 'Revenue Trends',
      description: 'Revenue vs predicted performance'
    },
    line: {
      title: 'User Activity',
      description: 'Real-time user engagement metrics'
    },
    bar: {
      title: 'Hourly Performance',
      description: 'Performance breakdown by hour'
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              fill="hsl(var(--primary))" 
              stroke="hsl(var(--primary))" 
              fillOpacity={0.3} 
            />
            <Bar dataKey="users" fill="hsl(var(--secondary))" />
            <Line 
              type="monotone" 
              dataKey="conversion" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2} 
            />
          </ComposedChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              fill="url(#colorRevenue)" 
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="hsl(var(--secondary))" 
              fill="url(#colorPredicted)" 
            />
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2} 
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2} 
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" />
          </BarChart>
        );

      default:
        return null;
    }
  };

  const currentConfig = chartConfigs[chartType];

  return (
    <WidgetContainer
      title="Performance Analytics"
      icon={BarChart3}
      size={size}
      controls={
        <div className="flex gap-2">
          {Object.keys(chartConfigs).map((type) => (
            <Button
              key={type}
              variant={chartType === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType(type as any)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      }
    >
      <div className="space-y-4 h-full">
        <div>
          <h4 className="font-semibold text-foreground">{currentConfig.title}</h4>
          <p className="text-sm text-muted-foreground">{currentConfig.description}</p>
        </div>
        
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-muted-foreground">Primary Metric</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <span className="text-muted-foreground">Secondary Metric</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Updated: </span>
            <span className="text-foreground font-medium">Just now</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}