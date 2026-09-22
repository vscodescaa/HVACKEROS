/* =========================================================
   HVACKEROS — HEADER / FOOTER
   Menú móvil + año dinámico del footer.
   Compartido por todas las páginas.
   ========================================================= */

const menuButton =
  document.getElementById(
    "menuButton"
  );

const mobileMenu =
  document.getElementById(
    "mobileMenu"
  );

let menuOpen = false;

function setMenu(open) {

  menuOpen = open;

  mobileMenu.classList.toggle(
    "open",
    open
  );

  menuButton.setAttribute(
    "aria-expanded",
    String(open)
  );

  document.body.style.overflow =
    open
      ? "hidden"
      : "";

}

menuButton.addEventListener(
  "click",
  () => {

    setMenu(
      !menuOpen
    );

  }
);

mobileMenu
  .querySelectorAll("a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        setMenu(false);

      }
    );

  });

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth > 1120 &&
      menuOpen
    ) {

      setMenu(false);

    }

  }
);

/* =========================================================
   YEAR
   ========================================================= */

document
  .getElementById(
    "year"
  )
  .textContent =
  new Date()
    .getFullYear();

/* =========================================================
   HEADER ON SCROLL
   Encoge y vuelve el fondo más opaco al bajar de un umbral,
   y vuelve a su estado inicial al subir de nuevo. El estado
   se lee una vez por frame (rAF) para no recalcular estilos
   en cada evento de scroll.
   ========================================================= */

const headerWrap =
  document.querySelector(
    ".header-wrap"
  );

const SCROLL_THRESHOLD = 24;

let scrolled = false;
let ticking = false;

function updateHeaderState() {

  const shouldBeScrolled =
    window.scrollY >
    SCROLL_THRESHOLD;

  if (
    shouldBeScrolled !==
    scrolled
  ) {

    scrolled =
      shouldBeScrolled;

    headerWrap.classList.toggle(
      "is-scrolled",
      scrolled
    );

  }

  ticking = false;

}

window.addEventListener(
  "scroll",
  () => {

    if (ticking) {
      return;
    }

    ticking = true;

    requestAnimationFrame(
      updateHeaderState
    );

  },
  { passive: true }
);

updateHeaderState();
