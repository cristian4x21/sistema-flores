'use client';

import React from 'react';
import { Search, Calendar, Filter, MapPin, Truck, LayoutGrid, Table, X } from 'lucide-react';
import { getTodayDateString } from '@/lib/mockData';

export interface FilterState {
  dateMode: 'hoy' | 'manana' | 'semana' | 'todos' | 'custom';
  customDate: string;
  statusFilter: 'todos' | 'por_armar' | 'por_entregar' | 'completados';
  ciudad: 'todas' | 'Puno' | 'Juliaca';
  tipoEntrega: 'todos' | 'Delivery' | 'Recojo';
  search: string;
  viewMode: 'table' | 'cards';
}

interface PedidoFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  counts: {
    hoy: number;
    manana: number;
    todos: number;
  };
}

export const PedidoFilters: React.FC<PedidoFiltersProps> = ({
  filters,
  onChange,
  counts,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5 mb-6">
      
      {/* Fila 1: Pestañas de Fecha + Buscador + Modo de Vista */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Selector de Fechas Rápido */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => onChange({ dateMode: 'hoy', customDate: '' })}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filters.dateMode === 'hoy'
                ? 'bg-rose-500 text-white shadow-xs shadow-rose-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Hoy</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
              filters.dateMode === 'hoy' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {counts.hoy}
            </span>
          </button>

          <button
            onClick={() => onChange({ dateMode: 'manana', customDate: '' })}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filters.dateMode === 'manana'
                ? 'bg-rose-500 text-white shadow-xs shadow-rose-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Mañana</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
              filters.dateMode === 'manana' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {counts.manana}
            </span>
          </button>

          <button
            onClick={() => onChange({ dateMode: 'todos', customDate: '' })}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filters.dateMode === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Todos los Pedidos</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
              filters.dateMode === 'todos' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {counts.todos}
            </span>
          </button>

          {/* Fecha Personalizada */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={filters.customDate}
              onChange={(e) => {
                if (e.target.value) {
                  onChange({ dateMode: 'custom', customDate: e.target.value });
                }
              }}
              className="text-xs bg-transparent border-none focus:outline-hidden text-slate-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Buscador y Conmutador de Vista */}
        <div className="flex items-center gap-2">
          {/* Buscador */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cel, ramo, cliente..."
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all"
            />
            {filters.search && (
              <button
                onClick={() => onChange({ search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Switch Vista Tabla / Tarjetas */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onChange({ viewMode: 'table' })}
              title="Vista de Tabla (estilo Excel)"
              className={`p-1.5 rounded-lg transition-all ${
                filters.viewMode === 'table' ? 'bg-white shadow-xs text-rose-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChange({ viewMode: 'cards' })}
              title="Vista de Tarjetas Móvil"
              className={`p-1.5 rounded-lg transition-all ${
                filters.viewMode === 'cards' ? 'bg-white shadow-xs text-rose-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Fila 2: Filtros de Estado, Ciudad y Modalidad */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        
        {/* Filtro Estado */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-medium px-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Estado:
          </span>
          <select
            value={filters.statusFilter}
            onChange={(e) => onChange({ statusFilter: e.target.value as any })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-hidden focus:border-rose-400 cursor-pointer"
          >
            <option value="todos">Todos los estados</option>
            <option value="por_armar">✂️ Por Confeccionar (No Hecho)</option>
            <option value="por_entregar">🚚 Por Entregar (No Entregado)</option>
            <option value="completados">✅ Completados (Listo y Entregado)</option>
          </select>
        </div>

        {/* Filtro Ciudad */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-medium px-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Ciudad:
          </span>
          <select
            value={filters.ciudad}
            onChange={(e) => onChange({ ciudad: e.target.value as any })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-hidden focus:border-rose-400 cursor-pointer"
          >
            <option value="todas">Todas las ciudades</option>
            <option value="Puno">🟢 Puno</option>
            <option value="Juliaca">🟣 Juliaca</option>
          </select>
        </div>

        {/* Filtro Tipo Entrega */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-medium px-1 flex items-center gap-1">
            <Truck className="w-3 h-3" /> Modalidad:
          </span>
          <select
            value={filters.tipoEntrega}
            onChange={(e) => onChange({ tipoEntrega: e.target.value as any })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-hidden focus:border-rose-400 cursor-pointer"
          >
            <option value="todos">Delivery & Recojo</option>
            <option value="Delivery">🛵 Solo Delivery</option>
            <option value="Recojo">🛍️ Solo Recojo en Tienda</option>
          </select>
        </div>

        {/* Reset Filtros si hay alguno activo */}
        {(filters.statusFilter !== 'todos' || filters.ciudad !== 'todas' || filters.tipoEntrega !== 'todos' || filters.search) && (
          <button
            onClick={() =>
              onChange({
                statusFilter: 'todos',
                ciudad: 'todas',
                tipoEntrega: 'todos',
                search: '',
              })
            }
            className="text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
          >
            Limpiar filtros
          </button>
        )}

      </div>

    </div>
  );
};
