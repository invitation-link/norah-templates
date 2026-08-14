import "server-only";
import { createServerClient } from "@/lib/supabase";
import { createShareSlug, DEFAULT_TIRANGA_STATS, TIRANGA_BASELINE_COUNT, TirangaStats } from "./tiranga";

type Participant = {
  id: string;
  name: string;
  dedication?: string;
  referredBy?: string;
  community?: string;
  createdAt: string;
};

type ShareRecord = {
  shareId: string;
  name: string;
  dedication?: string;
  parentShareId?: string;
  community?: string;
  createdAt: string;
};

type ContactRecord = {
  participantId?: string;
  shareId?: string;
  phone: string;
  marketingConsent: boolean;
  createdAt: string;
};

type MemoryStore = { participants: Participant[]; shares: ShareRecord[] };

const globalStore = globalThis as typeof globalThis & { tirangaStore?: MemoryStore };
const memory = globalStore.tirangaStore ?? { participants: [], shares: [] };
globalStore.tirangaStore = memory;

function databaseAvailable() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function getTirangaStats(): Promise<TirangaStats> {
  if (databaseAvailable()) {
    try {
      const client = createServerClient();
      const { count, error } = await client.from("tiranga_participants").select("id", { count: "exact", head: true });
      if (!error) return { ...DEFAULT_TIRANGA_STATS, nationalCount: TIRANGA_BASELINE_COUNT + (count || 0) };
    } catch {
      // Use the resilient in-process store until database credentials are connected.
    }
  }
  return { ...DEFAULT_TIRANGA_STATS, nationalCount: TIRANGA_BASELINE_COUNT + memory.participants.length };
}

export async function createParticipant(input: Omit<Participant, "id" | "createdAt">) {
  const record: Participant = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  if (databaseAvailable()) {
    try {
      const client = createServerClient();
      const payload = {
        id: record.id,
        first_name: record.name,
        city: null,
        dedication: record.dedication || null,
        referred_by: record.referredBy || null,
        community_slug: record.community || null,
        created_at: record.createdAt,
      };
      let { error } = await client.from("tiranga_participants").insert(payload as never);
      if (error) {
        ({ error } = await client.from("tiranga_participants").insert({
          id: record.id,
          first_name: record.name,
          city: "Not shared",
          referred_by: record.referredBy || null,
          community_slug: record.community || null,
          created_at: record.createdAt,
        } as never));
      }
      if (!error) {
        const stats = await getTirangaStats();
        return { participant: record, stats, persistent: true };
      }
    } catch {
      // Continue with a usable local campaign record.
    }
  }
  memory.participants.push(record);
  return { participant: record, stats: await getTirangaStats(), persistent: false };
}

export async function createShare(input: Omit<ShareRecord, "shareId" | "createdAt">) {
  const record: ShareRecord = { ...input, shareId: createShareSlug(input.name), createdAt: new Date().toISOString() };
  if (databaseAvailable()) {
    try {
      const client = createServerClient();
      const payload = {
        share_id: record.shareId,
        first_name: record.name,
        city: null,
        dedication: record.dedication || null,
        parent_share_id: record.parentShareId || null,
        community_slug: record.community || null,
        created_at: record.createdAt,
      };
      let { error } = await client.from("tiranga_shares").insert(payload as never);
      if (error) {
        ({ error } = await client.from("tiranga_shares").insert({
          share_id: record.shareId,
          first_name: record.name,
          city: "Not shared",
          parent_share_id: record.parentShareId || null,
          community_slug: record.community || null,
          created_at: record.createdAt,
        } as never));
      }
      if (!error) return record;
    } catch {
      // Continue with a usable local share record.
    }
  }
  memory.shares.push(record);
  return record;
}

export async function getShare(shareId: string): Promise<ShareRecord | null> {
  if (databaseAvailable()) {
    try {
      const client = createServerClient();
      let { data, error } = await client.from("tiranga_shares").select("share_id,first_name,dedication,parent_share_id,community_slug,created_at").eq("share_id", shareId).maybeSingle();
      if (error) ({ data, error } = await client.from("tiranga_shares").select("share_id,first_name,parent_share_id,community_slug,created_at").eq("share_id", shareId).maybeSingle());
      if (!error && data) {
        const row = data as unknown as { share_id: string; first_name: string; dedication?: string | null; parent_share_id: string | null; community_slug: string | null; created_at: string };
        return { shareId: row.share_id, name: row.first_name, dedication: row.dedication || undefined, parentShareId: row.parent_share_id || undefined, community: row.community_slug || undefined, createdAt: row.created_at };
      }
    } catch {
      // Fall through to the in-process store.
    }
  }
  return memory.shares.find((share) => share.shareId === shareId) || null;
}

export async function saveTirangaContact(input: Omit<ContactRecord, "createdAt">) {
  if (!databaseAvailable()) return { saved: false };
  try {
    const client = createServerClient();
    const { error } = await client.from("tiranga_contacts").insert({
      participant_id: input.participantId || null,
      share_id: input.shareId || null,
      phone: input.phone,
      marketing_consent: input.marketingConsent,
      created_at: new Date().toISOString(),
    } as never);
    return { saved: !error };
  } catch {
    return { saved: false };
  }
}
