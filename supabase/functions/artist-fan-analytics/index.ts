
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FanAnalyticsRequest {
  projectId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
  segmentBy?: 'tier' | 'location' | 'engagement';
}

interface FanTierData {
  tier: 'superfan' | 'active' | 'casual' | 'at-risk';
  count: number;
  percentage: number;
  avgEngagement: number;
  totalRevenue: number;
  avgLifetimeValue: number;
}

interface LocationData {
  city: string;
  country: string;
  fanCount: number;
  avgEngagement: number;
  topGenres: string[];
}

interface EngagementTrend {
  date: string;
  streams: number;
  ticketSales: number;
  merchSales: number;
  socialShares: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { projectId, timeRange = '30d', segmentBy = 'tier' }: FanAnalyticsRequest = await req.json();

    // Mock fan tier data
    const fanTiers: FanTierData[] = [
      {
        tier: 'superfan',
        count: 1250,
        percentage: 8.5,
        avgEngagement: 92,
        totalRevenue: 187500,
        avgLifetimeValue: 150
      },
      {
        tier: 'active',
        count: 4200,
        percentage: 28.7,
        avgEngagement: 68,
        totalRevenue: 315000,
        avgLifetimeValue: 75
      },
      {
        tier: 'casual',
        count: 6800,
        percentage: 46.3,
        avgEngagement: 35,
        totalRevenue: 136000,
        avgLifetimeValue: 20
      },
      {
        tier: 'at-risk',
        count: 2450,
        percentage: 16.5,
        avgEngagement: 12,
        totalRevenue: 24500,
        avgLifetimeValue: 10
      }
    ];

    // Mock location data
    const topLocations: LocationData[] = [
      {
        city: 'Los Angeles',
        country: 'USA',
        fanCount: 2100,
        avgEngagement: 74,
        topGenres: ['Pop', 'Rock', 'Hip-Hop']
      },
      {
        city: 'New York',
        country: 'USA',
        fanCount: 1850,
        avgEngagement: 71,
        topGenres: ['Pop', 'R&B', 'Rock']
      },
      {
        city: 'London',
        country: 'UK',
        fanCount: 1420,
        avgEngagement: 68,
        topGenres: ['Pop', 'Electronic', 'Rock']
      },
      {
        city: 'Toronto',
        country: 'Canada',
        fanCount: 890,
        avgEngagement: 65,
        topGenres: ['Pop', 'Hip-Hop', 'R&B']
      },
      {
        city: 'Sydney',
        country: 'Australia',
        fanCount: 650,
        avgEngagement: 62,
        topGenres: ['Pop', 'Rock', 'Electronic']
      }
    ];

    // Mock engagement trends
    const engagementTrends: EngagementTrend[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      return {
        date: date.toISOString().split('T')[0],
        streams: Math.floor(Math.random() * 5000) + 8000,
        ticketSales: Math.floor(Math.random() * 200) + 50,
        merchSales: Math.floor(Math.random() * 150) + 30,
        socialShares: Math.floor(Math.random() * 800) + 200
      };
    });

    // Mock churn predictions
    const churnPredictions = {
      riskCounts: {
        high: 245,
        medium: 680,
        low: 890
      },
      predictedChurn: {
        next30Days: 8.5,
        next60Days: 15.2,
        next90Days: 22.8
      },
      retentionRate: 87.3,
      avgChurnScore: 0.32
    };

    // Mock demographic breakdown
    const demographics = {
      ageGroups: [
        { range: '18-24', count: 3200, percentage: 21.8 },
        { range: '25-34', count: 5100, percentage: 34.7 },
        { range: '35-44', count: 3800, percentage: 25.9 },
        { range: '45-54', count: 1900, percentage: 12.9 },
        { range: '55+', count: 700, percentage: 4.7 }
      ],
      genderSplit: [
        { gender: 'Female', count: 8200, percentage: 55.8 },
        { gender: 'Male', count: 5900, percentage: 40.2 },
        { gender: 'Other', count: 600, percentage: 4.0 }
      ]
    };

    return Response.json({
      fanTiers,
      topLocations,
      engagementTrends,
      churnPredictions,
      demographics,
      totalFans: 14700,
      avgEngagementScore: 58.2,
      monthlyGrowthRate: 12.5,
      generatedAt: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in artist-fan-analytics function:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
