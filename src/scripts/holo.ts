// Ticket holográfico: se inclina hasta 8° hacia el puntero y lleva encima una lámina iridiscente, un brillo
// especular y un grano (las capas son .holo dentro de cada mitad; el CSS vive en la página). Todo se acerca con
// lerp en requestAnimationFrame; al salir vuelve a reposo con --friccion. En táctil responde mientras el dedo
// está encima y vuelve a reposo al soltar.

const MAX = 8;      // grados
const LERP = 0.14;
const SALIDA = 900; // regreso a reposo con el puntero
export const RAPIDO = 200; // regreso cuando empieza un cambio de escena

const friccion = (() => {
  const [x1, y1, x2, y2] = [0.16, 1, 0.3, 1];
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = ((ax * t + bx) * t + cx) * t - x, d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(e) < 1e-4 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return ((ay * t + by) * t + cy) * t;
  };
})();

export interface Holo {
  /** Vuelve a reposo en ms (para soltar el ticket antes de que se capture como ancla). */
  volver: (ms?: number) => void;
  /** Reposo inmediato: transform vacío y variables a cero. */
  reposoYa: () => void;
}

/**
 * @param tk ticket (position: relative)
 * @param bloqueado si devuelve true se ignora el puntero (cambio de escena en curso)
 */
export function iniciarHolo(tk: HTMLElement, signal: AbortSignal, bloqueado: () => boolean = () => false): Holo | null {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const partes = [...tk.querySelectorAll<HTMLElement>('.tk-a, .tk-b')];
  const s = { x: 0.5, y: 0.5, a: 0 };
  const t = { x: 0.5, y: 0.5, a: 0 };
  let vuelta: { x: number; y: number; a: number; t0: number; dur: number } | null = null;
  let raf = 0;

  const pintar = () => {
    tk.style.setProperty('--px', s.x.toFixed(4));
    tk.style.setProperty('--py', s.y.toFixed(4));
    tk.style.setProperty('--act', s.a.toFixed(4));
    tk.style.transform = `perspective(1000px) rotateX(${((0.5 - s.y) * 2 * MAX * s.a).toFixed(3)}deg) rotateY(${((s.x - 0.5) * 2 * MAX * s.a).toFixed(3)}deg)`;
    for (const p of partes) {
      p.style.setProperty('--sx', (s.x * tk.offsetWidth).toFixed(1));
      p.style.setProperty('--sy', (s.y * tk.offsetHeight - p.offsetTop).toFixed(1));
    }
  };
  const reposo = () => {
    cancelAnimationFrame(raf); raf = 0;
    vuelta = null;
    s.x = t.x = 0.5; s.y = t.y = 0.5; s.a = t.a = 0;
    tk.classList.remove('activo');
    tk.style.transform = '';
    for (const v of ['--px', '--py', '--act']) tk.style.removeProperty(v);
    for (const p of partes) { p.style.removeProperty('--sx'); p.style.removeProperty('--sy'); }
  };
  const paso = (ahora: number) => {
    raf = 0;
    if (vuelta) {
      const k = Math.min(1, (ahora - vuelta.t0) / vuelta.dur), e = friccion(k);
      s.x = vuelta.x + (0.5 - vuelta.x) * e; s.y = vuelta.y + (0.5 - vuelta.y) * e; s.a = vuelta.a * (1 - e);
      if (k < 1) { pintar(); raf = requestAnimationFrame(paso); } else reposo();
      return;
    }
    s.x += (t.x - s.x) * LERP; s.y += (t.y - s.y) * LERP; s.a += (t.a - s.a) * LERP;
    pintar();
    if (Math.abs(t.x - s.x) + Math.abs(t.y - s.y) + Math.abs(t.a - s.a) > 0.002) raf = requestAnimationFrame(paso);
  };
  const volver = (ms = SALIDA) => {
    if (!raf && s.a === 0 && !tk.classList.contains('activo')) return;
    t.a = 0;
    vuelta = { x: s.x, y: s.y, a: s.a, t0: performance.now(), dur: ms };
    if (!raf) raf = requestAnimationFrame(paso);
  };

  const mover = (e: PointerEvent) => {
    if (bloqueado()) return;
    const r = tk.getBoundingClientRect();
    if (!r.width || !r.height) return;
    t.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    t.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    t.a = 1;
    if (s.a < 0.01) { s.x = t.x; s.y = t.y; } // la lámina nace bajo el puntero
    vuelta = null;
    tk.classList.add('activo');
    if (!raf) raf = requestAnimationFrame(paso);
  };
  const soltar = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.type !== 'pointerleave') return; // con ratón, el reposo llega al salir
    volver();
  };
  tk.addEventListener('pointerenter', mover, { signal });
  tk.addEventListener('pointermove', mover, { signal });
  tk.addEventListener('pointerdown', mover, { signal });
  for (const n of ['pointerup', 'pointercancel', 'pointerleave'] as const) tk.addEventListener(n, soltar, { signal });
  signal.addEventListener('abort', reposo);
  return { volver, reposoYa: reposo };
}
