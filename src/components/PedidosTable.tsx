'use client';

import React from 'react';
import { Pedido } from '@/types/pedido';
import { MessageCircle, MapPin, Printer, Edit2, Trash2, Clock, Check, AlertCircle } from 'lucide-react';

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
      <div className="w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-emerald-900 text-white font-semibold text-[11px] tracking-wider uppercase border-b border-emerald-950">
              <th className="py-2.5 px-2 text-center w-[75px]">Hecho</th>
              <th className="py-2.5 px-3 min-w-[130px] w-[15%]">Cliente / Celular</th>
              <th className="py-2.5 px-3 min-w-[180px] w-[26%]">Ramo / Detalle</th>
              <th className="py-2.5 px-2 min-w-[140px] w-[18%]">Pagos & Saldo</th>
              <th className="py-2.5 px-2 text-center w-[85px]">Ciudad</th>
              <th className="py-2.5 px-2 min-w-[150px] w-[18%]">Entrega & Horario</th>
              <th className="py-2.5 px-2 text-center w-[75px]">Entregado</th>
              <th className="py-2.5 px-2 text-center w-[75px]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pedidos.map((pedido, idx) => {
              const hasSaldo = Number(pedido.saldo) > 0;
              const isPuno = pedido.ciudad?.toLowerCase().includes('puno');
              const isDelivery = pedido.tipo_entrega === 'Delivery';

              const whatsappText = encodeURIComponent(
                `¡Hola! 🌸 Te saludamos de la Florería respecto a tu pedido de *${pedido.producto}*. Queríamos coordinar la entrega programada para hoy a las ${pedido.hora}.`
              );

              return (
                <tr
                  key={pedido.id}
                  className={`transition-colors hover:bg-rose-50/40 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  } ${!pedido.hecho ? 'border-l-4 border-l-rose-500' : ''}`}
                >
                  {/* 1. HECHO */}
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => onToggleHecho(pedido.id, pedido.hecho)}
                      title={pedido.hecho ? 'Marcar como pendiente' : 'Marcar como elaborado'}
                      className={`inline-flex items-center justify-center w-16 py-1 px-1.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 ${
                        pedido.hecho
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                      }`}
                    >
                      {pedido.hecho ? 'Sí ▾' : 'No ▾'}
                    </button>
                  </td>

                  {/* 2. CLIENTE / CELULAR */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {pedido.celular}
                      </span>
                      <a
                        href={`https://wa.me/51${pedido.celular}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Escribir a WhatsApp"
                        className="inline-flex items-center p-0.5 rounded text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    {pedido.cliente ? (
                      <p className="text-[11px] text-slate-600 truncate max-w-[130px] font-medium" title={pedido.cliente}>
                        👤 {pedido.cliente}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">{pedido.id}</span>
                    )}
                  </td>

                  {/* 3. PRODUCTO / DETALLE */}
                  <td className="py-2 px-3">
                    <div className="font-bold text-slate-900 capitalize leading-snug line-clamp-1" title={pedido.producto}>
                      {pedido.producto}
                    </div>
                    {pedido.dedicatoria && (
                      <div className="text-[10px] text-rose-700 italic bg-rose-50 px-1.5 py-0.5 rounded mt-0.5 line-clamp-1 border border-rose-100/60" title={pedido.dedicatoria}>
                        💌 &ldquo;{pedido.dedicatoria}&rdquo;
                      </div>
                    )}
                    {pedido.notas && (
                      <div className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-0.5 inline-block line-clamp-1" title={pedido.notas}>
                        ⚠️ {pedido.notas}
                      </div>
                    )}
                  </td>

                  {/* 4. PAGOS & SALDO */}
                  <td className="py-2 px-2">
                    <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                      {Number(pedido.pago_yape) > 0 && (
                        <span className="inline-block px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                          Yape S/ {Number(pedido.pago_yape).toFixed(0)}
                        </span>
                      )}
                      {Number(pedido.pago_efectivo) > 0 && (
                        <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                          Efec S/ {Number(pedido.pago_efectivo).toFixed(0)}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5">
                      {hasSaldo ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200 animate-pulse">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Saldo: S/ {Number(pedido.saldo).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Cancelado
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. CIUDAD */}
                  <td className="py-2 px-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isPuno
                          ? 'bg-emerald-700 text-white'
                          : 'bg-purple-700 text-white'
                      }`}
                    >
                      {pedido.ciudad}
                    </span>
                  </td>

                  {/* 6. ENTREGA & HORARIO */}
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-800">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{pedido.fecha.slice(5)} - {pedido.hora}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          isDelivery
                            ? 'bg-sky-50 text-sky-800 border border-sky-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isDelivery ? `🛵 Deliv S/ ${Number(pedido.costo_delivery).toFixed(0)}` : '🛍️ Recojo'}
                      </span>
                    </div>
                    {isDelivery && pedido.direccion && (
                      <p className="text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5" title={pedido.direccion}>
                        📍 {pedido.direccion}
                      </p>
                    )}
                  </td>

                  {/* 7. ENTREGADO */}
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => onToggleEntregado(pedido.id, pedido.entregado)}
                      title={pedido.entregado ? 'Marcar como no entregado' : 'Marcar como entregado'}
                      className={`inline-flex items-center justify-center w-16 py-1 px-1.5 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 ${
                        pedido.entregado
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {pedido.entregado ? 'Sí ▾' : 'No ▾'}
                    </button>
                  </td>

                  {/* 8. ACCIONES */}
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onPrint(pedido)}
                        title="Imprimir comanda de ramo"
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEdit(pedido)}
                        title="Editar pedido"
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(pedido.id)}
                        title="Eliminar pedido"
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
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
