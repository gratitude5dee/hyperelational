import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Target, ShoppingBag, Camera, Package, TrendingUp, Users,
  Music, Calendar, MapPin, Heart, Star, Zap, Play, Pause, Settings,
  ChevronRight, Bot, Cpu, Activity, Shield, AlertCircle, CheckCircle,
  Palette, Shirt, DollarSign, Recycle, MessageSquare, Search, Globe,
  Mic, Radio, Share2, Award, BarChart3, Clock, Eye, Send, Loader2,
  Network, Building, Code, Database, Workflow, GitBranch, LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AgentConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  status: string;
  description: string;
  capabilities: string[];
  metrics: Record<string, any>;
  cognitive_functions: Record<string, string>;
  color: string;
  edgeFunction: string;
}

const AgentWorkflows = () => {
  const [selectedDomain, setSelectedDomain] = useState('fashion');
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [agentStates, setAgentStates] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [agentMetrics, setAgentMetrics] = useState({});
  const { currentProject, industryMode } = useAppStore();
  const { toast } = useToast();

  // Fashion Retail Agents
  const fashionAgents = [
    {
      id: 'ad-campaign',
      name: 'Ad Campaign Agent',
      icon: Target,
      status: 'active',
      description: 'Autonomous campaign creation, optimization, and ROI prediction',
      capabilities: [
        'Multi-channel campaign orchestration',
        'Dynamic creative optimization (DCO)',
        'Audience segment targeting',
        'Budget allocation AI',
        'Performance prediction'
      ],
      metrics: {
        campaigns_optimized: 247,
        avg_roas: '4.2x',
        cost_reduction: '32%'
      },
      cognitive_functions: {
        perception: 'Computer vision for ad creative analysis',
        reasoning: 'Causal inference for attribution modeling',
        learning: 'Reinforcement learning for bid optimization',
        memory: 'Historical campaign performance database'
      },
      color: 'from-purple-500 to-pink-500',
      edgeFunction: 'ad-campaign-optimizer'
    },
    {
      id: 'virtual-tryon',
      name: 'Virtual Try-On Agent',
      icon: Camera,
      status: 'active',
      description: 'AR-powered virtual fitting room with body type recommendations',
      capabilities: [
        'Real-time AR clothing overlay',
        'Size recommendation ML',
        'Body measurement estimation',
        'Fabric drape simulation',
        'Outfit combination suggestions'
      ],
      metrics: {
        try_ons_processed: '1.2M',
        conversion_lift: '+67%',
        return_reduction: '41%'
      },
      cognitive_functions: {
        perception: '3D body scanning and pose estimation',
        reasoning: 'Fit prediction algorithms',
        learning: 'User preference adaptation',
        memory: 'Personal style history'
      },
      color: 'from-blue-500 to-cyan-500',
      edgeFunction: 'virtual-tryon-processor'
    },
    {
      id: 'inventory-optimizer',
      name: 'Inventory Optimization Agent',
      icon: Package,
      status: 'active',
      description: 'Predictive stock management and automated reordering',
      capabilities: [
        'Demand forecasting',
        'Automatic reorder points',
        'Dead stock identification',
        'Seasonal trend adjustment',
        'Supply chain optimization'
      ],
      metrics: {
        stockout_prevention: '94%',
        overstock_reduction: '38%',
        inventory_turnover: '8.3x'
      },
      cognitive_functions: {
        perception: 'Multi-source data ingestion',
        reasoning: 'Time-series forecasting',
        learning: 'Pattern recognition',
        memory: 'Historical inventory patterns'
      },
      color: 'from-green-500 to-emerald-500',
      edgeFunction: 'inventory-optimizer'
    },
    {
      id: 'trend-predictor',
      name: 'Trend Prediction Agent',
      icon: TrendingUp,
      status: 'active',
      description: 'Social media and runway analysis for trend forecasting',
      capabilities: [
        'Social media trend scanning',
        'Runway analysis CV',
        'Micro-trend detection',
        'Color trend forecasting',
        'Style evolution tracking'
      ],
      metrics: {
        accuracy_rate: '89%',
        trends_identified: 342,
        lead_time: '3-6 months'
      },
      cognitive_functions: {
        perception: 'Image and video analysis',
        reasoning: 'Trend correlation engine',
        learning: 'Cultural context understanding',
        memory: 'Fashion history database'
      },
      color: 'from-orange-500 to-red-500',
      edgeFunction: 'trend-predictor'
    },
    {
      id: 'customer-service',
      name: 'Customer Service Agent',
      icon: MessageSquare,
      status: 'active',
      description: 'Omnichannel support with emotional intelligence',
      capabilities: [
        'Natural language understanding',
        'Sentiment analysis',
        'Order tracking integration',
        'Return processing',
        'Personalized recommendations'
      ],
      metrics: {
        resolution_rate: '92%',
        response_time: '< 30s',
        satisfaction_score: '4.7/5'
      },
      cognitive_functions: {
        perception: 'Multi-modal input processing',
        reasoning: 'Context-aware responses',
        learning: 'Conversation improvement',
        memory: 'Customer interaction history'
      },
      color: 'from-indigo-500 to-purple-500',
      edgeFunction: 'customer-service-ai'
    },
    {
      id: 'pricing-strategy',
      name: 'Dynamic Pricing Agent',
      icon: DollarSign,
      status: 'beta',
      description: 'Real-time price optimization based on demand and competition',
      capabilities: [
        'Competitor price monitoring',
        'Demand elasticity modeling',
        'Markdown optimization',
        'Bundle pricing strategies',
        'Psychological pricing'
      ],
      metrics: {
        revenue_increase: '+18%',
        margin_improvement: '+12%',
        price_updates: '10K/day'
      },
      cognitive_functions: {
        perception: 'Market signal detection',
        reasoning: 'Game theory optimization',
        learning: 'Price sensitivity learning',
        memory: 'Pricing history and outcomes'
      },
      color: 'from-yellow-500 to-amber-500',
      edgeFunction: 'dynamic-pricing'
    },
    {
      id: 'sustainability',
      name: 'Sustainability Agent',
      icon: Recycle,
      status: 'beta',
      description: 'Carbon footprint tracking and sustainable sourcing recommendations',
      capabilities: [
        'Supply chain carbon tracking',
        'Sustainable material sourcing',
        'Circular economy optimization',
        'Waste reduction strategies',
        'Sustainability reporting'
      ],
      metrics: {
        carbon_reduced: '42 tons',
        waste_diverted: '78%',
        sustainable_products: '234'
      },
      cognitive_functions: {
        perception: 'Environmental impact scanning',
        reasoning: 'Life cycle assessment',
        learning: 'Sustainability best practices',
        memory: 'Environmental metrics tracking'
      },
      color: 'from-green-600 to-teal-600',
      edgeFunction: 'sustainability-tracker'
    }
  ];

  // Music/Touring Agents
  const musicAgents = [
    {
      id: 'tour-planner',
      name: 'Tour Planning Agent',
      icon: MapPin,
      status: 'active',
      description: 'Optimal routing, venue selection, and revenue maximization',
      capabilities: [
        'Fan density heat mapping',
        'Venue availability matching',
        'Route optimization',
        'Dynamic pricing strategies',
        'Weather risk assessment'
      ],
      metrics: {
        tours_optimized: 89,
        revenue_increase: '+34%',
        sellout_rate: '87%'
      },
      cognitive_functions: {
        perception: 'Geospatial data analysis',
        reasoning: 'Multi-objective optimization',
        learning: 'Historical tour performance',
        memory: 'Venue and market database'
      },
      color: 'from-blue-500 to-indigo-500',
      edgeFunction: 'tour-planner'
    },
    {
      id: 'fan-engagement',
      name: 'Fan Engagement Agent',
      icon: Heart,
      status: 'active',
      description: 'Personalized fan experiences and superfan identification',
      capabilities: [
        'Superfan identification',
        'Personalized content delivery',
        'Engagement scoring',
        'Community building',
        'Loyalty program automation'
      ],
      metrics: {
        superfans_identified: '12.5K',
        engagement_rate: '8.2%',
        ltv_increase: '+45%'
      },
      cognitive_functions: {
        perception: 'Multi-platform behavior tracking',
        reasoning: 'Fan journey mapping',
        learning: 'Preference evolution',
        memory: 'Fan interaction history'
      },
      color: 'from-red-500 to-pink-500',
      edgeFunction: 'fan-engagement'
    },
    {
      id: 'setlist-optimizer',
      name: 'Setlist Optimization Agent',
      icon: Music,
      status: 'active',
      description: 'Data-driven setlist creation for maximum crowd energy',
      capabilities: [
        'Energy flow optimization',
        'Regional preference analysis',
        'Streaming data integration',
        'Crowd response prediction',
        'Special moment planning'
      ],
      metrics: {
        shows_optimized: 156,
        crowd_satisfaction: '94%',
        encore_rate: '78%'
      },
      cognitive_functions: {
        perception: 'Audio and crowd analysis',
        reasoning: 'Emotional arc design',
        learning: 'Performance feedback loop',
        memory: 'Historical setlist database'
      },
      color: 'from-purple-500 to-violet-500',
      edgeFunction: 'setlist-optimizer'
    },
    {
      id: 'merch-designer',
      name: 'Merch Design Agent',
      icon: Shirt,
      status: 'beta',
      description: 'AI-generated designs based on fan preferences and trends',
      capabilities: [
        'Generative design creation',
        'Fan preference analysis',
        'Trend incorporation',
        'Print optimization',
        'Limited edition planning'
      ],
      metrics: {
        designs_generated: 423,
        sellthrough_rate: '72%',
        design_time_saved: '85%'
      },
      cognitive_functions: {
        perception: 'Visual trend analysis',
        reasoning: 'Design principle application',
        learning: 'Sales pattern recognition',
        memory: 'Design performance history'
      },
      color: 'from-cyan-500 to-teal-500',
      edgeFunction: 'merch-designer'
    },
    {
      id: 'social-media',
      name: 'Social Media Agent',
      icon: Share2,
      status: 'active',
      description: 'Cross-platform content optimization and posting automation',
      capabilities: [
        'Content calendar automation',
        'Platform-specific optimization',
        'Viral moment detection',
        'Hashtag optimization',
        'Response automation'
      ],
      metrics: {
        posts_optimized: '3.2K',
        reach_increase: '+127%',
        viral_moments: 23
      },
      cognitive_functions: {
        perception: 'Trend and sentiment monitoring',
        reasoning: 'Content strategy optimization',
        learning: 'Engagement pattern learning',
        memory: 'Content performance database'
      },
      color: 'from-green-500 to-lime-500',
      edgeFunction: 'social-media-optimizer'
    },
    {
      id: 'venue-negotiator',
      name: 'Venue Negotiation Agent',
      icon: Building,
      status: 'beta',
      description: 'Automated venue booking and contract negotiation',
      capabilities: [
        'Market rate analysis',
        'Contract term optimization',
        'Rider requirement matching',
        'Risk assessment',
        'Alternative venue sourcing'
      ],
      metrics: {
        deals_negotiated: 67,
        cost_savings: '22%',
        booking_speed: '3x faster'
      },
      cognitive_functions: {
        perception: 'Market condition monitoring',
        reasoning: 'Negotiation strategy',
        learning: 'Deal outcome patterns',
        memory: 'Venue relationship history'
      },
      color: 'from-amber-500 to-orange-500',
      edgeFunction: 'venue-negotiator'
    },
    {
      id: 'revenue-optimizer',
      name: 'Revenue Optimization Agent',
      icon: DollarSign,
      status: 'active',
      description: 'Multi-stream revenue maximization and opportunity identification',
      capabilities: [
        'Revenue stream analysis',
        'Opportunity identification',
        'Pricing optimization',
        'Bundle strategy',
        'Royalty tracking'
      ],
      metrics: {
        revenue_increase: '+41%',
        streams_optimized: 12,
        opportunities_found: 89
      },
      cognitive_functions: {
        perception: 'Financial data aggregation',
        reasoning: 'Revenue optimization models',
        learning: 'Market response patterns',
        memory: 'Financial performance history'
      },
      color: 'from-yellow-500 to-green-500',
      edgeFunction: 'revenue-optimizer'
    }
  ];

  const agents = selectedDomain === 'fashion' ? fashionAgents : musicAgents;

  // Load workflows and agent states on component mount
  useEffect(() => {
    initializeAgents();
    loadWorkflows();
  }, [selectedDomain, currentProject]);

  const initializeAgents = () => {
    const states = {};
    agents.forEach(agent => {
      states[agent.id] = {
        status: 'initializing',
        progress: 0
      };
    });
    setAgentStates(states);

    // Simulate progressive initialization
    agents.forEach((agent, index) => {
      setTimeout(() => {
        setAgentStates(prev => ({
          ...prev,
          [agent.id]: {
            status: 'ready',
            progress: 100
          }
        }));
      }, (index + 1) * 300);
    });
  };

  const loadWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_automations')
        .select('*')
        .eq('project_id', currentProject?.id);

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  };

  const deployAgent = async (agent) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('agent-workflow-executor', {
        body: {
          agentId: agent.id,
          action: 'deploy',
          projectId: currentProject?.id,
          config: agent
        }
      });

      if (error) throw error;

      toast({
        title: "Agent Deployed",
        description: `${agent.name} has been successfully deployed and is now active.`,
      });

      // Update agent state
      setAgentStates(prev => ({
        ...prev,
        [agent.id]: {
          status: 'active',
          progress: 100
        }
      }));

    } catch (error) {
      console.error('Error deploying agent:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const createWorkflow = async (workflowConfig) => {
    try {
      const { data, error } = await supabase
        .from('workflow_automations')
        .insert({
          name: workflowConfig.name,
          project_id: currentProject?.id,
          trigger_type: workflowConfig.trigger_type,
          trigger_config: workflowConfig.trigger_config,
          actions: workflowConfig.actions,
          enabled: true
        })
        .select()
        .single();

      if (error) throw error;

      setWorkflows(prev => [...prev, data]);
      toast({
        title: "Workflow Created",
        description: `${workflowConfig.name} workflow has been created successfully.`,
      });

    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Agent Card Component
  const AgentCard = ({ agent }: { agent: AgentConfig }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const agentState = agentStates[agent.id] || { status: 'initializing', progress: 0 };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`relative bg-gradient-to-br ${agent.color} p-[1px] rounded-xl 
          hover:shadow-2xl transition-all duration-300 cursor-pointer glass-morph
          ${selectedAgent?.id === agent.id ? 'ring-2 ring-white/50 scale-[1.02]' : ''}`}
        onClick={() => setSelectedAgent(agent)}
      >
        <div className="bg-background/95 backdrop-blur-xl rounded-xl p-6 h-full">
          {/* Status Indicator */}
          <div className="absolute top-4 right-4">
            {agentState.status === 'ready' || agentState.status === 'active' ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">Active</span>
              </div>
            ) : agent.status === 'beta' ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-xs text-yellow-400">Beta</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                <span className="text-xs text-blue-400">Loading</span>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 bg-gradient-to-br ${agent.color} rounded-lg shadow-lg`}>
              <agent.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{agent.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(agent.metrics).slice(0, 3).map(([key, value]) => (
              <div key={key} className="bg-muted/50 rounded-lg p-2">
                <div className="text-xs text-muted-foreground mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="text-sm font-semibold text-foreground">{value}</div>
              </div>
            ))}
          </div>

          {/* Capabilities Preview */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Core Capabilities</div>
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.slice(0, 3).map((cap, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {cap}
                </Badge>
              ))}
              {agent.capabilities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{agent.capabilities.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {agentState.status === 'initializing' && (
            <div className="mt-4">
              <Progress value={agentState.progress} className="h-1" />
            </div>
          )}

          {/* Deploy Button */}
          <div className="mt-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                deployAgent(agent);
              }}
              disabled={isProcessing || agentState.status === 'initializing'}
              className={`w-full bg-gradient-to-r ${agent.color} hover:shadow-lg transition-all duration-300`}
              size="sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : agentState.status === 'active' ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Active
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-2" />
                  Deploy
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Agent Detail Panel
  const AgentDetailPanel = ({ agent }: { agent: AgentConfig | null }) => {
    if (!agent) return null;

    return (
      <Card className="glass-morph border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-br ${agent.color} rounded-lg shadow-lg`}>
                <agent.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </div>
            </div>
            <Button 
              className={`px-6 py-3 bg-gradient-to-r ${agent.color} hover:shadow-lg transition-all duration-300`}
              onClick={() => deployAgent(agent)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Deploy Agent
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cognitive Functions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Cognitive Architecture
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(agent.cognitive_functions).map(([func, desc]) => (
                <div key={func} className="bg-muted/50 border rounded-lg p-3">
                  <div className="text-sm font-medium capitalize mb-1">
                    {func}
                  </div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Capabilities */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Full Capabilities
            </h3>
            <div className="space-y-2">
              {agent.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(agent.metrics).map(([key, value]) => (
                <div key={key} className="bg-muted/50 border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-lg font-bold">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline" className="flex-1">
              <Activity className="h-4 w-4 mr-2" />
              View Logs
            </Button>
            <Button variant="outline" className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Workflow Orchestration Panel
  const WorkflowPanel = () => {
    const [selectedWorkflow, setSelectedWorkflow] = useState('');
    
    const predefinedWorkflows = {
      'campaign-launch': {
        name: 'Campaign Launch Workflow',
        description: 'Coordinated multi-channel campaign execution',
        agents: selectedDomain === 'fashion' 
          ? ['ad-campaign', 'customer-service', 'trend-predictor']
          : ['fan-engagement', 'social-media', 'tour-planner']
      },
      'optimization-cycle': {
        name: 'Performance Optimization Cycle',
        description: 'Continuous optimization of key metrics',
        agents: selectedDomain === 'fashion'
          ? ['inventory-optimizer', 'pricing-strategy', 'sustainability']
          : ['setlist-optimizer', 'revenue-optimizer', 'venue-negotiator']
      }
    };

    const executeWorkflow = async (workflowKey) => {
      const workflow = predefinedWorkflows[workflowKey];
      if (!workflow) return;

      try {
        const { data, error } = await supabase.functions.invoke('agent-workflow-executor', {
          body: {
            action: 'execute_workflow',
            workflow: workflow,
            projectId: currentProject?.id,
            agents: workflow.agents
          }
        });

        if (error) throw error;

        toast({
          title: "Workflow Executed",
          description: `${workflow.name} has been successfully executed.`,
        });

      } catch (error) {
        console.error('Error executing workflow:', error);
        toast({
          title: "Execution Failed",
          description: "Failed to execute workflow. Please try again.",
          variant: "destructive"
        });
      }
    };

    return (
      <Card className="glass-morph border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Multi-Agent Orchestration
          </CardTitle>
          <CardDescription>
            Coordinate multiple agents for complex business workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
            <SelectTrigger>
              <SelectValue placeholder="Select a workflow" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(predefinedWorkflows).map(([key, workflow]) => (
                <SelectItem key={key} value={key}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedWorkflow && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Active Workflow</div>
              <div className="font-medium">{predefinedWorkflows[selectedWorkflow].name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {predefinedWorkflows[selectedWorkflow].description}
              </div>
              
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {predefinedWorkflows[selectedWorkflow].agents.map((agentId, i) => (
                  <React.Fragment key={agentId}>
                    <Badge variant="secondary" className="px-3 py-1">
                      {agentId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Badge>
                    {i < predefinedWorkflows[selectedWorkflow].agents.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {selectedWorkflow && (
            <Button 
              onClick={() => executeWorkflow(selectedWorkflow)}
              className="w-full bg-gradient-primary hover:shadow-lg transition-all"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Workflow
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Bot className="h-10 w-10 text-primary" />
          <span className="gradient-text">AI Agent Command Center</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Deploy autonomous agents to optimize your business operations with hyperelational intelligence
        </p>
      </motion.div>

      {/* Domain Selector */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Tabs value={selectedDomain} onValueChange={setSelectedDomain}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="fashion" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Fashion & Retail
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Music & Touring
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Agent Grid */}
        <div className="col-span-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </motion.div>
        </div>

        {/* Side Panels */}
        <div className="col-span-4 space-y-6">
          <AnimatePresence>
            {selectedAgent && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <AgentDetailPanel agent={selectedAgent} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <WorkflowPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgentWorkflows;
