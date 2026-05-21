import { PortableText } from "@portabletext/react";
import WistiaEmbed from "./WistiaEmbed";
import ShareButton from "./ShareButton";
import SaveButton from "./SaveButton";
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


const restaurantMeta: Record<string, { name: string; tagline: string }> = {
  "rosa-figlio": { name: "Rosa & Figlio", tagline: "TUSCAN • CHIANTI • RISOTTO" },
  "ember-and-oak": { name: "Ember & Oak", tagline: "FIRE • BONE • BUTTER" },
  "alta-marina": { name: "Alta Marina", tagline: "COASTAL • CITRUS • CHAR" },
  "negashs-ethiopian-cafe": { name: "Negash's Ethiopian Cafe", tagline: "COFFEE • INJERA • WAT" },
  "seasons-52": { name: "Seasons 52", tagline: "FRESH • SEASONAL • WOOD-FIRED • WINE BAR" },
};
export default function DishTemplate({
  title,
  subtitle,
  story,
  features,
  quoteText,
  quoteSource,
  gallery,
  wistiaVideoId,
  heroImageUrl,

  ctaTitle,
  ctaSubtitle,
  ctaNote,
  ctas,

  restaurantSlug,
  prevDishSlug,
  nextDishSlug,
}: {
  title: string;
  subtitle: string;
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

  restaurantSlug: string;
  prevDishSlug?: string;
  nextDishSlug?: string;
}) {
  const g0 = gallery?.[0];
  const g1 = gallery?.[1];
  const g2 = gallery?.[2];

const previousHref = prevDishSlug
  ? `/${restaurantSlug}/dish/${prevDishSlug}`
  : undefined;

const nextHref = nextDishSlug
  ? `/${restaurantSlug}/dish/${nextDishSlug}`
  : undefined;
  const displayQuoteText =
    quoteText ??
    "One of the most memorable dishes I’ve had in years — rich, comforting, and beautifully presented.";

  const displayQuoteSource = quoteSource ?? "Prototype Guest Review";const meta = restaurantMeta[restaurantSlug] ?? {
    name: restaurantSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    tagline: "",
  };

  return (
    <div className="page" data-restaurant={restaurantSlug}>
      <a href="#" className="return-directory">
        ← Return to Restaurant Directory
      </a>

      <header className="top-header">
        <div className="logo-placeholder">
          {meta.name}
          <span className="mark">{meta.tagline}</span>
        </div>

        <div className="dish-heading">
          <div className="dish-title">{title}</div>
          <div className="dish-subtitle">{subtitle}</div>
        </div>

        <div className="qr-box-header">
          QR Code
          <br />
          view this dish
          <br />
          on your phone
        </div>
      </header>

      <div className="header-divider"></div>

      <section className="hero-grid">
        <div className="hero-left">
          <div className="hero-video">
            <div className="hero-video-inner">
              {wistiaVideoId ? (
                <WistiaEmbed
                  wistiaVideoId={wistiaVideoId}
                  className="h-full w-full"
                />
              ) : heroImageUrl ? (
                <img
                  src={heroImageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="play-button"></div>
              )}
            </div>
          </div>

          <div className="video-nav-unified">
           <SaveButton />

            {previousHref ? (
  <form action={previousHref} style={{ display: "contents" }}>
    <button type="submit" className="nav-button">
      <span className="icon">←</span> Previous
    </button>
  </form>
) : (
  <button type="button" className="nav-button" disabled>
    <span className="icon">←</span> Previous
  </button>
)}

          <form action={`/${restaurantSlug}/menu`} style={{ display: "contents" }}>
  <button type="submit" className="nav-button">
    <span className="icon"></span>Back to Menu
  </button>
</form>

{nextHref ? (
  <form action={nextHref} style={{ display: "contents" }}>
    <button type="submit" className="nav-button">
      Next <span className="icon">→</span>
    </button>
  </form>
) : (
  <button type="button" className="nav-button" disabled>
    Next <span className="icon">→</span>
  </button>
)}

           <ShareButton />
          </div>
        </div>

        <aside className="cta-panel">
          <div className="cta-title">{ctaTitle ?? "Make It a Tuscan Night"}</div>

          <div className="cta-subtitle" style={{ textAlign: "center" }}>
            {ctaSubtitle ??
              "This section will become CMS-controlled in a later Phase 3 step."}
          </div>

          <div className="cta-buttons">
            {ctas?.length
              ? ctas
                  .filter((c) => c?.enabled !== false)
                  .map((c, i) => (
                    <a
                      key={`cta-${i}`}
                      href={c?.url ?? "#"}
                      className={`cta-button${c?.isPrimary ? " primary" : ""}`}
                    >
                      {c?.label ?? "CTA"}
                    </a>
                  ))
              : (
                <>
                  <a href="#" className="cta-button primary">
                    Reserve a Table
                  </a>
                  <a href="#" className="cta-button">
                    Order for Pickup
                  </a>
                  <a href="#" className="cta-button">
                    Join Our Email List
                  </a>
                  <a href="#" className="cta-button">
                    Get Directions
                  </a>
                  <a href="#" className="cta-button">
                    Call Restaurant
                  </a>
                </>
              )}
          </div>

          <div className="cta-note">
            {ctaNote ?? "CTA content stays static for now (Phase 3 safety rule)."}
          </div>
        </aside>
      </section>

      <section className="story-quote-grid">
        <article className="story-column">
          <h2 className="story-title">The Story Behind the Dish</h2>
          {story?.length ? (
            <div className="story-body">
              <PortableText value={story} />
            </div>
          ) : null}
        </article>

        <section className="features-wrapper">
          <h2 className="features-title">Features</h2>
          <div className="features-list">
            {features?.length ? (
              <>
               {features?.length ? (
  <>
    <ul>
      {features.slice(0, Math.ceil(features.length / 2)).map((item, i) => (
        <li key={`f1-${i}`}>{item}</li>
      ))}
    </ul>
    <ul>
      {features.slice(Math.ceil(features.length / 2)).map((item, i) => (
        <li key={`f2-${i}`}>{item}</li>
      ))}
    </ul>
  </>
) : null}
              </>
            ) : null}
          </div>
        </section>

        <div className="quote-column">
          <div className="quote-bubble">
            “{displayQuoteText}”
            <div className="quote-source">{displayQuoteSource}</div>
          </div>
        </div>
      </section>

      <section className="gallery-row">
        <div className="gallery-item">
          {g0?.url ? (
            <img
              src={g0.url}
              alt={g0.alt ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>

        <div className="gallery-item">
          {g1?.url ? (
            <img
              src={g1.url}
              alt={g1.alt ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>

        <div className="gallery-item">
          {g2?.url ? (
            <img
              src={g2.url}
              alt={g2.alt ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
