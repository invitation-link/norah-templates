import type { InvitationContent } from "@/lib/product";

const PREFIX = "supabase://invitations/";

async function sign(client: any, value: string) {
  if (!value?.startsWith(PREFIX)) return value;
  const { data } = await client.storage.from("invitations").createSignedUrl(value.slice(PREFIX.length), 3600);
  return data?.signedUrl || "";
}

export async function resolveInvitationAssets(client: any, content: InvitationContent): Promise<InvitationContent> {
  return {
    ...content,
    coverImage: await sign(client, content.coverImage),
    musicUrl: content.musicUrl ? await sign(client, content.musicUrl) : "",
    galleryImages: await Promise.all((content.galleryImages || []).map((value) => sign(client, value))),
  };
}
