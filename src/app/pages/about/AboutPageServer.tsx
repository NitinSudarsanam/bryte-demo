import { fetchCosmicObject } from "@/app/lib/cosmic";

export default async function AboutPageServer() {
  const cosmic = await fetchCosmicObject({
    type: "about",
    slug: "about",
    props: "slug,title,metadata,type",
    depth: 2,
  });

  return cosmic;
}