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
 *
 * Pacing layer:
 * - TEMPO is the single site-wide speed knob. It scales every pinned scene's
 *   scroll travel through the `--tempo-scale` CSS variable (1.0 = the tuned
 *   baseline pacing, currently tuned at TEMPO = 1.5).
 * - beat() maps raw pin progress onto the LEAD -> PLAY -> DWELL structure
 *   every pinned scene shares: the choreography holds at its start, plays,
 *   then holds its completed state so viewers can absorb it.
 * - smooth (per scene) and createSmoother (per value) add a light temporal
 *   low-pass (~90ms) that removes wheel-step jitter without decoupling
 *   motion from scroll.
 */

export interface SceneFrame {
  /** Layout viewport width (px). */
  vw: number;
  /** Usable visual viewport height (px). */
  vh: number;
  /** Sticky header height from --header-height. */
  header: number;
  /** Root element's current bounding top (smoothed when the scene opts in). */
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
  /** Low-pass the scene's scroll position (~90ms) to smooth wheel steps. */
  smooth?: boolean;
}

interface Scene {
  root: HTMLElement;
  measure?: () => void;
  render: (frame: SceneFrame) => void;
  margin: number;
  smooth: boolean;
  smoothTop: number | null;
}

/**
 * The one site-wide pacing knob. 1.5 is the tuned baseline; raise it to slow
 * every pinned scene further, lower it to speed them up. Pin heights scale
 * through `--tempo-scale`, so fit checks and choreography stay proportional.
 */
export const TEMPO = 1.5;
document.documentElement.style.setProperty('--tempo-scale', String(TEMPO / 1.5));

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

/**
 * Beat structure for pinned scenes: LEAD (choreography holds at its start
 * while the pin engages) -> PLAY (the choreography itself) -> DWELL (the
 * completed state holds for reading). Returns the 0..1 PLAY progress for a
 * raw 0..1 pin progress.
 */
export function beat(raw: number, lead = 0.10, play = 0.68): number {
  return clamp01((raw - lead) / Math.max(1e-6, play));
}

/** Local 0..1 progress of an element travelling up through the viewport. */
export function localProgress(rect: DOMRect | { top: number; height: number }, vh: number, enter = 0.95, span = 0.9): number {
  return clamp01((vh * enter - rect.top) / Math.max(1, vh * span));
}

export interface Smoother {
  /** Next smoothed value; converges on target at ~90ms time constant. */
  value(target: number): number;
  /** True once the smoothed value has fully caught up with the target. */
  readonly settled: boolean;
  /** Snap the next value directly to its target (call from measure()). */
  reset(): void;
}

/** Light temporal smoothing for continuous scroll-linked values. */
export function createSmoother(lerp = 0.18): Smoother {
  let current: number | null = null;
  let settled = true;
  return {
    value(target: number): number {
      if (current == null) {
        current = target;
        settled = true;
        return current;
      }
      const delta = target - current;
      if (Math.abs(delta) <= 0.15) {
        current = target;
        settled = true;
      } else {
        current += delta * lerp;
        settled = false;
      }
      return current;
    },
    get settled() {
      return settled;
    },
    reset() {
      current = null;
      settled = true;
    },
  };
}

/** Elements that can never receive an anchor jump meaningfully. */
function isContentElement(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && !/^(SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT)$/.test(el.tagName);
}

/**
 * The element a keyboard skip link should jump to: the first real content
 * after the scene's outermost local container. Astro injects script/style
 * siblings between sections, so non-content tags are skipped. Returns null
 * when nothing follows.
 */
export function skipTargetFor(root: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = root;
  while (el && el.tagName !== 'MAIN') {
    let sib = el.nextElementSibling;
    while (sib && !isContentElement(sib)) sib = sib.nextElementSibling;
    if (sib) return sib;
    el = el.parentElement;
  }
  return null;
}

/**
 * Wire a scene's skip link (`.scene-skip` / `.landing-skip`) to the content
 * after the scene; removes the link when there is nowhere to skip to.
 */
export function setupSkipLink(root: HTMLElement): void {
  const link = root.querySelector<HTMLAnchorElement>('.scene-skip, .landing-skip');
  if (!link) return;
  const target = skipTargetFor(root);
  if (!target) {
    (link.closest('.skip-holder') ?? link).remove();
    return;
  }
  if (!target.id) target.id = `after-${root.className.toString().split(/\s+/)[0] || 'scene'}`;
  target.tabIndex = -1;
  link.href = `#${target.id}`;
}

function runFrame(): void {
  frame = 0;
  const vw = window.innerWidth;
  const vh = viewportHeight();
  const header = headerHeight();
  const reduced = reducedQuery.matches;
  let needsMore = false;
  for (const scene of [...scenes]) {
    try {
      const rect = scene.root.getBoundingClientRect();
      if (rect.bottom < -scene.margin || rect.top > vh + scene.margin) continue;
      let top = rect.top;
      if (scene.smooth && !reduced) {
        if (scene.smoothTop == null) scene.smoothTop = rect.top;
        const delta = rect.top - scene.smoothTop;
        if (Math.abs(delta) > 0.5) {
          scene.smoothTop += delta * 0.18;
          top = scene.smoothTop;
          needsMore = true;
        } else {
          scene.smoothTop = rect.top;
        }
      }
      scene.render({
        vw,
        vh,
        header,
        top,
        bottom: rect.bottom,
        height: scene.root.offsetHeight,
        reduced,
        segment: (from, to) => segment(from, to, clamp01((header - top) / Math.max(1, scene.root.offsetHeight - vh + header))),
      });
    } catch (error) {
      // A failing scene must never break the page: drop the enhancement and
      // leave the complete static layout in place.
      console.error('[motion] scene removed after error', error);
      scenes.delete(scene);
    }
  }
  // Keep animating until every smoothed scene has caught up with the scroll.
  if (needsMore) queueFrame();
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
        scene.smoothTop = null;
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
    smooth: options.smooth ?? false,
    smoothTop: null,
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
