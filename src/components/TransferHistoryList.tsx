import React from 'react';
import { Transfer } from '../types';
import { Milestone, ArrowRight, Calendar, Coins, TrendingUp } from 'lucide-react';

interface TransferHistoryProps {
  transfers: Transfer[];
}

export default function TransferHistoryList({ transfers }: TransferHistoryProps) {
  const sortedTransfers = [...transfers].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getTransferTypeColor = (type: string) => {
    switch (type) {
      case 'Promoção da Base':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Transferência':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Empréstimo':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Retorno de Empréstimo':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Fim de Contrato':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  // Helper formatar data pt-br
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div id="transfer-history-list" className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        <Milestone className="w-4 h-4 text-emerald-400" /> Histórico Completo de Transferências ({transfers.length})
      </h3>

      {sortedTransfers.length === 0 ? (
        <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          <TrendingUp className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma transferência registrada para este jogador.</p>
        </div>
      ) : (
        <div className="relative border-l border-slate-800 pl-6 ml-3 space-y-6">
          {sortedTransfers.map((transfer, index) => (
            <div key={transfer.id || index} className="relative group">
              {/* Timeline Marker Bullet */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-slate-950 rounded-full border-2 border-emerald-500 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              </div>

              {/* Transfer Card content */}
              <div className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDateBR(transfer.date)}
                    </span>
                    <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border ${getTransferTypeColor(transfer.type)}`}>
                      {transfer.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-300 group-hover:text-emerald-400 transition-colors duration-200">
                      {transfer.fromTeam}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <span className="font-bold text-slate-200">
                      {transfer.toTeam}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 md:text-right bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 md:border-0 md:bg-transparent">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold leading-none">Custo / Valor</span>
                    <span className="text-sm font-semibold text-amber-400 font-mono">
                      {transfer.fee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
