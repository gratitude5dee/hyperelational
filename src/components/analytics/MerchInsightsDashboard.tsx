
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ShoppingBag, TrendingUp, AlertTriangle, DollarSign, Package, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { ProductGallery } from './ProductGallery';

interface MerchInsightsData {
  productPerformance: Array<{
    id: string;
    name: string;
    category: string;
    totalSold: number;
    revenue: number;
    avgPrice: number;
    profitMargin: number;
    inventoryStatus: 'low' | 'good' | 'overstocked';
    demandScore: number;
    imageUrl?: string;
  }>;
  venueInsights: Array<{
    venueId: string;
    venueName: string;
    city: string;
    totalSales: number;
    avgBasketSize: number;
    topProducts: string[];
    salesByHour: Array<{ hour: number; sales: number }>;
  }>;
  predictiveRecommendations: Array<{
    fanId: string;
    fanTier: string;
    recommendedProducts: Array<{
      productId: string;
      productName: string;
      probability: number;
      expectedRevenue: number;
    }>;
    personalizedMessage: string;
  }>;
  salesTrends: Array<{
    date: string;
    totalSales: number;
    totalRevenue: number;
    avgBasketSize: number;
    conversionRate: number;
  }>;
  inventoryAlerts: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    reorderPoint: number;
    urgency: 'high' | 'medium' | 'low';
    suggestedOrder: number;
  }>;
  totalRevenue: number;
  totalItemsSold: number;
  avgProfitMargin: number;
  topSellingCategory: string;
}

const INVENTORY_COLORS = {
  low: '#ef4444',
  good: '#10b981',
  overstocked: '#f59e0b'
};

const URGENCY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

export function MerchInsightsDashboard() {
  const { currentProject } = useAppStore();
  const { toast } = useToast();
  const [data, setData] = useState<MerchInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchMerchInsights();
  }, [currentProject, timeRange]);

  const fetchMerchInsights = async () => {
    if (!currentProject) return;

    try {
      setLoading(true);
      const { data: insightsData, error } = await supabase.functions.invoke('artist-merch-insights', {
        body: { 
          projectId: currentProject.id,
          timeRange 
        }
      });

      if (error) throw error;
      setData(insightsData);
    } catch (error) {
      console.error('Error fetching merch insights:', error);
      toast({
        title: "Error",
        description: "Failed to load merch insights data",
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
          <h2 className="text-2xl font-bold">Merchandise Insights</h2>
          <p className="text-muted-foreground">Optimize your merch strategy with AI-driven recommendations</p>
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
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            </div>
            <div className="text-3xl font-bold mt-2">${data.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-success mt-1">+{data.avgProfitMargin}% profit margin</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Items Sold</span>
            </div>
            <div className="text-3xl font-bold mt-2">{data.totalItemsSold.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">Total units</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Top Category</span>
            </div>
            <div className="text-3xl font-bold mt-2">{data.topSellingCategory}</div>
            <div className="text-sm text-success mt-1">Best performer</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Low Stock Items</span>
            </div>
            <div className="text-3xl font-bold mt-2">{data.inventoryAlerts.length}</div>
            <div className="text-sm text-destructive mt-1">Need attention</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gallery" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="gallery">Product Gallery</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-6">
          <ProductGallery />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Product</CardTitle>
                <CardDescription>Top performing merchandise items</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "hsl(var(--primary))" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.productPerformance}>
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Bar 
                        dataKey="revenue" 
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
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>Revenue and conversion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalRevenue: { label: "Revenue", color: "#3b82f6" },
                    totalSales: { label: "Sales", color: "#10b981" }
                  }}
                  className="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.salesTrends}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Line type="monotone" dataKey="totalRevenue" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="totalSales" stroke="#10b981" strokeWidth={2} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Performance Details</CardTitle>
              <CardDescription>Comprehensive breakdown of all merchandise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.productPerformance.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.category} • {product.totalSold} sold
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">${product.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.profitMargin}% margin
                        </div>
                      </div>
                      <Badge 
                        style={{ 
                          backgroundColor: INVENTORY_COLORS[product.inventoryStatus],
                          color: 'white'
                        }}
                      >
                        {product.inventoryStatus}
                      </Badge>
                      <div className="text-right">
                        <div className="font-medium">{product.demandScore}/100</div>
                        <div className="text-xs text-muted-foreground">Demand</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venues" className="space-y-6">
          {data.venueInsights.map((venue) => (
            <Card key={venue.venueId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {venue.venueName}
                    </CardTitle>
                    <CardDescription>{venue.city}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${venue.totalSales.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Sales</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Top Products</h4>
                    <div className="space-y-2">
                      {venue.topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{product}</span>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-primary/10 rounded">
                      <div className="text-sm font-medium">Average Basket Size</div>
                      <div className="text-xl font-bold">${venue.avgBasketSize}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Sales by Hour</h4>
                    <ChartContainer
                      config={{
                        sales: { label: "Sales", color: "hsl(var(--primary))" }
                      }}
                      className="h-40"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={venue.salesByHour}>
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Bar 
                            dataKey="sales" 
                            fill="hsl(var(--primary))"
                            radius={[2, 2, 0, 0]}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Fan Recommendations</CardTitle>
              <CardDescription>Personalized product suggestions for individual fans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.predictiveRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">Fan #{rec.fanId}</div>
                        <Badge variant="outline">{rec.fanTier} Fan</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground italic">
                        "{rec.personalizedMessage}"
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rec.recommendedProducts.map((product, pIndex) => (
                        <div key={pIndex} className="flex items-center justify-between p-3 bg-muted rounded">
                          <div>
                            <div className="font-medium">{product.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round(product.probability * 100)}% purchase probability
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-success">
                              ${product.expectedRevenue.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">Expected</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Products that need restocking attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.inventoryAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle 
                        className="h-5 w-5" 
                        style={{ color: URGENCY_COLORS[alert.urgency] }}
                      />
                      <div>
                        <div className="font-medium">{alert.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          Current: {alert.currentStock} | Reorder at: {alert.reorderPoint}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        style={{ 
                          backgroundColor: URGENCY_COLORS[alert.urgency],
                          color: 'white'
                        }}
                      >
                        {alert.urgency} priority
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold">Order {alert.suggestedOrder}</div>
                        <div className="text-sm text-muted-foreground">Suggested</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
