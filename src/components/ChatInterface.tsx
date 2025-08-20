import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Brain, 
  Zap, 
  Code2, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Music,
  Copy,
  Play
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  pqlQuery?: string;
  visualization?: 'graph' | 'chart' | 'table' | 'map';
  timestamp: Date;
}

const ecommercePrompts = [
  {
    icon: TrendingUp,
    text: "Which customers are most likely to churn in the next 30 days?",
    category: "Prediction"
  },
  {
    icon: ShoppingBag,
    text: "What products will trend next season based on current purchase patterns?",
    category: "Forecasting"
  },
  {
    icon: Users,
    text: "Show me the relationship network of our top-selling products",
    category: "Analysis"
  },
  {
    icon: Brain,
    text: "Which customer segments have the highest cross-sell potential?",
    category: "Insights"
  }
];

const artistPrompts = [
  {
    icon: Users,
    text: "Identify my top 100 superfans in California",
    category: "Superfans"
  },
  {
    icon: Music,
    text: "What cities should I prioritize for my next tour?",
    category: "Touring"
  },
  {
    icon: TrendingUp,
    text: "Show me fan overlap with similar artists",
    category: "Analysis"
  },
  {
    icon: Brain,
    text: "Which songs drive the most fan engagement?",
    category: "Insights"
  }
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: "Hello! I'm your AI analytics assistant. I can help you analyze your data using natural language queries. Try asking me about customer behavior, predictions, or trends!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { currentProject } = useAppStore();
  const { toast } = useToast();

  const prompts = currentProject?.type === 'fashion_ecommerce' ? ecommercePrompts : artistPrompts;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generatePQLQuery = (userInput: string): string => {
    const isEcommerce = currentProject?.type === 'fashion_ecommerce';
    
    if (userInput.toLowerCase().includes('churn')) {
      return `PREDICT customer.will_churn
FOR customer
WHERE customer.last_purchase_date < CURRENT_DATE - INTERVAL '30 days'
USING GRAPH CONTEXT (orders, products, reviews)`;
    }
    
    if (userInput.toLowerCase().includes('superfan')) {
      return `PREDICT fan.engagement_score
FOR fan
WHERE fan.location->>'state' = 'California'
USING TEMPORAL WINDOW 90d
WITH RELATIONSHIPS (concerts, merchandise, social_media)
ORDER BY engagement_score DESC
LIMIT 100`;
    }
    
    if (userInput.toLowerCase().includes('trend')) {
      return isEcommerce 
        ? `PREDICT product.trend_score
FOR product
USING TEMPORAL CONTEXT season_patterns
WITH GRAPH RELATIONSHIPS (customer_purchases, product_attributes)`
        : `PREDICT song.engagement_trend
FOR song
USING TEMPORAL WINDOW 30d
WITH RELATIONSHIPS (streams, social_mentions, playlist_adds)`;
    }
    
    return `-- Generated PQL Query
SELECT * FROM ${isEcommerce ? 'customers' : 'fans'}
WHERE created_at > CURRENT_DATE - INTERVAL '30 days'`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Generate PQL query
    const pqlQuery = generatePQLQuery(input);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed your query and generated a PQL (Predictive Query Language) query to get the insights you're looking for. This query will help identify patterns and predictions based on your data relationships.`,
        pqlQuery,
        visualization: 'chart',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
  };

  const copyPQLQuery = (query: string) => {
    navigator.clipboard.writeText(query);
    toast({
      title: "Copied!",
      description: "PQL query copied to clipboard",
    });
  };

  const executePQLQuery = (query: string) => {
    toast({
      title: "Executing Query",
      description: "Running PQL query against your data...",
    });
    // In a real app, this would execute the query
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                  <div className={`rounded-lg p-4 ${
                    message.role === 'user' 
                      ? 'chat-bubble-user' 
                      : message.role === 'system'
                      ? 'bg-muted/50'
                      : 'chat-bubble-assistant'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    
                    {message.pqlQuery && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4" />
                          <span className="text-xs font-medium">Generated PQL Query</span>
                        </div>
                        <GlassCard className="p-3">
                          <pre className="text-xs overflow-x-auto">
                            <code className="pql-code">{message.pqlQuery}</code>
                          </pre>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyPQLQuery(message.pqlQuery!)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => executePQLQuery(message.pqlQuery!)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Execute
                            </Button>
                          </div>
                        </GlassCard>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 px-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] mr-12">
                <GlassCard className="p-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">Analyzing your query...</span>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      <div className="p-4 border-t border-border/50">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Prompts
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {prompts.map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left h-auto p-3"
                onClick={() => handlePromptClick(prompt.text)}
              >
                <div className="flex items-start gap-2 w-full">
                  <prompt.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <Badge variant="secondary" className="text-xs mb-1">
                      {prompt.category}
                    </Badge>
                    <p className="text-xs">{prompt.text}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your data..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}