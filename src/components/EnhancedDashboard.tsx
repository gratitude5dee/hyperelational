import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchWidgetData } from '@/lib/functions';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  Plus,
  Activity,
  Brain,
  Zap,
  Target,
  Network,
  BarChart3,
  AlertTriangle,
  Clock,
  Gauge
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';

interface AIInsight {
  id: string;
  type: 'anomaly' | 'opportunity' | 'prediction' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface PredictiveAlert {
  id: string;
  metric: string;
  prediction: string;
  timeframe: string;
  confidence: number;
  severity: 'info' | 'warning' | 'critical';
}

const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'anomaly',
    title: 'Unusual Churn Pattern Detected',
    description: 'Premium customers showing 34% higher churn rate than historical average',
    confidence: 89,
    impact: 'high',
    actionable: true
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Cross-sell Opportunity',
    description: 'Customers buying Product A have 67% likelihood to purchase Product B within 14 days',
    confidence: 76,
    impact: 'medium',
    actionable: true
  },
  {
    id: '3',
    type: 'prediction',
    title: 'Revenue Forecast Update',
    description: 'Q4 revenue projected to exceed target by 12% based on current trends',
    confidence: 82,
    impact: 'high',
    actionable: false
  }
];

const mockPredictiveAlerts: PredictiveAlert[] = [
  {
    id: '1',
    metric: 'Customer Acquisition Cost',
    prediction: 'Expected to increase by 15%',
    timeframe: 'Next 14 days',
    confidence: 78,
    severity: 'warning'
  },
  {
    id: '2',
    metric: 'Inventory Turnover',
    prediction: 'Stockout risk for top 3 products',
    timeframe: 'Next 7 days',
    confidence: 94,
    severity: 'critical'
  }
];

export function EnhancedDashboard() {
  const [selectedProject, setSelectedProject] = useState<'fashion' | 'creative'>('fashion');
  const [performanceScore, setPerformanceScore] = useState(87);

  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ['enhanced-kpis', selectedProject],
    queryFn: async () => fetchWidgetData('kpis', 'kpi', selectedProject),
  });

  const { data: realTimeData, isLoading: realTimeLoading } = useQuery({
    queryKey: ['real-time', selectedProject],
    queryFn: async () => ({
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      liveOrders: Math.floor(Math.random() * 50) + 10,
      conversionRate: (Math.random() * 5 + 2).toFixed(2),
      serverLoad: Math.floor(Math.random() * 40) + 20
    }),
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'opportunity': return Target;
      case 'prediction': return Brain;
      case 'alert': return Zap;
      default: return Brain;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'anomaly': return 'text-destructive';
      case 'opportunity': return 'text-success';
      case 'prediction': return 'text-primary';
      case 'alert': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Enhanced Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights with predictive analytics
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={selectedProject === 'fashion' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedProject('fashion')}
            >
              Fashion
            </Button>
            <Button
              variant={selectedProject === 'creative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedProject('creative')}
            >
              Creative
            </Button>
          </div>
          
          <Button className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Gauge className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">AI Performance Score</h3>
                <p className="text-sm text-muted-foreground">Real-time platform health</p>
              </div>
            </div>
            <div className="text-right">
              <motion.div 
                className="text-4xl font-bold gradient-text"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {performanceScore}
              </motion.div>
              <Badge variant="secondary" className="mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% from yesterday
              </Badge>
            </div>
          </div>
          <Progress value={performanceScore} className="mt-4" />
        </GlassCard>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="executive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="executive" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Executive
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Real-Time
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Predictive
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Relationships
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Custom
          </TabsTrigger>
        </TabsList>

        {/* Executive Overview Tab */}
        <TabsContent value="executive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Insights */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
                    <p className="text-sm text-muted-foreground">Critical findings and opportunities</p>
                  </div>
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence>
                    {mockAIInsights.map((insight, index) => {
                      const Icon = getInsightIcon(insight.type);
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-muted/50`}>
                              <Icon className={`h-4 w-4 ${getInsightColor(insight.type)}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{insight.title}</h4>
                                <div className="flex items-center gap-2">
                                  <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                                    {insight.impact}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {insight.confidence}% confident
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {insight.description}
                              </p>
                              {insight.actionable && (
                                <Button variant="outline" size="sm">
                                  Take Action
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </div>

            {/* Predictive Alerts */}
            <div>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Predictive Alerts</h3>
                    <p className="text-sm text-muted-foreground">Next 24-48 hours</p>
                  </div>
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                
                <div className="space-y-4">
                  {mockPredictiveAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === 'critical' ? 'border-destructive bg-destructive/5' :
                        alert.severity === 'warning' ? 'border-warning bg-warning/5' :
                        'border-primary bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{alert.metric}</span>
                        <Badge variant="outline" className="text-xs">
                          {alert.confidence}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {alert.prediction}
                      </p>
                      <p className="text-xs font-medium">
                        {alert.timeframe}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </TabsContent>

        {/* Real-Time Analytics Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {realTimeLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <GlassCard key={i} className="p-6">
                  <Skeleton className="h-20 w-full" />
                </GlassCard>
              ))
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-8 w-8 text-primary" />
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {realTimeData?.activeUsers.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <ShoppingCart className="h-8 w-8 text-success" />
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {realTimeData?.liveOrders}
                    </div>
                    <p className="text-sm text-muted-foreground">Live Orders</p>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="h-8 w-8 text-accent" />
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {realTimeData?.conversionRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="h-8 w-8 text-warning" />
                      <div className="w-3 h-3 bg-warning rounded-full animate-pulse" />
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {realTimeData?.serverLoad}%
                    </div>
                    <p className="text-sm text-muted-foreground">Server Load</p>
                  </GlassCard>
                </motion.div>
              </>
            )}
          </div>

          {/* Real-time Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Live Activity Stream</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { time: '10:00', users: 450, orders: 23 },
                    { time: '10:05', users: 478, orders: 27 },
                    { time: '10:10', users: 523, orders: 31 },
                    { time: '10:15', users: 567, orders: 29 },
                    { time: '10:20', users: 543, orders: 35 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)', 
                      borderRadius: '12px',
                      backdropFilter: 'blur(16px)'
                    }} />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Geographic Heat Map</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Interactive map visualization</p>
                  <p className="text-sm">Coming soon</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Other tabs would be implemented similarly */}
        <TabsContent value="predictive">
          <div className="text-center py-20">
            <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">Predictive Intelligence</h3>
            <p className="text-muted-foreground">Advanced forecasting and ML models coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="relationships">
          <div className="text-center py-20">
            <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">Relationship Graph</h3>
            <p className="text-muted-foreground">Interactive 3D network visualization coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <div className="text-center py-20">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">Custom Insights</h3>
            <p className="text-muted-foreground">Drag-and-drop dashboard builder coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
