
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Globe, Heart, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface FanAnalyticsData {
  fanTiers: Array<{
    tier: string;
    count: number;
    percentage: number;
    avgEngagement: number;
    totalRevenue: number;
    avgLifetimeValue: number;
  }>;
  topLocations: Array<{
    city: string;
    country: string;
    fanCount: number;
    avgEngagement: number;
    topGenres: string[];
  }>;
  engagementTrends: Array<{
    date: string;
    streams: number;
    ticketSales: number;
    merchSales: number;
    socialShares: number;
  }>;
  churnPredictions: {
    riskCounts: { high: number; medium: number; low: number };
    predictedChurn: { next30Days: number; next60Days: number; next90Days: number };
    retentionRate: number;
    avgChurnScore: number;
  };
  demographics: {
    ageGroups: Array<{ range: string; count: number; percentage: number }>;
    genderSplit: Array<{ gender: string; count: number; percentage: number }>;
  };
  totalFans: number;
  avgEngagementScore: number;
  monthlyGrowthRate: number;
}

const TIER_COLORS = {
  superfan: '#10b981',
  active: '#3b82f6',
  casual: '#f59e0b',
  'at-risk': '#ef4444'
};

const RISK_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

export function FanAnalyticsDashboard() {
  const { currentProject } = useAppStore();
  const { toast } = useToast();
  const [data, setData] = useState<FanAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchFanAnalytics();
  }, [currentProject, timeRange]);

  const fetchFanAnalytics = async () => {
    if (!currentProject) return;

    try {
      setLoading(true);
      const { data: analyticsData, error } = await supabase.functions.invoke('artist-fan-analytics', {
        body: { 
          projectId: currentProject.id,
          timeRange 
        }
      });

      if (error) throw error;
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching fan analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load fan analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fan Engagement Analytics</h2>
          <p className="text-muted-foreground">Analyze fan behavior, engagement, and churn risk</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Fans</span>
            </div>
            <div className="text-3xl font-bold mt-2">{data.totalFans.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+{data.monthlyGrowthRate}% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Avg Engagement</span>
            </div>
            <div className="text-3xl font-bold mt-2">{data.avgEngagementScore}/100</div>
            <div className="text-sm text-muted-foreground mt-1">Engagement Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Retention Rate</span>
            </div>
            <div className="text-3xl font-bold mt-2">{data.churnPredictions.retentionRate}%</div>
            <div className="text-sm text-success mt-1">Above industry avg</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">At-Risk Fans</span>
            </div>
            <div className="text-3xl font-bold mt-2">{data.churnPredictions.riskCounts.high}</div>
            <div className="text-sm text-destructive mt-1">High churn risk</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tiers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tiers">Fan Tiers</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Trends</TabsTrigger>
          <TabsTrigger value="locations">Top Locations</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fan Tier Distribution</CardTitle>
                <CardDescription>Breakdown by engagement level</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    superfan: { label: "Superfan", color: TIER_COLORS.superfan },
                    active: { label: "Active", color: TIER_COLORS.active },
                    casual: { label: "Casual", color: TIER_COLORS.casual },
                    'at-risk': { label: "At Risk", color: TIER_COLORS['at-risk'] }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.fanTiers}
                        dataKey="count"
                        nameKey="tier"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ tier, percentage }) => `${tier}: ${percentage}%`}
                      >
                        {data.fanTiers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TIER_COLORS[entry.tier as keyof typeof TIER_COLORS]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Fan Tier</CardTitle>
                <CardDescription>Total revenue generated by each tier</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalRevenue: { label: "Revenue", color: "hsl(var(--primary))" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.fanTiers}>
                      <XAxis dataKey="tier" />
                      <YAxis />
                      <Bar 
                        dataKey="totalRevenue" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.fanTiers.map((tier) => (
              <Card key={tier.tier}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      style={{ backgroundColor: TIER_COLORS[tier.tier as keyof typeof TIER_COLORS] }}
                      className="text-white"
                    >
                      {tier.tier}
                    </Badge>
                    <span className="text-2xl font-bold">{tier.count.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engagement:</span>
                      <span>{tier.avgEngagement}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg LTV:</span>
                      <span>${tier.avgLifetimeValue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends Over Time</CardTitle>
              <CardDescription>Track fan activity across different channels</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  streams: { label: "Streams", color: "#3b82f6" },
                  ticketSales: { label: "Ticket Sales", color: "#10b981" },
                  merchSales: { label: "Merch Sales", color: "#f59e0b" },
                  socialShares: { label: "Social Shares", color: "#8b5cf6" }
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.engagementTrends}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Line type="monotone" dataKey="streams" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="ticketSales" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="merchSales" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="socialShares" stroke="#8b5cf6" strokeWidth={2} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Fan Locations</CardTitle>
              <CardDescription>Geographic distribution of your fanbase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{location.city}, {location.country}</div>
                        <div className="text-sm text-muted-foreground">
                          Top genres: {location.topGenres.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{location.fanCount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {location.avgEngagement}/100 engagement
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Fan breakdown by age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: { label: "Count", color: "hsl(var(--primary))" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.demographics.ageGroups}>
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Fan breakdown by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    Female: { label: "Female", color: "#ec4899" },
                    Male: { label: "Male", color: "#3b82f6" },
                    Other: { label: "Other", color: "#8b5cf6" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.demographics.genderSplit}
                        dataKey="count"
                        nameKey="gender"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ gender, percentage }) => `${gender}: ${percentage}%`}
                      >
                        {data.demographics.genderSplit.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              entry.gender === 'Female' ? '#ec4899' :
                              entry.gender === 'Male' ? '#3b82f6' : '#8b5cf6'
                            } 
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
