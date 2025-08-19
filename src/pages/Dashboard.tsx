import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

type KPIItem = { title: string; value: string; change: string; trend: 'up' | 'down' };
type SalesRow = { month: string; sales: number; users: number; conversion?: number };
type Demographic = { name: string; value: number; color: string };
type FunnelData = { columns: string[]; rows: [string, number][] };

const widgetConfig = {
  fashion: {
    kpis: [
      { id: 'kpi-1', icon: DollarSign, color: 'text-success' },
      { id: 'kpi-2', icon: Users, color: 'text-primary' },
      { id: 'kpi-3', icon: TrendingUp, color: 'text-accent' },
      { id: 'kpi-4', icon: Eye, color: 'text-secondary' },
    ],
    charts: {
      salesTrend: { id: 'area-1', type: 'area_chart' },
      userGrowth: { id: 'line-1', type: 'line_chart' },
      demographics: { id: 'pie-1', type: 'pie' },
      funnel: { id: 'table-1', type: 'table' }
    }
  },
  creative: {
    kpis: [
      { id: 'kpi-1m', icon: DollarSign, color: 'text-success' },
      { id: 'kpi-2m', icon: Users, color: 'text-primary' },
      { id: 'kpi-3m', icon: TrendingUp, color: 'text-accent' },
      { id: 'kpi-4m', icon: Eye, color: 'text-secondary' },
    ],
    charts: {
      salesTrend: { id: 'area-1m', type: 'area_chart' },
      userGrowth: { id: 'line-1m', type: 'line_chart' },
      demographics: { id: 'pie-1m', type: 'pie' },
      funnel: { id: 'table-1m', type: 'table' }
    }
  }
} as const;

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState<'fashion' | 'creative'>('fashion');

  const kpis = widgetConfig[selectedProject].kpis;
  const charts = widgetConfig[selectedProject].charts;

  const { data: kpiResp, isLoading: kpiLoading, isError: kpiError, refetch: refetchKpis } = useQuery({
    queryKey: ['kpis', selectedProject],
    queryFn: async () => fetchWidgetData('kpis', 'kpi', selectedProject),
  });

  const { data: salesResp, isLoading: salesLoading, isError: salesError, refetch: refetchSales } = useQuery({
    queryKey: ['sales', selectedProject],
    queryFn: async () => fetchWidgetData(charts.salesTrend.id, charts.salesTrend.type, selectedProject),
  });

  const { data: userResp, isLoading: userLoading, isError: userError, refetch: refetchUsers } = useQuery({
    queryKey: ['users', selectedProject],
    queryFn: async () => fetchWidgetData(charts.userGrowth.id, charts.userGrowth.type, selectedProject),
  });

  const { data: demoResp, isLoading: demoLoading, isError: demoError, refetch: refetchDemo } = useQuery({
    queryKey: ['demo', selectedProject],
    queryFn: async () => fetchWidgetData(charts.demographics.id, charts.demographics.type, selectedProject),
  });

  const { data: funnelResp, isLoading: funnelLoading, isError: funnelError, refetch: refetchFunnel } = useQuery({
    queryKey: ['funnel', selectedProject],
    queryFn: async () => fetchWidgetData(charts.funnel.id, charts.funnel.type, selectedProject),
  });

  const salesData = (salesResp?.data as SalesRow[]) || [];
  const userData = (userResp?.data as SalesRow[]) || salesData;
  const demographicData = (demoResp?.data as Demographic[]) || [];

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
              variant={selectedProject === 'creative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedProject('creative')}
              className="transition-smooth"
            >
              Creative
            </Button>
          </div>
          
          <Button className="gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiLoading && kpis.map((kpi, idx) => (
          <GlassCard key={idx} variant="hover" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-7 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </GlassCard>
        ))}
        {!kpiLoading && !kpiError && Array.isArray(kpiResp?.data) && kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const item = kpiResp.data[index % kpiResp.data.length];
          const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;
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
                <Badge variant={item.trend === 'up' ? 'default' : 'destructive'} className="gap-1">
                  <TrendIcon className="h-3 w-3" />
                  {item.change}
                </Badge>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {item.value}
                </h3>
                <p className="text-sm text-muted-foreground">{item.title}</p>
              </div>
            </GlassCard>
          );
        })}
        {kpiError && (
          <GlassCard variant="hover" className="p-6 col-span-4">
            <div className="flex items-center justify-between">
              <div className="text-destructive">Failed to load KPIs</div>
              <Button variant="outline" size="sm" onClick={() => refetchKpis()}>Retry</Button>
            </div>
          </GlassCard>
        )}
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
            {salesLoading ? (
              <div className="h-full w-full flex flex-col justify-center gap-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-60 w-full" />
              </div>
            ) : salesError ? (
              <div className="h-full w-full flex items-center justify-between">
                <div className="text-destructive">Failed to load Sales Trend</div>
                <Button variant="outline" size="sm" onClick={() => refetchSales()}>Retry</Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12}/>
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(16px)' }} />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#salesGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
            {userLoading ? (
              <div className="h-full w-full flex flex-col justify-center gap-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-60 w-full" />
              </div>
            ) : userError ? (
              <div className="h-full w-full flex items-center justify-between">
                <div className="text-destructive">Failed to load User Growth</div>
                <Button variant="outline" size="sm" onClick={() => refetchUsers()}>Retry</Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12}/>
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(16px)' }} />
                  <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }} activeDot={{ r: 8, fill: '#8b5cf6' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
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
            {demoLoading ? (
              <div className="h-full w-full flex flex-col justify-center gap-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-60 w-full" />
              </div>
            ) : demoError ? (
              <div className="h-full w-full flex items-center justify-between">
                <div className="text-destructive">Failed to load Demographics</div>
                <Button variant="outline" size="sm" onClick={() => refetchDemo()}>Retry</Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demographicData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {demographicData.map((entry: Demographic, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(16px)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {!demoLoading && !demoError && Array.isArray(demoResp?.data) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {demographicData.map((item: Demographic, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          )}
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
          
          {funnelLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="flex items-center justify-between text-sm">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="flex items-center justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          ) : funnelError ? (
            <div className="flex items-center justify-between">
              <div className="text-destructive">Failed to load Funnel</div>
              <Button variant="outline" size="sm" onClick={() => refetchFunnel()}>Retry</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                const rows = ((funnelResp?.data as FunnelData | undefined)?.rows ?? []) as [string, number][];
                const first = rows[0]?.[1] || 1;
                const colors = ['bg-primary','bg-secondary','bg-accent','bg-warning','bg-success'];
                return rows.map((r, idx) => {
                  const stage = r[0];
                  const value = r[1];
                  const percentage = Math.max(0, Math.min(100, Math.round((value / first) * 100)));
                  const color = colors[idx % colors.length];
                  return (
                    <div key={stage} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">{stage}</span>
                        <span className="text-muted-foreground">
                          {Number(value).toLocaleString()} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${color} transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
