import { Player } from '../types';

const DB_NAME = 'futcatalog_db';
const DB_VERSION = 2;
const STORE_NAME = 'players';

// Imagens padrão convertidas em SVG ou base64 simples estruturados de alta performance para avatar
const MOCK_AVATARS = {
  goleiro: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%231e293b"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%2338bdf8"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%230284c7"/><rect x="42" y="5" width="16" height="12" rx="4" fill="%23fbbf24"/></svg>`,
  defesa: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%230f172a"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%2322c55e"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%2315803d"/><path d="M42 5l16 4-8 12z" fill="%23f97316"/></svg>`,
  meio: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%231e1b4b"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%236366f1"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%234f46e5"/><path d="M35 10h30v4H35z" fill="%23a855f7"/></svg>`,
  ataque: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%23451a03"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%23f97316"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%23ea580c"/><circle cx="50" cy="12" r="6" fill="%23e11d48"/></svg>`,
};

const DEFAULT_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Alisson Becker',
    photo: MOCK_AVATARS.goleiro,
    position: 'Goleiro',
    team: 'Liverpool FC',
    jerseyNumber: 1,
    nationality: 'Brasil',
    birthDate: '1992-10-02',
    height: 193,
    weight: 91,
    preferredFoot: 'Destro',
    description: 'Um dos goleiros mais consistentes do mundo. Alisson é conhecido pela excelência em situações de um contra um, saídas de bola refinadas com os pés, alto comando de área e capacidade de fazer defesas cruciais sob forte pressão.',
    stats: {
      pace: 55,
      shooting: 21,
      passing: 85,
      dribbling: 60,
      defending: 90,
      physical: 84,
      matchesPlayed: 32,
      goals: 0,
      assists: 1,
      yellowCards: 1,
      redCards: 0,
      minutesPlayed: 2880,
      rating: 8.4
    },
    transfers: [
      {
        id: 't1_1',
        date: '2013-01-01',
        fromTeam: 'Internacional (Base)',
        toTeam: 'Internacional',
        type: 'Promoção da Base',
        fee: 'Sem custos'
      },
      {
        id: 't1_2',
        date: '2016-07-01',
        fromTeam: 'Internacional',
        toTeam: 'AS Roma',
        type: 'Transferência',
        fee: '€ 8.0M'
      },
      {
        id: 't1_3',
        date: '2018-07-19',
        fromTeam: 'AS Roma',
        toTeam: 'Liverpool FC',
        type: 'Transferência',
        fee: '€ 62.5M'
      }
    ],
    createdAt: Date.now() - 5000
  },
  {
    id: '2',
    name: 'Marquinhos',
    photo: MOCK_AVATARS.defesa,
    position: 'Zagueiro',
    team: 'Paris Saint-Germain',
    jerseyNumber: 5,
    nationality: 'Brasil',
    birthDate: '1994-05-14',
    height: 183,
    weight: 79,
    preferredFoot: 'Destro',
    description: 'Defensor veloz, ágil e altamente técnico. Marquinhos lidera o sistema defensivo do PSG com sua excelente leitura tática, interceptações cirúrgicas e jogo aéreo fortíssimo, apesar de não ser um zagueiro de extrema estatura fisica.',
    stats: {
      pace: 79,
      shooting: 54,
      passing: 78,
      dribbling: 71,
      defending: 88,
      physical: 82,
      matchesPlayed: 28,
      goals: 2,
      assists: 1,
      yellowCards: 3,
      redCards: 0,
      minutesPlayed: 2420,
      rating: 7.9
    },
    transfers: [
      {
        id: 't2_1',
        date: '2012-01-01',
        fromTeam: 'Corinthians (Base)',
        toTeam: 'Corinthians',
        type: 'Promoção da Base',
        fee: 'Sem custos'
      },
      {
        id: 't2_2',
        date: '2012-08-21',
        fromTeam: 'Corinthians',
        toTeam: 'AS Roma',
        type: 'Empréstimo',
        fee: '€ 1.5M'
      },
      {
        id: 't2_3',
        date: '2013-01-01',
        fromTeam: 'AS Roma',
        toTeam: 'AS Roma',
        type: 'Transferência',
        fee: '€ 5.7M'
      },
      {
        id: 't2_4',
        date: '2013-07-19',
        fromTeam: 'AS Roma',
        toTeam: 'Paris Saint-Germain',
        type: 'Transferência',
        fee: '€ 31.4M'
      }
    ],
    createdAt: Date.now() - 4000
  },
  {
    id: '3',
    name: 'Casemiro',
    photo: MOCK_AVATARS.meio,
    position: 'Volante',
    team: 'Manchester United',
    jerseyNumber: 18,
    nationality: 'Brasil',
    birthDate: '1992-02-23',
    height: 185,
    weight: 84,
    preferredFoot: 'Destro',
    description: 'Um dos maiores meio-campistas defensivos da última década. Casemiro alia força física avantajada com brio tático impecável. Se destaca pela destruição de jogadas, distribuição de passes longos precisos e finalização potente de fora da área.',
    stats: {
      pace: 63,
      shooting: 73,
      passing: 75,
      dribbling: 72,
      defending: 87,
      physical: 89,
      matchesPlayed: 29,
      goals: 4,
      assists: 3,
      yellowCards: 8,
      redCards: 1,
      minutesPlayed: 2350,
      rating: 8.1
    },
    transfers: [
      {
        id: 't3_1',
        date: '2010-01-01',
        fromTeam: 'São Paulo (Base)',
        toTeam: 'São Paulo',
        type: 'Promoção da Base',
        fee: 'Sem custos'
      },
      {
        id: 't3_2',
        date: '2013-01-31',
        fromTeam: 'São Paulo',
        toTeam: 'Real Madrid Castilla',
        type: 'Empréstimo',
        fee: 'Sem custos'
      },
      {
        id: 't3_3',
        date: '2013-07-01',
        fromTeam: 'Real Madrid Castilla',
        toTeam: 'Real Madrid',
        type: 'Transferência',
        fee: '€ 6.0M'
      },
      {
        id: 't3_4',
        date: '2014-07-03',
        fromTeam: 'Real Madrid',
        toTeam: 'Porto',
        type: 'Empréstimo',
        fee: 'Sem custos'
      },
      {
        id: 't3_5',
        date: '2015-06-01',
        fromTeam: 'Porto',
        toTeam: 'Real Madrid',
        type: 'Retorno de Empréstimo',
        fee: '€ 7.5M (Cláusula de Recompra)'
      },
      {
        id: 't3_6',
        date: '2022-08-22',
        fromTeam: 'Real Madrid',
        toTeam: 'Manchester United',
        type: 'Transferência',
        fee: '€ 70.0M'
      }
    ],
    createdAt: Date.now() - 3000
  },
  {
    id: '4',
    name: 'Neymar Jr',
    photo: MOCK_AVATARS.meio,
    position: 'Meia-Atacante',
    team: 'Al-Hilal',
    jerseyNumber: 10,
    nationality: 'Brasil',
    birthDate: '1992-02-05',
    height: 175,
    weight: 68,
    preferredFoot: 'Ambidestro',
    description: 'Um construtor de jogadas de classe mundial que combina habilidades extraordinárias de improvisação, visão de jogo aguçada, dribles desorientadores e cobranças de faltas mortais. É a principal referência técnica de sua geração.',
    stats: {
      pace: 82,
      shooting: 83,
      passing: 88,
      dribbling: 93,
      defending: 37,
      physical: 61,
      matchesPlayed: 14,
      goals: 8,
      assists: 9,
      yellowCards: 2,
      redCards: 0,
      minutesPlayed: 1120,
      rating: 8.7
    },
    transfers: [
      {
        id: 't4_1',
        date: '2009-01-01',
        fromTeam: 'Santos FC (Base)',
        toTeam: 'Santos FC',
        type: 'Promoção da Base',
        fee: 'Sem custos'
      },
      {
        id: 't4_2',
        date: '2013-05-24',
        fromTeam: 'Santos FC',
        toTeam: 'FC Barcelona',
        type: 'Transferência',
        fee: '€ 88.2M'
      },
      {
        id: 't4_3',
        date: '2017-08-03',
        fromTeam: 'FC Barcelona',
        toTeam: 'Paris Saint-Germain',
        type: 'Transferência',
        fee: '€ 222.0M (Recorde Mundial)'
      },
      {
        id: 't4_4',
        date: '2023-08-15',
        fromTeam: 'Paris Saint-Germain',
        toTeam: 'Al-Hilal',
        type: 'Transferência',
        fee: '€ 90.0M'
      }
    ],
    createdAt: Date.now() - 2000
  },
  {
    id: '5',
    name: 'Vinícius Júnior',
    photo: MOCK_AVATARS.ataque,
    position: 'Ponta Esquerda',
    team: 'Real Madrid',
    jerseyNumber: 7,
    nationality: 'Brasil',
    birthDate: '2000-07-12',
    height: 176,
    weight: 73,
    preferredFoot: 'Destro',
    description: 'Um velocista letal e um dribleador imparável que se consolidou como um dos melhores ponteiros do futebol europeu. Muito decisivo, agressivo e protagonista nos jogos de grande relevância e finais de Champions League pelo Real Madrid.',
    stats: {
      pace: 97,
      shooting: 84,
      passing: 80,
      dribbling: 94,
      defending: 29,
      physical: 68,
      matchesPlayed: 34,
      goals: 21,
      assists: 11,
      yellowCards: 6,
      redCards: 0,
      minutesPlayed: 2750,
      rating: 9.1
    },
    transfers: [
      {
        id: 't5_1',
        date: '2017-01-01',
        fromTeam: 'Flamengo (Base)',
        toTeam: 'Flamengo',
        type: 'Promoção da Base',
        fee: 'Sem custos'
      },
      {
        id: 't5_2',
        date: '2018-07-12',
        fromTeam: 'Flamengo',
        toTeam: 'Real Madrid',
        type: 'Transferência',
        fee: '€ 45.0M'
      }
    ],
    createdAt: Date.now() - 1000
  }
];

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Erro ao abrir o IndexedDB');
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('position', 'position', { unique: false });
        store.createIndex('team', 'team', { unique: false });
      }
    };
  });
}

export async function getAllPlayers(): Promise<Player[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = async () => {
      let players = request.result as Player[];
      if (players.length === 0) {
        // Inicializar com jogadores mockados apenas se o banco estiver vazio
        console.log('Preenchendo LocalDB com jogadores iniciais...');
        await seedDefaultPlayers(db);
        const secondTransaction = db.transaction(STORE_NAME, 'readonly');
        const secondStore = secondTransaction.objectStore(STORE_NAME);
        const secondRequest = secondStore.getAll();
        secondRequest.onsuccess = () => {
          resolve(secondRequest.result as Player[]);
        };
        secondRequest.onerror = () => reject(secondRequest.error);
      } else {
        // Ordenar por data de criação / mais novos primeiro
        players.sort((a, b) => b.createdAt - a.createdAt);
        resolve(players);
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

function seedDefaultPlayers(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    DEFAULT_PLAYERS.forEach((player) => {
      store.add(player);
    });

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}

export async function savePlayer(player: Player): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(player);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deletePlayer(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function importBackupAndOverwrite(players: Player[]): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const clearRequest = store.clear();
    
    clearRequest.onsuccess = () => {
      players.forEach((player) => {
        store.add(player);
      });
    };
    
    transaction.oncomplete = () => {
      resolve();
    };
    
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}
