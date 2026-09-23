'use client';

import React from 'react';
import { Pedido } from '@/types/pedido';
import { Printer, X, Heart, Clock, MapPin, AlertCircle } from 'lucide-react';

interface TicketPrintModalProps {
  pedido: Pedido | null;
  onClose: () => void;
}

export const TicketPrintModal: React.FC<TicketPrintModalProps> = ({
  pedido,
  onClose,
}) => {
  if (!pedido) return null;

  const handlePrint = () => {
    window.print();
  };

  const hasSaldo = Number(pedido.saldo) > 0;
  const targetName = pedido.cliente?.trim() || 'Cliente';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Encabezado sin impresión */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-sm">Tarjeta de Ramo (Lista para Imprimir)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO IMPRIMIBLE DE LA TARJETA (Solo lo esencial para pegar en el ramo) */}
        <div id="printable-ticket" className="p-8 bg-white text-slate-900">
          
          <div className="border-2 border-slate-800 rounded-3xl p-6 relative">
            
            {/* Cabecera floral estilizada */}
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-3xl block mb-1">🌸</span>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Detalle Especial • Florería
              </p>
              <div className="mt-1 flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                <span>{pedido.id}</span>
                <span>•</span>
                <span>{pedido.ciudad}</span>
              </div>
            </div>

            {/* 1. Destinatario (Grande y destacado) */}
            <div className="py-4 text-center border-b border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 block mb-1">
                PARA:
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
                {targetName}
              </h2>
            </div>

            {/* 2. Ramo / Producto confeccionado */}
            <div className="py-3 text-center border-b border-slate-200 bg-slate-50/60 rounded-xl my-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Arreglo Floral:
              </span>
              <p className="text-base font-extrabold text-slate-800 capitalize">
                {pedido.producto}
              </p>
            </div>

            {/* 3. Mensaje de la Tarjeta de Dedicatoria (Grande, elegante y central) */}
            <div className="py-4 my-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Mensaje de la Tarjeta</span>
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              </div>

              {pedido.dedicatoria ? (
                <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl">
                  <p className="text-base sm:text-lg font-serif italic text-slate-900 leading-relaxed">
                    &ldquo;{pedido.dedicatoria}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 text-xs italic">
                  (Sin dedicatoria escrita)
                </div>
              )}
            </div>

            {/* 4. Hora y Datos de Entrega */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-900">
                  {pedido.hora} ({pedido.fecha})
                </span>
              </div>

              <div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800">
                  {pedido.tipo_entrega === 'Delivery' ? '🛵 DELIVERY' : '🛍️ RECOJO'}
                </span>
              </div>
            </div>

            {/* Dirección si es delivery */}
            {pedido.tipo_entrega === 'Delivery' && pedido.direccion && (
              <div className="mt-2 pt-2 border-t border-dashed border-slate-200 text-xs text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span className="font-medium">{pedido.direccion}</span>
              </div>
            )}

            {/* Alerta de Saldo para el repartidor/tienda */}
            {hasSaldo && (
              <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <p className="text-xs font-extrabold text-rose-700">
                  ⚠️ COBRAR SALDO: S/ {Number(pedido.saldo).toFixed(2)}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Botones de Acción (no se imprimen) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Tarjeta para el Ramo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
