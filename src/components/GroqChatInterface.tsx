import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Play,
  Mic,
  MicOff,
  Star,
  Download,
  Share,
  MessageSquare,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { groqService } from '@/services/groqService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  pqlQuery?: string;
  visualization?: 'graph' | 'chart' | 'table' | 'map';
  timestamp: Date;
  confidence?: number;
  streaming?: boolean;
  narrative?: string;
  suggestions?: string[];
}

interface SmartSuggestion {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  confidence: number;
}

const enhancedEcommercePrompts = [
  {
    icon: TrendingUp,
    text: "Which premium customers are showing early churn signals this month?",
    category: "Churn Prevention",
    confidence: 92
  },
  {
    icon: ShoppingBag,
    text: "Predict which product categories will surge during Black Friday based on pre-order patterns",
    category: "Demand Forecasting",
    confidence: 87
  },
  {
    icon: Users,
    text: "Identify high-value customer segments most likely to respond to personalized email campaigns",
    category: "Segmentation",
    confidence: 89
  },
  {
    icon: Brain,
    text: "Show me the relationship network between customers, products, and seasonal buying patterns",
    category: "Network Analysis",
    confidence: 84
  }
];

const enhancedArtistPrompts = [
  {
    icon: Users,
    text: "Find superfans in New York who attend multiple concerts and have high social influence",
    category: "Superfan Analysis",
    confidence: 91
  },
  {
    icon: Music,
    text: "Which cities show the strongest streaming growth for my latest album release?",
    category: "Market Analysis",
    confidence: 88
  },
  {
    icon: TrendingUp,
    text: "Predict optimal tour dates based on fan density, venue availability, and seasonal patterns",
    category: "Tour Planning",
    confidence: 85
  },
  {
    icon: Brain,
    text: "Analyze cross-platform engagement to identify fans most likely to purchase VIP packages",
    category: "Revenue Optimization",
    confidence: 86
  }
];

export function GroqChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: "🚀 **Enhanced AI Assistant Activated**\n\nI'm powered by advanced LLMs with exceptional reasoning capabilities. I can:\n\n✨ **Generate optimized PQL queries** with confidence scoring\n📊 **Create data narratives** that tell compelling business stories\n🎯 **Provide actionable insights** with next-step recommendations\n🔄 **Stream responses** in real-time for immediate feedback\n\nTry asking me complex questions about your data relationships!\n\n*hyperelational powered by kumoRFM*",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { currentProject, industryMode } = useAppStore();
  const { toast } = useToast();

  const prompts = industryMode === 'fashion' ? enhancedEcommercePrompts : enhancedArtistPrompts;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, streamingResponse]);

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

    // Add streaming message placeholder
    const streamingId = (Date.now() + 1).toString();
    const streamingMessage: ChatMessage = {
      id: streamingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      streaming: true
    };
    setMessages(prev => [...prev, streamingMessage]);

    try {
      const projectType: 'fashion_ecommerce' | 'creative_hub' = industryMode === 'fashion' ? 'fashion_ecommerce' : 'creative_hub';
      
      const context = {
        tables: industryMode === 'fashion' 
          ? ['customers', 'orders', 'products', 'reviews', 'inventory']
          : ['fans', 'concerts', 'songs', 'merchandise', 'social_media'],
        schema: industryMode === 'fashion'
          ? {
              customers: ['id', 'email', 'lifetime_value', 'last_purchase_date', 'segment'],
              orders: ['id', 'customer_id', 'product_id', 'amount', 'date'],
              products: ['id', 'name', 'category', 'price', 'inventory_level']
            }
          : {
              fans: ['id', 'email', 'engagement_score', 'location', 'social_influence'],
              concerts: ['id', 'venue', 'date', 'attendance', 'revenue'],
              songs: ['id', 'title', 'streams', 'social_mentions', 'chart_position']
            },
        projectType
      };

      // Simulate streaming response
      let accumulatedResponse = '';
      await groqService.streamResponse(input, context, (token) => {
        accumulatedResponse += token;
        setStreamingResponse(accumulatedResponse);
      });

      // Generate PQL query and narrative
      const pqlResponse = await groqService.generatePQLQuery(input, context);
      const narrative = await groqService.generateDataNarrative([], input, context);

      // Update the streaming message with final content
      setMessages(prev => prev.map(msg => 
        msg.id === streamingId 
          ? {
              ...msg,
              content: accumulatedResponse,
              pqlQuery: pqlResponse.query,
              confidence: pqlResponse.confidence,
              narrative: narrative,
              suggestions: pqlResponse.suggestions,
              streaming: false
            }
          : msg
      ));

      // Update conversation history
      groqService.updateConversationHistory('user', input);
      groqService.updateConversationHistory('assistant', accumulatedResponse);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
      
      // Remove streaming message on error
      setMessages(prev => prev.filter(msg => msg.id !== streamingId));
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => {
      toast({
        title: "Error",
        description: "Voice recognition failed. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handlePromptClick = (prompt: SmartSuggestion) => {
    setInput(prompt.text);
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
  };

  const shareChat = (messageId: string) => {
    const shareUrl = `${window.location.origin}/chat/shared/${messageId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Shareable chat link copied to clipboard",
    });
  };

  const downloadResponse = (message: ChatMessage) => {
    const content = `
# AI Analysis Report
**Generated**: ${message.timestamp.toLocaleString()}
**Confidence**: ${message.confidence}%

## Query
${message.content}

## Generated PQL
\`\`\`sql
${message.pqlQuery}
\`\`\`

## Analysis
${message.narrative}

## Suggestions
${message.suggestions?.map(s => `- ${s}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${message.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">
                {industryMode === 'fashion' ? 'Fashion AI Assistant' : 'Artist AI Assistant'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {industryMode === 'fashion' 
                  ? 'Trend forecasting & customer insights' 
                  : 'Superfan analytics & tour optimization'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Enhanced
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Volume2 className="h-3 w-3" />
              Voice Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                  <div className={`rounded-xl p-4 ${
                    message.role === 'user' 
                      ? 'chat-bubble-user' 
                      : message.role === 'system'
                      ? 'bg-muted/50 border-primary/20 border'
                      : 'chat-bubble-assistant'
                  }`}>
                    {/* Message Content */}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap">
                        {message.content || (message.streaming ? streamingResponse : '')}
                        {message.streaming && (
                          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                        )}
                      </div>
                    </div>
                    
                    {/* Confidence Score */}
                    {message.confidence && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">AI Confidence:</span>
                        <Progress value={message.confidence} className="flex-1 h-2" />
                        <span className="text-xs font-medium">{message.confidence}%</span>
                      </div>
                    )}
                    
                    {/* PQL Query */}
                    {message.pqlQuery && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Generated PQL Query</span>
                        </div>
                        <GlassCard className="p-4">
                          <pre className="text-sm overflow-x-auto mb-3">
                            <code className="pql-code">{message.pqlQuery}</code>
                          </pre>
                          <div className="flex items-center gap-2">
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

                    {/* Data Narrative */}
                    {message.narrative && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="h-4 w-4" />
                          <span className="text-sm font-medium">AI Analysis</span>
                        </div>
                        <GlassCard className="p-4">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-sm">
                              {message.narrative}
                            </div>
                          </div>
                        </GlassCard>
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-medium">Suggestions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="cursor-pointer hover:bg-primary/10"
                              onClick={() => setInput(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {message.role === 'assistant' && !message.streaming && (
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => shareChat(message.id)}
                        >
                          <Share className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadResponse(message)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2 px-2 flex items-center justify-between">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === 'assistant' && (
                      <Badge variant="outline" className="text-xs">
                        hyperelational
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && !streamingResponse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-[85%] mr-12">
                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Brain className="h-5 w-5 animate-pulse text-primary" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">AI is thinking...</span>
                      <div className="text-xs text-muted-foreground">Analyzing patterns & relationships</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Quick Prompts */}
      <div className="p-4 border-t border-border/50">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {industryMode === 'fashion' ? 'Fashion Intelligence Prompts' : 'Artist Management Prompts'}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {prompts.map((prompt, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePromptClick(prompt)}
                className="text-left p-3 rounded-lg glass border border-white/10 
                          hover:border-primary/30 transition-all duration-200 group"
                style={{
                  background: industryMode === 'fashion' 
                    ? 'var(--fashion-card-bg)' 
                    : 'var(--artist-card-bg)'
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center 
                                  bg-gradient-to-r from-primary/20 to-accent/20 
                                  group-hover:from-primary/30 group-hover:to-accent/30 
                                  transition-all duration-200">
                    <prompt.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">{prompt.text}</div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs px-2 py-0.5"
                        style={{
                          borderColor: industryMode === 'fashion' ? '#ff6ab5' : '#8b5cf6',
                          color: industryMode === 'fashion' ? '#ff6ab5' : '#8b5cf6'
                        }}
                      >
                        {prompt.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        {prompt.confidence}% confidence
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Enhanced Input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask me anything about your data relationships..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={isListening ? 'bg-destructive/10 border-destructive' : ''}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-destructive" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              className="gradient-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <Badge variant="outline" className="text-xs">
                gpt-oss
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}