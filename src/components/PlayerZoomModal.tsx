import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Shield, 
  User, 
  Activity,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface PlayerZoomModalProps {
  player: Player | null;
  onClose: () => void;
  onViewScout: (player: Player) => void;
}

export default function PlayerZoomModal({ player, onClose, onViewScout }: PlayerZoomModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Resetar zoom e rotação ao mudar de jogador
  useEffect(() => {
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  }, [player]);

  // Tecla de atalho ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!player) return null;

  // Cálculo da idade em anos
  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) return '';
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} anos`;
  };

  // Funções simples para controle de Zoom
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  // Manipuladores de arrastar (pan) a foto ampliada
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Cores de posições para padronização visual
  const getPositionBadgeColor = (pos: string) => {
    if (pos.includes('Goleiro')) return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    if (pos.includes('Zagueiro') || pos.includes('Lateral')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (pos.includes('Volante') || pos.includes('Meio') || pos.includes('Meia')) return 'bg-indigo-500/15 text-indigo-300 border-indigo-505/30';
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  };

  return (
    <div 
      id="player-zoom-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div 
        id={`player-zoom-modal-${player.id}`}
        className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CORPO DO ATLETA - IMAGEM INTERATIVA (ZOOMABLE) */}
        <div className="relative w-full md:w-1/2 h-72 md:h-auto bg-slate-950 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 overflow-hidden select-none">
          
          {/* Instrução visual flutuante */}
          <div className="absolute top-3 left-3 z-10 bg-slate-900/85 backdrop-blur-sm text-[10px] text-slate-400 border border-slate-800 py-1 px-2.5 rounded-full flex items-center gap-1">
            <Info className="w-3 h-3 text-emerald-400" />
            <span>Use o controle abaixo ou arraste a imagem</span>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-move">
            <img 
              src={player.photo} 
              alt={player.name}
              referrerPolicy="no-referrer"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              style={{
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              className="w-4/5 h-4/5 object-contain max-h-[60%] md:max-h-[75%] pointer-events-auto rounded-xl drop-shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            />
          </div>

          {/* CONTROLES DE ZOOM INFERIORES */}
          <div className="absolute bottom-4 inset-x-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-850 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <button 
                id="btn-zoom-out"
                onClick={handleZoomOut}
                title="Afastar (-)"
                className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg transition-colors active:scale-90"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono font-bold">ZOOM:</span>
                <input 
                  id="zoom-slider-control"
                  type="range"
                  min="0.75"
                  max="4"
                  step="0.05"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] text-emerald-400 font-mono font-bold w-10 text-right">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>

              <button 
                id="btn-zoom-in"
                onClick={handleZoomIn}
                title="Aproximar (+)"
                className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg transition-colors active:scale-90"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px]">
              <button
                id="btn-zoom-rotate"
                onClick={handleRotate}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
              >
                <RotateCw className="w-3 h-3 text-emerald-500" /> Girar 90°
              </button>

              <span className="text-slate-600 font-mono">
                Pan: {panPosition.x}px, {panPosition.y}px
              </span>

              <button
                id="btn-zoom-reset"
                onClick={handleReset}
                className="px-2.5 py-1 text-emerald-450 hover:text-emerald-400 hover:underline transition-colors font-semibold"
              >
                Redefinir Ajustes
              </button>
            </div>
          </div>
        </div>

        {/* DETAILS PANEL PANEL DO JOGADOR ZOOM */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-slate-900">
          
          <div>
            {/* Header com botôes de fechamento externo */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className={`text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border ${getPositionBadgeColor(player.position)} font-bold`}>
                {player.position}
              </span>

              <button 
                id="btn-close-zoom"
                onClick={onClose}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Atleta Identificador */}
            <div className="space-y-1 mb-5">
              <h1 className="text-2xl font-black text-white leading-tight tracking-tight">
                {player.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 bg-slate-950 border border-slate-850 rounded">
                  Camisa #{player.jerseyNumber}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Shield className="w-3.5 h-3.5 text-slate-500" /> {player.team}
                </span>
              </div>
            </div>

            {/* Ficha Geral de Parâmetros */}
            <div className="grid grid-cols-2 gap-3.5 bg-slate-950/50 border border-slate-850 p-4 rounded-2xl mb-6">
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">NACIONALIDADE</span>
                <span className="text-sm font-semibold text-slate-200">{player.nationality || 'Não especificada'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">IDADE (DATA NASC.)</span>
                <span className="text-sm font-semibold text-slate-200">
                  {calculateAge(player.birthDate)} <span className="text-[11px] font-normal text-slate-550">({new Date(player.birthDate).toLocaleDateString('pt-BR')})</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">ALTURA / PESO</span>
                <span className="text-sm font-semibold text-slate-200">{player.height} cm / {player.weight} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">PÉ PREFERIDO</span>
                <span className="text-sm font-semibold text-emerald-400 font-mono">{player.preferredFoot}</span>
              </div>
            </div>

            {/* MINI GRÁFICO RESUMIDO DE HABILIDADES SCUT */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1.5 font-mono">
                  <Activity className="w-3.5 h-3.5 text-amber-500" /> Habilidades Balizadas
                </h3>
                <span className="text-xs text-slate-500 font-mono bg-slate-950 border border-slate-850 px-2 py-0.5 rounded leading-none">
                  Fórmula FIFA / PES
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Atributo Pace */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Velocidade (PAC)</span>
                    <span className="font-mono font-bold text-slate-300">{player.stats.pace || 50}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${player.stats.pace || 50}%` }} />
                  </div>
                </div>

                {/* Atributo Shooting */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Finalização (SHO)</span>
                    <span className="font-mono font-bold text-slate-300">{player.stats.shooting || 50}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${player.stats.shooting || 50}%` }} />
                  </div>
                </div>

                {/* Atributo Passing */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Passe Curto/Longo (PAS)</span>
                    <span className="font-mono font-bold text-slate-300">{player.stats.passing || 50}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${player.stats.passing || 50}%` }} />
                  </div>
                </div>

                {/* Atributo Dribbling */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Drible (DRI)</span>
                    <span className="font-mono font-bold text-slate-300">{player.stats.dribbling || 50}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${player.stats.dribbling || 50}%` }} />
                  </div>
                </div>

                {/* Atributo Defending */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Desarme/Defesa (DEF)</span>
                    <span className="font-mono font-bold text-slate-300">{player.stats.defending || 50}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${player.stats.defending || 50}%` }} />
                  </div>
                </div>

                {/* Atributo Physical */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Físico/Fôlego (PHY)</span>
                    <span className="font-mono font-bold text-slate-300">{player.stats.physical || 50}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: `${player.stats.physical || 50}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RODAPÉ DO DETAIL COM AÇÕES DIRETAS DO CARD */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 bg-slate-900 mt-4 md:mt-2">
            
            <div className="flex flex-col">
              <span className="text-[9px] uppercase text-slate-500 font-mono tracking-wider font-semibold">Nota Scouting</span>
              <span className="text-lg font-black text-amber-400 font-mono flex items-center gap-1">
                ★ {player.stats.rating.toFixed(1)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-zoom-close-cancel"
                onClick={onClose}
                className="py-2 px-3.5 bg-slate-950 text-slate-400 hover:text-white border border-slate-850 rounded-xl text-xs font-bold transition-all hover:bg-slate-850"
              >
                Voltar à Grade
              </button>

              <button
                id={`btn-zoom-scout-redirect-${player.id}`}
                onClick={() => {
                  onViewScout(player);
                  onClose();
                }}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Acessar Dossiê Scout
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
