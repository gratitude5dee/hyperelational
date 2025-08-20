import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, BrainCircuit, Sparkles, Network, ShoppingBag, Music, ArrowRight, Users, TrendingUp, Target, Zap, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RelationalUniverse } from '@/components/RelationalUniverse';
import { TypewriterText } from '@/components/TypewriterText';
import { FeatureCard } from '@/components/FeatureCard';
import { RelationalLoadingAnimation } from '@/components/RelationalLoadingAnimation';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for first visit only after component mounts (client-side only)
    const hasVisited = localStorage.getItem('hyperelational-visited');
    if (!hasVisited) {
      localStorage.setItem('hyperelational-visited', 'true');
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 300);
  };

  // Show loading during mount to avoid hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  if (isLoading) {
    return <RelationalLoadingAnimation onComplete={handleLoadingComplete} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: showContent ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black overflow-x-hidden"
    >
      {/* Hero Section - Living Data Universe */}
      <section className="relative h-screen overflow-hidden">
        {/* Three.js Background */}
        <div className="absolute inset-0">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <RelationalUniverse />
              <Stars radius={300} depth={60} count={1000} factor={7} saturation={0} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </Suspense>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <motion.div 
            className="text-center space-y-8 max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* KumoRFM Partnership Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
              whileHover={{ scale: 1.05, borderColor: "rgba(99, 102, 241, 0.5)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/d854b317-ff5a-43b4-8eb6-ac8078baae77.png" alt="Hyperelational" className="h-6 w-auto" />
                <span className="text-white/60">×</span>
                <img src="/kumo-logo-pink.svg" alt="KumoRFM" className="h-6 w-auto" />
              </div>
              <div className="h-4 w-px bg-white/20" />
              <span className="text-sm text-white/80">Powered by Relational AI</span>
              <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full" />
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                Hyperelational
              </span>
            </motion.h1>
            
            {/* Subtitle with Typewriter */}
            <TypewriterText 
              phrases={[
                "See the hidden connections in your data",
                "Predict with relationship intelligence", 
                "Powered by KumoRFM's foundation model",
                "The future of analytics is relational"
              ]}
              className="text-xl md:text-2xl text-white/80 font-light"
            />
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                <span className="relative flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur px-8 py-4 text-lg"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 text-white/40" />
          </motion.div>
        </div>
      </section>

      {/* KumoRFM Partnership Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="container mx-auto px-6">
          {/* Partnership Showcase */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              Exclusive Partnership
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">KumoRFM's</span> Foundation Model
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              The first and only relational foundation model for structured data, bringing unprecedented intelligence to your analytics
            </p>
          </motion.div>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<BrainCircuit />}
              title="Zero-Shot Predictions"
              description="Get instant predictions without training models. KumoRFM understands your data relationships from day one."
              gradient="from-indigo-500 to-blue-600"
              delay={0.1}
            />
            <FeatureCard
              icon={<Network />}
              title="Temporal Intelligence"
              description="Understand how relationships evolve over time with temporal graph analysis powered by advanced AI."
              gradient="from-purple-500 to-pink-600"
              delay={0.2}
            />
            <FeatureCard
              icon={<Sparkles />}
              title="Natural Language Queries"
              description="Ask questions in plain English and get PQL queries with visual insights instantly."
              gradient="from-cyan-500 to-teal-600"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Experience the power of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                relational intelligence
              </span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              See how Hyperelational transforms complex data relationships into actionable insights
            </p>
          </motion.div>
          
          {/* Demo Tabs */}
          <Tabs defaultValue="ecommerce" className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-white/5 backdrop-blur">
              <TabsTrigger value="ecommerce" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                E-commerce
              </TabsTrigger>
              <TabsTrigger value="artist" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                Artist Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ecommerce">
              <motion.div 
                className="grid lg:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">E-commerce Intelligence</h3>
                  <div className="space-y-4">
                    <div className="p-4 glass rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-indigo-400" />
                        <span className="text-white font-medium">Customer Churn Prediction</span>
                      </div>
                      <p className="text-white/60 text-sm">Identified 342 customers at risk in next 30 days</p>
                    </div>
                    
                    <div className="p-4 glass rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-medium">Product Affinity Networks</span>
                      </div>
                      <p className="text-white/60 text-sm">Discover hidden cross-sell opportunities</p>
                    </div>
                    
                    <div className="p-4 glass rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-medium">Seasonal Trend Predictions</span>
                      </div>
                      <p className="text-white/60 text-sm">Forecast demand 3 months ahead with 94% accuracy</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-8 rounded-2xl border border-white/10 min-h-[400px] flex items-center justify-center">
                  <div className="text-center text-white/40">
                    <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Interactive demo visualization</p>
                    <p className="text-sm">(Coming soon)</p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="artist">
              <motion.div 
                className="grid lg:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Artist Intelligence</h3>
                  <div className="space-y-4">
                    <div className="p-4 glass rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-indigo-400" />
                        <span className="text-white font-medium">Superfan Identification</span>
                      </div>
                      <p className="text-white/60 text-sm">Found 1,247 superfans across 23 cities</p>
                    </div>
                    
                    <div className="p-4 glass rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-medium">Tour Optimization</span>
                      </div>
                      <p className="text-white/60 text-sm">Optimize tour routes based on fan density</p>
                    </div>
                    
                    <div className="p-4 glass rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-medium">Engagement Prediction</span>
                      </div>
                      <p className="text-white/60 text-sm">Predict ticket sales with 96% accuracy</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass p-8 rounded-2xl border border-white/10 min-h-[400px] flex items-center justify-center">
                  <div className="text-center text-white/40">
                    <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Fan network visualization</p>
                    <p className="text-sm">(Coming soon)</p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to see your data's hidden relationships?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join the relational intelligence revolution and transform how you understand your business
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-white/90 px-8 py-4 text-lg font-medium"
              >
                Start Your Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                Book a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Index;
