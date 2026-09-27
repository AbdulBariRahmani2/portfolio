import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, Github, Linkedin } from "lucide-react";
import { site } from "../data";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">CONTACT</p>
          <h1>Let's talk about your next website or web application.</h1>
          <p>Share the idea, features, timeline and any reference websites. You can replace the contact details below with your final professional information.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <div className="contact-card"><Mail size={21}/><div><small>Email</small><a href={`mailto:${site.email}`}>{site.email}</a></div></div>
            <div className="contact-card"><Phone size={21}/><div><small>Phone</small><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></div></div>
            <div className="contact-card"><MapPin size={21}/><div><small>Location</small><span>{site.location}</span></div></div>
            <div className="contact-card"><Send size={21}/><div><small>Availability</small><span>{site.availability}</span></div></div>
            <div className="contact-socials">
              <a href={site.social.github} target="_blank" rel="noreferrer"><Github size={18}/> GitHub</a>
              <a href={site.social.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18}/> LinkedIn</a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submit}>
            <label>Your name<input required name="name" placeholder="Your name" /></label>
            <label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label>
            <label>Project type<select name="type" defaultValue=""><option value="" disabled>Select a project type</option><option>Business website</option><option>Web application</option><option>SaaS product</option><option>Website improvement</option><option>Other</option></select></label>
            <label>Tell me about your project<textarea required name="message" rows="7" placeholder="What do you want to build?"></textarea></label>
            <button className="button button-primary" type="submit">Send message <Send size={16}/></button>
            {sent && <p className="form-note">Demo form submitted. Connect this form to your Django API or email service before launch.</p>}
          </form>
        </div>
      </section>
    </>
  );
}
