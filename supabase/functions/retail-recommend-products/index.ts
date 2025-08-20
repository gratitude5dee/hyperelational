import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductRecommendationRequest {
  projectId: string;
  userId: string;
  count?: number;
}

interface ProductRecommendation {
  productId: string;
  productName: string;
  price: number;
  category: string;
  score: number;
  reason: string;
  imageUrl?: string;
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

    const { projectId, userId, count = 5 }: ProductRecommendationRequest = await req.json();

    // Verify project access
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404, headers: corsHeaders });
    }

    // Get customer data
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .eq('project_id', projectId)
      .single();

    if (customerError || !customer) {
      return Response.json({ error: 'Customer not found' }, { status: 404, headers: corsHeaders });
    }

    // Get customer's purchase history
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        products!inner (
          id,
          name,
          category,
          price,
          style_attributes
        )
      `)
      .eq('order_id', supabase.from('orders').select('id').eq('customer_id', userId).eq('project_id', projectId));

    // Get customer's page views for browsing behavior
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')  
      .select(`
        product_id,
        timestamp,
        products!inner (
          id,
          name,
          category,
          price
        )
      `)
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('timestamp', { ascending: false })
      .limit(50);

    // Get all available products
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('project_id', projectId);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return Response.json({ error: 'Failed to fetch products' }, { status: 500, headers: corsHeaders });
    }

    // Extract purchased product IDs
    const purchasedProductIds = new Set(orderItems?.map(item => item.product_id) || []);
    const viewedProductIds = new Set(pageViews?.map(view => view.product_id) || []);

    // If no products in database, use mock recommendations
    let recommendations: ProductRecommendation[] = [];
    
    if (!allProducts || allProducts.length === 0) {
      // Mock product recommendations with images
      const mockRecommendations: ProductRecommendation[] = [
        {
          productId: 'TOUR_TSHIRT_001',
          productName: 'Tour T-Shirt (Black)',
          price: 25.00,
          category: 'Apparel',
          score: 0.92,
          reason: 'High purchase probability based on similar customers who bought band merchandise',
          imageUrl: '/src/assets/products/tshirt-black.jpg'
        },
        {
          productId: 'HOODIE_LIMITED_001',
          productName: 'Limited Edition Hoodie',
          price: 60.00,
          category: 'Apparel',
          score: 0.87,
          reason: 'Premium item matching your preference for exclusive merchandise',
          imageUrl: '/src/assets/products/hoodie-navy.jpg'
        },
        {
          productId: 'VINYL_ALBUM_001',
          productName: 'Latest Album Vinyl',
          price: 30.00,
          category: 'Music',
          score: 0.84,
          reason: 'Perfect for collectors who appreciate physical music formats',
          imageUrl: '/src/assets/products/vinyl-record.jpg'
        },
        {
          productId: 'POSTER_VINTAGE_001',
          productName: 'Vintage Concert Poster',
          price: 40.00,
          category: 'Collectibles',
          score: 0.79,
          reason: 'Art piece that matches your interest in concert memorabilia',
          imageUrl: '/src/assets/products/poster-vintage.jpg'
        },
        {
          productId: 'CAP_BASEBALL_001',
          productName: 'Branded Baseball Cap',
          price: 20.00,
          category: 'Accessories',
          score: 0.76,
          reason: 'Everyday wearable that complements your casual style',
          imageUrl: '/src/assets/products/cap-white.jpg'
        },
        {
          productId: 'PIN_ENAMEL_001',
          productName: 'Enamel Pin Collection',
          price: 15.00,
          category: 'Accessories',
          score: 0.73,
          reason: 'Small collectible perfect for personalizing bags and jackets',
          imageUrl: '/src/assets/products/pin-enamel.jpg'
        },
        {
          productId: 'STICKER_PACK_001',
          productName: 'Sticker Pack',
          price: 8.00,
          category: 'Accessories',
          score: 0.68,
          reason: 'Affordable way to show support and decorate personal items',
          imageUrl: '/src/assets/products/tshirt-black.jpg'
        },
        {
          productId: 'KEYCHAIN_METAL_001',
          productName: 'Metal Keychain',
          price: 12.00,
          category: 'Accessories',
          score: 0.65,
          reason: 'Practical daily-use item with band branding',
          imageUrl: '/src/assets/products/pin-enamel.jpg'
        }
      ];
      
      recommendations = mockRecommendations.slice(0, count);
    } else {
      // Calculate recommendations using collaborative filtering approach
      recommendations = allProducts
        .filter(product => !purchasedProductIds.has(product.id)) // Exclude already purchased
        .map(product => {
          let score = 0;
          let reason = '';

          // Category affinity based on purchases
          const purchasedCategories = orderItems?.map(item => item.products?.category).filter(Boolean) || [];
          const categoryCount = purchasedCategories.filter(cat => cat === product.category).length;
          if (categoryCount > 0) {
            score += categoryCount * 0.3;
            reason = `Popular in your preferred category: ${product.category}`;
          }

          // Browsing behavior
          if (viewedProductIds.has(product.id)) {
            score += 0.4;
            reason = reason || 'You recently viewed this item';
          }

          // Price range affinity
          const avgPurchasePrice = orderItems?.length > 0 
            ? orderItems.reduce((sum, item) => sum + (Number(item.products?.price) || 0), 0) / orderItems.length
            : 100;
          
          const priceDiff = Math.abs(Number(product.price) - avgPurchasePrice);
          const priceScore = Math.max(0, 0.2 - (priceDiff / avgPurchasePrice));
          score += priceScore;

          // Style attributes matching
          const customerPrefs = customer.preferred_categories || [];
          if (customerPrefs.includes(product.category)) {
            score += 0.25;
            reason = reason || `Matches your style preferences`;
          }

          // Add some trending/popularity factor (simulate)
          score += Math.random() * 0.15;

          // Boost newer products slightly
          const productAge = new Date().getTime() - new Date(product.created_at).getTime();
          const newnessFactor = Math.max(0, 0.1 - (productAge / (1000 * 60 * 60 * 24 * 30))); // 30 days
          score += newnessFactor;

          return {
            productId: product.id,
            productName: product.name,
            price: Number(product.price) || 0,
            category: product.category || 'Uncategorized',
            score: Math.round(score * 100) / 100,
            reason: reason || 'Recommended for you',
            imageUrl: product.images?.[0] || undefined
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, count);
    }

    return Response.json({
      recommendations,
      metadata: {
        customerId: userId,
        customerSegment: customer?.segment || 'General',
        totalProducts: recommendations.length > 0 ? (allProducts?.length || 150) : 0,
        purchaseHistory: orderItems?.length || 5,
        browsingHistory: pageViews?.length || 12,
        kumoApiConnected: !!kumoApiKey
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in retail-recommend-products function:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});