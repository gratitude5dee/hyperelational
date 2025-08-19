import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type WidgetType = "kpi" | "line_chart" | "area_chart" | "bar_chart" | "pie" | "table";

serve(async (req) => {
  try {
    const { widget_id, widget_type, project_type } = await req.json();
    let data: unknown = null;

    if (widget_type === "kpi") {
      const values = [
        { title: "Total Revenue", value: "$124,500", change: "+12.5%", trend: "up" },
        { title: "Active Users", value: "2,847", change: "+8.2%", trend: "up" },
        { title: "Conversion Rate", value: "3.42%", change: "-2.1%", trend: "down" },
        { title: "Page Views", value: "45,210", change: "+15.3%", trend: "up" },
      ];
      data = values;
    } else if (widget_type === "area_chart" || widget_type === "line_chart" || widget_type === "bar_chart") {
      const base = [
        { month: "Jan", sales: 12000, users: 400, conversion: 3.2 },
        { month: "Feb", sales: 19000, users: 450, conversion: 3.8 },
        { month: "Mar", sales: 15000, users: 520, conversion: 2.9 },
        { month: "Apr", sales: 25000, users: 680, conversion: 4.1 },
        { month: "May", sales: 22000, users: 750, conversion: 3.5 },
        { month: "Jun", sales: 30000, users: 890, conversion: 4.8 },
      ];
      data = project_type === "creative" ? base.map((r) => ({ ...r, sales: Math.round(r.sales * 0.85), users: r.users + 120 })) : base;
    } else if (widget_type === "pie") {
      data = [
        { name: "18-24", value: 25, color: "#3b82f6" },
        { name: "25-34", value: 35, color: "#8b5cf6" },
        { name: "35-44", value: 20, color: "#06b6d4" },
        { name: "45-54", value: 15, color: "#10b981" },
        { name: "55+", value: 5, color: "#f59e0b" },
      ];
    } else if (widget_type === "table") {
      data = {
        columns: ["name", "value"],
        rows: [
          ["Visitors", 10000],
          ["Views", 6500],
          ["Add to Cart", 2800],
          ["Checkout", 1200],
          ["Purchase", 450],
        ],
      };
    }

    return new Response(JSON.stringify({ widget_id, widget_type, project_type, data }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400 });
  }
});
