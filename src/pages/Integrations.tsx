import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  ShoppingBag, 
  Music, 
  CreditCard, 
  Mail, 
  BarChart3, 
  Users, 
  MapPin, 
  Video,
  CheckCircle,
  Plus,
  ArrowRight,
  Zap,
  Globe,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Integration {
  name: string;
  logo: string;
  status: 'connected' | 'available' | 'coming-soon';
  description: string;
  stats?: { [key: string]: string | number };
  category: string;
}

const integrations = {
  ecommerce: [
    {
      name: "Shopify",
      logo: "🛍️",
      status: "connected" as const,
      description: "Real-time order and customer data sync",
      stats: { orders: "152.3K", customers: "48.2K", products: "3.8K" },
      category: "E-commerce Platform"
    },
    {
      name: "Stripe",
      logo: "💳",
      status: "connected" as const,
      description: "Payment analytics and revenue predictions",
      stats: { transactions: "293.8K", revenue: "$2.3M", mrr: "$198K" },
      category: "Payments"
    },
    {
      name: "Klaviyo",
      logo: "📧",
      status: "available" as const,
      description: "Email marketing performance and segmentation",
      category: "Marketing"
    },
    {
      name: "Google Analytics",
      logo: "📊",
      status: "connected" as const,
      description: "Web behavior and conversion tracking",
      stats: { sessions: "1.02M", conversion: "3.2%", bounce: "42%" },
      category: "Analytics"
    },
    {
      name: "Meta Ads",
      logo: "📱",
      status: "coming-soon" as const,
      description: "Social media advertising performance",
      category: "Advertising"
    },
    {
      name: "Amazon",
      logo: "📦",
      status: "available" as const,
      description: "Marketplace sales and inventory data",
      category: "Marketplace"
    }
  ],
  artist: [
    {
      name: "Spotify for Artists",
      logo: "🎵",
      status: "connected" as const,
      description: "Streaming data and listener analytics",
      stats: { streams: "8.29M", listeners: "1.02M", saves: "293K" },
      category: "Streaming"
    },
    {
      name: "Apple Music",
      logo: "🍎",
      status: "available" as const,
      description: "Apple Music streaming and Shazam data",
      category: "Streaming"
    },
    {
      name: "Bandsintown",
      logo: "🎪",
      status: "connected" as const,
      description: "Concert tracking and fan engagement",
      stats: { rsvps: "12.8K", venues: "47", cities: "23" },
      category: "Events"
    },
    {
      name: "YouTube Analytics",
      logo: "📺",
      status: "connected" as const,
      description: "Video performance and audience insights",
      stats: { views: "5.82M", watchTime: "2.3M hrs", subscribers: "284K" },
      category: "Video"
    },
    {
      name: "SoundCloud",
      logo: "☁️",
      status: "coming-soon" as const,
      description: "Independent streaming and fan data",
      category: "Streaming"
    },
    {
      name: "Instagram",
      logo: "📷",
      status: "available" as const,
      description: "Social media engagement and reach",
      category: "Social"
    }
  ]
};

const FloatingNodes = ({ count }: { count: number }) => {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color={`hsl(${240 + Math.random() * 60}, 70%, 60%)`}
            opacity={0.6}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

const IntegrationCard: React.FC<Integration> = ({ 
  name, 
  logo, 
  status, 
  description, 
  stats, 
  category 
}) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className={`relative p-6 glass rounded-2xl border transition-all hover-lift group
                ${status === 'connected' 
                  ? 'border-green-500/30 bg-gradient-to-br from-green-500/5 to-blue-500/5' 
                  : status === 'available'
                  ? 'border-white/20 hover:border-indigo-500/50'
                  : 'border-white/10 opacity-75'}`}
  >
    {/* Status Badge */}
    <div className="absolute top-4 right-4">
      {status === 'connected' ? (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      ) : status === 'available' ? (
        <Button size="sm" variant="outline" className="h-6 px-2 text-xs border-white/20">
          <Plus className="w-3 h-3 mr-1" />
          Connect
        </Button>
      ) : (
        <Badge className="bg-white/5 text-white/60 border-white/10">
          Coming Soon
        </Badge>
      )}
    </div>
    
    {/* Logo & Category */}
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-2xl">
          {logo}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <span className="text-xs text-white/40 uppercase tracking-wide">{category}</span>
        </div>
      </div>
    </div>
    
    {/* Description */}
    <p className="text-sm text-white/60 mb-4 leading-relaxed">{description}</p>
    
    {/* Stats */}
    {stats && (
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
        {Object.entries(stats).slice(0, 3).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-xs text-white/40 capitalize mb-1">{key}</div>
            <div className="text-sm font-medium text-white">{value}</div>
          </div>
        ))}
      </div>
    )}
    
    {/* Hover Effect */}
    <div className="absolute inset-0 rounded-2xl border border-transparent 
                    group-hover:border-indigo-500/20 transition-colors duration-500" />
  </motion.div>
);

const DataFlowDiagram = () => (
  <div className="relative">
    <div className="flex items-center justify-between">
      {/* Data Sources */}
      <div className="space-y-3">
        <div className="text-sm text-white/40 uppercase tracking-wide">Data Sources</div>
        {['Shopify', 'Stripe', 'Google Analytics', 'Klaviyo'].map((source, i) => (
          <motion.div
            key={source}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-3 glass rounded-lg border border-white/10"
          >
            <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm text-white">{source}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Arrow */}
      <div className="mx-8">
        <ArrowRight className="w-8 h-8 text-indigo-400 animate-pulse" />
      </div>
      
      {/* KumoRFM Processing */}
      <div className="text-center">
        <div className="text-sm text-white/40 uppercase tracking-wide mb-4">
          KumoRFM Processing
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-32 h-32 glass rounded-2xl border border-purple-500/30 
                     flex items-center justify-center mb-4 bg-gradient-to-br 
                     from-purple-500/10 to-indigo-500/10"
        >
          <div className="text-center">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-xs text-white/80">Relational AI</div>
          </div>
        </motion.div>
      </div>
      
      {/* Arrow */}
      <div className="mx-8">
        <ArrowRight className="w-8 h-8 text-purple-400 animate-pulse" />
      </div>
      
      {/* Insights */}
      <div className="space-y-3">
        <div className="text-sm text-white/40 uppercase tracking-wide">Insights</div>
        {[
          { icon: Users, label: 'Customer Churn' },
          { icon: BarChart3, label: 'Revenue Forecast' },
          { icon: Globe, label: 'Market Trends' }
        ].map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.5 }}
            className="flex items-center gap-3 p-3 glass rounded-lg border 
                       border-white/10 bg-gradient-to-r from-cyan-500/5 to-teal-500/5"
          >
            <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-sm text-white">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default function Integrations() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <Suspense fallback={null}>
          <Canvas>
            <FloatingNodes count={30} />
            <ambientLight intensity={0.5} />
          </Canvas>
        </Suspense>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
            Data Integration Hub
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Unified
            </span>{" "}
            Intelligence
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-6">
            Connect your entire data ecosystem with one-click integrations. 
            KumoRFM automatically understands relationships across all your platforms.
          </p>
          
          {/* KumoRFM Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full border border-white/20"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <img src="/kumo-logo-pink.svg" alt="KumoRFM" className="h-5 w-auto" />
            <span className="text-sm text-white/80">
              All data unified through relational intelligence
            </span>
          </motion.div>
        </motion.div>
        
        {/* Integration Tabs */}
        <Tabs defaultValue="ecommerce" className="w-full max-w-7xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 glass">
            <TabsTrigger value="ecommerce" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              E-commerce
            </TabsTrigger>
            <TabsTrigger value="artist" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Artist
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ecommerce">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {integrations.ecommerce.map((integration, idx) => (
                <IntegrationCard key={idx} {...integration} />
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="artist">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {integrations.artist.map((integration, idx) => (
                <IntegrationCard key={idx} {...integration} />
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
        
        {/* Data Flow Visualization */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 glass rounded-2xl border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Unified Data Intelligence Flow
          </h3>
          <DataFlowDiagram />
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to unify your data?
            </h3>
            <p className="text-white/60 mb-6">
              Start connecting your platforms and discover hidden relationships in your data
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3"
            >
              Start Free Integration
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}