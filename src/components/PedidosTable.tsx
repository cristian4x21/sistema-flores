'use client';

import React from 'react';
import { Pedido, getEstadoPedido, EstadoPedido, isPedidoUrgente } from '@/types/pedido';
import { getTodayDateString } from '@/lib/mockData';
import {
  MessageCircle,
  Printer,
  Pencil,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeftRight,
  User,
  Heart,
  Truck,
  Store,
} from 'lucide-react';

interface PedidosTableProps {
  pedidos: Pedido[];
  onStatusChange: (id: string, nuevoEstado: EstadoPedido) => void;
  onRowClick: (pedido: Pedido) => void;
  onEdit: (pedido: Pedido) => void;
  onDelete: (pedido: Pedido) => void;
  onPrint: (pedido: Pedido) => void;
  onNewOrder?: () => void;
}

export const PedidosTable: React.FC<PedidosTableProps> = ({
  pedidos,
  onStatusChange,
  onRowClick,
  onEdit,
  onDelete,
  onPrint,
  onNewOrder,
}) => {
  const todayStr = getTodayDateString(0);

  if (pedidos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/80 dark:border-slate-800 p-10 sm:p-14 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full ring-2 ring-amber-300 dark:ring-amber-700/60 shadow-md shadow-amber-200/50 dark:shadow-none mx-auto mb-3.5 overflow-hidden bg-amber-50">
          <img
            src="/logo-loany-circle.png"
            alt="Loany Detalles"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-amber-950 dark:text-white font-brand">Aún no hay pedidos en esta vista</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto">
          El sistema de <strong>Loany Detalles</strong> está 100% limpio y listo para empezar a registrar los pedidos reales de tu negocio.
        </p>
        {onNewOrder && (
          <button
            type="button"
            onClick={onNewOrder}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl shadow-md shadow-amber-300/50 dark:shadow-none text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer font-brand"
          >
            <span>+ Registrar Primer Pedido</span>
          </button>
        )}
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
      {/* Indicador táctil para teléfonos móviles */}
      <div className="md:hidden px-4 py-2 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Desliza la tabla para ver todos los datos</span>
        </span>
        <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
          {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
        </span>
      </div>

      <div className="w-full overflow-x-auto touch-pan-x touch-scroll select-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full min-w-[760px] md:min-w-full text-left border-collapse text-xs">
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
                `¡Hola! Te saludamos de *Loany Detalles* respecto a tu pedido de *${pedido.producto}*. Queríamos coordinar la entrega programada para hoy a las ${pedido.hora}.`
              );

              // Estilos de semáforo único con indicador circular consistente
              const statusConfig = {
                pendiente: {
                  label: 'Pendiente',
                  desc: 'Por iniciar',
                  style: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
                  dot: 'bg-rose-500',
                },
                confeccion: {
                  label: 'En Confección',
                  desc: 'En taller',
                  style: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
                  dot: 'bg-amber-500',
                },
                listo: {
                  label: 'Listo Entrega',
                  desc: 'Esperando despacho',
                  style: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
                  dot: 'bg-emerald-500',
                },
                entregado: {
                  label: 'Entregado',
                  desc: 'Finalizado',
                  style: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
                  dot: 'bg-slate-400',
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
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot} shrink-0`} />
                        <span>{statusConfig.label}</span>
                      </span>
                      <span className="text-[10px] opacity-60">▾</span>
                    </button>
                    {esUrgente && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 font-extrabold mt-0.5 animate-pulse">
                        <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>¡Hora próxima!</span>
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
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[130px] mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{pedido.cliente}</span>
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
                      <p className="text-[11px] text-rose-700 dark:text-rose-300 italic bg-rose-50/70 dark:bg-rose-950/40 px-2 py-0.5 rounded-md mt-0.5 line-clamp-1 border border-rose-100 dark:border-rose-900/40 flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500 shrink-0" />
                        <span className="truncate">&ldquo;{pedido.dedicatoria}&rdquo;</span>
                      </p>
                    )}
                    {pedido.notas && (
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded mt-0.5 inline-flex items-center gap-1 line-clamp-1">
                        <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{pedido.notas}</span>
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
                        className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[10px] font-bold ${
                          isDelivery
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {isDelivery ? (
                          <>
                            <Truck className="w-3 h-3 text-sky-600" />
                            <span>Delivery S/ {Number(pedido.costo_delivery).toFixed(0)}</span>
                          </>
                        ) : (
                          <>
                            <Store className="w-3 h-3 text-emerald-600" />
                            <span>Recojo</span>
                          </>
                        )}
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
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(pedido)}
                        title="Editar pedido"
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(pedido)}
                        title="Eliminar pedido"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
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
