import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, TrendingDown, Users, AlertTriangle, Mail, Gift, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface ChurnPrediction {
  userId: string;
  churnProbability: number;
  lastSeen: string;
  ltv: number;
  riskLevel: 'high' | 'medium' | 'low';
}

interface ChurnMetadata {
  totalCustomers: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  kumoApiConnected: boolean;
}

export function ChurnRiskDashboard() {
  const [predictions, setPredictions] = useState<ChurnPrediction[]>([]);
  const [metadata, setMetadata] = useState<ChurnMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentProject } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    if (currentProject?.id) {
      fetchChurnPredictions();
    }
  }, [currentProject?.id]);

  const fetchChurnPredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from Supabase function first
      if (currentProject?.id && !currentProject.id.includes('temp')) {
        const { data, error: functionError } = await supabase.functions.invoke('retail-predict-churn', {
          body: {
            projectId: currentProject.id,
            limit: 100
          }
        });

        if (!functionError && data?.predictions) {
          setPredictions(data.predictions);
          setMetadata(data.metadata);
          setLoading(false);
          return;
        }
      }

      // Fallback to mock data
      const mockDataModule = await import('@/services/MockDataService');
      const mockCustomers = mockDataModule.MockDataService.generateMockCustomers(50);
      
      const mockPredictions: ChurnPrediction[] = mockCustomers.map(customer => ({
        userId: customer.id,
        churnProbability: customer.churn_probability,
        lastSeen: customer.last_seen,
        ltv: customer.lifetime_value,
        riskLevel: customer.churn_risk
      }));

      const mockMetadata: ChurnMetadata = {
        totalCustomers: mockPredictions.length,
        highRiskCount: mockPredictions.filter(p => p.riskLevel === 'high').length,
        mediumRiskCount: mockPredictions.filter(p => p.riskLevel === 'medium').length,
        lowRiskCount: mockPredictions.filter(p => p.riskLevel === 'low').length,
        kumoApiConnected: false
      };

      setPredictions(mockPredictions);
      setMetadata(mockMetadata);
    } catch (err) {
      console.error('Error fetching churn predictions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch churn predictions');
    } finally {
      setLoading(false);
    }
  };

  const handleRetentionAction = async (userId: string, action: string) => {
    toast({
      title: `${action} Initiated`,
      description: `Retention campaign for customer ${userId} has been queued.`,
    });
    
    // Here you would typically call an API to trigger the actual retention campaign
    console.log(`Triggering ${action} for user ${userId}`);
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
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
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2" 
            onClick={fetchChurnPredictions}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metadata?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All customers tracked</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{metadata?.highRiskCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Immediate attention needed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Medium Risk</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{metadata?.mediumRiskCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Monitor closely</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Low Risk</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{metadata?.lowRiskCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Healthy customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Churn Predictions Table */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Customer Churn Risk Analysis</CardTitle>
          <CardDescription className="text-muted-foreground">
            Customers sorted by churn probability. Take action on high-risk customers to improve retention.
            {!metadata?.kumoApiConnected && (
              <span className="text-yellow-400"> (Using demo data - connect real data for enhanced accuracy)</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Churn Probability</TableHead>
                  <TableHead>Lifetime Value</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((prediction) => (
                  <TableRow key={prediction.userId}>
                    <TableCell className="font-medium">
                      {prediction.userId.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(prediction.riskLevel)}>
                        {prediction.riskLevel.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              prediction.churnProbability > 0.7 ? 'bg-destructive' :
                              prediction.churnProbability > 0.4 ? 'bg-warning' : 'bg-success'
                            }`}
                            style={{ width: `${prediction.churnProbability * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(prediction.churnProbability * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(prediction.ltv)}</TableCell>
                    <TableCell>{formatDate(prediction.lastSeen)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleRetentionAction(prediction.userId, 'Email Campaign')}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRetentionAction(prediction.userId, 'Discount Offer')}
                          >
                            <Gift className="mr-2 h-4 w-4" />
                            Send Discount Offer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRetentionAction(prediction.userId, 'Personal Outreach')}
                          >
                            <Target className="mr-2 h-4 w-4" />
                            Personal Outreach
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {predictions.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-foreground font-medium mb-2">No customer data available</p>
              <p className="text-muted-foreground text-sm">Add customers and orders to see churn predictions.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}