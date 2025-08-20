import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Zap, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Settings, 
  Trash2,
  Database,
  Cloud,
  Store,
  BarChart3,
  CreditCard,
  Mail,
  Globe,
  Sparkles,
  ArrowRight,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { manageDataSource } from '@/lib/functions';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface DataSource {
  id: string;
  type: string;
  display_name: string;
  status: 'connected' | 'error' | 'syncing' | 'idle';
  created_at: string;
  last_sync?: string;
  data_volume?: number;
  health_score?: number;
}

interface PlatformInfo {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  setupTime: string;
  dataTypes: string[];
  insightBoost: number;
  color: string;
  popular: boolean;
}

const availablePlatforms: PlatformInfo[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    icon: Store,
    description: 'E-commerce platform with customer, order, and product data',
    category: 'E-commerce',
    difficulty: 'easy',
    setupTime: '2 minutes',
    dataTypes: ['Orders', 'Customers', 'Products', 'Inventory'],
    insightBoost: 25,
    color: 'from-green-500 to-emerald-600',
    popular: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: CreditCard,
    description: 'Payment processing with transaction and customer insights',
    category: 'Finance',
    difficulty: 'easy',
    setupTime: '3 minutes',
    dataTypes: ['Payments', 'Subscriptions', 'Customers', 'Disputes'],
    insightBoost: 20,
    color: 'from-purple-500 to-violet-600',
    popular: true
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    icon: BarChart3,
    description: 'Web analytics with user behavior and conversion data',
    category: 'Analytics',
    difficulty: 'medium',
    setupTime: '5 minutes',
    dataTypes: ['Traffic', 'Conversions', 'User Behavior', 'Demographics'],
    insightBoost: 30,
    color: 'from-orange-500 to-red-600',
    popular: true
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: Mail,
    description: 'Email marketing platform with campaign and audience data',
    category: 'Marketing',
    difficulty: 'easy',
    setupTime: '2 minutes',
    dataTypes: ['Campaigns', 'Subscribers', 'Segments', 'Automation'],
    insightBoost: 15,
    color: 'from-yellow-500 to-orange-600',
    popular: false
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: Database,
    description: 'CRM platform with sales, marketing, and customer service data',
    category: 'CRM',
    difficulty: 'medium',
    setupTime: '7 minutes',
    dataTypes: ['Contacts', 'Deals', 'Companies', 'Activities'],
    insightBoost: 35,
    color: 'from-blue-500 to-indigo-600',
    popular: false
  },
  {
    id: 'aws',
    name: 'AWS S3',
    icon: Cloud,
    description: 'Cloud storage with custom data files and logs',
    category: 'Infrastructure',
    difficulty: 'hard',
    setupTime: '15 minutes',
    dataTypes: ['Files', 'Logs', 'Backups', 'Custom Data'],
    insightBoost: 40,
    color: 'from-gray-500 to-slate-600',
    popular: false
  }
];

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'select',
    title: 'Select Platform',
    description: 'Choose your data source',
    icon: Target
  },
  {
    id: 'connect',
    title: 'Connect Securely',
    description: 'Enter your credentials',
    icon: Shield
  },
  {
    id: 'validate',
    title: 'Validate Connection',
    description: 'Test data access',
    icon: CheckCircle
  },
  {
    id: 'celebrate',
    title: 'Success!',
    description: 'Start generating insights',
    icon: Rocket
  }
];

export function RevolutionaryDataSources() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformInfo | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [credentials, setCredentials] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [detectedPlatforms, setDetectedPlatforms] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dataSources = [], isLoading } = useQuery<DataSource[]>({
    queryKey: ['data-sources'],
    queryFn: async () => {
      // Mock data for demo
      return [
        {
          id: '1',
          type: 'Shopify',
          display_name: 'Main Store',
          status: 'connected' as const,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          last_sync: new Date(Date.now() - 3600000).toISOString(),
          data_volume: 15420,
          health_score: 98
        },
        {
          id: '2',
          type: 'Google Analytics',
          display_name: 'Website Analytics',
          status: 'syncing' as const,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          last_sync: new Date(Date.now() - 7200000).toISOString(),
          data_volume: 8930,
          health_score: 87
        }
      ];
    }
  });

  // Simulate platform detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setDetectedPlatforms(['shopify', 'stripe', 'google_analytics']);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'error': return AlertCircle;
      case 'syncing': return RefreshCw;
      default: return Database;
    }
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'error': return 'text-destructive';
      case 'syncing': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const startOnboarding = (platform?: PlatformInfo) => {
    if (platform) {
      setSelectedPlatform(platform);
      setDisplayName(platform.name);
    }
    setCurrentStep(0);
    setShowOnboarding(true);
  };

  const handleConnect = async () => {
    if (!selectedPlatform || !credentials) return;

    setIsConnecting(true);
    setConnectionProgress(0);

    // Simulate connection process
    const progressSteps = [20, 40, 60, 80, 100];
    for (const progress of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setConnectionProgress(progress);
    }

    try {
      const result = await manageDataSource({
        type: selectedPlatform.name,
        display_name: displayName || selectedPlatform.name,
        credentials
      });

      // Add to local state
      const newSource: DataSource = {
        id: result.id || Date.now().toString(),
        type: selectedPlatform.name,
        display_name: displayName || selectedPlatform.name,
        status: 'connected',
        created_at: new Date().toISOString(),
        health_score: 95,
        data_volume: Math.floor(Math.random() * 10000) + 1000
      };

      queryClient.setQueryData(['data-sources'], (old: DataSource[] = []) => [newSource, ...old]);

      setCurrentStep(3); // Success step
      
      toast({
        title: "Connection Successful! 🎉",
        description: `${selectedPlatform.name} has been connected and is ready for analysis.`,
      });

      // Auto close after celebration
      setTimeout(() => {
        setShowOnboarding(false);
        resetOnboarding();
      }, 3000);

    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
      setConnectionProgress(0);
    }
  };

  const resetOnboarding = () => {
    setSelectedPlatform(null);
    setCurrentStep(0);
    setCredentials('');
    setDisplayName('');
    setIsConnecting(false);
    setConnectionProgress(0);
  };

  const deleteDataSource = async (sourceId: string) => {
    queryClient.setQueryData(['data-sources'], (old: DataSource[] = []) => 
      old.filter(source => source.id !== sourceId)
    );
    
    toast({
      title: "Data Source Removed",
      description: "The data source has been disconnected.",
    });
  };

  const syncDataSource = async (sourceId: string) => {
    queryClient.setQueryData(['data-sources'], (old: DataSource[] = []) =>
      old.map(source => 
        source.id === sourceId 
          ? { ...source, status: 'syncing' as const, last_sync: new Date().toISOString() }
          : source
      )
    );

    toast({
      title: "Sync Started",
      description: "Data synchronization is in progress...",
    });

    // Simulate sync completion
    setTimeout(() => {
      queryClient.setQueryData(['data-sources'], (old: DataSource[] = []) =>
        old.map(source => 
          source.id === sourceId 
            ? { ...source, status: 'connected' as const }
            : source
        )
      );
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Data Sources</h1>
          <p className="text-muted-foreground mt-1">
            Connect your platforms for AI-powered insights
          </p>
        </div>
        
        <Button 
          className="gradient-primary gap-2" 
          onClick={() => startOnboarding()}
        >
          <Plus className="h-4 w-4" />
          Add Data Source
        </Button>
      </div>

      {/* Platform Detection */}
      <AnimatePresence>
        {detectedPlatforms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Smart Detection Active</h3>
                  <p className="text-sm text-muted-foreground">We found platforms you might want to connect</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {detectedPlatforms.map(platformId => {
                  const platform = availablePlatforms.find(p => p.id === platformId);
                  if (!platform) return null;
                  
                  const Icon = platform.icon;
                  return (
                    <motion.div
                      key={platform.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl bg-gradient-to-r ${platform.color} text-white cursor-pointer`}
                      onClick={() => startOnboarding(platform)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-8 w-8" />
                        <div>
                          <h4 className="font-medium">{platform.name}</h4>
                          <p className="text-xs opacity-90">Quick setup • +{platform.insightBoost}% insights</p>
                        </div>
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected Data Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {dataSources.map((source, index) => {
            const StatusIcon = getStatusIcon(source.status);
            const platform = availablePlatforms.find(p => p.name === source.type);
            const PlatformIcon = platform?.icon || Database;
            
            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform?.color || 'from-gray-500 to-slate-600'} flex items-center justify-center`}>
                        <PlatformIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{source.display_name}</h3>
                        <p className="text-sm text-muted-foreground">{source.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(source.status)} ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                      <Badge variant={source.status === 'connected' ? 'default' : source.status === 'error' ? 'destructive' : 'secondary'}>
                        {source.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  {source.health_score && (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Health Score</span>
                        <span className="font-medium">{source.health_score}%</span>
                      </div>
                      <Progress value={source.health_score} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Data Volume</p>
                      <p className="font-semibold">{source.data_volume?.toLocaleString() || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Sync</p>
                      <p className="font-semibold text-xs">
                        {source.last_sync ? new Date(source.last_sync).toLocaleString() : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncDataSource(source.id)}
                      disabled={source.status === 'syncing'}
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Settings className="h-3 w-3 mr-1" />
                      Config
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => deleteDataSource(source.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add New Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dataSources.length * 0.1 }}
        >
          <GlassCard 
            className="p-6 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group"
            onClick={() => startOnboarding()}
          >
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Add Data Source</h3>
                <p className="text-sm text-muted-foreground">Connect a new platform</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Empty State */}
        {dataSources.length === 0 && !isLoading && (
          <div className="col-span-full">
            <div className="text-center py-12">
              <Database className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Data Sources Connected</h3>
              <p className="text-muted-foreground mb-6">
                Connect your first data source to start generating AI-powered insights
              </p>
              <Button onClick={() => startOnboarding()} className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Connect Your First Source
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="max-w-4xl glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Connect Data Source
            </DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {onboardingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-3 ${index < onboardingSteps.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-success text-white' :
                      isActive ? 'bg-primary text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  
                  {index < onboardingSteps.length - 1 && (
                    <div className={`flex-1 h-px mx-4 ${isCompleted ? 'bg-success' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Choose Your Platform</h3>
                  <p className="text-muted-foreground">Select the data source you want to connect</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePlatforms.map(platform => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatform?.id === platform.id;
                    
                    return (
                      <motion.div
                        key={platform.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlatform(platform)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{platform.name}</h4>
                            <p className="text-xs text-muted-foreground">{platform.category}</p>
                          </div>
                          {platform.popular && (
                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{platform.description}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Setup: {platform.setupTime}</span>
                          <Badge variant="outline">+{platform.insightBoost}% insights</Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setCurrentStep(1)}
                    disabled={!selectedPlatform}
                    className="gradient-primary"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && selectedPlatform && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedPlatform.color} flex items-center justify-center mx-auto mb-4`}>
                    <selectedPlatform.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Connect {selectedPlatform.name}</h3>
                  <p className="text-muted-foreground">Enter your credentials to establish a secure connection</p>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Display Name</label>
                    <Input 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={`My ${selectedPlatform.name} Store`}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">API Key / Token</label>
                    <Input 
                      type="password"
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                      placeholder="Enter your API credentials"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your credentials are encrypted and stored securely
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Shield className="h-4 w-4 text-success" />
                    <span className="text-sm">256-bit encryption • SOC 2 compliant</span>
                  </div>
                </div>

                {isConnecting && (
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Connecting...</span>
                      <span className="text-sm font-medium">{connectionProgress}%</span>
                    </div>
                    <Progress value={connectionProgress} />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleConnect}
                    disabled={!credentials || isConnecting}
                    className="gradient-primary"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && selectedPlatform && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-success to-emerald-600 flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="h-12 w-12 text-white" />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">🎉 Success!</h3>
                  <p className="text-muted-foreground">
                    {selectedPlatform.name} has been connected successfully
                  </p>
                </div>

                <div className="flex items-center justify-center gap-8 py-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">+{selectedPlatform.insightBoost}%</div>
                    <div className="text-sm text-muted-foreground">Insight Boost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedPlatform.dataTypes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Data Types</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring</div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-muted-foreground">Start exploring your data with AI:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "Predict customer churn",
                      "Identify growth opportunities", 
                      "Optimize marketing spend",
                      "Analyze user behavior"
                    ].map((suggestion, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}