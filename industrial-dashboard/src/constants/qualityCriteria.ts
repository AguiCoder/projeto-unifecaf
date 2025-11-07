export const QUALITY_CRITERIA = {
  PESO_MIN: 95.0,
  PESO_MAX: 105.0,
  COMPRIMENTO_MIN: 10.0,
  COMPRIMENTO_MAX: 20.0,
  CORES_PERMITIDAS: ['azul', 'verde'],
  BOX_CAPACITY: 10,
} as const;

export const REJECTION_REASONS = {
  PESO_FORA_FAIXA: 'peso fora da faixa',
  COR_INVALIDA: 'cor inválida',
  COMPRIMENTO_FORA_FAIXA: 'comprimento fora da faixa',
} as const;
