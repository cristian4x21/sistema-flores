'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Pedido, PedidoInput } from '@/types/pedido';
import { getTodayDateString } from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { StatsBar } from '@/components/StatsBar';
import { PedidoFilters, FilterState } from '@/components/PedidoFilters';
import { PedidosTable } from '@/components/PedidosTable';
import { PedidosCards } from '@/components/PedidosCards';
import { PedidoModal } from '@/components/PedidoModal';
import { TicketPrintModal } from '@/components/TicketPrintModal';
import { TopRamosModal } from '@/components/TopRamosModal';
import { exportPedidosToCSV } from '@/lib/exportExcel';
import { Database, AlertTriangle, CheckCircle, Info, Trophy } from 'lucide-react';

export default function HomePage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [printingPedido, setPrintingPedido] = useState<Pedido | null>(null);
  const [isTopRamosOpen, setIsTopRamosOpen] = useState(false);

  // Filtros
  const [filters, setFilters] = useState<FilterState>({
    dateMode: 'hoy',
    customDate: '',
    statusFilter: 'todos',
    ciudad: 'todas',
    tipoEntrega: 'todos',
    search: '',
    viewMode: 'table',
  });

  const todayStr = useMemo(() => getTodayDateString(0), []);
  const tomorrowStr = useMemo(() => getTodayDateString(1), []);

  // Cargar pedidos desde la API
  const fetchPedidos = async () => {
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
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Conteos rápidos para pestañas de fechas
  const dateCounts = useMemo(() => {
    return {
      hoy: pedidos.filter((p) => p.fecha === todayStr).length,
      manana: pedidos.filter((p) => p.fecha === tomorrowStr).length,
      todos: pedidos.length,
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
    return pedidos.filter((p) => {
      // 1. Filtro por Fecha
      if (filters.dateMode === 'hoy' && p.fecha !== todayStr) return false;
      if (filters.dateMode === 'manana' && p.fecha !== tomorrowStr) return false;
      if (filters.dateMode === 'custom' && filters.customDate && p.fecha !== filters.customDate) {
        return false;
      }

      // 2. Filtro por Estado
      if (filters.statusFilter === 'por_armar' && p.hecho) return false;
      if (filters.statusFilter === 'por_entregar' && p.entregado) return false;
      if (filters.statusFilter === 'completados' && (!p.hecho || !p.entregado)) return false;

      // 3. Filtro por Ciudad
      if (filters.ciudad !== 'todas' && !p.ciudad?.toLowerCase().includes(filters.ciudad.toLowerCase())) {
        return false;
      }

      // 4. Filtro por Tipo de Entrega
      if (filters.tipoEntrega !== 'todos' && p.tipo_entrega !== filters.tipoEntrega) {
        return false;
      }

      // 5. Búsqueda por texto (celular, producto, cliente, notas, dedicatoria)
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
  }, [pedidos, filters, todayStr, tomorrowStr]);

  // Toggle rápido de Hecho (elaboración de ramo)
  const handleToggleHecho = async (id: string, current: boolean) => {
    const nextVal = !current;
    // Actualización optimista inmediata en la UI
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hecho: nextVal } : p))
    );

    try {
      await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hecho: nextVal }),
      });
    } catch (err) {
      console.error('Error al actualizar estado hecho:', err);
    }
  };

  // Toggle rápido de Entregado
  const handleToggleEntregado = async (id: string, current: boolean) => {
    const nextVal = !current;
    // Actualización optimista inmediata en la UI
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, entregado: nextVal } : p))
    );

    try {
      await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entregado: nextVal }),
      });
    } catch (err) {
      console.error('Error al actualizar estado entregado:', err);
    }
  };

  // Crear o actualizar pedido
  const handleSavePedido = async (data: PedidoInput) => {
    if (editingPedido) {
      // Actualizar
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
      }
    } else {
      // Crear nuevo
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

  // Eliminar pedido con confirmación
  const handleDeletePedido = async (id: string) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar el pedido ${id}?`);
    if (!confirmDelete) return;

    setPedidos((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/pedidos/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error al eliminar pedido:', err);
    }
  };

  // Exportar a Excel
  const handleExport = () => {
    const dateTag = filters.dateMode === 'hoy' ? todayStr : 'todos';
    exportPedidosToCSV(filteredPedidos, `pedidos_floreria_${dateTag}.csv`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Banner de Información Rápida con Ramo Estrella */}
        <div className="mb-4 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-slate-50 border border-rose-200/70 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💐</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Panel Operativo: Control de Pedidos & Ramos
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Haz clic directo en <span className="font-semibold text-emerald-700">Hecho</span> o <span className="font-semibold text-emerald-700">Entregado</span> para actualizar sin abrir ventanas.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {ramoMasPedido && (
              <button
                onClick={() => setIsTopRamosOpen(true)}
                title="Haz clic para ver el ranking completo"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>🏆 Ramo que más sale:</span>
                <span className="text-rose-700 underline capitalize">{ramoMasPedido.name}</span>
                <span className="text-amber-800 font-black">({ramoMasPedido.count})</span>
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              En Vivo
            </span>
          </div>
        </div>

        {/* Barra de Estadísticas y Finanzas */}
        <StatsBar pedidos={filteredPedidos} />

        {/* Filtros de Fecha, Estado, Ciudad y Buscador */}
        <PedidoFilters
          filters={filters}
          onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
          counts={dateCounts}
        />

        {/* Vista de Pedidos (Tabla o Tarjetas) */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium text-slate-600">Cargando pedidos de la florería...</p>
          </div>
        ) : filters.viewMode === 'table' ? (
          <PedidosTable
            pedidos={filteredPedidos}
            onToggleHecho={handleToggleHecho}
            onToggleEntregado={handleToggleEntregado}
            onEdit={(p) => {
              setEditingPedido(p);
              setIsModalOpen(true);
            }}
            onDelete={handleDeletePedido}
            onPrint={(p) => setPrintingPedido(p)}
          />
        ) : (
          <PedidosCards
            pedidos={filteredPedidos}
            onToggleHecho={handleToggleHecho}
            onToggleEntregado={handleToggleEntregado}
            onEdit={(p) => {
              setEditingPedido(p);
              setIsModalOpen(true);
            }}
            onDelete={handleDeletePedido}
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
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            🌸 <strong>Sistema v1.0</strong>
          </p>
          <p className="text-slate-600 font-medium">
            Diseñado y realizado por <span className="text-rose-600 font-semibold">Cristian</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
