import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { baseLinks } from "./plugins/base-links.js";
import { currentNav } from "./plugins/current-nav.js";
import { htmlPartials } from "./plugins/html-partials.js";
import { trailingSlash } from "./plugins/trailing-slash.js";

const page = (file) => fileURLToPath(new URL(file, import.meta.url));

// GitHub Pages serves this site from /HVACKEROS/ unless it's published on a
// custom domain (a CNAME file in public/) or as a usuario.github.io repo.
// Every internal link in src/partials/ is an absolute path ("/about/",
// "/src/..."), so Vite needs this to rewrite them correctly at build time.
//
// This applies in dev, build and preview alike, so `npm run dev` already
// serves from /HVACKEROS/ too — the same URLs you'll get on GitHub Pages.
//
//   npm run dev / build              -> base "/HVACKEROS/" (GitHub Pages project site)
//   BASE_PATH=/ npm run dev / build  -> base "/" (custom domain, once bought)
const base = process.env.BASE_PATH ?? "/HVACKEROS/";

export default defineConfig({
  // A multi-page site: unknown URLs get a 404 instead of silently falling
  // back to the landing page as a single-page app would.
  appType: "mpa",

  base,

  // Order matters: partials are inlined before the current page's nav link is
  // marked, and base-links (order: "post") always runs last so it prefixes
  // the final <a href="/..."> links without disturbing the other two.
  plugins: [htmlPartials({ dir: "src/partials" }), currentNav(), baseLinks(), trailingSlash()],

  build: {
    // three.js alone is ~550 kB minified (140 kB gzip). It is only loaded by
    // the landing's 3D hero visual, never by the other pages, so the size is
    // expected there.
    chunkSizeWarningLimit: 600,

    rolldownOptions: {
      // One HTML entry per page (a folder with index.html gives a clean URL:
      // about/index.html is served at /about/).
      input: {
        main: page("./index.html"),
        about: page("./about/index.html"),
        members: page("./members/index.html"),
        news: page("./news/index.html"),
      },
    },
  },
});
