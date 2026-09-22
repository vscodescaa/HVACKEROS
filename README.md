# HVACKEROS — sitio web

Sitio de HVACKEROS, comunidad estudiantil del Tecnológico de Monterrey
enfocada en HVAC, energía, climatización e innovación. Construido con
[Vite](https://vite.dev) (HTML multi-página + partials), sin framework de UI.

## Estructura

```
HVACKEROS/
  index.html            Landing (hero con el modelo 3D, manifiesto, qué
                         hacemos, evento, explora, únete)
  about/index.html       Nuestra historia
  members/index.html     Equipo
  news/index.html        Actualidad (eventos y noticias)

  src/
    partials/            Piezas HTML reutilizables, inlineadas en build
                          por plugins/html-partials.js
      head.html           <head> compartido (fuentes, favicon, CSS base)
      navbar.html          Header + menú móvil (igual en las 4 páginas)
      footer.html          Footer (igual en las 4 páginas)
      home/                 Secciones propias de la landing
      about/                Secciones propias de "Nuestra historia"
      members/              Secciones propias de "Equipo"
      news/                 Secciones propias de "Actualidad"

    styles/              Un CSS por responsabilidad, sin reglas repetidas
                          entre archivos
      base.css             Variables :root, reset, tipografía y utilidades
                            (.container, .button, .reveal, etc.)
      header-footer.css    Header, menú móvil y footer
      home.css              CSS específico de la landing
      about.css              CSS específico de "Nuestra historia"
      members.css            CSS específico de "Equipo"
      news.css                CSS específico de "Actualidad"

    scripts/             Un módulo por responsabilidad
      page.js               Punto de entrada común (header-footer + reveal
                             + smooth-scroll), importado por las 4 páginas
      header-footer.js       Menú móvil + año del footer
      reveal.js               IntersectionObserver de animación .reveal
      smooth-scroll.js         Scroll suave de anchors internos
      hvac-model.js             Modelo 3D (Three.js) del hero — solo index.html
      about.js                   Efecto typewriter — solo about/
      news-data.js                Datos y render de eventos/noticias — solo news/

    assets/img/          Imágenes propias del sitio (fotos de equipo,
                          banner de historia)

  public/                Copiado tal cual a la raíz del sitio (favicon,
                          robots.txt; aquí irá el CNAME cuando haya dominio)

  plugins/               Plugins de Vite propios del proyecto (ver abajo)
  vite.config.js
  package.json
```

Cada página HTML (`index.html`, `about/index.html`, etc.) es solo un
`<!DOCTYPE html>` con `<!-- @include partial.html -->` para el head, el
navbar, sus secciones propias y el footer — el markup del header/footer
**no está copiado a mano**: vive una sola vez en `src/partials/` y Vite lo
inserta en build/dev. El CSS y el JS tampoco se repiten entre páginas.

### Cómo funciona (plugins/)

- **`html-partials.js`** — reemplaza `<!-- @include archivo.html -->` por el
  contenido de ese archivo en `src/partials/` (soporta includes anidados).
- **`current-nav.js`** — a cada `<a data-nav href="...">` cuyo href sea el de
  la página actual le añade `aria-current="page"` (estilo en
  `header-footer.css`), para que el link activo del menú se marque solo.
- **`base-links.js`** — reescribe los `<a href="/...">` de navegación con el
  `base` del sitio configurado en `vite.config.js`. Los partials se escriben
  una sola vez con rutas absolutas (`/about/`, `/#proposito`); este plugin las
  adapta a `/HVACKEROS/about/` en GitHub Pages o las deja en `/about/` cuando
  el sitio viva en la raíz de un dominio propio.
- **`trailing-slash.js`** — en dev/preview, redirige `/about` a `/about/` para
  que las URLs limpias funcionen igual que en un hosting estático real.

## Desarrollo

Requiere [Node.js](https://nodejs.org) 22.12+.

```
npm install
npm run dev
```

Abre `http://localhost:5173/HVACKEROS/` (el puerto puede variar si el 5173
está ocupado — Vite lo indica en la terminal). El servidor recarga al
guardar cualquier archivo, incluidos los partials.

## Build

```
npm run build      # genera dist/, listo para publicar
npm run preview    # sirve dist/ localmente para probarlo como en producción
```

## Publicar en GitHub Pages

Ya incluye el workflow (`.github/workflows/deploy.yml`): en cada push a
`main` construye el sitio (`npm ci && npm run build`) y publica `dist/`.
Solo falta:

1. Subir este repositorio a GitHub (con ese nombre, `HVACKEROS`, o ajustar el
   `base` — ver el punto 2 más abajo).
2. En **Settings → Pages**, elegir **GitHub Actions** como origen. El primer
   push a `main` dispara el deploy automáticamente.
3. Por defecto el sitio asume que vivirá en `usuario.github.io/HVACKEROS/`
   (ver `base` en `vite.config.js`). Si el repositorio se llama distinto a
   `HVACKEROS`, actualiza ese valor para que coincida con el subpath real.

### Dominio propio (pendiente)

Cuando se compre un dominio, hay dos cambios:

1. Crear `public/CNAME` con el dominio elegido (por ejemplo `hvackeros.com`)
   y configurar el DNS apuntando a GitHub Pages — Vite copia `public/` a la
   raíz de `dist/` tal cual.
2. Construir el sitio con `base` en `/` en vez de `/HVACKEROS/`:

   ```
   BASE_PATH=/ npm run build
   ```

   (o cambiar el valor por defecto en `vite.config.js` una vez que el dominio
   propio sea la única forma en que se publique el sitio).

Ninguno de los dos existe todavía porque el dominio no se ha comprado.
