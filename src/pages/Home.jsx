import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Check, Code2, Database, Sparkles } from "lucide-react";
import { site, stats, technologies, services, projects, process } from "../data";
import SectionTitle from "../components/SectionTitle";

/*
  Real technology logos, self-hosted in public/logos (official multicolor
  brand SVGs from the Devicon / Simple Icons projects, previously hot-linked
  from two external CDNs). Serving them from our own origin removes two
  extra DNS/TLS handshakes and the dependency on a moving @latest CDN tag.
  If a file is ever missing, TechLogo renders a colored text monogram instead
  of a broken-image icon.
*/
const techLogos = {
  HTML5: ["/logos/html5.svg"],
  CSS3: ["/logos/css3.svg"],
  JavaScript: ["/logos/javascript.svg"],
  React: ["/logos/react.svg"],
  Vite: ["/logos/vite.svg"],
  Git: ["/logos/git.svg"],
  PHP: ["/logos/php.svg"],
  Laravel: ["/logos/laravel.svg"],
  // Django's official bottle green (#092E20) is invisible on a dark theme,
  // so this variant uses the same mark in a lightened brand green.
  Django: ["/logos/django.svg"],
  "REST APIs": ["/logos/rest-api.svg"],
  Figma: ["/logos/figma.svg"],
  Photoshop: ["/logos/photoshop.svg"],
  // Next.js's official mark is a black circle; CSS inverts it in dark mode
  // so it stays visible on both themes (see .tech-logo--next).
  "Next.js": ["/logos/nextjs.svg"],
  Tailwind: ["/logos/tailwind.svg"],
  Bootstrap: ["/logos/bootstrap.svg"],
  MySQL: ["/logos/mysql.svg"],
  WordPress: ["/logos/wordpress.svg"],
  Shopify: ["/logos/shopify.svg"]
};

/*
  Hero image slideshow: the five photos in public/images rotate every
  3 seconds with a CSS opacity crossfade. Images are stacked in the DOM
  (so they preload) and the timer is cleared on unmount. If a photo fails
  to load it is skipped and the current photo stays visible.

  Each photo is shipped as 700w / 1000w WebP derivatives and offered through
  srcset, so phones download the small file and high-density screens get the
  larger one. The originals stay untouched in public/images.
*/
const heroSizes = "(max-width: 720px) calc(100vw - 56px), 482px";

function heroSrcSet(src) {
  const base = src.replace(/\.webp$/, "");
  return `${base}-700.webp 700w, ${base}-1000.webp 1000w`;
}
const heroImages = [
  { src: "/images/abdul-bari-library.webp", alt: "Abdul Bari Rahmani, full-stack web developer" },
  { src: "/images/abdul-bari-coding.webp", alt: "Abdul Bari Rahmani working on a web project" },
  { src: "/images/abdul-bari-portfolio.webp", alt: "Portrait of Abdul Bari Rahmani" },
  { src: "/images/abdul-bari-reading.webp", alt: "Abdul Bari Rahmani at work" },
  { src: "/images/abdul-bari-speaking.webp", alt: "Abdul Bari Rahmani, React and Django developer" }
];

function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(() => new Set());

  const working = useMemo(
    () => heroImages.filter((image) => !failed.has(image.src)),
    [failed]
  );

  useEffect(() => {
    if (working.length < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [working.length]);

  // First non-failed photo starting at the active index stays visible.
  const shown = useMemo(() => {
    for (let i = 0; i < heroImages.length; i += 1) {
      const image = heroImages[(active + i) % heroImages.length];
      if (!failed.has(image.src)) return image;
    }
    return null;
  }, [active, failed]);

  
  return (
    <div className="hero-slideshow">
      {heroImages.map((image, index) =>
        failed.has(image.src) ? null : (
          <img
            key={image.src}
            className={`hero-slide${shown === image ? " is-active" : ""}`}
            src={image.src}
            alt={shown === image ? image.alt : ""}
            aria-hidden={shown !== image}
            srcSet={heroSrcSet(image.src)}
            sizes={heroSizes}
            width="480"
            height="470"
            loading={index < 2 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
            decoding="async"
            onError={() =>
              setFailed((current) => {
                const next = new Set(current);
                next.add(image.src);
                return next;
              })
            }
          />
        )
      )}
    </div>
  );
}

function TechLogo({ tech }) {
  const sources = techLogos[tech.name] || [];
  const [step, setStep] = useState(0);

  if (step >= sources.length) {
    return (
      <span
        className="tech-logo-fallback"
        style={{ color: tech.color }}
        aria-hidden="true"
      >
        {tech.name.replace(/[^A-Za-z]/g, "").slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      className={tech.name === "Next.js" ? "tech-logo tech-logo--next" : "tech-logo"}
      src={sources[step]}
      alt={`${tech.name} logo`}
      width="46"
      height="46"
      loading="lazy"
      onError={() => setStep((current) => current + 1)}
    />
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">SALAM 👋 — I'M {site.name.toUpperCase()}</p>
            <h1>{site.heroTitle}</h1>
            <p className="hero-text">{site.heroDescription}</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/portfolio">View my work <ArrowUpRight size={17}/></Link>
              <Link className="button button-ghost" to="/contact">Let's talk <ArrowUpRight size={17}/></Link>
            </div>
            <div className="hero-meta">
              <span><Check size={15}/> {site.role}</span>
              <span><Check size={15}/> {site.location}</span>
               <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                <Check size={15}/> {site.phone}
               </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card main-card profile-image-card">
              <HeroSlideshow />

           <div className="visual-caption">
          <span>Available for meaningful work</span>
          <span className="pulse-dot" />
        </div>
       </div>

       <div className="floating-card card-one">
       <Code2 size={19} />
       <span>Clean code</span>
       </div>

        <div className="floating-card card-two">
          <Database size={19} />
         <span>Reliable backend</span>
      </div>
      </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          {stats.map((item) => <div className="stat" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            // eyebrow="TECHNOLOGY"
            title="Tools I use to turn ideas into products."
          />
          <div className="tech-grid">
            {technologies.map((tech) => (
              <div className="tech-card tech-card--logo" key={tech.name}>
                <div className="tech-logo-wrap">
                  <TechLogo tech={tech} />
                </div>
                <strong>{tech.name}</strong>
                <small>{tech.category}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionTitle eyebrow="SERVICES" title="What I can build for you." text="From a professional business website to a complete web application, the structure is designed to grow with your services." />
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <span className="service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="tag-row">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
          <div className="center-action"><Link className="text-link" to="/services">Explore all services <ArrowUpRight size={17}/></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* eyebrow="SELECTED WORK" */}
          <SectionTitle title="Projects that show what I can do." text="Replace these starter entries with your real client, freelance, academic and personal projects as your portfolio grows." />
          <div className="project-grid">
            {projects.map((project, i) => (
              <article className="project-card" key={project.title}>
                <div className={`project-cover cover-${i + 1}`}>
                  <span>{project.type}</span>
                  <Sparkles size={24}/>
                </div>
                <div className="project-body">
                  <p className="project-status">{project.status}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
          <div className="center-action"><Link className="button button-outline" to="/portfolio">View portfolio <ArrowUpRight size={17}/></Link></div>
        </div>
      </section>

      <section className="section process-section">
        <div className="container">
           {/* eyebrow="PROCESS" */}
          <SectionTitle title="A simple process. Clear communication." text="A professional workflow helps keep scope understandable and makes progress visible." />
          <div className="process-grid">
            {process.map((item) => (
              <div className="process-item" key={item.step}>
                <span>{item.step}</span><h3>{item.title}</h3><p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <p className="eyebrow">HAVE A PROJECT IN MIND?</p>
            <h2>Let's build something people can actually use.</h2>
          </div>
          <Link className="button button-light" to="/contact">Start a conversation <ArrowUpRight size={17}/></Link>
        </div>
      </section>
    </>
  );
}
