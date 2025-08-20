import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WidgetContainer } from '../WidgetContainer';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';

interface EnhancedChartWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
  title?: string;
  chartType?: 'line' | 'area' | 'bar' | 'pie';
  dataKey?: string;
}

export function EnhancedChartWidget({ 
  size = 'medium', 
  title = 'Performance Chart',
  chartType = 'line',
  dataKey = 'value'
}: EnhancedChartWidgetProps) {
  const { industryMode } = useAppStore();
  const [activeChart, setActiveChart] = useState(chartType);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateChartData = async () => {
      setLoading(true);
      
      try {
        // Use mock data service
        const module = await import('@/services/MockDataService');
        const performanceData = module.MockDataService.generatePerformanceData(30);
        
        // Transform data based on industry mode
        const transformedData = performanceData.map((item, index) => ({
          name: item.timestamp,
          value: item.primary,
          secondary: item.secondary,
          tertiary: item.tertiary,
          engagement: Math.floor(Math.random() * 100) + 50,
          revenue: item.primary * 0.8,
          category: industryMode === 'fashion' ? 'Sales' : 'Streams'
        }));

        setData(transformedData);
      } catch (error) {
        console.error('Error generating chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    generateChartData();
  }, [industryMode]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse space-y-2 w-full">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      );
    }

    const chartProps = {
      data,
      className: "w-full h-64"
    };

    switch (activeChart) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart {...chartProps}>
              <defs>
                <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorPrimary)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="secondary" 
                stroke="hsl(var(--secondary))" 
                fillOpacity={1} 
                fill="url(#colorSecondary)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
              <Bar 
                dataKey="secondary" 
                fill="hsl(var(--secondary))" 
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = data.slice(0, 6).map((item, index) => ({
          name: item.name,
          value: item.value,
          color: `hsl(${220 + index * 40}, 70%, ${50 + index * 8}%)`
        }));

        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default: // line
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="secondary" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'area': return AreaChartIcon;
      case 'bar': return BarChart3;
      case 'pie': return PieChartIcon;
      default: return LineChartIcon;
    }
  };

  const chartTypes = [
    { type: 'line', label: 'Line', icon: LineChartIcon },
    { type: 'area', label: 'Area', icon: AreaChartIcon },
    { type: 'bar', label: 'Bar', icon: BarChart3 },
    { type: 'pie', label: 'Pie', icon: PieChartIcon }
  ];

  return (
    <WidgetContainer
      title={title}
      icon={getChartIcon(activeChart)}
      size={size}
      controls={
        <div className="flex gap-1">
          {chartTypes.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant={activeChart === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveChart(type as any)}
              className="h-8 px-2"
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </Button>
          ))}
        </div>
      }
    >
      <div className="h-full flex flex-col">
        {/* Chart Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span className="text-sm text-muted-foreground">
              {industryMode === 'fashion' ? 'Sales' : 'Streams'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary"></div>
            <span className="text-sm text-muted-foreground">
              {industryMode === 'fashion' ? 'Visitors' : 'Engagement'}
            </span>
          </div>
          <Badge variant="secondary" className="ml-auto">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12.5%
          </Badge>
        </div>

        {/* Chart */}
        <motion.div 
          key={activeChart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {renderChart()}
        </motion.div>
      </div>
    </WidgetContainer>
  );
}