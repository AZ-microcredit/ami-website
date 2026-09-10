/**
 * Shared scroll-motion engine.
 *
 * One passive scroll listener and one requestAnimationFrame loop serve every
 * scene on the page. Scenes register a measure() pass (runs outside the
 * scroll frame, on resize / rotation / font load / content resize) and a
 * render() pass (runs inside the frame with pre-read geometry).
 *
 * Progress is always normalized 0..1 against measured scroll travel - never
 * a hardcoded viewport resolution. The only hard motion-off state is
 * `prefers-reduced-motion: reduce`.
 */

export interface SceneFrame {
  /** Layout viewport width (px). */
  vw: number;
  /** Usable visual viewport height (px). */
  vh: number;
  /** Sticky header height from --header-height. */
  header: number;
  /** Root element's current bounding top. */
  top: number;
  /** Root element's current bounding bottom. */
  bottom: number;
  /** Root element's offset height. */
  height: number;
  /** Whether reduced motion is requested. */
  reduced: boolean;
  /** Normalized sub-progress of the scene progress between two beats. */
  segment(from: number, to: number): number;
}

export interface SceneOptions {
  root: HTMLElement;
  /** Re-measure content fit and derived geometry. Called outside scroll frames. */
  measure?: () => void;
  /** Apply motion for the current frame. Runs inside the shared rAF. */
  render: (frame: SceneFrame) => void;
  /** Offscreen margin (px) beyond which render work is skipped. */
  margin?: number;
}

interface Scene {
  root: HTMLElement;
  measure?: () => void;
  render: (frame: SceneFrame) => void;
  margin: number;
}

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const scenes = new Set<Scene>();
let frame = 0;
let measuring = false;

export function reducedMotion(): boolean {
  return reducedQuery.matches;
}

export function viewportHeight(): number {
  return window.visualViewport ? window.visualViewport.height : window.innerHeight;
}

export function headerHeight(): number {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
  return Number.isFinite(value) ? value : 72;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function segment(from: number, to: number, progress: number): number {
  return clamp01((progress - from) / Math.max(1e-6, to - from));
}

/** Local 0..1 progress of an element travelling up through the viewport. */
export function localProgress(rect: DOMRect | { top: number; height: number }, vh: number, enter = 0.9, span = 0.55): number {
  return clamp01((vh * enter - rect.top) / Math.max(1, vh * span));
}

function runFrame(): void {
  frame = 0;
  const vw = window.innerWidth;
  const vh = viewportHeight();
  const header = headerHeight();
  const reduced = reducedQuery.matches;
  for (const scene of [...scenes]) {
    try {
      const rect = scene.root.getBoundingClientRect();
      if (rect.bottom < -scene.margin || rect.top > vh + scene.margin) continue;
      scene.render({
        vw,
        vh,
        header,
        top: rect.top,
        bottom: rect.bottom,
        height: scene.root.offsetHeight,
        reduced,
        segment: (from, to) => segment(from, to, clamp01((header - rect.top) / Math.max(1, scene.root.offsetHeight - vh + header))),
      });
    } catch (error) {
      // A failing scene must never break the page: drop the enhancement and
      // leave the complete static layout in place.
      console.error('[motion] scene removed after error', error);
      scenes.delete(scene);
    }
  }
}

export function queueFrame(): void {
  if (!frame) frame = requestAnimationFrame(runFrame);
}

export function remeasure(): void {
  if (measuring) return;
  measuring = true;
  try {
    for (const scene of [...scenes]) {
      try {
        scene.measure?.();
      } catch (error) {
        console.error('[motion] scene measure failed', error);
        scenes.delete(scene);
      }
    }
  } finally {
    measuring = false;
  }
  queueFrame();
}

const resizeObserver = new ResizeObserver(() => remeasure());

export function createScrollScene(options: SceneOptions): () => void {
  const scene: Scene = {
    root: options.root,
    measure: options.measure,
    render: options.render,
    margin: options.margin ?? 160,
  };
  scenes.add(scene);
  resizeObserver.observe(options.root);
  try {
    scene.measure?.();
  } catch (error) {
    console.error('[motion] scene measure failed', error);
    scenes.delete(scene);
    return () => undefined;
  }
  queueFrame();
  return () => {
    scenes.delete(scene);
    resizeObserver.unobserve(options.root);
  };
}

window.addEventListener('scroll', queueFrame, { passive: true });
window.addEventListener('resize', remeasure);
window.addEventListener('orientationchange', remeasure);
window.visualViewport?.addEventListener('resize', remeasure);
reducedQuery.addEventListener('change', remeasure);
if (document.fonts?.ready) document.fonts.ready.then(() => remeasure()).catch(() => undefined);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) remeasure();
});
