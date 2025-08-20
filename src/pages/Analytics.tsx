import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, ShoppingBag, Music, Zap, Target } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { ChurnRiskDashboard } from '@/components/analytics/ChurnRiskDashboard';
import { ProductRecommendationEngine } from '@/components/analytics/ProductRecommendationEngine';
import { TourHotspotMap } from '@/components/analytics/TourHotspotMap';
import { DynamicAudienceBuilder } from '@/components/analytics/DynamicAudienceBuilder';
import { SampleDataGenerator } from '@/components/analytics/SampleDataGenerator';
import { DualModeToggle } from '@/components/DualModeToggle';

export default function Analytics() {
  const { currentProject } = useAppStore();
  const isEcommerce = currentProject?.type === 'fashion_ecommerce';

  const ecommerceFeatures = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Churn Risk Analysis",
      description: "Identify customers at risk of churning in the next 30-90 days with AI-powered predictions.",
      status: "Active"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Product Recommendations",
      description: "Generate hyper-personalized product recommendations for individual customers.",
      status: "Active"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Audience Builder",
      description: "Create dynamic, predictive audiences for targeted marketing campaigns.",
      status: "Coming Soon"
    }
  ];

  const artistFeatures = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Tour Hotspot Mapping",
      description: "Predict ticket demand city by city to optimize tour routing and venue selection.",
      status: "Active"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Fan Engagement Analytics",
      description: "Identify superfans and predict fan churn to improve retention strategies.",
      status: "Coming Soon"
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Merch Recommendations", 
      description: "Predict which merchandise items fans are most likely to purchase.",
      status: "Coming Soon"
    }
  ];

  const currentFeatures = isEcommerce ? ecommerceFeatures : artistFeatures;

  return (
    <div className="space-y-6">
      {/* Sample Data Generator */}
      <SampleDataGenerator />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Hyperelational Analytics</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered predictive insights for {isEcommerce ? 'fashion retail' : 'artist management'}
          </p>
        </div>
        <DualModeToggle />
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentFeatures.map((feature, index) => (
          <Card key={index} className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </div>
                <Badge 
                  variant={feature.status === 'Active' ? 'default' : 'secondary'}
                  className={feature.status === 'Active' ? 'bg-success/20 text-success border-success/30' : ''}
                >
                  {feature.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue={isEcommerce ? "churn" : "tour"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          {isEcommerce ? (
            <>
              <TabsTrigger value="churn" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Churn Risk
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="audience" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Audience Builder
              </TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="tour" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tour Hotspots
              </TabsTrigger>
              <TabsTrigger value="fans" className="flex items-center gap-2" disabled>
                <Users className="h-4 w-4" />
                Fan Analytics
              </TabsTrigger>
              <TabsTrigger value="merch" className="flex items-center gap-2" disabled>
                <ShoppingBag className="h-4 w-4" />
                Merch Insights
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* E-commerce Analytics */}
        <TabsContent value="churn" className="space-y-6">
          <ChurnRiskDashboard />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6">
          <ProductRecommendationEngine />
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-6">
          <DynamicAudienceBuilder />
        </TabsContent>

        {/* Artist Analytics */}
        <TabsContent value="tour" className="space-y-6">
          <TourHotspotMap />
        </TabsContent>
        
        <TabsContent value="fans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fan Engagement Analytics</CardTitle>
              <CardDescription>Coming Soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Identify "superfans" and those at risk of becoming disengaged. 
                Segment fans into tiers (Superfan, Active, At-Risk) and target each segment 
                with personalized campaigns.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="merch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Merchandise Recommendations</CardTitle>
              <CardDescription>Coming Soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Predict which specific merch items a fan is most likely to buy at a concert or online.
                Get recommendations for merchandise table staff at specific venues.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}