/* =========================================================
   HVACKEROS — SMOOTH SCROLL
   Aplica scroll suave a los anchors que apuntan a una
   sección de la MISMA página, ya sea "#seccion" o
   "/#seccion" (el navbar compartido usa esta segunda forma
   para que el mismo link funcione desde cualquier página:
   navega a la landing si hace falta, y hace scroll suave
   si ya estamos en ella).

   Los enlaces que apuntan a otra página con ancla propia
   (por ejemplo "/about/#historia") navegan de forma normal
   y no pasan por aquí.
   ========================================================= */

document
  .querySelectorAll(
    'a[href^="#"], a[href^="/#"]'
  )
  .forEach((anchor) => {

    anchor.addEventListener(
      "click",
      function (event) {

        const href =
          this.getAttribute(
            "href"
          );

        if (
          !href ||
          href === "#" ||
          href === "/#"
        ) {
          return;
        }

        const hash =
          href.slice(
            href.indexOf("#")
          );

        const isSamePage =
          href.startsWith("#") ||
          /(^|\/)(index\.html)?$/.test(
            window.location.pathname
          );

        if (!isSamePage) {
          return;
        }

        const target =
          document.querySelector(
            hash
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        const top =
          target
            .getBoundingClientRect()
            .top
          +
          window.pageYOffset
          -
          90;

        window.scrollTo({
          top,
          behavior: "smooth"
        });

      }
    );

  });
