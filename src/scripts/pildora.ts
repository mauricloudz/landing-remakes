// Píldora única detrás de los enlaces de la cabecera. Se desliza (clip-path con WAAPI, así los extremos no se
// deforman) hasta el enlace de la escena activa. En una escena sin enlace se recoge hacia su centro.
// La copia clara del texto va dentro de la píldora y la recorta el mismo clip-path.

const FRICCION = 'cubic-bezier(0.16, 1, 0.3, 1)';
const DURACION = 700;

export interface Pildora {
  /** Marca la escena activa: mueve la píldora a su enlace (o la recoge si no tiene). */
  marcar: (idEscena: string, animar: boolean) => void;
  destruir: () => void;
}

type Tramo = { l: number; r: number };

/**
 * @param lw contenedor (position: relative) que envuelve la lista de enlaces
 * @param enlaceDe traduce el id de una escena al id (hash) del enlace que la representa
 */
export function crearPildora(lw: HTMLElement, enlaceDe: (id: string) => string = (id) => id): Pildora | null {
  const ul = lw.querySelector<HTMLElement>(':scope > ul');
  if (!ul) return null;
  lw.querySelector(':scope > .pil-cab')?.remove();

  const enlaces = [...ul.querySelectorAll<HTMLAnchorElement>('a')];
  const hashes = enlaces.map((a) => { try { return new URL(a.href, location.href).hash.slice(1); } catch { return ''; } });
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pastilla = document.createElement('div');
  pastilla.className = 'pil-cab';
  pastilla.setAttribute('aria-hidden', 'true');
  pastilla.inert = true;
  const clon = ul.cloneNode(true) as HTMLElement;
  clon.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
  // La copia es decoración: aria-hidden e inert (sin foco ni clic); conserva el href para que no cuente como ancla sin destino
  clon.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => { a.removeAttribute('aria-current'); });
  pastilla.appendChild(clon);
  lw.appendChild(pastilla);

  const recorte = (l: number, r: number) => `inset(0 ${r.toFixed(3)}% 0 ${l.toFixed(3)}% round 999px)`;
  let indice = -1;                // enlace al que apunta ahora (-1: sin enlace)
  let tramo: Tramo | null = null; // posición actual de la píldora; null = recogida
  let centro = 50;                // centro (en % del ancho) hacia el que se recoge

  const tramoDe = (i: number): Tramo | null => {
    const W = lw.clientWidth;
    if (!W) return null;
    const a = enlaces[i];
    return { l: (a.offsetLeft / W) * 100, r: 100 - ((a.offsetLeft + a.offsetWidth) / W) * 100 };
  };
  const cancelar = () => pastilla.getAnimations().forEach((a) => a.cancel());

  const mover = (i: number, animar: boolean) => {
    indice = i;
    enlaces.forEach((a, k) => { if (k === i) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    const enMarcha = pastilla.getAnimations().length > 0;
    let desde = enMarcha ? getComputedStyle(pastilla).clipPath : pastilla.style.clipPath;
    let nuevo: string;
    if (i < 0) {
      if (!tramo) return;
      centro = (tramo.l + (100 - tramo.r)) / 2;
      tramo = null;
      nuevo = recorte(centro, 100 - centro);
    } else {
      const d = tramoDe(i);
      if (!d) return; // la cabecera no se ve (menú móvil): se calcula al aparecer
      nuevo = recorte(d.l, d.r);
      if (!tramo) {
        const c = (d.l + (100 - d.r)) / 2;
        desde = recorte(c, 100 - c);
      }
      tramo = d;
    }
    cancelar();
    pastilla.style.clipPath = nuevo;
    if (animar && !quieto) {
      pastilla.classList.add('en-marcha');
      const a = pastilla.animate({ clipPath: [desde, nuevo] }, { duration: DURACION, easing: FRICCION });
      a.onfinish = () => pastilla.classList.remove('en-marcha');
      a.oncancel = () => pastilla.classList.remove('en-marcha');
    }
  };

  const idx = (idEscena: string) => hashes.indexOf(enlaceDe(idEscena));
  let ultimo = '';
  const marcar = (idEscena: string, animar: boolean) => { ultimo = idEscena; mover(idx(idEscena), animar); };

  // Si cambia el ancho (tamaño de ventana, fuente cargada, aparece el menú de escritorio) se recalcula sin animar
  const ro = new ResizeObserver(() => {
    cancelar();
    pastilla.classList.remove('en-marcha');
    if (indice < 0) return;
    const d = tramoDe(indice);
    if (d) { tramo = d; pastilla.style.clipPath = recorte(d.l, d.r); }
  });
  ro.observe(lw);
  void document.fonts?.ready.then(() => { if (ultimo) mover(idx(ultimo), false); });

  return {
    marcar,
    destruir: () => { ro.disconnect(); cancelar(); pastilla.remove(); },
  };
}
