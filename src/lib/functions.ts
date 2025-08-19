import { supabase } from "@/integrations/supabase/client";

export async function fetchWidgetData(widgetId: string, widgetType: string, projectType: "fashion" | "music") {
  const { data, error } = await supabase.functions.invoke("get-dashboard-widget-data", {
    body: { widget_id: widgetId, widget_type: widgetType, project_type: projectType },
  });
  if (error) throw error;
  return data;
}

export async function runPrediction(type: "churn" | "forecast", params: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("run-prediction", {
    body: { type, params },
  });
  if (error) throw error;
  return data;
}

export async function manageDataSource(payload: { type: string; display_name: string; credentials: unknown }) {
  const { data, error } = await supabase.functions.invoke("manage-data-source", {
    body: payload,
  });
  if (error) throw error;
  return data;
}
