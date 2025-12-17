// src/shared/utils/formatarData.ts

/**
 * Converte data ISO (AAAA-MM-DD) para formato brasileiro (DD/MM/AAAA)
 */
export function formatarDataParaBr(dataIso: string): string {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

/**
 * Converte data brasileira (DD/MM/AAAA) para formato ISO (AAAA-MM-DD)
 */
export function converterDataParaISO(dataBr: string): string {
  if (!dataBr) return '';
  const [dia, mes, ano] = dataBr.split('/');
  return `${ano}-${mes}-${dia}`;
}
