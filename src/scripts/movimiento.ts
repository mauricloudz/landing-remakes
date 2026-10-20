// Revela elementos al entrar en pantalla. Se reinicia en cada navegación
// porque las transiciones de página no recargan el documento.
let observador: IntersectionObserver | undefined;

function iniciar() {
  observador?.disconnect();
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const objetivos = document.querySelectorAll<HTMLElement>('[data-reveal], .palabras');
  if (reducido || !('IntersectionObserver' in window)) {
    objetivos.forEach((el) => el.classList.add('visible'));
    return;
  }
  observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observador?.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  objetivos.forEach((el) => observador!.observe(el));
}

document.addEventListener('astro:page-load', iniciar);
