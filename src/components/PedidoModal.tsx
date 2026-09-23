'use client';

import React, { useState, useEffect } from 'react';
import { Pedido, PedidoInput } from '@/types/pedido';
import { getTodayDateString } from '@/lib/mockData';
import { X, Sparkles, AlertCircle, Phone, MapPin, Clock, DollarSign, HeartHandshake } from 'lucide-react';

interface PedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PedidoInput) => Promise<void>;
  initialData?: Pedido | null;
}

export const PedidoModal: React.FC<PedidoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<PedidoInput>({
    celular: '',
    cliente: '',
    producto: '',
    hecho: false,
    entregado: false,
    pago_yape: 0,
    pago_efectivo: 0,
    saldo: 0,
    costo_delivery: 0,
    precio_producto: 0,
    ciudad: 'Puno',
    fecha: getTodayDateString(0),
    hora: '1:00 pm',
    tipo_entrega: 'Recojo',
    direccion: '',
    dedicatoria: '',
    notas: '',
  });

  const [celularError, setCelularError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        celular: initialData.celular,
        cliente: initialData.cliente || '',
        producto: initialData.producto,
        hecho: initialData.hecho,
        entregado: initialData.entregado,
        pago_yape: initialData.pago_yape || 0,
        pago_efectivo: initialData.pago_efectivo || 0,
        saldo: initialData.saldo || 0,
        costo_delivery: initialData.costo_delivery || 0,
        precio_producto: initialData.precio_producto || 0,
        ciudad: initialData.ciudad || 'Puno',
        fecha: initialData.fecha || getTodayDateString(0),
        hora: initialData.hora || '1:00 pm',
        tipo_entrega: initialData.tipo_entrega || 'Recojo',
        direccion: initialData.direccion || '',
        dedicatoria: initialData.dedicatoria || '',
        notas: initialData.notas || '',
      });
    } else {
      setFormData({
        celular: '',
        cliente: '',
        producto: '',
        hecho: false,
        entregado: false,
        pago_yape: 0,
        pago_efectivo: 0,
        saldo: 0,
        costo_delivery: 0,
        precio_producto: 0,
        ciudad: 'Puno',
        fecha: getTodayDateString(0),
        hora: '1:00 pm',
        tipo_entrega: 'Recojo',
        direccion: '',
        dedicatoria: '',
        notas: '',
      });
    }
    setCelularError('');
  }, [initialData, isOpen]);

  // Recalcular saldo automáticamente cuando cambian montos
  const handleAmountChange = (
    field: 'precio_producto' | 'costo_delivery' | 'pago_yape' | 'pago_efectivo',
    val: number
  ) => {
    const updated = { ...formData, [field]: val };
    const total = (Number(updated.precio_producto) || 0) + (Number(updated.costo_delivery) || 0);
    const pagado = (Number(updated.pago_yape) || 0) + (Number(updated.pago_efectivo) || 0);
    const nuevoSaldo = Math.max(0, total - pagado);

    setFormData({
      ...updated,
      saldo: nuevoSaldo,
    });
  };

  const validateCelular = (val: string) => {
    // Exactamente 9 dígitos numéricos peruanos
    const clean = val.replace(/\D/g, '');
    if (clean.length > 9) return clean.slice(0, 9);
    return clean;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.celular.length !== 9) {
      setCelularError('Debe tener exactamente 9 dígitos. Ejemplo: 945655888');
      return;
    }

    if (!formData.producto.trim()) {
      alert('Por favor ingresa el nombre del producto o ramo');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al guardar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera del Modal */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌸</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {initialData ? `Editar Pedido (${initialData.id})` : 'Registrar Nuevo Pedido'}
              </h2>
              <p className="text-xs text-rose-100">
                Detalles del ramo, cliente, pagos y entrega
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-rose-100 hover:text-white hover:bg-rose-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Fila 1: Celular y Cliente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nro. Celular * (9 dígitos)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  +51
                </span>
                <input
                  type="text"
                  required
                  placeholder="945655888"
                  value={formData.celular}
                  onChange={(e) => {
                    const clean = validateCelular(e.target.value);
                    setFormData({ ...formData, celular: clean });
                    if (clean.length === 9) setCelularError('');
                  }}
                  className={`w-full pl-12 pr-3 py-2 bg-slate-50 border rounded-xl text-sm font-mono font-medium focus:outline-hidden focus:ring-2 ${
                    celularError
                      ? 'border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-rose-400 focus:ring-rose-100'
                  }`}
                />
              </div>
              {celularError && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {celularError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre del Cliente o Destinatario
              </label>
              <input
                type="text"
                placeholder="Ej. Camila Flores / Dr. Víctor"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          {/* Fila 2: Producto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Producto / Detalle / Ramo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Ramo 12 rosas rojas + peluche / Ramo Romina"
              value={formData.producto}
              onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {/* Fila 3: Ciudad, Modalidad y Costo Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ciudad
              </label>
              <select
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-rose-400"
              >
                <option value="Puno">🟢 Puno</option>
                <option value="Juliaca">🟣 Juliaca</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Modalidad
              </label>
              <select
                value={formData.tipo_entrega}
                onChange={(e) => {
                  const val = e.target.value as 'Delivery' | 'Recojo';
                  const deliveryFee = val === 'Delivery' ? (formData.costo_delivery || 8) : 0;
                  setFormData({
                    ...formData,
                    tipo_entrega: val,
                    costo_delivery: deliveryFee,
                  });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-rose-400"
              >
                <option value="Recojo">🛍️ Recojo en Tienda</option>
                <option value="Delivery">🛵 Envío a Domicilio (Delivery)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Costo Delivery (S/.)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.costo_delivery}
                onChange={(e) => handleAmountChange('costo_delivery', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-hidden focus:border-rose-400"
              />
            </div>
          </div>

          {/* Dirección si es Delivery */}
          {formData.tipo_entrega === 'Delivery' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Dirección de Entrega y Referencia
              </label>
              <input
                type="text"
                placeholder="Ej. Jr. Lima 450, frente a plaza de armas (Piso 2)"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-400"
              />
            </div>
          )}

          {/* Fila 4: Fecha y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fecha de Entrega
              </label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hora Programada
              </label>
              <input
                type="text"
                placeholder="Ej. 9:00 am, 1:00 pm, 6:00 pm"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-rose-400"
              />
            </div>
          </div>

          {/* Fila 5: Finanzas y Pagos (Precio, Yape, Efectivo, Saldo calculado) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Precios y Métodos de Pago
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Precio Producto (S/.)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.precio_producto}
                  onChange={(e) => handleAmountChange('precio_producto', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-purple-700 mb-1">
                  Pago YAPE / Plin (S/.)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.pago_yape}
                  onChange={(e) => handleAmountChange('pago_yape', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded-lg text-sm font-mono font-semibold text-purple-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-700 mb-1">
                  Pago Efectivo (S/.)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.pago_efectivo}
                  onChange={(e) => handleAmountChange('pago_efectivo', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-sm font-mono font-semibold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-rose-700 mb-1">
                  Saldo Restante (S/.)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.saldo}
                  onChange={(e) => setFormData({ ...formData, saldo: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-rose-50 border border-rose-300 rounded-lg text-sm font-mono font-bold text-rose-700"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * El saldo se calcula automáticamente: (Precio + Delivery) - (Yape + Efectivo). Puedes ajustarlo manualmente si hubo descuento.
            </p>
          </div>

          {/* Fila 6: Dedicatoria de la Tarjeta */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
              Dedicatoria para la Tarjeta del Ramo
            </label>
            <textarea
              rows={2}
              placeholder="Ej. De: Carlos | Para: María | Mensaje: Eres lo más lindo de mi vida, feliz día."
              value={formData.dedicatoria}
              onChange={(e) => setFormData({ ...formData, dedicatoria: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-400"
            />
          </div>

          {/* Fila 7: Notas internas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notas u Observaciones del Taller
            </label>
            <input
              type="text"
              placeholder="Ej. Usar papel coreano blanco, poner cinta dorada, flores frescas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-400"
            />
          </div>

          {/* Fila 8: Estados Hecho y Entregado */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
              formData.hecho ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={formData.hecho}
                onChange={(e) => setFormData({ ...formData, hecho: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">¿Ramo Confeccionado? (Hecho)</span>
                <span className="text-[11px] text-slate-500">Marcar si ya está listo en taller</span>
              </div>
            </label>

            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
              formData.entregado ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={formData.entregado}
                onChange={(e) => setFormData({ ...formData, entregado: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">¿Pedido Entregado?</span>
                <span className="text-[11px] text-slate-500">Marcar si ya se entregó al cliente</span>
              </div>
            </label>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-md shadow-rose-200 text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : initialData ? 'Guardar Cambios' : 'Registrar Pedido'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
