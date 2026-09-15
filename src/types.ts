export type PlayerPosition =
  | 'Goleiro'
  | 'Zagueiro'
  | 'Lateral Direito'
  | 'Lateral Esquerdo'
  | 'Volante'
  | 'Meio-Campista'
  | 'Meia-Atacante'
  | 'Ponta Esquerda'
  | 'Ponta Direita'
  | 'Centroavante';

export type Foot = 'Destro' | 'Canhoto' | 'Ambidestro';

export type TransferType = 'Transferência' | 'Empréstimo' | 'Retorno de Empréstimo' | 'Fim de Contrato' | 'Promoção da Base';

export interface Transfer {
  id: string;
  date: string;       // YYYY-MM-DD
  fromTeam: string;
  toTeam: string;
  type: TransferType;
  fee: string;        // Valor ou "Sem custos", "Não divulgado"
}

export interface PlayerStats {
  // Atributos de performance (0 a 100)
  pace: number;        // Velocidade
  shooting: number;    // Finalização
  passing: number;     // Passe
  dribbling: number;   // Drible
  defending: number;   // Defesa
  physical: number;    // Físico

  // Estatísticas da temporada atual
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  rating: number;      // Nota média do jogador (e.g. 7.5)
}

export interface Player {
  id: string;
  name: string;
  photo: string;       // String Base64 da imagem
  position: PlayerPosition;
  team: string;
  jerseyNumber: number;
  nationality: string;
  birthDate: string;   // YYYY-MM-DD
  height: number;      // em cm (ex: 185)
  weight: number;      // em kg (ex: 80)
  preferredFoot: Foot;
  description: string; // Descrição detalhada do jogador
  stats: PlayerStats;
  transfers: Transfer[];
  createdAt: number;   // timestamp
}
