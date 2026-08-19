/**
 * Chef's Canvas — Schema Generator
 * Converts Sanity dish and restaurant fields into valid JSON-LD
 * structured data for Google and AI discovery systems.
 *
 * Human-friendly inputs → Machine-friendly outputs.
 * Editors fill in plain fields. This file does the conversion.
 */

// ── Diet mapping ─────────────────────────────────────────────────────────────
// Maps Sanity controlled values to Schema.org diet URLs
const dietMap: Record<string, string> = {
  vegetarian: "https://schema.org/VegetarianDiet",
  vegan:      "https://schema.org/VeganDiet",
  gluten_free:"https://schema.org/GlutenFreeDiet",
  dairy_free: "https://schema.org/DairyFreeDiet",
  kosher:     "https://schema.org/KosherDiet",
  halal:      "https://schema.org/HalalDiet",
  low_carb:   "https://schema.org/LowCalorieDiet",
};

// ── Types ─────────────────────────────────────────────────────────────────────
export type SchemaRestaurant = {
  name: string;
  slug: string;
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

export type SchemaDish = {
  title: string;
  slug: string;
  description?: string;
  ingredientsSummary?: string;
  preparationMethod?: string[];
  keywords?: string[];
  culinaryRegion?: string[];
  price?: number;
  currency?: string;
  heroImageUrl?: string;
  videoThumbnailUrl?: string;
  wistiaVideoId?: string;
  videoTitle?: string;
  videoDescription?: string;
  videoUploadDate?: string;
  videoDurationMinutes?: number;
  videoDurationSeconds?: number;
  videoTranscript?: string;
  suitableForDiet?: string;
  allergenTags?: string[];
  quoteText?: string;
  quoteSource?: string;
  reviewerName?: string;
  reviewerRating?: number;
  reviewDate?: string;
  quoteApprovedSchema?: boolean;
  schemaMenuitemEnabled?: boolean;
  schemaVideoEnabled?: boolean;
  schemaReviewEnabled?: boolean;
  canonicalUrl?: string;
};

// ── Main graph builder ────────────────────────────────────────────────────────
export function buildDishPageGraph(
  dish: SchemaDish,
  restaurant: SchemaRestaurant,
  pageUrl: string
): object {
  const nodes: object[] = [];

  // ── Restaurant node ──────────────────────────────────────────────────────
  if (restaurant.schemaEnabled !== false) {
    const restaurantNode: Record<string, unknown> = {
      "@type": "Restaurant",
      "@id":   `https://${restaurant.slug}.chefs-canvas.com/#restaurant`,
      "name":  restaurant.name,
    };

    if (restaurant.shortDescription) {
      restaurantNode["description"] = restaurant.shortDescription;
    }
    if (restaurant.servesCuisine) {
      restaurantNode["servesCuisine"] = restaurant.servesCuisine;
    }
    if (restaurant.priceRange) {
      restaurantNode["priceRange"] = restaurant.priceRange;
    }
    if (restaurant.phone) {
      restaurantNode["telephone"] = restaurant.phone;
    }
    if (restaurant.websiteUrl) {
      restaurantNode["url"] = restaurant.websiteUrl;
    }
    if (restaurant.primaryImageUrl) {
      restaurantNode["image"] = restaurant.primaryImageUrl;
    }
    if (restaurant.menuUrl) {
      restaurantNode["hasMenu"] = restaurant.menuUrl;
    }
    if (restaurant.reservationUrl) {
      restaurantNode["reservations"] = restaurant.reservationUrl;
    }
    if (restaurant.address) {
      const a = restaurant.address;
      restaurantNode["address"] = {
        "@type":           "PostalAddress",
        "streetAddress":   a.street,
        "addressLocality": a.city,
        "addressRegion":   a.state,
        "postalCode":      a.zip,
        "addressCountry":  a.country ?? "US",
      };
    }
    if (restaurant.sameAsLinks?.length) {
      restaurantNode["sameAs"] = restaurant.sameAsLinks;
    }

    nodes.push(restaurantNode);
  }

  // ── MenuItem node ────────────────────────────────────────────────────────
  if (dish.schemaMenuitemEnabled !== false) {
    const menuItemNode: Record<string, unknown> = {
      "@type": "MenuItem",
      "@id":   `${pageUrl}#menuitem`,
      "name":  dish.title,
    };

    // Description — prefer ingredientsSummary, fall back to short description
    const description = dish.ingredientsSummary || dish.description;
    if (description) {
      menuItemNode["description"] = description;
    }

    // Image
    if (dish.heroImageUrl) {
      menuItemNode["image"] = dish.heroImageUrl;
    }

    // Price offer
    if (dish.price != null) {
      menuItemNode["offers"] = {
        "@type":         "Offer",
        "price":         String(dish.price),
        "priceCurrency": dish.currency ?? "USD",
      };
    }
// Cooking methods — one additionalProperty entry per selected method
    if (dish.preparationMethod && dish.preparationMethod.length > 0) {
      const cookingMethodProps = dish.preparationMethod.map((method) => ({
        "@type": "PropertyValue",
        "name":  "cookingMethod",
        "value": method,
      }));
      menuItemNode["additionalProperty"] = [
        ...((menuItemNode["additionalProperty"] as object[]) || []),
        ...cookingMethodProps,
      ];
    }
  // Keywords — output as additionalProperty entries for Schema.org strict compliance.
    // keywords is not formally on MenuItem's property list, so we wrap each tag as a PropertyValue.
    if (dish.keywords && dish.keywords.length > 0) {
      const keywordProps = dish.keywords.map((kw) => ({
        "@type": "PropertyValue",
        "name":  "keyword",
        "value": kw,
      }));
      menuItemNode["additionalProperty"] = [
        ...((menuItemNode["additionalProperty"] as object[]) || []),
        ...keywordProps,
      ];
    }
    // Culinary regions — one additionalProperty entry per selected region
    if (dish.culinaryRegion && dish.culinaryRegion.length > 0) {
      const culinaryRegionProps = dish.culinaryRegion.map((region) => ({
        "@type": "PropertyValue",
        "name":  "culinaryRegion",
        "value": region,
      }));
      menuItemNode["additionalProperty"] = [
        ...((menuItemNode["additionalProperty"] as object[]) || []),
        ...culinaryRegionProps,
      ];
    }
    // Dietary

// Allergens — one additionalProperty entry per allergen, preserving prior entries
    if (dish.allergenTags && dish.allergenTags.length > 0) {
      const allergenProps = dish.allergenTags.map((tag) => ({
        "@type": "PropertyValue",
        "name":  "allergen",
        "value": tag,
      }));
      menuItemNode["additionalProperty"] = [
        ...((menuItemNode["additionalProperty"] as object[]) || []),
        ...allergenProps,
      ];
    }

// Link back to restaurant — using provider despite Schema.org strict validator warning.
    // provider is not formally on MenuItem's property list, but Google and AI systems parse it correctly.
    // A cleaner solution comes when Menu and MenuSection schema are built on menu pages —
    // at that point the Restaurant → Menu → MenuSection → MenuItem hierarchy replaces this direct link.
    if (restaurant.schemaEnabled !== false) {
      menuItemNode["provider"] = {
        "@id": `https://${restaurant.slug}.chefs-canvas.com/#restaurant`,
      };
    }

    nodes.push(menuItemNode);
  }

  // ── VideoObject node ─────────────────────────────────────────────────────
    // ── VideoObject node ─────────────────────────────────────────────────────
  // Only generated when schema_video_enabled = true AND a video exists
  if (dish.schemaVideoEnabled && dish.wistiaVideoId) {
    const embedUrl = `https://fast.wistia.net/embed/iframe/${dish.wistiaVideoId}`;

    const videoNode: Record<string, unknown> = {
      "@type":    "VideoObject",
      "@id":      `${pageUrl}#video`,
      "name":     dish.videoTitle || dish.title,
      "embedUrl": embedUrl,
    };

    if (dish.videoDescription || dish.description) {
      videoNode["description"] = dish.videoDescription || dish.description;
    }
    if (dish.videoThumbnailUrl || dish.heroImageUrl) {
      videoNode["thumbnailUrl"] = dish.videoThumbnailUrl || dish.heroImageUrl;
    }

    // Upload date — required by Google for valid VideoObject schema
    if (dish.videoUploadDate) {
      videoNode["uploadDate"] = dish.videoUploadDate;
    }

    // Duration — required by Google. Assemble ISO 8601 from minutes and seconds fields.
    // Format: PT[M]M[S]S — for example PT2M30S = 2 minutes 30 seconds.
    // Only output if at least one of minutes or seconds has a positive value.
    const mins = dish.videoDurationMinutes ?? 0;
    const secs = dish.videoDurationSeconds ?? 0;
    if (mins > 0 || secs > 0) {
      videoNode["duration"] = `PT${mins}M${secs}S`;
    }

    // Transcript — optional but highly valuable for AI systems reading video content
    if (dish.videoTranscript) {
      videoNode["transcript"] = dish.videoTranscript;
    }

    // TODO: contentUrl — requires Wistia API integration to fetch the direct video file URL.
    // Deferred until Wistia API automation is built (see roadmap Item A1 automation path).

    nodes.push(videoNode);
  }
  // ── Review node ──────────────────────────────────────────────────────────
  // Double gate: schema_review_enabled AND quote_approved_schema must both be true
  if (
    dish.schemaReviewEnabled &&
    dish.quoteApprovedSchema &&
    dish.quoteText
  ) {
    const reviewNode: Record<string, unknown> = {
      "@type":      "Review",
      "reviewBody": dish.quoteText,
      "author": {
        "@type": "Person",
        "name":  dish.reviewerName || dish.quoteSource || "Guest",
      },
      "itemReviewed": {
        "@id": `${pageUrl}#menuitem`,
      },
    };

    if (dish.reviewerRating != null) {
      reviewNode["reviewRating"] = {
        "@type":       "Rating",
        "ratingValue": dish.reviewerRating,
        "bestRating":  5,
      };
    }

    if (dish.reviewDate) {
      reviewNode["datePublished"] = dish.reviewDate;
    }

    nodes.push(reviewNode);
  }

  return {
    "@context": "https://schema.org",
    "@graph":   nodes,
  };
}
