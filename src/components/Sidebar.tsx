'use client';

import React from 'react';
import {
  ClipboardList,
  Trophy,
  ShieldCheck,
  Download,
  RefreshCw,
  Plus,
  Sun,
  Moon,
} from 'lucide-react';

interface SidebarProps {
  activeTab?: 'pedidos' | 'ranking' | 'respaldos';
  onNavigatePedidos?: () => void;
  onOpenTopRamos?: () => void;
  onOpenBackup?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
  onNewOrder?: () => void;
  isRefreshing?: boolean;
  totalPedidos: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'pedidos',
  onNavigatePedidos,
  onOpenTopRamos,
  onOpenBackup,
  onExport,
  onRefresh,
  onNewOrder,
  isRefreshing = false,
  totalPedidos,
  darkMode = false,
  onToggleDarkMode,
}) => {
  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-16 lg:w-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-amber-200/80 dark:border-slate-800 z-40 items-center justify-between py-4 select-none shadow-xs transition-colors"
      aria-label="Barra de Navegación Lateral"
    >
      {/* 1. Emblema Circular Oficial de Marca */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={onNavigatePedidos}
          title="Loany Detalles — Inicio"
          className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-full ring-2 ring-amber-300 dark:ring-amber-600 shadow-md shadow-amber-200/60 dark:shadow-none overflow-hidden bg-amber-50 hover:scale-105 transition-all cursor-pointer flex items-center justify-center group"
        >
          <img
            src="/logo-loany-circle.png"
            alt="Loany Detalles"
            className="w-full h-full object-cover"
          />
        </button>
        <span className="font-script text-base lg:text-lg font-bold text-amber-950 dark:text-amber-200 leading-none">
          Loany
        </span>
      </div>

      {/* 2. Navegación Principal con Iconos Profesionales Lucide */}
      <nav className="flex flex-col items-center gap-2.5 my-auto w-full px-2">
        {/* Botón Pedidos / Dashboard Principal */}
        <button
          type="button"
          onClick={onNavigatePedidos}
          title="Panel de Pedidos"
          className={`relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer group ${
            activeTab === 'pedidos'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-300/50 dark:shadow-none'
              : 'text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-800 dark:hover:text-amber-300'
          }`}
        >
          <ClipboardList className="w-5 h-5" strokeWidth={activeTab === 'pedidos' ? 2.2 : 1.8} />
          {totalPedidos > 0 && (
            <span
              className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-black font-mono shadow-xs ${
                activeTab === 'pedidos'
                  ? 'bg-slate-900 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {totalPedidos}
            </span>
          )}
          {/* Tooltip flotante */}
          <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
            Pedidos & Control
          </span>
        </button>

        {/* Botón Ramos Más Vendidos (Ranking) */}
        {onOpenTopRamos && (
          <button
            type="button"
            onClick={onOpenTopRamos}
            title="Ranking de Ramos Más Vendidos"
            className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center text-amber-700 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-950/50 transition-all cursor-pointer group"
          >
            <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
              Ramos Más Pedidos
            </span>
          </button>
        )}

        {/* Botón Copias de Seguridad & Respaldos */}
        {onOpenBackup && (
          <button
            type="button"
            onClick={onOpenBackup}
            title="Copias de Seguridad (Excel / JSON)"
            className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-all cursor-pointer group"
          >
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={1.8} />
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
              Copias de Seguridad
            </span>
          </button>
        )}

        {/* Botón Exportar Excel */}
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            title="Descargar pedidos en Excel"
            className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all cursor-pointer group"
          >
            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
              Descargar Excel
            </span>
          </button>
        )}

        {/* Botón Refrescar / Sincronizar */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Actualizar datos desde la nube"
            className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer group"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`}
              strokeWidth={1.8}
            />
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
              Actualizar
            </span>
          </button>
        )}
      </nav>

      {/* 3. Acciones Inferiores (Tema Oscuro y + Nuevo Pedido) */}
      <div className="flex flex-col items-center gap-2.5 w-full px-2">
        {/* Toggle Modo Oscuro / Claro */}
        {onToggleDarkMode && (
          <button
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group relative"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" strokeWidth={1.8} />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" strokeWidth={1.8} />
            )}
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
              {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </span>
          </button>
        )}

        {/* Botón Nuevo Pedido Destacado */}
        {onNewOrder && (
          <button
            type="button"
            onClick={onNewOrder}
            title="Registrar Nuevo Pedido"
            className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white flex items-center justify-center shadow-md shadow-amber-300/50 dark:shadow-none transition-all active:scale-95 cursor-pointer group relative"
          >
            <Plus className="w-6 h-6" strokeWidth={2.4} />
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
              + Nuevo Pedido
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};
