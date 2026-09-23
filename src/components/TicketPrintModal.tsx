'use client';

import React from 'react';
import { Pedido } from '@/types/pedido';
import { Printer, X, Heart, MapPin, Phone, Clock, DollarSign } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Encabezado sin impresión */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-sm">Comanda / Tarjeta de Ramo</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO IMPRIMIBLE DEL TICKET */}
        <div id="printable-ticket" className="p-6 bg-white text-slate-900 text-sm">
          
          {/* Logo y Encabezado del Ticket */}
          <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
            <span className="text-3xl block mb-1">🌸</span>
            <h2 className="text-lg font-black tracking-tight uppercase">Sistema v1.0</h2>
            <p className="text-xs text-slate-500 font-medium">Puno • Juliaca</p>
            <div className="mt-2 inline-block bg-slate-100 px-3 py-1 rounded-full font-mono text-xs font-bold">
              {pedido.id}
            </div>
          </div>

          {/* Información Principal */}
          <div className="py-4 space-y-2 border-b-2 border-dashed border-slate-300">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500 uppercase">Fecha / Hora:</span>
              <span className="font-bold text-slate-800">{pedido.fecha} - {pedido.hora}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500 uppercase">Modalidad:</span>
              <span className="font-bold text-slate-800">
                {pedido.tipo_entrega === 'Delivery' ? '🛵 DELIVERY' : '🛍️ RECOJO EN TIENDA'}
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500 uppercase">Ciudad:</span>
              <span className="font-bold text-slate-800">{pedido.ciudad}</span>
            </div>

            {pedido.cliente && (
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-500 uppercase">Cliente / Destino:</span>
                <span className="font-bold text-slate-900">{pedido.cliente}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500 uppercase">Celular:</span>
              <span className="font-mono font-bold text-slate-900">{pedido.celular}</span>
            </div>

            {pedido.direccion && (
              <div className="pt-1">
                <span className="text-xs font-bold text-slate-500 uppercase block">Dirección:</span>
                <p className="font-medium text-slate-800 bg-slate-50 p-1.5 rounded border border-slate-200 text-xs">
                  {pedido.direccion}
                </p>
              </div>
            )}
          </div>

          {/* Detalle del Ramo */}
          <div className="py-4 border-b-2 border-dashed border-slate-300">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
              Producto Confeccionado:
            </span>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="font-black text-rose-950 text-base">{pedido.producto}</p>
              {pedido.notas && (
                <p className="text-xs text-rose-800 mt-1 font-medium">⚠️ Nota: {pedido.notas}</p>
              )}
            </div>
          </div>

          {/* Dedicatoria (Tarjeta de Regalo) */}
          {pedido.dedicatoria && (
            <div className="py-4 border-b-2 border-dashed border-slate-300">
              <div className="flex items-center gap-1 text-xs font-bold text-rose-600 uppercase mb-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>Tarjeta de Dedicatoria:</span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-slate-800 italic font-serif text-sm">
                &ldquo;{pedido.dedicatoria}&rdquo;
              </div>
            </div>
          )}

          {/* Montos y Saldos */}
          <div className="py-4 space-y-1.5 border-b-2 border-dashed border-slate-300 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Precio Producto:</span>
              <span>S/ {Number(pedido.precio_producto).toFixed(2)}</span>
            </div>
            {Number(pedido.costo_delivery) > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Costo Delivery:</span>
                <span>S/ {Number(pedido.costo_delivery).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-purple-700">
              <span>Pagado por Yape:</span>
              <span>S/ {Number(pedido.pago_yape).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Pagado en Efectivo:</span>
              <span>S/ {Number(pedido.pago_efectivo).toFixed(2)}</span>
            </div>

            {/* Saldo a Cobrar */}
            <div className={`flex justify-between text-sm font-bold pt-2 border-t border-slate-200 ${
              hasSaldo ? 'text-rose-700 bg-rose-50 p-2 rounded-lg' : 'text-emerald-700'
            }`}>
              <span>SALDO A COBRAR:</span>
              <span>S/ {Number(pedido.saldo).toFixed(2)}</span>
            </div>
          </div>

          {/* Pie del ticket */}
          <div className="pt-4 text-center text-[11px] text-slate-400">
            <p>¡Gracias por su preferencia!</p>
            <p>Sistema v1.0 • Control de Pedidos</p>
          </div>

        </div>

        {/* Botones de Acción (no se imprimen) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ticket / Tarjeta</span>
          </button>
        </div>

      </div>
    </div>
  );
};
