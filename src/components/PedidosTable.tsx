'use client';

import React from 'react';
import { Pedido } from '@/types/pedido';
import { Phone, MessageCircle, MapPin, Printer, Edit2, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface PedidosTableProps {
  pedidos: Pedido[];
  onToggleHecho: (id: string, current: boolean) => void;
  onToggleEntregado: (id: string, current: boolean) => void;
  onEdit: (pedido: Pedido) => void;
  onDelete: (id: string) => void;
  onPrint: (pedido: Pedido) => void;
}

export const PedidosTable: React.FC<PedidosTableProps> = ({
  pedidos,
  onToggleHecho,
  onToggleEntregado,
  onEdit,
  onDelete,
  onPrint,
}) => {
  if (pedidos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-3xl mb-3">
          🌸
        </div>
        <h3 className="text-base font-semibold text-slate-800">No se encontraron pedidos</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No hay pedidos registrados con los filtros seleccionados o para esta fecha.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-emerald-900 text-white font-semibold text-xs tracking-wider uppercase border-b border-emerald-950">
              <th className="py-3 px-3 text-center w-24">Hecho</th>
              <th className="py-3 px-3 min-w-[130px]">Nro. Celular</th>
              <th className="py-3 px-4 min-w-[200px]">Producto / Detalle</th>
              <th className="py-3 px-3 text-right">Yape</th>
              <th className="py-3 px-3 text-right">Saldo</th>
              <th className="py-3 px-3 text-right">Efectivo</th>
              <th className="py-3 px-3 text-center">Ciudad</th>
              <th className="py-3 px-3">Fecha</th>
              <th className="py-3 px-3">Hora</th>
              <th className="py-3 px-3 text-center">Modalidad</th>
              <th className="py-3 px-3 text-right">C. Delivery</th>
              <th className="py-3 px-3 text-center w-24">Entregado</th>
              <th className="py-3 px-3 text-center w-28">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pedidos.map((pedido, idx) => {
              const hasSaldo = Number(pedido.saldo) > 0;
              const isPuno = pedido.ciudad?.toLowerCase().includes('puno');
              const isDelivery = pedido.tipo_entrega === 'Delivery';

              // Mensaje de WhatsApp predeterminado para el cliente
              const whatsappText = encodeURIComponent(
                `¡Hola! 🌸 Te saludamos de la Florería respecto a tu pedido de *${pedido.producto}*. Queríamos coordinar la entrega programada para hoy a las ${pedido.hora}.`
              );

              return (
                <tr
                  key={pedido.id}
                  className={`transition-colors hover:bg-rose-50/40 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  } ${!pedido.hecho ? 'border-l-4 border-l-rose-500' : ''}`}
                >
                  {/* 1. HECHO (Dropdown / Toggle idéntico a la imagen verde/rojo) */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onToggleHecho(pedido.id, pedido.hecho)}
                      title={pedido.hecho ? 'Marcar como pendiente' : 'Marcar como elaborado'}
                      className={`inline-flex items-center justify-center gap-1 w-20 py-1 px-2.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 ${
                        pedido.hecho
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      }`}
                    >
                      {pedido.hecho ? 'Sí ▾' : 'No ▾'}
                    </button>
                  </td>

                  {/* 2. NRO. CELULAR (con enlace a WhatsApp y llamada directa) */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 font-mono font-medium text-slate-800">
                      <span>{pedido.celular}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={`https://wa.me/51${pedido.celular}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Escribir al WhatsApp del cliente"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        WhatsApp
                      </a>
                    </div>
                  </td>

                  {/* 3. PRODUCTO / DETALLE */}
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-900 capitalize">
                      {pedido.producto}
                    </div>
                    {pedido.cliente && (
                      <div className="text-xs text-slate-500 font-normal mt-0.5">
                        👤 {pedido.cliente}
                      </div>
                    )}
                    {pedido.dedicatoria && (
                      <div className="text-[11px] text-rose-700 italic bg-rose-50/80 px-2 py-0.5 rounded-md mt-1 border border-rose-100 line-clamp-1" title={pedido.dedicatoria}>
                        💌 &ldquo;{pedido.dedicatoria}&rdquo;
                      </div>
                    )}
                    {pedido.notas && (
                      <div className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                        ⚠️ {pedido.notas}
                      </div>
                    )}
                  </td>

                  {/* 4. YAPE */}
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">
                    {Number(pedido.pago_yape) > 0 ? (
                      <span className="text-purple-700 font-semibold">
                        {Number(pedido.pago_yape).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">0.00</span>
                    )}
                  </td>

                  {/* 5. SALDO (Resaltado en rojo si debe dinero como en la imagen) */}
                  <td className="py-2.5 px-3 text-right font-mono">
                    {hasSaldo ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 animate-pulse">
                        {Number(pedido.saldo).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">0.00</span>
                    )}
                  </td>

                  {/* 6. EFECTIVO */}
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-700">
                    {Number(pedido.pago_efectivo) > 0 ? (
                      <span className="text-emerald-700 font-semibold">
                        {Number(pedido.pago_efectivo).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">0.00</span>
                    )}
                  </td>

                  {/* 7. CIUDAD (Puno verde, Juliaca morado como en la imagen) */}
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs ${
                        isPuno
                          ? 'bg-emerald-700 text-white border-emerald-800'
                          : 'bg-purple-700 text-white border-purple-800'
                      }`}
                    >
                      {pedido.ciudad}
                    </span>
                  </td>

                  {/* 8. FECHA */}
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-medium text-xs">
                    {pedido.fecha}
                  </td>

                  {/* 9. HORA */}
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-800">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pedido.hora}</span>
                    </div>
                  </td>

                  {/* 10. MODALIDAD (Delivery celeste, Recojo verde suave como en la foto) */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        isDelivery
                          ? 'bg-sky-100 text-sky-800 border border-sky-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isDelivery ? '🛵 Delivery' : '🛍️ Recojo'}
                    </span>
                    {isDelivery && pedido.direccion && (
                      <div className="text-[10px] text-slate-500 truncate max-w-[120px] mt-0.5" title={pedido.direccion}>
                        {pedido.direccion}
                      </div>
                    )}
                  </td>

                  {/* 11. COSTO DELIVERY */}
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {Number(pedido.costo_delivery).toFixed(2)}
                  </td>

                  {/* 12. ENTREGADO (Dropdown / Toggle idéntico a la imagen verde/rojo) */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onToggleEntregado(pedido.id, pedido.entregado)}
                      title={pedido.entregado ? 'Marcar como no entregado' : 'Marcar como entregado'}
                      className={`inline-flex items-center justify-center gap-1 w-20 py-1 px-2.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 ${
                        pedido.entregado
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {pedido.entregado ? 'Sí ▾' : 'No ▾'}
                    </button>
                  </td>

                  {/* 13. ACCIONES */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {/* Imprimir Ticket / Dedicatoria */}
                      <button
                        onClick={() => onPrint(pedido)}
                        title="Imprimir comanda / tarjeta de ramo"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => onEdit(pedido)}
                        title="Editar pedido"
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => onDelete(pedido.id)}
                        title="Eliminar pedido"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
