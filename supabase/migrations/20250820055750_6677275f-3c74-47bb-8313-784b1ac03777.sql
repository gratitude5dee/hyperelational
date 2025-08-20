-- Create profiles table (updated)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_type TEXT CHECK (account_type IN ('ecommerce', 'artist', 'both')) DEFAULT 'ecommerce';

-- Create customers table for e-commerce analytics
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  name TEXT,
  segment TEXT,
  lifetime_value DECIMAL(10,2),
  churn_risk DECIMAL(3,2) CHECK (churn_risk >= 0 AND churn_risk <= 1),
  last_purchase TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  style_attributes JSONB DEFAULT '{}'::jsonb,
  price DECIMAL(10,2),
  trend_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  amount DECIMAL(10,2),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Create fans table for artist analytics
CREATE TABLE IF NOT EXISTS public.fans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT,
  email TEXT,
  location JSONB DEFAULT '{}'::jsonb,
  engagement_score DECIMAL(5,2),
  superfan_status BOOLEAN DEFAULT FALSE,
  favorite_tracks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Create concerts table
CREATE TABLE IF NOT EXISTS public.concerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_name TEXT NOT NULL,
  city TEXT,
  capacity INTEGER,
  predicted_attendance INTEGER,
  actual_attendance INTEGER,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  venue_data JSONB DEFAULT '{}'::jsonb
);

-- Create saved_queries table
CREATE TABLE IF NOT EXISTS public.saved_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  pql_query TEXT NOT NULL,
  query_type TEXT,
  visualization_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Create relationship_graph table for storing graph data
CREATE TABLE IF NOT EXISTS public.relationship_graphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  graph_type TEXT NOT NULL, -- 'customer_product', 'fan_artist', etc.
  nodes JSONB DEFAULT '[]'::jsonb,
  edges JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_graphs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access customers in their projects" ON public.customers
FOR ALL USING (
  project_id IN (
    SELECT p.id FROM projects p 
    JOIN workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can access products in their projects" ON public.products
FOR ALL USING (
  project_id IN (
    SELECT p.id FROM projects p 
    JOIN workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can access orders in their projects" ON public.orders
FOR ALL USING (
  project_id IN (
    SELECT p.id FROM projects p 
    JOIN workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can access fans in their projects" ON public.fans
FOR ALL USING (
  project_id IN (
    SELECT p.id FROM projects p 
    JOIN workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can access concerts in their projects" ON public.concerts
FOR ALL USING (
  project_id IN (
    SELECT p.id FROM projects p 
    JOIN workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can access saved_queries in their projects" ON public.saved_queries
FOR ALL USING (
  user_id = auth.uid() AND
  project_id IN (
    SELECT p.id FROM projects p 
    JOIN workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can access chat_sessions in their projects" ON public.chat_sessions
FOR ALL USING (
  user_id = auth.uid() AND
  project_id IN (
    SELECT p.id FROM projects p 
    JOIN workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can access relationship_graphs in their projects" ON public.relationship_graphs
FOR ALL USING (
  project_id IN (
    SELECT p.id FROM projects p 
    JOIN workspaces w ON p.workspace_id = w.id 
    WHERE w.owner_id = auth.uid()
  )
);

-- Create updated_at triggers
CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_relationship_graphs_updated_at
BEFORE UPDATE ON public.relationship_graphs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();