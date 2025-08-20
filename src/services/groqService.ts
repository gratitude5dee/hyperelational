import Groq from 'groq-sdk';

interface DataContext {
  tables: string[];
  schema: Record<string, string[]>;
  projectType: 'fashion_ecommerce' | 'creative_hub';
}

interface PQLResponse {
  query: string;
  explanation: string;
  expectedFormat: string;
  confidence: number;
  suggestions?: string[];
}

export class GroqChatService {
  private groq: Groq;
  private conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

  constructor() {
    // In a real app, this would come from environment variables via Supabase edge functions
    this.groq = new Groq({
      apiKey: 'gsk_demo_key', // This would be handled securely in production
      dangerouslyAllowBrowser: true, // Only for demo purposes
      baseURL: 'https://api.openai.com/v1', // Using OpenAI endpoint for gpt-oss
    });
  }

  async generatePQLQuery(userInput: string, context: DataContext): Promise<PQLResponse> {
    const systemPrompt = `You are an expert data analyst for Hyperelational AI platform.
    Convert natural language queries to PQL (Predictive Query Language).
    
    Project Type: ${context.projectType}
    Available tables: ${context.tables.join(', ')}
    Schema: ${JSON.stringify(context.schema)}
    
    Provide:
    1. Optimized PQL query
    2. Clear explanation of the logic
    3. Expected result format
    4. Confidence score (0-100)
    5. Alternative approaches if applicable
    
    Response format:
    QUERY: [PQL query here]
    EXPLANATION: [explanation here]
    FORMAT: [expected format]
    CONFIDENCE: [score]
    SUGGESTIONS: [optional alternatives]`;

    try {
      // For demo purposes, we'll use a mock response since we don't have a real API key
      return this.generateMockPQLResponse(userInput, context);
      
      // Real implementation would be:
      /*
      const response = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
          { role: 'user', content: userInput }
        ],
        model: 'gpt-oss',
        temperature: 0.3,
        max_tokens: 1024
      });

      return this.parsePQLResponse(response.choices[0].message.content || '');
      */
    } catch (error) {
      console.error('API error:', error);
      return this.generateMockPQLResponse(userInput, context);
    }
  }

  async generateDataNarrative(data: any[], query: string, context: DataContext): Promise<string> {
    const prompt = `Analyze this data and provide executive insights:
    
    Data Sample: ${JSON.stringify(data.slice(0, 50))}
    Original Query: ${query}
    Project Type: ${context.projectType}
    
    Provide:
    1. Top 3 key findings
    2. Unusual patterns or anomalies
    3. Actionable recommendations
    4. Strategic next steps
    
    Format as engaging narrative for business stakeholders.`;

    try {
      // Mock response for demo
      return this.generateMockNarrative(data, query, context);
    } catch (error) {
      console.error('Narrative generation error:', error);
      return this.generateMockNarrative(data, query, context);
    }
  }

  async streamResponse(userInput: string, context: DataContext, onToken: (token: string) => void): Promise<void> {
    // Simulate streaming response
    const response = await this.generatePQLQuery(userInput, context);
    const fullResponse = `${response.explanation}\n\nGenerated PQL Query:\n\n\`\`\`sql\n${response.query}\n\`\`\`\n\nConfidence: ${response.confidence}%\n\n*hyperelational powered by kumoRFM*`;
    
    // Simulate token streaming
    const tokens = fullResponse.split(' ');
    for (let i = 0; i < tokens.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      onToken(tokens[i] + ' ');
    }
  }

  private generateMockPQLResponse(userInput: string, context: DataContext): PQLResponse {
    const isEcommerce = context.projectType === 'fashion_ecommerce';
    
    if (userInput.toLowerCase().includes('churn')) {
      return {
        query: `PREDICT customer.churn_probability
FOR customer
WHERE customer.last_purchase_date < CURRENT_DATE - INTERVAL '30 days'
AND customer.lifetime_value > 100
USING GRAPH CONTEXT (orders, products, reviews, support_tickets)
WITH TEMPORAL WINDOW 90d
ORDER BY churn_probability DESC
LIMIT 500`,
        explanation: "This query identifies customers at high risk of churning by analyzing purchase patterns, engagement metrics, and support interactions. The graph context includes order history, product preferences, review sentiment, and support ticket frequency to create a comprehensive churn probability score.",
        expectedFormat: "Table with customer_id, churn_probability, last_purchase_date, and key risk factors",
        confidence: 87,
        suggestions: ["Add demographic filters", "Include email engagement metrics", "Consider seasonal patterns"]
      };
    }
    
    if (userInput.toLowerCase().includes('superfan') || userInput.toLowerCase().includes('top fan')) {
      return {
        query: `PREDICT fan.engagement_score
FOR fan
WHERE fan.location->>'state' = 'California'
USING TEMPORAL WINDOW 90d
WITH RELATIONSHIPS (concerts, merchandise, social_media, streaming)
AND GRAPH CONTEXT (artist_interactions, fan_network, purchase_history)
ORDER BY engagement_score DESC
LIMIT 100`,
        explanation: "This query identifies superfans in California by analyzing multi-dimensional engagement including concert attendance, merchandise purchases, social media interactions, and streaming behavior. The graph context reveals fan network effects and cross-platform engagement patterns.",
        expectedFormat: "Ranked list of fans with engagement scores, interaction types, and influence metrics",
        confidence: 92,
        suggestions: ["Expand to other states", "Add demographic segmentation", "Include playlist creation activity"]
      };
    }
    
    if (userInput.toLowerCase().includes('trend')) {
      const query = isEcommerce 
        ? `PREDICT product.trend_score
FOR product
USING TEMPORAL PATTERNS seasonal_analysis
WITH GRAPH RELATIONSHIPS (customer_segments, competitor_products, social_signals)
AND EXTERNAL CONTEXT (fashion_weeks, social_trends, weather_patterns)
WHERE product.category IN ('apparel', 'accessories')
ORDER BY trend_score DESC`
        : `PREDICT song.viral_potential
FOR song
USING TEMPORAL WINDOW 14d
WITH RELATIONSHIPS (streaming_velocity, social_mentions, playlist_adds, radio_play)
AND GRAPH CONTEXT (genre_trends, artist_network, influencer_coverage)
ORDER BY viral_potential DESC`;
      
      return {
        query,
        explanation: isEcommerce 
          ? "This query predicts product trends by analyzing seasonal patterns, competitor movements, social media signals, and external fashion industry events. It identifies products likely to trend in upcoming seasons."
          : "This query predicts which songs have viral potential by analyzing early streaming velocity, social media buzz, playlist additions, and influencer coverage patterns.",
        expectedFormat: isEcommerce 
          ? "Products ranked by trend potential with seasonal timing and market factors"
          : "Songs ranked by viral potential with velocity metrics and social signals",
        confidence: 79,
        suggestions: isEcommerce 
          ? ["Add price elasticity analysis", "Include inventory levels", "Consider regional preferences"]
          : ["Add TikTok trend analysis", "Include artist collaboration networks", "Consider genre crossover potential"]
      };
    }
    
    // Default query
    return {
      query: `SELECT *
FROM ${isEcommerce ? 'customers' : 'fans'}
WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
AND status = 'active'
ORDER BY ${isEcommerce ? 'lifetime_value' : 'engagement_score'} DESC
LIMIT 100`,
      explanation: `This query retrieves the most valuable ${isEcommerce ? 'customers' : 'fans'} from the last 30 days, ordered by their ${isEcommerce ? 'lifetime value' : 'engagement score'}.`,
      expectedFormat: `List of ${isEcommerce ? 'customers' : 'fans'} with key metrics and contact information`,
      confidence: 95,
      suggestions: ["Add demographic filters", "Include geographic segmentation", "Consider engagement recency"]
    };
  }

  private generateMockNarrative(data: any[], query: string, context: DataContext): string {
    const isEcommerce = context.projectType === 'fashion_ecommerce';
    
    return `## Key Insights Analysis

### 🎯 Top Findings
1. **Engagement Peak Detected**: ${isEcommerce ? 'Customer' : 'Fan'} activity shows a 23% increase during weekend periods, suggesting optimal timing for campaigns.

2. **Geographic Concentration**: 67% of high-value ${isEcommerce ? 'customers' : 'fans'} are concentrated in urban areas, with California and New York leading engagement metrics.

3. **Behavioral Pattern**: ${isEcommerce ? 'Purchase frequency correlates strongly with email engagement (0.84 correlation)' : 'Streaming patterns predict concert attendance with 89% accuracy'}.

### 🚨 Anomalies Detected
- Unusual spike in ${isEcommerce ? 'return rates' : 'playlist removals'} for the 25-34 age segment
- ${isEcommerce ? 'Abandoned cart recovery' : 'Social sharing'} rates dropped 15% in the last two weeks

### 📋 Actionable Recommendations
1. **Immediate Action**: Launch targeted weekend campaigns to capitalize on peak engagement periods
2. **Strategic Focus**: Expand marketing efforts in identified high-performing geographic regions  
3. **Optimization**: ${isEcommerce ? 'Improve email-to-purchase conversion funnel' : 'Leverage streaming data for tour planning'}

### 🔍 Next Analysis Steps
- Investigate age segment anomaly with demographic deep-dive
- A/B test timing optimization strategies
- Analyze competitive landscape impact on recent metric changes

*Analysis hyperelational powered by kumoRFM with 87% confidence score*`;
  }

  updateConversationHistory(role: 'user' | 'assistant', content: string) {
    this.conversationHistory.push({ role, content });
    // Keep only last 20 messages to manage context window
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }
}

export const groqService = new GroqChatService();
