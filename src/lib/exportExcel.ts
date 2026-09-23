import { Pedido } from '@/types/pedido';

export function exportPedidosToCSV(pedidos: Pedido[], filename = 'pedidos_floreria.csv') {
  const headers = [
    'Hecho',
    'Nro. Celular',
    'Producto',
    'Yape',
    'Saldo',
    'Efectivo',
    'Ciudad',
    'Fecha',
    'Hora',
    'Delivery/Recojo',
    'Costo Delivery',
    'Entregado',
    'Cliente',
    'Dedicatoria',
    'Direccion',
    'Notas',
  ];

  const rows = pedidos.map((p) => [
    p.hecho ? 'Sí' : 'No',
    p.celular,
    `"${(p.producto || '').replace(/"/g, '""')}"`,
    Number(p.pago_yape || 0).toFixed(2),
    Number(p.saldo || 0).toFixed(2),
    Number(p.pago_efectivo || 0).toFixed(2),
    p.ciudad || 'Puno',
    p.fecha,
    p.hora,
    p.tipo_entrega,
    Number(p.costo_delivery || 0).toFixed(2),
    p.entregado ? 'Sí' : 'No',
    `"${(p.cliente || '').replace(/"/g, '""')}"`,
    `"${(p.dedicatoria || '').replace(/"/g, '""')}"`,
    `"${(p.direccion || '').replace(/"/g, '""')}"`,
    `"${(p.notas || '').replace(/"/g, '""')}"`,
  ]);

  // UTF-8 BOM para que Excel en Windows reconozca tildes, la ñ y caracteres especiales
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
