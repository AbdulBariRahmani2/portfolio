import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { site } from "../data";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/portfolio", "Portfolio"],
  ["/blog", "Blog"],
  ["/contact", "Contact"]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">AB</span>
          <span>{site.name}</span>
        </Link>

        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
          <Link className="nav-cta" to="/contact" onClick={() => setOpen(false)}>
            Start a project <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
