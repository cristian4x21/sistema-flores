import { Pedido } from '@/types/pedido';

// Obtener fecha en formato YYYY-MM-DD
export function getTodayDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// Catálogo base vacío listo para operación real (sin pedidos de prueba)
export const INITIAL_PEDIDOS: Pedido[] = [];
