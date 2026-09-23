'use client';

import React from 'react';
import { Pedido } from '@/types/pedido';
import { MessageCircle, Phone, Clock, MapPin, Truck, Printer, Edit2, Trash2, Scissors } from 'lucide-react';

interface PedidosCardsProps {
  pedidos: Pedido[];
  onToggleHecho: (id: string, current: boolean) => void;
  onToggleEntregado: (id: string, current: boolean) => void;
  onEdit: (pedido: Pedido) => void;
  onDelete: (id: string) => void;
  onPrint: (pedido: Pedido) => void;
}

export const PedidosCards: React.FC<PedidosCardsProps> = ({
  pedidos,
  onToggleHecho,
  onToggleEntregado,
  onEdit,
  onDelete,
  onPrint,
}) => {
  if (pedidos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">No hay pedidos que coincidan con la búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pedidos.map((pedido) => {
        const hasSaldo = Number(pedido.saldo) > 0;
        const isPuno = pedido.ciudad?.toLowerCase().includes('puno');
        const isDelivery = pedido.tipo_entrega === 'Delivery';

        const whatsappText = encodeURIComponent(
          `¡Hola! 🌸 Te saludamos de la Florería respecto a tu pedido de *${pedido.producto}*. Queríamos coordinar la entrega programada para hoy a las ${pedido.hora}.`
        );

        return (
          <div
            key={pedido.id}
            className={`bg-white rounded-2xl border transition-all p-4 shadow-xs flex flex-col justify-between ${
              !pedido.hecho ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
            }`}
          >
            <div>
              {/* Encabezado de la Tarjeta */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
                    {pedido.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base capitalize leading-snug">
                    {pedido.producto}
                  </h3>
                  {pedido.cliente && (
                    <p className="text-xs text-slate-600 font-medium">👤 {pedido.cliente}</p>
                  )}
                </div>

                {/* Badge Ciudad */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isPuno
                      ? 'bg-emerald-700 text-white'
                      : 'bg-purple-700 text-white'
                  }`}
                >
                  {pedido.ciudad}
                </span>
              </div>

              {/* Dedicatoria si existe */}
              {pedido.dedicatoria && (
                <div className="text-xs bg-rose-50 border border-rose-100 rounded-xl p-2.5 text-rose-800 italic mb-3">
                  💌 &ldquo;{pedido.dedicatoria}&rdquo;
                </div>
              )}

              {/* Detalles de entrega y hora */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pedido.fecha} - {pedido.hora}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      isDelivery ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isDelivery ? '🛵 Delivery' : '🛍️ Recojo'}
                  </span>
                </div>
                {isDelivery && pedido.direccion && (
                  <div className="col-span-2 text-[11px] text-slate-600 flex items-start gap-1 pt-1 border-t border-slate-200">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                    <span>{pedido.direccion}</span>
                  </div>
                )}
                {pedido.notas && (
                  <div className="col-span-2 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded">
                    ⚠️ {pedido.notas}
                  </div>
                )}
              </div>

              {/* Desglose de pagos */}
              <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-100/70 rounded-xl font-mono mb-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">YAPE</span>
                  <span className="font-semibold text-purple-700">S/ {Number(pedido.pago_yape).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">EFECTIVO</span>
                  <span className="font-semibold text-emerald-700">S/ {Number(pedido.pago_efectivo).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SALDO</span>
                  <span
                    className={`font-bold ${
                      hasSaldo ? 'text-rose-600 animate-pulse' : 'text-slate-500'
                    }`}
                  >
                    S/ {Number(pedido.saldo).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Controles de Estado y Acciones */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              
              {/* Switches Hecho y Entregado */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onToggleHecho(pedido.id, pedido.hecho)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    pedido.hecho
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Hecho: {pedido.hecho ? 'Sí' : 'No'}</span>
                </button>

                <button
                  onClick={() => onToggleEntregado(pedido.id, pedido.entregado)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    pedido.entregado
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Entregado: {pedido.entregado ? 'Sí' : 'No'}</span>
                </button>
              </div>

              {/* Botón WhatsApp directo y botones de acción */}
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/51${pedido.celular}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp ({pedido.celular})</span>
                </a>

                <button
                  onClick={() => onPrint(pedido)}
                  title="Imprimir comanda"
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEdit(pedido)}
                  title="Editar pedido"
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDelete(pedido.id)}
                  title="Eliminar pedido"
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
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
