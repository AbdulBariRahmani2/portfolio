import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, Menu, X, ArrowUpRight } from "lucide-react";
import { site } from "../data";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/portfolio", "Portfolio"],
  ["/blog", "Blog"],
  ["/contact", "Contact"]
];

/*
  The site is prerendered at build time (scripts/prerender.mjs), so this
  component must render on the server as well as in the browser:
  - localStorage is only touched when window exists
  - the theme icon/labels wait for `mounted`, so the server markup (light
    theme) hydrates byte-for-byte and the stored theme is applied right
    after, instead of causing a hydration mismatch for dark-mode visitors.
*/
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return typeof window !== "undefined" && localStorage.getItem("theme") === "dark";
  });
  const isDark = mounted && darkMode;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">

        <Link
          to="/"
          className="brand"
          onClick={() => setOpen(false)}
        >
          <span className="brand-mark">AB</span>
          <span>{site.name}</span>
        </Link>

        <button
          className="menu-button"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="primary-navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav id="primary-navigation" className={`nav-links ${open ? "open" : ""}`}>

          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {label}
            </NavLink>
          ))}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {isDark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <Link
            className="nav-cta"
            to="/contact"
            onClick={() => setOpen(false)}
          >
            Start a project
            <ArrowUpRight size={16} />
          </Link>

        </nav>
      </div>
    </header>
  );
}