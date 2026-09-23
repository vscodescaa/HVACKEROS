// Marks the navigation link of the page being built: every <a data-nav>
// whose href is that page's URL gets aria-current="page" (styled in
// src/styles/header-footer.css). Runs after the partials are inlined, so the
// shared navbar needs no per-page copy.
const NAV_LINK = /<a\b([^>]*\bdata-nav\b[^>]*)>/g;
const HREF = /\bhref="([^"]*)"/;

// "/about/index.html", "/about/" and "/about" all become "/about/".
const pageUrl = (path) => path.replace(/index\.html$/, "").replace(/([^/])$/, "$1/");

export function currentNav() {
  return {
    name: "hvackeros:current-nav",

    transformIndexHtml: {
      order: "pre",
      handler(html, { path }) {
        const url = pageUrl(path);

        return html.replace(NAV_LINK, (tag, attributes) => {
          const href = HREF.exec(attributes)?.[1];

          const isCurrentPage =
            href === url ||
            (
              url === "/" &&
              href === "/#proposito"
            );

          return isCurrentPage
            ? `<a${attributes} aria-current="page">`
            : tag;
        });
      },
    },
  };
}
