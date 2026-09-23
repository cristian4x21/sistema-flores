import { NextResponse } from 'next/server';
import { updatePedido, deletePedido } from '@/lib/orders-store';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const body = await request.json();

    const updated = await updatePedido(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Pedido no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error in PATCH /api/pedidos/[id]:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar pedido' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const ok = await deletePedido(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Pedido no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Pedido eliminado' });
  } catch (error) {
    console.error('Error in DELETE /api/pedidos/[id]:', error);
    return NextResponse.json({ success: false, error: 'Error al eliminar pedido' }, { status: 500 });
  }
}
