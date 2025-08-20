import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Database, Rocket, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

export function SampleDataGenerator() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { currentProject, setCurrentProject } = useAppStore();
  const { toast } = useToast();

  const createRealProject = async () => {
    setLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First create a workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert([{
          name: 'Demo Workspace',
          owner_id: user.id,
        }])
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Then create a project
      const projectType: 'fashion_ecommerce' | 'creative_hub' = currentProject?.type || 'fashion_ecommerce';
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          name: 'Demo Analytics Project',
          type: projectType,
          workspace_id: workspace.id
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Update the app state with the real project
      setCurrentProject(project as any); // Type assertion needed due to Supabase types

      // Now seed sample data
      const { data: seedResult, error: seedError } = await supabase.functions.invoke('sample-data-seeder', {
        body: {
          projectId: project.id,
          projectType: project.type,
          recordCount: 50
        }
      });

      if (seedError) throw seedError;

      setGenerated(true);
      toast({
        title: "Analytics Ready!",
        description: `Created ${project.type === 'fashion_ecommerce' ? 'e-commerce' : 'artist'} project with sample data.`,
      });

    } catch (error) {
      console.error('Error creating project and data:', error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : 'Failed to create project',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't show if we already have a real project (not temp/demo)
  if (currentProject?.id && !currentProject.id.includes('temp') && !currentProject.id.includes('demo')) {
    return null;
  }

  if (generated) {
    return (
      <Alert className="mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Analytics Ready!</strong> Your project now has sample data and all features are functional.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Setup Required
        </CardTitle>
        <CardDescription>
          To use the analytics features, you need a real project with sample data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This will create a workspace, project, and populate it with realistic sample data 
            for {currentProject?.type === 'fashion_ecommerce' ? 'e-commerce analytics' : 'artist analytics'}.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">50+ Sample Records</Badge>
          <Badge variant="secondary">Realistic Data</Badge>
          <Badge variant="secondary">Full Analytics</Badge>
        </div>

        <Button 
          onClick={createRealProject}
          disabled={loading}
          className="w-full flex items-center gap-2"
        >
          {loading ? (
            <>
              <Database className="h-4 w-4 animate-pulse" />
              Setting up analytics...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              Create Project & Sample Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}