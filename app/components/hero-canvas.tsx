'use client';

import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hero } from '@/lib/content';
import {
  HERO_ASSETS,
  HERO_WIDE,
  heroIntro,
  penTip,
  setHeroProgress,
} from './hero-loader';

// The screen's RectAreaLight needs its LTC lookup tables registered once.
RectAreaLightUniformsLib.init();

const {
  screen: SCREEN_SRC,
  tablet: TABLET_SRC,
  stylus: STYLUS_SRC,
  logo: LOGO_SRC,
} = HERO_ASSETS;
// The Kamvas panel is exactly 16:9 (see the model's README).
const PANEL_ASPECT = 16 / 9;

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
// World units the anchor box must show until the models land and the outline
// can be measured (a first-frame fallback only).
const VIEW_H = 5.2;
const VIEW_W = 6.5;

// Nib hover, in model metres above the glass, measured along the panel's own
// normal (the pen lives in the tilted tablet frame, so local +Y is that normal).
const HOVER = 0.016;
// The no-contact floor. Low enough for the follow dip (DIP_HOVER, below) and
// its reduced bob to clear it.
const MIN_GAP = 0.003;
// Where the nib hovers: over the right third of the screen.
const NIB_AT = { x: 0.1, z: 0.018 };

// Pen follow: while the mouse is over the glass the nib tracks it, dipped
// closer to the glass; off it, the pen glides home. Damp rates (1/s): ~0.15s
// to catch the cursor, ~0.7s to settle home.
const FOLLOW_RATE = 20;
const RETURN_RATE = 4.5;
const DIP_RATE = 5;
const DIP_HOVER = 0.005;
// Leaving takes the pointer this far past the glass edge (model metres): just
// enough to absorb the orbit's last bit of easing after it's held on entry.
const EDGE_SLACK = 0.002;
// Lean into travel: radians per m/s of nib speed, capped at ~8°.
const LEAN_GAIN = 0.35;
const LEAN_MAX = 0.14;

type Motion = {
  // Pointer, normalised to -1..1 across the viewport (x, y), its raw client
  // position (cx, cy), whether a hovering pointer is on the page at all, and
  // a count of primary clicks (Stage acts on each new one), and whether the
  // last one is still held down.
  pointer: RefObject<{
    x: number;
    y: number;
    cx: number;
    cy: number;
    on: boolean;
    presses: number;
    held: boolean;
  }>;
  // 0 at the top of the hero, 1 once it has scrolled out.
  scroll: RefObject<number>;
};

// Whether the pen is following the mouse. Written by Stage each frame, read
// by CameraRig to hold the pointer orbit still.
const follow = { on: false };

// Reduced motion keeps the scene but stills it: no sway, orbit, scroll tilt,
// bob, drift or pen follow, and the power button switches without a fade.
// This module only loads in the browser (ssr: false), and a MediaQueryList's
// `matches` is live, so flipping the OS setting takes effect on the next frame.
// ponytail: the loop still runs every frame while still; switch to
// frameloop="demand" plus invalidate() on pointer moves if battery matters.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Click to tap: the nib drops to the glass, stays on it while the button is
// held, and springs back on release; the display draws a ring where it
// touched (seconds, model metres).
const TAP_DOWN = 0.07;
const TAP_UP = 0.11;
const RIPPLE_TIME = 0.5;
const RIPPLE_R = 0.012;

// The easter egg: the power button (top-left of the bezel, at the back edge)
// switches the screen off and on. Bounds read off the GLB's PowerButton node:
// a 14.3 x 4.8mm pill. PAD makes the tiny target forgiving to click.
const BUTTON = {
  x: -0.163,
  z: -0.08775,
  top: 0.01072,
  hw: 0.007165,
  hd: 0.0024,
};
const BUTTON_PAD = 0.003;
// Fade time for the screen switching off or on (seconds).
const POWER_FADE = 0.3;
// Screen power: `on` is the switch, `level` its eased 0..1 brightness. Shared
// with LightPool, whose light is the screen's.
// `glow` is what the light actually gives off: `level`, dimmed further while
// the intro's logo is on screen (a near-black display lights next to nothing).
const power = { on: true, level: 1, glow: 1 };

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
    ledOn: color('--color-status-on'),
    ledOff: color('--color-status-off'),
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

// The intro's opening shot (see heroIntro in hero-loader.tsx): square-on to
// the propped screen, down its normal, with the screen's top edge up. The
// panel's world size, its centre on the glass, and its normal and up axes
// (local +Y and -Z, tilted by PROP about X).
const PANEL_W = SCREEN.w * MODEL_SCALE;
const PANEL_H = SCREEN.h * MODEL_SCALE;
const INTRO = {
  center: null as THREE.Vector3 | null,
  normal: new THREE.Vector3(0, Math.cos(PROP), Math.sin(PROP)),
  up: new THREE.Vector3(0, Math.sin(PROP), -Math.cos(PROP)),
  cam: new THREE.OrthographicCamera(),
};
// How far past the viewport's edges the screen reaches in the opening shot,
// so its bezel stays out of sight until the pull-back starts.
const INTRO_OVERFILL = 1.05;
// The opening shot's zoom, written by CameraRig, read by Stage to size the
// logo on the screen.
const introZoom = { value: 1 };

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
// in its own plane to place the tablet. The tablet + pen outline is fitted to
// the anchor (FILL). Side by side (HERO_WIDE) it's pinned to the anchor's
// top-left corner, which sits on the header's gutters; stacked it's centred.
type Frame = {
  // The anchor's centre, and its left and top edges, in px from the canvas
  // centre.
  dx: number;
  dy: number;
  lx: number;
  ty: number;
  w: number;
  h: number;
  pinned: boolean;
  // The intro: where the logo sits, in px from the canvas centre, and the
  // zoom that makes the screen overfill the viewport around it.
  ix: number;
  iy: number;
  iz: number;
};

// The zoom at which the panel covers the whole viewport around client point
// (x, y), with INTRO_OVERFILL to spare.
function introFill(x: number, y: number, vw: number, vh: number) {
  return (
    INTRO_OVERFILL *
    Math.max(
      (2 * Math.max(x, vw - x)) / PANEL_W,
      (2 * Math.max(y, vh - y)) / PANEL_H,
    )
  );
}

// The tablet + pen outline along the camera's horizontal and vertical axes, in
// world units relative to TARGET. Measured once from the real vertices when
// the models land (Stage), read every frame by CameraRig.
const silhouette = { left: 0, right: 0, top: 0, bottom: 0, ready: false };
// The share of the anchor box the outline fills, leaving room for the pointer
// orbit, the idle sway and the pen's bob to move it without clipping.
const FILL = 0.92;
const right = new THREE.Vector3();
const up = new THREE.Vector3();
const off = new THREE.Vector3();

function CameraRig({ motion, anchorId }: { motion: Motion; anchorId: string }) {
  const gl = useThree((state) => state.gl);
  const orbit = useRef({ yaw: YAW, pitch: PITCH });
  const aim = useRef({ x: 0, y: 0 });
  const frame = useRef<Frame | null>(null);

  useEffect(() => {
    const anchor = document.getElementById(anchorId);
    const canvas = gl.domElement;
    if (!anchor) return;
    // Layout only changes on resize, so measure then, not every frame.
    const measure = () => {
      const a = anchor.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      frame.current = {
        dx: a.left + a.width / 2 - (c.left + c.width / 2),
        dy: a.top + a.height / 2 - (c.top + c.height / 2),
        lx: a.left - (c.left + c.width / 2),
        ty: a.top - (c.top + c.height / 2),
        w: a.width,
        h: a.height,
        pinned: window.matchMedia(HERO_WIDE).matches,
        ix: heroIntro.x - (c.left + c.width / 2),
        iy: heroIntro.y - (c.top + c.height / 2),
        iz: introFill(
          heroIntro.x,
          heroIntro.y,
          window.innerWidth,
          window.innerHeight,
        ),
      };
    };
    measure();
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
      lx: -size.width / 2,
      ty: -size.height / 2,
      w: size.width,
      h: size.height,
      pinned: false,
      ix: 0,
      iy: 0,
      iz: introFill(size.width / 2, size.height / 2, size.width, size.height),
    };
    const zoom = silhouette.ready
      ? FILL *
        Math.min(
          f.h / (silhouette.top - silhouette.bottom),
          f.w / (silhouette.right - silhouette.left),
        )
      : Math.min(f.h / VIEW_H, f.w / VIEW_W);
    // While the pen follows the mouse, the pointer orbit holds where it was
    // on entry, so the tablet stays still while it's being "used". Held, not
    // faded to zero: easing it back would slide the glass under the cursor
    // (up to ~13mm near the right edge) and move the pen with it.
    const held = aim.current;
    if (!follow.on) {
      held.x = motion.pointer.current.x;
      held.y = motion.pointer.current.y;
    }
    // Reduced motion zeroes every term below, so the camera rests at YAW and
    // PITCH (where it starts) and never moves.
    const live = reducedMotion.matches ? 0 : 1;
    const px = held.x * live;
    const py = held.y * live;
    const s = motion.scroll.current * live;
    const o = orbit.current;
    // An idle sway, like a handheld camera at rest: up to ~2° of yaw and ~1°
    // of pitch, on slow, unrelated periods so it never reads as a loop.
    const t = clock.elapsedTime;
    const swayYaw =
      (Math.sin(t * 0.5) * 0.022 + Math.sin(t * 0.23 + 1.3) * 0.014) * live;
    const swayPitch =
      (Math.sin(t * 0.37 + 0.7) * 0.012 + Math.sin(t * 0.19 + 2.1) * 0.008) *
      live;
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
      dx = f.pinned
        ? f.lx - silhouette.left * zoom
        : f.dx - ((silhouette.left + silhouette.right) / 2) * zoom;
      dy = f.pinned
        ? f.ty + silhouette.top * zoom
        : f.dy + ((silhouette.top + silhouette.bottom) / 2) * zoom;
    }
    camera.position
      .addScaledVector(right, -dx / zoom)
      .addScaledVector(up, dy / zoom);

    // The intro blends from its opening shot into the rest pose above, which
    // is recomputed live every frame, so a resize mid-flight can't strand it.
    // Zoom blends in log space, so the pull-back reads as an even speed.
    let z = zoom;
    const k = heroIntro.cam;
    introZoom.value = f.iz;
    if (k < 1) {
      const c = INTRO.cam;
      INTRO.center ??= tabletToWorld(SCREEN.x, GLASS_TOP, 0);
      // Where the rest pose puts the screen's centre, in px from the canvas
      // centre (right and up still hold the rest pose's axes here).
      off.copy(INTRO.center).sub(camera.position);
      const restX = off.dot(right) * zoom;
      const restY = -off.dot(up) * zoom;
      // The opening shot's angle: square-on down the screen's normal.
      c.position.copy(INTRO.center).addScaledVector(INTRO.normal, CAM_DIST);
      c.up.copy(INTRO.up);
      c.lookAt(INTRO.center);
      z = Math.exp(THREE.MathUtils.lerp(Math.log(f.iz), Math.log(zoom), k));
      camera.quaternion.slerp(c.quaternion, 1 - k);
      // Blending camera positions in world space against a log zoom swings
      // the tablet far past its rest spot and back (screen offset = world x
      // zoom). Instead the screen's centre travels a straight line in px from
      // the logo to its rest spot, and the camera is placed around it.
      const px = THREE.MathUtils.lerp(f.ix, restX, k);
      const py = THREE.MathUtils.lerp(f.iy, restY, k);
      right.set(1, 0, 0).applyQuaternion(camera.quaternion);
      up.set(0, 1, 0).applyQuaternion(camera.quaternion);
      off.set(0, 0, 1).applyQuaternion(camera.quaternion);
      camera.position
        .copy(INTRO.center)
        .addScaledVector(off, CAM_DIST)
        .addScaledVector(right, -px / z)
        .addScaledVector(up, py / z);
    }
    if (cam.zoom !== z) {
      cam.zoom = z;
      cam.updateProjectionMatrix();
    }
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
  // The pool is the screen's light, so it goes out with the screen.
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame(() => {
    if (matRef.current)
      matRef.current.uniforms.uStrength.value = 0.3 * power.glow;
  });
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[origin.x, 0.004, origin.y]}
      renderOrder={1}
    >
      <planeGeometry args={[16, 16]} />
      <shaderMaterial
        ref={matRef}
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
uniform float uAlpha;
void main() {
  vec2 p = abs(vUv - 0.5) * 2.0;
  float h = max(p.y, max(0.22 - p.x, p.x - 0.9));
  float v = max(p.x, max(0.22 - p.y, p.y - 0.9));
  float d = min(h, v);
  float aa = fwidth(d);
  float core = 1.0 - smoothstep(0.045 - aa, 0.045 + aa, d);
  float halo = 1.0 - smoothstep(0.12 - aa, 0.12 + aa, d);
  gl_FragColor = vec4(mix(uHalo, uCore, core), max(core, halo * 0.6) * uAlpha);
}`;

// The tap ripple, drawn by the display: a thin ring growing out of the
// contact point and fading as it goes. Clipped to the panel, since the
// display can't draw on its bezel. uCenter is in model metres, the quad spans
// 2 * RIPPLE_R around it (the quad lies flat, so its v runs along -z).
const RIPPLE_FRAG = `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uProgress;
uniform vec2 uCenter;
uniform vec4 uPanel;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  vec2 m = uCenter + vec2(q.x, -q.y) * ${RIPPLE_R.toFixed(4)};
  if (abs(m.x - uPanel.x) > uPanel.z || abs(m.y - uPanel.y) > uPanel.w) discard;
  float r = length(q);
  float ease = 1.0 - pow(1.0 - uProgress, 3.0);
  float d = abs(r - ease);
  float aa = fwidth(r);
  float ring = 1.0 - smoothstep(0.035 - aa, 0.035 + aa, d);
  gl_FragColor = vec4(uColor, ring * (1.0 - uProgress) * 0.85);
}`;

// The power LED: a thin glowing line tracing the pill's outline (a stadium,
// SDF in mm), with a soft falloff either side. Additive, lights nothing.
const LED_MARGIN = 0.003;
const LED_FRAG = `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uGlow;
void main() {
  vec2 ext = vec2(${((BUTTON.hw + LED_MARGIN) * 1000).toFixed(3)}, ${((BUTTON.hd + LED_MARGIN) * 1000).toFixed(3)});
  vec2 p = (vUv - 0.5) * 2.0 * ext;
  float rad = ${(BUTTON.hd * 1000).toFixed(3)};
  vec2 a = vec2(${(BUTTON.hw * 1000).toFixed(3)}, rad) - rad;
  float d = length(max(abs(p) - a, 0.0)) - rad;
  float aa = fwidth(d);
  float line = 1.0 - smoothstep(0.22 - aa, 0.22 + aa, abs(d));
  float glow = exp(-abs(d) / 0.7) * 0.45;
  gl_FragColor = vec4(uColor * uGlow, max(line, glow) * uGlow);
}`;
const CURSOR_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
// ~9mm across on the glass.
const CURSOR_SIZE = 0.009 * MODEL_SCALE;

// The intro's logo screen: the loader's own background (--color-canvas-deep)
// edge to edge with the logo in the middle, over the real screen until the
// "launch". colorspace_fragment is what makes the fill land on exactly the
// loader's hex (the canvas is flat, no tone mapping), so the handoff is a
// cut nobody sees. uBox is the logo's size as a share of the panel.
const LOGO_FRAG = `
varying vec2 vUv;
uniform vec3 uDeep;
uniform sampler2D uLogo;
uniform vec2 uBox;
uniform float uOpacity;
void main() {
  vec2 p = (vUv - 0.5) / uBox + 0.5;
  vec2 inside = step(0.0, p) * step(p, vec2(1.0));
  vec4 logo = texture2D(uLogo, clamp(p, 0.0, 1.0)) * inside.x * inside.y;
  gl_FragColor = vec4(mix(uDeep, logo.rgb, logo.a), uOpacity);
  #include <colorspace_fragment>
}`;

// The launch: the screenshot settles from this zoom to 1 as it comes up, and
// the logo shrinks by the same share as it goes, like an app opening.
const LAUNCH_ZOOM = 1.04;
const LOGO_EXIT = 0.85;
// The pen's way in: it comes out of the logo. The logo (public/logo.svg) has
// a grey pen through its middle; the 3D pen starts lying flat on the glass
// exactly over it, at its size and angle, shows through as the logo screen
// fades in the launch, then lifts, grows to full size and turns into its
// hover pose. These are that grey pen's nib tip and tail in the SVG's viewBox
// units (y down), read off its path. Re-measure if the logo changes.
const LOGO_VIEW = { w: 258.47, h: 276.05 };
const LOGO_PEN = { nib: [131.9, 199.8], tail: [84.6, 3.3] };
const LOGO_PEN_LEN = Math.hypot(
  LOGO_PEN.tail[0] - LOGO_PEN.nib[0],
  LOGO_PEN.tail[1] - LOGO_PEN.nib[1],
);
const PEN_RADIUS = 0.00729; // model metres, from the GLB's bounds
// Flat on the glass: the pen's +X (nib to tail) along the logo pen, in the
// tablet frame, where SVG x is +X and SVG y is +Z (down the screen).
const PEN_FLAT = (() => {
  const x = new THREE.Vector3(
    LOGO_PEN.tail[0] - LOGO_PEN.nib[0],
    0,
    LOGO_PEN.tail[1] - LOGO_PEN.nib[1],
  ).normalize();
  const y = new THREE.Vector3(0, 1, 0);
  return new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(x, y, new THREE.Vector3().crossVectors(x, y)),
  );
})();
// How high the nib arcs off the glass mid-flight, in model metres.
const PEN_ARC = 0.03;
const penHome = new THREE.Vector3();
const penTurn = new THREE.Quaternion();

// Scratch for the per-frame hit test: the mouse ray, taken into the tablet
// frame and met with the glass as a plain plane (y = screen surface), which is
// all the "is it over the screen" question needs. No mesh raycast.
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const localRay = new THREE.Ray();
const toTablet = new THREE.Matrix4();
const glassPlane = new THREE.Plane(
  new THREE.Vector3(0, 1, 0),
  -SCREEN.y * MODEL_SCALE,
);
const hit = new THREE.Vector3();
const tipAt = new THREE.Vector3();
const penBase = new THREE.Quaternion();
const penLean = new THREE.Quaternion();
const euler = new THREE.Euler();

// Whether some installed font has a glyph for every character of `text`, in
// ctx's current font. A missing glyph draws as the "tofu" box, the same one a
// noncharacter (U+FFFF) gets, so each character is drawn and compared with
// that, pixel for pixel.
// ponytail: a platform that draws nothing at all for missing glyphs would
// still differ from its own tofu only by chance; none of the big engines do.
function canDraw(ctx: CanvasRenderingContext2D, text: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 48;
  const probe = c.getContext('2d', { willReadFrequently: true });
  if (!probe) return false;
  probe.font = ctx.font.replace(/\d+px/, '32px');
  probe.textBaseline = 'top';
  const draw = (ch: string) => {
    probe.clearRect(0, 0, 48, 48);
    probe.fillText(ch, 4, 4);
    return probe.getImageData(0, 0, 48, 48).data.join();
  };
  const tofu = draw('￿');
  return [...text].every((ch) => draw(ch) !== tofu);
}

// The GLBs are meshopt-compressed and quantized (gltf-transform meshopt). To
// swap in a new model, run it through the same step:
//   npx @gltf-transform/cli meshopt in.glb public/models/out.glb
const withMeshopt = (loader: GLTFLoader) =>
  loader.setMeshoptDecoder(MeshoptDecoder);

// ---------------------------------------------------------------------------
function Stage({
  palette,
  motion,
  onReady,
}: {
  palette: Palette;
  motion: Motion;
  onReady: () => void;
}) {
  const tabletGltf = useLoader(GLTFLoader, TABLET_SRC, withMeshopt);
  const stylusGltf = useLoader(GLTFLoader, STYLUS_SRC, withMeshopt);
  const shot = useLoader(THREE.TextureLoader, SCREEN_SRC);
  const logo = useLoader(THREE.TextureLoader, LOGO_SRC);

  // useLoader hands back cache-shared objects, so the screenshot goes onto a
  // cloned scene with a cloned Screen material and a cloned texture.
  const { tablet, tint, bezel, screenMat, shotTex } = useMemo(() => {
    const scene = tabletGltf.scene.clone();
    const screen = scene.getObjectByName('Screen') as THREE.Mesh;
    const panel = fitToPanel(shot.image);
    const tex = new THREE.CanvasTexture(panel);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false; // glTF UV convention
    tex.anisotropy = 16;
    // The launch zooms it about the panel centre.
    tex.center.set(0.5, 0.5);

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
    return {
      tablet: scene,
      tint: averageTint(panel),
      bezel,
      screenMat: mat,
      shotTex: tex,
    };
  }, [tabletGltf, shot]);

  // The logo screen's material. The loader draws the logo into a square box,
  // fitted (an <img> of a taller-than-wide SVG), and so does this.
  const logoRef = useRef<THREE.Mesh>(null);
  const logoMatRef = useRef<THREE.ShaderMaterial>(null);
  const { logoUniforms, logoAspect } = useMemo(() => {
    // Redrawn from the vector at 512px tall: the browser rasterises a
    // viewBox-only SVG at ~150px, soft at the logo's 96px on a dense screen.
    const img = logo.image as HTMLImageElement;
    const c = document.createElement('canvas');
    c.height = 512;
    c.width = Math.round((512 * img.width) / img.height) || 512;
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return {
      logoUniforms: {
        uDeep: { value: palette.deep },
        uLogo: { value: tex },
        uBox: { value: new THREE.Vector2() },
        uOpacity: { value: 1 },
      },
      logoAspect: c.width / c.height,
    };
  }, [logo, palette]);

  // The switched-off screen's message (easter egg), drawn once into a
  // panel-shaped texture in the page's own font and text colour.
  const offMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const offTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = Math.round((1024 * SCREEN.h) / SCREEN.w);
    const ctx = c.getContext('2d')!;
    const family = getComputedStyle(document.body).fontFamily;
    ctx.fillStyle = `#${palette.paper.getHexString()}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `500 56px ${family}`;
    ctx.fillText(hero.screenOff.line, c.width / 2, c.height / 2 - 48);
    ctx.font = `500 72px ${family}`;
    const { face, faceFallback } = hero.screenOff;
    ctx.fillText(
      canDraw(ctx, face) ? face : faceFallback,
      c.width / 2,
      c.height / 2 + 48,
    );
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, [palette]);

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
    // Measured in the pen's base pose, wherever the frame loop has put it
    // (small and flat on the logo, if the intro is playing).
    penRef.current?.position
      .set(NIB_AT.x, GLASS_TOP + HOVER, NIB_AT.z)
      .multiplyScalar(MODEL_SCALE);
    penRef.current?.scale.setScalar(1);
    penRef.current?.rotation.set(0, -0.55, 1.12);
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
    let top = -Infinity;
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
        const h = v.dot(upAxis);
        bottom = Math.min(bottom, h);
        top = Math.max(top, h);
      }
    });
    silhouette.left = lo;
    silhouette.right = hi;
    silhouette.top = top;
    silhouette.bottom = bottom;
    silhouette.ready = true;
  }, [tablet, stylus]);
  const cursorRef = useRef<THREE.Mesh>(null);
  const cursorMatRef = useRef<THREE.ShaderMaterial>(null);
  const cursorUniforms = useMemo(
    () => ({
      uCore: { value: palette.paper },
      uHalo: { value: palette.deep },
      uAlpha: { value: 1 },
    }),
    [palette],
  );

  // Tap ripple and power LED. Their uniforms are written each frame through
  // the material refs.
  const rippleRef = useRef<THREE.Mesh>(null);
  const rippleMatRef = useRef<THREE.ShaderMaterial>(null);
  const rippleUniforms = useMemo(
    () => ({
      uColor: { value: palette.paper },
      uProgress: { value: 0 },
      uCenter: { value: new THREE.Vector2() },
      uPanel: {
        value: new THREE.Vector4(SCREEN.x, 0, SCREEN.w / 2, SCREEN.h / 2),
      },
    }),
    [palette],
  );
  const ledMatRef = useRef<THREE.ShaderMaterial>(null);
  const ledUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color() }, uGlow: { value: 1 } }),
    [],
  );
  const lightRef = useRef<THREE.RectAreaLight>(null);
  // The frame loop dims the screen through a ref, not the memo value itself.
  const screenMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  useEffect(() => {
    screenMatRef.current = screenMat;
  }, [screenMat]);

  // A tap in flight: when it started (clock seconds, -1 = none), when the
  // button came up (-1 = still held), and when and where its ripple started
  // once the nib touched down.
  const tap = useRef({ t0: -1, up0: -1, ripple0: -1, x: 0, z: 0 });
  const seenPresses = useRef(0);
  const overButton = useRef(false);

  // The hover hand over the power button is set on <body>; don't leave it
  // behind if the canvas goes away while the pointer is there. The brush
  // stroke goes back to its own start, too.
  useEffect(
    () => () => {
      document.body.style.cursor = '';
      penTip.move?.();
    },
    [],
  );

  // Fires only once Suspense has resolved every model and the texture, which
  // is the moment the scene is actually paintable. hero-scene.tsx uses it to
  // fade the canvas in and lift the page loader.
  useEffect(() => {
    onReady();
  }, [onReady]);

  // The tablet frame (tilted, origin at the panel centre), and the nib's eased
  // state in it: position, dip (0 hover..1 dipped) and lean, in model metres.
  const tabletRef = useRef<THREE.Group>(null);
  const nib = useRef({
    x: NIB_AT.x,
    z: NIB_AT.z,
    dip: 0,
    leanX: 0,
    leanZ: 0,
    on: false,
  });

  useFrame(({ clock, camera, gl }, delta) => {
    const t = clock.elapsedTime;
    // The idle bob, drift, wobble and LED pulse run on `at`, which reduced
    // motion holds at 0; taps and fades keep real time.
    const still = reducedMotion.matches;
    const at = still ? 0 : t;
    const pen = penRef.current;
    const frame = tabletRef.current;
    if (!pen || !frame) return;
    const n = nib.current;
    const p = motion.pointer.current;

    // Is the mouse over the glass? Recomputed every frame from the last
    // client position, so scrolling the screen out from under a still mouse
    // sends the pen home too. Whatever DOM sits on top doesn't matter.
    let tx = NIB_AT.x;
    let tz = NIB_AT.z;
    let on = false;
    let onButton = false;
    if (p.on) {
      const r = gl.domElement.getBoundingClientRect();
      ndc.set(
        ((p.cx - r.left) / r.width) * 2 - 1,
        -((p.cy - r.top) / r.height) * 2 + 1,
      );
      // CameraRig pans the camera after lookAt(), which is the last thing to
      // refresh its matrix, so bring it up to date before casting from it.
      camera.updateMatrixWorld();
      raycaster.setFromCamera(ndc, camera);
      localRay
        .copy(raycaster.ray)
        .applyMatrix4(toTablet.copy(frame.matrixWorld).invert());
      if (localRay.intersectPlane(glassPlane, hit)) {
        const hx = hit.x / MODEL_SCALE - SCREEN.x;
        const hz = hit.z / MODEL_SCALE;
        const slack = n.on ? EDGE_SLACK : 0;
        const halfW = SCREEN.w / 2;
        const halfH = SCREEN.h / 2;
        on = Math.abs(hx) < halfW + slack && Math.abs(hz) < halfH + slack;
        if (on) {
          // Inside the slack band the nib holds at the glass edge.
          tx = SCREEN.x + THREE.MathUtils.clamp(hx, -halfW, halfW);
          tz = THREE.MathUtils.clamp(hz, -halfH, halfH);
        }
        // The power button sits 0.3mm below the glass plane; at this angle
        // that's far inside BUTTON_PAD, so the same hit serves.
        onButton =
          Math.abs(hit.x / MODEL_SCALE - BUTTON.x) < BUTTON.hw + BUTTON_PAD &&
          Math.abs(hz - BUTTON.z) < BUTTON.hd + BUTTON_PAD;
      }
    }
    // Reduced motion: the pen stays home and the glass takes no taps. The
    // power button still works; it's a switch, not a movement.
    // Nor does anything during the intro.
    if (still || !heroIntro.done) on = false;
    if (!heroIntro.done) onButton = false;
    n.on = on;

    // A hand over the power button is the only hint it does anything.
    if (onButton !== overButton.current) {
      overButton.current = onButton;
      document.body.style.cursor = onButton ? 'pointer' : '';
    }

    // Each new click: the power button toggles the screen, a click on the
    // glass taps it. (HeroCanvas already dropped clicks on links and buttons.)
    if (p.presses !== seenPresses.current) {
      seenPresses.current = p.presses;
      if (onButton) power.on = !power.on;
      else if (on)
        tap.current = { t0: t, up0: -1, ripple0: -1, x: n.x, z: n.z };
    }
    // Contact lasts while the button is held and the pen is over the glass;
    // letting go, or sliding off the screen, lifts it.
    const live = tap.current;
    if (live.t0 >= 0 && live.up0 < 0 && (!p.held || !on)) live.up0 = t;

    // Power fades linearly over POWER_FADE, eased for the eye; reduced motion
    // switches it outright.
    power.level = still
      ? Number(power.on)
      : THREE.MathUtils.clamp(
          power.level + (power.on ? 1 : -1) * (delta / POWER_FADE),
          0,
          1,
        );
    const lit = THREE.MathUtils.smoothstep(power.level, 0, 1);
    // The intro's launch: the logo screen fades and shrinks away over the
    // screenshot, which settles from LAUNCH_ZOOM, and the screen's light comes
    // up with it.
    const launch = heroIntro.launch;
    power.glow = lit * THREE.MathUtils.lerp(0.12, 1, launch);
    shotTex.repeat.setScalar(1 / THREE.MathUtils.lerp(LAUNCH_ZOOM, 1, launch));
    if (logoRef.current) logoRef.current.visible = launch < 1;
    const logoMat = logoMatRef.current;
    if (logoMat && launch < 1) {
      // The logo's height on screen, in px, over the opening shot's zoom.
      const box = heroIntro.size / introZoom.value;
      const h = box * Math.min(1, 1 / logoAspect);
      const shrink = THREE.MathUtils.lerp(1, LOGO_EXIT, launch);
      logoMat.uniforms.uBox.value.set(
        ((h * logoAspect) / PANEL_W) * shrink,
        (h / PANEL_H) * shrink,
      );
      logoMat.uniforms.uOpacity.value = 1 - launch;
    }
    if (screenMatRef.current) screenMatRef.current.emissiveIntensity = lit;
    // The off-screen message comes up as the picture goes.
    if (offMatRef.current) {
      offMatRef.current.opacity = 1 - lit;
      offMatRef.current.visible = lit < 1;
    }
    if (lightRef.current) lightRef.current.intensity = 7 * power.glow;
    // The display draws the hover cursor, so it goes dark with it, and it
    // only appears as the flying pen arrives over the glass.
    if (cursorMatRef.current)
      cursorMatRef.current.uniforms.uAlpha.value = lit * heroIntro.pen ** 4;
    // LED: green while on, with a soft brightening every ~6s as a hint; a
    // steady, dimmer red when off. Cross-fades with the screen.
    const led = ledMatRef.current;
    if (led) {
      const beat = (at % 6) - 0.6;
      const pulse = Math.exp(-(beat * beat) / 0.08);
      led.uniforms.uColor.value.lerpColors(palette.ledOff, palette.ledOn, lit);
      led.uniforms.uGlow.value = THREE.MathUtils.lerp(
        0.55,
        0.8 + pulse * 0.5,
        lit,
      );
    }

    const rate = on ? FOLLOW_RATE : RETURN_RATE;
    const x0 = n.x;
    const z0 = n.z;
    n.x = THREE.MathUtils.damp(n.x, tx, rate, delta);
    n.z = THREE.MathUtils.damp(n.z, tz, rate, delta);
    n.dip = THREE.MathUtils.damp(n.dip, on ? 1 : 0, DIP_RATE, delta);
    follow.on = on;

    // Lean: the top of the pen tips toward where the nib is heading, like a
    // hand dragging it, and eases upright as it stops.
    const vx = delta > 0 ? (n.x - x0) / delta : 0;
    const vz = delta > 0 ? (n.z - z0) / delta : 0;
    const clampLean = (v: number) =>
      THREE.MathUtils.clamp(v * LEAN_GAIN, -LEAN_MAX, LEAN_MAX);
    n.leanX = THREE.MathUtils.damp(n.leanX, clampLean(vz), 6, delta);
    n.leanZ = THREE.MathUtils.damp(n.leanZ, -clampLean(vx), 6, delta);

    // All in model metres, in the tilted tablet frame: y is height above the
    // glass along the panel normal. The clamp is the no-contact guarantee.
    // The idle bob and drift carry on over the follow, gentler when dipped.
    const calm = 1 - n.dip * 0.6;
    const hover = Math.max(
      MIN_GAP,
      THREE.MathUtils.lerp(HOVER, DIP_HOVER, n.dip) +
        Math.sin(at * 0.8) * 0.004 * calm,
    );
    // A tap is the one time the nib meets the glass: accelerate down, stay
    // down while held, spring back up. The lift never starts before the
    // touchdown finishes, so a quick click is still a full tap. `touch` 1 =
    // on the glass.
    const tp = tap.current;
    const age = tp.t0 < 0 ? -1 : t - tp.t0;
    let touch = 0;
    if (age >= 0 && age < TAP_DOWN) touch = (age / TAP_DOWN) ** 2;
    else if (age >= TAP_DOWN && tp.up0 < 0) touch = 1;
    else if (age >= TAP_DOWN) {
      const lift = (t - Math.max(tp.up0, tp.t0 + TAP_DOWN)) / TAP_UP;
      if (lift < 1) touch = (1 - lift) ** 3;
      else tp.t0 = -1;
    }
    const gap = hover * (1 - touch);
    // Clamped after the drift, so the drift can't carry the nib (and the
    // crosshair under it) off the glass onto the bezel.
    const x = THREE.MathUtils.clamp(
      n.x + Math.sin(at * 0.23) * 0.006 * calm,
      SCREEN.x - SCREEN.w / 2,
      SCREEN.x + SCREEN.w / 2,
    );
    const z = THREE.MathUtils.clamp(
      n.z + Math.sin(at * 0.31 + 1.3) * 0.004 * calm,
      -SCREEN.h / 2,
      SCREEN.h / 2,
    );
    pen.position.set(x, GLASS_TOP + gap, z).multiplyScalar(MODEL_SCALE);
    // Rotation pivots on the nib, so neither the wobble nor the lean changes
    // the gap. The lean goes on in the tablet's axes, over the base pose.
    penBase.setFromEuler(
      euler.set(
        0,
        -0.55 + Math.sin(at * 0.27) * 0.06,
        1.12 + Math.sin(at * 0.37) * 0.03,
      ),
    );
    penLean.setFromEuler(euler.set(n.leanX, 0, n.leanZ));
    pen.quaternion.multiplyQuaternions(penLean, penBase);

    // The intro's pen: lifts, grows and turns
    // out of the logo's grey pen to the hover pose it would have now (see
    // LOGO_PEN).
    const fly = heroIntro.pen;
    pen.visible = fly > 0;
    pen.scale.setScalar(1);
    if (fly < 1) {
      penHome.copy(pen.position);
      // One SVG unit on the glass, in world units: the logo's drawn height
      // (as the logo screen sizes it, shrink included) over its viewBox.
      const unit =
        ((heroIntro.size / introZoom.value) *
          Math.min(1, 1 / logoAspect) *
          THREE.MathUtils.lerp(1, LOGO_EXIT, launch)) /
        LOGO_VIEW.h;
      const small = (LOGO_PEN_LEN * unit) / (2 * NIB_TIP * MODEL_SCALE);
      // Slow off the mark, so it sits on the logo while that fades.
      const k = THREE.MathUtils.smootherstep(fly, 0, 1);
      const size = THREE.MathUtils.lerp(small, 1, k);
      pen.position
        .set(
          SCREEN.x * MODEL_SCALE + (LOGO_PEN.nib[0] - LOGO_VIEW.w / 2) * unit,
          // Resting on the glass: its axis one (scaled) radius above it.
          (GLASS_TOP + PEN_RADIUS * small) * MODEL_SCALE,
          (LOGO_PEN.nib[1] - LOGO_VIEW.h / 2) * unit,
        )
        .lerp(penHome, k);
      pen.position.y += Math.sin(k * Math.PI) * PEN_ARC * MODEL_SCALE;
      penTurn.copy(PEN_FLAT).slerp(pen.quaternion, k);
      pen.quaternion.copy(penTurn);
      pen.scale.setScalar(size);
    }

    // The page's brush stroke starts at the nib, which is this group's
    // origin, wherever the bob, the follow, a tap or the intro has put it.
    if (penTip.move) {
      camera.updateMatrixWorld();
      pen.updateWorldMatrix(true, false);
      tipAt.setFromMatrixPosition(pen.matrixWorld).project(camera);
      const r = gl.domElement.getBoundingClientRect();
      penTip.move(
        r.left + ((tipAt.x + 1) / 2) * r.width,
        r.top + ((1 - tipAt.y) / 2) * r.height,
      );
    }

    // The cursor tracks the nib straight down the panel normal, like the real
    // thing; the distance between the two is what shows the hover height.
    cursorRef.current?.position.set(
      x * MODEL_SCALE,
      (GLASS_TOP + 0.0003) * MODEL_SCALE,
      z * MODEL_SCALE,
    );

    // The ripple starts where the nib visibly touched, and only on a lit
    // screen: a dark display draws nothing.
    if (age >= TAP_DOWN && tp.ripple0 < 0 && power.on) {
      tp.ripple0 = t;
      tp.x = x;
      tp.z = z;
    }
    const ripple = rippleRef.current;
    const rippleMat = rippleMatRef.current;
    if (ripple && rippleMat) {
      const r = tp.ripple0 < 0 ? 1 : (t - tp.ripple0) / RIPPLE_TIME;
      ripple.visible = r < 1;
      if (ripple.visible) {
        ripple.position.set(
          tp.x * MODEL_SCALE,
          (GLASS_TOP + 0.0002) * MODEL_SCALE,
          tp.z * MODEL_SCALE,
        );
        rippleMat.uniforms.uProgress.value = r;
        rippleMat.uniforms.uCenter.value.set(tp.x, tp.z);
      }
    }
  });

  return (
    <>
      {/* The group pivots on the tablet's front edge, which stays on the desk,
          and PROP lifts the back. Everything screen-relative lives inside it,
          so the light, the cursor and the pen all tilt with the panel. */}
      <group ref={rootRef} position={tabletPivot} rotation-x={PROP}>
        <group ref={tabletRef} position-z={-HALF_DEPTH * MODEL_SCALE}>
          <primitive object={tablet} scale={MODEL_SCALE} />

          {/* The key requirement: the screen is the light. Same size as the
              panel, sitting on it, emitting along its normal (a RectAreaLight
              shines down its local -Z; rotating +90° about X turns that to +Y). */}
          <rectAreaLight
            ref={lightRef}
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

          {/* The intro's logo screen, a hair above the glass, exactly over
              the panel. Drawn last and over everything: the additive glows
              behind the glass (the desk's light pool) otherwise bleed
              through it and give the handoff away. It's gone before the pen
              reaches the glass. */}
          <mesh
            ref={logoRef}
            position={[
              SCREEN.x * MODEL_SCALE,
              (GLASS_TOP + 0.0001) * MODEL_SCALE,
              0,
            ]}
            rotation-x={-Math.PI / 2}
            renderOrder={10}
            visible={false}
          >
            <planeGeometry args={[PANEL_W, PANEL_H]} />
            <shaderMaterial
              ref={logoMatRef}
              vertexShader={CURSOR_VERT}
              fragmentShader={LOGO_FRAG}
              uniforms={logoUniforms}
              transparent
              depthTest={false}
              depthWrite={false}
            />
          </mesh>

          {/* Easter egg: what the screen says while it's switched off. */}
          <mesh
            position={[
              SCREEN.x * MODEL_SCALE,
              (GLASS_TOP + 0.0002) * MODEL_SCALE,
              0,
            ]}
            rotation-x={-Math.PI / 2}
            renderOrder={2}
          >
            <planeGeometry args={[PANEL_W, PANEL_H]} />
            <meshBasicMaterial
              ref={offMatRef}
              map={offTex}
              transparent
              opacity={0}
              visible={false}
              depthWrite={false}
              toneMapped={false}
              fog={false}
            />
          </mesh>

          <mesh ref={cursorRef} rotation-x={-Math.PI / 2} renderOrder={2}>
            <planeGeometry args={[CURSOR_SIZE, CURSOR_SIZE]} />
            <shaderMaterial
              ref={cursorMatRef}
              vertexShader={CURSOR_VERT}
              fragmentShader={CURSOR_FRAG}
              uniforms={cursorUniforms}
              transparent
              depthWrite={false}
            />
          </mesh>

          <mesh
            ref={rippleRef}
            rotation-x={-Math.PI / 2}
            renderOrder={2}
            visible={false}
          >
            <planeGeometry
              args={[RIPPLE_R * 2 * MODEL_SCALE, RIPPLE_R * 2 * MODEL_SCALE]}
            />
            <shaderMaterial
              ref={rippleMatRef}
              vertexShader={CURSOR_VERT}
              fragmentShader={RIPPLE_FRAG}
              uniforms={rippleUniforms}
              transparent
              depthWrite={false}
            />
          </mesh>

          {/* The power LED ring, a hair above the button's top face. */}
          <mesh
            position={[
              BUTTON.x * MODEL_SCALE,
              (BUTTON.top + 0.0001) * MODEL_SCALE,
              BUTTON.z * MODEL_SCALE,
            ]}
            rotation-x={-Math.PI / 2}
            renderOrder={2}
          >
            <planeGeometry
              args={[
                (BUTTON.hw + LED_MARGIN) * 2 * MODEL_SCALE,
                (BUTTON.hd + LED_MARGIN) * 2 * MODEL_SCALE,
              ]}
            />
            <shaderMaterial
              ref={ledMatRef}
              vertexShader={CURSOR_VERT}
              fragmentShader={LED_FRAG}
              uniforms={ledUniforms}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
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

  const matRef = useRef<THREE.PointsMaterial>(null);
  useFrame(({ clock }) => {
    // A slow sway, not a spin: the field is off-centre, and a full rotation
    // would carry it away from the frame.
    if (ref.current && !reducedMotion.matches)
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.15;
    // Held back while the intro's screen fills the view: specks over the
    // logo would give the handoff away.
    if (matRef.current) matRef.current.opacity = 0.8 * heroIntro.cam;
  });

  return (
    <points ref={ref} position={FIELD_CENTER}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      {/* Orthographic: no size attenuation, so size is in pixels. */}
      <pointsMaterial
        ref={matRef}
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
        uOpacity: { value: c.opacity as number },
      })),
    [palette],
  );

  useFrame(({ clock, camera }) => {
    const t = reducedMotion.matches ? 0 : clock.elapsedTime;
    CLOUDS.forEach((c, i) => {
      const m = refs.current[i];
      if (!m) return;
      // Billboard: always face the camera.
      m.quaternion.copy(camera.quaternion);
      // Faded in with the intro's pull-back, like the dust.
      uniforms[i].uOpacity.value = c.opacity * heroIntro.cam;
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

// The loop never idles, so stop it outright once the hero has scrolled away:
// nothing off screen is worth a full-hero redraw every frame.
function PauseOffscreen() {
  const gl = useThree((state) => state.gl);
  const setFrameloop = useThree((state) => state.setFrameloop);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) =>
      setFrameloop(entry.isIntersecting ? 'always' : 'never'),
    );
    io.observe(gl.domElement);
    return () => io.disconnect();
  }, [gl, setFrameloop]);
  return null;
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

      <PauseOffscreen />
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
        <Stage palette={palette} motion={motion} onReady={onReady} />
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
  const pointer = useRef({
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    on: false,
    presses: 0,
    held: false,
  });
  const scroll = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // useLoader's GLTFLoader and TextureLoader report to the default manager.
    // ponytail: counts files, not bytes, so the bar steps; the tablet GLB is
    // most of the weight. Byte progress needs a fetch-based loader.
    THREE.DefaultLoadingManager.onProgress = (_url, loaded, total) =>
      setHeroProgress(loaded, total);

    const onMove = (e: PointerEvent) => {
      const p = pointer.current;
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = -((e.clientY / window.innerHeight) * 2 - 1);
      p.cx = e.clientX;
      p.cy = e.clientY;
      // Only a hovering pointer steers the pen; a finger dragging to scroll
      // on a touch screen shouldn't yank it about.
      p.on = e.pointerType !== 'touch';
    };
    // Leaving the window: no related target means the pointer left the page.
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) pointer.current.on = false;
    };
    // Primary clicks drive the tap and the power button. Clicks meant for the
    // page (links, buttons, form controls, the FAQ) never reach the scene.
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === 'touch') return;
      const target = e.target as Element | null;
      if (
        target?.closest(
          'a, button, input, select, textarea, summary, label, [role="button"]',
        )
      )
        return;
      onMove(e);
      pointer.current.presses++;
      pointer.current.held = true;
    };
    // Any release ends a hold, wherever it happens (even off the page).
    const onUp = () => {
      pointer.current.held = false;
    };
    // Listens on the window, not the canvas: the canvas is pointer-events:none.
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener('blur', onUp);

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
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', onUp);
      st.kill();
    };
  }, []);

  return (
    <Canvas
      // flat = NoToneMapping. ACES would wash out a UI screenshot.
      flat
      orthographic
      // The canvas covers the whole hero and every desk pixel runs the
      // RectAreaLight shading; 2x cost ~78% more pixels for little gain.
      dpr={[1, 1.5]}
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
