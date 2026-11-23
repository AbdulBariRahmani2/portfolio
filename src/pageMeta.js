/*
  Per-route document metadata, kept in one place so the runtime (client-side
  navigation) and the build (static per-route HTML for crawlers) always agree.
  Canonical URLs for sub-pages use the trailing-slash form because that is the
  URL the static host serves for /about/ etc.
*/
export const SITE_ORIGIN = "https://www.abdulbarirahmani.com";

export const pageMeta = {
  "/": {
    title: "Abdul Bari Rahmani | Full-Stack Developer",
    description:
      "Abdul Bari Rahmani — Full-Stack Developer specializing in Django, React.js, JavaScript, Laravel and SaaS applications.",
    canonical: "/"
  },
  "/about": {
    title: "About Abdul Bari Rahmani | Full-Stack Web Developer",
    description:
      "Learn how Abdul Bari Rahmani builds practical web products with React.js, Django, JavaScript and Laravel, and the principles behind his work.",
    canonical: "/about/"
  },
  "/services": {
    title: "Services | Web Development & Full-Stack Applications",
    description:
      "Website development, full-stack web applications, SaaS foundations, backend APIs and frontend development by Abdul Bari Rahmani.",
    canonical: "/services/"
  },
  "/portfolio": {
    title: "Portfolio | Selected Projects by Abdul Bari Rahmani",
    description:
      "Selected projects and experiments, including a hospital website built with React and Django and a personal portfolio website.",
    canonical: "/portfolio/"
  },
  "/blog": {
    title: "Blog & Insights | Abdul Bari Rahmani",
    description:
      "Notes on AI and development, React with Django, and building a professional developer portfolio.",
    canonical: "/blog/"
  },
  "/contact": {
    title: "Contact Abdul Bari Rahmani | Start a Project",
    description:
      "Get in touch with Abdul Bari Rahmani to discuss a website, web application or SaaS project. Email, phone and WhatsApp are available.",
    canonical: "/contact/"
  }
};

/** Normalizes "/about/", "/about" and "" to the key used in pageMeta. */
export function metaKeyForPath(pathname) {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}
