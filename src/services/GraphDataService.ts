import { supabase } from '@/integrations/supabase/client';

export interface GraphNode3D {
  id: string;
  label: string;
  type: string;
  size: number;
  color: string;
  position: [number, number, number];
  connections: number;
  importance: number;
  metadata?: any;
}

export interface GraphEdge3D {
  source: string;
  target: string;
  strength: number;
  type: string;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
}

export interface GraphData {
  nodes: GraphNode3D[];
  edges: GraphEdge3D[];
  metrics: {
    totalNodes: number;
    totalEdges: number;
    density: number;
    avgDegree: number;
    clusters: number;
  };
}

export class GraphDataService {
  static async fetchGraphData(projectId: string, projectType: string): Promise<{ nodes: GraphNode3D[]; edges: GraphEdge3D[] }> {
    try {
      if (projectType === 'fashion_ecommerce') {
        return await this.fetchEcommerceGraphData(projectId);
      } else {
        return await this.fetchCreativeGraphData(projectId);
      }
    } catch (error) {
      console.error('Error fetching graph data:', error);
      throw error;
    }
  }

  private static async fetchEcommerceGraphData(projectId: string): Promise<{ nodes: GraphNode3D[]; edges: GraphEdge3D[] }> {
    const nodes: GraphNode3D[] = [];
    const edges: GraphEdge3D[] = [];

    // Fetch customers
    const { data: customers } = await supabase
      .from('customers')
      .select('*')
      .eq('project_id', projectId)
      .limit(100);

    // Fetch products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('project_id', projectId)
      .limit(50);

    // Fetch orders to create relationships
    const { data: orders } = await supabase
      .from('orders')
      .select('customer_id, product_id, amount, quantity')
      .eq('project_id', projectId)
      .limit(200);

    // Create customer nodes
    customers?.forEach((customer, index) => {
      nodes.push({
        id: customer.id,
        label: customer.name || `Customer ${index + 1}`,
        type: 'customer',
        size: Math.max(10, (customer.lifetime_value || 0) / 100),
        color: this.getCustomerColor(customer.segment || 'regular'),
        position: this.generatePosition(index, customers.length, 'customer'),
        connections: 0,
        importance: customer.lifetime_value || 0,
        metadata: {
          email: customer.email,
          segment: customer.segment,
          churnRisk: customer.churn_risk,
          acquisitionChannel: customer.acquisition_channel
        }
      });
    });

    // Create product nodes
    products?.forEach((product, index) => {
      nodes.push({
        id: product.id,
        label: product.name,
        type: 'product',
        size: Math.max(8, (product.price || 0) / 50),
        color: this.getProductColor(product.category || 'general'),
        position: this.generatePosition(index, products.length, 'product'),
        connections: 0,
        importance: product.trend_score || 0,
        metadata: {
          category: product.category,
          price: product.price,
          stockQuantity: product.stock_quantity,
          brand: product.brand
        }
      });
    });

    // Create edges from orders
    const connectionStrength: Record<string, number> = {};
    orders?.forEach(order => {
      if (order.customer_id && order.product_id) {
        const edgeKey = `${order.customer_id}-${order.product_id}`;
        if (!connectionStrength[edgeKey]) {
          connectionStrength[edgeKey] = 0;
        }
        connectionStrength[edgeKey] += (order.quantity || 1) * (order.amount || 1);
      }
    });

    // Create edges
    Object.entries(connectionStrength).forEach(([edgeKey, strength]) => {
      const [customerId, productId] = edgeKey.split('-');
      const customerNode = nodes.find(n => n.id === customerId);
      const productNode = nodes.find(n => n.id === productId);

      if (customerNode && productNode) {
        edges.push({
          source: customerId,
          target: productId,
          strength: Math.min(1, strength / 1000), // Normalize strength
          type: 'purchase',
          sourcePos: customerNode.position,
          targetPos: productNode.position
        });
        customerNode.connections++;
        productNode.connections++;
      }
    });

    return { nodes, edges };
  }

  private static async fetchCreativeGraphData(projectId: string): Promise<{ nodes: GraphNode3D[]; edges: GraphEdge3D[] }> {
    const nodes: GraphNode3D[] = [];
    const edges: GraphEdge3D[] = [];

    // Fetch fans
    const { data: fans } = await supabase
      .from('fans')
      .select('*')
      .eq('project_id', projectId)
      .limit(100);

    // Fetch streams for relationships
    const { data: streams } = await supabase
      .from('streams')
      .select('fan_id, track_name, artist_name, play_count, duration_ms')
      .eq('project_id', projectId)
      .limit(500);

    // Fetch merch items
    const { data: merchItems } = await supabase
      .from('merch_items')
      .select('*')
      .eq('project_id', projectId)
      .limit(30);

    // Create fan nodes
    fans?.forEach((fan, index) => {
      nodes.push({
        id: fan.id,
        label: fan.username || `Fan ${index + 1}`,
        type: 'fan',
        size: Math.max(8, (fan.engagement_score || 0) * 20),
        color: fan.superfan_status ? '#ef4444' : '#06b6d4',
        position: this.generatePosition(index, fans.length, 'fan'),
        connections: 0,
        importance: fan.engagement_score || 0,
        metadata: {
          email: fan.email,
          location: fan.location,
          superfanStatus: fan.superfan_status,
          acquisitionChannel: fan.acquisition_channel
        }
      });
    });

    // Create unique tracks and artists from streams
    const trackMap = new Map<string, { name: string; artist: string; plays: number }>();
    streams?.forEach(stream => {
      const key = `${stream.artist_name}-${stream.track_name}`;
      if (!trackMap.has(key)) {
        trackMap.set(key, { name: stream.track_name || 'Unknown', artist: stream.artist_name || 'Unknown', plays: 0 });
      }
      trackMap.get(key)!.plays += stream.play_count || 1;
    });

    // Create track nodes
    Array.from(trackMap.entries()).forEach(([key, track], index) => {
      nodes.push({
        id: `track-${key}`,
        label: track.name,
        type: 'song',
        size: Math.max(10, Math.log(track.plays + 1) * 3),
        color: '#10b981',
        position: this.generatePosition(index, trackMap.size, 'song'),
        connections: 0,
        importance: track.plays,
        metadata: {
          artist: track.artist,
          totalPlays: track.plays
        }
      });
    });

    // Create merch nodes
    merchItems?.forEach((item, index) => {
      nodes.push({
        id: item.id,
        label: item.name,
        type: 'merch',
        size: Math.max(8, (item.price || 0) / 10),
        color: '#f59e0b',
        position: this.generatePosition(index, merchItems.length, 'merch'),
        connections: 0,
        importance: item.stock_quantity || 0,
        metadata: {
          category: item.category,
          price: item.price,
          stock: item.stock_quantity
        }
      });
    });

    // Create edges from streams
    const connectionStrength: Record<string, number> = {};
    streams?.forEach(stream => {
      if (stream.fan_id && stream.track_name && stream.artist_name) {
        const trackKey = `track-${stream.artist_name}-${stream.track_name}`;
        const edgeKey = `${stream.fan_id}-${trackKey}`;
        if (!connectionStrength[edgeKey]) {
          connectionStrength[edgeKey] = 0;
        }
        connectionStrength[edgeKey] += (stream.play_count || 1) * (stream.duration_ms || 180000) / 180000;
      }
    });

    // Create edges
    Object.entries(connectionStrength).forEach(([edgeKey, strength]) => {
      const [fanId, trackId] = edgeKey.split('-', 2);
      const remainingKey = edgeKey.substring(fanId.length + 1);
      const fanNode = nodes.find(n => n.id === fanId);
      const trackNode = nodes.find(n => n.id === remainingKey);

      if (fanNode && trackNode) {
        edges.push({
          source: fanId,
          target: remainingKey,
          strength: Math.min(1, strength / 100),
          type: 'listening',
          sourcePos: fanNode.position,
          targetPos: trackNode.position
        });
        fanNode.connections++;
        trackNode.connections++;
      }
    });

    return { nodes, edges };
  }

  private static generatePosition(index: number, total: number, type: string): [number, number, number] {
    // Generate positions in different regions based on type
    const typeOffset: Record<string, [number, number, number]> = {
      customer: [-10, 0, 0],
      product: [10, 0, 0],
      fan: [-8, 5, 0],
      song: [8, 5, 0],
      merch: [0, -5, 0],
      artist: [0, 10, 0],
      venue: [0, -10, 0]
    };

    const offset = typeOffset[type] || [0, 0, 0];
    const angle = (index / total) * 2 * Math.PI;
    const radius = Math.max(3, Math.sqrt(total) * 0.8);

    return [
      offset[0] + Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
      offset[1] + (Math.random() - 0.5) * 4,
      offset[2] + Math.sin(angle) * radius + (Math.random() - 0.5) * 2
    ];
  }

  private static getCustomerColor(segment: string): string {
    const colors: Record<string, string> = {
      'high_value': '#ef4444',
      'regular': '#3b82f6',
      'new': '#10b981',
      'at_risk': '#f59e0b'
    };
    return colors[segment] || '#6b7280';
  }

  private static getProductColor(category: string): string {
    const colors: Record<string, string> = {
      'clothing': '#8b5cf6',
      'accessories': '#06b6d4',
      'shoes': '#10b981',
      'bags': '#f59e0b'
    };
    return colors[category] || '#8b5cf6';
  }

  static async calculateGraphMetrics(nodes: GraphNode3D[], edges: GraphEdge3D[]): Promise<GraphData['metrics']> {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;
    const maxPossibleEdges = (totalNodes * (totalNodes - 1)) / 2;
    const density = maxPossibleEdges > 0 ? totalEdges / maxPossibleEdges : 0;
    const avgDegree = totalNodes > 0 ? (totalEdges * 2) / totalNodes : 0;

    // Simple community detection (connected components)
    const visited = new Set<string>();
    let clusters = 0;

    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        this.dfsVisit(node.id, visited, edges);
        clusters++;
      }
    });

    return {
      totalNodes,
      totalEdges,
      density: Math.round(density * 10000) / 10000,
      avgDegree: Math.round(avgDegree * 100) / 100,
      clusters
    };
  }

  private static dfsVisit(nodeId: string, visited: Set<string>, edges: GraphEdge3D[]) {
    visited.add(nodeId);
    
    edges.forEach(edge => {
      if (edge.source === nodeId && !visited.has(edge.target)) {
        this.dfsVisit(edge.target, visited, edges);
      }
      if (edge.target === nodeId && !visited.has(edge.source)) {
        this.dfsVisit(edge.source, visited, edges);
      }
    });
  }
}