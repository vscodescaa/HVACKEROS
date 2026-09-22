// Redirects /about to /about/ when about/index.html exists, in the dev
// server and in `vite preview`, as static hosts (GitHub Pages included)
// usually do. Without it those URLs are a 404 locally.
import fs from "node:fs";
import path from "node:path";

function redirectToFolder(dir) {
  return (req, res, next) => {
    const [pathname, query = ""] = req.url.split("?");
    const isFolderIndex =
      !pathname.endsWith("/") &&
      !path.extname(pathname) &&
      fs.existsSync(path.join(dir, pathname, "index.html"));

    if (!isFolderIndex) return next();

    res.statusCode = 301;
    res.setHeader("Location", `${pathname}/${query && `?${query}`}`);
    res.end();
  };
}

export function trailingSlash() {
  return {
    name: "hvackeros:trailing-slash",

    configureServer(server) {
      server.middlewares.use(redirectToFolder(server.config.root));
    },

    configurePreviewServer(server) {
      server.middlewares.use(redirectToFolder(path.resolve(server.config.root, server.config.build.outDir)));
    },
  };
}
