'use client';

import React, { useState, useRef } from 'react';
import { Pedido } from '@/types/pedido';
import { exportPedidosToCSV, exportBackupJSON } from '@/lib/exportExcel';
import {
  ShieldCheck,
  X,
  Download,
  Upload,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Database,
  Calendar,
  Cloud,
  RefreshCw,
} from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidos: Pedido[];
  onRefresh: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  pedidos,
  onRefresh,
}) => {
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const now = new Date();
  const dateStamp = now.toISOString().split('T')[0];
  const timeStamp = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;

  // 1. Descargar Respaldo en Excel
  const handleDownloadExcel = () => {
    exportPedidosToCSV(pedidos, `respaldo_floreria_${dateStamp}_${timeStamp}.csv`);
  };

  // 2. Descargar Respaldo en JSON
  const handleDownloadJSON = () => {
    exportBackupJSON(pedidos, `respaldo_floreria_${dateStamp}_${timeStamp}.json`);
  };

  // 3. Restaurar respaldo desde archivo JSON
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    setRestoreMessage(null);

    try {
      const text = await file.text();
      let parsedData: any;
      try {
        parsedData = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('El archivo no tiene un formato JSON válido.');
      }

      const pedidosToRestore = Array.isArray(parsedData)
        ? parsedData
        : Array.isArray(parsedData.data)
        ? parsedData.data
        : null;

      if (!pedidosToRestore || pedidosToRestore.length === 0) {
        throw new Error('No se encontraron registros de pedidos en el archivo.');
      }

      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidosToRestore),
      });

      const result = await res.json();
      if (result.success) {
        setRestoreMessage({
          type: 'success',
          text: `¡Restauración exitosa! Se cargaron ${result.restaurados} pedidos en Supabase.`,
        });
        onRefresh();
      } else {
        throw new Error(result.error || 'Error al restaurar los datos en Supabase.');
      }
    } catch (err: any) {
      setRestoreMessage({
        type: 'error',
        text: err.message || 'Ocurrió un error inesperado al leer el archivo.',
      });
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-5 sm:px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Copias de Seguridad & Respaldos
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-100">
                Mantén tus pedidos protegidos y a salvo semana a semana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-emerald-100 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo con scroll táctil suave */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y touch-scroll p-4 sm:p-6 space-y-4 text-slate-800 dark:text-slate-200"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* Tarjeta de Estado Cloud */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Supabase Cloud (PostgreSQL)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total de pedidos en base de datos: <strong>{pedidos.length}</strong>
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
              En Línea
            </span>
          </div>

          {/* Opciones de Descarga Inmediata */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              1. Descargar Copia de Seguridad Actual:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Opción Excel */}
              <button
                type="button"
                onClick={handleDownloadExcel}
                className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      .CSV (Excel)
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Formato Excel / Hoja de Cálculo
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Ideal para contabilidad, ver clientes, teléfonos y pagos. Abre en cualquier computadora o celular.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Copia Excel</span>
                </div>
              </button>

              {/* Opción JSON */}
              <button
                type="button"
                onClick={handleDownloadJSON}
                className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-xs transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                      .JSON
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    Respaldo Completo del Sistema
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Copia exacta estructurada para restauración instantánea en 1 clic si cambias de base de datos.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Copia JSON</span>
                </div>
              </button>

            </div>
          </div>

          {/* Restaurar Respaldo */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              2. Restaurar Copia de Seguridad:
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ¿Necesitas reponer datos de un archivo anterior?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Selecciona tu archivo <code>.json</code> descargado previamente para restaurar los pedidos.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={restoring}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{restoring ? 'Restaurando...' : 'Cargar Respaldo JSON'}</span>
              </button>
            </div>

            {restoreMessage && (
              <div
                className={`mt-2 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  restoreMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200'
                }`}
              >
                {restoreMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{restoreMessage.text}</span>
              </div>
            )}
          </div>

          {/* Guía Recomendada de Rutina */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Rutina Recomendada para Loany Detalles:
            </h3>

            <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50/70 dark:bg-amber-950/20 p-3.5 rounded-2xl border border-amber-200/70 dark:border-amber-900/50">
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Semanal:</span>
                </span>
                <span>Descarga una copia en Excel todos los domingos y guárdala en una carpeta de tu celular o PC llamada <em>"Respaldos Loany"</em>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0 flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google Drive:</span>
                </span>
                <span>Sube el archivo Excel a tu Google Drive para tener un respaldo adicional por si extravías tu teléfono.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                  <span>Servidor Cloud:</span>
                </span>
                <span>Tus datos ya están guardados de forma segura en los servidores en la nube de Supabase con replicación continua.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Pie del Modal */}
        <div className="shrink-0 p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            <strong className="text-amber-950 dark:text-amber-200 font-brand">Loany Detalles</strong> • Puno & Juliaca
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-bold transition-all text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
