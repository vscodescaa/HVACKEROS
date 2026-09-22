// Inlines HTML partials: a line like <!-- @include hero.html --> is replaced
// with the contents of that file from the partials directory (and so on for
// includes inside that file).
import fs from "node:fs";
import path from "node:path";
import { normalizePath } from "vite";

const INCLUDE = /<!--\s*@include\s+([\w./-]+)\s*-->/g;

export function htmlPartials({ dir }) {
  let partialsDir;

  // Partials may include other partials; `chain` catches include cycles.
  const inline = (html, chain) =>
    html.replace(INCLUDE, (_, file) => {
      if (chain.includes(file)) {
        throw new Error(`[html-partials] include cycle: ${[...chain, file].join(" -> ")}`);
      }

      const full = path.join(partialsDir, file);
      if (!fs.existsSync(full)) {
        throw new Error(`[html-partials] partial not found: ${dir}/${file}`);
      }

      return inline(fs.readFileSync(full, "utf8"), [...chain, file]);
    });

  return {
    name: "hvackeros:html-partials",

    configResolved(config) {
      partialsDir = normalizePath(path.resolve(config.root, dir));
    },

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return inline(html, []);
      },
    },

    // Partials are not modules, so HMR can't patch them: reload the page instead.
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir + "/")) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}
