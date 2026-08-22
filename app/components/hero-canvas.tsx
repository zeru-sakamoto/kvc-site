'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Swap this one file for a real capture and nothing here changes.
const PLACEHOLDER_SRC = '/hero-screenshot.webp';
const PLACEHOLDER_ASPECT = 1440 / 900;
const WINDOW_WIDTH = 4.7;

// Resting tilt. Gentle on purpose — the window should read as a real object
// catching light, not as a perspective trick.
const TILT_X = -0.06;
const TILT_Y = 0.24;
const TILT_Z = 0.015;

type Motion = {
  // Pointer, normalised to -1..1 across the viewport.
  pointer: RefObject<{ x: number; y: number }>;
  // 0 at the top of the hero, 1 once it has scrolled out.
  scroll: RefObject<number>;
};

type Palette = ReturnType<typeof readPalette>;

// Lighting reads the same @theme tokens globals.css hands the 2D layer, so the
// key light cannot drift from the page's blues. Unresolved tokens fall back to
// white (neutral light) rather than to a second copy of the hex values.
function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const color = (token: string) =>
    new THREE.Color(style.getPropertyValue(token).trim() || '#ffffff');
  return {
    blue: color('--color-brand-blue'),
    cool: color('--color-accent-cool'),
    warm: color('--color-accent-warm'),
    deep: color('--color-canvas-deep'),
  };
}

function AppWindow({
  motion,
  onReady,
}: {
  motion: Motion;
  onReady: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, PLACEHOLDER_SRC);

  // Fires only once Suspense has resolved the texture, which is the moment the
  // 3D window is actually paintable. hero-scene.tsx uses it to cross-fade the
  // flat fallback image out.
  useEffect(() => {
    onReady();
  }, [onReady]);

  useFrame(({ clock }, delta) => {
    const group = ref.current;
    if (!group) return;
    const t = clock.elapsedTime;
    const { x: px, y: py } = motion.pointer.current;
    const s = motion.scroll.current;

    // damp() is frame-rate independent, so the easing feels the same at 60 and
    // 144Hz. Targets are read fresh each frame; nothing here sets React state.
    const d = (from: number, to: number) =>
      THREE.MathUtils.damp(from, to, 4, delta);

    group.rotation.x = d(group.rotation.x, TILT_X + py * 0.09 - s * 0.16);
    group.rotation.y = d(group.rotation.y, TILT_Y + px * 0.13);
    group.rotation.z = TILT_Z + Math.sin(t * 0.4) * 0.008;

    group.position.x = d(group.position.x, px * 0.16);
    group.position.y = d(
      group.position.y,
      Math.sin(t * 0.6) * 0.055 - py * 0.1 + s * 1.1,
    );
    group.position.z = d(group.position.z, -s * 1.6);
  });

  return (
    <group ref={ref} rotation={[TILT_X, TILT_Y, TILT_Z]}>
      <mesh>
        <planeGeometry
          args={[WINDOW_WIDTH, WINDOW_WIDTH / PLACEHOLDER_ASPECT]}
        />
        {/* transparent: the placeholder's rounded corners are cut out of the
            SVG, so the plane has to let the page show through at the edges. */}
        {/* map-* pierces into the texture declaratively. Mutating the object
            useLoader hands back would edit its shared cache entry. */}
        <meshStandardMaterial
          map={texture}
          map-colorSpace={THREE.SRGBColorSpace}
          map-anisotropy={16}
          transparent
          roughness={0.55}
          metalness={0.12}
        />
      </mesh>
    </group>
  );
}

const DUST_COUNT = 520;

// Hash-based scatter rather than Math.random(): pure, so the field is byte-for
// -byte identical on every render, and it stays inside the React Compiler's
// purity rules for values computed during render.
function scatter(i: number, seed: number) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// The ambient field the window floats in. Drifts against the window's scroll
// parallax so the two read as separate depths.
function Dust({ palette, motion }: { palette: Palette; motion: Motion }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const col = new Float32Array(DUST_COUNT * 3);
    const hues = [palette.blue, palette.cool, palette.warm];
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (scatter(i, 1) - 0.5) * 14;
      pos[i * 3 + 1] = (scatter(i, 2) - 0.5) * 9;
      pos[i * 3 + 2] = -1 - scatter(i, 3) * 7;
      // Warm stays the rarest of the three, matching how the page uses it.
      const pick = scatter(i, 4);
      const c = hues[pick < 0.18 ? 2 : pick < 0.66 ? 0 : 1];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [palette]);

  useFrame(({ clock }, delta) => {
    const points = ref.current;
    if (!points) return;
    points.rotation.z = clock.elapsedTime * 0.012;
    points.position.y = THREE.MathUtils.damp(
      points.position.y,
      -motion.scroll.current * 1.8,
      3,
      delta,
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene({ motion, onReady }: { motion: Motion; onReady: () => void }) {
  const palette = useMemo(() => readPalette(), []);

  return (
    <>
      {/* Fog pulls the dust field off into Deep Ink instead of ending it on a
          hard edge. The window sits in front of the near plane, untouched. */}
      <fog attach="fog" args={[palette.deep, 6, 13]} />

      <ambientLight intensity={0.9} />
      <directionalLight
        position={[-3.2, 2.4, 4]}
        intensity={2.4}
        color={palette.blue}
      />
      <directionalLight
        position={[4, -1.2, 2.5]}
        intensity={1.7}
        color={palette.cool}
      />
      <pointLight
        position={[2.2, -2.6, 2]}
        intensity={9}
        distance={12}
        color={palette.warm}
      />

      <Dust palette={palette} motion={motion} />
      <AppWindow motion={motion} onReady={onReady} />
    </>
  );
}

export default function HeroCanvas({
  onReady,
  onContextLost,
}: {
  onReady: () => void;
  onContextLost: () => void;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    // Listens on the window, not the canvas: the canvas is pointer-events:none
    // so the headline underneath stays selectable and the CTAs stay clickable.
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
      window.removeEventListener('pointermove', onMove);
      st.kill();
    };
  }, []);

  return (
    <Canvas
      // flat = NoToneMapping. ACES would wash out a UI screenshot.
      flat
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 6], fov: 32 }}
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
      <Scene motion={{ pointer, scroll }} onReady={onReady} />
    </Canvas>
  );
}
