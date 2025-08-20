
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MerchInsightsRequest {
  projectId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
  venueId?: string;
}

interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  totalSold: number;
  revenue: number;
  avgPrice: number;
  profitMargin: number;
  inventoryStatus: 'low' | 'good' | 'overstocked';
  demandScore: number;
  imageUrl?: string;
}

interface VenueInsights {
  venueId: string;
  venueName: string;
  city: string;
  totalSales: number;
  avgBasketSize: number;
  topProducts: string[];
  salesByHour: { hour: number; sales: number }[];
}

interface PredictiveRecommendation {
  fanId: string;
  fanTier: string;
  recommendedProducts: {
    productId: string;
    productName: string;
    probability: number;
    expectedRevenue: number;
  }[];
  personalizedMessage: string;
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

    const { projectId, timeRange = '30d', venueId }: MerchInsightsRequest = await req.json();

    // Mock product performance data
    const productPerformance: ProductPerformance[] = [
      {
        id: '1',
        name: 'Tour T-Shirt (Black)',
        category: 'Apparel',
        totalSold: 1250,
        revenue: 31250,
        avgPrice: 25,
        profitMargin: 68.0,
        inventoryStatus: 'good',
        demandScore: 94,
        imageUrl: '/src/assets/products/tshirt-black.jpg'
      },
      {
        id: '2',
        name: 'Limited Edition Hoodie',
        category: 'Apparel',
        totalSold: 890,
        revenue: 53400,
        avgPrice: 60,
        profitMargin: 72.5,
        inventoryStatus: 'low',
        demandScore: 91,
        imageUrl: '/src/assets/products/hoodie-navy.jpg'
      },
      {
        id: '3',
        name: 'Vinyl Album',
        category: 'Music',
        totalSold: 680,
        revenue: 20400,
        avgPrice: 30,
        profitMargin: 65.0,
        inventoryStatus: 'good',
        demandScore: 88,
        imageUrl: '/src/assets/products/vinyl-record.jpg'
      },
      {
        id: '4',
        name: 'Concert Poster',
        category: 'Collectibles',
        totalSold: 450,
        revenue: 18000,
        avgPrice: 40,
        profitMargin: 80.0,
        inventoryStatus: 'overstocked',
        demandScore: 42,
        imageUrl: '/src/assets/products/poster-vintage.jpg'
      },
      {
        id: '5',
        name: 'Baseball Cap',
        category: 'Accessories',
        totalSold: 320,
        revenue: 6400,
        avgPrice: 20,
        profitMargin: 85.0,
        inventoryStatus: 'low',
        demandScore: 96,
        imageUrl: '/src/assets/products/cap-white.jpg'
      },
      {
        id: '6',
        name: 'Enamel Pin Set',
        category: 'Accessories',
        totalSold: 1450,
        revenue: 14500,
        avgPrice: 10,
        profitMargin: 80.0,
        inventoryStatus: 'good',
        demandScore: 82,
        imageUrl: '/src/assets/products/pin-enamel.jpg'
      }
    ];

    // Mock venue insights
    const venueInsights: VenueInsights[] = [
      {
        venueId: 'venue_1',
        venueName: 'Madison Square Garden',
        city: 'New York',
        totalSales: 45000,
        avgBasketSize: 67.50,
        topProducts: ['Tour T-Shirt (Black)', 'Limited Edition Hoodie', 'Vinyl Album'],
        salesByHour: [
          { hour: 18, sales: 2400 },
          { hour: 19, sales: 8900 },
          { hour: 20, sales: 12600 },
          { hour: 21, sales: 15200 },
          { hour: 22, sales: 5900 }
        ]
      },
      {
        venueId: 'venue_2',
        venueName: 'The Forum',
        city: 'Los Angeles',
        totalSales: 38500,
        avgBasketSize: 72.25,
        topProducts: ['Limited Edition Hoodie', 'Signed Poster', 'Tour T-Shirt (Black)'],
        salesByHour: [
          { hour: 18, sales: 1800 },
          { hour: 19, sales: 7200 },
          { hour: 20, sales: 11400 },
          { hour: 21, sales: 13600 },
          { hour: 22, sales: 4500 }
        ]
      }
    ];

    // Mock predictive recommendations
    const predictiveRecommendations: PredictiveRecommendation[] = [
      {
        fanId: 'fan_1',
        fanTier: 'superfan',
        recommendedProducts: [
          {
            productId: '5',
            productName: 'Signed Poster',
            probability: 0.89,
            expectedRevenue: 35.60
          },
          {
            productId: '2',
            productName: 'Limited Edition Hoodie',
            probability: 0.76,
            expectedRevenue: 45.60
          }
        ],
        personalizedMessage: 'Based on your concert history, you love exclusive collectibles!'
      },
      {
        fanId: 'fan_2',
        fanTier: 'active',
        recommendedProducts: [
          {
            productId: '1',
            productName: 'Tour T-Shirt (Black)',
            probability: 0.72,
            expectedRevenue: 18.00
          },
          {
            productId: '3',
            productName: 'Vinyl Album',
            probability: 0.65,
            expectedRevenue: 19.50
          }
        ],
        personalizedMessage: 'Perfect items to commemorate tonight\'s amazing show!'
      }
    ];

    // Mock sales trends
    const salesTrends = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      return {
        date: date.toISOString().split('T')[0],
        totalSales: Math.floor(Math.random() * 8000) + 12000,
        totalRevenue: Math.floor(Math.random() * 15000) + 25000,
        avgBasketSize: Math.floor(Math.random() * 20) + 45,
        conversionRate: Math.random() * 0.15 + 0.35
      };
    });

    // Mock inventory alerts
    const inventoryAlerts = [
      {
        productId: '2',
        productName: 'Limited Edition Hoodie',
        currentStock: 45,
        reorderPoint: 50,
        urgency: 'high',
        suggestedOrder: 200
      },
      {
        productId: '5',
        productName: 'Signed Poster',
        currentStock: 23,
        reorderPoint: 25,
        urgency: 'medium',
        suggestedOrder: 100
      }
    ];

    return Response.json({
      productPerformance,
      venueInsights,
      predictiveRecommendations,
      salesTrends,
      inventoryAlerts,
      totalRevenue: 124600,
      totalItemsSold: 3590,
      avgProfitMargin: 74.1,
      topSellingCategory: 'Apparel',
      generatedAt: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in artist-merch-insights function:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
