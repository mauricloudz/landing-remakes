// Métricas medidas con Lighthouse 13.5.0 (perfil móvil por defecto),
// sirviendo ambas versiones en local en las mismas condiciones.
export interface Metricas { rendimiento: number; accesibilidad: number; practicas: number; seo: number; lcp: string; peso: number; anchoMovil: number }
export const proyectos = [
  {
    id: 'peludo', nombre: 'Ayuda a un Peludo', anio: 2024, ruta: 'ayuda-a-un-peludo/', tipo: 'ONG de adopción',
    antes: { rendimiento: 69, accesibilidad: 78, practicas: 96, seo: 91, lcp: '6,8 s', peso: 1025, anchoMovil: 481 } as Metricas,
    despues: { rendimiento: 100, accesibilidad: 100, practicas: 100, seo: 100, lcp: '1,5 s', peso: 111, anchoMovil: 390 } as Metricas,
    novedades: ['Retratos ilustrados en SVG con parpadeo y orejas animadas', 'Filtro de perros y gatos con transición animada', 'Test "¿Qué peludo es para ti?"', 'Proceso de adopción con línea que avanza al hacer scroll', 'Preguntas frecuentes y formulario con validación'],
  },
  {
    id: 'meet', nombre: 'Meet & Coffee', anio: 2021, ruta: 'meet-and-coffee/', tipo: 'Comunidad de charlas',
    antes: { rendimiento: 67, accesibilidad: 89, practicas: 96, seo: 100, lcp: '16,2 s', peso: 2798, anchoMovil: 519 } as Metricas,
    despues: { rendimiento: 98, accesibilidad: 100, practicas: 100, seo: 100, lcp: '2,0 s', peso: 157, anchoMovil: 390 } as Metricas,
    novedades: ['Cuenta regresiva real a la próxima sesión, en hora de Santiago', 'Taza con vapor animado y temas que rotan', 'Carrusel de eventos con transición hacia cada detalle', 'Página de detalle para cada evento, con contenido real', 'Agenda de la noche y formulario para proponer charlas'],
  },
];
