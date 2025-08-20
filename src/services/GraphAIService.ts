import { supabase } from '@/integrations/supabase/client';
import { GraphNode3D, GraphEdge3D } from './GraphDataService';

export interface AIInsight {
  id: string;
  type: 'anomaly' | 'opportunity' | 'pattern' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number; // 0-1
  relevantNodes: string[];
  actionableItems: string[];
  createdAt: Date;
}

export interface PatternAnalysis {
  patternType: string;
  description: string;
  nodes: string[];
  strength: number; // 0-1
  confidence: number; // 0-1
  implications: string[];
}

export interface QueryResult {
  query: string;
  interpretation: string;
  relevantNodes: string[];
  insights: string[];
  suggestedActions: string[];
}

export class GraphAIService {
  
  static async generateInsights(
    nodes: GraphNode3D[], 
    edges: GraphEdge3D[], 
    projectType: string
  ): Promise<AIInsight[]> {
    try {
      // For now, we'll generate mock insights based on graph analysis
      // In production, this would call Groq API for real AI analysis
      return this.generateMockInsights(nodes, edges, projectType);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      return [];
    }
  }

  static async detectPatterns(
    nodes: GraphNode3D[], 
    edges: GraphEdge3D[], 
    projectType: string
  ): Promise<PatternAnalysis[]> {
    try {
      return this.analyzeMockPatterns(nodes, edges, projectType);
    } catch (error) {
      console.error('Failed to detect patterns:', error);
      return [];
    }
  }

  static async processNaturalLanguageQuery(
    query: string,
    nodes: GraphNode3D[],
    edges: GraphEdge3D[],
    projectType: string
  ): Promise<AIInsight[]> {
    try {
      // Mock natural language processing
      return this.processMockQuery(query, nodes, edges, projectType);
    } catch (error) {
      console.error('Failed to process query:', error);
      return [];
    }
  }

  private static generateMockInsights(
    nodes: GraphNode3D[],
    edges: GraphEdge3D[],
    projectType: string
  ): AIInsight[] {
    const insights: AIInsight[] = [];

    // Calculate basic network metrics
    const networkDensity = edges.length / ((nodes.length * (nodes.length - 1)) / 2);
    const avgDegree = nodes.length > 0 ? (edges.length * 2) / nodes.length : 0;

    // Degree centrality analysis
    const degreeCentrality: Record<string, number> = {};
    nodes.forEach(node => {
      degreeCentrality[node.id] = edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length;
    });

    const topNodes = nodes
      .sort((a, b) => degreeCentrality[b.id] - degreeCentrality[a.id])
      .slice(0, 5);

    // Generate insights based on project type
    if (projectType === 'fashion_ecommerce') {
      // E-commerce specific insights
      const highValueCustomers = nodes
        .filter(n => n.type === 'customer' && n.importance > 500)
        .slice(0, 3);

      if (highValueCustomers.length > 0) {
        insights.push({
          id: 'high-value-customers',
          type: 'opportunity',
          title: 'High-Value Customer Segment Identified',
          description: `Found ${highValueCustomers.length} customers with exceptional lifetime value. These customers show strong purchase patterns and should be prioritized for retention.`,
          confidence: 0.85,
          relevantNodes: highValueCustomers.map(n => n.id),
          actionableItems: [
            'Create personalized retention campaigns',
            'Offer exclusive early access to new products',
            'Implement VIP customer service tier'
          ],
          createdAt: new Date()
        });
      }

      const popularProducts = nodes
        .filter(n => n.type === 'product')
        .sort((a, b) => degreeCentrality[b.id] - degreeCentrality[a.id])
        .slice(0, 3);

      if (popularProducts.length > 0) {
        insights.push({
          id: 'popular-products',
          type: 'pattern',
          title: 'Best-Selling Product Pattern',
          description: `${popularProducts[0].label} shows the highest customer engagement with ${degreeCentrality[popularProducts[0].id]} connections.`,
          confidence: 0.92,
          relevantNodes: popularProducts.map(n => n.id),
          actionableItems: [
            'Increase inventory for top performers',
            'Create similar product variations',
            'Use in cross-selling campaigns'
          ],
          createdAt: new Date()
        });
      }

    } else {
      // Creative/Artist insights
      const superFans = nodes
        .filter(n => n.type === 'fan' && n.metadata?.superfanStatus)
        .slice(0, 3);

      if (superFans.length > 0) {
        insights.push({
          id: 'superfan-segment',
          type: 'opportunity',
          title: 'Superfan Community Detected',
          description: `Identified ${superFans.length} superfans with high engagement scores. These are your most valuable advocates.`,
          confidence: 0.88,
          relevantNodes: superFans.map(n => n.id),
          actionableItems: [
            'Create exclusive superfan experiences',
            'Launch ambassador program',
            'Offer limited edition merchandise'
          ],
          createdAt: new Date()
        });
      }

      const topTracks = nodes
        .filter(n => n.type === 'song')
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 3);

      if (topTracks.length > 0) {
        insights.push({
          id: 'viral-tracks',
          type: 'prediction',
          title: 'Trending Track Analysis',
          description: `${topTracks[0].label} shows viral potential with ${topTracks[0].importance} total plays and growing engagement.`,
          confidence: 0.76,
          relevantNodes: topTracks.map(n => n.id),
          actionableItems: [
            'Increase promotional budget for trending tracks',
            'Plan live performance showcases',
            'Create remix opportunities'
          ],
          createdAt: new Date()
        });
      }
    }

    // Universal network insights
    if (networkDensity < 0.1) {
      insights.push({
        id: 'sparse-network',
        type: 'anomaly',
        title: 'Sparse Network Detected',
        description: `Network density is ${(networkDensity * 100).toFixed(1)}%, indicating isolated clusters. Consider strategies to increase connectivity.`,
        confidence: 0.94,
        relevantNodes: topNodes.map(n => n.id),
        actionableItems: [
          'Implement recommendation systems',
          'Create cross-category promotions',
          'Host community-building events'
        ],
        createdAt: new Date()
      });
    }

    if (topNodes.length > 0 && degreeCentrality[topNodes[0].id] > avgDegree * 3) {
      insights.push({
        id: 'network-hub',
        type: 'pattern',
        title: 'Network Hub Identified',
        description: `${topNodes[0].label} acts as a major network hub with ${degreeCentrality[topNodes[0].id]} connections, significantly above average.`,
        confidence: 0.91,
        relevantNodes: [topNodes[0].id],
        actionableItems: [
          'Protect this key relationship',
          'Leverage for network expansion',
          'Monitor for dependency risks'
        ],
        createdAt: new Date()
      });
    }

    return insights;
  }

  private static analyzeMockPatterns(
    nodes: GraphNode3D[],
    edges: GraphEdge3D[],
    projectType: string
  ): PatternAnalysis[] {
    const patterns: PatternAnalysis[] = [];

    // Analyze clustering by type
    const typeGroups: Record<string, GraphNode3D[]> = {};
    nodes.forEach(node => {
      if (!typeGroups[node.type]) typeGroups[node.type] = [];
      typeGroups[node.type].push(node);
    });

    // Detect strong clusters
    Object.entries(typeGroups).forEach(([type, typeNodes]) => {
      if (typeNodes.length >= 5) {
        const internalConnections = edges.filter(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          return sourceNode?.type === type && targetNode?.type === type;
        });

        const strength = internalConnections.length / typeNodes.length;
        
        patterns.push({
          patternType: `${type} cluster`,
          description: `Strong clustering detected among ${type} nodes with ${internalConnections.length} internal connections`,
          nodes: typeNodes.map(n => n.id),
          strength: Math.min(1, strength),
          confidence: 0.8,
          implications: [
            `${type} entities show high similarity`,
            'Consider specialized strategies for this group',
            'Potential for community-based features'
          ]
        });
      }
    });

    // Detect bridge nodes (high betweenness centrality approximation)
    const bridgeNodes = nodes.filter(node => {
      const connections = edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      );
      
      const connectedTypes = new Set();
      connections.forEach(edge => {
        const otherNodeId = edge.source === node.id ? edge.target : edge.source;
        const otherNode = nodes.find(n => n.id === otherNodeId);
        if (otherNode) connectedTypes.add(otherNode.type);
      });
      
      return connectedTypes.size >= 3; // Connects to 3+ different types
    });

    if (bridgeNodes.length > 0) {
      patterns.push({
        patternType: 'Bridge Nodes',
        description: `${bridgeNodes.length} nodes act as bridges between different communities`,
        nodes: bridgeNodes.map(n => n.id),
        strength: bridgeNodes.length / nodes.length,
        confidence: 0.75,
        implications: [
          'Critical for network connectivity',
          'High influence potential',
          'Risk points if removed'
        ]
      });
    }

    // Detect star patterns (one node with many connections)
    const starCenters = nodes.filter(node => {
      const degree = edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length;
      return degree > Math.max(5, nodes.length * 0.1);
    });

    if (starCenters.length > 0) {
      patterns.push({
        patternType: 'Star Pattern',
        description: `${starCenters.length} nodes show star-like connection patterns`,
        nodes: starCenters.map(n => n.id),
        strength: 0.9,
        confidence: 0.88,
        implications: [
          'Centralized influence structure',
          'High dependency on key nodes',
          'Efficient information flow'
        ]
      });
    }

    return patterns;
  }

  private static processMockQuery(
    query: string,
    nodes: GraphNode3D[],
    edges: GraphEdge3D[],
    projectType: string
  ): AIInsight[] {
    const insights: AIInsight[] = [];
    const lowerQuery = query.toLowerCase();

    // Parse different types of queries
    if (lowerQuery.includes('high-value') || lowerQuery.includes('valuable')) {
      const highValueNodes = nodes
        .filter(n => n.importance > 0.7)
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 5);

      insights.push({
        id: 'query-high-value',
        type: 'recommendation',
        title: 'High-Value Entities Found',
        description: `Identified ${highValueNodes.length} high-value entities based on importance metrics.`,
        confidence: 0.87,
        relevantNodes: highValueNodes.map(n => n.id),
        actionableItems: [
          'Focus retention efforts on these entities',
          'Analyze what makes them valuable',
          'Create lookalike targeting'
        ],
        createdAt: new Date()
      });
    }

    if (lowerQuery.includes('risk') || lowerQuery.includes('churn')) {
      const riskNodes = nodes
        .filter(n => n.metadata?.churnRisk > 0.6)
        .slice(0, 5);

      if (riskNodes.length > 0) {
        insights.push({
          id: 'query-risk',
          type: 'anomaly',
          title: 'At-Risk Entities Identified',
          description: `Found ${riskNodes.length} entities with high churn risk scores.`,
          confidence: 0.92,
          relevantNodes: riskNodes.map(n => n.id),
          actionableItems: [
            'Implement immediate retention campaigns',
            'Increase customer service touchpoints',
            'Offer special incentives'
          ],
          createdAt: new Date()
        });
      }
    }

    if (lowerQuery.includes('influential') || lowerQuery.includes('important')) {
      const degreeCentrality: Record<string, number> = {};
      nodes.forEach(node => {
        degreeCentrality[node.id] = edges.filter(edge => 
          edge.source === node.id || edge.target === node.id
        ).length;
      });

      const influentialNodes = nodes
        .sort((a, b) => degreeCentrality[b.id] - degreeCentrality[a.id])
        .slice(0, 5);

      insights.push({
        id: 'query-influential',
        type: 'pattern',
        title: 'Most Influential Nodes',
        description: `Top influential nodes based on network connectivity and centrality measures.`,
        confidence: 0.95,
        relevantNodes: influentialNodes.map(n => n.id),
        actionableItems: [
          'Leverage these nodes for viral marketing',
          'Protect these key relationships',
          'Monitor their satisfaction closely'
        ],
        createdAt: new Date()
      });
    }

    if (lowerQuery.includes('segment') || lowerQuery.includes('group')) {
      const typeGroups = nodes.reduce((acc, node) => {
        if (!acc[node.type]) acc[node.type] = [];
        acc[node.type].push(node.id);
        return acc;
      }, {} as Record<string, string[]>);

      const typeGroupEntries = Object.entries(typeGroups);
      const largestSegment = typeGroupEntries.length > 0 
        ? typeGroupEntries.sort(([,a], [,b]) => b.length - a.length)[0]
        : null;

      if (largestSegment) {
        insights.push({
          id: 'query-segments',
          type: 'pattern',
          title: `${largestSegment[0]} Segment Analysis`,
          description: `Largest segment identified: ${largestSegment[0]} with ${largestSegment[1].length} entities.`,
          confidence: 0.89,
          relevantNodes: largestSegment[1],
          actionableItems: [
            'Develop segment-specific strategies',
            'Create targeted messaging',
            'Analyze segment characteristics'
          ],
          createdAt: new Date()
        });
      }
    }

    // Fallback for unrecognized queries
    if (insights.length === 0) {
      insights.push({
        id: 'query-general',
        type: 'recommendation',
        title: 'Graph Analysis Results',
        description: `Based on your query "${query}", here's a general analysis of the network structure.`,
        confidence: 0.70,
        relevantNodes: nodes.slice(0, 5).map(n => n.id),
        actionableItems: [
          'Review network connectivity patterns',
          'Identify key relationship opportunities',
          'Consider network expansion strategies'
        ],
        createdAt: new Date()
      });
    }

    return insights;
  }

  // Future: Real Groq API integration
  static async callGroqAPI(prompt: string, context: any): Promise<any> {
    try {
      const response = await supabase.functions.invoke('groq-graph-analysis', {
        body: { prompt, context }
      });

      if (response.error) throw response.error;
      return response.data;
    } catch (error) {
      console.error('Groq API call failed:', error);
      throw error;
    }
  }
}