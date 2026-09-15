import React, { useState, useEffect } from 'react';
import { Player, PlayerPosition } from './types';
import { getAllPlayers, savePlayer, deletePlayer, importBackupAndOverwrite } from './lib/indexedDB';
import { generateScoutReportPDF } from './lib/pdfGenerator';
import PlayerCard from './components/PlayerCard';
import PlayerDetails from './components/PlayerDetails';
import PlayerForm from './components/PlayerForm';
import PlayerZoomModal from './components/PlayerZoomModal';
import { 
  Users, 
  Search, 
  MapPin, 
  Plus, 
  Download, 
  Calendar, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  SlidersHorizontal,
  Compass,
  FileText,
  Database,
  Upload
} from 'lucide-react';

const POSITIONS: string[] = [
  'Todos',
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

export default function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros e Pesquisas
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('Todos');
  const [selectedTeam, setSelectedTeam] = useState<string>('Todos');

  // Estados de telas auxiliares
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [zoomingPlayer, setZoomingPlayer] = useState<Player | null>(null);
  const [backupPlayersToImport, setBackupPlayersToImport] = useState<Player[] | null>(null);
  const [backupAlert, setBackupAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Carregar dados no boot
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const data = await getAllPlayers();
      setPlayers(data);
    } catch (e) {
      console.error('Erro ao ler LocalDB:', e);
    } finally {
      setLoading(false);
    }
  };

  // Coleta lista dinâmica de times para o filtro dropdown
  const uniqueTeams = Array.from(new Set(players.map(p => p.team))).filter(Boolean).sort();

  // Salvar jogador novo ou editado
  const handleSavePlayer = async (player: Player) => {
    try {
      await savePlayer(player);
      await loadCatalog(); // reload
      
      // se estivesse editando o jogador ativo visualizado, atualizar o estado dele
      if (viewingPlayer && viewingPlayer.id === player.id) {
        setViewingPlayer(player);
      }
      
      // fechar formulários
      setIsCreating(false);
      setEditingPlayer(null);
    } catch (e) {
      console.error('Falha ao salvar atleta:', e);
      alert('Houve um erro técnico ao salvar na base local.');
    }
  };

  // Excluir e arquivar atleta
  const handleDeletePlayer = async (id: string) => {
    try {
      await deletePlayer(id);
      await loadCatalog();
      if (viewingPlayer && viewingPlayer.id === id) {
        setViewingPlayer(null);
      }
    } catch (e) {
      console.error('Falha ao deletar atleta:', e);
    }
  };

  // Exportar relatório em PDF mensal contendo todo o catálogo atualizado
  const handleExportMonthlyReport = () => {
    if (players.length === 0) {
      alert('Não há atletas cadastrados atualmente no catálogo para simular o relatório scout.');
      return;
    }
    const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    generateScoutReportPDF(players, `Boletim Mensal de Scouting - ${currentMonth.toUpperCase()}`);
  };

  // Exportar os dados do catálogo em um backup JSON estável
  const handleExportBackup = () => {
    try {
      const dataStr = JSON.stringify(players, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const fileDefaultName = `futcatalog-backup-${new Date().toISOString().slice(0, 10)}.json`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileDefaultName;
      link.click();
      
      URL.revokeObjectURL(url);
      setBackupAlert({ message: 'Backup do catálogo exportado e baixado com sucesso!', type: 'success' });
      setTimeout(() => setBackupAlert(null), 4000);
    } catch (e) {
      console.error('Erro ao exportar backup:', e);
      setBackupAlert({ message: 'Erro ao gerar o arquivo de backup.', type: 'error' });
      setTimeout(() => setBackupAlert(null), 4000);
    }
  };

  // Carregar e processar o arquivo de importação com validação de formato completa
  const handleImportBackupClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = async (e) => {
      try {
        const content = e.target?.result;
        if (!content || typeof content !== 'string') {
          throw new Error('O conteúdo do arquivo do backup lido é inválido.');
        }

        const parsedData = JSON.parse(content);
        
        if (!Array.isArray(parsedData)) {
          throw new Error('O arquivo precisa conter uma lista JSON legítima de jogadores.');
        }

        if (parsedData.length > 0) {
          const first = parsedData[0];
          if (!first.name || !first.position || !first.team || !first.stats) {
            throw new Error('Formato do arquivo de backup incompatível com o catálogo.');
          }
        }

        setBackupPlayersToImport(parsedData);
      } catch (err: any) {
        console.error('Erro de importação:', err);
        setBackupAlert({ message: `Arquivo inválido ou corrompido: ${err.message || err}`, type: 'error' });
        setTimeout(() => setBackupAlert(null), 5000);
      } finally {
        event.target.value = '';
      }
    };

    fileReader.readAsText(files[0]);
  };

  // Tratar a confirmação da importação de backup e substituição de dados
  const handleConfirmImport = async () => {
    if (!backupPlayersToImport) return;
    try {
      await importBackupAndOverwrite(backupPlayersToImport);
      await loadCatalog();
      setBackupPlayersToImport(null);
      setBackupAlert({ message: 'Banco de dados do catálogo sobreeescrito e restaurado com pleno sucesso!', type: 'success' });
      setTimeout(() => setBackupAlert(null), 5000);
    } catch (e) {
      console.error('Falha de banco ao carregar dados:', e);
      setBackupAlert({ message: 'Erro grave ao gravar os dados importados no LocalDB.', type: 'error' });
      setTimeout(() => setBackupAlert(null), 5000);
    }
  };

  // Filtragem local
  const filteredPlayers = players.filter((player) => {
    const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      player.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const positionMatch = selectedPosition === 'Todos' || player.position === selectedPosition;
    const teamMatch = selectedTeam === 'Todos' || player.team === selectedTeam;

    return nameMatch && positionMatch && teamMatch;
  });

  // Métricas do Elenco para o Dashboard Principal
  const totalGols = players.reduce((sum, p) => sum + p.stats.goals, 0);
  const totalAssists = players.reduce((sum, p) => sum + p.stats.assists, 0);
  const averageRating = players.length > 0
    ? (players.reduce((sum, p) => sum + p.stats.rating, 0) / players.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-emerald-950">
      
      {/* 1. TOPO DA APLICAÇÃO (CABEÇALHO BRANDING) */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => {
            setViewingPlayer(null);
            setIsCreating(false);
            setEditingPlayer(null);
          }}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/35 border border-emerald-500/30">
              <Compass className="w-5.5 h-5.5 text-emerald-50 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                FutCatalog <span className="text-[10px] bg-slate-850 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 font-bold font-mono">SCOUT LAB</span>
              </span>
              <span className="text-[10px] text-slate-400 block tracking-wide mt-1">
                Catálogo Corporativo de Atletas & Transferências
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[9px] text-right">Data do Sistema</span>
              <span className="font-semibold text-slate-300 font-mono flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner de alerta de backup */}
        {backupAlert && (
          <div 
            id="backup-alert-banner"
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium transition-all shadow-md animate-fade-in ${
              backupAlert.type === 'success' 
                ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-350' 
                : 'bg-rose-950/70 border-rose-500/30 text-rose-350'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${backupAlert.type === 'success' ? 'bg-emerald-450' : 'bg-rose-450'} animate-pulse`} />
              <span>{backupAlert.message}</span>
            </div>
            <button 
              onClick={() => setBackupAlert(null)}
              className="text-slate-400 hover:text-white px-2.5 py-1 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
        
        {/* Caso esteja carregando informações do LocalDB */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Inicializando banco de dados local...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* TELA DE REGISTRO / EDIÇÃO */}
            {(isCreating || editingPlayer) ? (
              <PlayerForm 
                playerToEdit={editingPlayer}
                onSave={handleSavePlayer}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingPlayer(null);
                }}
              />
            ) : viewingPlayer ? (
              
              /* TELA DE DETALHES SCUT / DOSSIER */
              <PlayerDetails 
                player={viewingPlayer}
                onBack={() => setViewingPlayer(null)}
                onEdit={(p) => {
                  setEditingPlayer(p);
                }}
              />
              
            ) : (
              
              /* LISTA DE CATÁLOGO PRINCIPAL + FILTROS */
              <div className="space-y-8 animate-fade-in">
                
                {/* 2. DASHBOARD DE ATRIBUTOS MENSAL RÁPIDO */}
                <div id="scout-metrics-banner" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700/60 transition-colors">
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-semibold">Elenco Catalogado</span>
                      <span className="text-2xl font-black text-slate-100 font-mono leading-none mt-1 inline-block">{players.length} Atletas</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700/60 transition-colors">
                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-semibold">Qualidade Média (Rating)</span>
                      <span className="text-2xl font-black text-slate-100 font-mono leading-none mt-1 inline-block">★ {averageRating}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700/60 transition-colors">
                    <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-semibold">Gols na Temporada</span>
                      <span className="text-2xl font-black text-slate-100 font-mono leading-none mt-1 inline-block">{totalGols} marcados</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700/60 transition-colors">
                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block font-semibold">Assistências Consolidadas</span>
                      <span className="text-2xl font-black text-slate-100 font-mono leading-none mt-1 inline-block">{totalAssists} registradas</span>
                    </div>
                  </div>
                </div>

                {/* 3. BARRA DE FILTROS E BUSCA EM PORTUGUÊS */}
                <div id="scout-filters-panel" className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                      <SlidersHorizontal className="w-4.5 h-4.5 text-emerald-400" />
                      Filtros e Painel de Seleção de Scouting
                    </h2>

                    {/* Botões de Ações Coletivas */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        id="btn-trigger-report-pdf"
                        onClick={handleExportMonthlyReport}
                        className="py-2 px-4 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                        title="Montar relatório completo em PDF contendo as estatísticas e notas do catálogo"
                      >
                        <Download className="w-4 h-4 text-emerald-450" /> Baixar PDF Mensal
                      </button>

                      <button
                        id="btn-export-backup"
                        onClick={handleExportBackup}
                        className="py-2 px-4 bg-slate-850 hover:bg-slate-850 hover:border-slate-700 border border-slate-755 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                        title="Exportar backup de todo o banco de dados do catálogo atual em arquivo JSON"
                      >
                        <Database className="w-4 h-4 text-amber-500 animate-[bounce_2s_infinite]" /> Exportar Backup
                      </button>

                      <label
                        id="btn-import-backup-label"
                        className="py-2 px-4 bg-slate-850 hover:bg-slate-850 hover:border-slate-700 border border-slate-755 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                        title="Importar e restaurar dados do catálogo a partir de um arquivo JSON"
                      >
                        <Upload className="w-4 h-4 text-sky-450" /> Importar Backup
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackupClick}
                          className="hidden"
                        />
                      </label>

                      <button
                        id="btn-register-new-player"
                        onClick={() => setIsCreating(true)}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-emerald-950/20 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Novo Atleta
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/80 pt-4">
                    
                    {/* Campo de pesquisa por termo */}
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Search className="w-4 h-4" />
                      </span>
                      <input 
                        type="text"
                        placeholder="Pesquisar por nome ou nacionalidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800/80 focus:border-emerald-500/80 pl-9.5 pr-4 py-2 rounded-xl text-xs text-slate-200 outline-none transition-colors placeholder:text-slate-500"
                      />
                    </div>

                    {/* Filtro Dropdown de Posição */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0 font-mono">Posição:</span>
                      <select
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        className="bg-transparent text-xs text-slate-300 w-full outline-none transition-colors cursor-pointer"
                      >
                        {POSITIONS.map((pos) => (
                          <option key={pos} value={pos} className="bg-slate-950 text-slate-300">{pos}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro Dropdown de Times cadastrados de forma dinâmica */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800/80 px-3 py-1.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0 font-mono">Time:</span>
                      <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="bg-transparent text-xs text-slate-300 w-full outline-none transition-colors cursor-pointer"
                      >
                        <option value="Todos" className="bg-slate-950">Todos os Times</option>
                        {uniqueTeams.map((team) => (
                          <option key={team} value={team} className="bg-slate-950 text-slate-300">{team}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* 4. EXIBIÇÃO DE JOGADORES INATIVOS / GRID DE RESULTADOS */}
                {filteredPlayers.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-3xl space-y-4 max-w-lg mx-auto">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto opacity-40 animate-bounce" />
                    <div>
                      <h3 className="text-base font-bold text-slate-300">Nenhum Atleta Identificado</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Não existem registros cadastrados ou correspondentes com os filtros de busca aplicados. Gostaria de cadastrar um novo atleta?
                      </p>
                    </div>
                    <button
                      id="btn-register-fallback"
                      onClick={() => setIsCreating(true)}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-emerald-100 font-bold text-xs rounded-xl transition-all inline-block active:scale-95 cursor-pointer"
                    >
                      Criar Atleta Manualmente
                    </button>
                  </div>
                ) : (
                  <div id="catalog-players-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlayers.map((player) => (
                      <PlayerCard 
                        key={player.id}
                        player={player}
                        onView={(p) => setViewingPlayer(p)}
                        onEdit={(p) => setEditingPlayer(p)}
                        onDelete={handleDeletePlayer}
                        onZoom={(p) => setZoomingPlayer(p)}
                      />
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* 5. MODAL DE ZOOM INTERATIVO DO JOGADOR */}
      {zoomingPlayer && (
        <PlayerZoomModal 
          player={zoomingPlayer}
          onClose={() => setZoomingPlayer(null)}
          onViewScout={(p) => {
            setViewingPlayer(p);
            setZoomingPlayer(null);
          }}
        />
      )}

      {/* 6. MODAL DE CONFIRMAÇÃO DE RESTAURAÇÃO DE BACKUP */}
      {backupPlayersToImport && (
        <div 
          id="backup-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight">Confirmar Restauração de Backup?</h3>
              <p className="text-xs text-slate-400">
                Você selecionou um arquivo contendo <span className="font-bold text-amber-400 font-mono">{backupPlayersToImport.length} atleta(s)</span>. 
              </p>
              <p className="text-xs text-slate-500 bg-slate-950 p-3 rounded-xl border border-slate-850">
                🚨 <span className="font-semibold text-rose-455">Aviso Importante:</span> Esta operação é irreversível e substituirá por completo todas as fichas de jogadores do banco de dados local atual (`IndexedDB`).
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                id="btn-confirm-import-cancel"
                onClick={() => setBackupPlayersToImport(null)}
                className="flex-1 py-2.5 px-4 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-import-proceed"
                onClick={handleConfirmImport}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Sim, Sobrescrever Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER DE DOCUMENTAÇÃO */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1.5 font-mono">
          <p>FutCatalog Scout Hub © {new Date().getFullYear()} - Sistema Seguro e Isolado de Armazenamento Client-Side (LocalDB).</p>
          <p>Totalmente compatível com exportação de relatórios mensais táticos e observações de mercado de transferências.</p>
        </div>
      </footer>
    </div>
  );
}
