
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, TrendingUp, Users, Music, RefreshCw, Star, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface CityDemandForecast {
  city: string;
  state: string;
  predictedTicketSales: number;
  confidence: number;
  fanBase: number;
  streamingActivity: number;
  historicalSales: number;
  marketScore: number;
  avgTicketPrice: number;
  venueCapacity: number;
  seasonality: 'peak' | 'good' | 'low';
  lastTourDate: string | null;
  socialBuzz: number;
  imageUrl: string;
}

interface DemandMetadata {
  totalCities: number;
  totalFans: number;
  totalStreams: number;
  totalHistoricalConcerts: number;
  kumoApiConnected: boolean;
  generatedAt: string;
  tourRevenuePotential: number;
  recommendedTourDates: string[];
}

// Enhanced mock data with more realistic tour markets
const ENHANCED_MOCK_DATA: CityDemandForecast[] = [
  {
    city: 'Los Angeles',
    state: 'CA',
    predictedTicketSales: 2850,
    confidence: 0.94,
    fanBase: 28500,
    streamingActivity: 185000,
    historicalSales: 2650,
    marketScore: 0.96,
    avgTicketPrice: 85,
    venueCapacity: 3000,
    seasonality: 'peak',
    lastTourDate: '2023-08-15',
    socialBuzz: 92,
    imageUrl: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=400&h=300&fit=crop'
  },
  {
    city: 'New York',
    state: 'NY',
    predictedTicketSales: 2650,
    confidence: 0.91,
    fanBase: 32000,
    streamingActivity: 210000,
    historicalSales: 2400,
    marketScore: 0.93,
    avgTicketPrice: 95,
    venueCapacity: 2800,
    seasonality: 'peak',
    lastTourDate: '2023-07-22',
    socialBuzz: 89,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop'
  },
  {
    city: 'Nashville',
    state: 'TN',
    predictedTicketSales: 2200,
    confidence: 0.88,
    fanBase: 18500,
    streamingActivity: 125000,
    historicalSales: 2100,
    marketScore: 0.89,
    avgTicketPrice: 75,
    venueCapacity: 2500,
    seasonality: 'peak',
    lastTourDate: null,
    socialBuzz: 95,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
  },
  {
    city: 'Austin',
    state: 'TX',
    predictedTicketSales: 1950,
    confidence: 0.86,
    fanBase: 22000,
    streamingActivity: 145000,
    historicalSales: 1800,
    marketScore: 0.87,
    avgTicketPrice: 70,
    venueCapacity: 2200,
    seasonality: 'peak',
    lastTourDate: '2024-01-10',
    socialBuzz: 88,
    imageUrl: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&h=300&fit=crop'
  },
  {
    city: 'Chicago',
    state: 'IL',
    predictedTicketSales: 1850,
    confidence: 0.83,
    fanBase: 25000,
    streamingActivity: 160000,
    historicalSales: 1700,
    marketScore: 0.85,
    avgTicketPrice: 80,
    venueCapacity: 2400,
    seasonality: 'good',
    lastTourDate: '2023-09-05',
    socialBuzz: 82,
    imageUrl: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=300&fit=crop'
  },
  {
    city: 'Atlanta',
    state: 'GA',
    predictedTicketSales: 1650,
    confidence: 0.81,
    fanBase: 19500,
    streamingActivity: 130000,
    historicalSales: 1500,
    marketScore: 0.82,
    avgTicketPrice: 75,
    venueCapacity: 2000,
    seasonality: 'good',
    lastTourDate: '2023-11-18',
    socialBuzz: 79,
    imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&h=300&fit=crop'
  },
  {
    city: 'Seattle',
    state: 'WA',
    predictedTicketSales: 1450,
    confidence: 0.78,
    fanBase: 16500,
    streamingActivity: 110000,
    historicalSales: 1350,
    marketScore: 0.79,
    avgTicketPrice: 85,
    venueCapacity: 1800,
    seasonality: 'good',
    lastTourDate: '2023-10-12',
    socialBuzz: 76,
    imageUrl: 'https://images.unsplash.com/photo-1541560052-77a2a7050905?w=400&h=300&fit=crop'
  },
  {
    city: 'Denver',
    state: 'CO',
    predictedTicketSales: 1250,
    confidence: 0.75,
    fanBase: 14000,
    streamingActivity: 95000,
    historicalSales: 1200,
    marketScore: 0.76,
    avgTicketPrice: 70,
    venueCapacity: 1600,
    seasonality: 'good',
    lastTourDate: '2024-02-28',
    socialBuzz: 73,
    imageUrl: 'https://images.unsplash.com/photo-1619856699906-09e1f58c98b1?w=400&h=300&fit=crop'
  },
  {
    city: 'Portland',
    state: 'OR',
    predictedTicketSales: 950,
    confidence: 0.72,
    fanBase: 12500,
    streamingActivity: 85000,
    historicalSales: 900,
    marketScore: 0.73,
    avgTicketPrice: 65,
    venueCapacity: 1400,
    seasonality: 'low',
    lastTourDate: null,
    socialBuzz: 68,
    imageUrl: 'https://images.unsplash.com/photo-1629684726718-b1b8e6386fed?w=400&h=300&fit=crop'
  },
  {
    city: 'Phoenix',
    state: 'AZ',
    predictedTicketSales: 850,
    confidence: 0.68,
    fanBase: 11000,
    streamingActivity: 75000,
    historicalSales: 800,
    marketScore: 0.69,
    avgTicketPrice: 70,
    venueCapacity: 1200,
    seasonality: 'low',
    lastTourDate: '2023-12-03',
    socialBuzz: 64,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  }
];

export function TourHotspotMap() {
  const [forecasts, setForecasts] = useState<CityDemandForecast[]>([]);
  const [metadata, setMetadata] = useState<DemandMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentProject } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    if (currentProject?.id && currentProject.type === 'creative_hub') {
      fetchTourDemand();
    }
  }, [currentProject?.id, currentProject?.type]);

  const fetchTourDemand = async () => {
    if (!currentProject?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API call with enhanced mock data
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const sortedForecasts = ENHANCED_MOCK_DATA.sort((a, b) => b.predictedTicketSales - a.predictedTicketSales);
      setForecasts(sortedForecasts);
      
      const totalFans = sortedForecasts.reduce((sum, city) => sum + city.fanBase, 0);
      const totalStreams = sortedForecasts.reduce((sum, city) => sum + city.streamingActivity, 0);
      const tourRevenue = sortedForecasts.reduce((sum, city) => sum + (city.predictedTicketSales * city.avgTicketPrice), 0);
      
      setMetadata({
        totalCities: sortedForecasts.length,
        totalFans,
        totalStreams,
        totalHistoricalConcerts: 15,
        kumoApiConnected: false,
        generatedAt: new Date().toISOString(),
        tourRevenuePotential: tourRevenue,
        recommendedTourDates: ['2024-09-15', '2024-10-22', '2024-11-08']
      });
    } catch (err) {
      console.error('Error fetching tour demand:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tour demand forecast');
    } finally {
      setLoading(false);
    }
  };

  const getDemandLevel = (predictedSales: number): { level: string; color: string; variant: any } => {
    if (predictedSales > 2000) return { level: 'Very High', color: 'bg-green-500', variant: 'default' as any };
    if (predictedSales > 1500) return { level: 'High', color: 'bg-blue-500', variant: 'secondary' as any };
    if (predictedSales > 1000) return { level: 'Medium', color: 'bg-yellow-500', variant: 'outline' as any };
    return { level: 'Low', color: 'bg-gray-400', variant: 'outline' as any };
  };

  const getSeasonalityColor = (seasonality: string) => {
    switch (seasonality) {
      case 'peak': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (currentProject?.type !== 'creative_hub') {
    return (
      <Alert>
        <Music className="h-4 w-4" />
        <AlertDescription>
          Tour hotspot mapping is available for Artist Analytics projects. 
          Switch to Artist Analytics mode to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2" 
            onClick={fetchTourDemand}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const topCities = forecasts.slice(0, 3);
  const totalPredictedSales = forecasts.reduce((sum, city) => sum + city.predictedTicketSales, 0);
  const avgConfidence = forecasts.length > 0 
    ? forecasts.reduce((sum, city) => sum + city.confidence, 0) / forecasts.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tour Revenue Potential</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(metadata?.tourRevenuePotential || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Based on predicted sales</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fan Base</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metadata?.totalFans || 0)}</div>
            <p className="text-xs text-muted-foreground">Across all markets</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Tickets</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatNumber(totalPredictedSales)}</div>
            <p className="text-xs text-muted-foreground">Total tour capacity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgConfidence * 100)}%</div>
            <p className="text-xs text-muted-foreground">Prediction accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Tour Markets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Tour Market Analysis
              </CardTitle>
              <CardDescription>
                Cities ranked by predicted ticket demand and market potential for your next tour.
                {!metadata?.kumoApiConnected && (
                  <span className="text-warning"> (Using simulated predictions - connect KumoRFM for enhanced accuracy)</span>
                )}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchTourDemand} 
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forecasts.map((city, index) => {
              const demandInfo = getDemandLevel(city.predictedTicketSales);
              const isTopCity = index < 3;
              
              return (
                <Card key={`${city.city}-${city.state}`} className={`relative overflow-hidden ${isTopCity ? 'ring-2 ring-primary/20' : ''}`}>
                  {isTopCity && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge variant="default" className="bg-primary">
                        #{index + 1}
                      </Badge>
                    </div>
                  )}
                  
                  {/* City Image */}
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={city.imageUrl} 
                      alt={`${city.city}, ${city.state}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2l0eSBJbWFnZTwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{city.city}</h3>
                        <p className="text-sm text-muted-foreground">{city.state}</p>
                      </div>
                      <Badge variant={demandInfo.variant} className="shrink-0">
                        {demandInfo.level}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Predicted Sales</span>
                        <span className="font-bold text-lg">{formatNumber(city.predictedTicketSales)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Revenue Potential</span>
                        <span className="font-semibold text-success">
                          {formatCurrency(city.predictedTicketSales * city.avgTicketPrice)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 bg-primary rounded-full"
                              style={{ width: `${city.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{Math.round(city.confidence * 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <div className="text-xs text-muted-foreground">Fan Base</div>
                          <div className="font-medium">{formatNumber(city.fanBase)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Avg Price</div>
                          <div className="font-medium">{formatCurrency(city.avgTicketPrice)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <div className="text-xs text-muted-foreground">Seasonality</div>
                          <Badge variant="outline" className={`text-xs ${getSeasonalityColor(city.seasonality)}`}>
                            {city.seasonality}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Social Buzz</div>
                          <div className="font-medium">{city.socialBuzz}/100</div>
                        </div>
                      </div>
                      
                      {city.lastTourDate && (
                        <div className="pt-1 border-t">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Last show: {new Date(city.lastTourDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {forecasts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No market data available.</p>
              <p className="text-sm">Connect your streaming and fan data to see tour demand forecasts.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
