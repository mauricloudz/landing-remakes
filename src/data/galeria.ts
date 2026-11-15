// Métricas medidas con Lighthouse (perfil móvil por defecto), sirviendo ambas versiones en local
// en las mismas condiciones: los valores "antes" con la versión 13.5 y los "después" con la 13.6.
export interface Metricas { rendimiento: number; accesibilidad: number; practicas: number; seo: number; lcp: string; peso: number; anchoMovil: number }
export const proyectos = [
  {
    id: 'peludo', nombre: 'Ayuda a un Peludo', anio: 2024, ruta: 'ayuda-a-un-peludo/', tipo: 'ONG de adopción',
    antes: { rendimiento: 69, accesibilidad: 78, practicas: 96, seo: 91, lcp: '6,8 s', peso: 1025, anchoMovil: 481 } as Metricas,
    despues: { rendimiento: 100, accesibilidad: 100, practicas: 100, seo: 100, lcp: '0,9 s', peso: 163, anchoMovil: 390 } as Metricas,
    novedades: [
      'Diez escenas en vez de scroll',
      'Textos que entran por máscaras',
      'Galería con filtro de perros y gatos',
      'Test "¿Qué peludo es para ti?"',
      'Pasos con número que se desliza',
      'Preguntas con respuesta en panel fijo',
      'Formulario con validación',
    ],
  },
  {
    id: 'meet', nombre: 'Meet & Coffee', anio: 2021, ruta: 'meet-and-coffee/', tipo: 'Comunidad de charlas',
    antes: { rendimiento: 67, accesibilidad: 89, practicas: 96, seo: 100, lcp: '16,2 s', peso: 2798, anchoMovil: 519 } as Metricas,
    despues: { rendimiento: 100, accesibilidad: 100, practicas: 100, seo: 100, lcp: '0,9 s', peso: 172, anchoMovil: 390 } as Metricas,
    novedades: [
      'Nueve escenas en vez de scroll',
      'Zambullida a la cuenta regresiva real',
      'Próxima charla en afiche tipo ticket',
      'Agenda de la noche hora por hora',
      'Mapa con dirección, cerca del metro',
      'Eventos pasados con página propia',
      'Formulario de charlas y preguntas',
    ],
  },
];

// "Cómo está hecho": seis decisiones, en el orden en que se leen en la fila horizontal.
export const decisiones = [
  { t: 'Ilustraciones propias en vez de fotos de stock', d: 'Las fotos originales eran miniaturas de origen incierto. Ahora todo es SVG hecho a medida: pesa casi nada y se puede animar.' },
  { t: 'Movimiento en CSS puro, sin librerías', d: 'Ayuda a un Peludo (diez escenas), Meet & Coffee (nueve) y esta galería (siete) pasan entre escenas a pantalla completa con la API de View Transitions: anclas que viajan y textos que entran por máscaras. Sin ella, o con movimiento reducido, cada página es un documento normal y legible.' },
  { t: 'Poco JavaScript', d: 'Astro entrega HTML estático. El JavaScript se limita al enrutador de Astro, al filtro, el test, la cuenta regresiva, el comparador, los formularios y un pequeño controlador de escenas en cada una de las tres páginas.' },
  { t: 'Transiciones entre páginas', d: 'Al abrir un evento, la portada y el título viajan desde la tarjeta hasta su nueva posición.' },
  { t: 'Accesibilidad medida', d: 'Contraste, foco visible, navegación por teclado, textos alternativos y un enlace para saltar al contenido.' },
  { t: 'SEO listo', d: 'Metadatos, Open Graph, datos estructurados de schema.org, sitemap y URLs canónicas en cada página.' },
];
export const tecnologias = ['Astro 7', 'Tailwind CSS 4', 'TypeScript', 'SVG animado', 'View Transitions', 'GitHub Actions', 'GitHub Pages'];
