-- Enhanced schema for Hyperelational platform

-- Add missing columns to existing products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS size TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS season TEXT,
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Create page_views table for tracking user interactions
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  project_id UUID,
  url TEXT,
  product_id UUID REFERENCES public.products(id),
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on page_views
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create policy for page_views
CREATE POLICY "Users can access page_views in their projects" 
ON public.page_views 
FOR ALL 
USING (project_id IN (
  SELECT p.id FROM projects p
  JOIN workspaces w ON p.workspace_id = w.id
  WHERE w.owner_id = auth.uid()
));

-- Create order_items table for detailed order tracking
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2),
  total_price NUMERIC(10,2),
  discount_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for order_items
CREATE POLICY "Users can access order_items through their projects" 
ON public.order_items 
FOR ALL 
USING (order_id IN (
  SELECT o.id FROM orders o
  WHERE o.project_id IN (
    SELECT p.id FROM projects p
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.owner_id = auth.uid()
  )
));

-- Create merch_items table for artist merchandise
CREATE TABLE IF NOT EXISTS public.merch_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  name TEXT NOT NULL,
  type TEXT, -- t-shirt, hoodie, vinyl, poster, etc.
  category TEXT,
  price NUMERIC(10,2),
  cost NUMERIC(10,2),
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  stock_quantity INTEGER DEFAULT 0,
  is_venue_exclusive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on merch_items
ALTER TABLE public.merch_items ENABLE ROW LEVEL SECURITY;

-- Create policy for merch_items
CREATE POLICY "Users can access merch_items in their projects" 
ON public.merch_items 
FOR ALL 
USING (project_id IN (
  SELECT p.id FROM projects p
  JOIN workspaces w ON p.workspace_id = w.id
  WHERE w.owner_id = auth.uid()
));

-- Create merch_sales table
CREATE TABLE IF NOT EXISTS public.merch_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  fan_id UUID REFERENCES public.fans(id),
  merch_item_id UUID REFERENCES public.merch_items(id),
  event_id UUID REFERENCES public.concerts(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2),
  total_price NUMERIC(10,2),
  sale_channel TEXT, -- online, venue, festival
  location JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on merch_sales
ALTER TABLE public.merch_sales ENABLE ROW LEVEL SECURITY;

-- Create policy for merch_sales
CREATE POLICY "Users can access merch_sales in their projects" 
ON public.merch_sales 
FOR ALL 
USING (project_id IN (
  SELECT p.id FROM projects p
  JOIN workspaces w ON p.workspace_id = w.id
  WHERE w.owner_id = auth.uid()
));

-- Create streams table for music streaming data
CREATE TABLE IF NOT EXISTS public.streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  fan_id UUID REFERENCES public.fans(id),
  track_name TEXT,
  artist_name TEXT,
  album_name TEXT,
  platform TEXT, -- spotify, apple_music, youtube, etc.
  play_count INTEGER DEFAULT 1,
  duration_ms INTEGER,
  location JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on streams
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;

-- Create policy for streams
CREATE POLICY "Users can access streams in their projects" 
ON public.streams 
FOR ALL 
USING (project_id IN (
  SELECT p.id FROM projects p
  JOIN workspaces w ON p.workspace_id = w.id
  WHERE w.owner_id = auth.uid()
));

-- Create ticket_sales table for better tracking
CREATE TABLE IF NOT EXISTS public.ticket_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  fan_id UUID REFERENCES public.fans(id),
  event_id UUID REFERENCES public.concerts(id),
  ticket_type TEXT, -- general, vip, early_bird
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2),
  total_price NUMERIC(10,2),
  fees NUMERIC(10,2) DEFAULT 0,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sale_channel TEXT, -- online, box_office, reseller
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ticket_sales
ALTER TABLE public.ticket_sales ENABLE ROW LEVEL SECURITY;

-- Create policy for ticket_sales
CREATE POLICY "Users can access ticket_sales in their projects" 
ON public.ticket_sales 
FOR ALL 
USING (project_id IN (
  SELECT p.id FROM projects p
  JOIN workspaces w ON p.workspace_id = w.id
  WHERE w.owner_id = auth.uid()
));

-- Add enhanced columns to existing customers table
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS acquisition_channel TEXT,
ADD COLUMN IF NOT EXISTS acquisition_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS preferred_categories JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{}'::jsonb;

-- Add enhanced columns to existing fans table
ALTER TABLE public.fans 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS acquisition_channel TEXT,
ADD COLUMN IF NOT EXISTS last_interaction TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS social_handles JSONB DEFAULT '{}'::jsonb;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_user_timestamp ON public.page_views(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_product ON public.page_views(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_merch_sales_fan ON public.merch_sales(fan_id);
CREATE INDEX IF NOT EXISTS idx_merch_sales_event ON public.merch_sales(event_id);
CREATE INDEX IF NOT EXISTS idx_streams_fan_timestamp ON public.streams(fan_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_streams_platform ON public.streams(platform);
CREATE INDEX IF NOT EXISTS idx_ticket_sales_fan ON public.ticket_sales(fan_id);
CREATE INDEX IF NOT EXISTS idx_ticket_sales_event ON public.ticket_sales(event_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_merch_items_updated_at
  BEFORE UPDATE ON public.merch_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();