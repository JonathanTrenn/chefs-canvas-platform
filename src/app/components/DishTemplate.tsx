import { PortableText } from "@portabletext/react";
import WistiaEmbed from "./WistiaEmbed";

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

  // Ticket 3.6.3a (CTA wiring)
  ctaTitle,
  ctaSubtitle,
  ctaNote,
  ctas,
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

  // Ticket 3.6.3a (CTA wiring)
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaNote?: string;
  ctas?: DishCta[];
}) {
  const g0 = gallery?.[0];
  const g1 = gallery?.[1];
  const g2 = gallery?.[2];

  return (
    <div className="page">
      <a href="#" className="return-directory">
        ← Return to Restaurant Directory
      </a>

      {/* HEADER */}
      <header className="top-header">
        <div className="logo-placeholder">
          ROSA &amp; FIGLIO
          <span className="mark">TUSCAN • CHIANTI • RISOTTO</span>
        </div>

        <div className="dish-heading">
          <div className="dish-title">{title}</div>
          <div className="dish-subtitle">{subtitle}</div>
        </div>

        <div className="qr-box-header">
          QR Code<br />
          view this dish<br />
          on your phone
        </div>
      </header>

      <div className="header-divider"></div>

      {/* HERO */}
      <section className="hero-grid">
        {/* LEFT: video + nav */}
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

          {/* UNIFIED NAV BAR */}
          <div className="video-nav-unified">
            <button className="nav-button">
              <span className="icon">★</span> Save
            </button>

            <button className="nav-button">
              <span className="icon">←</span> Previous
            </button>

            <a href="#" className="nav-button">
              <span className="icon"></span>Back to Menu
            </a>

            <button className="nav-button">
              Next <span className="icon">→</span>
            </button>

            <button className="nav-button">
              <span className="icon">↗</span> Share
            </button>
          </div>
        </div>

        {/* RIGHT: CTA (still hardcoded for now) */}
        <aside className="cta-panel">
          <div className="cta-title">Make It a Tuscan Night</div>
          <div className="cta-subtitle">
            Red wine, rosemary, and slow heat—this is the dish that turns dinner
            into an occasion.
          </div>

          <div className="cta-buttons">
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
              Call Rosa &amp; Figlio
            </a>
          </div>

          <div className="cta-note">
            In a full Chef’s Canvas rollout, these buttons connect directly to
            reservations, ordering, and maps—so guests can move from story to
            action in one tap.
          </div>
        </aside>
      </section>

      {/* STORY + FEATURES + QUOTE */}
      <section className="story-quote-grid">
        {/* STORY */}
        <article className="story-column">
          <h2 className="story-title">The Story Behind the Dish</h2>
          {story?.length ? (
            <div className="story-body">
              <PortableText value={story} />
            </div>
          ) : null}
        </article>

        {/* FEATURES */}
        <section className="features-wrapper">
          <h2 className="features-title">Features</h2>
          <div className="features-list">
            {features?.length ? (
              <>
                <ul>
                  {features.slice(0, 3).map((item, i) => (
                    <li key={`f1-${i}`}>{item}</li>
                  ))}
                </ul>
                <ul>
                  {features.slice(3, 6).map((item, i) => (
                    <li key={`f2-${i}`}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </section>

        {/* QUOTE (CMS-driven) */}
        <div className="quote-column">
          {quoteText ? (
            <div className="quote-bubble">
              “{quoteText}”
              {quoteSource ? (
                <div className="quote-source">{quoteSource}</div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* GALLERY (CMS-driven images, structure preserved) */}
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