import { jsPDF } from 'jspdf';
import { Player } from '../types';

export function generateScoutReportPDF(players: Player[], reportTitle: string = 'Relatório Mensal de Scouting'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 20;
  let currentY = 20;

  // Helpers de Formatação e Layout
  const addHeader = (titleText: string) => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(titleText, margin, 16);
    
    // Coroa verde de acento
    doc.setFillColor(34, 197, 94); // emerald-500
    doc.rect(0, 24, pageWidth, 1, 'F');
    
    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    const dateStr = `Emitido em: ${new Date().toLocaleDateString('pt-BR')} | FutCatalog`;
    doc.text(dateStr, pageWidth - margin - doc.getTextWidth(dateStr), 15);
  };

  const addFooter = (pageNum: number, totalPages: number) => {
    // Linha fina sobre rodapé
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('FutCatalog - Sistema Seguro de Armazenamento de Atletas', margin, pageHeight - 10);
    const pag = `Página ${pageNum} de ${totalPages}`;
    doc.text(pag, pageWidth - margin - doc.getTextWidth(pag), pageHeight - 10);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 25) {
      doc.addPage();
      currentY = 35;
      return true;
    }
    return false;
  };

  // --- PÁGINA 1: CAPA E RESUMO DO ELENCO (SUMÁRIO SCUTING) ---
  addHeader('REPORT: SUMÁRIO DO CATÁLOGO MENSAL');
  currentY = 40;

  // Título e Subtítulo Principal
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('REDE DE SCOUTING & TALENTOS', margin, currentY);
  currentY += 8;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`${reportTitle} - Estatísticas consolidadas e fichas individuais do elenco`, margin, currentY);
  currentY += 15;

  // Caixa de Estatísticas Rápidas
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 35, 3, 3, 'FD');
  
  // Total de Jogadores
  doc.setTextColor(15, 23, 42);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('METRICAS DO CATÁLOGO', margin + 6, currentY + 10);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total de Atletas Ativos: ${players.length}`, margin + 6, currentY + 18);

  const goalSum = players.reduce((acc, p) => acc + p.stats.goals, 0);
  const assistSum = players.reduce((acc, p) => acc + p.stats.assists, 0);
  const avgPace = Math.round(players.reduce((acc, p) => acc + p.stats.pace, 0) / (players.length || 1));
  const avgDef = Math.round(players.reduce((acc, p) => acc + p.stats.defending, 0) / (players.length || 1));

  doc.text(`Total de Gols na Temporada: ${goalSum}`, margin + 6, currentY + 24);
  doc.text(`Total de Assistências: ${assistSum}`, margin + 6, currentY + 30);

  // Coluna Direita no Bloco de Métricas
  doc.text(`Velocidade Média Geral: ${avgPace} / 100`, margin + 95, currentY + 18);
  doc.text(`Eficiência Defensiva Média: ${avgDef} / 100`, margin + 95, currentY + 24);
  const ratingAvg = players.reduce((acc, p) => acc + p.stats.rating, 0) / (players.length || 1);
  doc.text(`Avaliação Média Geral: ★ ${ratingAvg.toFixed(2)}`, margin + 95, currentY + 30);

  currentY += 45;

  // TOP 3 Jogadores (Gols / Ratings)
  doc.setTextColor(15, 23, 42);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('DESTAQUES ATIVOS DO ELENCO', margin, currentY);
  currentY += 8;

  // Ordenar jogadores de destaque
  const topScorers = [...players].sort((a, b) => b.stats.goals - a.stats.goals).slice(0, 3);
  const topRated = [...players].sort((a, b) => b.stats.rating - a.stats.rating).slice(0, 3);

  // TOP Artilheiros Column
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129); // green
  doc.text('Top Artilheiros (Gols)', margin, currentY);
  
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  topScorers.forEach((p, idx) => {
    doc.setFont('Helvetica', 'bold');
    doc.text(`${idx + 1}. ${p.name}`, margin, currentY + 6 + (idx * 6));
    doc.setFont('Helvetica', 'normal');
    doc.text(`- ${p.team} (${p.stats.goals} Gols)`, margin + doc.getTextWidth(`${idx + 1}. ${p.name} `), currentY + 6 + (idx * 6));
  });

  // TOP Classificados Column
  doc.setFontSize(11);
  doc.setTextColor(245, 158, 11); // amber
  doc.text('Mais Valiosos (Nota de Scouting)', margin + 90, currentY);
  
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  topRated.forEach((p, idx) => {
    doc.setFont('Helvetica', 'bold');
    doc.text(`${idx + 1}. ${p.name}`, margin + 90, currentY + 6 + (idx * 6));
    doc.setFont('Helvetica', 'normal');
    doc.text(`- Nota ★ ${p.stats.rating.toFixed(1)}`, margin + 90 + doc.getTextWidth(`${idx + 1}. ${p.name} `), currentY + 6 + (idx * 6));
  });

  currentY += 30;

  // Lista Simplificada de Jogadores em Tabela
  doc.setTextColor(15, 23, 42);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('ELENCO COMPLETO CADASTRADO', margin, currentY);
  currentY += 8;

  // Cabeçalho da tabela
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
  
  doc.setTextColor(71, 85, 105);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Jogador', margin + 3, currentY + 5.5);
  doc.text('Time', margin + 55, currentY + 5.5);
  doc.text('Posição', margin + 100, currentY + 5.5);
  doc.text('Nota', margin + 145, currentY + 5.5);
  doc.text('Partidas', margin + 160, currentY + 5.5);
  doc.text('G/A', margin + 180, currentY + 5.5);

  currentY += 8;

  // Linhas da tabela
  players.forEach((p, idx) => {
    checkPageBreak(8);
    
    // fundo zebrado
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, pageWidth - (margin * 2), 7, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(p.name, margin + 3, currentY + 5);
    doc.text(p.team, margin + 55, currentY + 5);
    doc.text(p.position, margin + 100, currentY + 5);
    doc.text(`★ ${p.stats.rating.toFixed(1)}`, margin + 145, currentY + 5);
    doc.text(`${p.stats.matchesPlayed}`, margin + 160, currentY + 5);
    doc.text(`${p.stats.goals}G / ${p.stats.assists}A`, margin + 180, currentY + 5);

    currentY += 7;
  });

  // Desenhar rodapé da primeira página
  addFooter(1, players.length + 1);


  // --- PÁGINAS SUBSEQUENTES: RELATÓRIO INDIVIDUAL DE CADA JOGADOR ---
  players.forEach((p, playerIdx) => {
    const pageNum = playerIdx + 2;
    doc.addPage();
    currentY = 32;

    addHeader(`REPORT DE ATLETA: ${p.name.toUpperCase()}`);

    // Bloco Superior: Perfil Geral & Foto Mock
    // Vamos desenhar um card simulado de perfil elegante
    doc.setFillColor(15, 23, 42); // slate-900 background para o card da direita
    doc.roundedRect(margin, currentY, 55, 60, 3, 3, 'F');

    // Informação estilizada dentro do card escuro
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(p.name.substring(0, 18), margin + 5, currentY + 12);
    
    doc.setTextColor(34, 197, 94); // emerald neon
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`${p.position}`, margin + 5, currentY + 18);

    doc.setTextColor(251, 191, 36); // gold
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(28);
    doc.text(`#${p.jerseyNumber}`, margin + 5, currentY + 32);

    doc.setTextColor(203, 213, 225); // slate-300
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Pé Fav: ${p.preferredFoot}`, margin + 5, currentY + 42);
    doc.text(`Físico: ${p.height}cm / ${p.weight}kg`, margin + 5, currentY + 47);
    doc.text(`Nac: ${p.nationality}`, margin + 5, currentY + 52);


    // Coluna Direita (Ficha Administrativa & Clubes)
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin + 60, currentY, pageWidth - margin * 2 - 60, 60, 3, 3, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('FICHA DO JOGADOR', margin + 65, currentY + 10);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Clube Integrante:  ${p.team}`, margin + 65, currentY + 18);
    const dobFormatted = p.birthDate ? p.birthDate.split('-').reverse().join('/') : '';
    doc.text(`Data de Nascimento:  ${dobFormatted}`, margin + 65, currentY + 24);
    
    // Idade aproximada
    let age = '';
    if (p.birthDate) {
      const birth = new Date(p.birthDate);
      const diff = Date.now() - birth.getTime();
      age = `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))} anos`;
    }
    doc.text(`Idade Mapeada:  ${age}`, margin + 65, currentY + 30);

    // Resumo da temporada rápida
    doc.text(`Partidas Jogadas:  ${p.stats.matchesPlayed} partidas oficiais`, margin + 65, currentY + 38);
    doc.text(`Participações Diretas:  ${p.stats.goals} Gols e ${p.stats.assists} Assistências`, margin + 65, currentY + 44);
    doc.text(`Minutos Atuados:  ${p.stats.minutesPlayed} min`, margin + 65, currentY + 50);

    currentY += 68;

    // --- SEÇÃO: ATRIBUTOS DE JOGO & NOTAS DE SCUTING ---
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('GRAU DE PERFORMANCE E SCOUTING (0-100)', margin, currentY);
    currentY += 6;

    // Desenhar atributos em 2 colunas com barras de progresso simuladas
    const attrs = [
      { label: 'Velocidade / Ritmo (RIT)', value: p.stats.pace, col: 1 },
      { label: 'Finalização / Chute (FIN)', value: p.stats.shooting, col: 1 },
      { label: 'Qualidade de Passe (PAS)', value: p.stats.passing, col: 1 },
      { label: 'Habilidade / Drible (DRI)', value: p.stats.dribbling, col: 2 },
      { label: 'Atitude Defensiva (DEF)', value: p.stats.defending, col: 2 },
      { label: 'Combate e Força (FIS)', value: p.stats.physical, col: 2 },
    ];

    attrs.forEach((attr) => {
      const colX = attr.col === 1 ? margin : margin + 90;
      const rowY = attr.col === 1 
        ? currentY + (attrs.filter(a => a.col === 1).indexOf(attr) * 11)
        : currentY + (attrs.filter(a => a.col === 2).indexOf(attr) * 11);

      // Label & Valor text
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(`${attr.label}: ${attr.value}`, colX, rowY);

      // Barra de progresso vazia
      doc.setFillColor(241, 245, 249);
      doc.rect(colX, rowY + 1.5, 80, 2, 'F');

      // Barra preenchida verde/amber/red dependendo da nota
      let barColor = [16, 185, 129]; // verde
      if (attr.value < 50) barColor = [239, 68, 68]; // vermelho
      else if (attr.value < 70) barColor = [245, 158, 11]; // amber

      doc.setFillColor(barColor[0], barColor[1], barColor[2]);
      doc.rect(colX, rowY + 1.5, (attr.value / 100) * 80, 2, 'F');
    });

    currentY += 38;

    // --- SEÇÃO: DESCRIÇÃO DO JOGADOR CONFORME CADASTRADO (ÁREA DE DESCRIÇÃO DA FOTO) ---
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DESCRIÇÃO TÁTICA E PERFIL COMPORTAMENTAL', margin, currentY);
    currentY += 6;

    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 28, 2, 2, 'FD');

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    
    // Split text para ajustar à largura
    const descText = p.description || 'Nenhum perfil tático fornecido para o atleta catalogado.';
    const splitDesc = doc.splitTextToSize(descText, pageWidth - margin * 2 - 8);
    doc.text(splitDesc, margin + 4, currentY + 6);

    currentY += 36;

    // --- SEÇÃO: HISTÓRICO DE TRANSFERÊNCIAS DETALHADO ---
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('LINHA DO TEMPO: HISTÓRICO DE TRANSFERÊNCIAS', margin, currentY);
    currentY += 6;

    if (p.transfers.length === 0) {
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Atleta sem transferências registradas (pertencente à base ou em primeiro contrato).', margin, currentY);
    } else {
      // Desenhar cronologia simplificada
      // Linha vertical cinza
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      const totalLines = p.transfers.length;
      doc.line(margin + 4, currentY + 1, margin + 4, currentY + (totalLines * 9) - 7);

      // Ordenar por data mais antiga primeiro para mostrar progresso da carreira
      const oldToNewTransfers = [...p.transfers].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      oldToNewTransfers.forEach((tr, trIdx) => {
        const transferY = currentY + (trIdx * 9);
        
        // Ponto na timeline
        doc.setFillColor(34, 197, 94); // emerald-500
        doc.circle(margin + 4, transferY + 1, 1.2, 'F');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        const trDate = tr.date ? tr.date.split('-').reverse().join('/') : '';
        doc.text(`${trDate}`, margin + 8, transferY + 2.2);

        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`[${tr.type}]`, margin + 28, transferY + 2.2);

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const routeText = `De: ${tr.fromTeam} -> Para: ${tr.toTeam}`;
        doc.text(routeText, margin + 63, transferY + 2.2);

        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(180, 83, 9); // amber-700
        doc.text(`${tr.fee}`, margin + 155, transferY + 2.2);
      });
    }

    addFooter(pageNum, players.length + 1);
  });

  // Salvar o arquivo
  const filename = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
