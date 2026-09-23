'use client';

import React, { useMemo, useState } from 'react';
import { Pedido } from '@/types/pedido';
import { Trophy, X, TrendingUp, Sparkles, Package, DollarSign, Search } from 'lucide-react';

interface TopRamosModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidos: Pedido[];
}

interface RamoStat {
  nombre: string;
  cantidad: number;
  totalVendido: number;
  porcentaje: number;
}

export const TopRamosModal: React.FC<TopRamosModalProps> = ({
  isOpen,
  onClose,
  pedidos,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Agrupar y calcular estadísticas de ramos
  const { ranking, totalUnidades, totalRecaudado, ramoEstrella } = useMemo(() => {
    const mapa = new Map<string, { count: number; total: number }>();

    pedidos.forEach((p) => {
      // Normalizar nombre del producto
      const nombre = (p.producto || 'Sin especificar').trim();
      const clave = nombre.toLowerCase();

      const actual = mapa.get(clave) || { count: 0, total: 0 };
      mapa.set(clave, {
        count: actual.count + 1,
        total: actual.total + (Number(p.precio_producto) || Number(p.pago_yape) + Number(p.pago_efectivo) || 0),
      });
    });

    const totalCount = pedidos.length;
    let sumaDinero = 0;

    const lista: RamoStat[] = [];
    mapa.forEach((val, clave) => {
      // Buscar el nombre original con mayúsculas bonitas
      const original = pedidos.find((p) => (p.producto || '').trim().toLowerCase() === clave)?.producto || clave;
      sumaDinero += val.total;

      lista.push({
        nombre: original,
        cantidad: val.count,
        totalVendido: val.total,
        porcentaje: totalCount > 0 ? (val.count / totalCount) * 100 : 0,
      });
    });

    // Ordenar de mayor a menor cantidad
    lista.sort((a, b) => b.cantidad - a.cantidad || b.totalVendido - a.totalVendido);

    return {
      ranking: lista,
      totalUnidades: totalCount,
      totalRecaudado: sumaDinero,
      ramoEstrella: lista.length > 0 ? lista[0] : null,
    };
  }, [pedidos]);

  const filtrados = useMemo(() => {
    if (!searchTerm.trim()) return ranking;
    return ranking.filter((r) =>
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [ranking, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🏆
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Ranking de Ramos Más Pedidos
              </h2>
              <p className="text-xs text-rose-100">
                Conoce cuáles son los arreglos favoritos de tus clientes y los más vendidos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {/* Tarjeta Destacada: Ramo Estrella */}
          {ramoEstrella && (
            <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🥇</span>
                <div>
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white mb-0.5">
                    Ramo Estrella (#1 en Ventas)
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 capitalize">
                    {ramoEstrella.nombre}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Es el arreglo más solicitado con <strong className="text-rose-600">{ramoEstrella.cantidad} pedidos</strong> ({ramoEstrella.porcentaje.toFixed(0)}% del total).
                  </p>
                </div>
              </div>
              <div className="text-right sm:border-l sm:border-amber-200 sm:pl-4">
                <span className="text-xs text-slate-500 block">Total generado</span>
                <span className="text-lg font-black text-emerald-700 font-mono">
                  S/ {ramoEstrella.totalVendido.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Buscador de Ramos */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar un ramo o detalle en el ranking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-400"
            />
          </div>

          {/* Lista de Ranking */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Posición / Producto</span>
              <span>Pedidos / % Salida</span>
            </div>

            {filtrados.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-500">
                No se encontraron ramos con ese nombre.
              </p>
            ) : (
              filtrados.map((item, idx) => {
                const medallas = ['🥇', '🥈', '🥉'];
                const medalla = idx < 3 ? medallas[idx] : null;

                return (
                  <div
                    key={item.nombre}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-200 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0 font-mono">
                          {medalla || `#${idx + 1}`}
                        </span>
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-slate-900 capitalize truncate">
                            {item.nombre}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Total: S/ {item.totalVendido.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-black text-xs border border-rose-100">
                          {item.cantidad} {item.cantidad === 1 ? 'pedido' : 'pedidos'}
                        </span>
                        <span className="block text-[11px] text-slate-400 font-medium mt-0.5">
                          {item.porcentaje.toFixed(1)}% del catálogo
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progreso de Popularidad */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                            : idx === 1
                            ? 'bg-rose-400'
                            : idx === 2
                            ? 'bg-pink-400'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${Math.max(item.porcentaje, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Pie del Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total analizado: <strong>{totalUnidades} pedidos</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all text-xs"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
