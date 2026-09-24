'use client';

import React from 'react';
import { Pedido, getEstadoPedido, EstadoPedido, isPedidoUrgente } from '@/types/pedido';
import { getTodayDateString } from '@/lib/mockData';
import {
  MessageCircle,
  Clock,
  MapPin,
  Printer,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  User,
  Heart,
  Truck,
  Store,
} from 'lucide-react';

interface PedidosCardsProps {
  pedidos: Pedido[];
  onStatusChange: (id: string, nuevoEstado: EstadoPedido) => void;
  onRowClick: (pedido: Pedido) => void;
  onEdit: (pedido: Pedido) => void;
  onDelete: (pedido: Pedido) => void;
  onPrint: (pedido: Pedido) => void;
  onNewOrder?: () => void;
}

export const PedidosCards: React.FC<PedidosCardsProps> = ({
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pedidos.map((pedido) => {
        const estado = getEstadoPedido(pedido);
        const hasSaldo = Number(pedido.saldo) > 0;
        const isPuno = pedido.ciudad?.toLowerCase().includes('puno');
        const isDelivery = pedido.tipo_entrega === 'Delivery';
        const esUrgente = isPedidoUrgente(pedido, todayStr);

        const whatsappText = encodeURIComponent(
          `¡Hola! Te saludamos de *Loany Detalles* respecto a tu pedido de *${pedido.producto}*. Queríamos coordinar la entrega programada para hoy a las ${pedido.hora}.`
        );

        const statusConfig = {
          pendiente: {
            label: 'Pendiente',
            desc: 'Por iniciar',
            style: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
            dot: 'bg-rose-500',
          },
          confeccion: {
            label: 'En Confección',
            desc: 'En taller',
            style: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
            dot: 'bg-amber-500',
          },
          listo: {
            label: 'Listo Entrega',
            desc: 'Esperando despacho',
            style: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
            dot: 'bg-emerald-500',
          },
          entregado: {
            label: 'Entregado',
            desc: 'Finalizado',
            style: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
            dot: 'bg-slate-400',
          },
        }[estado];

        return (
          <div
            key={pedido.id}
            onClick={() => onRowClick(pedido)}
            className={`rounded-3xl border transition-all p-4.5 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between ${
              esUrgente
                ? 'bg-rose-50/90 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 ring-2 ring-rose-400/40'
                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-amber-200'
            }`}
          >
            <div>
              {/* Encabezado */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                    {pedido.id}
                  </span>
                  <h3 className="font-black text-slate-900 dark:text-white text-base capitalize leading-snug truncate">
                    {pedido.producto}
                  </h3>
                  {pedido.cliente && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{pedido.cliente}</span>
                    </p>
                  )}
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                    isPuno
                      ? 'bg-emerald-700 text-white'
                      : 'bg-purple-700 text-white'
                  }`}
                >
                  {pedido.ciudad}
                </span>
              </div>

              {/* Dedicatoria */}
              {pedido.dedicatoria && (
                <div className="text-xs bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl p-2.5 text-rose-800 dark:text-rose-300 italic mb-3 line-clamp-2 flex items-start gap-1">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500 shrink-0 mt-0.5" />
                  <span className="truncate">&ldquo;{pedido.dedicatoria}&rdquo;</span>
                </div>
              )}

              {/* Horario y Modalidad */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 mb-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pedido.hora}</span>
                  <span className="text-[10px] font-normal text-slate-400">({pedido.fecha.slice(5)})</span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
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
                {isDelivery && pedido.direccion && (
                  <div className="col-span-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1 pt-1 border-t border-slate-200 dark:border-slate-700 truncate">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                    <span className="truncate">{pedido.direccion}</span>
                  </div>
                )}
              </div>

              {/* Saldo y Pagos */}
              <div className="flex items-center justify-between p-2.5 bg-slate-100/70 dark:bg-slate-800/80 rounded-2xl mb-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">PAGADO</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">
                    S/ {(Number(pedido.pago_yape) + Number(pedido.pago_efectivo)).toFixed(2)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">SALDO PENDIENTE</span>
                  {hasSaldo ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500 text-white font-black text-xs font-mono">
                      <AlertCircle className="w-3 h-3" />
                      S/ {Number(pedido.saldo).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 justify-end">
                      <CheckCircle2 className="w-3 h-3" /> Cancelado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pie de la Tarjeta con Semáforo y Acciones */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              
              {/* Botón de Semáforo Único */}
              <button
                type="button"
                onClick={(e) => cycleStatus(e, pedido.id, estado)}
                className={`w-full py-2 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-between shadow-2xs active:scale-95 ${statusConfig.style}`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot} shrink-0`} />
                  <span>{statusConfig.label}</span>
                </span>
                <span className="text-[11px] opacity-75 font-semibold">Tocar para cambiar ▾</span>
              </button>

              {/* Botón WhatsApp y Acciones Rápidas */}
              <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                <a
                  href={`https://wa.me/51${pedido.celular}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp ({pedido.celular})</span>
                </a>

                <button
                  type="button"
                  onClick={() => onPrint(pedido)}
                  title="Imprimir comanda"
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(pedido)}
                  title="Editar pedido"
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(pedido)}
                  title="Eliminar pedido"
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
