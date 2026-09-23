'use client';

import React from 'react';
import { Pedido, getEstadoPedido, EstadoPedido, isPedidoUrgente } from '@/types/pedido';
import { getTodayDateString } from '@/lib/mockData';
import { MessageCircle, Printer, Edit2, Trash2, Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface PedidosTableProps {
  pedidos: Pedido[];
  onStatusChange: (id: string, nuevoEstado: EstadoPedido) => void;
  onRowClick: (pedido: Pedido) => void;
  onEdit: (pedido: Pedido) => void;
  onDelete: (pedido: Pedido) => void;
  onPrint: (pedido: Pedido) => void;
}

export const PedidosTable: React.FC<PedidosTableProps> = ({
  pedidos,
  onStatusChange,
  onRowClick,
  onEdit,
  onDelete,
  onPrint,
}) => {
  const todayStr = getTodayDateString(0);

  if (pedidos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center text-3xl mb-3">
          🌸
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">No se encontraron pedidos</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No hay pedidos con los filtros seleccionados. Prueba cambiando la fecha o limpiando el buscador.
        </p>
      </div>
    );
  }

  // Ciclo rápido de semáforo
  const cycleStatus = (e: React.MouseEvent, id: string, current: EstadoPedido) => {
    e.stopPropagation();
    const nextMap: Record<EstadoPedido, EstadoPedido> = {
      pendiente: 'confeccion',
      confeccion: 'listo',
      listo: 'entregado',
      entregado: 'pendiente',
    };
    onStatusChange(id, nextMap[current]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-emerald-950 text-white font-bold text-[11px] tracking-wider uppercase border-b border-emerald-900 select-none">
              <th className="py-3 px-3 min-w-[130px] w-[15%]">Semáforo de Estado</th>
              <th className="py-3 px-3 min-w-[140px] w-[18%]">Cliente / Celular</th>
              <th className="py-3 px-3 min-w-[180px] w-[27%]">Ramo / Detalle</th>
              <th className="py-3 px-3 min-w-[110px] w-[13%]">Saldo Pendiente</th>
              <th className="py-3 px-2 text-center w-[75px]">Ciudad</th>
              <th className="py-3 px-3 min-w-[150px] w-[18%]">Horario & Entrega</th>
              <th className="py-3 px-2 text-center w-[90px]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {pedidos.map((pedido, idx) => {
              const estado = getEstadoPedido(pedido);
              const hasSaldo = Number(pedido.saldo) > 0;
              const isPuno = pedido.ciudad?.toLowerCase().includes('puno');
              const isDelivery = pedido.tipo_entrega === 'Delivery';
              const esUrgente = isPedidoUrgente(pedido, todayStr);

              const whatsappText = encodeURIComponent(
                `¡Hola! 🌸 Te saludamos de la Florería respecto a tu pedido de *${pedido.producto}*. Queríamos coordinar la entrega programada para hoy a las ${pedido.hora}.`
              );

              // Estilos de semáforo único
              const statusConfig = {
                pendiente: {
                  label: '🔴 Pendiente',
                  desc: 'Por iniciar',
                  style: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
                },
                confeccion: {
                  label: '🟡 En Confección',
                  desc: 'En taller',
                  style: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
                },
                listo: {
                  label: '🟢 Listo p/ Entrega',
                  desc: 'Esperando despacho',
                  style: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
                },
                entregado: {
                  label: '✅ Entregado',
                  desc: 'Finalizado',
                  style: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                },
              }[estado];

              return (
                <tr
                  key={pedido.id}
                  onClick={() => onRowClick(pedido)}
                  title="Haz clic para ver el detalle completo del pedido"
                  className={`cursor-pointer transition-all duration-150 select-none ${
                    esUrgente
                      ? 'bg-rose-50/90 dark:bg-rose-950/30 border-l-4 border-l-rose-500 hover:bg-rose-100/80'
                      : idx % 2 === 0
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50/90 dark:hover:bg-slate-800/60'
                      : 'bg-slate-50/40 dark:bg-slate-850/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {/* 1. SEMÁFORO DE ESTADO ÚNICO */}
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={(e) => cycleStatus(e, pedido.id, estado)}
                      title="Haz clic para cambiar al siguiente estado del semáforo"
                      className={`inline-flex items-center justify-between w-full max-w-[130px] py-1 px-2.5 rounded-xl text-xs font-bold border shadow-2xs active:scale-95 transition-all ${statusConfig.style}`}
                    >
                      <span>{statusConfig.label}</span>
                      <span className="text-[10px] opacity-60">▾</span>
                    </button>
                    {esUrgente && (
                      <span className="block text-[10px] text-rose-600 dark:text-rose-400 font-extrabold mt-0.5 animate-pulse">
                        ⚠️ ¡Hora próxima!
                      </span>
                    )}
                  </td>

                  {/* 2. CLIENTE / CELULAR */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/51${pedido.celular}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Escribir al WhatsApp del cliente"
                        className="font-mono font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 group"
                      >
                        <span>{pedido.celular}</span>
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                    {pedido.cliente ? (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[130px] mt-0.5">
                        👤 {pedido.cliente}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">{pedido.id}</span>
                    )}
                  </td>

                  {/* 3. PRODUCTO / RAMO */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white capitalize text-xs sm:text-sm line-clamp-1">
                      {pedido.producto}
                    </div>
                    {pedido.dedicatoria && (
                      <p className="text-[11px] text-rose-700 dark:text-rose-300 italic bg-rose-50/70 dark:bg-rose-950/40 px-2 py-0.5 rounded-md mt-0.5 line-clamp-1 border border-rose-100 dark:border-rose-900/40">
                        💌 &ldquo;{pedido.dedicatoria}&rdquo;
                      </p>
                    )}
                    {pedido.notas && (
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded mt-0.5 inline-block line-clamp-1">
                        ⚠️ {pedido.notas}
                      </span>
                    )}
                  </td>

                  {/* 4. SALDO PENDIENTE */}
                  <td className="py-3 px-3">
                    {hasSaldo ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500 text-white font-black text-xs shadow-2xs font-mono">
                          <AlertCircle className="w-3 h-3" />
                          S/ {Number(pedido.saldo).toFixed(2)}
                        </span>
                        <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                          Por cobrar
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cancelado</span>
                      </div>
                    )}
                  </td>

                  {/* 5. CIUDAD */}
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-2xs ${
                        isPuno
                          ? 'bg-emerald-700 text-white'
                          : 'bg-purple-700 text-white'
                      }`}
                    >
                      {pedido.ciudad}
                    </span>
                  </td>

                  {/* 6. HORARIO & ENTREGA */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 text-xs">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{pedido.hora}</span>
                      <span className="text-[10px] font-normal text-slate-400">({pedido.fecha.slice(5)})</span>
                    </div>
                    <div className="mt-0.5">
                      <span
                        className={`inline-block px-2 py-0.2 rounded-md text-[10px] font-bold ${
                          isDelivery
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {isDelivery ? `🛵 Delivery S/ ${Number(pedido.costo_delivery).toFixed(0)}` : '🛍️ Recojo'}
                      </span>
                    </div>
                  </td>

                  {/* 7. ACCIONES */}
                  <td className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPrint(pedido)}
                        title="Imprimir tarjeta de ramo"
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(pedido)}
                        title="Editar pedido"
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(pedido)}
                        title="Eliminar pedido"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
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
