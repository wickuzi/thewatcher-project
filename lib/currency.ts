/**
 * Formatea un número como moneda en Córdobas (NIO)
 * @param amount Cantidad a formatear
 * @returns Cadena formateada con el símbolo de C$ y separadores de miles
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-NI', {
    style: 'currency',
    currency: 'NIO',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  .format(amount)
  .replace(/^\D+/, 'C$ '); // Reemplaza el símbolo de moneda por C$
}

/**
 * Convierte un precio de USD a NIO
 * @param usdAmount Cantidad en USD
 * @param exchangeRate Tasa de cambio (opcional, por defecto 36.5)
 * @returns Cantidad equivalente en NIO
 */
export function usdToNio(usdAmount: number, exchangeRate: number = 36.5): number {
  return usdAmount * exchangeRate;
}

/**
 * Convierte un precio de NIO a USD
 * @param nioAmount Cantidad en NIO
 * @param exchangeRate Tasa de cambio (opcional, por defecto 36.5)
 * @returns Cantidad en USD
 */
export function nioToUsd(nioAmount: number, exchangeRate: number = 36.5): number {
  return nioAmount / exchangeRate;
}
