import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Check, Code2, Database, Sparkles } from "lucide-react";
import { site, stats, technologies, services, projects, process } from "../data";
import SectionTitle from "../components/SectionTitle";

/*
  Real technology logos.
  Primary source: Devicon CDN (official multicolor brand SVGs).
  Fallback source: Simple Icons CDN (brand-colored monochrome SVGs).
  If both fail, TechLogo renders a colored text monogram instead of a
  broken-image icon. Every URL below was verified to return HTTP 200.
*/
const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SIMPLE_ICONS = "https://cdn.simpleicons.org";

const techLogos = {
  HTML5: [`${DEVICON}/html5/html5-original.svg`, `${SIMPLE_ICONS}/html5/E34F26`],
  CSS3: [`${DEVICON}/css3/css3-original.svg`, `${SIMPLE_ICONS}/css/1572B6`],
  JavaScript: [`${DEVICON}/javascript/javascript-original.svg`, `${SIMPLE_ICONS}/javascript/F7DF1E`],
  React: [`${DEVICON}/react/react-original.svg`, `${SIMPLE_ICONS}/react/61DAFB`],
  Vite: ["https://cdn.jsdelivr.net/gh/vitejs/vite@v5.4.0/docs/public/logo.svg", `${DEVICON}/vite/vite-original.svg`],
  Git: [`${DEVICON}/git/git-original.svg`, `${SIMPLE_ICONS}/git/F05032`],
  PHP: [`${DEVICON}/php/php-original.svg`, `${SIMPLE_ICONS}/php/777BB4`],
  Laravel: [`${DEVICON}/laravel/laravel-original.svg`, `${SIMPLE_ICONS}/laravel/FF2D20`],
  // Django's official bottle green (#092E20) is invisible on a dark theme,
  // so the Simple Icons CDN renders the same mark in a lightened brand green.
  Django: [`${SIMPLE_ICONS}/django/24B880`, `${DEVICON}/django/django-plain.svg`],
  "REST APIs": [`${DEVICON}/openapi/openapi-original.svg`, `${SIMPLE_ICONS}/openapiinitiative/6BA539`],
  Figma: [`${DEVICON}/figma/figma-original.svg`, `${SIMPLE_ICONS}/figma/F24E1E`],
  Photoshop: [`${DEVICON}/photoshop/photoshop-original.svg`, `${DEVICON}/photoshop/photoshop-plain.svg`],
  // Next.js's official mark is a black circle; CSS inverts it in dark mode
  // so it stays visible on both themes (see .tech-logo--next).
  "Next.js": [`${DEVICON}/nextjs/nextjs-original.svg`, `${SIMPLE_ICONS}/nextdotjs/000000`],
  Tailwind: [`${DEVICON}/tailwindcss/tailwindcss-original.svg`, `${SIMPLE_ICONS}/tailwindcss/06B6D4`],
  Bootstrap: [`${DEVICON}/bootstrap/bootstrap-original.svg`, `${SIMPLE_ICONS}/bootstrap/7952B3`],
  MySQL: [`${DEVICON}/mysql/mysql-original.svg`, `${SIMPLE_ICONS}/mysql/4479A1`],
  WordPress: [`${DEVICON}/wordpress/wordpress-original.svg`, `${SIMPLE_ICONS}/wordpress/21759B`],
  Shopify: [`${SIMPLE_ICONS}/shopify/96BF48`]
};

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

          {/* <div className="hero-visual">
            <div className="hero-card main-card">
              <div className="code-window">
                <div className="window-dots"><i/><i/><i/></div>
                <div className="code-line"><span className="purple">const</span> developer = {"{"}</div>
                <div className="code-line indent"><span className="cyan">name</span>: <span className="green">"{site.name}"</span>,</div>
                <div className="code-line indent"><span className="cyan">focus</span>: <span className="green">"Full-Stack"</span>,</div>
                <div className="code-line indent"><span className="cyan">stack</span>: [</div>
                <div className="code-line double-indent"><span className="green">"React"</span>, <span className="green">"Django"</span>,</div>
                <div className="code-line double-indent"><span className="green">"JavaScript"</span>, <span className="green">"Laravel"</span></div>
                <div className="code-line indent">{"],"}</div>
                <div className="code-line">{"}"};</div>
              </div>
              <div className="visual-caption">
                <span>Available for meaningful work</span>
                <span className="pulse-dot"/>
              </div>
            </div>
            <div className="floating-card card-one"><Code2 size={19}/><span>Clean code</span></div>
            <div className="floating-card card-two"><Database size={19}/><span>Reliable backend</span></div>
          </div> */}
          <div className="hero-visual">
            <div className="hero-card main-card profile-image-card">
              <img
                src="/images/abdul-bari.jpg"
                alt="Abdul Bari Rahmani"
                className="hero-profile-image"
              />

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
            eyebrow="TECHNOLOGY"
            title="Tools I use to turn ideas into products."
            text="A focused public technology stack. You can edit this list later in src/data.js as your skills grow."
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
          <SectionTitle eyebrow="SELECTED WORK" title="Projects that show what I can do." text="Replace these starter entries with your real client, freelance, academic and personal projects as your portfolio grows." />
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
          <SectionTitle eyebrow="PROCESS" title="A simple process. Clear communication." text="A professional workflow helps keep scope understandable and makes progress visible." />
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
