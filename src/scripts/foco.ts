// Foco que sigue al puntero dentro de un grupo de tarjetas: luz suave en el fondo y borde iluminado cerca del
// puntero. Las tarjetas vecinas reaccionan según su distancia. El valor se acerca con lerp en requestAnimationFrame;
// al salir (o al soltar el dedo) la luz se apaga con la curva --friccion. will-change solo mientras hay luz.

const LERP = 0.16;
const ALCANCE = 140; // distancia (px) a la que una tarjeta vecina todavía se ilumina
const SALIDA = 900;

// cubic-bezier(0.16, 1, 0.3, 1) resuelta por Newton: la misma curva --friccion para el apagado
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
 * @param zona elemento que recibe el puntero (contiene a las tarjetas)
 * @param tarjetas tarjetas con la clase .spot
 */
export function iniciarFoco(zona: HTMLElement, tarjetas: HTMLElement[], signal: AbortSignal): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || tarjetas.length === 0) return;
  const st = tarjetas.map(() => ({ x: 0, y: 0, a: 0, tx: 0, ty: 0, ta: 0 }));
  let vuelta: { t0: number; a: number[] } | null = null;
  let raf = 0;

  const pintar = () => tarjetas.forEach((c, i) => {
    c.style.setProperty('--mx', st[i].x.toFixed(1));
    c.style.setProperty('--my', st[i].y.toFixed(1));
    c.style.setProperty('--act', st[i].a.toFixed(3));
  });
  const apagar = () => tarjetas.forEach((c) => { c.classList.remove('activo'); c.style.removeProperty('--act'); });

  const paso = (ahora: number) => {
    raf = 0;
    if (vuelta) {
      const k = Math.min(1, (ahora - vuelta.t0) / SALIDA), e = friccion(k);
      st.forEach((s, i) => { s.a = vuelta!.a[i] * (1 - e); });
      pintar();
      if (k < 1) raf = requestAnimationFrame(paso);
      else { vuelta = null; apagar(); }
      return;
    }
    let mov = false;
    for (const s of st) {
      s.x += (s.tx - s.x) * LERP; s.y += (s.ty - s.y) * LERP; s.a += (s.ta - s.a) * LERP;
      if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) + Math.abs(s.ta - s.a) > 0.004) mov = true;
    }
    pintar();
    // will-change solo mientras la tarjeta tiene luz
    tarjetas.forEach((c, i) => { if (st[i].a < 0.004 && st[i].ta === 0) c.classList.remove('activo'); });
    if (mov) raf = requestAnimationFrame(paso);
  };

  const mover = (e: PointerEvent) => {
    tarjetas.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const s = st[i];
      if (r.width === 0 || r.height === 0) { s.ta = 0; return; } // escena oculta
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const k = c.offsetWidth ? c.offsetWidth / r.width : 1; // la tarjeta puede estar escalada
      const nuevo = Math.max(0, 1 - Math.hypot(dx, dy) / ALCANCE);
      s.tx = Math.min(r.width, Math.max(0, e.clientX - r.left)) * k;
      s.ty = Math.min(r.height, Math.max(0, e.clientY - r.top)) * k;
      if (s.a < 0.01 && nuevo > 0) { s.x = s.tx; s.y = s.ty; } // la luz nace bajo el puntero
      s.ta = nuevo;
      if (nuevo > 0) c.classList.add('activo');
    });
    vuelta = null;
    if (!raf) raf = requestAnimationFrame(paso);
  };
  const soltar = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.type !== 'pointerleave') return; // con ratón, la luz se apaga al salir
    vuelta = { t0: performance.now(), a: st.map((s) => s.a) };
    st.forEach((s) => { s.ta = 0; });
    if (!raf) raf = requestAnimationFrame(paso);
  };

  zona.addEventListener('pointerenter', mover, { signal });
  zona.addEventListener('pointermove', mover, { signal });
  zona.addEventListener('pointerdown', mover, { signal });
  for (const n of ['pointerup', 'pointercancel', 'pointerleave'] as const) zona.addEventListener(n, soltar, { signal });
  signal.addEventListener('abort', () => { cancelAnimationFrame(raf); apagar(); });
}
