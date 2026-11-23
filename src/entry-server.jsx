import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

/*
  Used only by the build (scripts/prerender.mjs): renders one route to HTML
  with the exact same App tree the browser hydrates, so search engines and
  no-JS visitors get real content instead of an empty <div id="root">.
  Effects do not run here, which is why window/localStorage access in
  components has to be guarded.
*/
export function render(pathname) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={pathname}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}
