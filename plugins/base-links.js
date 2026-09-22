// Rewrites root-relative links (href="/about/", href="/#proposito") to be
// relative to the configured `base`, so the same partials work whether the
// site is served from the domain root (a custom domain, base "/") or from a
// GitHub Pages project subpath (base "/HVACKEROS/").
//
// Vite already does this for asset references it recognizes (<link href>,
// <script src>, <img src> when processed as modules/assets), but plain
// navigation <a href="/..."> is left untouched — this plugin covers that gap.
//
// Runs after html-partials (partials must be inlined first) and independently
// of current-nav (order between those two doesn't matter).
// Only <a href="/...">, never <link>/<script>/<img> — Vite already rewrites
// those correctly itself, and rewriting them again would double the prefix.
const ANCHOR_HREF = /(<a\b[^>]*\bhref=")(\/[^"]*)(")/g;

// Root-relative and not something we should rewrite (protocol-relative URL).
const SKIP = /^\/\//;

export function baseLinks() {
  let base = "/";

  return {
    name: "hvackeros:base-links",

    configResolved(config) {
      base = config.base || "/";
    },

    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (base === "/") return html;

        const prefix = base.replace(/\/$/, "");

        return html.replace(ANCHOR_HREF, (match, open, path, close) => {
          if (SKIP.test(path)) return match;
          return `${open}${prefix}${path}${close}`;
        });
      },
    },
  };
}
