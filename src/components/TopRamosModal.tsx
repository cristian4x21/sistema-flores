'use client';

import React, { useMemo, useState } from 'react';
import { Pedido } from '@/types/pedido';
import { Trophy, Award, X, TrendingUp, Sparkles, Package, DollarSign, Search } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="shrink-0 bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 px-5 sm:px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
              <Trophy className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black tracking-tight font-brand">
                Ranking de Ramos Más Vendidos
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-100">
                Arreglos favoritos de los clientes de Loany Detalles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll táctil suave para celular */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y touch-scroll p-4 sm:p-6 space-y-4 text-slate-800 dark:text-slate-200"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* Tarjeta Destacada: Ramo Estrella */}
          {ramoEstrella && (
            <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 dark:from-amber-950/30 dark:via-rose-950/20 dark:to-slate-800/80 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-300/60 dark:shadow-none">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white mb-0.5">
                    Ramo Estrella (#1 en Ventas)
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white capitalize">
                    {ramoEstrella.nombre}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Es el arreglo más solicitado con <strong className="text-rose-600 dark:text-rose-400">{ramoEstrella.cantidad} pedidos</strong> ({ramoEstrella.porcentaje.toFixed(0)}% del total).
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right sm:border-l sm:border-amber-200 dark:sm:border-amber-800 sm:pl-4 shrink-0">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total generado</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
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
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-rose-400"
            />
          </div>

          {/* Lista de Ranking */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Posición / Producto</span>
              <span>Pedidos / % Salida</span>
            </div>

            {filtrados.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                No se encontraron ramos con ese nombre.
              </p>
            ) : (
              filtrados.map((item, idx) => {
                const badgeStyles = [
                  'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-black',
                  'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 font-black',
                  'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-400 border-amber-200 dark:border-amber-900 font-bold',
                ];
                const badgeStyle = idx < 3 ? badgeStyles[idx] : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

                return (
                  <div
                    key={item.nombre}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs shrink-0 font-mono ${badgeStyle}`}>
                          #{idx + 1}
                        </span>
                        <div className="truncate">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 capitalize truncate">
                            {item.nombre}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            Total: S/ {item.totalVendido.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-black text-xs border border-rose-100 dark:border-rose-900">
                          {item.cantidad} {item.cantidad === 1 ? 'pedido' : 'pedidos'}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                          {item.porcentaje.toFixed(1)}% del catálogo
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progreso de Popularidad */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                            : idx === 1
                            ? 'bg-rose-400'
                            : idx === 2
                            ? 'bg-pink-400'
                            : 'bg-slate-300 dark:bg-slate-600'
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
        <div className="shrink-0 p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Total analizado: <strong>{totalUnidades} pedidos</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-bold transition-all text-xs"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
