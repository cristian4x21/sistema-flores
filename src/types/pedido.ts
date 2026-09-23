export type Ciudad = 'Puno' | 'Juliaca' | string;
export type TipoEntrega = 'Delivery' | 'Recojo';

export type EstadoPedido = 'pendiente' | 'confeccion' | 'listo' | 'entregado';

export interface Pedido {
  id: string;
  celular: string; // 9 dígitos
  cliente?: string; // Nombre del cliente o quien recibe
  producto: string; // Descripción del ramo/detalle
  hecho: boolean; // ¿Ramo elaborado/armado?
  entregado: boolean; // ¿Entregado al cliente?
  estado?: EstadoPedido; // Semáforo de estado único
  pago_yape: number; // Monto pagado por Yape o Plin
  pago_efectivo: number; // Monto pagado en efectivo
  saldo: number; // Saldo pendiente
  costo_delivery: number; // Costo por delivery
  precio_producto: number; // Precio del producto
  ciudad: Ciudad; // Puno o Juliaca
  fecha: string; // YYYY-MM-DD
  hora: string; // ej. 9am, 12pm, 1pm, 6pm
  tipo_entrega: TipoEntrega; // Delivery o Recojo
  direccion?: string; // Dirección de entrega
  dedicatoria?: string; // Mensaje de la tarjeta
  notas?: string; // Observaciones
  created_at?: string;
}

export type PedidoInput = Omit<Pedido, 'id' | 'created_at'>;

/**
 * Resuelve el estado único del semáforo para un pedido.
 */
export function getEstadoPedido(p: Pedido): EstadoPedido {
  if (p.entregado) return 'entregado';
  if (p.estado) return p.estado;
  if (p.hecho) return 'listo';
  return 'pendiente';
}

/**
 * Convierte cualquier texto de hora (ej: "9:00 am", "1pm", "12pm", "6:30 pm")
 * a minutos desde las 00:00 para ordenamiento cronológico preciso.
 */
export function parseHoraToMinutes(horaStr: string): number {
  if (!horaStr) return 9999;
  const raw = horaStr.trim().toLowerCase();
  
  const isPM = raw.includes('pm') || raw.includes('p.m.') || raw.includes('tarde') || raw.includes('noche');
  const isAM = raw.includes('am') || raw.includes('a.m.') || raw.includes('mañana');

  const numbers = raw.replace(/[^\d:]/g, '').split(':');
  let hours = parseInt(numbers[0], 10);
  const minutes = numbers[1] ? parseInt(numbers[1], 10) : 0;

  if (isNaN(hours)) return 9999;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Determina si un pedido es urgente (ej: hoy, aún sin entregar, y la hora está cerca o ya pasó).
 */
export function isPedidoUrgente(p: Pedido, todayDateStr: string): boolean {
  if (p.entregado) return false;
  if (p.fecha !== todayDateStr) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const pedidoMinutes = parseHoraToMinutes(p.hora);

  // Si ya pasó la hora o faltan menos de 90 minutos para la entrega
  return pedidoMinutes <= currentMinutes + 90;
}
