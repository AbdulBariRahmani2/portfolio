import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_ORIGIN, pageMeta, metaKeyForPath } from "../pageMeta";

/*
  A single-page app ships one static index.html, so without this every route
  would share the same <title>, description and canonical URL. This keeps the
  document head in sync during client-side navigation (the build also writes
  per-route HTML files with the same values, so crawlers get them statically).
*/
function setAttr(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export default function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pageMeta[metaKeyForPath(pathname)] || pageMeta["/"];
    const url = `${SITE_ORIGIN}${meta.canonical}`;

    document.title = meta.title;
    setAttr('meta[name="description"]', "content", meta.description);
    setAttr('link[rel="canonical"]', "href", url);
    setAttr('meta[property="og:title"]', "content", meta.title);
    setAttr('meta[property="og:description"]', "content", meta.description);
    setAttr('meta[property="og:url"]', "content", url);
    setAttr('meta[name="twitter:title"]', "content", meta.title);
    setAttr('meta[name="twitter:description"]', "content", meta.description);
  }, [pathname]);

  return null;
}
