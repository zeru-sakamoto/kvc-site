'use client';

import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setHeroProgress } from './hero-loader';

// The screen's RectAreaLight needs its LTC lookup tables registered once.
RectAreaLightUniformsLib.init();

// Swap this one file for a real capture and nothing here changes.
const SCREEN_SRC = '/hero-screenshot.webp';
// The Kamvas panel is exactly 16:9 (see the model's README).
const PANEL_ASPECT = 16 / 9;

const TABLET_SRC = '/models/kamvas-tablet.glb';
const STYLUS_SRC = '/models/kamvas-stylus.glb';

// The GLBs are in real metres (tablet 0.356m wide) and lie flat with the
// screen facing +Y and its top edge at -Z. Both share one scale so the pen is
// the right size for the tablet.
const MODEL_SCALE = 13.2;

// Model-space measurements, read off the GLB accessors.
const HALF_DEPTH = 0.0985; // chassis half-depth along Z
const GLASS_TOP = 0.0119; // highest point of the bezel/glass
const SCREEN = { x: 0.0132, y: 0.011, w: 0.2938, h: 0.1652 };
const NIB_TIP = 0.0815; // pen lies along X, nib at -X

// Kickstand angle: the back edge sits up, turning the screen toward the camera.
const PROP = THREE.MathUtils.degToRad(20);

// Orthographic camera, 35° pitch down and 20° yaw round to the tablet's left:
// corner-on enough to read as a 3D object, square-on enough that the screen
// reads. The pen (on the right) leans out toward the viewer.
const YAW = THREE.MathUtils.degToRad(-20);
const PITCH = THREE.MathUtils.degToRad(35);
const CAM_DIST = 30;
// Roughly the panel's centre once propped, nudged right to make room for the pen.
const TARGET = new THREE.Vector3(0.2, 0.45, -0.15);
// World units the anchor box (the scene column) must always show. The height
// term makes the tablet scale with the hero's height; the width term stops it
// spilling sideways on narrow-but-tall windows.
const VIEW_H = 5.2;
const VIEW_W = 6.5;

// Nib hover, in model metres above the glass, measured along the panel's own
// normal (the pen lives in the tilted tablet frame, so local +Y is that normal).
const HOVER = 0.016;
const MIN_GAP = 0.01;
// Where the nib hovers: over the right third of the screen.
const NIB_AT = { x: 0.1, z: 0.018 };

type Motion = {
  // Pointer, normalised to -1..1 across the viewport.
  pointer: RefObject<{ x: number; y: number }>;
  // 0 at the top of the hero, 1 once it has scrolled out.
  scroll: RefObject<number>;
};

type Palette = ReturnType<typeof readPalette>;

// Every colour comes from the @theme tokens globals.css hands the 2D layer.
// Unresolved tokens fall back to white (neutral light) rather than to a second
// copy of the hex values.
function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const color = (token: string) =>
    new THREE.Color(style.getPropertyValue(token).trim() || '#ffffff');
  return {
    blue: color('--color-brand-blue'),
    cool: color('--color-accent-cool'),
    warm: color('--color-accent-warm'),
    deep: color('--color-canvas-deep'),
    dark: color('--color-canvas-dark'),
    paper: color('--color-primary'),
  };
}

// Puts the whole capture on the 16:9 panel without cropping its title or
// status bar and without squashing text. The capture keeps its own aspect,
// centred, and the spare width either side is filled by stretching its outer
// 1px columns outward, so the app's edges simply run on to the bezel.
// A capture that's already 16:9 passes through untouched.
function fitToPanel(image: HTMLImageElement) {
  const h = image.height;
  const w = Math.round(h * PANEL_ASPECT);
  const imgW = image.width;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const pad = Math.floor((w - imgW) / 2);
  if (pad > 0) {
    ctx.drawImage(image, 0, 0, 1, h, 0, 0, pad, h);
    ctx.drawImage(image, imgW - 1, 0, 1, h, pad + imgW, 0, w - pad - imgW, h);
  }
  ctx.drawImage(image, pad, 0);
  return canvas;
}

// The screen's average colour, sampled once, then pushed to full brightness so
// it carries hue only; light intensity carries the brightness.
function averageTint(source: HTMLCanvasElement) {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 9;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(source, 0, 0, 16, 9);
  const px = ctx.getImageData(0, 0, 16, 9).data;
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < px.length; i += 4) {
    r += px[i];
    g += px[i + 1];
    b += px[i + 2];
  }
  const n = (px.length / 4) * 255;
  const tint = new THREE.Color().setRGB(
    r / n,
    g / n,
    b / n,
    THREE.SRGBColorSpace,
  );
  const max = Math.max(tint.r, tint.g, tint.b, 1e-3);
  return tint.multiplyScalar(1 / max);
}

// Tablet frame: the group pivots on the front edge, so rotating it by PROP
// lifts the back edge off the desk. A point in model metres, mapped to world.
const tabletPivot = new THREE.Vector3(0, 0, HALF_DEPTH * MODEL_SCALE);
function tabletToWorld(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z - HALF_DEPTH)
    .multiplyScalar(MODEL_SCALE)
    .applyAxisAngle(new THREE.Vector3(1, 0, 0), PROP)
    .add(tabletPivot);
}

// ---------------------------------------------------------------------------
// Camera: orthographic, with a few degrees of pointer orbit and a slow tilt
// toward top-down as the hero scrolls away. The canvas covers the whole hero,
// but zoom and framing come from the anchor box: the camera slides sideways
// in its own plane to place the tablet. At lg the tablet's outline is
// right-aligned to the anchor's right edge (the page gutter, mirroring the
// text's left margin) and bottom-aligned so it clears the hero's bottom by the
// same gap the headline keeps below the header; stacked, the outline is
// centred in the anchor.
type Frame = {
  dx: number;
  dy: number;
  rx: number;
  // The outline's bottom edge, in px below the canvas centre.
  by: number;
  w: number;
  h: number;
  alignRight: boolean;
};
const LG = '(min-width: 1024px)';

// Where an element's first line of capitals starts, in px from the top of its
// section. Offsets, not rects, so the headline's entrance transform doesn't
// skew it; then the line box's leading and the font's ascender space above the
// caps, which is where the eye reads the gap.
let metrics: CanvasRenderingContext2D | null = null;
function capTop(el: HTMLElement) {
  const section = el.closest('section');
  let top = 0;
  for (
    let n: HTMLElement | null = el;
    n && n !== section;
    n = n.offsetParent as HTMLElement | null
  ) {
    top += n.offsetTop;
  }
  const cs = getComputedStyle(el);
  metrics ??= document.createElement('canvas').getContext('2d');
  if (!metrics) return top;
  metrics.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = metrics.measureText('V');
  const content = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  const leading = (parseFloat(cs.lineHeight) - content) / 2;
  return top + leading + m.fontBoundingBoxAscent - m.actualBoundingBoxAscent;
}

// The tablet + pen outline along the camera's horizontal and vertical axes, in
// world units relative to TARGET. Measured once from the real vertices when
// the models land (Stage), read every frame by CameraRig.
const silhouette = { left: 0, right: 0, bottom: 0, ready: false };
const right = new THREE.Vector3();
const up = new THREE.Vector3();

function CameraRig({ motion, anchorId }: { motion: Motion; anchorId: string }) {
  const gl = useThree((state) => state.gl);
  const orbit = useRef({ yaw: YAW, pitch: PITCH });
  const frame = useRef<Frame | null>(null);

  useEffect(() => {
    const anchor = document.getElementById(anchorId);
    const canvas = gl.domElement;
    if (!anchor) return;
    // Layout only changes on resize, so measure then, not every frame.
    const measure = () => {
      const a = anchor.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      // The gap between the fixed header and the headline, mirrored at the
      // bottom of the canvas (which covers the hero).
      const header = document.querySelector('header');
      const h1 = anchor.closest('section')?.querySelector('h1');
      const gap = header && h1 ? capTop(h1) - header.offsetHeight : 0;
      frame.current = {
        dx: a.left + a.width / 2 - (c.left + c.width / 2),
        dy: a.top + a.height / 2 - (c.top + c.height / 2),
        rx: a.right - (c.left + c.width / 2),
        by: c.height / 2 - gap,
        w: a.width,
        h: a.height,
        alignRight: window.matchMedia(LG).matches,
      };
    };
    measure();
    // The cap metrics need the display face, which may land after mount.
    document.fonts.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(anchor);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [gl, anchorId]);

  useFrame(({ camera, size, clock }, delta) => {
    const cam = camera as THREE.OrthographicCamera;
    const f = frame.current ?? {
      dx: 0,
      dy: 0,
      rx: size.width / 2,
      by: size.height / 2,
      w: size.width,
      h: size.height,
      alignRight: false,
    };
    const zoom = Math.min(f.h / VIEW_H, f.w / VIEW_W);
    if (cam.zoom !== zoom) {
      cam.zoom = zoom;
      cam.updateProjectionMatrix();
    }
    const { x: px, y: py } = motion.pointer.current;
    const s = motion.scroll.current;
    const o = orbit.current;
    // An idle sway, like a handheld camera at rest: up to ~2° of yaw and ~1°
    // of pitch, on slow, unrelated periods so it never reads as a loop.
    const t = clock.elapsedTime;
    const swayYaw =
      Math.sin(t * 0.5) * 0.022 + Math.sin(t * 0.23 + 1.3) * 0.014;
    const swayPitch =
      Math.sin(t * 0.37 + 0.7) * 0.012 + Math.sin(t * 0.19 + 2.1) * 0.008;
    // ±2.5° yaw and ±1.5° pitch at most from the pointer; the scroll term
    // adds up to ~8°. The yaw term is inverted: the camera swings away from
    // the pointer, so the tablet turns its face toward it.
    o.yaw = THREE.MathUtils.damp(o.yaw, YAW - px * 0.044 + swayYaw, 3, delta);
    o.pitch = THREE.MathUtils.damp(
      o.pitch,
      PITCH - py * 0.026 + s * 0.14 + swayPitch,
      3,
      delta,
    );
    const flat = Math.cos(o.pitch) * CAM_DIST;
    camera.position.set(
      TARGET.x + Math.sin(o.yaw) * flat,
      TARGET.y + Math.sin(o.pitch) * CAM_DIST,
      TARGET.z + Math.cos(o.yaw) * flat,
    );
    camera.lookAt(TARGET);
    // Orthographic, so a sideways slide pans the view without changing the
    // angle. Screen y runs down, world up runs up, hence the signs.
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    // Where TARGET should land, in px from the canvas centre.
    let dx = f.dx;
    let dy = f.dy;
    if (silhouette.ready) {
      dx = f.alignRight
        ? f.rx - silhouette.right * zoom
        : f.dx - ((silhouette.left + silhouette.right) / 2) * zoom;
      if (f.alignRight) dy = f.by + silhouette.bottom * zoom;
    }
    camera.position
      .addScaledVector(right, -dx / zoom)
      .addScaledVector(up, dy / zoom);
  });

  return null;
}

// ---------------------------------------------------------------------------
// The desk: one big plane, lit by the screen like everything else
// (MeshStandardMaterial), with two things patched into its shader: an
// anti-aliased grid that glows near the tablet and dies with distance, and a
// radial alpha falloff so the plane never shows an edge.
function Desk({ palette }: { palette: Palette }) {
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: palette.dark,
      // Emissive floor = the page background, so an unlit patch of desk is
      // exactly the page colour and the canvas never reads as a darker box.
      // The screen's light adds on top.
      emissive: palette.dark,
      roughness: 0.82,
      metalness: 0,
      transparent: true,
      depthWrite: false,
      // The radial fade is long and shallow; without dithering it bands into
      // visible rings in 8-bit output.
      dithering: true,
    });
    const uniforms = {
      uCenter: { value: new THREE.Vector2(TARGET.x, TARGET.z) },
      uFade: { value: new THREE.Vector2(8, 18) },
      uGrid: { value: palette.blue.clone() },
      uCell: { value: 0.55 },
    };
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vDesk;')
        .replace(
          '#include <project_vertex>',
          '#include <project_vertex>\nvDesk = (modelMatrix * vec4(transformed, 1.0)).xyz;',
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vDesk;
uniform vec2 uCenter;
uniform vec2 uFade;
uniform vec3 uGrid;
uniform float uCell;`,
        )
        .replace(
          '#include <opaque_fragment>',
          `#include <opaque_fragment>
float r = length(vDesk.xz - uCenter);
vec2 g = vDesk.xz / uCell;
vec2 w = abs(fract(g - 0.5) - 0.5) / fwidth(g);
float line = 1.0 - min(min(w.x, w.y), 1.0);
gl_FragColor.rgb += uGrid * line * (0.025 + 0.06 * exp(-r * 0.4));
gl_FragColor.a *= 1.0 - smoothstep(uFade.x, uFade.y, r);`,
        );
    };
    return mat;
  }, [palette]);

  return (
    <mesh rotation-x={-Math.PI / 2} material={material} renderOrder={-1}>
      <planeGeometry args={[40, 40]} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Additive light pool on the desk, following the propped panel's throw: short
// behind and to the sides, long in front where the tilted screen faces.
const POOL_VERT = `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const POOL_FRAG = `
varying vec3 vWorld;
uniform vec3 uColor;
uniform vec2 uOrigin;
uniform float uStrength;
void main() {
  vec2 p = vWorld.xz - uOrigin;
  float reach = p.y > 0.0 ? 3.4 : 2.4;
  float d = (p.x * p.x) / 7.0 + (p.y * p.y) / (reach * reach);
  gl_FragColor = vec4(uColor, exp(-d * 1.4) * uStrength);
}`;

function LightPool({ tint }: { tint: THREE.Color }) {
  // Starts at the screen's lower edge, where the panel meets the desk.
  const origin = useMemo(() => {
    const p = tabletToWorld(SCREEN.x, SCREEN.y, SCREEN.h / 2);
    return new THREE.Vector2(p.x, p.z);
  }, []);
  const uniforms = useMemo(
    () => ({
      uColor: { value: tint },
      uOrigin: { value: origin },
      uStrength: { value: 0.3 },
    }),
    [tint, origin],
  );
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[origin.x, 0.004, origin.y]}
      renderOrder={1}
    >
      <planeGeometry args={[16, 16]} />
      <shaderMaterial
        vertexShader={POOL_VERT}
        fragmentShader={POOL_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Contact shadow: tight and dark along the front edge, which is on the desk,
// soft and faint under the raised back. That difference is what makes the
// prop read at this camera angle.
const SHADOW_FRAG = `
varying vec3 vWorld;
uniform vec3 uColor;
uniform vec2 uHalf;
uniform vec2 uCenter;
void main() {
  vec2 p = vWorld.xz - uCenter;
  float lift = clamp(0.5 - p.y / (2.0 * uHalf.y), 0.0, 1.0);
  float blur = mix(0.12, 1.3, lift);
  vec2 q = abs(p) - uHalf + blur * 0.5;
  float sdf = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  float a = 1.0 - smoothstep(-blur * 0.5, blur, sdf);
  gl_FragColor = vec4(uColor, a * mix(0.9, 0.65, lift));
}`;

function ContactShadow({ palette }: { palette: Palette }) {
  const { center, half } = useMemo(() => {
    const front = tabletToWorld(0, 0, HALF_DEPTH);
    const back = tabletToWorld(0, 0, -HALF_DEPTH);
    return {
      center: new THREE.Vector2(0, (front.z + back.z) / 2),
      half: new THREE.Vector2(0.18 * MODEL_SCALE, (front.z - back.z) / 2),
    };
  }, []);
  const uniforms = useMemo(
    () => ({
      uColor: { value: palette.deep },
      uHalf: { value: half },
      uCenter: { value: center },
    }),
    [palette, half, center],
  );
  return (
    <mesh rotation-x={-Math.PI / 2} position={[center.x, 0.002, center.y]}>
      <planeGeometry args={[half.x * 2 + 3, half.y * 2 + 3]} />
      <shaderMaterial
        vertexShader={POOL_VERT}
        fragmentShader={SHADOW_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// The hover cursor a pen display draws under a hovering nib: a thin cross
// with an open centre, light core on a dark halo so it reads over any UI.
const CURSOR_FRAG = `
varying vec2 vUv;
uniform vec3 uCore;
uniform vec3 uHalo;
void main() {
  vec2 p = abs(vUv - 0.5) * 2.0;
  float h = max(p.y, max(0.22 - p.x, p.x - 0.9));
  float v = max(p.x, max(0.22 - p.y, p.y - 0.9));
  float d = min(h, v);
  float aa = fwidth(d);
  float core = 1.0 - smoothstep(0.045 - aa, 0.045 + aa, d);
  float halo = 1.0 - smoothstep(0.12 - aa, 0.12 + aa, d);
  gl_FragColor = vec4(mix(uHalo, uCore, core), max(core, halo * 0.6));
}`;
const CURSOR_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
// ~9mm across on the glass.
const CURSOR_SIZE = 0.009 * MODEL_SCALE;

// ---------------------------------------------------------------------------
function Stage({
  palette,
  onReady,
}: {
  palette: Palette;
  onReady: () => void;
}) {
  const tabletGltf = useLoader(GLTFLoader, TABLET_SRC);
  const stylusGltf = useLoader(GLTFLoader, STYLUS_SRC);
  const shot = useLoader(THREE.TextureLoader, SCREEN_SRC);

  // useLoader hands back cache-shared objects, so the screenshot goes onto a
  // cloned scene with a cloned Screen material and a cloned texture.
  const { tablet, tint, bezel } = useMemo(() => {
    const scene = tabletGltf.scene.clone();
    const screen = scene.getObjectByName('Screen') as THREE.Mesh;
    const panel = fitToPanel(shot.image);
    const tex = new THREE.CanvasTexture(panel);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false; // glTF UV convention
    tex.anisotropy = 16;

    const mat = (screen.material as THREE.MeshStandardMaterial).clone();
    // Lit by emissive alone, so the scene's lights never tint the UI itself.
    mat.color.set(0x000000);
    mat.map = null;
    mat.emissiveMap = tex;
    mat.emissive.set(0xffffff);
    mat.emissiveIntensity = 1;
    screen.material = mat;

    const meshes: THREE.Mesh[] = [];
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
    });
    const byName = (name: string) =>
      meshes.find((m) => (m.material as THREE.Material).name === name);
    // Fully metallic with no environment to reflect renders pure black, and
    // the chassis sides are what show the propped wedge. Part-metal lets the
    // rim light and the screen spill land on them.
    const chassis = byName('MetalChassis');
    if (chassis) {
      const lit = (chassis.material as THREE.MeshStandardMaterial).clone();
      lit.metalness = 0.35;
      chassis.material = lit;
    }
    const bezel = byName('BezelPlastic')?.material as
      THREE.Material | undefined;
    return { tablet: scene, tint: averageTint(panel), bezel };
  }, [tabletGltf, shot]);

  // The pen body is near-black (albedo 0.02); lift it a touch so the screen's
  // spill actually registers on its underside instead of vanishing.
  const stylus = useMemo(() => {
    const scene = stylusGltf.scene.clone();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const m = (mesh.material as THREE.MeshStandardMaterial).clone();
      if (m.name === 'StylusBody') m.color.multiplyScalar(3.2);
      mesh.material = m;
    });
    return scene;
  }, [stylusGltf]);

  // Kickstand: a flat leg from the chassis underside, just in from the back
  // edge, down to the desk behind it.
  const leg = useMemo(() => {
    const hinge = tabletToWorld(0, 0, -HALF_DEPTH + 0.02);
    const foot = new THREE.Vector3(0, 0, hinge.z - hinge.y * 0.8);
    const dy = hinge.y;
    const dz = hinge.z - foot.z;
    return {
      position: new THREE.Vector3(0, dy / 2, (hinge.z + foot.z) / 2),
      angle: Math.atan2(dz, dy),
      length: Math.hypot(dy, dz),
    };
  }, []);

  const penRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);

  // Measure the outline once the models are in. The pen starts in its base
  // pose (set in JSX below), so the idle bob doesn't skew the measurement.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.updateWorldMatrix(true, true);
    const axis = new THREE.Vector3(Math.cos(YAW), 0, -Math.sin(YAW));
    // The rest-pose camera's up vector (world up, square to the view).
    const upAxis = new THREE.Vector3(
      -Math.sin(PITCH) * Math.sin(YAW),
      Math.cos(PITCH),
      -Math.sin(PITCH) * Math.cos(YAW),
    );
    const v = new THREE.Vector3();
    let lo = Infinity;
    let hi = -Infinity;
    let bottom = Infinity;
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || mesh.material instanceof THREE.ShaderMaterial) return;
      const pos = mesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 2) {
        v.fromBufferAttribute(pos, i)
          .applyMatrix4(mesh.matrixWorld)
          .sub(TARGET);
        const d = v.dot(axis);
        lo = Math.min(lo, d);
        hi = Math.max(hi, d);
        bottom = Math.min(bottom, v.dot(upAxis));
      }
    });
    silhouette.left = lo;
    silhouette.right = hi;
    silhouette.bottom = bottom;
    silhouette.ready = true;
  }, [tablet, stylus]);
  const cursorRef = useRef<THREE.Mesh>(null);
  const cursorUniforms = useMemo(
    () => ({ uCore: { value: palette.paper }, uHalo: { value: palette.deep } }),
    [palette],
  );

  // Fires only once Suspense has resolved every model and the texture, which
  // is the moment the scene is actually paintable. hero-scene.tsx uses it to
  // fade the canvas in and lift the page loader.
  useEffect(() => {
    onReady();
  }, [onReady]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pen = penRef.current;
    if (!pen) return;
    // All in model metres, in the tilted tablet frame: y is height above the
    // glass along the panel normal. The clamp is the no-contact guarantee.
    const gap = Math.max(MIN_GAP, HOVER + Math.sin(t * 0.8) * 0.004);
    const x = NIB_AT.x + Math.sin(t * 0.23) * 0.006;
    const z = NIB_AT.z + Math.sin(t * 0.31 + 1.3) * 0.004;
    pen.position.set(x, GLASS_TOP + gap, z).multiplyScalar(MODEL_SCALE);
    // Rotation pivots on the nib, so the wobble never changes the gap.
    pen.rotation.set(
      0,
      -0.55 + Math.sin(t * 0.27) * 0.06,
      1.12 + Math.sin(t * 0.37) * 0.03,
    );

    // The cursor tracks the nib straight down the panel normal, like the real
    // thing; the distance between the two is what shows the hover height.
    cursorRef.current?.position.set(
      x * MODEL_SCALE,
      (GLASS_TOP + 0.0003) * MODEL_SCALE,
      z * MODEL_SCALE,
    );
  });

  return (
    <>
      {/* The group pivots on the tablet's front edge, which stays on the desk,
          and PROP lifts the back. Everything screen-relative lives inside it,
          so the light, the cursor and the pen all tilt with the panel. */}
      <group ref={rootRef} position={tabletPivot} rotation-x={PROP}>
        <group position-z={-HALF_DEPTH * MODEL_SCALE}>
          <primitive object={tablet} scale={MODEL_SCALE} />

          {/* The key requirement: the screen is the light. Same size as the
              panel, sitting on it, emitting along its normal (a RectAreaLight
              shines down its local -Z; rotating +90° about X turns that to +Y). */}
          <rectAreaLight
            position={[
              SCREEN.x * MODEL_SCALE,
              (SCREEN.y + 0.0006) * MODEL_SCALE,
              0,
            ]}
            rotation-x={Math.PI / 2}
            width={SCREEN.w * MODEL_SCALE}
            height={SCREEN.h * MODEL_SCALE}
            color={tint}
            intensity={7}
          />

          <mesh ref={cursorRef} rotation-x={-Math.PI / 2} renderOrder={2}>
            <planeGeometry args={[CURSOR_SIZE, CURSOR_SIZE]} />
            <shaderMaterial
              vertexShader={CURSOR_VERT}
              fragmentShader={CURSOR_FRAG}
              uniforms={cursorUniforms}
              transparent
              depthWrite={false}
            />
          </mesh>

          {/* Nib-anchored: the tip sits at this group's origin. The pen lies
              along +X from there; Z then Y turns it up, right and toward the
              viewer, the way a right hand holds it over the glass. */}
          <group
            ref={penRef}
            position={[
              NIB_AT.x * MODEL_SCALE,
              (GLASS_TOP + HOVER) * MODEL_SCALE,
              NIB_AT.z * MODEL_SCALE,
            ]}
            rotation={[0, -0.55, 1.12]}
          >
            <primitive
              object={stylus}
              scale={MODEL_SCALE}
              position-x={NIB_TIP * MODEL_SCALE}
            />
          </group>
        </group>
      </group>

      {bezel ? (
        <mesh position={leg.position} rotation-x={leg.angle} material={bezel}>
          <boxGeometry
            args={[SCREEN.w * MODEL_SCALE * 0.9, leg.length, 0.06]}
          />
        </mesh>
      ) : null}

      <ContactShadow palette={palette} />
      <LightPool tint={tint} />
      <Dust palette={palette} tint={tint} />
    </>
  );
}

// ---------------------------------------------------------------------------
// ponytail: sparse on purpose; the scene should read as air, not snow.
const DUST_COUNT = 260;
// The canvas covers the whole hero but the tablet sits right of centre, so
// the atmosphere is centred to its left along the camera's right axis, wide
// enough to fill the frame out to the text side.
const FIELD_CENTER = TARGET.clone().addScaledVector(
  new THREE.Vector3(Math.cos(YAW), 0, -Math.sin(YAW)),
  -3.5,
);
const FIELD_HALF = 11;

// Hash-based scatter rather than Math.random(): pure, so the field is byte-for
// -byte identical on every render, and it stays inside the React Compiler's
// purity rules for values computed during render.
function scatter(i: number, seed: number) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Coloured motes through the whole hero's volume. Motes near the screen are
// brighter and lean toward its colour, as if it lights them.
function Dust({ palette, tint }: { palette: Palette; tint: THREE.Color }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const screen = tabletToWorld(SCREEN.x, SCREEN.y, 0).sub(FIELD_CENTER);
    const pos = new Float32Array(DUST_COUNT * 3);
    const col = new Float32Array(DUST_COUNT * 3);
    const hues = [palette.blue, palette.cool, palette.warm];
    const c = new THREE.Color();
    const p = new THREE.Vector3();
    for (let i = 0; i < DUST_COUNT; i++) {
      p.set(
        (scatter(i, 1) - 0.5) * 2 * FIELD_HALF,
        0.2 + scatter(i, 2) * 5.5 - FIELD_CENTER.y,
        (scatter(i, 3) - 0.5) * 2 * FIELD_HALF,
      );
      pos.set([p.x, p.y, p.z], i * 3);
      // Warm stays the rarest of the three, matching how the page uses it.
      const pick = scatter(i, 4);
      const near = Math.exp(-p.distanceToSquared(screen) / 5);
      c.copy(hues[pick < 0.18 ? 2 : pick < 0.66 ? 0 : 1])
        .lerp(tint, near * 0.6)
        .multiplyScalar(0.35 + near * 1.6);
      col.set([c.r, c.g, c.b], i * 3);
    }
    return [pos, col];
  }, [palette, tint]);

  useFrame(({ clock }) => {
    // A slow sway, not a spin: the field is off-centre, and a full rotation
    // would carry it away from the frame.
    if (ref.current)
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.15;
  });

  return (
    <points ref={ref} position={FIELD_CENTER}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      {/* Orthographic: no size attenuation, so size is in pixels. */}
      <pointsMaterial
        size={2.6}
        sizeAttenuation={false}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Huge, faint, slow puffs for the hazy mood, spread across the whole hero:
// three around the tablet, three out toward the text side (along -right).
const CLOUDS = [
  {
    hue: 'blue',
    at: [-1.6, 2.2, -1.8],
    scale: 5.5,
    opacity: 0.11,
    speed: 0.05,
  },
  {
    hue: 'cool',
    at: [2.2, 1.4, -1.6],
    scale: 4.5,
    opacity: 0.08,
    speed: 0.037,
  },
  { hue: 'warm', at: [0.6, 2.8, 1.8], scale: 4.5, opacity: 0.06, speed: 0.029 },
  { hue: 'blue', at: [-5.6, 2.4, -2], scale: 7, opacity: 0.08, speed: 0.033 },
  { hue: 'cool', at: [-8.5, 1.8, -1], scale: 6, opacity: 0.06, speed: 0.041 },
  { hue: 'warm', at: [-4, 3.2, 1.5], scale: 5.5, opacity: 0.045, speed: 0.026 },
] as const;

// Computed falloff rather than a gradient texture: an 8-bit canvas gradient,
// blown up this large and added on top, bands into visible rings.
const PUFF_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const PUFF_FRAG = `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  gl_FragColor = vec4(uColor, exp(-d * d * 4.0) * (1.0 - d) * uOpacity);
}`;

function Clouds({ palette }: { palette: Palette }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const uniforms = useMemo(
    () =>
      CLOUDS.map((c) => ({
        uColor: { value: palette[c.hue] },
        uOpacity: { value: c.opacity },
      })),
    [palette],
  );

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    CLOUDS.forEach((c, i) => {
      const m = refs.current[i];
      if (!m) return;
      // Billboard: always face the camera.
      m.quaternion.copy(camera.quaternion);
      m.position.set(
        c.at[0] + Math.sin(t * c.speed + i * 2) * 0.5,
        c.at[1] + Math.sin(t * c.speed * 0.7 + i) * 0.3,
        c.at[2] + Math.cos(t * c.speed + i * 2) * 0.5,
      );
    });
  });

  return (
    <>
      {CLOUDS.map((c, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          scale={c.scale}
          renderOrder={3}
        >
          <planeGeometry />
          <shaderMaterial
            vertexShader={PUFF_VERT}
            fragmentShader={PUFF_FRAG}
            uniforms={uniforms[i]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
}

function Scene({
  motion,
  anchorId,
  onReady,
}: {
  motion: Motion;
  anchorId: string;
  onReady: () => void;
}) {
  const palette = useMemo(() => readPalette(), []);

  return (
    <>
      {/* Fog is depth from the camera, so it pulls the far desk, grid and
          dust off into the page's own background, which is what keeps the
          canvas from reading as a darker box. */}
      <fog attach="fog" args={[palette.dark, CAM_DIST - 2, CAM_DIST + 14]} />

      {/* The screen is the key light. These only stop shadows going to pure
          black and keep the bezel's silhouette from merging with the page. */}
      <ambientLight color={palette.blue} intensity={0.22} />
      <directionalLight
        position={[-8, 4, -2]}
        color={palette.cool}
        intensity={0.7}
      />

      <CameraRig motion={motion} anchorId={anchorId} />
      <Desk palette={palette} />
      <Clouds palette={palette} />
      {/* Our own boundary, one for both models so onReady fires only once
          every one has resolved. Without it R3F's internal fallback suspends
          the <Canvas> itself; when it reappears, React StrictMode (dev)
          re-runs the Canvas's unmount effect, which force-loses the WebGL
          context 500ms later and remounts the canvas: a visible flicker right
          after load. */}
      <Suspense fallback={null}>
        <Stage palette={palette} onReady={onReady} />
      </Suspense>
    </>
  );
}

export default function HeroCanvas({
  anchorId,
  onReady,
  onContextLost,
}: {
  anchorId: string;
  onReady: () => void;
  onContextLost: () => void;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // useLoader's GLTFLoader and TextureLoader report to the default manager.
    // ponytail: counts files, not bytes, so the bar steps; the tablet GLB is
    // most of the weight. Byte progress needs a fetch-based loader.
    THREE.DefaultLoadingManager.onProgress = (_url, loaded, total) =>
      setHeroProgress(loaded, total);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    // Listens on the window, not the canvas: the canvas is pointer-events:none.
    window.addEventListener('pointermove', onMove, { passive: true });

    // Rides the same ScrollTrigger that smooth-scroll.tsx keeps in lockstep
    // with Lenis via gsap.ticker, so hero parallax and the brush stroke share
    // one scroll position.
    const st = ScrollTrigger.create({
      trigger: '#top',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        scroll.current = self.progress;
      },
    });

    return () => {
      THREE.DefaultLoadingManager.onProgress = () => {};
      window.removeEventListener('pointermove', onMove);
      st.kill();
    };
  }, []);

  return (
    <Canvas
      // flat = NoToneMapping. ACES would wash out a UI screenshot.
      flat
      orthographic
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [20, 17, 20], zoom: 100, near: 0.1, far: 100 }}
      // The idle bob never stops, so on-demand rendering would buy nothing.
      frameloop="always"
      // GPU resets, driver updates and long backgrounding all kill WebGL
      // contexts in the wild; a lost context can only be replaced by a fresh
      // canvas element, so hand the decision back up to hero-scene.tsx.
      onCreated={({ gl }) =>
        gl.domElement.addEventListener('webglcontextlost', onContextLost, {
          once: true,
        })
      }
      style={{ pointerEvents: 'none' }}
      aria-hidden
      tabIndex={-1}
    >
      <Scene
        motion={{ pointer, scroll }}
        anchorId={anchorId}
        onReady={onReady}
      />
    </Canvas>
  );
}
