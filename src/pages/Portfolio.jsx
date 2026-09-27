import React from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { projects } from "../data";
import SectionTitle from "../components/SectionTitle";

export default function Portfolio() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">PORTFOLIO</p>
          <h1>Selected projects and experiments.</h1>
          <p>Use this page as your proof section. Add screenshots, live URLs, GitHub repositories, case studies and measurable results when you have them.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="WORK" title="A growing body of work." />
          <div className="portfolio-list">
            {projects.map((project, i) => (
              <article className="portfolio-card" key={project.title}>
                <div className={`portfolio-image cover-${i + 1}`}><span>{String(i + 1).padStart(2, "0")}</span></div>
                <div className="portfolio-content">
                  <p className="project-status">{project.type}</p>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  <div className="tag-row">{project.stack.map(t => <span key={t}>{t}</span>)}</div>
                  <button className="text-link" type="button">Case study <ExternalLink size={16}/></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
