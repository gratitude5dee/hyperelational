import React from 'react';
import { motion } from 'framer-motion';
import { GroqChatInterface } from '@/components/GroqChatInterface';
import { GlassCard } from '@/components/ui/glass-card';
import { DualModeToggle } from '@/components/DualModeToggle';
import { useAppStore } from '@/stores/useAppStore';
import { Brain, Sparkles, Code2, Palette, Music, TrendingUp, Users } from 'lucide-react';

export function ChatPage() {
  const { industryMode } = useAppStore();

  const modeConfig = {
    fashion: {
      title: 'Fashion AI Assistant',
      subtitle: 'Trend forecasting, customer insights & inventory optimization',
      icon: Palette,
      features: [
        { icon: Sparkles, text: 'Trend Analysis & Forecasting' },
        { icon: Users, text: 'Customer Segmentation' },
        { icon: TrendingUp, text: 'Sales & Inventory Optimization' }
      ],
      gradient: 'var(--fashion-gradient)',
      cardBg: 'var(--fashion-card-bg)'
    },
    artist: {
      title: 'Artist AI Assistant',
      subtitle: 'Superfan analytics, tour optimization & cross-platform insights',
      icon: Music,
      features: [
        { icon: Users, text: 'Superfan Identification' },
        { icon: TrendingUp, text: 'Tour Revenue Optimization' },
        { icon: Sparkles, text: 'Multi-Platform Analytics' }
      ],
      gradient: 'var(--artist-gradient)',
      cardBg: 'var(--artist-card-bg)'
    }
  };

  const config = modeConfig[industryMode];

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <config.icon className="h-8 w-8" />
            {config.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {config.subtitle}
          </p>
        </div>
        <DualModeToggle />
      </motion.div>

      {/* Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard 
          className="p-4"
          style={{ background: config.cardBg }}
        >
          <div className="flex items-center justify-center gap-8 text-sm">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <feature.icon className="h-4 w-4" style={{ color: industryMode === 'fashion' ? '#ff6ab5' : '#8b5cf6' }} />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 min-h-0"
      >
        <GlassCard 
          className="h-full"
          style={{ background: config.cardBg }}
        >
          <GroqChatInterface />
        </GlassCard>
      </motion.div>
    </div>
  );
}