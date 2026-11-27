import * as THREE from "three";
import { route, cameras } from "./route";

export type Engine = { dispose(): void; resize(): void };

/** Kage/MengTo patterns: persistent world, precomputed endpoints, shared instancing,
 * exponential damping, measured scroll, a visibility-aware budget and full teardown. */
export function createLattice(
  canvas: HTMLCanvasElement,
  onReady: () => void,
): Engine {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("#101211", 0.025);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const curve = new THREE.CatmullRomCurve3(
    cameras.map((p) => new THREE.Vector3(...p)),
    false,
    "catmullrom",
    0.4,
  );
  scene.add(new THREE.HemisphereLight(0xe7e7d2, 0x171e18, 2.8));
  const key = new THREE.DirectionalLight(0xffddb0, 4.5);
  key.position.set(3, 8, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc4d9c6, 2.2);
  rim.position.set(-7, 3, -4);
  scene.add(rim);
  const world = new THREE.Group();
  scene.add(world);
  const count = 343;
  const cube = new THREE.BoxGeometry(0.29, 0.29, 0.29);
  const material = new THREE.MeshStandardMaterial({
    color: "#b8a582",
    roughness: 0.48,
    metalness: 0.68,
  });
  const nodes = new THREE.InstancedMesh(cube, material, count);
  nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  world.add(nodes);
  const seed = (n: number) => {
    const v = Math.sin(n * 127.1 + 43.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const endpoints: THREE.Vector3[][] = [[], [], [], [], []];
  const originals: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const x = (i % 7) - 3,
      y = (Math.floor(i / 7) % 7) - 3,
      z = Math.floor(i / 49) - 3;
    const p = new THREE.Vector3(x * 0.8, y * 0.8, z * 0.8);
    originals.push(p);
    // The first chapter remains architectural: a meaningful structure, not random confetti.
    endpoints[0].push(
      p
        .clone()
        .add(
          new THREE.Vector3(
            (seed(i + 1) - 0.5) * 0.65,
            (seed(i + 400) - 0.5) * 0.65,
            (seed(i + 800) - 0.5) * 0.65,
          ),
        ),
    );
    endpoints[1].push(p.clone());
    endpoints[2].push(
      new THREE.Vector3(x * 0.95, y * 0.52, z * 0.68 + Math.sin(x * 0.8) * 0.5),
    );
    endpoints[3].push(p.clone().multiplyScalar(0.77));
    endpoints[4].push(p.clone().multiplyScalar(0.85));
  }
  const linePositions: number[] = [];
  for (let i = 0; i < count; i++) {
    for (const delta of [1, 7, 49]) {
      const j = i + delta;
      if (
        j >= count ||
        (delta === 1 && i % 7 === 6) ||
        (delta === 7 && Math.floor(i / 7) % 7 === 6)
      )
        continue;
      linePositions.push(...originals[i].toArray(), ...originals[j].toArray());
    }
  }
  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3),
  );
  const lineMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uChapter: { value: 0 } },
    vertexShader: `varying vec3 vPosition; varying float vDepth;
      void main(){vPosition=position; vec4 p=modelViewMatrix*vec4(position,1.);vDepth=-p.z;gl_Position=projectionMatrix*p;}`,
    fragmentShader: `uniform float uTime;uniform float uChapter;varying vec3 vPosition;varying float vDepth;
      void main(){float phase=fract((vPosition.x+vPosition.y*.4+vPosition.z*.3)*.16-uTime*.12);
        float pulse=smoothstep(.86,.98,phase)*(.25+.35*sin(uChapter));
        float fog=exp(-vDepth*.018);gl_FragColor=vec4(vec3(.69,.61,.43)+pulse*.2,(.18+pulse*.38)*fog);}`,
  });
  const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
  world.add(lines);
  const frameGeo = new THREE.EdgesGeometry(
    new THREE.BoxGeometry(6.2, 6.2, 6.2),
  );
  const frameMat = new THREE.LineBasicMaterial({
    color: "#87907c",
    transparent: true,
    opacity: 0.35,
  });
  const frame = new THREE.LineSegments(frameGeo, frameMat);
  world.add(frame);
  const coreGeo = new THREE.BoxGeometry(1.15, 1.15, 1.15);
  const coreMat = new THREE.MeshStandardMaterial({
    color: "#ded0ae",
    metalness: 0.7,
    roughness: 0.4,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  world.add(core);
  const dummy = new THREE.Object3D(),
    current = new THREE.Vector3(),
    position = new THREE.Vector3();
  const mouse = { x: 0, y: 0 },
    smoothMouse = { x: 0, y: 0 };
  let width = innerWidth,
    height = innerHeight,
    smooth = route.progress,
    raf = 0,
    disposed = false;
  let previous = 0,
    elapsed = 0,
    sum = 0,
    frames = 0,
    pixelRatio = Math.min(devicePixelRatio, 1.5),
    lowRounds = 0;
  const debug = {
    frames: 0,
    fps: 0,
    drawCalls: 0,
    triangles: 0,
    dpr: pixelRatio,
    context: "webgl",
    paused: false,
  };
  (window as unknown as { __DESICIA_SCENE__: typeof debug }).__DESICIA_SCENE__ =
    debug;
  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const pointer = (e: PointerEvent) => {
    mouse.x = e.clientX / innerWidth - 0.5;
    mouse.y = e.clientY / innerHeight - 0.5;
  };
  const reset = () => {
    mouse.x = mouse.y = 0;
  };
  const draw = (now: number) => {
    if (disposed) return;
    const rawDt = (now - (previous || now)) / 1000;
    const dt = Math.min(rawDt, 0.05);
    previous = now;
    const paused = route.paused || document.hidden;
    debug.paused = paused;
    if (!paused) elapsed += dt;
    smooth += (route.progress - smooth) * (1 - Math.exp(-5 * dt));
    smoothMouse.x += (mouse.x - smoothMouse.x) * (1 - Math.exp(-4 * dt));
    smoothMouse.y += (mouse.y - smoothMouse.y) * (1 - Math.exp(-4 * dt));
    curve.getPoint(Math.min(0.99999, Math.max(0, smooth / 4)), position);
    camera.position.copy(position);
    camera.position.x += paused ? 0 : smoothMouse.x * 0.5;
    camera.position.y += paused ? 0 : smoothMouse.y * 0.35;
    camera.lookAt(0, 0, 0);
    // Offset optical center to reserve the left editorial column.
    camera.setViewOffset(
      width,
      height,
      -width * 0.215,
      height * 0.015,
      width,
      height,
    );
    const index = Math.min(3, Math.floor(smooth)),
      t = THREE.MathUtils.smoothstep(smooth - index, 0, 1);
    for (let i = 0; i < count; i++) {
      current.lerpVectors(endpoints[index][i], endpoints[index + 1][i], t);
      dummy.position.copy(current);
      const s =
        (i % 11 === 0 ? 1.2 : 0.58) *
        (1 + (paused ? 0 : 0.05 * Math.sin(elapsed * 0.6 + i)));
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
    }
    nodes.instanceMatrix.needsUpdate = true;
    world.rotation.y = 0.16 + smooth * 0.13;
    world.rotation.z = -0.07;
    lineMaterial.uniforms.uTime.value = elapsed;
    lineMaterial.uniforms.uChapter.value = smooth;
    lines.scale.setScalar(1 - Math.sin(smooth * 0.8) * 0.13);
    frame.rotation.y = 0.08 * Math.sin(elapsed * 0.12);
    renderer.render(scene, camera);
    debug.frames++;
    debug.drawCalls = renderer.info.render.calls;
    debug.triangles = renderer.info.render.triangles;
    if (dt > 0 && !paused) {
      sum += rawDt;
      frames++;
    }
    if (sum > 3) {
      debug.fps = Math.round(frames / sum);
      debug.dpr = pixelRatio;
      if (debug.fps < 45 && pixelRatio > 0.75) {
        pixelRatio = 0.75;
        renderer.setPixelRatio(pixelRatio);
        nodes.count = 196;
        resize();
      }
      if (debug.fps < 24) lowRounds++;
      else lowRounds = 0;
      if (lowRounds >= 2) {
        debug.context = "static-fallback";
        canvas.dispatchEvent(new Event("desicia-low-performance"));
        return;
      }
      sum = 0;
      frames = 0;
    }
    if (!paused) raf = requestAnimationFrame(draw);
  };
  const resume = () => {
    cancelAnimationFrame(raf);
    previous = 0;
    if (!document.hidden) raf = requestAnimationFrame(draw);
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    canvas.style.opacity = "0";
    cancelAnimationFrame(raf);
  };
  addEventListener("resize", resize);
  addEventListener("pointermove", pointer, { passive: true });
  addEventListener("blur", reset);
  const onScroll = () => {
    if (route.paused) resume();
  };
  addEventListener("desicia-motion", resume);
  addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", resume);
  canvas.addEventListener("webglcontextlost", contextLost);
  resize();
  draw(performance.now());
  onReady();
  return {
    resize,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", pointer);
      removeEventListener("blur", reset);
      removeEventListener("desicia-motion", resume);
      removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", resume);
      canvas.removeEventListener("webglcontextlost", contextLost);
      [cube, linesGeometry, frameGeo, coreGeo].forEach((g) => g.dispose());
      [material, lineMaterial, frameMat, coreMat].forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
