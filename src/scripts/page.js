/* =========================================================
   HVACKEROS — PAGE
   Punto de entrada compartido por todas las páginas: agrupa
   el comportamiento común del header/footer, el reveal on
   scroll y el smooth scroll en un solo <script type="module">
   por página (Vite lo empaqueta en build).

   El script propio de cada página (por ejemplo about.js o
   news-data.js) se importa aparte, solo donde aplica.
   ========================================================= */

import "./header-footer.js";
import "./reveal.js";
import "./smooth-scroll.js";
