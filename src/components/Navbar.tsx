'use client';

import React from 'react';
import { Plus, Download, RefreshCw, Trophy, Moon, Sun, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onNewOrder: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onOpenTopRamos?: () => void;
  onOpenBackup?: () => void;
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
  onOpenBackup,
  isRefreshing = false,
  totalPedidos,
  darkMode = false,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo Oficial de Loany Detalles con su emblema floral */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full ring-2 ring-amber-300 dark:ring-amber-600/70 shadow-md shadow-amber-200/60 dark:shadow-none shrink-0 overflow-hidden bg-amber-50 flex items-center justify-center">
              <img
                src="/logo-loany-circle.png"
                alt="Logo Loany Detalles"
                className="w-full h-full object-cover select-none"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="font-script text-2xl sm:text-3xl font-bold text-amber-950 dark:text-amber-100 tracking-wide select-none leading-none">
                  Loany
                </span>
                <span className="font-brand text-[10px] sm:text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase select-none">
                  DETALLES
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Puno • Juliaca
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-amber-800/70 dark:text-amber-200/60 tracking-wider uppercase hidden sm:block">
                Flores • Regalos • Momentos
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

            {/* Botón Copias de Seguridad & Respaldos */}
            {onOpenBackup && (
              <button
                type="button"
                onClick={onOpenBackup}
                title="Copias de Seguridad & Respaldos (Excel / JSON)"
                className="p-2 sm:px-3 sm:py-2 text-teal-800 dark:text-teal-300 hover:text-teal-950 dark:hover:text-white bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800/80 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold active:scale-95 shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">Respaldos</span>
              </button>
            )}

            {/* Botón Exportar (Outline) */}
            <button
              type="button"
              onClick={onExport}
              title="Descargar pedidos filtrados en formato Excel"
              className="p-2 sm:px-3 sm:py-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            {/* Botón Principal: Nuevo Pedido (Miel & Girasol Dorado) */}
            <button
              type="button"
              onClick={onNewOrder}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl shadow-md shadow-amber-300/50 dark:shadow-none transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold active:scale-95 cursor-pointer font-brand"
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
