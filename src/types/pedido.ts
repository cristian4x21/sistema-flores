export type Ciudad = 'Puno' | 'Juliaca' | string;
export type TipoEntrega = 'Delivery' | 'Recojo';

export interface Pedido {
  id: string;
  celular: string; // 9 dígitos
  cliente?: string; // Nombre del cliente o quien recibe
  producto: string; // Descripción del ramo/detalle
  hecho: boolean; // ¿Ramo elaborado/armado?
  entregado: boolean; // ¿Entregado al cliente?
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
