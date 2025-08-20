import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ShoppingBag, TrendingUp, Star, Zap, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface ProductRecommendation {
  productId: string;
  productName: string;
  price: number;
  category: string;
  score: number;
  reason: string;
  imageUrl?: string;
}

interface RecommendationMetadata {
  customerId: string;
  customerSegment: string;
  totalProducts: number;
  purchaseHistory: number;
  browsingHistory: number;
  kumoApiConnected: boolean;
}

export function ProductRecommendationEngine() {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [metadata, setMetadata] = useState<RecommendationMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const { currentProject } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    if (currentProject?.id && currentProject.type === 'fashion_ecommerce') {
      fetchCustomers();
    }
  }, [currentProject?.id, currentProject?.type]);

  const fetchCustomers = async () => {
    try {
      // Try to fetch from Supabase first
      if (currentProject?.id && !currentProject.id.includes('temp')) {
        const { data, error } = await supabase
          .from('customers')
          .select('id, name, email')
          .eq('project_id', currentProject.id)
          .limit(10);

        if (!error && data && data.length > 0) {
          setCustomers(data);
          if (!customerId) setCustomerId(data[0].id);
          return;
        }
      }
      
      // Fallback to mock data
      const mockDataModule = await import('@/services/MockDataService');
      const mockCustomers = mockDataModule.MockDataService.generateMockCustomers(10);
      const formattedCustomers = mockCustomers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email
      }));
      
      setCustomers(formattedCustomers);
      if (!customerId && formattedCustomers.length > 0) {
        setCustomerId(formattedCustomers[0].id);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchRecommendations = async () => {
    if (!customerId) return;

    setLoading(true);
    setError(null);

    try {
      // Try to fetch from Supabase function first
      if (currentProject?.id && !currentProject.id.includes('temp')) {
        const { data, error: functionError } = await supabase.functions.invoke('retail-recommend-products', {
          body: {
            projectId: currentProject.id,
            userId: customerId,
            count: 8
          }
        });

        if (!functionError && data?.recommendations) {
          setRecommendations(data.recommendations);
          setMetadata(data.metadata);
          toast({
            title: "Recommendations Updated",
            description: `Found ${data.recommendations.length} personalized product recommendations.`,
          });
          setLoading(false);
          return;
        }
      }

      // Fallback to mock data
      const mockDataModule = await import('@/services/MockDataService');
      const mockRecommendations = mockDataModule.MockDataService.generateProductRecommendations(customerId);
      
      const mockMetadata: RecommendationMetadata = {
        customerId: customerId,
        customerSegment: 'Premium Customer',
        totalProducts: mockRecommendations.length,
        purchaseHistory: 12,
        browsingHistory: 45,
        kumoApiConnected: false
      };

      setRecommendations(mockRecommendations);
      setMetadata(mockMetadata);

      toast({
        title: "Demo Recommendations Generated",
        description: `Found ${mockRecommendations.length} personalized product recommendations.`,
      });
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product recommendations');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score > 0.8) return 'text-green-600';
    if (score > 0.5) return 'text-blue-600';
    if (score > 0.3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreIcon = (score: number) => {
    if (score > 0.8) return <Star className="h-4 w-4" />;
    if (score > 0.5) return <TrendingUp className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  if (currentProject?.type !== 'fashion_ecommerce') {
    return (
      <Alert>
        <ShoppingBag className="h-4 w-4" />
        <AlertDescription>
          Product recommendations are available for E-commerce projects. 
          Switch to E-commerce mode to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Selection */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Product Recommendation Engine
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate personalized product recommendations for individual customers using AI-powered analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block text-foreground">Select Customer</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="" className="text-muted-foreground">Choose a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id} className="text-foreground">
                    {customer.name || customer.email} ({customer.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-6">
              <Button 
                onClick={fetchRecommendations}
                disabled={loading || !customerId}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Generate Recommendations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      {metadata && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Customer Segment</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                {metadata.customerSegment || 'General'}
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metadata.purchaseHistory}</div>
              <p className="text-xs text-muted-foreground">Previous orders</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Browsing Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metadata.browsingHistory}</div>
              <p className="text-xs text-muted-foreground">Page views</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Catalog Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metadata.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Available products</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2" 
              onClick={fetchRecommendations}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Personalized Recommendations</CardTitle>
            <CardDescription className="text-muted-foreground">
              Products ranked by likelihood of purchase for this customer.
              {!metadata?.kumoApiConnected && (
                <span className="text-yellow-400"> (Using demo predictions - connect real data for enhanced accuracy)</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec, index) => (
                <Card key={rec.productId} className="relative overflow-hidden">
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur">
                      #{index + 1}
                    </Badge>
                  </div>
                  
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {rec.imageUrl ? (
                      <img 
                        src={rec.imageUrl} 
                        alt={rec.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-foreground">
                      {rec.productName}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                        {rec.category}
                      </Badge>
                      <span className="font-bold text-lg text-foreground">
                        {formatCurrency(rec.price)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-green-400">
                        {getScoreIcon(rec.score)}
                        <span className="text-sm font-medium">
                          {Math.round(rec.score * 100)}% match
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rec.reason}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : customerId && !loading ? (
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="text-center py-8">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-foreground font-medium mb-2">No recommendations available for this customer.</p>
            <p className="text-sm text-muted-foreground">Add products and customer activity data to generate recommendations.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}