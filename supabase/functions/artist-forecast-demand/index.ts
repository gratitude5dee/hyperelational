import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TourDemandRequest {
  projectId: string;
  cities: string[];
  artistId?: string;
}

interface CityDemandForecast {
  city: string;
  predictedTicketSales: number;
  confidence: number;
  fanBase: number;
  streamingActivity: number;
  historicalSales: number;
  marketScore: number;
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

    const { projectId, cities }: TourDemandRequest = await req.json();

    // Verify project access
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404, headers: corsHeaders });
    }

    // Get fan data by city
    const { data: fans, error: fansError } = await supabase
      .from('fans')
      .select('city, engagement_score, superfan_status')
      .eq('project_id', projectId)
      .in('city', cities);

    // Get streaming data by city
    const { data: streams, error: streamsError } = await supabase
      .from('streams')
      .select(`
        play_count,
        location,
        timestamp,
        fans!inner (city)
      `)
      .eq('project_id', projectId);

    // Get historical ticket sales by city
    const { data: historicalSales, error: salesError } = await supabase
      .from('ticket_sales')
      .select(`
        quantity,
        total_price,
        concerts!inner (city, date)
      `)
      .eq('project_id', projectId);

    // Get past concert data
    const { data: pastConcerts, error: concertsError } = await supabase
      .from('concerts')
      .select('city, actual_attendance, capacity, date')
      .eq('project_id', projectId)
      .not('actual_attendance', 'is', null);

    // Calculate demand forecast for each city
    const demandForecast: CityDemandForecast[] = cities.map(city => {
      // Fan base analysis
      const cityFans = fans?.filter(fan => fan.city === city) || [];
      const fanBase = cityFans.length;
      const superfanCount = cityFans.filter(fan => fan.superfan_status).length;
      const avgEngagement = cityFans.length > 0 
        ? cityFans.reduce((sum, fan) => sum + (Number(fan.engagement_score) || 0), 0) / cityFans.length
        : 0;

      // Streaming activity analysis
      const cityStreams = streams?.filter(stream => 
        stream.fans?.city === city
      ) || [];
      const totalPlays = cityStreams.reduce((sum, stream) => sum + (stream.play_count || 0), 0);
      const recentActivity = cityStreams.filter(stream => {
        const streamDate = new Date(stream.timestamp);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return streamDate > thirtyDaysAgo;
      }).length;

      // Historical sales analysis
      const citySales = historicalSales?.filter(sale => 
        sale.concerts?.city === city
      ) || [];
      const totalHistoricalSales = citySales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
      const avgTicketPrice = citySales.length > 0
        ? citySales.reduce((sum, sale) => sum + (Number(sale.total_price) || 0), 0) / citySales.length
        : 50;

      // Past concert performance
      const cityPastConcerts = pastConcerts?.filter(concert => concert.city === city) || [];
      const avgAttendance = cityPastConcerts.length > 0
        ? cityPastConcerts.reduce((sum, concert) => sum + (concert.actual_attendance || 0), 0) / cityPastConcerts.length
        : 0;
      const avgCapacityUtilization = cityPastConcerts.length > 0
        ? cityPastConcerts.reduce((sum, concert) => 
            sum + ((concert.actual_attendance || 0) / (concert.capacity || 1)), 0
          ) / cityPastConcerts.length
        : 0;

      // Calculate market score factors
      const fanBaseFactor = Math.min(fanBase / 100, 1) * 0.3; // 30% weight
      const superfanFactor = Math.min(superfanCount / 20, 1) * 0.2; // 20% weight
      const engagementFactor = (avgEngagement / 100) * 0.2; // 20% weight
      const streamingFactor = Math.min(totalPlays / 1000, 1) * 0.15; // 15% weight
      const recentActivityFactor = Math.min(recentActivity / 50, 1) * 0.1; // 10% weight
      const historicalFactor = Math.min(avgCapacityUtilization, 1) * 0.05; // 5% weight

      const marketScore = fanBaseFactor + superfanFactor + engagementFactor + 
                         streamingFactor + recentActivityFactor + historicalFactor;

      // Predict ticket sales based on market score and historical data
      let predictedSales = 0;
      if (avgAttendance > 0) {
        // Use historical attendance as baseline, adjusted by current market factors
        predictedSales = avgAttendance * (1 + marketScore);
      } else {
        // For new cities, estimate based on fan base and streaming activity
        predictedSales = Math.max(
          fanBase * 0.15 + // 15% of fan base typically attends
          (totalPlays / 10) + // streaming activity conversion
          superfanCount * 2, // superfan multiplier
          50 // minimum prediction
        );
      }

      // Add market size adjustments (simulate city population factors)
      const cityMultipliers: { [key: string]: number } = {
        'New York': 1.5,
        'Los Angeles': 1.4,
        'Chicago': 1.2,
        'Houston': 1.1,
        'Phoenix': 1.0,
        'Philadelphia': 1.1,
        'San Antonio': 0.9,
        'San Diego': 1.0,
        'Dallas': 1.1,
        'San Jose': 1.0
      };

      const cityMultiplier = cityMultipliers[city] || 1.0;
      predictedSales *= cityMultiplier;

      // Calculate confidence based on data availability
      let confidence = 0.5; // base confidence
      if (fanBase > 10) confidence += 0.1;
      if (totalPlays > 100) confidence += 0.1;
      if (cityPastConcerts.length > 0) confidence += 0.2;
      if (recentActivity > 10) confidence += 0.1;
      confidence = Math.min(confidence, 0.95);

      return {
        city,
        predictedTicketSales: Math.round(predictedSales),
        confidence: Math.round(confidence * 100) / 100,
        fanBase,
        streamingActivity: totalPlays,
        historicalSales: totalHistoricalSales,
        marketScore: Math.round(marketScore * 100) / 100
      };
    });

    // Sort by predicted ticket sales (highest demand first)
    demandForecast.sort((a, b) => b.predictedTicketSales - a.predictedTicketSales);

    return Response.json({
      demandForecast,
      metadata: {
        totalCities: cities.length,
        totalFans: fans?.length || 0,
        totalStreams: streams?.length || 0,
        totalHistoricalConcerts: pastConcerts?.length || 0,
        kumoApiConnected: !!kumoApiKey,
        generatedAt: new Date().toISOString()
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in artist-forecast-demand function:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});