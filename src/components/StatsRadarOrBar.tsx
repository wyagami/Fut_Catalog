import React from 'react';
import { PlayerStats } from '../types';
import { Award, Zap, Crosshair, RefreshCw, BarChart2, CheckCircle } from 'lucide-react';

interface StatsProps {
  stats: PlayerStats;
}

export default function StatsRadarOrBar({ stats }: StatsProps) {
  // Cores dinâmicas para as notas (0-49: Vermelho, 50-69: Amarelo, 70-89: Verde, 90-100: Verde brilhante/Gold)
  const getQualityColor = (value: number) => {
    if (value < 50) return 'bg-red-500 text-red-50';
    if (value < 70) return 'bg-amber-500 text-amber-900';
    if (value < 90) return 'bg-emerald-500 text-emerald-950';
    return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-yellow-950 font-bold';
  };

  const getBarColor = (value: number) => {
    if (value < 50) return 'bg-red-500';
    if (value < 70) return 'bg-amber-500';
    if (value < 90) return 'bg-emerald-500';
    return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]';
  };

  const technicalAttributes = [
    { label: 'RIT (Ritmo / Velocidade)', value: stats.pace, icon: Zap },
    { label: 'FIN (Finalização / Chute)', value: stats.shooting, icon: Crosshair },
    { label: 'PAS (Passe)', value: stats.passing, icon: RefreshCw },
    { label: 'DRI (Drible)', value: stats.dribbling, icon: BarChart2 },
    { label: 'DEF (Defesa)', value: stats.defending, icon: Award },
    { label: 'FIS (Físico / Força)', value: stats.physical, icon: CheckCircle },
  ];

  return (
    <div id="stats-dashboard-container" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Atributos da Ficha Técnica */}
      <div id="technical-stats-box" className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" /> Atributos de Jogo (FIFA/Scouting Style)
        </h3>
        
        <div className="space-y-4">
          {technicalAttributes.map((attr) => (
            <div key={attr.label} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium">{attr.label}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getQualityColor(attr.value)}`}>
                  {attr.value}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getBarColor(attr.value)}`}
                  style={{ width: `${attr.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas do Jogador na Temporada */}
      <div id="seasonal-stats-box" className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" /> Estatísticas da Temporada Atual
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Partidas</span>
              <span className="text-2xl font-bold text-slate-100 font-mono">{stats.matchesPlayed}</span>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 block mb-1">Nota Média</span>
              <span className="text-2xl font-bold text-yellow-500 font-mono">★ {stats.rating.toFixed(1)}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center border-l-4 border-l-emerald-500">
              <span className="text-xs text-slate-400 block mb-1">Gols</span>
              <span className="text-2xl font-semibold text-emerald-400 font-mono">{stats.goals}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center border-l-4 border-l-cyan-500">
              <span className="text-xs text-slate-400 block mb-1">Assistências</span>
              <span className="text-2xl font-semibold text-cyan-400 font-mono">{stats.assists}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 block uppercase">Cartões Amarelos</span>
            <span className="text-lg font-bold text-yellow-500 flex items-center justify-center gap-1 mt-1 font-mono">
              <span className="w-3 h-4 bg-yellow-500 rounded-sm inline-block border border-yellow-600 shadow-md"></span>
              {stats.yellowCards}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-500 block uppercase">Cartões Vermelhos</span>
            <span className="text-lg font-bold text-red-500 flex items-center justify-center gap-1 mt-1 font-mono">
              <span className="w-3 h-4 bg-red-500 rounded-sm inline-block border border-red-600 shadow-md"></span>
              {stats.redCards}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-500 block uppercase">Minutos Jogados</span>
            <span className="text-sm font-semibold text-indigo-300 block mt-1.5 font-mono">
              {stats.minutesPlayed}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
