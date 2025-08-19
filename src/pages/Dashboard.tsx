import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  Plus,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for the dashboard
const kpiData = [
  {
    title: 'Total Revenue',
    value: '$124,500',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-success'
  },
  {
    title: 'Active Users',
    value: '2,847',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'text-primary'
  },
  {
    title: 'Conversion Rate',
    value: '3.42%',
    change: '-2.1%',
    trend: 'down',
    icon: TrendingUp,
    color: 'text-accent'
  },
  {
    title: 'Page Views',
    value: '45,210',
    change: '+15.3%',
    trend: 'up',
    icon: Eye,
    color: 'text-secondary'
  }
];

const salesData = [
  { month: 'Jan', sales: 12000, users: 400, conversion: 3.2 },
  { month: 'Feb', sales: 19000, users: 450, conversion: 3.8 },
  { month: 'Mar', sales: 15000, users: 520, conversion: 2.9 },
  { month: 'Apr', sales: 25000, users: 680, conversion: 4.1 },
  { month: 'May', sales: 22000, users: 750, conversion: 3.5 },
  { month: 'Jun', sales: 30000, users: 890, conversion: 4.8 }
];

const demographicData = [
  { name: '18-24', value: 25, color: '#3b82f6' },
  { name: '25-34', value: 35, color: '#8b5cf6' },
  { name: '35-44', value: 20, color: '#06b6d4' },
  { name: '45-54', value: 15, color: '#10b981' },
  { name: '55+', value: 5, color: '#f59e0b' }
];

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState<'fashion' | 'music'>('fashion');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights for your business
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={selectedProject === 'fashion' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedProject('fashion')}
              className="transition-smooth"
            >
              Fashion
            </Button>
            <Button
              variant={selectedProject === 'music' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedProject('music')}
              className="transition-smooth"
            >
              Music
            </Button>
          </div>
          
          <Button className="gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <GlassCard key={index} variant="hover" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  kpi.color === 'text-success' ? 'from-success/20 to-success/10' :
                  kpi.color === 'text-primary' ? 'from-primary/20 to-primary/10' :
                  kpi.color === 'text-accent' ? 'from-accent/20 to-accent/10' :
                  'from-secondary/20 to-secondary/10'
                }`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <Badge variant={kpi.trend === 'up' ? 'default' : 'destructive'} className="gap-1">
                  <TrendIcon className="h-3 w-3" />
                  {kpi.change}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {kpi.value}
                </h3>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <GlassCard variant="hover" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Sales Trend</h3>
              <p className="text-sm text-muted-foreground">Monthly performance overview</p>
            </div>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(16px)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* User Growth Chart */}
        <GlassCard variant="hover" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">User Growth</h3>
              <p className="text-sm text-muted-foreground">Active user acquisition</p>
            </div>
            <Users className="h-5 w-5 text-secondary" />
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(16px)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Demographics Chart */}
        <GlassCard variant="hover" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Demographics</h3>
              <p className="text-sm text-muted-foreground">User age distribution</p>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(16px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {demographicData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Conversion Funnel */}
        <GlassCard variant="hover" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Conversion Funnel</h3>
              <p className="text-sm text-muted-foreground">Customer journey stages</p>
            </div>
            <ShoppingCart className="h-5 w-5 text-accent" />
          </div>
          
          <div className="space-y-4">
            {[
              { stage: 'Visitors', value: 10000, percentage: 100, color: 'bg-primary' },
              { stage: 'Product Views', value: 6500, percentage: 65, color: 'bg-secondary' },
              { stage: 'Add to Cart', value: 2800, percentage: 28, color: 'bg-accent' },
              { stage: 'Checkout', value: 1200, percentage: 12, color: 'bg-warning' },
              { stage: 'Purchase', value: 450, percentage: 4.5, color: 'bg-success' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{item.stage}</span>
                  <span className="text-muted-foreground">
                    {item.value.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${item.color} transition-all duration-1000`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;