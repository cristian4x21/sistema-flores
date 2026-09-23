'use client';

import React from 'react';
import { Pedido } from '@/types/pedido';
import { Scissors, Truck, DollarSign, AlertCircle, PackageCheck, Wallet } from 'lucide-react';

interface StatsBarProps {
  pedidos: Pedido[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ pedidos }) => {
  const total = pedidos.length;
  const porArmar = pedidos.filter((p) => !p.hecho).length;
  const porEntregar = pedidos.filter((p) => !p.entregado).length;
  const listos = pedidos.filter((p) => p.hecho && p.entregado).length;

  const totalYape = pedidos.reduce((acc, p) => acc + (Number(p.pago_yape) || 0), 0);
  const totalEfectivo = pedidos.reduce((acc, p) => acc + (Number(p.pago_efectivo) || 0), 0);
  const totalCobrado = totalYape + totalEfectivo;

  const totalSaldos = pedidos.reduce((acc, p) => acc + (Number(p.saldo) || 0), 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Total Pedidos */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pedidos</p>
          <p className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">{total}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">En esta vista</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
          <PackageCheck className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Por Armar (Hecho: No) */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between ${
        porArmar > 0 
          ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
          : 'bg-white border-slate-200/80 text-slate-800'
      }`}>
        <div>
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Por Confeccionar</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-rose-700">{porArmar}</span>
            <span className="text-xs font-medium text-rose-600">ramos</span>
          </div>
          <p className="text-[11px] text-rose-500/90 mt-0.5">
            {porArmar === 0 ? '¡Todo preparado!' : 'Pendientes de armar'}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          porArmar > 0 ? 'bg-rose-500 text-white shadow-sm shadow-rose-300' : 'bg-slate-100 text-slate-400'
        }`}>
          <Scissors className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Por Entregar */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between ${
        porEntregar > 0 
          ? 'bg-amber-50/70 border-amber-200 text-amber-950' 
          : 'bg-white border-slate-200/80 text-slate-800'
      }`}>
        <div>
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Por Entregar</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-amber-800">{porEntregar}</span>
            <span className="text-xs font-medium text-amber-700">pedidos</span>
          </div>
          <p className="text-[11px] text-amber-600/90 mt-0.5">
            {porEntregar === 0 ? 'Entregas al día' : 'En camino / recojo'}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          porEntregar > 0 ? 'bg-amber-500 text-white shadow-sm shadow-amber-300' : 'bg-slate-100 text-slate-400'
        }`}>
          <Truck className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Total Cobrado */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Cobrado</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-800 mt-0.5">
            S/ {totalCobrado.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Yape: S/ {totalYape.toFixed(0)} | Efec: S/ {totalEfectivo.toFixed(0)}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
          <Wallet className="w-5 h-5" />
        </div>
      </div>

      {/* 5. Saldos Pendientes */}
      <div className={`col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between ${
        totalSaldos > 0 
          ? 'bg-rose-50/90 border-rose-300 text-rose-950' 
          : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
      }`}>
        <div>
          <p className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <span>Saldos por Cobrar</span>
            {totalSaldos > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
          </p>
          <p className="text-xl sm:text-2xl font-black text-rose-700 mt-0.5">
            S/ {totalSaldos.toFixed(2)}
          </p>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">
            {totalSaldos > 0 ? '¡Cobrar antes de entregar!' : 'Todos cancelados'}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          totalSaldos > 0 ? 'bg-rose-600 text-white shadow-sm shadow-rose-300' : 'bg-emerald-100 text-emerald-700'
        }`}>
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
};
