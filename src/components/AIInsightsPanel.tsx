import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Search,
  Lightbulb,
  Zap,
  Network,
  Users
} from 'lucide-react';
import { GraphAIService, AIInsight, PatternAnalysis } from '@/services/GraphAIService';
import { GraphNode3D, GraphEdge3D } from '@/services/GraphDataService';

interface AIInsightsPanelProps {
  nodes: GraphNode3D[];
  edges: GraphEdge3D[];
  selectedNode: string | null;
  projectType: string;
}

export function AIInsightsPanel({ 
  nodes, 
  edges, 
  selectedNode, 
  projectType 
}: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [patterns, setPatterns] = useState<PatternAnalysis[]>([]);
  const [queryInput, setQueryInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  // Auto-analyze graph when data changes
  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      analyzeGraph();
    }
  }, [nodes, edges]);

  const analyzeGraph = async () => {
    setIsAnalyzing(true);
    try {
      const [aiInsights, patternAnalysis] = await Promise.all([
        GraphAIService.generateInsights(nodes, edges, projectType),
        GraphAIService.detectPatterns(nodes, edges, projectType)
      ]);
      
      setInsights(aiInsights);
      setPatterns(patternAnalysis);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNaturalLanguageQuery = async () => {
    if (!queryInput.trim()) return;
    
    setIsQuerying(true);
    try {
      const queryInsights = await GraphAIService.processNaturalLanguageQuery(
        queryInput, 
        nodes, 
        edges, 
        projectType
      );
      
      // Add query insights to the top of the list
      setInsights(prev => [...queryInsights, ...prev]);
      setQueryInput('');
    } catch (error) {
      console.error('Query processing failed:', error);
    } finally {
      setIsQuerying(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'opportunity': return <Target className="h-4 w-4 text-success" />;
      case 'pattern': return <Network className="h-4 w-4 text-primary" />;
      case 'prediction': return <TrendingUp className="h-4 w-4 text-secondary" />;
      default: return <Lightbulb className="h-4 w-4 text-accent" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-4">
      {/* Natural Language Query */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Ask AI</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about the graph... e.g., 'Show me high-value customers at risk'"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNaturalLanguageQuery()}
                className="flex-1"
              />
              <Button 
                onClick={handleNaturalLanguageQuery}
                disabled={isQuerying || !queryInput.trim()}
                size="sm"
              >
                {isQuerying ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {[
                'Find influential nodes',
                'Detect anomalies',
                'Show customer segments',
                'Predict churn risk'
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setQueryInput(suggestion)}
                  className="text-xs h-6 px-2"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold">AI Insights</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeGraph}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="h-4 w-4" />
                </motion.div>
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
            {insights.length === 0 && !isAnalyzing ? (
              <div className="text-center text-muted-foreground py-6">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click refresh to generate AI insights</p>
              </div>
            ) : (
              insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getConfidenceColor(insight.confidence)}`}
                        >
                          {Math.round(insight.confidence * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                      
                      {insight.actionableItems.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            Recommendations:
                          </div>
                          <ul className="text-xs space-y-1">
                            {insight.actionableItems.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Pattern Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Network className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Pattern Analysis</h3>
          </div>
          
          <div className="space-y-3">
            {patterns.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                <Network className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No patterns detected yet</p>
              </div>
            ) : (
              patterns.map((pattern, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-2 rounded-lg bg-muted/20"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{pattern.patternType}</span>
                    <Badge variant="secondary" className="text-xs">
                      {pattern.nodes.length} nodes
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pattern.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      Strength: {Math.round(pattern.strength * 100)}%
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getConfidenceColor(pattern.confidence)}`}
                    >
                      {Math.round(pattern.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Selected Node Analysis */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Node Analysis</h3>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Analyzing selected node...</span>
              </div>
              
              {/* This would show AI analysis of the selected node */}
              <div className="p-2 rounded-lg bg-muted/20">
                <div className="text-xs text-muted-foreground">
                  AI-powered analysis of node relationships, importance, and recommendations will appear here.
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}