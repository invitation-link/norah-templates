import { getSupabaseClient } from "@/lib/auth";

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const { data } = await getSupabaseClient().auth.getSession();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (data.session?.access_token) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return fetch(input, { ...init, headers });
}

export async function apiUpload(input: RequestInfo | URL, body: FormData) {
  const { data } = await getSupabaseClient().auth.getSession();
  const headers = new Headers();
  if (data.session?.access_token) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  return fetch(input, { method: "POST", headers, body });
}
