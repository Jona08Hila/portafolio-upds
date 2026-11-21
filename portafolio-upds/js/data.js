export const GAMES_DATA = [
  {
    id: 'bt3',
    category: 'bt3',
    title: 'Dragon Ball Z: Budokai Tenkaichi 3',
    genre: 'Combate Arena 3D',
    detail: 'Combos cancelados, teletransportacion y batallas clasicas.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=75'
  },
  {
    id: 'clash',
    category: 'clash',
    title: 'Clash Royale',
    genre: 'Estrategia en Tiempo Real',
    detail: 'Gestion de elixir, ciclos rapidos y control de arena.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=75'
  },
  {
    id: 'brawl',
    category: 'brawl',
    title: 'Brawl Stars',
    genre: 'Accion Multijugador 3v3',
    detail: 'Posicionamiento tactico, control de zona y trabajo en equipo.',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=75'
  },
  {
    id: 'legends',
    category: 'legends',
    title: 'Dragon Ball Legends',
    genre: 'Accion PvP Movil',
    detail: 'Cartas de arte, esquiva perfecta y equipos de Dragon Ball.',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=600&q=75'
  }
];

export const TRACKS_DATA = [
  {
    id: 'track-onigami',
    category: 'anime',
    title: 'Tema de Onigami / Beerus',
    artist: 'Dragon Ball Super OST',
    duration: '03:18',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Dragon+Ball+Super+Beerus+theme',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=75',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'track-chala',
    category: 'anime',
    title: 'Cha-La Head-Cha-La',
    artist: 'Hironobu Kageyama - DBZ',
    duration: '03:20',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Cha+La+Head+Cha+La+Dragon+Ball+Z',
    bgImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=900&q=75',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'track-synth',
    category: 'electronica',
    title: 'Cybernetic Pulse',
    artist: 'Electronic Synthwave',
    duration: '04:05',
    youtubeUrl: 'https://www.youtube.com/results?search_query=electronic+synthwave+mix',
    bgImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=900&q=75',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 'track-bass',
    category: 'electronica',
    title: 'Midnight Bassline',
    artist: 'Progressive Electro',
    duration: '03:42',
    youtubeUrl: 'https://www.youtube.com/results?search_query=progressive+electro+music',
    bgImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=75',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4'
  }
];

export const ROUTINE_DATA = [
  {
    id: 'rut-1',
    day: 'lun',
    schedule: '08:00 - 11:00',
    area: 'UPDS - DISENO WEB 2',
    title: 'Clases UPDS y Practica Frontend',
    detail: 'Arquitectura modular, Flexbox sin scroll y Service Workers.'
  },
  {
    id: 'rut-2',
    day: 'mie',
    schedule: '14:00 - 16:30',
    area: 'DESARROLLO WEB',
    title: 'Laboratorio JavaScript y Seguridad',
    detail: 'Delegacion de eventos, validaciones y optimizacion PWA.'
  },
  {
    id: 'rut-3',
    day: 'vie',
    schedule: '17:00 - 19:00',
    area: 'FUTBOL',
    title: 'Entrenamiento y Partido de Futbol',
    detail: 'Resistencia, pase tactico y descanso activo.'
  }
];

export const GALLERY_DATA = [
  {
    id: 'slide-1',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80',
    caption: 'Futbol: Disciplina tactica, velocidad y trabajo en equipo.'
  },
  {
    id: 'slide-2',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    caption: 'Paisaje Natural: Enfoque mental y equilibrio diario.'
  },
  {
    id: 'slide-3',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    caption: 'Tecnologia y Sistemas: Desarrollo web en la UPDS.'
  }
];

export async function fetchPortfolioPayload() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        games: GAMES_DATA,
        tracks: TRACKS_DATA,
        routine: ROUTINE_DATA,
        gallery: GALLERY_DATA
      });
    }, 100);
  });
}