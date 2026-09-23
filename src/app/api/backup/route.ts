import { NextResponse } from 'next/server';
import { getPedidos } from '@/lib/orders-store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Pedido } from '@/types/pedido';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Obtener todos los pedidos sin filtros
    const pedidos = await getPedidos();
    const now = new Date();
    const dateStamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 16);

    if (format === 'csv') {
      const headers = [
        'ID',
        'Fecha',
        'Hora',
        'Cliente',
        'Celular',
        'Producto',
        'Precio Producto',
        'Costo Delivery',
        'Pago Yape',
        'Pago Efectivo',
        'Saldo Pendiente',
        'Ciudad',
        'Tipo Entrega',
        'Direccion',
        'Dedicatoria',
        'Notas',
        'Hecho',
        'Entregado',
      ];

      const rows = pedidos.map((p) => [
        p.id,
        p.fecha,
        p.hora,
        `"${(p.cliente || '').replace(/"/g, '""')}"`,
        p.celular,
        `"${(p.producto || '').replace(/"/g, '""')}"`,
        Number(p.precio_producto || 0).toFixed(2),
        Number(p.costo_delivery || 0).toFixed(2),
        Number(p.pago_yape || 0).toFixed(2),
        Number(p.pago_efectivo || 0).toFixed(2),
        Number(p.saldo || 0).toFixed(2),
        p.ciudad || 'Puno',
        p.tipo_entrega || 'Recojo',
        `"${(p.direccion || '').replace(/"/g, '""')}"`,
        `"${(p.dedicatoria || '').replace(/"/g, '""')}"`,
        `"${(p.notas || '').replace(/"/g, '""')}"`,
        p.hecho ? 'Sí' : 'No',
        p.entregado ? 'Sí' : 'No',
      ]);

      const BOM = '\uFEFF';
      const csvContent = BOM + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="respaldo_floreria_${dateStamp}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      total_pedidos: pedidos.length,
      data: pedidos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al generar respaldo' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pedidos: Pedido[] = Array.isArray(body) ? body : body.data;

    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Formato de respaldo inválido o sin pedidos' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      // Limpiar campos que no pertenecen a la tabla si existieran
      const sanitized = pedidos.map((p) => {
        const item: Record<string, any> = { ...p };
        delete item.estado; // Supabase no tiene columna estado
        return item;
      });

      const { error } = await supabase.from('pedidos').upsert(sanitized);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        restaurados: sanitized.length,
        message: `Se restauraron ${sanitized.length} pedidos con éxito.`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Base de datos Supabase no configurada' },
      { status: 503 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al restaurar respaldo' },
      { status: 500 }
    );
  }
}
