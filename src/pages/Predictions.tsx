import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { runPrediction } from "@/lib/functions";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar } from "recharts";
import { DualModeToggle } from "@/components/DualModeToggle";
import { useAppStore } from "@/stores/useAppStore";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Zap, 
  MapPin, 
  Music, 
  Heart, 
  Target,
  Sparkles,
  Globe,
  Crown,
  Star
} from "lucide-react";

type ChurnPred = { customer_id: string; churn_risk: number; segment: string };
type ChurnResult = { type: "churn"; predictions: ChurnPred[]; apiKeyPresent?: boolean };
type ForecastPoint = { month: string; sales: number };
type ForecastResult = { type: "forecast"; series: ForecastPoint[]; apiKeyPresent?: boolean };
type PredResult = ChurnResult | ForecastResult;

function KumoLoader() {
  return (
    <div className="flex items-center gap-3">
      <img src="/lovable-uploads/69ad29f0-f8c0-4412-96b7-1081781f745b.png" alt="KumoRFM" className="h-6 w-auto animate-pulse" />
      <span className="text-sm text-muted-foreground">AI Insights by KumoRFM</span>
    </div>
  );
}

// Sample data for demonstrations
const fashionTrendData = [
  { month: 'Jan', trend: 'Cottagecore', confidence: 85, demand: 120 },
  { month: 'Feb', trend: 'Y2K Revival', confidence: 92, demand: 180 },
  { month: 'Mar', trend: 'Sustainable Fashion', confidence: 78, demand: 150 },
  { month: 'Apr', trend: 'Neon Colors', confidence: 89, demand: 200 },
  { month: 'May', trend: 'Oversized Blazers', confidence: 91, demand: 165 },
  { month: 'Jun', trend: 'Bucket Hats', confidence: 87, demand: 140 }
];

const superfanData = [
  { city: 'Los Angeles', fans: 8500, engagement: 94, potential: 'High' },
  { city: 'Nashville', fans: 6200, engagement: 88, potential: 'Very High' },
  { city: 'Austin', fans: 4800, engagement: 92, potential: 'High' },
  { city: 'Seattle', fans: 3900, engagement: 85, potential: 'Medium' },
  { city: 'Denver', fans: 3200, engagement: 90, potential: 'High' },
  { city: 'Atlanta', fans: 5600, engagement: 87, potential: 'High' }
];

export default function Predictions() {
  const { industryMode } = useAppStore();
  const [type, setType] = useState<"churn" | "forecast">("churn");
  const [segment, setSegment] = useState("all");
  const [horizon, setHorizon] = useState(6);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (type === "churn") {
        const data = await runPrediction("churn", { segment });
        setResult(data);
      } else {
        const data = await runPrediction("forecast", { horizon });
        setResult(data);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Prediction failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold gradient-text">
            {industryMode === 'fashion' ? 'Fashion Intelligence' : 'Artist Predictions'}
          </h1>
          <Badge 
            className="px-3 py-1"
            style={{
              background: industryMode === 'fashion' 
                ? 'var(--fashion-gradient)' 
                : 'var(--artist-gradient)'
            }}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <DualModeToggle />
          <KumoLoader />
        </div>
      </div>

      {/* Industry-Specific Prediction Interface */}
      <Tabs defaultValue={industryMode === 'fashion' ? 'trends' : 'superfans'} className="space-y-6">
        <TabsList 
          className="grid w-full grid-cols-4 glass"
          style={{
            background: industryMode === 'fashion' 
              ? 'var(--fashion-card-bg)' 
              : 'var(--artist-card-bg)'
          }}
        >
          {industryMode === 'fashion' ? (
            <>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trend Forecasting
              </TabsTrigger>
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Customer CLV
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Inventory Optimization
              </TabsTrigger>
              <TabsTrigger value="legacy" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Legacy Analytics
              </TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="superfans" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Superfan Intelligence
              </TabsTrigger>
              <TabsTrigger value="tours" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Tour Optimization
              </TabsTrigger>
              <TabsTrigger value="engagement" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Fan Engagement
              </TabsTrigger>
              <TabsTrigger value="legacy" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Legacy Analytics
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Fashion Mode Content */}
        {industryMode === 'fashion' && (
          <>
            <TabsContent value="trends">
              <div className="grid gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <GlassCard className="p-6" style={{ background: 'var(--fashion-card-bg)' }}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-400" />
                      Trending Now
                    </h3>
                    <div className="space-y-3">
                      {fashionTrendData.slice(0, 3).map((trend, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 glass rounded-lg">
                          <div>
                            <div className="font-medium">{trend.trend}</div>
                            <div className="text-sm text-muted-foreground">Confidence: {trend.confidence}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-pink-400">+{trend.demand}%</div>
                            <div className="text-xs text-muted-foreground">Demand Growth</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6" style={{ background: 'var(--fashion-card-bg)' }}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                      Trend Forecast
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={fashionTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'rgba(30, 41, 59, 0.9)', 
                              border: '1px solid rgba(255, 255, 255, 0.1)', 
                              borderRadius: '12px',
                              backdropFilter: 'blur(16px)' 
                            }} 
                          />
                          <Area type="monotone" dataKey="demand" stroke="#ff6ab5" fill="url(#fashionGradient)" strokeWidth={2} />
                          <defs>
                            <linearGradient id="fashionGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff6ab5" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ff6ab5" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="customer">
              <GlassCard className="p-6" style={{ background: 'var(--fashion-card-bg)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Customer Lifetime Value Predictions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">$2,847</div>
                    <div className="text-sm text-muted-foreground">Avg CLV</div>
                  </div>
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-pink-400">23%</div>
                    <div className="text-sm text-muted-foreground">VIP Conversion</div>
                  </div>
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-400">89%</div>
                    <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered CLV predictions help identify high-value customers and optimize marketing spend.
                </p>
              </GlassCard>
            </TabsContent>

            <TabsContent value="inventory">
              <GlassCard className="p-6" style={{ background: 'var(--fashion-card-bg)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-green-400" />
                  Inventory Optimization Intelligence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="glass p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Reorder Alert: Denim Jackets</span>
                        <Badge className="bg-red-500/20 text-red-400">Urgent</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Predicted stockout in 5 days</div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Markdown Opportunity</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400">High ROI</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Winter boots - optimal timing</div>
                    </div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Seasonal Demand Forecast</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spring Collection</span>
                        <span className="text-green-400">+34%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Summer Accessories</span>
                        <span className="text-green-400">+28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fall Outerwear</span>
                        <span className="text-blue-400">+42%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </>
        )}

        {/* Artist Mode Content */}
        {industryMode === 'artist' && (
          <>
            <TabsContent value="superfans">
              <div className="grid gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <GlassCard className="p-6" style={{ background: 'var(--artist-card-bg)' }}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-purple-400" />
                      Top Superfan Cities
                    </h3>
                    <div className="space-y-3">
                      {superfanData.slice(0, 4).map((city, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 glass rounded-lg">
                          <div>
                            <div className="font-medium">{city.city}</div>
                            <div className="text-sm text-muted-foreground">{city.fans.toLocaleString()} superfans</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-400">{city.engagement}%</div>
                            <div className="text-xs text-muted-foreground">Engagement</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6" style={{ background: 'var(--artist-card-bg)' }}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-cyan-400" />
                      Fan Growth Projection
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={superfanData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="city" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'rgba(30, 41, 59, 0.9)', 
                              border: '1px solid rgba(255, 255, 255, 0.1)', 
                              borderRadius: '12px',
                              backdropFilter: 'blur(16px)' 
                            }} 
                          />
                          <Area type="monotone" dataKey="fans" stroke="#8b5cf6" fill="url(#artistGradient)" strokeWidth={2} />
                          <defs>
                            <linearGradient id="artistGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="tours">
              <GlassCard className="p-6" style={{ background: 'var(--artist-card-bg)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  Optimal Tour Cities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">23</div>
                    <div className="text-sm text-muted-foreground">Recommended Cities</div>
                  </div>
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-cyan-400">$2.8M</div>
                    <div className="text-sm text-muted-foreground">Projected Revenue</div>
                  </div>
                  <div className="glass p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">94%</div>
                    <div className="text-sm text-muted-foreground">Fill Rate Prediction</div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={superfanData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="city" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(30, 41, 59, 0.9)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)', 
                          borderRadius: '12px',
                          backdropFilter: 'blur(16px)' 
                        }} 
                      />
                      <Bar dataKey="fans" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="engagement">
              <GlassCard className="p-6" style={{ background: 'var(--artist-card-bg)' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Fan Engagement Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="glass p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Spotify to Instagram</span>
                        <span className="text-green-400 font-bold">+18%</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Cross-platform conversion</div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">TikTok Viral Potential</span>
                        <Badge className="bg-red-500/20 text-red-400">High</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Next single release timing</div>
                    </div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Platform Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spotify Streams</span>
                        <span className="text-green-400">8.29M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Instagram Engagement</span>
                        <span className="text-pink-400">94.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>TikTok Views</span>
                        <span className="text-purple-400">2.1M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </>
        )}

        {/* Legacy Analytics Tab (Same for both modes) */}
        <TabsContent value="legacy">
          <GlassCard variant="hover" className="p-6 space-y-4">
            <h3 className="text-xl font-bold mb-4">Legacy Prediction Engine</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Prediction Type</label>
                <Select value={type} onValueChange={(v) => setType(v as "churn" | "forecast")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="churn">Customer Churn</SelectItem>
                    <SelectItem value="forecast">Sales Forecast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {type === "churn" ? (
                <div>
                  <label className="text-sm text-muted-foreground">Segment</label>
                  <Select value={segment} onValueChange={setSegment}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <label className="text-sm text-muted-foreground">Horizon (months)</label>
                  <Input type="number" min={1} max={12} value={horizon} onChange={(e) => setHorizon(parseInt(e.target.value || "1"))} className="mt-1" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={onSubmit}>Run Prediction</Button>
              {loading && <KumoLoader />}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Legacy Results Display */}
      {result && (
        <GlassCard variant="hover" className="p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : (
            type === "churn" ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Churn Risk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(result as ChurnResult).predictions.map((p: ChurnPred) => (
                    <div key={p.customer_id} className="glass-card p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">ID {p.customer_id}</div>
                        <div className="text-sm">{Math.round(p.churn_risk * 100)}%</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Segment: {p.segment}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Sales Forecast</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={(result as ForecastResult).series}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(16px)' }} />
                      <Line type="monotone" dataKey="sales" stroke="#ff6ab5" strokeWidth={3} dot={{ fill: '#ff6ab5', strokeWidth: 2, r: 5 }} activeDot={{ r: 7, fill: '#ff6ab5' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          )}
        </GlassCard>
      )}
    </div>
  );
}
