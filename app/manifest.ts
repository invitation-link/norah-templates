import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Invite Link — Interactive Invitations",
    short_name: "Invite Link",
    description: "Create, personalize and share interactive digital invitations.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F1",
    theme_color: "#071A38",
    icons: [{ src: "/brand/invite-link-mark.png", sizes: "510x445", type: "image/png", purpose: "any" }],
  };
}
