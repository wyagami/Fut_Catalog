import React, { useState, useEffect } from 'react';
import { Player, PlayerPosition, Foot, Transfer, TransferType } from '../types';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Sliders, 
  User, 
  Milestone, 
  CheckCircle, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface PlayerFormProps {
  playerToEdit?: Player | null;
  onSave: (player: Player) => void;
  onCancel: () => void;
}

const POSITIONS: PlayerPosition[] = [
  'Goleiro',
  'Zagueiro',
  'Lateral Direito',
  'Lateral Esquerdo',
  'Volante',
  'Meio-Campista',
  'Meia-Atacante',
  'Ponta Esquerda',
  'Ponta Direita',
  'Centroavante'
];

const PREFERRED_FEET: Foot[] = ['Destro', 'Canhoto', 'Ambidestro'];

const TRANSFER_TYPES: TransferType[] = [
  'Promoção da Base',
  'Transferência',
  'Empréstimo',
  'Retorno de Empréstimo',
  'Fim de Contrato'
];

// Imagens padrão convertidas em SVG ou base64 simples estruturados de alta performance para avatar
const DEFAULT_AVATARS = {
  Goleiro: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%231e293b"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%2338bdf8"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%230284c7"/><rect x="42" y="5" width="16" height="12" rx="4" fill="%23fbbf24"/></svg>`,
  Zagueiro: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%230f172a"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%2322c55e"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%2315803d"/><path d="M42 5l16 4-8 12z" fill="%23f97316"/></svg>`,
  'Lateral Direito': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%230f172a"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%2322c55e"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%2315803d"/><path d="M42 5l16 4-8 12z" fill="%23f97316"/></svg>`,
  'Lateral Esquerdo': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%230f172a"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%2322c55e"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%2315803d"/><path d="M42 5l16 4-8 12z" fill="%23f97316"/></svg>`,
  Volante: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%231e1b4b"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%236366f1"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%234f46e5"/><path d="M35 10h30v4H35z" fill="%23a855f7"/></svg>`,
  'Meio-Campista': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%231e1b4b"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%236366f1"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%234f46e5"/><path d="M35 10h30v4H35z" fill="%23a855f7"/></svg>`,
  'Meia-Atacante': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%231e1b4b"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%236366f1"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%234f46e5"/><path d="M35 10h30v4H35z" fill="%23a855f7"/></svg>`,
  'Ponta Esquerda': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%23451a03"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%23f97316"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%23ea580c"/><circle cx="50" cy="12" r="6" fill="%23e11d48"/></svg>`,
  'Ponta Direita': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%23451a03"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%23f97316"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%23ea580c"/><circle cx="50" cy="12" r="6" fill="%23e11d48"/></svg>`,
  Centroavante: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="50" fill="%23451a03"/><path d="M50 25c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z" fill="%23f97316"/><path d="M50 60c-16.569 0-30 11.193-30 25h60c0-13.807-13.431-25-30-25z" fill="%23ea580c"/><circle cx="50" cy="12" r="6" fill="%23e11d48"/></svg>`
};

export default function PlayerForm({ playerToEdit, onSave, onCancel }: PlayerFormProps) {
  const [activeTab, setActiveTab] = useState<'pessoal' | 'atributos' | 'transferencias'>('pessoal');

  // Dados Básicos do Atleta
  const [name, setName] = useState('');
  const [position, setPosition] = useState<PlayerPosition>('Meio-Campista');
  const [team, setTeam] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<number>(10);
  const [nationality, setNationality] = useState('Brasil');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [height, setHeight] = useState<number>(180);
  const [weight, setWeight] = useState<number>(75);
  const [preferredFoot, setPreferredFoot] = useState<Foot>('Destro');
  const [photo, setPhoto] = useState('');
  const [description, setDescription] = useState('');

  // Atributos de Scouting (0-100)
  const [pace, setPace] = useState<number>(75);
  const [shooting, setShooting] = useState<number>(70);
  const [passing, setPassing] = useState<number>(75);
  const [dribbling, setDribbling] = useState<number>(78);
  const [defending, setDefending] = useState<number>(50);
  const [physical, setPhysical] = useState<number>(70);

  // Estatísticas de Temporada
  const [matchesPlayed, setMatchesPlayed] = useState<number>(0);
  const [goals, setGoals] = useState<number>(0);
  const [assists, setAssists] = useState<number>(0);
  const [yellowCards, setYellowCards] = useState<number>(0);
  const [redCards, setRedCards] = useState<number>(0);
  const [minutesPlayed, setMinutesPlayed] = useState<number>(0);
  const [rating, setRating] = useState<number>(7.0);

  // Histórico de Transferências Registradas
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  // Sub-Form de Adicionar Nova Transferência
  const [newTrDate, setNewTrDate] = useState('2025-01-01');
  const [newTrFrom, setNewTrFrom] = useState('');
  const [newTrTo, setNewTrTo] = useState('');
  const [newTrType, setNewTrType] = useState<TransferType>('Transferência');
  const [newTrFee, setNewTrFee] = useState('Sem custos');

  const [dragActive, setDragActive] = useState(false);

  // Efeito - Carregar dados de edição se houver
  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setPosition(playerToEdit.position);
      setTeam(playerToEdit.team);
      setJerseyNumber(playerToEdit.jerseyNumber);
      setNationality(playerToEdit.nationality);
      setBirthDate(playerToEdit.birthDate || '2000-01-01');
      setHeight(playerToEdit.height);
      setWeight(playerToEdit.weight);
      setPreferredFoot(playerToEdit.preferredFoot);
      setPhoto(playerToEdit.photo);
      setDescription(playerToEdit.description || '');

      // Stats
      setPace(playerToEdit.stats.pace);
      setShooting(playerToEdit.stats.shooting);
      setPassing(playerToEdit.stats.passing);
      setDribbling(playerToEdit.stats.dribbling);
      setDefending(playerToEdit.stats.defending);
      setPhysical(playerToEdit.stats.physical);

      // Metricas temporada
      setMatchesPlayed(playerToEdit.stats.matchesPlayed);
      setGoals(playerToEdit.stats.goals);
      setAssists(playerToEdit.stats.assists);
      setYellowCards(playerToEdit.stats.yellowCards);
      setRedCards(playerToEdit.stats.redCards);
      setMinutesPlayed(playerToEdit.stats.minutesPlayed);
      setRating(playerToEdit.stats.rating);

      // Transfers
      setTransfers(playerToEdit.transfers || []);
    } else {
      // Se for novo jogador, sugerir o avatar correto de acordo com a posição inicial
      setPhoto(DEFAULT_AVATARS['Meio-Campista']);
    }
  }, [playerToEdit]);

  // Atualizar foto padrão se a foto atual for um dos avatares padrão e mudarmos a posição
  useEffect(() => {
    if (!playerToEdit && Object.values(DEFAULT_AVATARS).includes(photo)) {
      setPhoto(DEFAULT_AVATARS[position]);
    }
  }, [position]);

  // Converter arquivo carregado em Base64
  const processFile = (file: File) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Por favor, carregue uma imagem menor que 3MB para garantir alta performance no LocalDB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Adicionar Transferência temporariamente na lista local do jogador
  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrFrom.trim() || !newTrTo.trim()) {
      alert('Por favor, preencha os clubes de Origem e Destino do registro.');
      return;
    }

    const t: Transfer = {
      id: `local_tr_${Date.now()}`,
      date: newTrDate,
      fromTeam: newTrFrom.trim(),
      toTeam: newTrTo.trim(),
      type: newTrType,
      fee: newTrFee.trim() || 'Sem custos'
    };

    setTransfers([t, ...transfers]);
    
    // reset do mini formulário
    setNewTrFrom('');
    setNewTrTo('');
    setNewTrFee('Sem custos');
  };

  // Remover transferência
  const handleRemoveTransfer = (trId: string) => {
    setTransfers(transfers.filter(t => t.id !== trId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, defina o nome do jogador de futebol.');
      return;
    }
    if (!team.trim()) {
      alert('Por favor, insira o time atual do jogador.');
      return;
    }

    const compiledPlayer: Player = {
      id: playerToEdit ? playerToEdit.id : `player_${Date.now()}`,
      name: name.trim(),
      photo: photo || DEFAULT_AVATARS[position],
      position,
      team: team.trim(),
      jerseyNumber: Number(jerseyNumber) || 99,
      nationality: nationality.trim() || 'Brasil',
      birthDate,
      height: Number(height) || 180,
      weight: Number(weight) || 75,
      preferredFoot,
      description: description.trim(),
      stats: {
        pace: Number(pace),
        shooting: Number(shooting),
        passing: Number(passing),
        dribbling: Number(dribbling),
        defending: Number(defending),
        physical: Number(physical),
        matchesPlayed: Number(matchesPlayed),
        goals: Number(goals),
        assists: Number(assists),
        yellowCards: Number(yellowCards),
        redCards: Number(redCards),
        minutesPlayed: Number(minutesPlayed),
        rating: Number(rating)
      },
      transfers,
      createdAt: playerToEdit ? playerToEdit.createdAt : Date.now()
    };

    onSave(compiledPlayer);
  };

  // Auto-ajuste de descrição inteligente caso queira uma ajuda com a IA nas notas do jogador
  const handleResetPhoto = () => {
    setPhoto(DEFAULT_AVATARS[position]);
  };

  return (
    <div id="player-editor-modal-container" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
      
      {/* Header do Form */}
      <div className="bg-slate-950 p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            {playerToEdit ? `Modificar Perfil: ${playerToEdit.name}` : 'Cadastrar Novo Atleta no Catálogo'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Preencha a ficha técnica, os atributos de performance e o histórico oficial de transações.
          </p>
        </div>
        <button 
          id="btn-close-form"
          onClick={onCancel}
          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navegação de Abas do Formulário */}
      <div className="bg-slate-950/45 px-6 border-b border-slate-800 flex flex-wrap gap-2">
        <button
          id="tab-pessoal"
          type="button"
          onClick={() => setActiveTab('pessoal')}
          className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'pessoal' 
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/40' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" /> 1. Ficha Técnica e Biografia
        </button>

        <button
          id="tab-atributos"
          type="button"
          onClick={() => setActiveTab('atributos')}
          className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'atributos' 
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/40' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" /> 2. Notas de Jogo e Estatísticas
        </button>

        <button
          id="tab-transferencias"
          type="button"
          onClick={() => setActiveTab('transferencias')}
          className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'transferencias' 
              ? 'border-emerald-500 text-emerald-400 bg-slate-900/40' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Milestone className="w-4 h-4" /> 3. Histórico de Transferências ({transfers.length})
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        
        {/* ABA 1: REGISTRO DADOS PESSOAIS */}
        {activeTab === 'pessoal' && (
          <div className="space-y-6">
            
            {/* Foto e Upload Drag-and-Drop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                  Foto do Jogador
                </label>
                
                <div className="flex flex-col items-center gap-3 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                    <img 
                      src={photo} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex gap-2 w-full justify-center">
                    <button
                      id="btn-reset-avatar"
                      type="button"
                      onClick={handleResetPhoto}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Usar Padrão
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                  Substituir Foto / Upload de Imagem (LocalDB)
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${
                    dragActive 
                      ? 'border-emerald-500 bg-emerald-500/5' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <Upload className="w-8 h-8 text-slate-500" />
                  <div className="text-center">
                    <p className="text-sm text-slate-300 font-medium">
                      Arraste e solte o arquivo de imagem aqui
                    </p>
                    <p className="text-xs text-slate-550 mt-1">
                      Ou clique para navegar (Suporta PNG, JPG até 3MB)
                    </p>
                  </div>
                  
                  <label className="cursor-pointer py-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-805 transition-all">
                    Selecionar Arquivo
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

            </div>

            {/* Inputs de Informação Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Nome Completo</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Neymar da Silva Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm tracking-wide transition-colors outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Posição Favorita</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm transition-colors outline-none cursor-pointer"
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Time / Clube Atual</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Real Madrid"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm transition-colors outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Número da Camisa</label>
                <input 
                  type="number"
                  min="1"
                  max="99"
                  required
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm transition-colors outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Nacionalidade</label>
                <input 
                  type="text"
                  placeholder="Ex: Brasil"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm transition-colors outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Data de Nascimento</label>
                <input 
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800Sub focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm transition-colors outline-none font-mono cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Altura (em centímetros)</label>
                <input 
                  type="number"
                  placeholder="Ex: 185"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm transition-colors outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Peso (em quilogramas)</label>
                <input 
                  type="number"
                  placeholder="Ex: 78"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm transition-colors outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase block">Pé Preferencial</label>
                <select
                  value={preferredFoot}
                  onChange={(e) => setPreferredFoot(e.target.value as Foot)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 rounded-xl text-slate-100 text-sm transition-colors outline-none cursor-pointer"
                >
                  {PREFERRED_FEET.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Narrativa / Descrição Biográfica e Tática (Conforme imagem requisitado) */}
            <div id="narrativa-scout-box" className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Descrição do Atleta e Relatório de Observação Tática
                </label>
                <span className="text-[10px] text-slate-500 italic">Mínimo de detalhes técnicos altamente recomendado</span>
              </div>
              <textarea
                rows={5}
                placeholder="Descreva as principais qualidades de drible, passes, ritmo, consistência tática, inteligência emocional e notas de observação do agente sobre a carreira atual e futuro desse atleta no mercado de transferências..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-5 py-4 rounded-2xl text-slate-200 text-sm leading-relaxed transition-colors outline-none font-sans"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="btn-next-tab-pessoal"
                type="button"
                onClick={() => setActiveTab('atributos')}
                className="flex items-center gap-1 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Continuar para Atributos e Estatísticas <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ABA 2: REGISTRO ATRIBUTOS DE PERFORMANCE E ESTATÍSTICAS */}
        {activeTab === 'atributos' && (
          <div className="space-y-8">
            
            {/* Bloco de Sliders 0-100 (Atributos de Scouting) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" /> Atributos Técnicos e Físicos de Desempenho (0 a 100)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 bg-slate-950/40 p-6 rounded-2xl border border-slate-800">
                {/* PACE */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Ritmo / Velocidade (RIT)</span>
                    <span className="font-bold text-emerald-400 font-mono">{pace}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={pace} onChange={(e) => setPace(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* SHOOTING */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Finalização / Chute (FIN)</span>
                    <span className="font-bold text-emerald-400 font-mono">{shooting}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={shooting} onChange={(e) => setShooting(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* PASSING */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Capacidade de Passe (PAS)</span>
                    <span className="font-bold text-emerald-400 font-mono">{passing}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={passing} onChange={(e) => setPassing(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* DRIBBLING */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Habilidade / Drible (DRI)</span>
                    <span className="font-bold text-emerald-400 font-mono">{dribbling}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={dribbling} onChange={(e) => setDribbling(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* DEFENDING */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Atitude Defensiva (DEF)</span>
                    <span className="font-bold text-emerald-400 font-mono">{defending}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={defending} onChange={(e) => setDefending(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* PHYSICAL */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Físico / Combatividade (FIS)</span>
                    <span className="font-bold text-emerald-400 font-mono">{physical}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={physical} onChange={(e) => setPhysical(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Estatísticas Numéricas da Temporada */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Estatísticas Oficiais na Temporada Atual
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block font-medium">Partidas Jogadas</label>
                  <input 
                    type="number" min="0" 
                    value={matchesPlayed} onChange={(e) => setMatchesPlayed(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 px-3 py-2 rounded-xl text-slate-100 text-sm font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block font-medium">Gols Marcados</label>
                  <input 
                    type="number" min="0" 
                    value={goals} onChange={(e) => setGoals(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 px-3 py-2 rounded-xl text-slate-100 text-sm font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block font-medium">Assistências</label>
                  <input 
                    type="number" min="0" 
                    value={assists} onChange={(e) => setAssists(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 px-3 py-2 rounded-xl text-slate-100 text-sm font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block font-medium">Nota Média (0.0 a 10.0)</label>
                  <input 
                    type="number" min="0" max="100" step="0.1"
                    value={rating} onChange={(e) => setRating(Math.max(0, Math.min(10, Number(e.target.value))))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 px-3 py-2 rounded-xl text-slate-100 text-sm font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block font-medium">Cartões Amarelos</label>
                  <input 
                    type="number" min="0" 
                    value={yellowCards} onChange={(e) => setYellowCards(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 px-3 py-2 rounded-xl text-slate-100 text-sm font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block font-medium">Cartões Vermelhos</label>
                  <input 
                    type="number" min="0" 
                    value={redCards} onChange={(e) => setRedCards(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 px-3 py-2 rounded-xl text-slate-100 text-sm font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs text-slate-400 block font-medium">Minutos Oficiais em Campo</label>
                  <input 
                    type="number" min="0" 
                    value={minutesPlayed} onChange={(e) => setMinutesPlayed(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 px-3 py-2 rounded-xl text-slate-100 text-sm font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                id="btn-back-tab-pessoal"
                type="button"
                onClick={() => setActiveTab('pessoal')}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Voltar para Dados Gerais
              </button>
              
              <button
                id="btn-next-tab-atributos"
                type="button"
                onClick={() => setActiveTab('transferencias')}
                className="flex items-center gap-1 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Seguir para Transferências <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ABA 3: HISTÓRICO DE TRANSFERÊNCIAS DETALHADO */}
        {activeTab === 'transferencias' && (
          <div className="space-y-6">
            
            {/* Caixa Subform de Registro de Transferência */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Milestone className="w-4.5 h-4.5 text-emerald-400" />
                Registrar Movimento de Carreira / Transação
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 block font-medium uppercase">Data do Registro</label>
                  <input 
                    type="date"
                    value={newTrDate}
                    onChange={(e) => setNewTrDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 px-3 py-1.5 rounded-xl text-slate-200 text-xs font-mono outline-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 block font-medium uppercase">Tipo de Movimento</label>
                  <select
                    value={newTrType}
                    onChange={(e) => setNewTrType(e.target.value as TransferType)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 px-3 py-1.5 rounded-xl text-slate-200 text-xs outline-none cursor-pointer"
                  >
                    {TRANSFER_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 block font-medium uppercase">Custo / Valor</label>
                  <input 
                    type="text"
                    placeholder="Ex: € 45M ou Sem custos"
                    value={newTrFee}
                    onChange={(e) => setNewTrFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 px-3 py-1.5 rounded-xl text-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 block font-medium uppercase">Clube Anterior (Origem)</label>
                  <input 
                    type="text"
                    placeholder="Ex: Flamengo"
                    value={newTrFrom}
                    onChange={(e) => setNewTrFrom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 px-3 py-1.5 rounded-xl text-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 block font-medium uppercase">Novo Clube (Destino)</label>
                  <input 
                    type="text"
                    placeholder="Ex: Real Madrid"
                    value={newTrTo}
                    onChange={(e) => setNewTrTo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 px-3 py-1.5 rounded-xl text-slate-200 text-xs outline-none"
                  />
                </div>

                <button
                  id="btn-add-transfer-item"
                  type="button"
                  onClick={handleAddTransfer}
                  className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-bold text-xs rounded-xl tracking-wide flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Incluir Histórico
                </button>
              </div>
            </div>

            {/* Listagem Parcial de Linhas do Histórico Cadastradas */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Histórico Temporário Compilado ({transfers.length})
              </h4>

              {transfers.length === 0 ? (
                <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/20 text-xs">
                  Ainda sem transações catalogadas. Insira os dados acima para montar a linha do tempo da carreira do atleta.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {transfers.map((tr) => (
                    <div 
                      key={tr.id} 
                      className="bg-slate-950/80 border border-slate-850 p-3 rounded-xl flex items-center justify-between gap-4 hover:border-slate-800 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-500">{tr.date.split('-').reverse().join('/')}</span>
                          <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 font-semibold">{tr.type}</span>
                          <span className="text-amber-500 font-bold font-mono text-xs">{tr.fee}</span>
                        </div>
                        <p className="text-slate-300 text-xs font-medium truncate mt-1">
                          {tr.fromTeam} → <span className="text-slate-100 font-semibold">{tr.toTeam}</span>
                        </p>
                      </div>

                      <button
                        id={`btn-remove-tr-${tr.id}`}
                        type="button"
                        onClick={() => handleRemoveTransfer(tr.id)}
                        className="p-1 text-slate-500 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Remover Transação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botões de Ação do formulário geral */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
              <button
                id="btn-back-tab-atributos"
                type="button"
                onClick={() => setActiveTab('atributos')}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Voltar para Atributos
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  id="btn-cancel-scout-form"
                  type="button"
                  onClick={onCancel}
                  className="py-2.5 px-5 bg-transparent hover:text-slate-200 text-slate-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Descartar
                </button>

                <button
                  id="btn-submit-scout-form"
                  type="submit"
                  className="flex items-center gap-1 py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-95 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Salvar Ficha no Catálogo
                </button>
              </div>
            </div>

          </div>
        )}

      </form>
    </div>
  );
}
