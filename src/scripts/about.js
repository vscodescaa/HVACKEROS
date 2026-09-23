import "./about-hvac-model.js";

/* =========================================================
   TYPEWRITER (específico de about.html)
   La frase completa ocupa su espacio desde el inicio; cada
   carácter empieza invisible y se revela sin recalcular el
   salto de línea. Evita el cambio brusco de línea durante
   la animación.
   ========================================================= */

const sentence =
  "Nuestra historia aún se escribe.";

const typedText =
  document.getElementById(
    "typedText"
  );

const typingCursor =
  document.getElementById(
    "typingCursor"
  );

const typewriter =
  document.getElementById(
    "typewriter"
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

const characterSpans = [];

function buildSentence() {

  const words =
    sentence.split(" ");

  words.forEach(
    (word, wordIndex) => {

      const wordSpan =
        document.createElement(
          "span"
        );

      wordSpan.className =
        "typed-word";

      Array.from(word)
        .forEach((character) => {

          const characterSpan =
            document.createElement(
              "span"
            );

          characterSpan.className =
            "typed-char";

          characterSpan.textContent =
            character;

          wordSpan.appendChild(
            characterSpan
          );

          characterSpans.push(
            characterSpan
          );

        });

      typedText.appendChild(
        wordSpan
      );

      if (
        wordIndex <
        words.length - 1
      ) {

        typedText.appendChild(
          document.createTextNode(
            " "
          )
        );

      }

    });

}

function moveCursor(
  character = null
) {

  if (
    !typingCursor ||
    !typewriter
  ) {
    return;
  }

  const typewriterRect =
    typewriter.getBoundingClientRect();

  if (!character) {

    typingCursor.style.left =
      "0px";

    typingCursor.style.top =
      "0.08em";

    return;

  }

  const characterRect =
    character
      .getBoundingClientRect();

  typingCursor.style.left =
    `${
      characterRect.right -
      typewriterRect.left +
      4
    }px`;

  typingCursor.style.top =
    `${
      characterRect.top -
      typewriterRect.top +
      characterRect.height * .08
    }px`;

}

function revealAll() {

  characterSpans.forEach(
    (character) => {

      character.classList.add(
        "visible"
      );

    });

  typingCursor
    ?.classList
    .add("finished");

  nextCopy.classList.add(
    "visible"
  );

}

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

    revealAll();

    return;

  }

  let index = 0;

  function revealCharacter() {

    if (
      index >=
      characterSpans.length
    ) {

      typingCursor
        ?.classList
        .add("finished");

      setTimeout(
        () => {

          nextCopy
            .classList
            .add("visible");

        },
        300
      );

      return;

    }

    const character =
      characterSpans[index];

    character.classList.add(
      "visible"
    );

    moveCursor(
      character
    );

    index++;

    const isPunctuation =
      /[.,;:!?]/.test(
        character.textContent
      );

    setTimeout(
      revealCharacter,
      isPunctuation
        ? 105
        : 44
    );

  }

  setTimeout(
    revealCharacter,
    260
  );

}

buildSentence();
moveCursor();

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
      threshold: .35
    }

  );

typeObserver.observe(
  nextCard
);

window.addEventListener(
  "resize",
  () => {

    const lastVisible =
      [...characterSpans]
        .reverse()
        .find(
          (character) =>
            character
              .classList
              .contains("visible")
        );

    if (
      lastVisible &&
      !typingCursor
        ?.classList
        .contains("finished")
    ) {

      moveCursor(
        lastVisible
      );

    }

  }
);
