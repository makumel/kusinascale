import { Recipe, CostingBreakdown } from '../types/recipe';
import { formatPHP } from './costingEngine';

function loadLogoImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export type ImageExportFormat = 'png' | 'jpeg' | 'gif';

export async function exportRecipeKitchenSheet(
  recipe: Recipe,
  portions: number,
  format: ImageExportFormat = 'png'
): Promise<void> {
  const scale = portions / recipe.baseServings;
  const canvasWidth = 1200;
  const logo = await loadLogoImage('/brand-logo-main.png');

  // Estimate required canvas height dynamically
  const ingCount = recipe.ingredients.length;
  const stepsText = recipe.instructions.join(' ');
  const estimatedHeight = Math.max(1400, 680 + ingCount * 44 + Math.ceil(stepsText.length / 50) * 28 + (recipe.chefTips?.length || 0) * 55);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = estimatedHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, canvasWidth, estimatedHeight);

  // Washed Out Brand Watermark Behind Text (12% opacity)
  if (logo) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    const wmWidth = 620;
    const wmHeight = (logo.height / logo.width) * wmWidth;
    const wmX = (canvasWidth - wmWidth) / 2;
    const wmY = 460;
    ctx.drawImage(logo, wmX, wmY, wmWidth, wmHeight);

    // Subtle security text pattern
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 24px "Playfair Display", Georgia, serif';
    ctx.rotate(-0.12);
    for (let row = 400; row < estimatedHeight; row += 260) {
      ctx.fillText('KUSINAKITA • HINDI ITO AI • PROVEN RECIPES', 80, row);
      ctx.fillText('MAY KITA SA KUSINA • KITA-KITS SA KUSINA', 700, row);
    }
    ctx.restore();
  }

  // Top Accent Banner
  ctx.fillStyle = '#047857';
  ctx.fillRect(0, 0, canvasWidth, 16);

  // Header Box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(40, 36, canvasWidth - 80, 210);
  ctx.strokeStyle = '#e7e5e4';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 36, canvasWidth - 80, 210);

  // Draw Brand Logo
  if (logo) {
    ctx.drawImage(logo, 60, 50, 160, 150);
  }

  // Brand Header Texts
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.fillText('KUSINAKITA', 245, 95);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MAY KITA SA KUSINA • KITA-KITS SA KUSINA', 245, 125);

  ctx.fillStyle = '#78716c';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Commercial Kitchen Portion Sheet & Sourcing Checklist • Hindi Ito AI', 245, 150);

  // Trust Badge Pill
  ctx.fillStyle = '#ecfdf5';
  ctx.fillRect(245, 168, 380, 32);
  ctx.strokeStyle = '#a7f3d0';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(245, 168, 380, 32);

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PROVEN & TESTED CARINDERIA STANDARD (TAMANG SANDOK)', 257, 189);

  // Recipe Title Box
  const dateStr = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 32px "Playfair Display", Georgia, serif';
  ctx.fillText(recipe.name, 60, 295);

  ctx.fillStyle = '#d97706';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${recipe.categoryLabel.toUpperCase()} • ${recipe.difficulty.toUpperCase()}`, 60, 325);

  // Portions Highlight Box
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(canvasWidth - 360, 255, 300, 80);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2;
  ctx.strokeRect(canvasWidth - 360, 255, 300, 80);

  ctx.fillStyle = '#78350f';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TARGET PORTIONS & SCALE', canvasWidth - 340, 280);

  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillText(`${portions} PAX (${scale.toFixed(1)}x Batch)`, canvasWidth - 340, 318);

  // Column Split: Left = Ingredients (520px), Right = Instructions & Tips (540px)
  let y = 375;

  // Left Section Header: Ingredients
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MGA SANGKAP NA PAMAMALENGKEHIN', 60, y);

  ctx.fillStyle = '#78716c';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`(Naka-scale para sa ${portions} pax)`, 60, y + 20);

  ctx.strokeStyle = '#d6d3d1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(60, y + 28);
  ctx.lineTo(540, y + 28);
  ctx.stroke();

  // Right Section Header: Instructions
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PARAAN NG PAGLULUTO (COMMERCIAL PREP)', 600, y);

  ctx.beginPath();
  ctx.moveTo(600, y + 28);
  ctx.lineTo(canvasWidth - 60, y + 28);
  ctx.stroke();

  y += 50;
  const startY = y;

  // Render Ingredients
  recipe.ingredients.forEach((ing, idx) => {
    const scaledQty = Math.round(ing.quantity * scale * 100) / 100;

    // Checkbox square
    ctx.strokeStyle = '#a8a29e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, y - 14, 16, 16);

    ctx.fillStyle = '#292524';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${idx + 1}. ${ing.name}`, 88, y);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    const amountStr = `${scaledQty} ${ing.unit}`;
    const amountWidth = ctx.measureText(amountStr).width;
    ctx.fillText(amountStr, 530 - amountWidth, y);

    y += 36;
  });

  const ingEndY = y;

  // Render Instructions on Right Column
  let rightY = startY;
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';

  recipe.instructions.forEach((step, idx) => {
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Hakbang ${idx + 1}:`, 600, rightY);
    rightY += 20;

    ctx.fillStyle = '#292524';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    const lines = wrapText(ctx, step, 540);
    lines.forEach((line) => {
      ctx.fillText(line, 600, rightY);
      rightY += 19;
    });
    rightY += 12;
  });

  // Render Chef Negosyo Tips
  if (recipe.chefTips && recipe.chefTips.length > 0) {
    rightY += 10;
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DISKARTE SA NEGOSYO AT TAMANG SANDOK:', 600, rightY);
    rightY += 22;

    recipe.chefTips.forEach((tip) => {
      ctx.fillStyle = '#78350f';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      const lines = wrapText(ctx, `• ${tip}`, 540);
      lines.forEach((line) => {
        ctx.fillText(line, 600, rightY);
        rightY += 19;
      });
      rightY += 6;
    });
  }

  // Footer Watermark & Authenticity Seal
  const footerY = Math.max(ingEndY, rightY) + 50;
  ctx.fillStyle = '#f5f5f4';
  ctx.fillRect(40, footerY, canvasWidth - 80, 80);
  ctx.strokeStyle = '#e7e5e4';
  ctx.strokeRect(40, footerY, canvasWidth - 80, 80);

  ctx.fillStyle = '#44403c';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KUSINAKITA NEGOSYO OS • HINDI ITO AI • PROPRIETARY RECIPE STANDARD', 65, footerY + 34);

  ctx.fillStyle = '#78716c';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Nilikha noong ${dateStr} para sa opisyal na paggamit sa kusina. Eksklusibo sa https://kusinakita.mikabiz.space`, 65, footerY + 56);

  // Bottom Accent Bar
  ctx.fillStyle = '#047857';
  ctx.fillRect(0, estimatedHeight - 14, canvasWidth, 14);

  let mimeType = 'image/png';
  let extension = 'png';
  if (format === 'jpeg') {
    mimeType = 'image/jpeg';
    extension = 'jpg';
  } else if (format === 'gif') {
    mimeType = 'image/gif';
    extension = 'gif';
  }
  const filename = `KusinaKita_${recipe.name.replace(/\s+/g, '_')}_${portions}pax.${extension}`;

  canvas.toBlob((blob) => {
    if (blob) {
      triggerDownload(blob, filename);
    }
  }, mimeType, 0.95);
}

export async function exportCostingBreakdownSheet(
  recipe: Recipe,
  breakdown: CostingBreakdown,
  format: ImageExportFormat = 'png'
): Promise<void> {
  const canvasWidth = 1200;
  const canvasHeight = 1100;
  const logo = await loadLogoImage('/brand-logo-main.png');

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Washed Out Brand Watermark Behind Text (12% opacity)
  if (logo) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    const wmWidth = 600;
    const wmHeight = (logo.height / logo.width) * wmWidth;
    const wmX = (canvasWidth - wmWidth) / 2;
    const wmY = 440;
    ctx.drawImage(logo, wmX, wmY, wmWidth, wmHeight);

    // Subtle security text pattern
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 24px "Playfair Display", Georgia, serif';
    ctx.rotate(-0.12);
    ctx.fillText('KUSINAKITA COSTING ENGINE • PROPRIETARY MARGIN', 80, 520);
    ctx.fillText('KUSINAKITA • NEVER EXCEL • PROVEN & TESTED', 100, 800);
    ctx.restore();
  }

  // Top Accent Banner
  ctx.fillStyle = '#047857';
  ctx.fillRect(0, 0, canvasWidth, 16);

  // Header Box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(40, 36, canvasWidth - 80, 190);
  ctx.strokeStyle = '#e7e5e4';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 36, canvasWidth - 80, 190);

  if (logo) {
    ctx.drawImage(logo, 60, 48, 145, 140);
  }

  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 32px "Playfair Display", Georgia, serif';
  ctx.fillText('KUSINAKITA FOOD COSTING & SRP ENGINE', 225, 90);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('OPISYAL NA PATAKARAN SA PUHUNAN AT TARGET MARGIN', 225, 120);

  ctx.fillStyle = '#78716c';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Reseta: ${recipe.name} (${recipe.categoryLabel}) • Batch Size: ${breakdown.servings} PAX (${breakdown.scaleMultiplier}x Scale)`, 225, 146);

  // Timestamp
  const dateStr = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  ctx.fillStyle = '#a8a29e';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText(`Computed on ${dateStr} • Never Excel • 100% Verified Pinoy Formula`, 225, 172);

  // Big Metric Cards (3 Columns)
  const cardWidth = 345;
  const cardY = 250;
  const cardHeight = 160;

  // Card 1: Presyo ng Benta (SRP)
  ctx.fillStyle = '#ecfdf5';
  ctx.fillRect(45, cardY, cardWidth, cardHeight);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, cardY, cardWidth, cardHeight);

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PRESYO NG BENTA (SRP)', 65, cardY + 36);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 44px "JetBrains Mono", monospace';
  ctx.fillText(formatPHP(breakdown.suggestedSrp), 65, cardY + 95);

  ctx.fillStyle = '#059669';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Target Gross Margin: ${breakdown.targetMarginPercent}%`, 65, cardY + 130);

  // Card 2: Cost Per Serving
  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(425, cardY, cardWidth, cardHeight);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(425, cardY, cardWidth, cardHeight);

  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PUHUNAN BAWAT SANDOK (COST)', 445, cardY + 36);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 44px "JetBrains Mono", monospace';
  ctx.fillText(formatPHP(breakdown.costPerServing), 445, cardY + 95);

  ctx.fillStyle = '#78350f';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Total Batch Puhunan: ${formatPHP(breakdown.totalProductionCost)}`, 445, cardY + 130);

  // Card 3: Net Profit Per Serving
  ctx.fillStyle = '#eff6ff';
  ctx.fillRect(805, cardY, cardWidth, cardHeight);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.strokeRect(805, cardY, cardWidth, cardHeight);

  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MALINIS NA TUBO BAWAT SERVING', 825, cardY + 36);

  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 44px "JetBrains Mono", monospace';
  ctx.fillText(formatPHP(breakdown.profitPerServing), 825, cardY + 95);

  ctx.fillStyle = '#1d4ed8';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Kabuuang Kita sa Batch: ${formatPHP(breakdown.netBatchProfit)}`, 825, cardY + 130);

  // Detailed Cost Breakdown Table
  let tableY = 450;
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 20px "Playfair Display", Georgia, serif';
  ctx.fillText('Komposisyon ng Gastusin sa Bawat Batch', 50, tableY);

  tableY += 20;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(45, tableY, canvasWidth - 90, 310);
  ctx.strokeStyle = '#e7e5e4';
  ctx.strokeRect(45, tableY, canvasWidth - 90, 310);

  const rows = [
    { label: 'Hilaw na Sangkap (Protein, Gulay, Rekado)', cost: breakdown.rawIngredientsCost },
    { label: 'Gasul / LPG Kalan Consumption', cost: breakdown.overheadBreakdown.lpgCost },
    { label: 'Kuryente, Tubig at Panlinis (Utilities)', cost: breakdown.overheadBreakdown.utilitiesCost },
    { label: 'Tulong sa Pagluluto at Tagasilbi (Labor)', cost: breakdown.overheadBreakdown.laborCost },
    { label: 'Lagayan, Supot at Spork (Packaging)', cost: breakdown.overheadBreakdown.packagingCost },
    { label: 'Tapyas, Sunog at Spoilage Buffer (Shrinkage)', cost: breakdown.overheadBreakdown.shrinkageBufferCost },
  ];

  let rowY = tableY + 38;
  rows.forEach((row, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#fafaf9' : '#ffffff';
    ctx.fillRect(46, rowY - 26, canvasWidth - 92, 42);

    ctx.fillStyle = '#292524';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(row.label, 70, rowY);

    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    const costStr = formatPHP(row.cost);
    const costWidth = ctx.measureText(costStr).width;
    ctx.fillText(costStr, canvasWidth - 80 - costWidth, rowY);

    rowY += 44;
  });

  // Daily & Monthly ROI Projection Box
  const projY = 820;
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(45, projY, canvasWidth - 90, 140);
  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, projY, canvasWidth - 90, 140);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PROYEKSYON SA BUWANANG KITA (26 OPERATING DAYS)', 75, projY + 40);

  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Target Benta: ${breakdown.dailyProjection.unitsPerDay} servings kada araw`, 75, projY + 70);

  ctx.fillText(`Arawang Malinis na Tubo: ${formatPHP(breakdown.dailyProjection.dailyProfit)}`, 75, projY + 100);

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ESTIMATED MONTHLY NET PROFIT:', 680, projY + 45);

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillText(formatPHP(breakdown.dailyProjection.monthlyProfit), 680, projY + 95);

  // Authenticity Watermark Footer
  const footY = 1010;
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KUSINAKITA CERTIFIED NEGOSYO ENGINE • HINDI ITO AI • PROPRIETARY FOOD COSTING', 50, footY);

  ctx.fillStyle = '#78716c';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Protektadong formula mula sa retiradong Head Cook at Fastfood Entrepreneur. https://kusinakita.mikabiz.space', 50, footY + 24);

  // Bottom Accent Bar
  ctx.fillStyle = '#047857';
  ctx.fillRect(0, canvasHeight - 14, canvasWidth, 14);

  let mimeType = 'image/png';
  let extension = 'png';
  if (format === 'jpeg') {
    mimeType = 'image/jpeg';
    extension = 'jpg';
  } else if (format === 'gif') {
    mimeType = 'image/gif';
    extension = 'gif';
  }
  const filename = `KusinaKita_Costing_${recipe.name.replace(/\s+/g, '_')}_${breakdown.servings}pax.${extension}`;

  canvas.toBlob((blob) => {
    if (blob) {
      triggerDownload(blob, filename);
    }
  }, mimeType, 0.95);
}
