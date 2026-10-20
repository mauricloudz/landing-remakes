// Contenido de Meet & Coffee. La próxima charla y los títulos de los eventos
// vienen del sitio original de 2018; el detalle de cada evento es nuevo
// (el original solo tenía texto de relleno).
export const proxima = {
  titulo: 'Big Data para Noobs',
  resumen: 'Revisaremos las técnicas y tecnologías que hacen que sea económico hacer frente a datos de escala extrema, sin asumir que ya sabes de qué hablamos.',
  aprenderas: ['Qué hace que un volumen de datos sea "grande" y cuándo no lo es', 'Procesamiento por lotes y en streaming, con ejemplos reales', 'Cómo empezar con herramientas gratuitas desde tu notebook'],
  orador: { nombre: 'Rafaela Valdez', cargo: 'Data scientist', bio: 'PhD en Física Teórica, Carnegie Mellon University' },
};

export const agenda = [
  { hora: '19:00', titulo: 'Llegada y café', texto: 'Espresso, filtrado o té. Buen momento para conocer a quien está al lado.' },
  { hora: '19:30', titulo: 'Charla principal', texto: 'Cuarenta y cinco minutos, sin diapositivas de relleno.' },
  { hora: '20:15', titulo: 'Preguntas', texto: 'Todas valen. Las mejores suelen ser las que dan vergüenza.' },
  { hora: '20:45', titulo: 'Networking', texto: 'Segunda ronda de café y conversaciones que siguen en LinkedIn.' },
  { hora: '22:00', titulo: 'Cierre', texto: 'Apagamos la cafetera y anunciamos la próxima charla.' },
];

export type Motivo = 'base-datos' | 'red' | 'tablero';
export interface Evento {
  slug: string; titulo: string; bajada: string; fecha: string; motivo: Motivo; colores: [string, string];
  orador: { nombre: string; cargo: string };
  resumen: string; aprendimos: string[]; temas: string[];
}

export const eventos: Evento[] = [
  {
    slug: 'simposio-vegan-db', titulo: 'Simposio Vegan DB', bajada: 'Bases de datos livianas: cuándo no necesitas un cluster.',
    fecha: 'Viernes 7 de marzo', motivo: 'base-datos', colores: ['#7fd1b9', '#1f6f5c'],
    orador: { nombre: 'Josefa Ríos', cargo: 'Administradora de bases de datos' },
    resumen: 'Una noche dedicada a las bases de datos sin grasa: motores embebidos, archivos que se consultan como tablas y la vieja confiable que corre en cualquier servidor. La pregunta de fondo fue siempre la misma: ¿qué es lo mínimo que resuelve tu problema?',
    aprendimos: ['Un solo archivo puede reemplazar a un servidor completo en muchos proyectos', 'Consultar datos analíticos sin moverlos ahorra horas y dinero', 'Escalar antes de medir es la forma más cara de equivocarse'],
    temas: ['SQLite', 'DuckDB', 'PostgreSQL', 'Índices'],
  },
  {
    slug: 'machine-learning-101', titulo: 'Machine Learning 101', bajada: 'Del dato al modelo, sin fórmulas que asusten.',
    fecha: 'Martes 18 de marzo', motivo: 'red', colores: ['#f29a4a', '#8a3b12'],
    orador: { nombre: 'Diego Fuenzalida', cargo: 'Ingeniero de machine learning' },
    resumen: 'Construimos en vivo un modelo que predice si un café se va a vender o no, y en el camino desarmamos los conceptos que todos nombran y pocos explican: entrenamiento, validación, sobreajuste y sesgo.',
    aprendimos: ['La calidad de los datos importa más que el algoritmo', 'Un modelo que acierta en entrenamiento puede fallar en el mundo real', 'Medir el sesgo es parte del trabajo, no un extra'],
    temas: ['Python', 'scikit-learn', 'Datasets', 'Evaluación'],
  },
  {
    slug: 'scrum-sin-scream', titulo: 'Scrum sin scream', bajada: 'Agilidad sin drama, reuniones eternas ni post-its tristes.',
    fecha: 'Viernes 28 de marzo', motivo: 'tablero', colores: ['#c9a7ff', '#4b2a8a'],
    orador: { nombre: 'Camila Araya', cargo: 'Agile coach' },
    resumen: 'Una conversación honesta sobre por qué tantos equipos odian Scrum y qué hacer al respecto. Revisamos ceremonias que sobran, métricas que mienten y acuerdos simples que devuelven el foco a entregar valor.',
    aprendimos: ['Una daily de quince minutos es un compromiso, no una sugerencia', 'Si la retro no cambia nada, el problema no es la retro', 'Menos trabajo en paralelo significa entregar antes'],
    temas: ['Scrum', 'Kanban', 'Retrospectivas', 'Métricas'],
  },
];
