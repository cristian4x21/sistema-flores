'use client';

import React from 'react';
import { Plus, Download, RefreshCw, Sparkles, Database, Trophy } from 'lucide-react';

interface NavbarProps {
  onNewOrder: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onOpenTopRamos?: () => void;
  isRefreshing?: boolean;
  totalPedidos: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewOrder,
  onExport,
  onRefresh,
  onOpenTopRamos,
  isRefreshing = false,
  totalPedidos,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Marca */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center shadow-md shadow-rose-200 text-white text-xl sm:text-2xl font-bold">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-800 flex items-center gap-1.5">
                  Sistema <span className="text-rose-600">v1.0</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Puno • Juliaca
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Control de pedidos diarios, ramos, confección y entregas
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Botón Refrescar */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Actualizar datos"
              className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
              <span className="hidden md:inline">Actualizar</span>
            </button>

            {/* Botón Ranking Ramos Más Vendidos */}
            {onOpenTopRamos && (
              <button
                onClick={onOpenTopRamos}
                title="Ver qué ramo sale más (Ranking de Ventas)"
                className="p-2 sm:px-3 sm:py-2 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold active:scale-95 shadow-2xs"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Ramos Más Pedidos</span>
              </button>
            )}

            {/* Botón Exportar */}
            <button
              onClick={onExport}
              title="Descargar pedidos en formato Excel / CSV"
              className="p-2 sm:px-3 sm:py-2 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all flex items-center gap-1.5 text-xs sm:text-sm font-medium"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            {/* Botón Nuevo Pedido */}
            <button
              onClick={onNewOrder}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold active:scale-95"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nuevo Pedido</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
