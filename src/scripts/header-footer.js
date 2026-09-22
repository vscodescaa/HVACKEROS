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


/* =========================================================
   CONTACT MODAL
   ========================================================= */

const contactModal =
  document.getElementById(
    "contactModal"
  );

const contactOpeners =
  document.querySelectorAll(
    "[data-contact-open]"
  );

const contactClosers =
  contactModal
    ?.querySelectorAll(
      "[data-contact-close]"
    ) ?? [];

let contactTrigger = null;

function setContactModal(open) {

  if (!contactModal) {
    return;
  }

  contactModal.classList.toggle(
    "open",
    open
  );

  contactModal.setAttribute(
    "aria-hidden",
    String(!open)
  );

  if (open) {

    if (menuOpen) {
      setMenu(false);
    }

    document.body.style.overflow =
      "hidden";

    contactModal
      .querySelector(
        ".contact-close"
      )
      ?.focus();

  } else {

    document.body.style.overflow =
      "";

    contactTrigger?.focus();

    contactTrigger = null;

  }

}

contactOpeners.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        contactTrigger =
          button;

        setContactModal(true);

      }
    );

  }
);

contactClosers.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        setContactModal(false);

      }
    );

  }
);

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      contactModal?.classList.contains(
        "open"
      )
    ) {

      setContactModal(false);

    }

  }
);
