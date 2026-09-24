'use client';

import React from 'react';
import { Pedido } from '@/types/pedido';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  pedido: Pedido | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  pedido,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !pedido) return null;

  const targetName = pedido.cliente?.trim() || pedido.producto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overscroll-contain">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center text-2xl mb-4 shadow-sm">
            <Trash2 className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            ¿Eliminar este pedido?
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            ¿Seguro que deseas eliminar el pedido de{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-bold">{targetName}</strong>?
            <br />
            <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">
              ({pedido.producto} • {pedido.id})
            </span>
          </p>

          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Esta acción no se puede deshacer.</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-sm shadow-rose-300 dark:shadow-none transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Eliminando...' : 'Sí, eliminar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
