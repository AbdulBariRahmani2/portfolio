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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

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
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>

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
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
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