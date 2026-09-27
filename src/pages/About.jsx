import React from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { site, technologies } from "../data";
import SectionTitle from "../components/SectionTitle";

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">ABOUT {site.name.toUpperCase()}</p>
          <h1>A developer who cares about both the code and the experience.</h1>
          <p>{site.about}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <SectionTitle eyebrow="MY APPROACH" title="Build with purpose, not just with technology." />
            <p className="body-copy">{site.aboutExtended}</p>
            <p className="body-copy">I aim to keep projects understandable: clear components, sensible backend structure, responsive layouts, useful documentation and an honest development process.</p>
          </div>
          <div className="principles">
            {["Responsive by default", "Readable and maintainable code", "API-first thinking", "Practical UX", "Security-conscious development", "Continuous learning"].map(item => (
              <div className="principle" key={item}><CheckCircle2 size={20}/><span>{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionTitle eyebrow="MY STACK" title="Technologies I want to be known for." text="Keep this section honest and update it as your professional experience changes." />
          <div className="tech-grid">
            {technologies.map(t => <div className="tech-card" key={t.name}><strong>{t.name}</strong><small>{t.category}</small></div>)}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div><p className="eyebrow">NEXT STEP</p><h2>Want to work together?</h2></div>
          <a className="button button-light" href={`mailto:${site.email}`}>Email me <ArrowUpRight size={17}/></a>
        </div>
      </section>
    </>
  );
}
