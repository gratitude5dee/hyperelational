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
import { RevolutionaryLoadingAnimation } from '@/components/RevolutionaryLoadingAnimation';
import { InteractiveRelationalUniverse } from '@/components/InteractiveRelationalUniverse';
import { LiquidTypography } from '@/components/LiquidTypography';
import { ScrollDrivenParallax, ParallaxLayer } from '@/components/ScrollDrivenParallax';
import { MagneticButton } from '@/components/MagneticButton';

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
    return <RevolutionaryLoadingAnimation onComplete={handleLoadingComplete} />;
  }

  return (
    <ScrollDrivenParallax className="min-h-screen overflow-x-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="min-h-screen bg-background"
        style={{ background: 'var(--gradient-atmospheric)' }}
      >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/d35c1ea8-0548-4b9b-a567-8c365d98d96e.png" alt="Hyperelational" className="h-8 w-auto" />
            <span className="text-xl font-bold text-white">Hyperelational</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section - Living Data Universe */}
      <section className="relative h-screen overflow-hidden">
        {/* Revolutionary Three.js Background */}
        <ParallaxLayer speed={-0.5} className="absolute inset-0">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-neural opacity-30" />}>
            <Canvas 
              camera={{ position: [0, 0, 5], fov: 75 }}
              gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            >
              <InteractiveRelationalUniverse />
              <Stars radius={500} depth={80} count={2000} factor={10} saturation={0} fade />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                autoRotate 
                autoRotateSpeed={0.2}
                enableDamping
                dampingFactor={0.05}
              />
              {/* Atmospheric lighting */}
              <ambientLight intensity={0.2} color="#6366f1" />
              <pointLight position={[10, 10, 10]} intensity={0.5} color="#ec4899" />
              <pointLight position={[-10, -10, -10]} intensity={0.3} color="#06b6d4" />
            </Canvas>
          </Suspense>
        </ParallaxLayer>
        
        {/* Atmospheric gradient overlay */}
        <ParallaxLayer speed={-0.2} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/90" />
          <div className="absolute inset-0 bg-gradient-neural opacity-20" />
        </ParallaxLayer>
        
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
                <img src="/lovable-uploads/d35c1ea8-0548-4b9b-a567-8c365d98d96e.png" alt="Hyperelational" className="h-6 w-auto" />
                <span className="text-white/60">×</span>
                <img src="/lovable-uploads/69ad29f0-f8c0-4412-96b7-1081781f745b.png" alt="KumoRFM" className="h-6 w-auto" />
              </div>
              <div className="h-4 w-px bg-white/20" />
              <span className="text-sm text-white/80">Powered by Relational AI</span>
              <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full" />
            </motion.div>
            
            {/* Revolutionary Main Heading */}
            <ParallaxLayer speed={0.3}>
              <LiquidTypography
                text="Hyperelational"
                className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight text-center"
                variant="hologram"
                delay={0.8}
              />
            </ParallaxLayer>
            
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
            
            {/* Revolutionary CTA Buttons */}
            <ParallaxLayer speed={0.1}>
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <MagneticButton 
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/auth');
                  }}
                  className="breathing-bg text-white px-10 py-5 text-lg font-semibold border-0 shadow-elegant"
                  magneticStrength={0.4}
                  glowIntensity={0.8}
                >
                  <span className="flex items-center gap-3">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                  </span>
                </MagneticButton>
                
                <MagneticButton 
                  variant="outline" 
                  size="lg"
                  className="glass-intense text-foreground hover:text-primary px-10 py-5 text-lg font-medium border-glass-border backdrop-blur-xl"
                  magneticStrength={0.2}
                  glowIntensity={0.4}
                >
                  Watch Demo
                </MagneticButton>
              </motion.div>
            </ParallaxLayer>
          </motion.div>
          
          {/* Enhanced Scroll Indicator */}
          <ParallaxLayer speed={0.2}>
            <motion.div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              animate={{ 
                y: [0, 15, 0],
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                <ChevronDown className="w-8 h-8 text-primary animate-neural-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg scale-150" />
              </div>
            </motion.div>
          </ParallaxLayer>
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
            <ParallaxLayer speed={0.2}>
              <LiquidTypography
                text="Built on KumoRFM's Foundation Model"
                className="text-4xl md:text-5xl font-bold text-center mb-6"
                variant="magnetic"
                delay={0.2}
              />
            </ParallaxLayer>
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
            <ParallaxLayer speed={0.3}>
              <LiquidTypography
                text="Experience the power of relational intelligence"
                className="text-4xl md:text-5xl font-bold text-center mb-6"
                variant="glitch"
                delay={0.1}
              />
            </ParallaxLayer>
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
            <ParallaxLayer speed={0.1}>
              <LiquidTypography
                text="Ready to see your data's hidden relationships?"
                className="text-4xl md:text-5xl font-bold text-center mb-6"
                variant="liquid"
                delay={0}
              />
            </ParallaxLayer>
            <p className="text-xl text-white/80 mb-8">
              Join the relational intelligence revolution and transform how you understand your business
            </p>
            
            <ParallaxLayer speed={-0.1}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <MagneticButton 
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 px-10 py-5 text-lg font-semibold shadow-glow"
                  magneticStrength={0.5}
                  glowIntensity={1}
                  particleCount={12}
                >
                  Start Your Free Trial
                </MagneticButton>
                <MagneticButton 
                  variant="outline" 
                  size="lg"
                  className="glass-intense border-foreground/30 text-foreground hover:bg-foreground/10 px-10 py-5 text-lg font-medium backdrop-blur-xl"
                  magneticStrength={0.3}
                  glowIntensity={0.6}
                >
                  Book a Demo
                </MagneticButton>
              </div>
            </ParallaxLayer>
          </motion.div>
        </div>
      </section>
      </motion.div>
    </ScrollDrivenParallax>
  );
};

export default Index;
