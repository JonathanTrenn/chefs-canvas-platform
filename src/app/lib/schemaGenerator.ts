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
  preparationMethod?: string;
  price?: number;
  currency?: string;
  heroImageUrl?: string;
  videoThumbnailUrl?: string;
  wistiaVideoId?: string;
  videoTitle?: string;
  videoDescription?: string;
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
// Cooking method — output as additionalProperty for strict Schema.org compliance
    if (dish.preparationMethod) {
      const cookingMethodProp = {
        "@type": "PropertyValue",
        "name":  "cookingMethod",
        "value": dish.preparationMethod,
      };
      menuItemNode["additionalProperty"] = [
        ...((menuItemNode["additionalProperty"] as object[]) || []),
        cookingMethodProp,
      ];
    }
    // Dietary
    if (dish.suitableForDiet && dietMap[dish.suitableForDiet]) {
      menuItemNode["suitableForDiet"] = dietMap[dish.suitableForDiet];
    }

    // Allergens as additionalProperty
    if (dish.allergenTags?.length) {
      menuItemNode["additionalProperty"] = dish.allergenTags.map(tag => ({
        "@type": "PropertyValue",
        "name":  "allergen",
        "value": tag,
      }));
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
