'use client';

import React, { useMemo } from 'react';
import { Pedido } from '@/types/pedido';
import { getTodayDateString } from '@/lib/mockData';
import { Scissors, Truck, AlertCircle, PackageCheck, Wallet, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatsBarProps {
  pedidos: Pedido[];
  allPedidos?: Pedido[];
  activeFilterKey?: string;
  onFilterClick?: (filterType: 'todos' | 'por_armar' | 'por_entregar' | 'cobrado' | 'saldos') => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  pedidos,
  allPedidos = [],
  activeFilterKey,
  onFilterClick,
}) => {
  const total = pedidos.length;
  const porArmar = pedidos.filter((p) => !p.hecho).length;
  const porEntregar = pedidos.filter((p) => !p.entregado).length;

  const totalYape = pedidos.reduce((acc, p) => acc + (Number(p.pago_yape) || 0), 0);
  const totalEfectivo = pedidos.reduce((acc, p) => acc + (Number(p.pago_efectivo) || 0), 0);
  const totalCobrado = totalYape + totalEfectivo;
  const totalSaldos = pedidos.reduce((acc, p) => acc + (Number(p.saldo) || 0), 0);

  // Variación vs Ayer
  const todayStr = useMemo(() => getTodayDateString(0), []);
  const yesterdayStr = useMemo(() => getTodayDateString(-1), []);

  const { varPedidos, varCobrado, varSaldos } = useMemo(() => {
    const pToday = allPedidos.filter((p) => p.fecha === todayStr);
    const pYesterday = allPedidos.filter((p) => p.fecha === yesterdayStr);

    const cobToday = pToday.reduce((acc, p) => acc + (Number(p.pago_yape) || 0) + (Number(p.pago_efectivo) || 0), 0);
    const cobYesterday = pYesterday.reduce((acc, p) => acc + (Number(p.pago_yape) || 0) + (Number(p.pago_efectivo) || 0), 0);

    const salToday = pToday.reduce((acc, p) => acc + (Number(p.saldo) || 0), 0);
    const salYesterday = pYesterday.reduce((acc, p) => acc + (Number(p.saldo) || 0), 0);

    return {
      varPedidos: pToday.length - pYesterday.length,
      varCobrado: cobToday - cobYesterday,
      varSaldos: salToday - salYesterday,
    };
  }, [allPedidos, todayStr, yesterdayStr]);

  const renderTrend = (diff: number, suffix = '', inverse = false) => {
    if (diff === 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 font-medium">
          <Minus className="w-3 h-3" /> igual vs ayer
        </span>
      );
    }
    const isPositive = diff > 0;
    const isGood = inverse ? !isPositive : isPositive;

    return (
      <span
        className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
          isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        }`}
      >
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {isPositive ? `+${diff}${suffix}` : `${diff}${suffix}`} vs ayer
      </span>
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
      
      {/* 1. Total Pedidos (Clicable) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onFilterClick?.('todos')}
        className={`bg-white dark:bg-slate-900 p-4 rounded-3xl border transition-all cursor-pointer select-none text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
          activeFilterKey === 'todos'
            ? 'ring-2 ring-slate-900 dark:ring-white border-slate-900 dark:border-white'
            : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pedidos</p>
          <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          {total}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Total en vista</span>
          {renderTrend(varPedidos)}
        </div>
      </div>

      {/* 2. Por Confeccionar (Clicable) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onFilterClick?.('por_armar')}
        className={`p-4 rounded-3xl border transition-all cursor-pointer select-none text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
          activeFilterKey === 'por_armar'
            ? 'ring-2 ring-rose-500 border-rose-500'
            : porArmar > 0
            ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/50 hover:border-rose-300'
            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Por Confeccionar
          </p>
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
            porArmar > 0
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-200 dark:shadow-none'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            <Scissors className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-2xl sm:text-3xl font-black text-rose-700 dark:text-rose-400">
            {porArmar}
          </span>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">ramos</span>
        </div>
        <div className="mt-1">
          <span className="text-[11px] font-semibold text-rose-500/90 dark:text-rose-400/80">
            {porArmar === 0 ? 'Todo listo' : 'Tocar para filtrar'}
          </span>
        </div>
      </div>

      {/* 3. Por Entregar (Clicable) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onFilterClick?.('por_entregar')}
        className={`p-4 rounded-3xl border transition-all cursor-pointer select-none text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
          activeFilterKey === 'por_entregar'
            ? 'ring-2 ring-amber-500 border-amber-500'
            : porEntregar > 0
            ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/50 hover:border-amber-300'
            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            Por Entregar
          </p>
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
            porEntregar > 0
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-200 dark:shadow-none'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}>
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-2xl sm:text-3xl font-black text-amber-800 dark:text-amber-300">
            {porEntregar}
          </span>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">pedidos</span>
        </div>
        <div className="mt-1">
          <span className="text-[11px] font-semibold text-amber-600/90 dark:text-amber-400/80">
            {porEntregar === 0 ? '✓ Al día' : 'Tocar para ver ruta'}
          </span>
        </div>
      </div>

      {/* 4. Total Cobrado (Clicable) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onFilterClick?.('cobrado')}
        className={`bg-white dark:bg-slate-900 p-4 rounded-3xl border transition-all cursor-pointer select-none text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
          activeFilterKey === 'cobrado'
            ? 'ring-2 ring-emerald-600 border-emerald-600'
            : 'border-slate-200/90 dark:border-slate-800 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Cobrado
          </p>
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1 font-mono tracking-tight">
          S/ {totalCobrado.toFixed(2)}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">
            Y: S/{totalYape.toFixed(0)} • E: S/{totalEfectivo.toFixed(0)}
          </span>
          {renderTrend(varCobrado, ' S/')}
        </div>
      </div>

      {/* 5. Saldos por Cobrar (Clicable - Filtra al instante) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onFilterClick?.('saldos')}
        className={`col-span-2 sm:col-span-1 p-4 rounded-3xl border transition-all cursor-pointer select-none text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
          activeFilterKey === 'saldos'
            ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-100/80 dark:bg-amber-950/60'
            : totalSaldos > 0
            ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300/90 dark:border-amber-800 hover:border-amber-400'
            : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>Saldos por Cobrar</span>
            {totalSaldos > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
          </p>
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
            totalSaldos > 0
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-200 dark:shadow-none'
              : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
          }`}>
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-black text-amber-900 dark:text-amber-200 mt-1 font-mono tracking-tight">
          S/ {totalSaldos.toFixed(2)}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
            {totalSaldos > 0 ? 'Tocar para verlos' : 'Todos al día'}
          </span>
          {renderTrend(varSaldos, ' S/', true)}
        </div>
      </div>

    </div>
  );
};
