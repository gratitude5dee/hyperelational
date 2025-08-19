import { supabase } from "@/integrations/supabase/client";

const USE_FUNCS = String((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_USE_FUNCTIONS) !== "false";

function mockKpis() {
  return {
    data: [
      { title: "Total Revenue", value: "$124,500", change: "+12.5%", trend: "up" },
      { title: "Active Users", value: "2,847", change: "+8.2%", trend: "up" },
      { title: "Conversion Rate", value: "3.42%", change: "-2.1%", trend: "down" },
      { title: "Page Views", value: "45,210", change: "+15.3%", trend: "up" },
    ],
  };
}

function mockSeries(projectType: "fashion" | "music") {
  const base = [
    { month: "Jan", sales: 12000, users: 400, conversion: 3.2 },
    { month: "Feb", sales: 19000, users: 450, conversion: 3.8 },
    { month: "Mar", sales: 15000, users: 520, conversion: 2.9 },
    { month: "Apr", sales: 25000, users: 680, conversion: 4.1 },
    { month: "May", sales: 22000, users: 750, conversion: 3.5 },
    { month: "Jun", sales: 30000, users: 890, conversion: 4.8 },
  ];
  const adj = projectType === "music" ? base.map((r) => ({ ...r, sales: Math.round(r.sales * 0.85), users: r.users + 120 })) : base;
  return { data: adj };
}

function mockDemographics() {
  return {
    data: [
      { name: "18-24", value: 25, color: "#3b82f6" },
      { name: "25-34", value: 35, color: "#8b5cf6" },
      { name: "35-44", value: 20, color: "#06b6d4" },
      { name: "45-54", value: 15, color: "#10b981" },
      { name: "55+", value: 5, color: "#f59e0b" },
    ],
  };
}

function mockFunnel() {
  return {
    data: {
      columns: ["name", "value"],
      rows: [
        ["Visitors", 10000],
        ["Views", 6500],
        ["Add to Cart", 2800],
        ["Checkout", 1200],
        ["Purchase", 450],
      ],
    },
  };
}

export async function fetchWidgetData(widgetId: string, widgetType: string, projectType: "fashion" | "music") {
  if (!USE_FUNCS) {
    if (widgetType === "kpi") return mockKpis();
    if (widgetType === "pie") return mockDemographics();
    if (widgetType === "table") return mockFunnel();
    return mockSeries(projectType);
  }
  try {
    const { data, error } = await supabase.functions.invoke("get-dashboard-widget-data", {
      body: { widget_id: widgetId, widget_type: widgetType, project_type: projectType },
    });
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("[functions] get-dashboard-widget-data failed, using mock");
    if (widgetType === "kpi") return mockKpis();
    if (widgetType === "pie") return mockDemographics();
    if (widgetType === "table") return mockFunnel();
    return mockSeries(projectType);
  }
}

function mockChurn(segment: string) {
  const predictions = Array.from({ length: 8 }).map((_, i) => ({
    customer_id: `${1000 + i}`,
    churn_risk: Math.round((Math.random() * 0.7 + 0.2) * 100) / 100,
    segment,
  }));
  return { type: "churn", predictions, apiKeyPresent: false };
}

function mockForecast(horizon: number) {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].slice(0, Math.max(1, Math.min(6, horizon || 6)));
  const series = months.map((m, idx) => ({
    month: m,
    sales: 22000 + idx * 1500 + Math.round(Math.random() * 2000),
  }));
  return { type: "forecast", series, apiKeyPresent: false };
}

export async function runPrediction(type: "churn" | "forecast", params: Record<string, unknown>) {
  if (!USE_FUNCS) {
    return type === "churn" ? mockChurn(String(params?.segment ?? "all")) : mockForecast(Number(params?.horizon ?? 6));
  }
  try {
    const { data, error } = await supabase.functions.invoke("run-prediction", {
      body: { type, params },
    });
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("[functions] run-prediction failed, using mock");
    return type === "churn" ? mockChurn(String(params?.segment ?? "all")) : mockForecast(Number(params?.horizon ?? 6));
  }
}

export async function manageDataSource(payload: { type: string; display_name: string; credentials: unknown }) {
  if (!USE_FUNCS) {
    return { success: true, id: typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto ? globalThis.crypto.randomUUID() : String(Date.now()) };
  }
  try {
    const { data, error } = await supabase.functions.invoke("manage-data-source", {
      body: payload,
    });
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("[functions] manage-data-source failed, returning mock success");
    return { success: true, id: typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto ? globalThis.crypto.randomUUID() : String(Date.now()) };
  }
}
