-- Create workspaces table for multi-tenancy
CREATE TABLE public.workspaces (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table to separate Fashion and Music domains
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('fashion_ecommerce', 'music_touring')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data_sources table for external platform connections
CREATE TABLE public.data_sources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    display_name TEXT NOT NULL,
    credentials TEXT, -- Note: Should store Supabase Vault secret ID reference
    last_synced_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'error', 'syncing')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dashboards table for dashboard configurations
CREATE TABLE public.dashboards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    layout JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create widgets table for individual dashboard components
CREATE TABLE public.widgets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    dashboard_id UUID NOT NULL REFERENCES public.dashboards(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('kpi', 'line_chart', 'bar_chart', 'map', 'table')),
    title TEXT NOT NULL,
    query_config JSONB DEFAULT '{}'::jsonb,
    position JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictions table for caching KumoRFM API results
CREATE TABLE public.predictions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    query_hash TEXT NOT NULL,
    type TEXT NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(query_hash, project_id)
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspaces
CREATE POLICY "Users can view their own workspaces" 
ON public.workspaces FOR SELECT 
USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own workspaces" 
ON public.workspaces FOR INSERT 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own workspaces" 
ON public.workspaces FOR UPDATE 
USING (owner_id = auth.uid());

-- RLS Policies for projects
CREATE POLICY "Users can view projects in their workspaces" 
ON public.projects FOR SELECT 
USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()));

CREATE POLICY "Users can create projects in their workspaces" 
ON public.projects FOR INSERT 
WITH CHECK (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update projects in their workspaces" 
ON public.projects FOR UPDATE 
USING (workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()));

-- RLS Policies for data_sources
CREATE POLICY "Users can view data sources in their projects" 
ON public.data_sources FOR SELECT 
USING (project_id IN (
    SELECT p.id FROM public.projects p 
    JOIN public.workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
));

CREATE POLICY "Users can manage data sources in their projects" 
ON public.data_sources FOR ALL 
USING (project_id IN (
    SELECT p.id FROM public.projects p 
    JOIN public.workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
));

-- RLS Policies for dashboards
CREATE POLICY "Users can view dashboards in their projects" 
ON public.dashboards FOR SELECT 
USING (project_id IN (
    SELECT p.id FROM public.projects p 
    JOIN public.workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
));

CREATE POLICY "Users can manage dashboards in their projects" 
ON public.dashboards FOR ALL 
USING (project_id IN (
    SELECT p.id FROM public.projects p 
    JOIN public.workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
));

-- RLS Policies for widgets
CREATE POLICY "Users can view widgets in their dashboards" 
ON public.widgets FOR SELECT 
USING (dashboard_id IN (
    SELECT d.id FROM public.dashboards d
    JOIN public.projects p ON d.project_id = p.id
    JOIN public.workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
));

CREATE POLICY "Users can manage widgets in their dashboards" 
ON public.widgets FOR ALL 
USING (dashboard_id IN (
    SELECT d.id FROM public.dashboards d
    JOIN public.projects p ON d.project_id = p.id
    JOIN public.workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
));

-- RLS Policies for predictions
CREATE POLICY "Users can view predictions in their projects" 
ON public.predictions FOR SELECT 
USING (project_id IN (
    SELECT p.id FROM public.projects p 
    JOIN public.workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
));

CREATE POLICY "Users can manage predictions in their projects" 
ON public.predictions FOR ALL 
USING (project_id IN (
    SELECT p.id FROM public.projects p 
    JOIN public.workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    -- Create default workspace
    INSERT INTO public.workspaces (name, owner_id)
    VALUES ('My Workspace', NEW.id);
    
    RETURN NEW;
END;
$$;

-- Trigger to automatically create profile and workspace on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at columns and triggers where needed
ALTER TABLE public.workspaces ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.projects ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.data_sources ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.dashboards ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.widgets ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create update triggers
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_data_sources_updated_at BEFORE UPDATE ON public.data_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON public.dashboards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON public.widgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();