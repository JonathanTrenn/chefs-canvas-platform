import { notFound } from "next/navigation";
import { client } from "../../../../sanity/client";
import DishTemplate from "../../../components/DishTemplate";

export const dynamic = "force-dynamic";

type GalleryItem = {
  url?: string;
  alt?: string;
};

type Dish = {
  title?: string;
  description?: string;
  story?: any;
  features?: string[];
  quoteText?: string;
  quoteSource?: string;
  gallery?: GalleryItem[];
};

async function getDish(rs: string, ds: string): Promise<Dish | null> {
  const query = `
    *[_type == "dish"
      && slug.current == $ds
      && restaurant->slug.current == $rs
    ][0]{
      title,
      description,
      story,
      features,
      quoteText,
      quoteSource,
      "gallery": gallery[]{
        "url": asset->url,
        "alt": alt
      }
    }
  `;

  return client.fetch(query, { rs, ds });
}

export default async function DishPage(props: {
  params: Promise<{ restaurantSlug: string; dishSlug: string }>;
}) {
  const { restaurantSlug: rs, dishSlug: ds } = await props.params;

  if (!rs || !ds) notFound();

  const dish = (await getDish(rs, ds)) as Dish | null;
  if (!dish) notFound();

  return (
    <DishTemplate
      title={dish.title ?? ""}
      subtitle={dish.description ?? ""}
      story={dish.story}
      features={dish.features}
      quoteText={dish.quoteText}
      quoteSource={dish.quoteSource}
      gallery={dish.gallery}
    />
  );
}