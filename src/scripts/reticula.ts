// Fondo de las escenas marcadas con data-reticula-viva (portada y autor): una retícula de puntos y, encima, la misma retícula en el color de la marca que solo se ve cerca del puntero
// (máscara radial en CSS; aquí solo se mueve su centro con lerp en requestAnimationFrame). Las dos ventanas se desplazan unos
// píxeles en sentido contrario al puntero (paralaje). Solo con puntero fino y movimiento permitido; en táctil queda estático.
// will-change solo mientras algo se mueve; al salir el puntero la capa se apaga con la curva --friccion.

const LERP = 0.14;
const SALIDA = 900;

// cubic-bezier(0.16, 1, 0.3, 1) por Newton: la misma curva --friccion
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

/**
 * @param escena la sección de la portada (recibe --mx, --my, --act, --px, --py)
 * @param activo ¿está el modo escenas activo y esta escena a la vista?
 * @returns función que apaga el efecto de inmediato
 */
export function iniciarReticula(escena: HTMLElement, activo: () => boolean, signal: AbortSignal): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  // Posición actual (x, y en px; nx, ny en -1…1), objetivo y presencia del foco (a)
  const e = { x: 0, y: 0, nx: 0, ny: 0, a: 0 };
  const t = { x: 0, y: 0, nx: 0, ny: 0, a: 0 };
  let raf = 0;
  let salida: { t0: number; a: number } | null = null;

  const pintar = () => {
    escena.style.setProperty('--mx', `${e.x.toFixed(1)}px`);
    escena.style.setProperty('--my', `${e.y.toFixed(1)}px`);
    escena.style.setProperty('--act', e.a.toFixed(3));
    escena.style.setProperty('--px', e.nx.toFixed(3));
    escena.style.setProperty('--py', e.ny.toFixed(3));
  };
  const limpiar = () => {
    for (const n of ['--mx', '--my', '--act', '--px', '--py']) escena.style.removeProperty(n);
    escena.classList.remove('mueve');
  };

  const paso = (ahora: number) => {
    raf = 0;
    if (salida) {
      const k = Math.min(1, (ahora - salida.t0) / SALIDA);
      e.a = salida.a * (1 - friccion(k));
      e.nx += (0 - e.nx) * LERP;
      e.ny += (0 - e.ny) * LERP;
      pintar();
      if (k < 1) raf = requestAnimationFrame(paso);
      else { salida = null; limpiar(); }
      return;
    }
    e.x += (t.x - e.x) * LERP;
    e.y += (t.y - e.y) * LERP;
    e.nx += (t.nx - e.nx) * LERP;
    e.ny += (t.ny - e.ny) * LERP;
    e.a += (t.a - e.a) * LERP;
    pintar();
    const resto = Math.abs(t.x - e.x) + Math.abs(t.y - e.y) + (Math.abs(t.nx - e.nx) + Math.abs(t.ny - e.ny)) * 100 + Math.abs(t.a - e.a) * 100;
    if (resto > 0.2) raf = requestAnimationFrame(paso);
    else escena.classList.remove('mueve');
  };

  const mover = (ev: PointerEvent) => {
    if (ev.pointerType !== 'mouse' || !activo()) return;
    const r = escena.getBoundingClientRect();
    if (r.width === 0) return;
    t.x = ev.clientX - r.left;
    t.y = ev.clientY - r.top;
    t.nx = Math.max(-1, Math.min(1, (t.x / r.width - 0.5) * 2));
    t.ny = Math.max(-1, Math.min(1, (t.y / r.height - 0.5) * 2));
    if (e.a < 0.01) { e.x = t.x; e.y = t.y; } // el foco nace bajo el puntero
    t.a = 1;
    salida = null;
    escena.classList.add('mueve');
    if (!raf) raf = requestAnimationFrame(paso);
  };
  const salir = () => {
    t.a = 0;
    salida = { t0: performance.now(), a: e.a };
    if (!raf) raf = requestAnimationFrame(paso);
  };

  escena.addEventListener('pointermove', mover, { signal, passive: true });
  escena.addEventListener('pointerenter', mover, { signal, passive: true });
  escena.addEventListener('pointerleave', salir, { signal, passive: true });
  // Al salir de la escena (display: none) no llega pointerleave: el controlador lo apaga con esto
  const apagar = () => { cancelAnimationFrame(raf); raf = 0; salida = null; e.a = 0; t.a = 0; e.nx = 0; e.ny = 0; limpiar(); };
  signal.addEventListener('abort', apagar);
  return apagar;
}

/**
 * Enlaza el efecto a cada escena con data-reticula-viva (una sola vez por escena, con su propio rAF).
 * @returns función que apaga de inmediato el efecto de la escena que se le pase
 */
export function iniciarReticulas(escenas: HTMLElement[], activo: (escena: HTMLElement) => boolean, signal: AbortSignal): (escena: HTMLElement) => void {
  const apagadores = new Map<HTMLElement, () => void>();
  for (const sec of escenas) {
    if (!sec.hasAttribute('data-reticula-viva')) continue;
    apagadores.set(sec, iniciarReticula(sec, () => activo(sec), signal));
  }
  return (sec) => apagadores.get(sec)?.();
}
