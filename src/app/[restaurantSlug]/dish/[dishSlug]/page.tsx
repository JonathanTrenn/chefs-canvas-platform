import { notFound } from "next/navigation";
import { client } from "../../../../sanity/client";
import DishTemplate from "../../../components/DishTemplate";
import { buildDishPageGraph } from "../../../lib/schemaGenerator";

export const dynamic = "force-dynamic";

type GalleryItem = {
  url?: string;
  alt?: string;
};

type DishCta = {
  label?: string;
  url?: string;
  enabled?: boolean;
  isPrimary?: boolean;
};

type Dish = {
  title?: string;
  description?: string;
  story?: any;
  features?: string[];
  quoteText?: string;
  quoteSource?: string;
  gallery?: GalleryItem[];
  wistiaVideoId?: string;
  heroImageUrl?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaNote?: string;
  ctas?: DishCta[];
  prevDishSlug?: string;
  nextDishSlug?: string;
  ingredientsSummary?: string;
  price?: number;
  currency?: string;
  videoThumbnailUrl?: string;
  videoTitle?: string;
  videoDescription?: string;
  suitableForDiet?: string;
  allergenTags?: string[];
  quoteApprovedSchema?: boolean;
  schemaMenuitemEnabled?: boolean;
  schemaVideoEnabled?: boolean;
  schemaReviewEnabled?: boolean;
  canonicalUrl?: string;
};

type Restaurant = {
  name?: string;
  tagline?: string;
  slug?: string;
  shortDescription?: string;
  servesCuisine?: string;
  priceRange?: string;
  phone?: string;
  websiteUrl?: string;
  primaryImageUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  sameAsLinks?: string[];
  menuUrl?: string;
  reservationUrl?: string;
  schemaEnabled?: boolean;
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
      wistiaVideoId,
      "heroImageUrl": heroImage.asset->url,
      ctaTitle,
      ctaSubtitle,
      ctaNote,
      "ctas": ctas[]{
        label,
        url,
        enabled,
        isPrimary
      },
      "gallery": gallery[]{
        "url": asset->url,
        "alt": alt
      },
      "prevDishSlug": previousDish->slug.current,
      "nextDishSlug": nextDish->slug.current,
      ingredientsSummary,
      preparationMethod,
      price,
      currency,
      "videoThumbnailUrl": videoThumbnail.asset->url,
      videoTitle,
      videoDescription,
      suitableForDiet,
      allergenTags,
      quoteApprovedSchema,
      schemaMenuitemEnabled,
      schemaVideoEnabled,
      schemaReviewEnabled,
      canonicalUrl
    }
  `;
  return client.fetch(query, { rs, ds });
}

async function getRestaurant(rs: string): Promise<Restaurant | null> {
  const query = `
    *[_type == "restaurant" && slug.current == $rs][0]{
      name,
      tagline,
      "slug": slug.current,
      shortDescription,
      servesCuisine,
      priceRange,
      phone,
      websiteUrl,
      "primaryImageUrl": primaryImage.asset->url,
      "address": {
        "street": address.street,
        "city":   address.city,
        "state":  address.state,
        "zip":    address.zip,
        "country": address.country
      },
      sameAsLinks,
      menuUrl,
      reservationUrl,
      schemaEnabled
    }
  `;
  return client.fetch(query, { rs });
}

export default async function DishPage(props: {
  params: Promise<{ restaurantSlug: string; dishSlug: string }>;
}) {
  const { restaurantSlug: rs, dishSlug: ds } = await props.params;

  if (!rs || !ds) notFound();

  const [dish, restaurant] = await Promise.all([
    getDish(rs, ds),
    getRestaurant(rs),
  ]);

  if (!dish) notFound();

  const pageUrl = `https://chefs-canvas.com/${rs}/dish/${ds}`;

  const jsonLd = restaurant
    ? buildDishPageGraph(
        {
          title:                dish.title ?? "",
          slug:                 ds,
          description:          dish.description,
          ingredientsSummary:   dish.ingredientsSummary,
          preparationMethod:    dish.preparationMethod,
          price:                dish.price,
          currency:             dish.currency,
          heroImageUrl:         dish.heroImageUrl,
          videoThumbnailUrl:    dish.videoThumbnailUrl,
          wistiaVideoId:        dish.wistiaVideoId,
          videoTitle:           dish.videoTitle,
          videoDescription:     dish.videoDescription,
          suitableForDiet:      dish.suitableForDiet,
          allergenTags:         dish.allergenTags,
          quoteText:            dish.quoteText,
          quoteSource:          dish.quoteSource,
          quoteApprovedSchema:  dish.quoteApprovedSchema,
          schemaMenuitemEnabled: dish.schemaMenuitemEnabled,
          schemaVideoEnabled:   dish.schemaVideoEnabled,
          schemaReviewEnabled:  dish.schemaReviewEnabled,
          canonicalUrl:         dish.canonicalUrl,
        },
        {
          name:             restaurant.name ?? rs,
          slug:             restaurant.slug ?? rs,
          shortDescription: restaurant.shortDescription,
          servesCuisine:    restaurant.servesCuisine,
          priceRange:       restaurant.priceRange,
          phone:            restaurant.phone,
          websiteUrl:       restaurant.websiteUrl,
          primaryImageUrl:  restaurant.primaryImageUrl,
          address:          restaurant.address,
          sameAsLinks:      restaurant.sameAsLinks,
          menuUrl:          restaurant.menuUrl,
          reservationUrl:   restaurant.reservationUrl,
          schemaEnabled:    restaurant.schemaEnabled,
        },
        pageUrl
      )
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
        />
      )}
      <DishTemplate
        title={dish.title ?? ""}
        subtitle={dish.description ?? ""}
        story={dish.story}
        features={dish.features}
        quoteText={dish.quoteText}
        quoteSource={dish.quoteSource}
        gallery={dish.gallery}
        wistiaVideoId={dish.wistiaVideoId}
        heroImageUrl={dish.heroImageUrl}
        ctaTitle={dish.ctaTitle}
        ctaSubtitle={dish.ctaSubtitle}
        ctaNote={dish.ctaNote}
        ctas={dish.ctas}
        restaurantSlug={rs}
        restaurantName={restaurant?.name}
        restaurantTagline={restaurant?.tagline}
        prevDishSlug={dish.prevDishSlug}
        nextDishSlug={dish.nextDishSlug}
      />
    </>
  );
}
