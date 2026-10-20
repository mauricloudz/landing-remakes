// Mismos seis peludos del sitio original de 2024, con su ficha completa.
// La personalidad y los rasgos para el test son nuevos.
export type Especie = 'perro' | 'gato';
export interface Peludo {
  id: string;
  nombre: string;
  especie: Especie;
  edad: string;
  genero: 'Macho' | 'Hembra';
  esterilizado: boolean;
  chip: string;
  personalidad: string;
  energia: 'tranquilo' | 'activo';
  espacio: 'depto' | 'casa';
  ilustracion: { pelaje: string; detalle: string; orejas?: 'caidas' | 'paradas'; mancha?: boolean; rayas?: boolean };
}

export const peludos: Peludo[] = [
  { id: 'cachulo', nombre: 'Cachulo', especie: 'perro', edad: '2 meses', genero: 'Macho', esterilizado: false, chip: '2945648128754',
    personalidad: 'Cachorro incansable. Muerde todo lo que encuentra y después pide perdón con la mirada.',
    energia: 'activo', espacio: 'casa', ilustracion: { pelaje: '#c98a4b', detalle: '#f3dcc0', orejas: 'caidas', mancha: true } },
  { id: 'nina', nombre: 'Niña', especie: 'perro', edad: '4 meses', genero: 'Hembra', esterilizado: true, chip: '2945648128726',
    personalidad: 'Curiosa y cariñosa. Aprende rápido y ya sabe sentarse si hay premio de por medio.',
    energia: 'activo', espacio: 'depto', ilustracion: { pelaje: '#3b3333', detalle: '#e9e2da', orejas: 'paradas' } },
  { id: 'flaca', nombre: 'Flaca', especie: 'perro', edad: '1 año', genero: 'Hembra', esterilizado: true, chip: '2945648124951',
    personalidad: 'Tranquila y agradecida. Su plan ideal es una siesta al sol y un paseo corto.',
    energia: 'tranquilo', espacio: 'depto', ilustracion: { pelaje: '#e8d3a8', detalle: '#fff6e6', orejas: 'caidas' } },
  { id: 'ginger', nombre: 'Ginger', especie: 'gato', edad: '3 meses', genero: 'Hembra', esterilizado: false, chip: '2945648125631',
    personalidad: 'Gatita traviesa. Persigue cordones, sombras y cualquier cosa que se mueva.',
    energia: 'activo', espacio: 'depto', ilustracion: { pelaje: '#e2873c', detalle: '#fbe3c8', rayas: true } },
  { id: 'tommy', nombre: 'Tommy', especie: 'gato', edad: '2 años', genero: 'Macho', esterilizado: true, chip: '2945648128525',
    personalidad: 'Relajado y sociable. Ideal si es tu primer gato: se adapta a todo.',
    energia: 'tranquilo', espacio: 'depto', ilustracion: { pelaje: '#8d8f96', detalle: '#eceef2', rayas: true } },
  { id: 'lucifer', nombre: 'Lucifer', especie: 'gato', edad: '1 año', genero: 'Hembra', esterilizado: true, chip: '2945648127846',
    personalidad: 'De diabla no tiene nada. Independiente, pero te espera en la puerta cuando llegas.',
    energia: 'tranquilo', espacio: 'casa', ilustracion: { pelaje: '#26222a', detalle: '#4a4350' } },
];

export const equipo = [
  { nombre: 'Rafaela Valdez', rol: 'Presidenta', texto: 'Fundó la ONG después de rescatar a su primer perro de la calle.', color: 'var(--marca)' },
  { nombre: 'Mario José Peña', rol: 'Veterinario', texto: 'Revisa, vacuna y acompaña a cada peludo hasta que está listo.', color: 'var(--acento)' },
  { nombre: 'Juan Pérez', rol: 'Voluntario', texto: 'Coordina los paseos de fin de semana y las jornadas de adopción.', color: 'var(--ciruela)' },
  { nombre: 'José Concha', rol: 'Transporte', texto: 'Lleva a los peludos al veterinario y a su nuevo hogar.', color: '#b7791f' },
];
