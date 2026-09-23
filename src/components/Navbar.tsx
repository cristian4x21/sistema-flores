'use client';

import React from 'react';
import { Plus, Download, RefreshCw, Trophy, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  onNewOrder: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onOpenTopRamos?: () => void;
  isRefreshing?: boolean;
  totalPedidos: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewOrder,
  onExport,
  onRefresh,
  onOpenTopRamos,
  isRefreshing = false,
  totalPedidos,
  darkMode = false,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-rose-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Marca Floral con gradiente elegante */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-fuchsia-600 flex items-center justify-center shadow-md shadow-rose-200 dark:shadow-none text-white text-xl sm:text-2xl font-bold select-none">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Sistema <span className="text-rose-600 dark:text-rose-400">v1.0</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Puno • Juliaca
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Control de pedidos diarios, ramos, confección y entregas
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Toggle Modo Oscuro / Claro */}
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}

            {/* Botón Refrescar (Ghost/Outline) */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Actualizar datos"
              className="p-2 sm:px-3 sm:py-2 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
              <span className="hidden md:inline">Actualizar</span>
            </button>

            {/* Botón Ranking Ramos Más Vendidos (Outline cálido) */}
            {onOpenTopRamos && (
              <button
                type="button"
                onClick={onOpenTopRamos}
                title="Ver qué ramo sale más (Ranking de Ventas)"
                className="p-2 sm:px-3 sm:py-2 text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/80 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold active:scale-95 shadow-2xs"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Ramos Más Pedidos</span>
              </button>
            )}

            {/* Botón Exportar (Outline) */}
            <button
              type="button"
              onClick={onExport}
              title="Descargar pedidos en formato Excel / CSV"
              className="p-2 sm:px-3 sm:py-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            {/* Botón Principal: Nuevo Pedido (Sólido Fucsia/Rosa Vibrante) */}
            <button
              type="button"
              onClick={onNewOrder}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl shadow-md shadow-rose-300/60 dark:shadow-none transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nuevo Pedido</span>
              <span className="sm:hidden text-xs">Nuevo</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
