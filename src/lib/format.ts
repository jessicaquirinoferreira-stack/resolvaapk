/**
 * Utilitários de formatação para moeda e valores no padrão Real Brasileiro (BRL - R$)
 */

export function formatCurrency(value: number | string | null | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : (value ?? 0);
  return `R$ ${num.toFixed(2).replace('.', ',')}`;
}

export function formatHourlyRate(value: number | string | null | undefined): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : (value ?? 0);
  return `R$ ${num.toFixed(2).replace('.', ',')}/h`;
}
