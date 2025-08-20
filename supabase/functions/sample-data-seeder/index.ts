import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SeedDataRequest {
  projectId: string;
  projectType: 'fashion_ecommerce' | 'creative_hub';
  recordCount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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

    const { projectId, projectType, recordCount = 50 }: SeedDataRequest = await req.json();

    // Verify project access
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, type')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return Response.json({ error: 'Project not found' }, { status: 404, headers: corsHeaders });
    }

    const results = { created: [], errors: [] };

    if (projectType === 'fashion_ecommerce') {
      // Seed E-commerce data
      console.log('Seeding fashion e-commerce data...');

      // Create products
      const products = [];
      const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Shoes'];
      const colors = ['Black', 'White', 'Navy', 'Red', 'Blue', 'Green', 'Pink', 'Gray'];
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const brands = ['StyleCo', 'FashionForward', 'TrendSetter', 'ChicWear', 'ModernLine'];

      for (let i = 0; i < recordCount; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        
        products.push({
          project_id: projectId,
          name: `${brand} ${color} ${category.slice(0, -1)} ${i + 1}`,
          category,
          price: Math.round((Math.random() * 200 + 20) * 100) / 100,
          sku: `${brand.toUpperCase()}-${category.substr(0,3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
          color,
          size,
          brand,
          material: Math.random() > 0.5 ? 'Cotton' : Math.random() > 0.5 ? 'Polyester' : 'Cotton Blend',
          season: Math.random() > 0.5 ? 'Spring/Summer' : 'Fall/Winter',
          stock_quantity: Math.floor(Math.random() * 100) + 10,
          trend_score: Math.round(Math.random() * 100) / 100,
          style_attributes: {
            style: Math.random() > 0.5 ? 'casual' : Math.random() > 0.5 ? 'formal' : 'trendy',
            fit: Math.random() > 0.5 ? 'regular' : Math.random() > 0.5 ? 'slim' : 'loose'
          }
        });
      }

      const { data: createdProducts, error: productsError } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (productsError) {
        results.errors.push(`Products: ${productsError.message}`);
      } else {
        results.created.push(`${createdProducts.length} products`);
      }

      // Create customers
      const customers = [];
      const firstNames = ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
      const channels = ['organic_search', 'social_media', 'email_campaign', 'referral', 'paid_ads'];

      for (let i = 0; i < recordCount; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        
        customers.push({
          project_id: projectId,
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
          segment: Math.random() > 0.7 ? 'premium' : Math.random() > 0.4 ? 'regular' : 'new',
          age: Math.floor(Math.random() * 40) + 18,
          gender: Math.random() > 0.5 ? 'female' : Math.random() > 0.5 ? 'male' : 'other',
          city,
          country: 'United States',
          zip_code: String(Math.floor(Math.random() * 90000) + 10000),
          acquisition_channel: channels[Math.floor(Math.random() * channels.length)],
          acquisition_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          preferred_categories: [categories[Math.floor(Math.random() * categories.length)]],
          churn_risk: Math.round(Math.random() * 100) / 100,
          lifetime_value: Math.round((Math.random() * 1000 + 100) * 100) / 100
        });
      }

      const { data: createdCustomers, error: customersError } = await supabase
        .from('customers')
        .insert(customers)
        .select();

      if (customersError) {
        results.errors.push(`Customers: ${customersError.message}`);
      } else {
        results.created.push(`${createdCustomers.length} customers`);

        // Create orders and order items
        if (createdProducts && createdCustomers) {
          const orders = [];
          const orderItems = [];
          
          for (let i = 0; i < recordCount * 2; i++) {
            const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
            const orderDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
            
            const orderId = crypto.randomUUID();
            const itemCount = Math.floor(Math.random() * 3) + 1;
            let orderTotal = 0;
            
            orders.push({
              id: orderId,
              project_id: projectId,
              customer_id: customer.id,
              created_at: orderDate,
              quantity: itemCount
            });

            for (let j = 0; j < itemCount; j++) {
              const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
              const quantity = Math.floor(Math.random() * 2) + 1;
              const unitPrice = Number(product.price);
              const totalPrice = unitPrice * quantity;
              orderTotal += totalPrice;

              orderItems.push({
                order_id: orderId,
                product_id: product.id,
                quantity,
                unit_price: unitPrice,
                total_price: totalPrice
              });
            }

            // Update order amount
            orders[orders.length - 1].amount = orderTotal;
          }

          const { error: ordersError } = await supabase.from('orders').insert(orders);
          const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems);

          if (ordersError) results.errors.push(`Orders: ${ordersError.message}`);
          else results.created.push(`${orders.length} orders`);

          if (orderItemsError) results.errors.push(`Order items: ${orderItemsError.message}`);
          else results.created.push(`${orderItems.length} order items`);
        }
      }

    } else if (projectType === 'creative_hub') {
      // Seed Artist/Creative data
      console.log('Seeding creative hub data...');

      // Create fans
      const fans = [];
      const usernames = ['musiclover1', 'concertfan', 'vinylcollector', 'festivalgoer', 'superfan'];
      const cities = ['New York', 'Los Angeles', 'Nashville', 'Austin', 'Seattle', 'Miami', 'Denver', 'Portland'];
      const platforms = ['instagram', 'tiktok', 'twitter', 'youtube'];

      for (let i = 0; i < recordCount; i++) {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const username = `${usernames[Math.floor(Math.random() * usernames.length)]}${i}`;
        
        fans.push({
          project_id: projectId,
          username,
          email: `${username}@example.com`,
          engagement_score: Math.round(Math.random() * 100),
          superfan_status: Math.random() > 0.8,
          age: Math.floor(Math.random() * 40) + 16,
          gender: Math.random() > 0.5 ? 'female' : Math.random() > 0.5 ? 'male' : 'other',
          city,
          country: 'United States',
          acquisition_channel: platforms[Math.floor(Math.random() * platforms.length)],
          location: { city, country: 'United States' },
          favorite_tracks: [`Track ${Math.floor(Math.random() * 20) + 1}`],
          social_handles: {
            instagram: `@${username}`,
            tiktok: `@${username}_tt`
          }
        });
      }

      const { data: createdFans, error: fansError } = await supabase
        .from('fans')
        .insert(fans)
        .select();

      if (fansError) {
        results.errors.push(`Fans: ${fansError.message}`);
      } else {
        results.created.push(`${createdFans.length} fans`);
      }

      // Create concerts/events
      const concerts = [];
      const venues = ['Madison Square Garden', 'Staples Center', 'Red Rocks', 'Greek Theatre', 'House of Blues'];
      
      for (let i = 0; i < recordCount / 5; i++) {
        const venue = venues[Math.floor(Math.random() * venues.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const date = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000);
        const capacity = Math.floor(Math.random() * 5000) + 1000;
        
        concerts.push({
          project_id: projectId,
          venue_name: venue,
          city,
          date: date.toISOString().split('T')[0],
          capacity,
          predicted_attendance: Math.floor(capacity * (0.6 + Math.random() * 0.4)),
          venue_data: {
            type: 'concert_hall',
            capacity,
            location: { city, venue }
          }
        });
      }

      const { data: createdConcerts, error: concertsError } = await supabase
        .from('concerts')
        .insert(concerts)
        .select();

      if (concertsError) {
        results.errors.push(`Concerts: ${concertsError.message}`);
      } else {
        results.created.push(`${createdConcerts.length} concerts`);
      }

      // Create streams data
      if (createdFans) {
        const streams = [];
        const tracks = ['Hit Song 1', 'Popular Track', 'Chart Topper', 'Fan Favorite', 'Latest Single'];
        const streamingPlatforms = ['spotify', 'apple_music', 'youtube', 'soundcloud'];

        for (let i = 0; i < recordCount * 5; i++) {
          const fan = createdFans[Math.floor(Math.random() * createdFans.length)];
          const track = tracks[Math.floor(Math.random() * tracks.length)];
          const platform = streamingPlatforms[Math.floor(Math.random() * streamingPlatforms.length)];
          
          streams.push({
            project_id: projectId,
            fan_id: fan.id,
            track_name: track,
            artist_name: 'Your Artist Name',
            platform,
            play_count: Math.floor(Math.random() * 10) + 1,
            duration_ms: (Math.floor(Math.random() * 120) + 180) * 1000,
            location: fan.location,
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
        }

        const { error: streamsError } = await supabase.from('streams').insert(streams);
        if (streamsError) results.errors.push(`Streams: ${streamsError.message}`);
        else results.created.push(`${streams.length} streams`);
      }
    }

    return Response.json({
      success: true,
      message: `Successfully seeded sample data for ${projectType} project`,
      results,
      projectId,
      recordCount
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error in sample-data-seeder function:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});