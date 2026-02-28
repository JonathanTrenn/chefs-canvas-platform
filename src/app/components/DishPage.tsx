import React from 'react';
import './DishPage.css'; // This connects your custom CSS file

interface DishPageProps {
  restaurantName: string;
  restaurantTagline: string;
  dishTitle: string;
  dishSubtitle: string;
  dishDescription: string;
  price: number;
  currency: string;
  videoUrl: string;
  storyHeading: string;
  storyBody1: string;
  storyBody2: string;
  features: string[];
  guestQuote: string;
  guestSource: string;
  primaryCtaText: string;
  primaryCtaLink: string;
}

const DishPage: React.FC<DishPageProps> = (props) => {
  return (
    <div className="dish-page-body">
      <div className="page-card">
        
        {/* Top Navigation */}
        <div className="site-nav">
             <a href="#" className="site-nav-link">Rosa & Figlio</a>
             <a href="#" className="site-nav-link site-nav-link--active">Current Dish</a>
        </div>
        
        <a href="/menu" style={{textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', opacity: 0.7, display:'block', marginBottom:'1rem'}}>
          ← Return to Restaurant Directory
        </a>

        {/* HEADER */}
        <header className="top-header">
          <div className="logo-placeholder">
            {props.restaurantName}
            <span style={{display:'block', fontSize:'0.7rem', opacity:0.9, marginTop:'4px'}}>
                {props.restaurantTagline}
            </span>
          </div>

          <div className="dish-heading">
            <div className="dish-title">{props.dishTitle}</div>
            <div className="dish-subtitle">{props.dishSubtitle}</div>
          </div>

          <div className="qr-box-header">
            QR Code<br/>Desktop Only
          </div>
        </header>

        <div className="header-divider"></div>

        {/* HERO */}
        <section className="hero-grid">
          <div className="hero-left">
            <div className="hero-video">
                {/* Video Placeholder */}
                <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <div style={{width:'80px', height:'50px', background:'rgba(0,0,0,0.5)', borderRadius:'10px', border:'1px solid white'}}></div>
                </div>
            </div>

            <div className="video-nav-unified">
               <button className="nav-button">★ Save</button>
               <button className="nav-button">← Prev</button>
               <button className="nav-button">Back to Menu</button>
               <button className="nav-button">Next →</button>
               <button className="nav-button">↗ Share</button>
            </div>
          </div>

          <aside className="cta-panel">
            <div style={{fontSize:'1.05rem', fontWeight:700, textTransform:'uppercase', marginBottom:'6px', textAlign:'center'}}>
                Make it a Night
            </div>
            <p style={{fontSize:'0.9rem', opacity:0.96, fontStyle:'italic', marginBottom:'14px', textAlign:'center'}}>
                Reserve your table instantly.
            </p>

            <div className="cta-buttons">
              <a href={props.primaryCtaLink} className="cta-button primary">{props.primaryCtaText}</a>
              <a href="#" className="cta-button">Share this Dish</a>
              <a href="#" className="cta-button">Get Directions</a>
            </div>
          </aside>
        </section>

        {/* STORY */}
        <section className="story-quote-grid">
          <article className="story-column">
            <h2 className="story-title">{props.storyHeading}</h2>
            <p className="story-body">{props.storyBody1}</p>
            <p className="story-body">{props.storyBody2}</p>

            <div className="features-wrapper">
                <h3 style={{fontSize:'1rem', fontWeight:700, textTransform:'uppercase', color:'#3e281d', marginTop:'20px'}}>Features</h3>
                <div className="features-list">
                    <ul>
                        {props.features.map((f, i) => <li key={i}><span>{f}</span></li>)}
                    </ul>
                </div>
            </div>
          </article>

          <div className="quote-column">
            <div className="quote-bubble">
               "{props.guestQuote}"
               <div style={{marginTop:'8px', fontSize:'0.82rem', opacity:0.9}}>— {props.guestSource}</div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="gallery-row">
            <div className="gallery-item">Gallery 1</div>
            <div className="gallery-item">Gallery 2</div>
            <div className="gallery-item">Gallery 3</div>
        </section>

      </div>
    </div>
  );
};

export default DishPage;