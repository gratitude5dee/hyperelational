import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Grid3X3, 
  Layout, 
  Settings, 
  Palette,
  TrendingUp,
  Users,
  ShoppingBag,
  Music,
  Calendar,
  Brain,
  Network,
  Activity,
  Target,
  Bell,
  BarChart3,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { DualModeToggle } from '@/components/DualModeToggle';

// Widget imports
import { AIChatWidget } from '@/components/dashboard/widgets/AIChatWidget';
import { Graph3DWidget } from '@/components/dashboard/widgets/Graph3DWidget';
import { RealTimeMetricsWidget } from '@/components/dashboard/widgets/RealTimeMetricsWidget';
import { AIInsightsWidget } from '@/components/dashboard/widgets/AIInsightsWidget';
import { AdvancedChartWidget } from '@/components/dashboard/widgets/AdvancedChartWidget';
import { GoalProgressWidget } from '@/components/dashboard/widgets/GoalProgressWidget';
import { ActivityHeatmapWidget } from '@/components/dashboard/widgets/ActivityHeatmapWidget';
import { NetworkVisualizationWidget } from '@/components/dashboard/widgets/NetworkVisualizationWidget';
import { PerformanceAnalyticsWidget } from '@/components/dashboard/widgets/PerformanceAnalyticsWidget';

// Import existing analytics components
import { ProductRecommendationEngine } from '@/components/analytics/ProductRecommendationEngine';
import { ChurnRiskDashboard } from '@/components/analytics/ChurnRiskDashboard';
import { FanAnalyticsDashboard } from '@/components/analytics/FanAnalyticsDashboard';
import { MerchInsightsDashboard } from '@/components/analytics/MerchInsightsDashboard';
import { TourHotspotMap } from '@/components/analytics/TourHotspotMap';
import { WidgetContainer } from '@/components/dashboard/WidgetContainer';

type LayoutPreset = 'executive' | 'analyst' | 'creative' | 'custom';

const Dashboard = () => {
  const { currentProject, industryMode } = useAppStore();
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>('executive');
  const [showSettings, setShowSettings] = useState(false);

  const getIndustryIcon = () => {
    return industryMode === 'fashion' ? ShoppingBag : Music;
  };

  const getIndustryLabel = () => {
    return industryMode === 'fashion' ? 'Fashion & E-commerce' : 'Music & Touring';
  };

  const renderExecutiveLayout = () => (
    <div className="space-y-6">
      {/* Top row - Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RealTimeMetricsWidget size="large" />
        <AIInsightsWidget size="medium" />
        <GoalProgressWidget size="medium" />
        <AIChatWidget size="mini" />
      </div>
      
      {/* Second row - Main visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkVisualizationWidget size="large" />
        <PerformanceAnalyticsWidget size="large" />
      </div>
      
      {/* Third row - Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {industryMode === 'fashion' ? (
          <>
            <WidgetContainer 
              title="Product Recommendations" 
              icon={Target}
              size="large"
            >
              <ProductRecommendationEngine />
            </WidgetContainer>
            
            <WidgetContainer 
              title="Churn Risk Analysis" 
              icon={TrendingUp}
              size="large"
            >
              <ChurnRiskDashboard />
            </WidgetContainer>
          </>
        ) : (
          <>
            <WidgetContainer 
              title="Fan Analytics" 
              icon={Users}
              size="large"
            >
              <FanAnalyticsDashboard />
            </WidgetContainer>
            
            <WidgetContainer 
              title="Tour Hotspots" 
              icon={Calendar}
              size="large"
            >
              <TourHotspotMap />
            </WidgetContainer>
          </>
        )}
      </div>
      
      {/* Fourth row - Activity patterns */}
      <ActivityHeatmapWidget size="full" />
    </div>
  );

  const renderAnalystLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Graph3DWidget size="full" />
        {industryMode === 'fashion' ? (
          <WidgetContainer title="Product Recommendations" icon={Target}>
            <ProductRecommendationEngine />
          </WidgetContainer>
        ) : (
          <WidgetContainer title="Fan Analytics" icon={Users}>
            <FanAnalyticsDashboard />
          </WidgetContainer>
        )}
      </div>
      
      <div className="space-y-6">
        <AIInsightsWidget size="medium" />
        <RealTimeMetricsWidget size="medium" />
        <AIChatWidget size="medium" />
      </div>
    </div>
  );

  const renderCreativeLayout = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AIInsightsWidget size="mini" />
        <RealTimeMetricsWidget size="mini" />
        <AIChatWidget size="mini" />
      </div>
      
      <Graph3DWidget size="full" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {industryMode === 'fashion' ? (
          <>
            <WidgetContainer title="Churn Analysis" icon={TrendingUp}>
              <ChurnRiskDashboard />
            </WidgetContainer>
            <WidgetContainer title="Merch Insights" icon={BarChart3}>
              <MerchInsightsDashboard />
            </WidgetContainer>
          </>
        ) : (
          <>
            <WidgetContainer title="Tour Planning" icon={Calendar}>
              <TourHotspotMap />
            </WidgetContainer>
            <WidgetContainer title="Fan Insights" icon={Users}>
              <FanAnalyticsDashboard />
            </WidgetContainer>
          </>
        )}
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (layoutPreset) {
      case 'executive':
        return renderExecutiveLayout();
      case 'analyst':
        return renderAnalystLayout();
      case 'creative':
        return renderCreativeLayout();
      default:
        return renderExecutiveLayout();
    }
  };

  const IndustryIcon = getIndustryIcon();

  return (
    <div className="min-h-screen space-y-6">
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
              <IndustryIcon className="h-6 w-6 text-primary animate-glow" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                hyperelational Dashboard
              </h1>
              <p className="text-muted-foreground">
                AI-powered insights for {getIndustryLabel()}
              </p>
            </div>
          </div>
          
          <Badge variant="secondary" className="animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Industry Mode Toggle */}
          <DualModeToggle />
          
          {/* Layout Presets */}
          <div className="flex items-center gap-2">
            <Button
              variant={layoutPreset === 'executive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutPreset('executive')}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Executive
            </Button>
            <Button
              variant={layoutPreset === 'analyst' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutPreset('analyst')}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analyst
            </Button>
            <Button
              variant={layoutPreset === 'creative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutPreset('creative')}
              className="gap-2"
            >
              <Palette className="h-4 w-4" />
              Creative
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Button className="gradient-primary hover:opacity-90 gap-2">
            <Plus className="h-4 w-4" />
            Add Widget
          </Button>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Dashboard Settings</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Refresh Rate</label>
                <select className="w-full p-2 bg-background border border-border rounded-lg">
                  <option>Real-time</option>
                  <option>5 seconds</option>
                  <option>30 seconds</option>
                  <option>1 minute</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Theme</label>
                <select className="w-full p-2 bg-background border border-border rounded-lg">
                  <option>Dark Mode</option>
                  <option>Light Mode</option>
                  <option>Auto</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Density</label>
                <select className="w-full p-2 bg-background border border-border rounded-lg">
                  <option>Comfortable</option>
                  <option>Compact</option>
                  <option>Spacious</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Content */}
      <motion.div
        key={layoutPreset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderLayout()}
      </motion.div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button 
          size="lg"
          className="rounded-full w-14 h-14 gradient-primary shadow-xl"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;