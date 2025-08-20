import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Database, Loader2, CheckCircle, AlertTriangle, Users, ShoppingBag, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface SeedResults {
  created: string[];
  errors: string[];
}

export function SampleDataButton() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SeedResults | null>(null);
  const { currentProject } = useAppStore();
  const { toast } = useToast();

  const seedSampleData = async () => {
    if (!currentProject?.id || !currentProject?.type) {
      toast({
        title: "No Project Selected",
        description: "Please select a project before seeding data.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('sample-data-seeder', {
        body: {
          projectId: currentProject.id,
          projectType: currentProject.type,
          recordCount: 100
        }
      });

      if (error) {
        throw error;
      }

      setResults(data.results);
      
      toast({
        title: "Sample Data Created",
        description: `Successfully seeded ${currentProject.type === 'fashion_ecommerce' ? 'e-commerce' : 'artist'} data for testing.`,
      });

    } catch (err) {
      console.error('Error seeding sample data:', err);
      toast({
        title: "Seeding Failed",
        description: err instanceof Error ? err.message : 'Failed to create sample data',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProjectTypeInfo = () => {
    if (currentProject?.type === 'fashion_ecommerce') {
      return {
        icon: <ShoppingBag className="h-5 w-5" />,
        title: 'E-commerce Sample Data',
        description: 'Create sample customers, products, orders, and analytics data for fashion retail testing.',
        features: ['100 Products', '100 Customers', '200 Orders', 'Order Items', 'Page Views']
      };
    } else {
      return {
        icon: <Music className="h-5 w-5" />,
        title: 'Artist Analytics Sample Data', 
        description: 'Create sample fans, concerts, streams, and merchandise data for artist analytics testing.',
        features: ['100 Fans', '20 Concerts', '500 Streams', 'Merchandise', 'Ticket Sales']
      };
    }
  };

  if (!currentProject) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Select a project to enable sample data seeding.
        </AlertDescription>
      </Alert>
    );
  }

  const projectInfo = getProjectTypeInfo();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {projectInfo.title}
        </CardTitle>
        <CardDescription>
          {projectInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Features List */}
        <div className="flex flex-wrap gap-2">
          {projectInfo.features.map((feature, index) => (
            <Badge key={index} variant="secondary">
              {feature}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button 
          onClick={seedSampleData}
          disabled={loading}
          className="w-full flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Sample Data...
            </>
          ) : (
            <>
              {projectInfo.icon}
              Create Sample Data
            </>
          )}
        </Button>

        {/* Results Display */}
        {results && (
          <div className="space-y-3">
            {results.created.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Successfully created:</strong>
                  <ul className="mt-1 list-disc list-inside text-sm">
                    {results.created.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Errors encountered:</strong>
                  <ul className="mt-1 list-disc list-inside text-sm">
                    {results.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Warning */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This will create sample data for testing purposes. 
            Use only in development or testing environments.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}