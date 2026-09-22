/* =========================================================
   HVACKEROS — NEWS DATA + RENDERING
   Específico de news.html: datos de eventos/noticias,
   render del destacado y del grid, filtros.

   NOTA: el .reveal inicial del hero/filtros ya lo anima
   reveal.js (cargado antes que este script, vía page.js).
   Este archivo añade su propio observer para el contenido
   inyectado dinámicamente (featured + cards), ya que esos
   elementos no existen todavía cuando reveal.js corre.
   ========================================================= */

/*
  ==========================================================
  DATOS

  ESTA ES LA ÚNICA PARTE QUE EVENTUALMENTE TENDRÍAS
  QUE MODIFICAR PARA AGREGAR CONTENIDO.

  Después podemos mover estos arrays a:
  /data/events.json
  /data/news.json
  ==========================================================
*/

const events = [

  {
    id: "event-01",
    type: "event",
    title:
      "Conferencia: el futuro de la climatización eficiente",
    date: "2026-10-02",
    time: "17:00",
    location:
      "Tecnológico de Monterrey",
    category:
      "Conferencia",
    description:
      "Una conversación sobre eficiencia energética, nuevas tecnologías y el papel del HVAC en los espacios del futuro.",
    image:
      "https://picsum.photos/seed/hvackeros-event-01/1400/900",
    featured: true,
    link: "#"
  },

  {
    id: "event-02",
    type: "event",
    title:
      "Visita técnica a instalaciones de climatización",
    date: "2026-10-18",
    time: "09:00",
    location:
      "Monterrey, Nuevo León",
    category:
      "Visita industrial",
    description:
      "Un recorrido para conocer de primera mano sistemas de climatización, control y operación en instalaciones reales.",
    image:
      "https://picsum.photos/seed/hvackeros-event-02/1200/800",
    featured: false,
    link: "#"
  },

  {
    id: "event-03",
    type: "event",
    title:
      "Introducción práctica a sistemas HVAC",
    date: "2026-09-05",
    time: "16:00",
    location:
      "Campus Monterrey",
    category:
      "Taller",
    description:
      "Actividad introductoria enfocada en los conceptos fundamentales que forman un sistema HVAC.",
    image:
      "https://picsum.photos/seed/hvackeros-event-03/1200/800",
    featured: false,
    link: "#"
  }

];


const news = [

  {
    id: "news-01",
    type: "news",
    title:
      "HVACKEROS inicia una nueva etapa como comunidad estudiantil",
    date: "2026-09-15",
    category:
      "Comunidad",
    description:
      "El grupo continúa consolidando su identidad y preparando nuevas actividades para conectar estudiantes con la industria HVAC.",
    image:
      "https://picsum.photos/seed/hvackeros-news-01/1200/800",
    link: "#"
  },

  {
    id: "news-02",
    type: "news",
    title:
      "Preparando nuevas conexiones con la industria",
    date: "2026-09-08",
    category:
      "Colaboraciones",
    description:
      "Estamos trabajando en nuevas oportunidades que permitan acercar a los integrantes del grupo a profesionales y empresas del sector.",
    image:
      "https://picsum.photos/seed/hvackeros-news-02/1200/800",
    link: "#"
  },

  {
    id: "news-03",
    type: "news",
    title:
      "Una identidad para representar a nuestra comunidad",
    date: "2026-08-29",
    category:
      "HVACKEROS",
    description:
      "La identidad visual del grupo representa energía, climatización, colaboración e innovación dentro de una misma comunidad.",
    image:
      "https://picsum.photos/seed/hvackeros-news-03/1200/800",
    link: "#"
  }

];


/* =========================================================
   HELPERS
   ========================================================= */

const MONTHS = [
  "ENE", "FEB", "MAR", "ABR",
  "MAY", "JUN", "JUL", "AGO",
  "SEP", "OCT", "NOV", "DIC"
];


function parseDate(dateString) {

  const [year, month, day] =
    dateString
      .split("-")
      .map(Number);

  return new Date(
    year,
    month - 1,
    day
  );

}


function formatDate(dateString) {

  const date =
    parseDate(dateString);

  return {
    day:
      String(date.getDate())
        .padStart(2, "0"),

    month:
      MONTHS[date.getMonth()],

    year:
      date.getFullYear(),

    short:
      `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]}`
  };

}


function isUpcoming(item) {

  if (item.type !== "event") {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return parseDate(item.date) >= today;

}


function getStatus(item) {

  if (item.type === "news") {

    return {
      text: "Noticia",
      className: ""
    };

  }

  if (isUpcoming(item)) {

    return {
      text: "Próximo",
      className: "upcoming"
    };

  }

  return {
    text: "Finalizado",
    className: ""
  };

}


/* =========================================================
   COMBINED DATA
   ========================================================= */

const allContent = [
  ...events,
  ...news
]
.sort(
  (a, b) =>
    parseDate(b.date) -
    parseDate(a.date)
);


/* =========================================================
   FEATURED
   ========================================================= */

function getFeaturedItem() {

  const explicit =
    events.find(
      item =>
        item.featured &&
        isUpcoming(item)
    );

  if (explicit) {
    return explicit;
  }

  const upcoming =
    events
      .filter(isUpcoming)
      .sort(
        (a, b) =>
          parseDate(a.date) -
          parseDate(b.date)
      );

  return upcoming[0] || allContent[0];

}


function renderFeatured() {

  const container =
    document.getElementById(
      "featuredContainer"
    );

  const item =
    getFeaturedItem();

  if (!item) {

    container.innerHTML = "";

    return;

  }

  const date =
    formatDate(item.date);

  const status =
    getStatus(item);

  const metaSecond =
    item.type === "event"
      ? `${item.time || ""}`
      : item.category;

  container.innerHTML = `

    <a
      href="${item.link || "#"}"
      class="featured reveal"
    >

      <div class="featured-media">

        <img
          src="${item.image}"
          alt="${item.title}"
        >

        <div class="featured-status">

          <span
            class="featured-status-dot"
          ></span>

          ${status.text}

        </div>

      </div>


      <div class="featured-content">

        <div>

          <div class="featured-meta">

            <span>
              ${item.category}
            </span>

            ${
              metaSecond
                ? `
                  <span>
                    ${metaSecond}
                  </span>
                `
                : ""
            }

          </div>


          <div class="featured-body">

            <h3>
              ${item.title}
            </h3>

            <p>
              ${item.description}
            </p>

          </div>

        </div>


        <div class="featured-bottom">

          <div class="featured-date">

            <strong>
              ${date.day}
            </strong>

            <span>
              ${date.month}
              ·
              ${date.year}
            </span>

          </div>


          <span class="featured-arrow">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M7 17L17 7"/>
              <path d="M8 7H17V16"/>
            </svg>

          </span>

        </div>

      </div>

    </a>

  `;

}


/* =========================================================
   CARDS
   ========================================================= */

function createCard(item) {

  const date =
    formatDate(item.date);

  const status =
    getStatus(item);

  const typeLabel =
    item.type === "event"
      ? "Evento"
      : "Noticia";

  const footerText =
    item.type === "event"
      ? item.location
      : item.category;

  return `

    <a
      href="${item.link || "#"}"
      class="content-card reveal"
      data-type="${item.type}"
    >

      <div class="card-media">

        <img
          src="${item.image}"
          alt="${item.title}"
          loading="lazy"
        >

        <span class="card-type">
          ${typeLabel}
        </span>

      </div>


      <div class="card-content">

        <div class="card-topline">

          <span>
            ${date.short}
            ·
            ${date.year}
          </span>

          <span
            class="${status.className}"
          >
            ${status.text}
          </span>

        </div>


        <h3>
          ${item.title}
        </h3>


        <p>
          ${item.description}
        </p>


        <div class="card-footer">

          <span class="card-location">
            ${footerText}
          </span>


          <span class="card-arrow">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M7 17L17 7"/>
              <path d="M8 7H17V16"/>
            </svg>

          </span>

        </div>

      </div>

    </a>

  `;

}


/* =========================================================
   FILTER
   ========================================================= */

let currentFilter = "all";


function getFilteredContent() {

  /*
    Evitamos repetir el elemento
    destacado dentro del grid.
  */

  const featured =
    getFeaturedItem();

  let data =
    allContent.filter(
      item =>
        !featured ||
        item.id !== featured.id
    );

  if (currentFilter !== "all") {

    data =
      data.filter(
        item =>
          item.type === currentFilter
      );

  }

  return data;

}


function renderGrid() {

  const grid =
    document.getElementById(
      "contentGrid"
    );

  const emptyState =
    document.getElementById(
      "emptyState"
    );

  const filterCount =
    document.getElementById(
      "filterCount"
    );

  const resultLabel =
    document.getElementById(
      "resultLabel"
    );

  const content =
    getFilteredContent();

  grid.innerHTML =
    content
      .map(createCard)
      .join("");

  emptyState
    .classList
    .toggle(
      "visible",
      content.length === 0
    );

  filterCount.textContent =
    `${content.length} ${
      content.length === 1
        ? "publicación"
        : "publicaciones"
    }`;

  const labels = {
    all: "Todo",
    event: "Eventos",
    news: "Noticias"
  };

  resultLabel.textContent =
    labels[currentFilter];

  observeReveals();

}


/* =========================================================
   FILTER BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    ".filter-button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".filter-button"
            )
            .forEach(
              item =>
                item
                  .classList
                  .remove("active")
            );

          button
            .classList
            .add("active");

          currentFilter =
            button.dataset.filter;

          renderGrid();

        }
      );

    }
  );


/* =========================================================
   REVEAL (contenido inyectado dinámicamente)
   ========================================================= */

let revealObserver;

function observeReveals() {

  if (revealObserver) {

    revealObserver.disconnect();

  }

  revealObserver =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

            if (entry.isIntersecting) {

              entry.target
                .classList
                .add("visible");

              revealObserver
                .unobserve(
                  entry.target
                );

            }

          }
        );

      },

      {
        threshold: .10
      }

    );

  document
    .querySelectorAll(
      ".reveal:not(.visible)"
    )
    .forEach(
      element =>
        revealObserver
          .observe(element)
    );

}


/* =========================================================
   INIT
   ========================================================= */

renderFeatured();

renderGrid();

observeReveals();
