import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/*
  `npm run build` prerenders each route's HTML (scripts/prerender.mjs), so the
  container usually already holds real markup: the page paints from HTML/CSS
  while React only has to hydrate it (the same amount of React work the old
  createRoot render did, minus creating the DOM). Loading an unbuilt page, or a
  route with no prerendered file, still mounts from scratch.
*/
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
