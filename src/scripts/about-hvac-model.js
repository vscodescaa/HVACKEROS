/* =========================================================
   HVACKEROS — ABOUT HVAC 3D
   Modelo modular transparente para la sección "Lo que representa".
   - Three.js local del proyecto.
   - Exploded view automático.
   - Drag horizontal + vertical suave.
   - Sin fondo propio.
   - ResizeObserver para desktop, laptop, tablet y móvil.
   ========================================================= */

import * as THREE from "three";

const container =
  document.getElementById("identityHvacScene");

if (container) {

  const scene =
    new THREE.Scene();

  const camera =
    new THREE.PerspectiveCamera(
      31,
      1,
      .1,
      100
    );

  const renderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

  renderer.setClearColor(
    0x000000,
    0
  );

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
    1.08;

  renderer.shadowMap.enabled =
    true;

  renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

  container.appendChild(
    renderer.domElement
  );

  const canvas =
    renderer.domElement;

  canvas.setAttribute(
    "aria-hidden",
    "true"
  );

  /* =======================================================
     LIGHTING
     ======================================================= */

  scene.add(
    new THREE.HemisphereLight(
      0xffffff,
      0x6b7d83,
      2.65
    )
  );

  const keyLight =
    new THREE.DirectionalLight(
      0xffffff,
      4.25
    );

  keyLight.position.set(
    5,
    8,
    7
  );

  keyLight.castShadow =
    true;

  scene.add(
    keyLight
  );

  const rimLight =
    new THREE.DirectionalLight(
      0x53bbb4,
      3.15
    );

  rimLight.position.set(
    -6,
    3,
    -5
  );

  scene.add(
    rimLight
  );

  const fillLight =
    new THREE.DirectionalLight(
      0x7d9fbe,
      1.9
    );

  fillLight.position.set(
    4,
    -1,
    -5
  );

  scene.add(
    fillLight
  );

  /* =======================================================
     MATERIALS
     ======================================================= */

  const COLORS = {
    navy: 0x123f6a,
    navyDark: 0x061721,
    teal: 0x159b9a,
    shell: 0xdce5e4,
    shellLight: 0xf2f5f3,
    metal: 0x9caeb4,
    interior: 0x132d38
  };

  function material(
    color,
    roughness = .55,
    metalness = .1
  ) {

    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness
    });

  }

  const shellMaterial =
    material(
      COLORS.shellLight,
      .42,
      .12
    );

  const shellSecondary =
    material(
      COLORS.shell,
      .5,
      .12
    );

  const darkMaterial =
    material(
      COLORS.navyDark,
      .36,
      .35
    );

  const interiorMaterial =
    material(
      COLORS.interior,
      .45,
      .3
    );

  const tealMaterial =
    material(
      COLORS.teal,
      .28,
      .3
    );

  const metalMaterial =
    material(
      COLORS.metal,
      .27,
      .65
    );

  /* =======================================================
     MAIN GROUP + EXPLODED PARTS
     ======================================================= */

  const machine =
    new THREE.Group();

  machine.rotation.x =
    -.08;

  machine.rotation.y =
    -.52;

  scene.add(
    machine
  );

  const explodedParts =
    [];

  function registerPart(
    object,
    explodeVector
  ) {

    const start =
      object.position.clone();

    explodedParts.push({
      object,
      start,
      exploded:
        start
          .clone()
          .add(explodeVector)
    });

    return object;

  }

  function addEdges(
    object,
    opacity = .14
  ) {

    if (
      !(object instanceof THREE.Mesh)
    ) {
      return;
    }

    const edges =
      new THREE.EdgesGeometry(
        object.geometry
      );

    const line =
      new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
          color: COLORS.navy,
          transparent: true,
          opacity
        })
      );

    object.add(
      line
    );

  }

  /* =======================================================
     BASE + INTERNAL FRAME
     ======================================================= */

  const base =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        4.2,
        .22,
        2.75
      ),
      darkMaterial
    );

  base.position.y =
    -1.48;

  machine.add(
    base
  );

  addEdges(
    base,
    .11
  );

  const frame =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        3.85,
        2.55,
        2.35
      ),
      interiorMaterial
    );

  frame.position.y =
    -.08;

  machine.add(
    frame
  );

  addEdges(
    frame,
    .08
  );

  /* =======================================================
     EXTERIOR PANELS
     ======================================================= */

  const topPanel =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        4.1,
        .16,
        2.7
      ),
      shellMaterial
    );

  topPanel.position.set(
    0,
    1.35,
    0
  );

  machine.add(
    topPanel
  );

  addEdges(
    topPanel
  );

  registerPart(
    topPanel,
    new THREE.Vector3(
      0,
      1.15,
      0
    )
  );

  const leftPanel =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .14,
        2.6,
        2.65
      ),
      shellSecondary
    );

  leftPanel.position.set(
    -2.03,
    -.02,
    0
  );

  machine.add(
    leftPanel
  );

  addEdges(
    leftPanel
  );

  registerPart(
    leftPanel,
    new THREE.Vector3(
      -1.25,
      .1,
      0
    )
  );

  const rightPanel =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .14,
        2.6,
        2.65
      ),
      shellSecondary
    );

  rightPanel.position.set(
    2.03,
    -.02,
    0
  );

  machine.add(
    rightPanel
  );

  addEdges(
    rightPanel
  );

  registerPart(
    rightPanel,
    new THREE.Vector3(
      1.25,
      .1,
      0
    )
  );

  const frontPanel =
    new THREE.Group();

  frontPanel.position.set(
    0,
    -.02,
    1.39
  );

  machine.add(
    frontPanel
  );

  const frontShell =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        4,
        2.55,
        .14
      ),
      shellMaterial
    );

  frontPanel.add(
    frontShell
  );

  addEdges(
    frontShell,
    .12
  );

  const intake =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.78,
        1.76,
        .08
      ),
      darkMaterial
    );

  intake.position.set(
    -.7,
    0,
    .095
  );

  frontPanel.add(
    intake
  );

  for (
    let i = -5;
    i <= 5;
    i++
  ) {

    const grille =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.58,
          .025,
          .045
        ),
        metalMaterial
      );

    grille.position.set(
      -.7,
      i * .13,
      .15
    );

    frontPanel.add(
      grille
    );

  }

  const statusStripe =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .07,
        1.75,
        .04
      ),
      tealMaterial
    );

  statusStripe.position.set(
    1.23,
    0,
    .11
  );

  frontPanel.add(
    statusStripe
  );

  registerPart(
    frontPanel,
    new THREE.Vector3(
      0,
      0,
      1.55
    )
  );

  const rearPanel =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        4,
        2.55,
        .14
      ),
      shellSecondary
    );

  rearPanel.position.set(
    0,
    -.02,
    -1.39
  );

  machine.add(
    rearPanel
  );

  addEdges(
    rearPanel
  );

  registerPart(
    rearPanel,
    new THREE.Vector3(
      0,
      0,
      -1.15
    )
  );

  /* =======================================================
     FAN MODULE
     ======================================================= */

  const fanModule =
    new THREE.Group();

  fanModule.position.set(
    -.72,
    0,
    .63
  );

  machine.add(
    fanModule
  );

  const fanHousing =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        .82,
        .82,
        .18,
        64
      ),
      darkMaterial
    );

  fanHousing.rotation.x =
    Math.PI / 2;

  fanModule.add(
    fanHousing
  );

  const fanRing =
    new THREE.Mesh(
      new THREE.TorusGeometry(
        .62,
        .035,
        14,
        80
      ),
      tealMaterial
    );

  fanRing.position.z =
    .12;

  fanModule.add(
    fanRing
  );

  const fanRotor =
    new THREE.Group();

  fanRotor.position.z =
    .15;

  fanModule.add(
    fanRotor
  );

  const bladeGeometry =
    new THREE.BoxGeometry(
      .17,
      .58,
      .055
    );

  for (
    let i = 0;
    i < 6;
    i++
  ) {

    const blade =
      new THREE.Mesh(
        bladeGeometry,
        metalMaterial
      );

    blade.position.y =
      .27;

    blade.rotation.z =
      -.22;

    const pivot =
      new THREE.Group();

    pivot.rotation.z =
      i *
      (
        Math.PI * 2 / 6
      );

    pivot.add(
      blade
    );

    fanRotor.add(
      pivot
    );

  }

  const fanCenter =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        .13,
        .13,
        .12,
        32
      ),
      tealMaterial
    );

  fanCenter.rotation.x =
    Math.PI / 2;

  fanCenter.position.z =
    .18;

  fanModule.add(
    fanCenter
  );

  registerPart(
    fanModule,
    new THREE.Vector3(
      -.65,
      0,
      .65
    )
  );

  /* =======================================================
     HEAT EXCHANGER
     ======================================================= */

  const coil =
    new THREE.Group();

  coil.position.set(
    .87,
    .02,
    .15
  );

  machine.add(
    coil
  );

  const coilFrame =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.2,
        1.8,
        .18
      ),
      darkMaterial
    );

  coil.add(
    coilFrame
  );

  addEdges(
    coilFrame,
    .1
  );

  for (
    let i = -5;
    i <= 5;
    i++
  ) {

    const fin =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .95,
          .035,
          .25
        ),
        metalMaterial
      );

    fin.position.y =
      i * .135;

    coil.add(
      fin
    );

  }

  for (
    let i = -2;
    i <= 2;
    i++
  ) {

    const vertical =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .035,
          1.55,
          .29
        ),
        tealMaterial
      );

    vertical.position.x =
      i * .19;

    coil.add(
      vertical
    );

  }

  registerPart(
    coil,
    new THREE.Vector3(
      .75,
      .05,
      -.1
    )
  );

  /* =======================================================
     DUCT + INTERNAL PIPE
     ======================================================= */

  const duct =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.25,
        1.15,
        1.05
      ),
      shellMaterial
    );

  duct.position.set(
    2.72,
    .15,
    -.05
  );

  machine.add(
    duct
  );

  addEdges(
    duct
  );

  registerPart(
    duct,
    new THREE.Vector3(
      .9,
      0,
      0
    )
  );

  const ductOpening =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .08,
        .78,
        .72
      ),
      darkMaterial
    );

  ductOpening.position.set(
    3.37,
    .15,
    -.05
  );

  machine.add(
    ductOpening
  );

  registerPart(
    ductOpening,
    new THREE.Vector3(
      .9,
      0,
      0
    )
  );

  const pipe =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        .06,
        .06,
        1.55,
        20
      ),
      tealMaterial
    );

  pipe.rotation.z =
    Math.PI / 2;

  pipe.position.set(
    .12,
    -.82,
    -.45
  );

  machine.add(
    pipe
  );

  machine.traverse(
    (object) => {

      if (
        object instanceof THREE.Mesh
      ) {

        object.castShadow =
          true;

        object.receiveShadow =
          true;

      }

    }
  );

  /* =======================================================
     INTERACTION
     ======================================================= */

  let isDragging =
    false;

  let pointerId =
    null;

  let lastX =
    0;

  let lastY =
    0;

  let manualYaw =
    0;

  let manualPitch =
    0;

  let idleDirection =
    1;

  canvas.style.cursor =
    "grab";

  canvas.style.touchAction =
    "pan-y";

  canvas.addEventListener(
    "pointerdown",
    (event) => {

      isDragging =
        true;

      pointerId =
        event.pointerId;

      lastX =
        event.clientX;

      lastY =
        event.clientY;

      canvas.style.cursor =
        "grabbing";

      canvas.setPointerCapture?.(
        pointerId
      );

    }
  );

  canvas.addEventListener(
    "pointermove",
    (event) => {

      if (
        !isDragging ||
        (
          pointerId !== null &&
          event.pointerId !== pointerId
        )
      ) {
        return;
      }

      const deltaX =
        event.clientX -
        lastX;

      const deltaY =
        event.clientY -
        lastY;

      lastX =
        event.clientX;

      lastY =
        event.clientY;

      manualYaw +=
        deltaX * .007;

      manualPitch =
        THREE.MathUtils.clamp(
          manualPitch +
          deltaY * .0045,
          -.32,
          .28
        );

      if (
        Math.abs(deltaX) > .1
      ) {

        idleDirection =
          deltaX > 0
            ? 1
            : -1;

      }

    }
  );

  function endDrag(
    event
  ) {

    if (
      event &&
      pointerId !== null &&
      event.pointerId !== pointerId
    ) {
      return;
    }

    isDragging =
      false;

    pointerId =
      null;

    canvas.style.cursor =
      "grab";

  }

  canvas.addEventListener(
    "pointerup",
    endDrag
  );

  canvas.addEventListener(
    "pointercancel",
    endDrag
  );

  canvas.addEventListener(
    "lostpointercapture",
    endDrag
  );

  /* =======================================================
     EXPLODED VIEW
     ======================================================= */

  function easeInOutCubic(
    value
  ) {

    return value < .5
      ? 4 *
        value *
        value *
        value
      : 1 -
        Math.pow(
          -2 * value + 2,
          3
        ) / 2;

  }

  function explosionProgress(
    time
  ) {

    const duration =
      8.2;

    const t =
      time %
      duration;

    if (
      t < 1.35
    ) {
      return 0;
    }

    if (
      t < 3.35
    ) {

      return easeInOutCubic(
        (
          t -
          1.35
        ) /
        2
      );

    }

    if (
      t < 4.85
    ) {
      return 1;
    }

    if (
      t < 6.85
    ) {

      return 1 -
        easeInOutCubic(
          (
            t -
            4.85
          ) /
          2
        );

    }

    return 0;

  }

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  const clock =
    new THREE.Clock();

  let animationFrame =
    null;

  let lastTime =
    0;

  function render() {

    animationFrame =
      requestAnimationFrame(
        render
      );

    const time =
      clock.getElapsedTime();

    const delta =
      Math.min(
        time -
        lastTime,
        .05
      );

    lastTime =
      time;

    const explosion =
      reducedMotion.matches
        ? 0
        : explosionProgress(
            time
          );

    explodedParts.forEach(
      (part, index) => {

        const delayed =
          THREE.MathUtils.clamp(
            explosion -
            index * .018,
            0,
            1
          );

        part.object.position.lerpVectors(
          part.start,
          part.exploded,
          delayed
        );

      }
    );

    fanRotor.rotation.z -=
      reducedMotion.matches
        ? 0
        : .95 * delta;

    if (
      !isDragging &&
      !reducedMotion.matches
    ) {

      manualYaw +=
        .11 *
        delta *
        idleDirection;

    }

    machine.rotation.y =
      -.52 +
      manualYaw;

    machine.rotation.x =
      -.08 +
      manualPitch;

    machine.position.y =
      reducedMotion.matches
        ? 0
        : Math.sin(
            time * .65
          ) * .035;

    renderer.render(
      scene,
      camera
    );

  }

  /* =======================================================
     RESPONSIVE CAMERA
     ======================================================= */

  function resize() {

    const width =
      container.clientWidth;

    const height =
      container.clientHeight;

    if (
      !width ||
      !height
    ) {
      return;
    }

    const aspect =
      width /
      height;

    camera.aspect =
      aspect;

    const baseDistance =
      aspect < .9
        ? 10.4
        : aspect < 1.2
          ? 9.4
          : 8.8;

    camera.position.set(
      6.25,
      4.15,
      baseDistance
    );

    camera.lookAt(
      0,
      -.02,
      0
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
      resize
    );

  resizeObserver.observe(
    container
  );

  resize();
  render();

  window.addEventListener(
    "pagehide",
    () => {

      if (
        animationFrame
      ) {

        cancelAnimationFrame(
          animationFrame
        );

      }

      resizeObserver.disconnect();

      renderer.dispose();

    },
    {
      once: true
    }
  );

}
