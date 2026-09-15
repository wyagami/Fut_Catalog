import React from 'react';
import { Player } from '../types';
import StatsRadarOrBar from './StatsRadarOrBar';
import TransferHistoryList from './TransferHistoryList';
import { generateScoutReportPDF } from '../lib/pdfGenerator';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  Activity, 
  BookOpen, 
  FileText, 
  Compass,
  Edit2
} from 'lucide-react';

interface PlayerDetailsProps {
  player: Player;
  onBack: () => void;
  onEdit: (player: Player) => void;
}

export default function PlayerDetails({ player, onBack, onEdit }: PlayerDetailsProps) {
  // Calcular idade dinâmica
  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) return '';
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} anos`;
  };

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleExportIndividual = () => {
    generateScoutReportPDF([player], `Relatório Individual de ${player.name}`);
  };

  return (
    <div id={`player-scout-details-${player.id}`} className="space-y-8 animate-fade-in">
      {/* Detalhes de Ações do Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          id="btn-back-catalog"
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-100 font-semibold text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para o catálogo
        </button>

        <div className="flex items-center gap-3">
          <button
            id="btn-edit-scout"
            onClick={() => onEdit(player)}
            className="flex items-center gap-1.5 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs transition-all active:scale-95 border border-slate-705"
          >
            <Edit2 className="w-4 h-4 text-emerald-400" /> Editar Perfil
          </button>

          <button
            id="btn-export-individual-pdf"
            onClick={handleExportIndividual}
            className="flex items-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-emerald-950/20"
          >
            <Download className="w-4 h-4" /> Exportar PDF Individual
          </button>
        </div>
      </div>

      {/* 1. SEÇÃO PERFIL DO DOSSIER (FOTO + DESCRIÇÃO INTEGRADA) */}
      <div id="player-dossier-panel" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Glow de fundo sutil */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* Lado Esquerdo: Identidade do atleta */}
          <div className="flex flex-col items-center shrink-0 w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-8">
            <div className="relative w-44 h-44 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-xl mb-4">
              <img 
                src={player.photo} 
                alt={player.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-slate-900/95 font-mono text-xs font-bold text-amber-400 py-0.5 px-2 rounded-md border border-slate-700/60 shadow-lg">
                Camisa #{player.jerseyNumber}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-50 text-center tracking-tight leading-tight">
              {player.name}
            </h1>
            <p className="text-emerald-400 text-sm font-semibold tracking-wide mt-1 uppercase">
              {player.position}
            </p>
            <p className="text-slate-400 text-xs font-medium mt-1 flex items-center justify-center gap-1">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              {player.team}
            </p>

            {/* Ficha Rápida e Perfil Métrico */}
            <div className="w-full mt-6 space-y-2.5 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Nacionalidade</span>
                <span className="font-semibold text-slate-200">{player.nationality}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Nascimento</span>
                <span className="font-semibold text-slate-200">{formatDateBR(player.birthDate)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Idade Calculada</span>
                <span className="font-semibold text-slate-200">{calculateAge(player.birthDate)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Altura / Peso</span>
                <span className="font-semibold text-slate-200">{player.height} cm / {player.weight} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Pé de Preferência</span>
                <span className="font-semibold text-yellow-500">{player.preferredFoot}</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Perfil de Observação Tática do Scout (Conforme Solicitado!) */}
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-5 h-5 text-emerald-400" />
                Descrição Narrativa e Relatório de Observação Técnica
              </h2>
              
              <div className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl leading-relaxed text-slate-300 text-sm whitespace-pre-wrap font-sans text-justify">
                {player.description ? player.description : (
                  <span className="italic text-slate-500">
                    Nenhum perfil tático redigido para este jogador no catálogo. Clique em Editar para adicionar notas detalhadas de observação, pontos fortes e recomendações táticas.
                  </span>
                )}
              </div>
            </div>

            {/* Mensagem Administrativa do Status no Clube */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-start gap-3">
              <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wide">Status de Observação do Jogador</h4>
                <p className="text-xs text-emerald-400/80 mt-1">
                  Atleta atualmente sob contrato com {player.team}. Notas de observações técnicas atualizadas com base nos últimos jogos oficiais da temporada {new Date().getFullYear()}.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. STATS GRÁFICOS */}
      <div id="scout-stats-pane" className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" /> Análise de Desempenho & Estatísticas Individuais
        </h2>
        <StatsRadarOrBar stats={player.stats} />
      </div>

      {/* 3. TRANSFERS HISTORY */}
      <div id="scout-transfers-pane" className="space-y-4">
        <TransferHistoryList transfers={player.transfers} />
      </div>
    </div>
  );
}
