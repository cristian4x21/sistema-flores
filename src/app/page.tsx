'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Pedido, PedidoInput, EstadoPedido, parseHoraToMinutes, getEstadoPedido } from '@/types/pedido';
import { getTodayDateString } from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { StatsBar } from '@/components/StatsBar';
import { PedidoFilters, FilterState } from '@/components/PedidoFilters';
import { PedidosTable } from '@/components/PedidosTable';
import { PedidosCards } from '@/components/PedidosCards';
import { PedidoModal } from '@/components/PedidoModal';
import { TicketPrintModal } from '@/components/TicketPrintModal';
import { TopRamosModal } from '@/components/TopRamosModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { PedidoDetailModal } from '@/components/PedidoDetailModal';
import { exportPedidosToCSV } from '@/lib/exportExcel';

const STORAGE_FILTER_KEY = 'floreria_filter_state_v1';
const STORAGE_THEME_KEY = 'floreria_theme_mode';

export default function HomePage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [printingPedido, setPrintingPedido] = useState<Pedido | null>(null);
  const [deletingPedido, setDeletingPedido] = useState<Pedido | null>(null);
  const [detailPedido, setDetailPedido] = useState<Pedido | null>(null);
  const [isTopRamosOpen, setIsTopRamosOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtros con persistencia
  const [filters, setFilters] = useState<FilterState>({
    dateMode: 'hoy',
    customDate: '',
    statusFilter: 'todos',
    ciudad: 'todas',
    tipoEntrega: 'todos',
    soloSaldo: false,
    search: '',
    viewMode: 'table',
  });

  const todayStr = useMemo(() => getTodayDateString(0), []);
  const tomorrowStr = useMemo(() => getTodayDateString(1), []);

  // 1. Cargar tema oscuro guardado
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Ignorar si localStorage está deshabilitado
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_THEME_KEY, next ? 'dark' : 'light');
      } catch (e) {}
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // 2. Cargar último filtro usado desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FILTER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFilters((prev) => ({
          ...prev,
          ...parsed,
          search: '', // El buscador inicia limpio para comodidad
        }));
      }
    } catch (e) {}
  }, []);

  // Guardar filtros en localStorage cuando cambien
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(
          STORAGE_FILTER_KEY,
          JSON.stringify({
            dateMode: next.dateMode,
            customDate: next.customDate,
            statusFilter: next.statusFilter,
            ciudad: next.ciudad,
            tipoEntrega: next.tipoEntrega,
            soloSaldo: next.soloSaldo,
            viewMode: next.viewMode,
          })
        );
      } catch (e) {}
      return next;
    });
  };

  // Cargar pedidos desde la API
  const fetchPedidos = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/pedidos');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPedidos(data.data);
      }
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  // Conteos rápidos para pestañas de fechas y chip de saldo
  const dateCounts = useMemo(() => {
    return {
      hoy: pedidos.filter((p) => p.fecha === todayStr).length,
      manana: pedidos.filter((p) => p.fecha === tomorrowStr).length,
      todos: pedidos.length,
      conSaldo: pedidos.filter((p) => Number(p.saldo) > 0).length,
    };
  }, [pedidos, todayStr, tomorrowStr]);

  // Ramo estrella más pedido
  const ramoMasPedido = useMemo(() => {
    if (pedidos.length === 0) return null;
    const mapa: { [key: string]: { count: number; name: string } } = {};
    pedidos.forEach((p) => {
      const key = (p.producto || '').trim().toLowerCase();
      if (!key) return;
      if (!mapa[key]) mapa[key] = { count: 0, name: p.producto };
      mapa[key].count++;
    });
    const lista = Object.values(mapa).sort((a, b) => b.count - a.count);
    return lista.length > 0 ? lista[0] : null;
  }, [pedidos]);

  // Filtrado de pedidos según los controles seleccionados
  const filteredPedidos = useMemo(() => {
    const list = pedidos.filter((p) => {
      // 1. Filtro por Fecha (El buscador no lo altera)
      if (filters.dateMode === 'hoy' && p.fecha !== todayStr) return false;
      if (filters.dateMode === 'manana' && p.fecha !== tomorrowStr) return false;
      if (filters.dateMode === 'custom' && filters.customDate && p.fecha !== filters.customDate) {
        return false;
      }

      // 2. Chip filtro rápido: Con saldo pendiente
      if (filters.soloSaldo && Number(p.saldo) <= 0) return false;

      // 3. Filtro por Estado
      const st = getEstadoPedido(p);
      if (filters.statusFilter === 'por_armar' && (st === 'listo' || st === 'entregado')) return false;
      if (filters.statusFilter === 'por_entregar' && st === 'entregado') return false;
      if (filters.statusFilter === 'completados' && st !== 'entregado') return false;

      // 4. Filtro por Ciudad
      if (filters.ciudad !== 'todas' && !p.ciudad?.toLowerCase().includes(filters.ciudad.toLowerCase())) {
        return false;
      }

      // 5. Filtro por Tipo de Entrega
      if (filters.tipoEntrega !== 'todos' && p.tipo_entrega !== filters.tipoEntrega) {
        return false;
      }

      // 6. Búsqueda por texto (celular, producto, cliente, notas, dedicatoria)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const cel = (p.celular || '').toLowerCase();
        const prod = (p.producto || '').toLowerCase();
        const cli = (p.cliente || '').toLowerCase();
        const notas = (p.notas || '').toLowerCase();
        const dedi = (p.dedicatoria || '').toLowerCase();
        const match =
          cel.includes(query) ||
          prod.includes(query) ||
          cli.includes(query) ||
          notas.includes(query) ||
          dedi.includes(query);
        if (!match) return false;
      }

      return true;
    });

    // 🚀 ORDENAMIENTO CRONOLÓGICO AUTOMÁTICO:
    // Próximo a entregar SIEMPRE arriba:
    // 1. Los no entregados van antes que los entregados.
    // 2. Orden por fecha de entrega.
    // 3. Orden por hora de entrega en minutos (ej: 9am antes de 12pm antes de 6pm).
    return list.sort((a, b) => {
      // Entregados al final
      if (!a.entregado && b.entregado) return -1;
      if (a.entregado && !b.entregado) return 1;

      // Fecha
      if (a.fecha !== b.fecha) {
        return a.fecha.localeCompare(b.fecha);
      }

      // Hora de entrega (en minutos)
      const minA = parseHoraToMinutes(a.hora);
      const minB = parseHoraToMinutes(b.hora);
      return minA - minB;
    });
  }, [pedidos, filters, todayStr, tomorrowStr]);

  // Clic en tarjetas de KPI superiores para filtrar automáticamente la tabla
  const handleKpiFilterClick = (type: 'todos' | 'por_armar' | 'por_entregar' | 'cobrado' | 'saldos') => {
    if (type === 'saldos') {
      handleFilterChange({ soloSaldo: true, statusFilter: 'todos' });
    } else if (type === 'por_armar') {
      handleFilterChange({ statusFilter: 'por_armar', soloSaldo: false });
    } else if (type === 'por_entregar') {
      handleFilterChange({ statusFilter: 'por_entregar', soloSaldo: false });
    } else if (type === 'cobrado') {
      handleFilterChange({ statusFilter: 'completados', soloSaldo: false });
    } else {
      handleFilterChange({ statusFilter: 'todos', soloSaldo: false });
    }
  };

  // Cambio de estado semáforo único
  const handleStatusChange = async (id: string, nuevoEstado: EstadoPedido) => {
    let hechoVal = false;
    let entregadoVal = false;

    if (nuevoEstado === 'entregado') {
      hechoVal = true;
      entregadoVal = true;
    } else if (nuevoEstado === 'listo') {
      hechoVal = true;
      entregadoVal = false;
    } else if (nuevoEstado === 'confeccion') {
      hechoVal = false;
      entregadoVal = false;
    } else {
      hechoVal = false;
      entregadoVal = false;
    }

    const updates = {
      hecho: hechoVal,
      entregado: entregadoVal,
      estado: nuevoEstado,
    };

    // Actualización optimista inmediata en UI
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    // Actualizar modal de detalle si está abierto
    if (detailPedido && detailPedido.id === id) {
      setDetailPedido((prev) => (prev ? { ...prev, ...updates } : null));
    }

    try {
      await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  // Crear o actualizar pedido
  const handleSavePedido = async (data: PedidoInput) => {
    if (editingPedido) {
      const res = await fetch(`/api/pedidos/${editingPedido.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === editingPedido.id ? result.data : p))
        );
        if (detailPedido && detailPedido.id === editingPedido.id) {
          setDetailPedido(result.data);
        }
      }
    } else {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setPedidos((prev) => [result.data, ...prev]);
      }
    }
  };

  // Confirmar eliminación de pedido
  const handleConfirmDelete = async () => {
    if (!deletingPedido) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/pedidos/${deletingPedido.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPedidos((prev) => prev.filter((p) => p.id !== deletingPedido.id));
        if (detailPedido && detailPedido.id === deletingPedido.id) {
          setDetailPedido(null);
        }
        setDeletingPedido(null);
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Exportar a Excel
  const handleExport = () => {
    const dateTag = filters.dateMode === 'hoy' ? todayStr : 'todos';
    exportPedidosToCSV(filteredPedidos, `pedidos_floreria_${dateTag}.csv`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      
      {/* Barra de Navegación Superior */}
      <Navbar
        onNewOrder={() => {
          setEditingPedido(null);
          setIsModalOpen(true);
        }}
        onExport={handleExport}
        onRefresh={fetchPedidos}
        onOpenTopRamos={() => setIsTopRamosOpen(true)}
        isRefreshing={refreshing}
        totalPedidos={pedidos.length}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner de Información Rápida con Ramo Estrella */}
        <div className="mb-4 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-slate-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-slate-900 border border-rose-200/80 dark:border-rose-900/40 rounded-3xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-rose-500 flex items-center justify-center text-xl shadow-xs border border-rose-100 dark:border-slate-700 shrink-0">
              💐
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                Panel Operativo: Control de Pedidos & Ramos
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Haz clic en cualquier pedido para ver su ficha completa. Cambia de estado directamente desde el semáforo.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {ramoMasPedido && (
              <button
                type="button"
                onClick={() => setIsTopRamosOpen(true)}
                title="Tocar para ver el ranking de ventas"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>🏆 Ramo que más sale:</span>
                <span className="text-rose-600 dark:text-rose-400 underline capitalize">{ramoMasPedido.name}</span>
                <span className="text-amber-800 dark:text-amber-300 font-black">({ramoMasPedido.count})</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              En Vivo
            </span>
          </div>
        </div>

        {/* Tarjetas de Estadísticas Clicables */}
        <StatsBar
          pedidos={filteredPedidos}
          allPedidos={pedidos}
          activeFilterKey={
            filters.soloSaldo
              ? 'saldos'
              : filters.statusFilter !== 'todos'
              ? filters.statusFilter
              : 'todos'
          }
          onFilterClick={handleKpiFilterClick}
        />

        {/* Filtros de Fecha, Chips, Estado, Ciudad y Buscador */}
        <PedidoFilters
          filters={filters}
          onChange={handleFilterChange}
          counts={dateCounts}
        />

        {/* Vista de Pedidos (Tabla o Tarjetas) */}
        {loading ? (
          /* Loading Skeleton elegante */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 shadow-xs space-y-4">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-xl w-1/3 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-slate-100/70 dark:bg-slate-800/60 rounded-2xl w-full animate-pulse flex items-center justify-between px-4"
                >
                  <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  <div className="w-48 h-4 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filters.viewMode === 'table' ? (
          <PedidosTable
            pedidos={filteredPedidos}
            onStatusChange={handleStatusChange}
            onRowClick={(p) => setDetailPedido(p)}
            onEdit={(p) => {
              setEditingPedido(p);
              setIsModalOpen(true);
            }}
            onDelete={(p) => setDeletingPedido(p)}
            onPrint={(p) => setPrintingPedido(p)}
          />
        ) : (
          <PedidosCards
            pedidos={filteredPedidos}
            onStatusChange={handleStatusChange}
            onRowClick={(p) => setDetailPedido(p)}
            onEdit={(p) => {
              setEditingPedido(p);
              setIsModalOpen(true);
            }}
            onDelete={(p) => setDeletingPedido(p)}
            onPrint={(p) => setPrintingPedido(p)}
          />
        )}

      </main>

      {/* Modal para Crear / Editar Pedido */}
      <PedidoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPedido(null);
        }}
        onSubmit={handleSavePedido}
        initialData={editingPedido}
      />

      {/* Modal de Detalle Completo del Pedido */}
      <PedidoDetailModal
        pedido={detailPedido}
        onClose={() => setDetailPedido(null)}
        onEdit={(p) => {
          setEditingPedido(p);
          setIsModalOpen(true);
        }}
        onPrint={(p) => setPrintingPedido(p)}
        onStatusChange={handleStatusChange}
      />

      {/* Modal de Confirmación al Eliminar */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingPedido)}
        pedido={deletingPedido}
        onClose={() => setDeletingPedido(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Modal de Impresión de Comanda / Tarjeta de Ramo */}
      <TicketPrintModal
        pedido={printingPedido}
        onClose={() => setPrintingPedido(null)}
      />

      {/* Modal de Ranking de Ramos Más Vendidos */}
      <TopRamosModal
        isOpen={isTopRamosOpen}
        onClose={() => setIsTopRamosOpen(false)}
        pedidos={pedidos}
      />

      {/* Pie de Página */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 mt-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            🌸 <strong>Sistema v1.0</strong>
          </p>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Diseñado y realizado por <span className="text-rose-600 dark:text-rose-400 font-bold">Cristian</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
