/* =========================================================
   HVACKEROS — REVEAL ON SCROLL
   IntersectionObserver compartido por todas las páginas
   para animar los elementos .reveal al entrar en viewport.
   ========================================================= */

const reveals =
  document.querySelectorAll(
    ".reveal"
  );

const revealObserver =
  new IntersectionObserver(
    (entries, obs) => {

      entries.forEach(
        (entry) => {

          if (
            !entry.isIntersecting
          ) {
            return;
          }

          entry.target
            .classList
            .add("visible");

          obs.unobserve(
            entry.target
          );

        }
      );

    },
    {
      threshold: .1,
      rootMargin:
        "0px 0px -45px 0px"
    }
  );

reveals.forEach(
  (element) => {

    revealObserver.observe(
      element
    );

  }
);
