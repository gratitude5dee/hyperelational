// Enhanced Mock Data Service for Dashboard Widgets
import { addDays, subDays, format } from 'date-fns';

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  segment: 'high_value' | 'regular' | 'new' | 'at_risk';
  lifetime_value: number;
  churn_risk: 'high' | 'medium' | 'low';
  churn_probability: number;
  last_seen: string;
  acquisition_channel: string;
  location: string;
  orders_count: number;
  total_spent: number;
}

export interface MockProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  rating: number;
  description: string;
  brand: string;
  in_stock: boolean;
  popularity_score: number;
}

export interface MockFanData {
  id: string;
  username: string;
  email: string;
  location: string;
  engagement_score: number;
  superfan_status: boolean;
  tier: 'gold' | 'silver' | 'bronze';
  total_spent: number;
  concerts_attended: number;
  streams_count: number;
  last_activity: string;
}

export interface MockTourData {
  city: string;
  state: string;
  country: string;
  predicted_sales: number;
  fan_base: number;
  streaming_activity: number;
  seasonality: 'high' | 'medium' | 'low';
  competition_level: 'high' | 'medium' | 'low';
  venue_capacity: number;
  ticket_price_range: string;
  revenue_potential: number;
  market_penetration: number;
}

export class MockDataService {
  // Fashion/E-commerce Mock Data
  static generateMockCustomers(count: number = 100): MockCustomer[] {
    const segments: MockCustomer['segment'][] = ['high_value', 'regular', 'new', 'at_risk'];
    const channels = ['social_media', 'email', 'organic', 'paid_ads', 'referral'];
    const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    
    return Array.from({ length: count }, (_, i) => {
      const segment = segments[Math.floor(Math.random() * segments.length)];
      const churnRisk = segment === 'at_risk' ? 'high' : segment === 'new' ? 'low' : Math.random() > 0.7 ? 'medium' : 'low';
      
      return {
        id: `customer-${i + 1}`,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        segment,
        lifetime_value: Math.floor(Math.random() * 5000) + 100,
        churn_risk: churnRisk as 'high' | 'medium' | 'low',
        churn_probability: churnRisk === 'high' ? Math.random() * 0.4 + 0.6 : churnRisk === 'medium' ? Math.random() * 0.3 + 0.3 : Math.random() * 0.3,
        last_seen: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
        acquisition_channel: channels[Math.floor(Math.random() * channels.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        orders_count: Math.floor(Math.random() * 20) + 1,
        total_spent: Math.floor(Math.random() * 3000) + 50
      };
    });
  }

  static generateMockProducts(count: number = 50): MockProduct[] {
    const categories = ['clothing', 'accessories', 'shoes', 'bags', 'jewelry'];
    const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Prada', 'Uniqlo', 'Gap'];
    const productNames = [
      'Premium Cotton T-Shirt', 'Designer Leather Jacket', 'Running Sneakers', 'Casual Jeans',
      'Wool Sweater', 'Summer Dress', 'Athletic Shorts', 'Business Suit', 'Winter Coat',
      'Silk Scarf', 'Leather Boots', 'Canvas Bag', 'Gold Watch', 'Sunglasses', 'Belt'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `product-${i + 1}`,
      name: productNames[Math.floor(Math.random() * productNames.length)] + ` ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 500) + 20,
      image_url: `/api/placeholder/300/300`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      description: 'High-quality product with excellent craftsmanship and modern design.',
      brand: brands[Math.floor(Math.random() * brands.length)],
      in_stock: Math.random() > 0.1,
      popularity_score: Math.random() * 100
    }));
  }

  // Music/Artist Mock Data
  static generateMockFans(count: number = 150): MockFanData[] {
    const tiers: MockFanData['tier'][] = ['gold', 'silver', 'bronze'];
    const locations = ['Nashville', 'Austin', 'Los Angeles', 'New York', 'Atlanta', 'Chicago', 'Seattle', 'Denver', 'Miami', 'Boston'];

    return Array.from({ length: count }, (_, i) => {
      const tier = tiers[Math.floor(Math.random() * tiers.length)];
      const superfan = tier === 'gold' && Math.random() > 0.7;
      
      return {
        id: `fan-${i + 1}`,
        username: `MusicFan${i + 1}`,
        email: `fan${i + 1}@example.com`,
        location: locations[Math.floor(Math.random() * locations.length)],
        engagement_score: Math.random() * 100,
        superfan_status: superfan,
        tier,
        total_spent: Math.floor(Math.random() * 2000) + 50,
        concerts_attended: Math.floor(Math.random() * 20),
        streams_count: Math.floor(Math.random() * 10000) + 100,
        last_activity: format(subDays(new Date(), Math.floor(Math.random() * 7)), 'yyyy-MM-dd')
      };
    });
  }

  static generateMockTourData(): MockTourData[] {
    const cities = [
      { city: 'Los Angeles', state: 'CA', country: 'USA', capacity: 20000 },
      { city: 'New York', state: 'NY', country: 'USA', capacity: 18000 },
      { city: 'Chicago', state: 'IL', country: 'USA', capacity: 15000 },
      { city: 'Nashville', state: 'TN', country: 'USA', capacity: 12000 },
      { city: 'Austin', state: 'TX', country: 'USA', capacity: 10000 },
      { city: 'Atlanta', state: 'GA', country: 'USA', capacity: 14000 },
      { city: 'Seattle', state: 'WA', country: 'USA', capacity: 13000 },
      { city: 'Denver', state: 'CO', country: 'USA', capacity: 11000 },
      { city: 'Miami', state: 'FL', country: 'USA', capacity: 9000 },
      { city: 'Boston', state: 'MA', country: 'USA', capacity: 12500 }
    ];

    return cities.map(location => {
      const fanBase = Math.floor(Math.random() * 50000) + 10000;
      const predictedSales = Math.floor(fanBase * (0.1 + Math.random() * 0.4));
      
      return {
        ...location,
        predicted_sales: predictedSales,
        fan_base: fanBase,
        streaming_activity: Math.floor(Math.random() * 1000000) + 100000,
        seasonality: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        competition_level: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        venue_capacity: location.capacity,
        ticket_price_range: `$${50 + Math.floor(Math.random() * 100)}-$${150 + Math.floor(Math.random() * 200)}`,
        revenue_potential: predictedSales * (75 + Math.random() * 100),
        market_penetration: Math.round((predictedSales / fanBase) * 100)
      };
    });
  }

  // Performance Analytics Mock Data
  static generatePerformanceData(days: number = 30) {
    const now = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(now, days - i - 1);
      const baseValue = 1000 + Math.sin(i * 0.1) * 200;
      
      return {
        timestamp: format(date, 'MMM dd'),
        primary: Math.floor(baseValue + Math.random() * 400),
        secondary: Math.floor(baseValue * 0.7 + Math.random() * 300),
        tertiary: Math.floor(baseValue * 0.5 + Math.random() * 200)
      };
    });
  }

  // Network Data for 3D Visualization
  static generateNetworkData(industryMode: 'fashion' | 'artist') {
    const nodes = [];
    const edges = [];

    if (industryMode === 'fashion') {
      // Generate customer nodes
      for (let i = 0; i < 30; i++) {
        nodes.push({
          id: `customer-${i}`,
          label: `Customer ${i + 1}`,
          type: 'customer',
          size: 8 + Math.random() * 12,
          color: '#3b82f6',
          position: [
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          ] as [number, number, number],
          connections: 0,
          importance: Math.random() * 100
        });
      }

      // Generate product nodes
      for (let i = 0; i < 20; i++) {
        nodes.push({
          id: `product-${i}`,
          label: `Product ${i + 1}`,
          type: 'product',
          size: 6 + Math.random() * 8,
          color: '#8b5cf6',
          position: [
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          ] as [number, number, number],
          connections: 0,
          importance: Math.random() * 100
        });
      }
    } else {
      // Generate fan nodes
      for (let i = 0; i < 25; i++) {
        nodes.push({
          id: `fan-${i}`,
          label: `Fan ${i + 1}`,
          type: 'fan',
          size: 6 + Math.random() * 10,
          color: '#06b6d4',
          position: [
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          ] as [number, number, number],
          connections: 0,
          importance: Math.random() * 100
        });
      }

      // Generate song nodes
      for (let i = 0; i < 15; i++) {
        nodes.push({
          id: `song-${i}`,
          label: `Song ${i + 1}`,
          type: 'song',
          size: 8 + Math.random() * 6,
          color: '#10b981',
          position: [
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          ] as [number, number, number],
          connections: 0,
          importance: Math.random() * 100
        });
      }
    }

    // Generate random edges
    for (let i = 0; i < nodes.length * 2; i++) {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[Math.floor(Math.random() * nodes.length)];
      
      if (source.id !== target.id) {
        edges.push({
          source: source.id,
          target: target.id,
          strength: Math.random(),
          type: industryMode === 'fashion' ? 'purchase' : 'listening',
          sourcePos: source.position,
          targetPos: target.position
        });
        source.connections++;
        target.connections++;
      }
    }

    return { nodes, edges };
  }

  // Real-time metrics simulation
  static generateRealTimeMetrics(industryMode: 'fashion' | 'artist') {
    if (industryMode === 'fashion') {
      return {
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        sales: Math.floor(Math.random() * 50000) + 10000,
        conversionRate: Math.round((Math.random() * 5 + 2) * 100) / 100,
        avgOrderValue: Math.floor(Math.random() * 200) + 80,
        cartAbandonment: Math.round((Math.random() * 30 + 60) * 100) / 100,
        newCustomers: Math.floor(Math.random() * 50) + 10
      };
    } else {
      return {
        activeListeners: Math.floor(Math.random() * 5000) + 1000,
        streams: Math.floor(Math.random() * 100000) + 20000,
        fanEngagement: Math.round((Math.random() * 30 + 70) * 100) / 100,
        merchSales: Math.floor(Math.random() * 10000) + 2000,
        socialMentions: Math.floor(Math.random() * 500) + 100,
        newFollowers: Math.floor(Math.random() * 200) + 50
      };
    }
  }

  // Generate product recommendations
  static generateProductRecommendations(customerId: string): Array<{
    productId: string;
    productName: string;
    price: number;
    category: string;
    score: number;
    reason: string;
    imageUrl: string;
  }> {
    const products = this.generateMockProducts(10);
    const reasons = [
      'Based on your purchase history',
      'Customers like you also bought',
      'Trending in your area',
      'Perfect for your style',
      'High rating from similar customers'
    ];

    return products.slice(0, 6).map(product => ({
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
      score: Math.round((Math.random() * 30 + 70) * 10) / 10,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      imageUrl: product.image_url
    }));
  }
}