import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, TrendingUp, Users, Music, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface CityDemandForecast {
  city: string;
  predictedTicketSales: number;
  confidence: number;
  fanBase: number;
  streamingActivity: number;
  historicalSales: number;
  marketScore: number;
}

interface DemandMetadata {
  totalCities: number;
  totalFans: number;
  totalStreams: number;
  totalHistoricalConcerts: number;
  kumoApiConnected: boolean;
  generatedAt: string;
}

// Major US cities for tour planning
const DEFAULT_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte',
  'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston'
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
      const { data, error: functionError } = await supabase.functions.invoke('artist-forecast-demand', {
        body: {
          projectId: currentProject.id,
          cities: DEFAULT_CITIES
        }
      });

      if (functionError) {
        throw functionError;
      }

      setForecasts(data.demandForecast || []);
      setMetadata(data.metadata || null);
    } catch (err) {
      console.error('Error fetching tour demand:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tour demand forecast');
    } finally {
      setLoading(false);
    }
  };

  const getDemandLevel = (predictedSales: number): { level: string; color: string; variant: any } => {
    if (predictedSales > 1000) return { level: 'Very High', color: 'bg-green-500', variant: 'default' as any };
    if (predictedSales > 500) return { level: 'High', color: 'bg-blue-500', variant: 'secondary' as any };
    if (predictedSales > 200) return { level: 'Medium', color: 'bg-yellow-500', variant: 'outline' as any };
    return { level: 'Low', color: 'bg-gray-400', variant: 'outline' as any };
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
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
                <Skeleton key={i} className="h-32 w-full" />
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
            <CardTitle className="text-sm font-medium">Cities Analyzed</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metadata?.totalCities || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fan Base</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metadata?.totalFans || 0)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatNumber(totalPredictedSales)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgConfidence * 100)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Cities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tour Hotspot Analysis</CardTitle>
              <CardDescription>
                Cities ranked by predicted ticket demand for your next tour.
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
                <Card key={city.city} className={`relative ${isTopCity ? 'ring-2 ring-primary/20' : ''}`}>
                  {isTopCity && (
                    <div className="absolute -top-2 -right-2">
                      <Badge variant="default" className="bg-primary">
                        #{index + 1}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{city.city}</CardTitle>
                      <Badge variant={demandInfo.variant}>
                        {demandInfo.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Predicted Sales</span>
                      <span className="font-bold text-lg">{formatNumber(city.predictedTicketSales)}</span>
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
                        <div className="text-xs text-muted-foreground">Streams</div>
                        <div className="font-medium">{formatNumber(city.streamingActivity)}</div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Market Score</span>
                        <span className="font-medium">{Math.round(city.marketScore * 100)}/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {forecasts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No fan or streaming data available. Add fans and streaming data to see tour demand forecasts.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}