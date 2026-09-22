/* =========================================================
   TYPEWRITER (específico de about.html)
   ========================================================= */

const sentence =
  "Nuestra historia todavía se está escribiendo.";

const typedText =
  document.getElementById(
    "typedText"
  );

const nextCard =
  document.getElementById(
    "nextCard"
  );

const nextCopy =
  document.getElementById(
    "nextCopy"
  );

let hasTyped =
  false;

function startTyping() {

  if (hasTyped) {
    return;
  }

  hasTyped =
    true;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reducedMotion) {

    typedText.textContent =
      sentence;

    nextCopy.classList.add(
      "visible"
    );

    return;

  }

  let index = 0;

  function typeCharacter() {

    if (
      index >=
      sentence.length
    ) {

      setTimeout(
        () => {

          nextCopy
            .classList
            .add("visible");

        },
        450
      );

      return;

    }

    const character =
      sentence.charAt(index);

    typedText.textContent +=
      character;

    index++;

    let delay =
      48 +
      Math.random() * 32;

    if (
      character === " "
    ) {
      delay = 35;
    }

    if (
      character === "."
    ) {
      delay = 170;
    }

    setTimeout(
      typeCharacter,
      delay
    );

  }

  setTimeout(
    typeCharacter,
    450
  );

}

const typeObserver =
  new IntersectionObserver(

    (entries, observer) => {

      entries.forEach(
        (entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          startTyping();

          observer.unobserve(
            entry.target
          );

        }
      );

    },

    {
      threshold: .4
    }

  );

typeObserver.observe(
  nextCard
);
