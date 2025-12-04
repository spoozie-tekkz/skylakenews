import { supabase } from "./supabase";

export async function fetchCustomNews() {
  const { data, error } = await supabase
    .from("custom_news")
    .select("id, title, description, url, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetchCustomNews Error:", error);
    return [];
  }

  return data || [];
}

