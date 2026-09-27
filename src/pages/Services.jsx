import React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { services, process } from "../data";
import SectionTitle from "../components/SectionTitle";

export default function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">SERVICES</p>
          <h1>Web development services built around real project goals.</h1>
          <p>Choose the service that matches your current stage. The site is structured so you can later add pricing, packages and detailed case studies.</p>
        </div>
      </section>

      <section className="section">
        <div className="container service-list">
          {services.map(service => (
            <article className="service-row" key={service.number}>
              <span className="service-number">{service.number}</span>
              <div><h2>{service.title}</h2><p>{service.text}</p></div>
              <div className="service-features">{service.tags.map(t => <span key={t}><Check size={15}/>{t}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionTitle eyebrow="HOW IT WORKS" title="From first conversation to launch." />
          <div className="process-grid">
            {process.map(item => <div className="process-item" key={item.step}><span>{item.step}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Tell me what you want to build.</h2></div>
          <Link className="button button-light" to="/contact">Request a conversation <ArrowUpRight size={17}/></Link>
        </div>
      </section>
    </>
  );
}
