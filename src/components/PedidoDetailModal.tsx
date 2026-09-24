'use client';

import React from 'react';
import { Pedido, getEstadoPedido, EstadoPedido } from '@/types/pedido';
import {
  X,
  MessageCircle,
  Phone,
  Clock,
  MapPin,
  Heart,
  DollarSign,
  Printer,
  Pencil,
  AlertCircle,
  CheckCircle2,
  Scissors,
  Truck,
  Store,
  Package,
} from 'lucide-react';

interface PedidoDetailModalProps {
  pedido: Pedido | null;
  onClose: () => void;
  onEdit: (pedido: Pedido) => void;
  onPrint: (pedido: Pedido) => void;
  onStatusChange: (id: string, nuevoEstado: EstadoPedido) => void;
}

export const PedidoDetailModal: React.FC<PedidoDetailModalProps> = ({
  pedido,
  onClose,
  onEdit,
  onPrint,
  onStatusChange,
}) => {
  if (!pedido) return null;

  const estado = getEstadoPedido(pedido);
  const hasSaldo = Number(pedido.saldo) > 0;
  const isPuno = pedido.ciudad?.toLowerCase().includes('puno');
  const isDelivery = pedido.tipo_entrega === 'Delivery';

  const whatsappText = encodeURIComponent(
    `¡Hola! Te saludamos de *Loany Detalles* respecto a tu pedido de *${pedido.producto}*. Queríamos coordinar la entrega programada para hoy a las ${pedido.hora}.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera con branding Loany */}
        <div className="shrink-0 bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 px-5 sm:px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-loany-circle.png" alt="Loany" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-brand">Detalle del Pedido</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  {pedido.id}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-100">
                Loany Detalles • {pedido.fecha} a las {pedido.hora}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-100 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Detalle con scroll suave en celulares */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y touch-scroll p-4 sm:p-6 space-y-4 text-slate-800 dark:text-slate-200"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* 1. Semáforo de Estado (Interactivo) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Estado del Pedido (Semáforo de Producción):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              
              <button
                type="button"
                onClick={() => onStatusChange(pedido.id, 'pendiente')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  estado === 'pendiente'
                    ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Pendiente</span>
                </span>
                <span className="text-[10px] font-normal opacity-80">Por iniciar</span>
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(pedido.id, 'confeccion')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  estado === 'confeccion'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Confección</span>
                </span>
                <span className="text-[10px] font-normal opacity-80">En taller</span>
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(pedido.id, 'listo')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  estado === 'listo'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Listo</span>
                </span>
                <span className="text-[10px] font-normal opacity-80">Para despacho</span>
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(pedido.id, 'entregado')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                  estado === 'entregado'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Entregado</span>
                </span>
                <span className="text-[10px] font-normal opacity-80">Finalizado</span>
              </button>

            </div>
          </div>

          {/* 2. Producto y Ramo */}
          <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl p-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
              Ramo o Detalle Solicitado:
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white capitalize">
              {pedido.producto}
            </h3>
            {pedido.notas && (
              <p className="mt-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/60 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span><strong>Nota de taller:</strong> {pedido.notas}</span>
              </p>
            )}
          </div>

          {/* 3. Dedicatoria para la Tarjeta */}
          {pedido.dedicatoria ? (
            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Mensaje de la Tarjeta de Regalo:
              </span>
              <p className="text-sm italic font-serif text-slate-800 dark:text-slate-200 bg-white/70 dark:bg-slate-800 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                &ldquo;{pedido.dedicatoria}&rdquo;
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Sin mensaje de tarjeta.</p>
          )}

          {/* 4. Información del Cliente y Contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Cliente / Destinatario:
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {pedido.cliente || 'No especificado'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  {pedido.celular}
                </span>
                <a
                  href={`https://wa.me/51${pedido.celular}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Entrega y Destino:
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isPuno
                      ? 'bg-emerald-700 text-white'
                      : 'bg-purple-700 text-white'
                  }`}
                >
                  {pedido.ciudad}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    isDelivery
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {isDelivery ? (
                    <>
                      <Truck className="w-3.5 h-3.5 text-sky-600" />
                      <span>Delivery</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Recojo en Tienda</span>
                    </>
                  )}
                </span>
              </div>
              {isDelivery && pedido.direccion && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{pedido.direccion}</span>
                </p>
              )}
            </div>
          </div>

          {/* 5. Desglose Financiero */}
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Desglose de Pago:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">PRODUCTO</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  S/ {Number(pedido.precio_producto).toFixed(2)}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block">DELIVERY</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  S/ {Number(pedido.costo_delivery).toFixed(2)}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 block">YAPE/PLIN</span>
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  S/ {Number(pedido.pago_yape).toFixed(2)}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">EFECTIVO</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  S/ {Number(pedido.pago_efectivo).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Saldo Alerta */}
            <div className={`p-3 rounded-xl flex items-center justify-between font-bold text-sm ${
              hasSaldo
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200'
            }`}>
              <span className="flex items-center gap-1.5">
                {hasSaldo ? <AlertCircle className="w-4 h-4 text-amber-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {hasSaldo ? 'SALDO PENDIENTE POR COBRAR:' : 'TOTALMENTE CANCELADO'}
              </span>
              <span className="font-mono text-base">
                S/ {Number(pedido.saldo).toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Acciones al pie */}
        <div className="shrink-0 p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onPrint(pedido)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-rose-500" />
            <span>Imprimir Tarjeta</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(pedido);
              }}
              className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar Pedido</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-xl transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
