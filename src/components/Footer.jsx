import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Linkedin, Facebook, Instagram } from "lucide-react";
import { site } from "../data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <p className="eyebrow">LET'S BUILD SOMETHING USEFUL</p>
          <h2>Have an idea? Let's turn it into a real product.</h2>
          <Link className="button button-light" to="/contact">
            Get in touch <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="footer-contact">
          <p>{site.location}</p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <div className="socials">
          <a href={site.social.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18}/></a>
          <a href={site.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18}/></a>
          <a href={site.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18}/></a>
          <a href={site.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18}/></a>
        </div>
      </div>
    </footer>
  );
}
