import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { runPrediction } from "@/lib/functions";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

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

export default function Predictions() {
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
        <h1 className="text-3xl font-bold gradient-text">Predictions</h1>
        <KumoLoader />
      </div>

      <GlassCard variant="hover" className="p-6 space-y-4">
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

      <GlassCard variant="hover" className="p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : result ? (
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
        ) : (
          <div className="text-muted-foreground text-sm">No results yet</div>
        )}
      </GlassCard>
    </div>
  );
}
