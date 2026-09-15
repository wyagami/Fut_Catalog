import React from 'react';
import { Player } from '../types';
import { Shield, Goal, Star, Calendar, User, Eye, Trash2, Edit2, ZoomIn } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onView: (player: Player) => void;
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
  onZoom: (player: Player) => void;
}

export default function PlayerCard({ player, onView, onEdit, onDelete, onZoom }: PlayerCardProps) {
  // Cores de fundo e borda com base na posição para categorizar visualmente no catálogo
  const getPositionStyles = (pos: string) => {
    if (pos.includes('Goleiro')) {
      return {
        badge: 'bg-sky-500/10 text-sky-400 border-sky-400/20',
        glow: 'hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]',
        accentBg: 'from-sky-500/5 to-transparent'
      };
    }
    if (pos.includes('Zagueiro') || pos.includes('Lateral')) {
      return {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
        glow: 'hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]',
        accentBg: 'from-emerald-500/5 to-transparent'
      };
    }
    if (pos.includes('Volante') || pos.includes('Meio') || pos.includes('Meia')) {
      return {
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-400/20',
        glow: 'hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]',
        accentBg: 'from-indigo-500/5 to-transparent'
      };
    }
    // Atacantes / Pontas
    return {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-400/20',
      glow: 'hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]',
      accentBg: 'from-rose-500/5 to-transparent'
    };
  };

  const styles = getPositionStyles(player.position);

  return (
    <div 
      id={`player-card-${player.id}`}
      className={`relative flex flex-col bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 group ${styles.glow}`}
    >
      {/* Background Gradient Accent */}
      <div className={`absolute inset-0 bg-gradient-to-b ${styles.accentBg} pointer-events-none`} />

      {/* Top Banner Details */}
      <div className="p-4 flex items-start gap-4 relative z-10">
        
        {/* Player Image / Avatar Container */}
        <div 
          onClick={() => onZoom(player)}
          title="Clique para aproximar (Zoom)"
          className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all duration-350 cursor-pointer group/img"
        >
          <img 
            src={player.photo} 
            alt={player.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
          />
          {/* Zoom hover overlay lens */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all duration-200">
            <ZoomIn className="w-5 h-5 text-emerald-450 scale-75 group-hover/img:scale-100 transition-transform duration-250" />
          </div>
          {/* Jersey Number Tag */}
          <div className="absolute bottom-0 right-0 bg-slate-900/90 text-[10px] font-mono font-bold text-amber-400 px-1 rounded-tl border-t border-l border-slate-800 z-10">
            #{player.jerseyNumber}
          </div>
        </div>

        {/* Name and General Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles.badge} font-semibold truncate`}>
              {player.position}
            </span>
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono">
              <Star className="w-3 h-3 fill-yellow-500 stroke-yellow-500" />
              {player.stats.rating.toFixed(1)}
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-100 truncate group-hover:text-emerald-400 transition-colors duration-200">
            {player.name}
          </h3>
          
          <p className="text-xs text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
            <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {player.team}
          </p>
        </div>
      </div>

      {/* Mini Performance Stats Bar */}
      <div className="px-4 py-3 bg-slate-950/40 border-t border-b border-slate-800 grid grid-cols-3 gap-1 divide-x divide-slate-800 relative z-10 font-mono">
        <div className="text-center">
          <span className="text-[10px] text-slate-500 uppercase block">Partidas</span>
          <span className="text-sm font-semibold text-slate-300">{player.stats.matchesPlayed}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-slate-500 uppercase block">Gols</span>
          <span className="text-sm font-semibold text-emerald-400">{player.stats.goals}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-slate-500 uppercase block">Assistências</span>
          <span className="text-sm font-semibold text-cyan-400">{player.stats.assists}</span>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-3 bg-slate-950 flex items-center justify-between gap-2 mt-auto relative z-10">
        <button
          id={`view-btn-${player.id}`}
          onClick={() => onView(player)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-semibold text-xs rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-950/10"
        >
          <Eye className="w-3.5 h-3.5" /> Ver Scout
        </button>

        <div className="flex gap-1.5 shrink-0">
          <button
            id={`zoom-btn-${player.id}`}
            onClick={() => onZoom(player)}
            title="Aproximar Atleta (Zoom)"
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-emerald-600/50 rounded-lg text-slate-400 hover:text-emerald-400 transition-all active:scale-90"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            id={`edit-btn-${player.id}`}
            onClick={() => onEdit(player)}
            title="Editar Jogador"
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-all active:scale-90"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            id={`delete-btn-${player.id}`}
            onClick={() => {
              if (window.confirm(`Tem certeza que deseja arquivar e excluir o scout de ${player.name}?`)) {
                onDelete(player.id);
              }
            }}
            title="Excluir Jogador"
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-red-950 rounded-lg text-slate-400 hover:text-rose-500 transition-all active:scale-90"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
