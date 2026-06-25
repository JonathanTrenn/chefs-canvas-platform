import { notFound } from "next/navigation";
import { client } from "../../../sanity/client";

export const dynamic = "force-dynamic";

type Restaurant = {
  name: string;
  slug: string;
  tagline?: string;
  lightDarkPreference?: string;
  backgroundColor?: string;
  textPrimaryColor?: string;
  accentColor?: string;
  headingFont?: string;
  bodyFont?: string;
  websiteUrl?: string;
};

type Menu = {
  title: string;
  menuType?: string;
  introText?: string;
  courseLabelOverrides?: { courseType: string; label: string }[];
};

type Dish = {
  title: string;
  slug: string;
  description?: string;
  price?: number;
  courseType?: string;
  hasDishPage: boolean;
};

const COURSE_ORDER = [
  "appetizer","soup","salad","pasta","main",
  "seafood","meat","vegetarian","side","dessert","beverage","other",
];

const COURSE_LABELS: Record<string, string> = {
  appetizer: "Appetizers",
  soup: "Soups",
  salad: "Salads",
  pasta: "Pasta",
  main: "Main Courses",
  seafood: "Seafood",
  meat: "Meats",
  vegetarian: "Vegetarian",
  side: "Sides",
  dessert: "Desserts",
  beverage: "Beverages",
  other: "Additional Items",
};

const DARK = {
  background: "#2b201f",
  text: "#f7ecde",
  accent: "#f3d0ae",
  sectionBorder: "rgba(255,255,255,0.1)",
  dishBorder: "rgba(255,255,255,0.08)",
  linkColor: "rgba(247,236,222,0.55)",
  backBg: "#f4e1c9",
  backColor: "#3e2520",
};

const LIGHT = {
  background: "#FAF4E6",
  text: "#2A2A2A",
  accent: "#7B2D1E",
  sectionBorder: "rgba(0,0,0,0.15)",
  dishBorder: "rgba(0,0,0,0.08)",
  linkColor: "rgba(42,42,42,0.6)",
  backBg: "#3e2520",
  backColor: "#fdf7eb",
};

async function getRestaurant(rs: string): Promise<Restaurant | null> {
  return client.fetch(
    `*[_type == "restaurant" && slug.current == $rs][0]{
      name, "slug": slug.current, tagline, lightDarkPreference,
      backgroundColor, textPrimaryColor, accentColor, headingFont, bodyFont, websiteUrl
    }`,
    { rs }
  );
}

async function getMenuWithDishes(rs: string): Promise<{ menu: Menu; dishes: Dish[] } | null> {
  const result = await client.fetch(
    `{
      "menu": *[_type == "menu" && restaurant->slug.current == $rs && isPublished == true][0]{
        title, menuType, introText,
        "courseLabelOverrides": courseLabelOverrides[]{
          courseType, label
        }
      },
      "dishes": *[_type == "dish" && restaurant->slug.current == $rs && isPublished == true]{
        title, "slug": slug.current, description, price, courseType
      }
    }`,
    { rs }
  );
  if (!result.menu) return null;
  const dishes: Dish[] = (result.dishes ?? []).map((d: any) => ({
    ...d,
    hasDishPage: !!d.slug,
  }));
  return { menu: result.menu, dishes };
}

function groupByCourse(dishes: Dish[]): { courseType: string; dishes: Dish[] }[] {
  const map: Record<string, Dish[]> = {};
  for (const dish of dishes) {
    const key = dish.courseType ?? "other";
    if (!map[key]) map[key] = [];
    map[key].push(dish);
  }
  return COURSE_ORDER.filter((c) => map[c]?.length).map((c) => ({ courseType: c, dishes: map[c] }));
}

function getCourseLabel(
  courseType: string,
  overrides?: { courseType: string; label: string }[]
): string {
  if (overrides?.length) {
    const match = overrides.find((o) => o.courseType === courseType);
    if (match?.label) return match.label;
  }
  return COURSE_LABELS[courseType] ?? courseType;
}

export default async function MenuPage(props: {
  params: Promise<{ restaurantSlug: string }>;
}) {
  const { restaurantSlug: rs } = await props.params;
  if (!rs) notFound();

  const [restaurant, menuData] = await Promise.all([
    getRestaurant(rs),
    getMenuWithDishes(rs),
  ]);

  if (!restaurant) notFound();
  if (!menuData) {
    return (
      <div style={{ padding: "40px", fontFamily: "Georgia, serif", textAlign: "center" }}>
        <p>No published menu found for this restaurant.</p>
        <a href="/">Return to Directory</a>
      </div>
    );
  }

  const { menu, dishes } = menuData;
  const grouped = groupByCourse(dishes);
  const isDark = restaurant.lightDarkPreference === "dark";
  const d = isDark ? DARK : LIGHT;
  const bg = restaurant.backgroundColor ?? d.background;
  const textColor = restaurant.textPrimaryColor ?? d.text;
  const accent = restaurant.accentColor ?? d.accent;
  const hFont = restaurant.headingFont ?? "Georgia, serif";
  const bFont = restaurant.bodyFont ?? "Georgia, serif";

  return (
    <div style={{ margin: 0, minHeight: "100vh", background: bg, color: textColor, fontFamily: bFont }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 18px 60px" }}>

        <header style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "1.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: hFont, fontWeight: 700 }}>
            {restaurant.name}
          </div>
          {restaurant.tagline && (
            <div style={{ fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7, marginTop: "6px" }}>
              {restaurant.tagline}
            </div>
          )}
          <div style={{ fontSize: "1.1rem", marginTop: "10px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85 }}>
            {menu.title}
          </div>
          {menu.introText && (
            <div style={{ marginTop: "12px", fontSize: "0.95rem", opacity: 0.82, maxWidth: "700px", margin: "12px auto 0", lineHeight: 1.55 }}>
              {menu.introText}
            </div>
          )}
          <a href={restaurant.websiteUrl ?? "#"} style={{ display: "inline-block", marginTop: "16px", padding: "8px 16px", borderRadius: "999px", border: "1px solid rgba(0,0,0,0.2)", background: d.backBg, color: d.backColor, textDecoration: "none", fontSize: "0.85rem" }}>
            Back to {restaurant.name}
          </a>
        </header>

        {grouped.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.7 }}>No dishes found on this menu.</p>
        )}

        {grouped.map(({ courseType, dishes: sd }) => (
          <section key={courseType} style={{ marginBottom: "36px" }}>
            <div style={{ fontSize: "0.95rem", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "12px", color: accent, borderBottom: `1px solid ${d.sectionBorder}`, paddingBottom: "8px", fontFamily: hFont }}>
              {getCourseLabel(courseType, menu.courseLabelOverrides)}
            </div>
            {sd.map((dish) => (
              <div key={dish.slug ?? dish.title} style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderBottom: `1px solid ${d.dishBorder}` }}>
                <div style={{ maxWidth: "760px" }}>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {dish.hasDishPage ? (
                      <>
                        <a href={`/${rs}/dish/${dish.slug}`} style={{ color: "inherit", textDecoration: "none", borderBottom: `1px dotted ${d.linkColor}` }}>
                          {dish.title}
                        </a>
                        <span style={{ marginLeft: "8px", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: accent, opacity: 0.95 }}>
                          Featured Dish
                        </span>
                      </>
                    ) : (
                      dish.title
                    )}
                  </div>
                  {dish.description && (
                    <div style={{ fontSize: "0.9rem", opacity: 0.82, marginTop: "4px", lineHeight: 1.45 }}>
                      {dish.description}
                    </div>
                  )}
                </div>
                {dish.price && (
                  <div style={{ whiteSpace: "nowrap", fontSize: "0.95rem", opacity: 0.95, paddingLeft: "10px" }}>
                    ${dish.price}
                  </div>
                )}
              </div>
            ))}
          </section>
        ))}

      </div>
    </div>
  );
}

