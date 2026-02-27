import { supabase } from "@/integrations/supabase/client";

export type DbProvider = "supabase" | "neon";

function getProvider(): DbProvider {
  const provider = (import.meta.env.VITE_DB_PROVIDER as DbProvider | undefined) ?? "supabase";
  return provider;
}

function getApiBaseUrl() {
  return (import.meta.env.VITE_NEON_API_BASE_URL as string | undefined) ?? "/api";
}

function getAdminKey() {
  return (import.meta.env.VITE_NEON_ADMIN_KEY as string | undefined) ?? "";
}

export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  accent_color: string | null;
  is_active: boolean | null;
  created_at?: string;
}

export interface OrderRow {
  id: string;
  user_email: string;
  total_amount: number;
  status: string | null;
  items: unknown;
  shipping_address: unknown;
  created_at: string;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function listActiveProducts(): Promise<ProductRow[]> {
  if (getProvider() === "neon") {
    return await fetchJson<ProductRow[]>("/products");
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductRow[];
}

export async function adminListProducts(): Promise<ProductRow[]> {
  if (getProvider() === "neon") {
    return await fetchJson<ProductRow[]>("/admin/products", {
      headers: { "x-admin-key": getAdminKey() },
    });
  }

  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProductRow[];
}

export async function adminCreateProduct(input: Omit<ProductRow, "id" | "is_active">): Promise<ProductRow | null> {
  if (getProvider() === "neon") {
    return await fetchJson<ProductRow | null>("/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": getAdminKey() },
      body: JSON.stringify(input),
    });
  }

  const { data, error } = await supabase.from("products").insert([input]).select("*").single();
  if (error) throw error;
  return (data ?? null) as ProductRow | null;
}

export async function adminUpdateProduct(id: string, input: Omit<ProductRow, "id" | "is_active">): Promise<ProductRow | null> {
  if (getProvider() === "neon") {
    return await fetchJson<ProductRow | null>(`/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": getAdminKey() },
      body: JSON.stringify(input),
    });
  }

  const { data, error } = await supabase.from("products").update(input).eq("id", id).select("*").single();
  if (error) throw error;
  return (data ?? null) as ProductRow | null;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  if (getProvider() === "neon") {
    await fetchJson<void>(`/admin/products/${id}`, { method: "DELETE", headers: { "x-admin-key": getAdminKey() } });
    return;
  }
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function adminToggleProductActive(id: string): Promise<{ id: string; is_active: boolean } | null> {
  if (getProvider() === "neon") {
    return await fetchJson<{ id: string; is_active: boolean } | null>(`/admin/products/${id}/active`, {
      method: "PATCH",
      headers: { "x-admin-key": getAdminKey() },
    });
  }
  const { data, error } = await supabase.from("products").select("id, is_active").eq("id", id).single();
  if (error) throw error;
  const nextActive = !Boolean((data as { is_active: boolean | null } | null)?.is_active);
  const { data: updated, error: updateError } = await supabase
    .from("products")
    .update({ is_active: nextActive })
    .eq("id", id)
    .select("id, is_active")
    .single();
  if (updateError) throw updateError;
  return updated as { id: string; is_active: boolean };
}

export async function adminListOrders(): Promise<OrderRow[]> {
  if (getProvider() === "neon") {
    return await fetchJson<OrderRow[]>("/admin/orders", { headers: { "x-admin-key": getAdminKey() } });
  }
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

export async function adminUpdateOrderStatus(orderId: string, status: string): Promise<void> {
  if (getProvider() === "neon") {
    await fetchJson(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": getAdminKey() },
      body: JSON.stringify({ status }),
    });
    return;
  }
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

