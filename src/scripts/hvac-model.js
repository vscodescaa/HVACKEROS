/* =========================================================
   HVACKEROS — HVAC 3D MODEL
   Escena Three.js del objeto HVAC (marco, aspas, flujo de
   aire) montada dentro de .visual-shell en la landing.

   Adaptado de la demo standalone (3D.html):
   - Renderer con alpha:true, sin fondo oscuro propio:
     se ve el fondo del .hero detrás del canvas.
   - Se redimensiona según el contenedor #scene
     (ResizeObserver), no según window.innerWidth/Height,
     porque ahora vive dentro de un layout, no a pantalla
     completa.
   - Cámara/FOV ajustados para que el objeto (escalado al
     80% — ver HVAC_SCALE) quepa con margen en cualquier
     aspect-ratio del contenedor (desktop 2 columnas,
     tablet 16/10, mobile ~1/.84-.92) y en cualquier ángulo
     de rotación, sin cortarse.
   - Sin OrbitControls: rotación manual (drag + auto-rotate)
     acotada a la vista frontal, en bucle — ver CONTROLS.
   ========================================================= */

import * as THREE from "three";


/* =========================================================
   SCENE
   ========================================================= */

const container =
  document.getElementById("scene");


const scene =
  new THREE.Scene();


/* =========================================================
   CAMERA
   ========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    38,
    1,
    .1,
    100
  );


/* =========================================================
   RENDERER
   Sin fondo propio: alpha true, la página deja ver
   el fondo real del .hero detrás del canvas.
   ========================================================= */

const renderer =
  new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.toneMapping =
  THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
  1.25;


container.appendChild(
  renderer.domElement
);


/* =========================================================
   CONTROLS — DRAG TO ROTATE, FRENTE EN BUCLE

   El objeto solo debe mostrar su cara frontal (no tiene
   sentido verlo de canto: es un marco plano con aspas).
   Por eso no usamos OrbitControls: su límite de azimut se
   detiene en el borde, y aquí se pidió lo contrario — al
   llegar al límite de un lado, la rotación pasa al límite
   opuesto y se puede seguir girando, como una vuelta
   infinita acotada a la vista frontal (±YAW_RANGE).

   Ese "salto" nunca es instantáneo: `rawYaw` es la entrada
   del usuario sin límite (puede crecer indefinidamente al
   arrastrar), y `displayYaw` es lo que de verdad se aplica
   a hvac.rotation.y cada frame. Cuando rawYaw sale del
   rango visible, calculamos el punto equivalente envuelto y
   ANIMAMOS displayYaw hasta ahí (JUMP_DURATION), en vez de
   asignarlo de golpe — así el giro se ve como un barrido
   rápido y continuo, nunca como un corte.
   ========================================================= */

const YAW_RANGE =
  THREE.MathUtils.degToRad(35);

// Amplitud total del bucle: de -YAW_RANGE a +YAW_RANGE.
const YAW_SPAN =
  YAW_RANGE * 2;

// Cuánto tarda el barrido cuando se cruza un límite.
const JUMP_DURATION = .32;

let rawYaw = 0;
let displayYaw = 0;

let jumpFrom = null;
let jumpTo = null;
let jumpStartTime = null;

let isDragging = false;
let lastPointerX = 0;
let dragVelocity = 0;
let autoRotateDirection = 1;

const AUTO_ROTATE_SPEED =
  THREE.MathUtils.degToRad(4);

const DRAG_SENSITIVITY =
  .0075;

// Envuelve `value` al rango [-YAW_RANGE, YAW_RANGE] — un
// módulo centrado en cero.
function wrapYaw(value) {

  const shifted =
    value + YAW_RANGE;

  const wrapped =
    ((shifted % YAW_SPAN) + YAW_SPAN) % YAW_SPAN;

  return wrapped - YAW_RANGE;

}

// Arranca (o redirige) el barrido de displayYaw hacia
// `target`, tomando el tiempo transcurrido como nuevo t0
// para que un cambio de dirección a mitad de camino no
// produzca su propio corte.
function startJump(from, target) {

  jumpFrom = from;
  jumpTo = target;
  jumpStartTime = clock.getElapsedTime();

}

function onPointerDown(event) {

  isDragging = true;
  dragVelocity = 0;

  // Un drag nuevo cancela cualquier barrido en curso y
  // retoma desde la posición visible actual.
  jumpFrom = null;

  rawYaw = displayYaw;

  lastPointerX =
    event.clientX;

  renderer.domElement
    .setPointerCapture?.(
      event.pointerId
    );

}

function onPointerMove(event) {

  if (!isDragging) {
    return;
  }

  const deltaX =
    event.clientX -
    lastPointerX;

  lastPointerX =
    event.clientX;

  const delta =
    deltaX * DRAG_SENSITIVITY;

  const next =
    rawYaw + delta;

  dragVelocity = delta;

  const wrapped =
    wrapYaw(next);

  const crossedLimit =
    Math.abs(wrapped - next) >
    .0001;

  if (crossedLimit) {

    // Cruzó el límite: colapsamos rawYaw a su valor
    // wrapeado de inmediato (igual que en el auto-rotate),
    // así el próximo delta del drag parte de ahí en vez de
    // seguir creciendo sin límite.
    rawYaw = wrapped;

    if (jumpFrom === null) {

      // Primer cruce: la posición visible se queda en el
      // borde por el que salió, y arrancamos el barrido
      // hasta el punto envuelto correspondiente.
      const edge =
        next > wrapped
          ? YAW_RANGE
          : -YAW_RANGE;

      displayYaw = edge;

      startJump(
        edge,
        wrapped
      );

    } else {

      // Ya había un barrido en curso (el usuario siguió
      // arrastrando más allá de otro límite): solo
      // actualizamos el destino, sin reiniciar displayYaw.
      jumpTo = wrapped;

    }

  } else {

    rawYaw = next;

    if (jumpFrom === null) {

      // Dentro del rango y sin barrido pendiente: la
      // posición visible sigue al cursor 1:1, sin animar
      // — debe sentirse directo.
      displayYaw = wrapped;

    } else {

      // Aún terminando un barrido anterior: no lo
      // interrumpimos, solo mantenemos el destino al día.
      jumpTo = wrapped;

    }

  }

}

function onPointerUp() {

  isDragging = false;

  if (dragVelocity !== 0) {

    autoRotateDirection =
      dragVelocity > 0
        ? 1
        : -1;

  }

}

const canvas =
  renderer.domElement;

canvas.style.cursor =
  "grab";

canvas.addEventListener(
  "pointerdown",
  (event) => {

    canvas.style.cursor =
      "grabbing";

    onPointerDown(event);

  }
);

window.addEventListener(
  "pointermove",
  onPointerMove
);

window.addEventListener(
  "pointerup",
  () => {

    canvas.style.cursor =
      "grab";

    onPointerUp();

  }
);

window.addEventListener(
  "pointercancel",
  onPointerUp
);


/* =========================================================
   LIGHTS
   ========================================================= */

scene.add(
  new THREE.AmbientLight(
    0xffffff,
    1.55
  )
);


const mainLight =
  new THREE.DirectionalLight(
    0xffffff,
    3
  );


mainLight.position.set(
  4,
  6,
  8
);


scene.add(
  mainLight
);


const tealLight =
  new THREE.PointLight(
    0x20c8c1,
    16,
    14
  );


tealLight.position.set(
  -4,
  1.5,
  4
);


scene.add(
  tealLight
);


const greenLight =
  new THREE.PointLight(
    0x4aaa48,
    9,
    12
  );


greenLight.position.set(
  4,
  -3,
  3
);


scene.add(
  greenLight
);


const blueLight =
  new THREE.PointLight(
    0x174b91,
    12,
    14
  );


blueLight.position.set(
  3,
  4,
  -2
);


scene.add(
  blueLight
);


/* =========================================================
   MAIN HVAC OBJECT
   ========================================================= */

const hvac =
  new THREE.Group();


scene.add(
  hvac
);


hvac.rotation.x =
  -.18;


/*
  El ángulo Y ya no se fija aquí: lo controla el drag/loop
  manual más abajo (HORIZONTAL ROTATION), que arranca en
  este mismo valor como pose inicial.
*/

const INITIAL_YAW =
  .48;


hvac.rotation.y =
  INITIAL_YAW;


/*
  Reducido ~20% (pedido explícito: "se ve un poco grande").
  Todo el objeto cuelga de este grupo, así que un solo
  scale lo reduce proporcionalmente sin tocar geometrías.
*/

const HVAC_SCALE =
  .8;


hvac.scale.setScalar(
  HVAC_SCALE
);


/* =========================================================
   MATERIALS
   ========================================================= */

const frameMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x0a151d,
    metalness: .78,
    roughness: .24
  });


const innerMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x102936,
    metalness: .68,
    roughness: .29
  });


const bladeMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xb1c7d1,
    metalness: .72,
    roughness: .22
  });


const tealMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x159b9a,

    metalness: .48,

    roughness: .18,

    emissive:
      0x0c6666,

    emissiveIntensity:
      .65
  });


/* =========================================================
   OUTER FRAME
   ========================================================= */

const frame =
  new THREE.Group();


hvac.add(
  frame
);


function createBar(
  width,
  height,
  x,
  y
) {

  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      .46
    );


  const mesh =
    new THREE.Mesh(
      geometry,
      frameMaterial
    );


  mesh.position.set(
    x,
    y,
    0
  );


  return mesh;

}


/* TOP */

frame.add(
  createBar(
    5.8,
    .72,
    0,
    2.53
  )
);


/* BOTTOM */

frame.add(
  createBar(
    5.8,
    .72,
    0,
    -2.53
  )
);


/* LEFT */

frame.add(
  createBar(
    .72,
    4.35,
    -2.53,
    0
  )
);


/* RIGHT */

frame.add(
  createBar(
    .72,
    4.35,
    2.53,
    0
  )
);


/* =========================================================
   CORNERS
   ========================================================= */

const cornerMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x193f52,

    metalness: .7,

    roughness: .2
  });


const corners = [
  [-2.53, 2.53],
  [2.53, 2.53],
  [-2.53, -2.53],
  [2.53, -2.53]
];


corners.forEach(
  ([x, y]) => {

    const corner =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          .84,
          .84,
          .52
        ),

        cornerMaterial

      );


    corner.position.set(
      x,
      y,
      .02
    );


    frame.add(
      corner
    );

  }
);


/* =========================================================
   INNER DISC
   ========================================================= */

const innerPanel =
  new THREE.Mesh(

    new THREE.CircleGeometry(
      1.93,
      80
    ),

    new THREE.MeshStandardMaterial({
      color: 0x07141d,

      metalness: .35,

      roughness: .55,

      transparent: true,

      opacity: .82
    })

  );


innerPanel.position.z =
  -.32;


hvac.add(
  innerPanel
);


/* =========================================================
   DIRECTION VANES
   ========================================================= */

const vanes =
  new THREE.Group();


hvac.add(
  vanes
);


function createVane() {

  return new THREE.Mesh(

    new THREE.BoxGeometry(
      1.28,
      .24,
      .14
    ),

    innerMaterial

  );

}


const vaneAngles = [
  45,
  135,
  225,
  315
];


vaneAngles.forEach(
  (degrees, index) => {

    const angle =
      THREE.MathUtils.degToRad(
        degrees
      );


    const vane =
      createVane();


    const distance =
      1.73;


    vane.position.x =
      Math.cos(angle)
      *
      distance;


    vane.position.y =
      Math.sin(angle)
      *
      distance;


    vane.position.z =
      .05;


    vane.rotation.z =
      angle;


    vane.rotation.y =
      index % 2 === 0
        ? .22
        : -.22;


    vanes.add(
      vane
    );

  }
);


/* =========================================================
   CENTRAL RING
   ========================================================= */

const ring =
  new THREE.Mesh(

    new THREE.TorusGeometry(
      1.35,
      .16,
      32,
      100
    ),

    innerMaterial

  );


ring.position.z =
  .18;


hvac.add(
  ring
);


const accentRing =
  new THREE.Mesh(

    new THREE.TorusGeometry(
      1.36,
      .035,
      16,
      100
    ),

    tealMaterial

  );


accentRing.position.z =
  .37;


hvac.add(
  accentRing
);


/* =========================================================
   ROTOR
   ========================================================= */

const rotor =
  new THREE.Group();


rotor.position.z =
  .22;


hvac.add(
  rotor
);


const hub =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      .31,
      .31,
      .34,
      48
    ),

    innerMaterial

  );


hub.rotation.x =
  Math.PI / 2;


rotor.add(
  hub
);


const hubCap =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      .17,
      .17,
      .38,
      48
    ),

    bladeMaterial

  );


hubCap.rotation.x =
  Math.PI / 2;


hubCap.position.z =
  .05;


rotor.add(
  hubCap
);


/* =========================================================
   BLADES
   ========================================================= */

function createBlade() {

  const shape =
    new THREE.Shape();


  shape.moveTo(
    .22,
    -.12
  );


  shape.bezierCurveTo(
    .52,
    -.18,
    .95,
    -.12,
    1.14,
    .05
  );


  shape.bezierCurveTo(
    1.0,
    .34,
    .66,
    .48,
    .30,
    .30
  );


  shape.bezierCurveTo(
    .19,
    .20,
    .16,
    .04,
    .22,
    -.12
  );


  const geometry =
    new THREE.ExtrudeGeometry(
      shape,
      {
        depth:
          .07,

        bevelEnabled:
          true,

        bevelSegments:
          3,

        bevelSize:
          .025,

        bevelThickness:
          .025
      }
    );


  geometry.center();


  const blade =
    new THREE.Mesh(
      geometry,
      bladeMaterial
    );


  blade.position.x =
    .62;


  blade.rotation.y =
    -.16;


  return blade;

}


for (
  let i = 0;
  i < 6;
  i++
) {

  const pivot =
    new THREE.Group();


  pivot.rotation.z =
    i *
    Math.PI /
    3;


  pivot.add(
    createBlade()
  );


  rotor.add(
    pivot
  );

}


/* =========================================================
   AIRFLOW

   Solo existen partículas siguiendo curvas invisibles
   (la curva existe matemáticamente pero no se renderiza).
   ========================================================= */

const airGroup =
  new THREE.Group();


airGroup.position.z =
  .56;


hvac.add(
  airGroup
);


const flows = [];


function createInvisibleFlow({
  points,
  color,
  speed,
  count,
  size = .04,
  opacity = .75
}) {

  const curve =
    new THREE.CatmullRomCurve3(
      points,
      false,
      "centripetal"
    );


  const particles =
    [];


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const geometry =
      new THREE.CapsuleGeometry(
        size,
        size * 3.2,
        4,
        8
      );


    const material =
      new THREE.MeshBasicMaterial({
        color,

        transparent:
          true,

        opacity,

        depthWrite:
          false
      });


    const particle =
      new THREE.Mesh(
        geometry,
        material
      );


    particle.rotation.z =
      Math.PI / 2;


    airGroup.add(
      particle
    );


    particles.push({

      mesh:
        particle,

      offset:
        i / count,

      phase:
        Math.random()
        *
        Math.PI
        *
        2

    });

  }


  flows.push({
    curve,
    particles,
    speed
  });

}


/* =========================================================
   FLOW LAYERS

   Entrada: separación amplia.
   Centro: compresión.
   Salida: expansión.
   ========================================================= */

const flowOffsets = [
  -1.05,
  -.78,
  -.52,
  -.27,
   0,
   .27,
   .52,
   .78,
   1.05
];


flowOffsets.forEach(
  (offset, index) => {

    const distanceFromCenter =
      Math.abs(offset);


    const centerStrength =
      1 -
      Math.min(
        distanceFromCenter,
        1
      );


    let color;


    if (
      index <= 2
    ) {

      color =
        0x4587bb;

    } else if (
      index >= 6
    ) {

      color =
        0x69b95d;

    } else {

      color =
        0x52c8c1;

    }


    createInvisibleFlow({

      points: [

        new THREE.Vector3(
          -3.55,
          offset * 1.18,
          -.02
        ),

        new THREE.Vector3(
          -2.85,
          offset * 1.04,
          0
        ),

        new THREE.Vector3(
          -2.1,
          offset * .82,
          .02
        ),

        new THREE.Vector3(
          -1.42,
          offset * .58,
          .06
        ),

        new THREE.Vector3(
          -.75,
          offset * .32,
          .11
        ),

        new THREE.Vector3(
          0,
          offset * .12,
          .18
        ),

        new THREE.Vector3(
          .76,
          offset * .31,
          .12
        ),

        new THREE.Vector3(
          1.48,
          offset * .58,
          .07
        ),

        new THREE.Vector3(
          2.15,
          offset * .83,
          .03
        ),

        new THREE.Vector3(
          2.88,
          offset * 1.05,
          0
        ),

        new THREE.Vector3(
          3.58,
          offset * 1.22,
          -.02
        )

      ],

      color,

      speed:
        .072
        +
        centerStrength
        *
        .04,

      count:
        index === 4
          ? 8
          : 5,

      size:
        .026
        +
        centerStrength
        *
        .013,

      opacity:
        .48
        +
        centerStrength
        *
        .30

    });

  }
);


/* =========================================================
   SECOND AIR LAYER

   Partículas ambientales finas adicionales.
   ========================================================= */

const ambientParticles =
  [];


const particleCount =
  55;


for (
  let i = 0;
  i < particleCount;
  i++
) {

  const particle =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        .018 +
        Math.random() * .012,
        8,
        8
      ),

      new THREE.MeshBasicMaterial({

        color:
          Math.random() > .5
            ? 0x65d0ca
            : 0x6ebc65,

        transparent:
          true,

        opacity:
          .22 +
          Math.random() * .28,

        depthWrite:
          false

      })

    );


  airGroup.add(
    particle
  );


  ambientParticles.push({

    mesh:
      particle,

    x:
      Math.random(),

    y:
      (
        Math.random()
        -
        .5
      )
      *
      2.3,

    z:
      (
        Math.random()
        -
        .5
      )
      *
      .35,

    speed:
      .035
      +
      Math.random()
      *
      .045,

    phase:
      Math.random()
      *
      Math.PI
      *
      2

  });

}


/* =========================================================
   SCREWS
   ========================================================= */

const screwMaterial =
  new THREE.MeshStandardMaterial({

    color:
      0x7fa0ae,

    metalness:
      .9,

    roughness:
      .18

  });


corners.forEach(
  ([x, y]) => {

    const screw =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          .065,
          .065,
          .12,
          24
        ),

        screwMaterial

      );


    screw.rotation.x =
      Math.PI / 2;


    screw.position.set(
      x,
      y,
      .31
    );


    hvac.add(
      screw
    );

  }
);


/* =========================================================
   INTERNAL HALO
   ========================================================= */

const halo =
  new THREE.Mesh(

    new THREE.RingGeometry(
      2,
      2.04,
      96
    ),

    new THREE.MeshBasicMaterial({

      color:
        0x159b9a,

      transparent:
        true,

      opacity:
        .23,

      side:
        THREE.DoubleSide

    })

  );


halo.position.z =
  -.44;


hvac.add(
  halo
);


/* =========================================================
   CLOCK
   ========================================================= */

const clock =
  new THREE.Clock();


/* =========================================================
   ANIMATION
   ========================================================= */

function animate() {

  requestAnimationFrame(
    animate
  );


  const time =
    clock.getElapsedTime();


  /* ROTOR */

  rotor.rotation.z =
    -time * 1.05;


  /* ACCENT RING */

  accentRing.rotation.z =
    time * .1;


  /* FLOAT */

  hvac.position.y =
    Math.sin(
      time * .8
    )
    *
    .07;


  /* HORIZONTAL ROTATION — drag manual + auto-rotate,
     ambos en bucle dentro de ±YAW_RANGE, con el cruce de
     límite siempre animado (ver CONTROLS). */

  if (!isDragging && jumpFrom === null) {

    const next =
      rawYaw +
      AUTO_ROTATE_SPEED *
      autoRotateDirection *
      (1 / 60);

    const wrapped =
      wrapYaw(next);

    if (
      Math.abs(wrapped - next) >
      .0001
    ) {

      // Cruzó el límite: colapsamos rawYaw a su valor
      // wrapeado de inmediato (si no, seguiría creciendo
      // sin límite y este bloque re-disparía un jump nuevo
      // en cada frame siguiente). El barrido visual lo
      // lleva displayYaw, no rawYaw.

      const edge =
        next > wrapped
          ? YAW_RANGE
          : -YAW_RANGE;

      rawYaw = wrapped;
      displayYaw = edge;

      startJump(
        edge,
        wrapped
      );

    } else {

      rawYaw = next;
      displayYaw = wrapped;

    }

  }

  if (jumpFrom !== null) {

    const elapsed =
      time - jumpStartTime;

    const progress =
      THREE.MathUtils.clamp(
        elapsed / JUMP_DURATION,
        0,
        1
      );

    // Ease-out: rápido al principio, se asienta suave.
    const eased =
      1 - (1 - progress) * (1 - progress);

    displayYaw =
      THREE.MathUtils.lerp(
        jumpFrom,
        jumpTo,
        eased
      );

    if (progress >= 1) {

      jumpFrom = null;
      jumpTo = null;

    }

  }

  hvac.rotation.y =
    INITIAL_YAW +
    displayYaw;


  /* MAIN AIR PARTICLES */

  flows.forEach(
    (
      flow,
      flowIndex
    ) => {

      flow.particles.forEach(
        (
          particle,
          particleIndex
        ) => {

          const progress =
            (
              time
              *
              flow.speed

              +

              particle.offset

              +

              flowIndex
              *
              .017
            )
            %
            1;


          const position =
            flow.curve
              .getPointAt(
                progress
              );


          particle.mesh
            .position
            .copy(
              position
            );


          const tangent =
            flow.curve
              .getTangentAt(
                progress
              )
              .normalize();


          const angle =
            Math.atan2(
              tangent.y,
              tangent.x
            );


          particle.mesh.rotation.z =
            angle
            -
            Math.PI / 2;


          const pulse =
            .82
            +
            Math.sin(
              time * 3.5
              +
              particle.phase
            )
            *
            .14;


          particle.mesh
            .scale
            .setScalar(
              pulse
            );

        }
      );

    }
  );


  /* AMBIENT AIR PARTICLES */

  ambientParticles.forEach(
    (
      particle,
      index
    ) => {

      let progress =
        (
          particle.x
          +
          time
          *
          particle.speed
        )
        %
        1;


      const x =
        THREE.MathUtils.lerp(
          -3.25,
          3.25,
          progress
        );


      const centerFactor =
        Math.abs(
          progress
          -
          .5
        )
        *
        2;


      const spread =
        .24
        +
        centerFactor
        *
        .95;


      const y =
        particle.y
        *
        spread
        +
        Math.sin(
          time * 1.3
          +
          particle.phase
        )
        *
        .035;


      const z =
        particle.z
        +
        Math.cos(
          time
          +
          particle.phase
        )
        *
        .025;


      particle.mesh.position.set(
        x,
        y,
        z
      );


      particle.mesh.material.opacity =
        .18
        +
        (
          1 -
          centerFactor
        )
        *
        .28;

    }
  );


  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================================
   RESPONSIVE

   El objeto ocupa de -2.53 a 2.53 en X/Y (marco), con
   aspas que sobresalen hasta ~1.14 desde el centro del
   rotor (radio efectivo del objeto ≈ 3.0 unidades desde
   el origen, contando esquinas). Ajustamos la distancia
   de cámara según el aspect-ratio del CONTENEDOR
   (.visual-shell vía #scene), no de la ventana, para que
   quepa con margen en cualquier breakpoint sin cortarse.
   ========================================================= */

function resize() {

  const width =
    container.clientWidth;

  const height =
    container.clientHeight;

  if (
    width === 0 ||
    height === 0
  ) {
    return;
  }

  const aspect =
    width / height;

  camera.aspect =
    aspect;

  /*
    Semi-extensión del objeto EN REPOSO (marco + esquinas)
    es ~3.05, pero eso solo cubre el objeto de frente. Al
    rotar en Y (drag/auto-rotate), las esquinas del marco
    cuadrado —a distancia diagonal √(2.53²+2.53²) ≈ 3.58 del
    eje de rotación— barren un radio mayor y se proyectan
    más lejos en X en los ángulos intermedios: por eso se
    cortaba al girar. Usamos ese radio diagonal como peor
    caso, y lo escalamos por HVAC_SCALE porque la cámara ve
    el objeto ya reducido.
  */

  const objectHalfExtent =
    3.58
    *
    HVAC_SCALE;

  const fovRadians =
    THREE.MathUtils.degToRad(
      camera.fov
    );

  /*
    Distancia mínima para que el objeto quepa en el eje
    vertical dado el FOV vertical de la cámara.
  */

  const distanceForVertical =
    objectHalfExtent /
    Math.tan(
      fovRadians / 2
    );

  /*
    Si el contenedor es más angosto que alto (aspect < 1),
    el FOV horizontal efectivo es menor que el vertical,
    así que necesitamos alejar más la cámara para que
    el objeto quepa también a lo ancho.
  */

  const distanceForHorizontal =
    aspect < 1
      ? distanceForVertical / aspect
      : distanceForVertical;

  const targetDistance =
    Math.max(
      distanceForVertical,
      distanceForHorizontal
    )
    *
    1.18;

  const clampedDistance =
    THREE.MathUtils.clamp(
      targetDistance,
      6.8,
      15.5
    );

  camera.position.set(
    0,
    .3,
    clampedDistance
  );

  camera.updateProjectionMatrix();

  renderer.setSize(
    width,
    height,
    false
  );

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );

}


const resizeObserver =
  new ResizeObserver(
    () => {

      resize();

    }
  );


resizeObserver.observe(
  container
);


resize();
