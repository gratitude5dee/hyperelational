import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FanEngagementRequest {
  projectId: string;
  fanIds?: string[];
  segmentationType?: 'tier' | 'risk' | 'activity';
}

interface FanEngagementAnalysis {
  fanId: string;
  username?: string;
  email?: string;
  engagementScore: number;
  tier: 'superfan' | 'active' | 'casual' | 'at-risk';
  riskLevel: 'high' | 'medium' | 'low';
  recentActivity: {
    streams: number;
    ticketPurchases: number;
    merchPurchases: number;
    lastInteraction: string;
  };
  predictedChurnProbability: number;
  lifetimeValue: number;
  recommendations: string[];
}

interface EngagementMetadata {
  totalFans: number;
  superfanCount: number;
  activeFanCount: number;
  casualFanCount: number;
  atRiskCount: number;
  avgEngagementScore: number;
  kumoApiConnected: boolean;
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

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { projectId, fanIds, segmentationType = 'tier' }: FanEngagementRequest = await req.json();

    // Verify project access
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404, headers: corsHeaders });
    }

    // Get fan data
    let fansQuery = supabase
      .from('fans')
      .select('*')
      .eq('project_id', projectId);

    if (fanIds && fanIds.length > 0) {
      fansQuery = fansQuery.in('id', fanIds);
    }

    const { data: fans, error: fansError } = await fansQuery.limit(200);

    if (fansError) {
      console.error('Error fetching fans:', fansError);
      return Response.json({ error: 'Failed to fetch fans' }, { status: 500, headers: corsHeaders });
    }

    if (!fans || fans.length === 0) {
      return Response.json({
        analyses: [],
        metadata: {
          totalFans: 0,
          superfanCount: 0,
          activeFanCount: 0,
          casualFanCount: 0,
          atRiskCount: 0,
          avgEngagementScore: 0,
          kumoApiConnected: !!kumoApiKey
        }
      }, { headers: corsHeaders });
    }

    // Get streaming data for each fan
    const fanIds_list = fans.map(f => f.id);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentStreams, error: streamsError } = await supabase
      .from('streams')
      .select('fan_id, play_count, timestamp')
      .in('fan_id', fanIds_list)
      .eq('project_id', projectId)
      .gte('timestamp', thirtyDaysAgo.toISOString());

    // Get ticket purchase data
    const { data: recentTickets, error: ticketsError } = await supabase
      .from('ticket_sales')
      .select('fan_id, total_price, purchase_date')
      .in('fan_id', fanIds_list)
      .eq('project_id', projectId)
      .gte('purchase_date', thirtyDaysAgo.toISOString());

    // Get merch purchase data
    const { data: recentMerch, error: merchError } = await supabase
      .from('merch_sales')
      .select('fan_id, total_price, timestamp')
      .in('fan_id', fanIds_list)
      .eq('project_id', projectId)
      .gte('timestamp', thirtyDaysAgo.toISOString());

    // Get all-time data for LTV calculations
    const { data: allTimeTickets, error: allTicketsError } = await supabase
      .from('ticket_sales')
      .select('fan_id, total_price')
      .in('fan_id', fanIds_list)
      .eq('project_id', projectId);

    const { data: allTimeMerch, error: allMerchError } = await supabase
      .from('merch_sales')
      .select('fan_id, total_price')
      .in('fan_id', fanIds_list)
      .eq('project_id', projectId);

    // Analyze each fan
    const analyses: FanEngagementAnalysis[] = fans.map(fan => {
      // Recent activity analysis
      const fanStreams = recentStreams?.filter(s => s.fan_id === fan.id) || [];
      const fanTickets = recentTickets?.filter(t => t.fan_id === fan.id) || [];
      const fanMerch = recentMerch?.filter(m => m.fan_id === fan.id) || [];

      const totalRecentStreams = fanStreams.reduce((sum, s) => sum + (s.play_count || 0), 0);
      const recentTicketPurchases = fanTickets.length;
      const recentMerchPurchases = fanMerch.length;

      // Get last interaction date
      const lastStreamDate = fanStreams.length > 0 ? Math.max(...fanStreams.map(s => new Date(s.timestamp).getTime())) : 0;
      const lastTicketDate = fanTickets.length > 0 ? Math.max(...fanTickets.map(t => new Date(t.purchase_date).getTime())) : 0;
      const lastMerchDate = fanMerch.length > 0 ? Math.max(...fanMerch.map(m => new Date(m.timestamp).getTime())) : 0;
      const lastInteractionDate = Math.max(lastStreamDate, lastTicketDate, lastMerchDate);

      // Lifetime value calculation
      const allFanTickets = allTimeTickets?.filter(t => t.fan_id === fan.id) || [];
      const allFanMerch = allTimeMerch?.filter(m => m.fan_id === fan.id) || [];
      const ticketLTV = allFanTickets.reduce((sum, t) => sum + (Number(t.total_price) || 0), 0);
      const merchLTV = allFanMerch.reduce((sum, m) => sum + (Number(m.total_price) || 0), 0);
      const lifetimeValue = ticketLTV + merchLTV;

      // Engagement score calculation (0-100)
      let engagementScore = fan.engagement_score || 0;
      
      // If we don't have an existing score, calculate one
      if (!engagementScore) {
        const streamScore = Math.min(totalRecentStreams / 50, 1) * 30; // 30% weight
        const ticketScore = Math.min(recentTicketPurchases * 10, 1) * 35; // 35% weight  
        const merchScore = Math.min(recentMerchPurchases * 8, 1) * 20; // 20% weight
        const recencyScore = lastInteractionDate > (Date.now() - 7 * 24 * 60 * 60 * 1000) ? 15 : 
                           lastInteractionDate > (Date.now() - 14 * 24 * 60 * 60 * 1000) ? 10 : 5; // 15% weight
        
        engagementScore = streamScore + ticketScore + merchScore + recencyScore;
      }

      // Determine fan tier
      let tier: 'superfan' | 'active' | 'casual' | 'at-risk';
      if (fan.superfan_status || engagementScore > 80) {
        tier = 'superfan';
      } else if (engagementScore > 60 || (totalRecentStreams > 20 && recentTicketPurchases > 0)) {
        tier = 'active';
      } else if (engagementScore > 30 || totalRecentStreams > 5) {
        tier = 'casual';
      } else {
        tier = 'at-risk';
      }

      // Churn risk calculation
      const daysSinceLastInteraction = lastInteractionDate > 0 
        ? Math.floor((Date.now() - lastInteractionDate) / (1000 * 60 * 60 * 24))
        : 999;

      let churnProbability = 0;
      churnProbability += Math.min(daysSinceLastInteraction / 90, 0.4); // 40% weight for recency
      churnProbability += Math.max(0.3 - (totalRecentStreams / 100), 0); // 30% weight for streaming
      churnProbability += recentTicketPurchases === 0 ? 0.2 : 0; // 20% weight for ticket purchases
      churnProbability += recentMerchPurchases === 0 ? 0.1 : 0; // 10% weight for merch purchases
      churnProbability = Math.max(0, Math.min(1, churnProbability));

      const riskLevel: 'high' | 'medium' | 'low' = 
        churnProbability > 0.7 ? 'high' : churnProbability > 0.4 ? 'medium' : 'low';

      // Generate recommendations
      const recommendations: string[] = [];
      if (tier === 'at-risk') {
        recommendations.push('Send re-engagement campaign with exclusive content');
        recommendations.push('Offer discounted concert tickets');
      } else if (tier === 'casual') {
        recommendations.push('Invite to VIP experiences');
        recommendations.push('Promote upcoming shows in their area');
      } else if (tier === 'active') {
        recommendations.push('Offer exclusive merchandise');
        recommendations.push('Early access to tour announcements');
      } else if (tier === 'superfan') {
        recommendations.push('Invite to meet & greet opportunities');
        recommendations.push('Exclusive backstage content access');
      }

      if (churnProbability > 0.6) {
        recommendations.unshift('Priority retention campaign needed');
      }

      return {
        fanId: fan.id,
        username: fan.username,
        email: fan.email,
        engagementScore: Math.round(engagementScore),
        tier,
        riskLevel,
        recentActivity: {
          streams: totalRecentStreams,
          ticketPurchases: recentTicketPurchases,
          merchPurchases: recentMerchPurchases,
          lastInteraction: lastInteractionDate > 0 ? new Date(lastInteractionDate).toISOString() : fan.created_at
        },
        predictedChurnProbability: Math.round(churnProbability * 100) / 100,
        lifetimeValue,
        recommendations
      };
    });

    // Calculate metadata
    const superfanCount = analyses.filter(a => a.tier === 'superfan').length;
    const activeFanCount = analyses.filter(a => a.tier === 'active').length;
    const casualFanCount = analyses.filter(a => a.tier === 'casual').length;
    const atRiskCount = analyses.filter(a => a.tier === 'at-risk').length;
    const avgEngagementScore = analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + a.engagementScore, 0) / analyses.length)
      : 0;

    // Sort based on segmentation type
    switch (segmentationType) {
      case 'tier':
        analyses.sort((a, b) => b.engagementScore - a.engagementScore);
        break;
      case 'risk':
        analyses.sort((a, b) => b.predictedChurnProbability - a.predictedChurnProbability);
        break;
      case 'activity':
        analyses.sort((a, b) => b.recentActivity.streams - a.recentActivity.streams);
        break;
    }

    const metadata: EngagementMetadata = {
      totalFans: fans.length,
      superfanCount,
      activeFanCount,
      casualFanCount,
      atRiskCount,
      avgEngagementScore,
      kumoApiConnected: !!kumoApiKey
    };

    return Response.json({
      analyses,
      metadata,
      generatedAt: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in artist-fan-engagement function:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});