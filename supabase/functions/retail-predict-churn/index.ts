import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChurnPredictionRequest {
  projectId: string;
  userIds?: string[];
  limit?: number;
}

interface ChurnPrediction {
  userId: string;
  churnProbability: number;
  lastSeen: string;
  ltv: number;
  riskLevel: 'high' | 'medium' | 'low';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const kumoApiKey = Deno.env.get('KUMO_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Verify user and get user ID
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { projectId, userIds, limit = 50 }: ChurnPredictionRequest = await req.json();

    // Verify user has access to project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404, headers: corsHeaders });
    }

    // Get customer data for prediction
    let customersQuery = supabase
      .from('customers')
      .select(`
        id,
        name,
        email,
        created_at,
        last_purchase,
        lifetime_value,
        segment,
        churn_risk
      `)
      .eq('project_id', projectId);

    if (userIds && userIds.length > 0) {
      customersQuery = customersQuery.in('id', userIds);
    }

    const { data: customers, error: customersError } = await customersQuery.limit(limit);

    if (customersError) {
      console.error('Error fetching customers:', customersError);
      return Response.json({ error: 'Failed to fetch customers' }, { status: 500, headers: corsHeaders });
    }

    // Get order data for each customer
    const customerIds = customers.map(c => c.id);
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('customer_id, created_at, amount')
      .in('customer_id', customerIds)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    }

    // For now, simulate KumoRFM predictions with enhanced logic
    // TODO: Replace with actual KumoRFM SDK integration when available
    const predictions: ChurnPrediction[] = customers.map(customer => {
      const customerOrders = orders?.filter(o => o.customer_id === customer.id) || [];
      const daysSinceLastPurchase = customer.last_purchase 
        ? Math.floor((new Date().getTime() - new Date(customer.last_purchase).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      const orderFrequency = customerOrders.length;
      const avgOrderValue = customerOrders.length > 0 
        ? customerOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0) / customerOrders.length
        : 0;

      // Enhanced churn probability calculation
      let churnProb = 0;
      
      // Days since last purchase factor (0-40%)
      churnProb += Math.min(daysSinceLastPurchase / 365, 0.4);
      
      // Order frequency factor (0-30%)
      churnProb += Math.max(0.3 - (orderFrequency * 0.05), 0);
      
      // Average order value factor (0-20%)
      churnProb += avgOrderValue < 50 ? 0.2 : avgOrderValue > 200 ? 0 : 0.1;
      
      // Add some realistic randomness
      churnProb += (Math.random() - 0.5) * 0.2;
      churnProb = Math.max(0, Math.min(1, churnProb));

      const riskLevel: 'high' | 'medium' | 'low' = 
        churnProb > 0.7 ? 'high' : churnProb > 0.4 ? 'medium' : 'low';

      return {
        userId: customer.id,
        churnProbability: Math.round(churnProb * 100) / 100,
        lastSeen: customer.last_purchase || customer.created_at,
        ltv: Number(customer.lifetime_value) || avgOrderValue * orderFrequency,
        riskLevel
      };
    });

    // Sort by churn probability (highest risk first)
    predictions.sort((a, b) => b.churnProbability - a.churnProbability);

    return Response.json({
      predictions,
      metadata: {
        totalCustomers: customers.length,
        highRiskCount: predictions.filter(p => p.riskLevel === 'high').length,
        mediumRiskCount: predictions.filter(p => p.riskLevel === 'medium').length,
        lowRiskCount: predictions.filter(p => p.riskLevel === 'low').length,
        kumoApiConnected: !!kumoApiKey
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in retail-predict-churn function:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});