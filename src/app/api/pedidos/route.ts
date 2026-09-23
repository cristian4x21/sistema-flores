import { NextResponse } from 'next/server';
import { getPedidos, createPedido } from '@/lib/orders-store';

export async function GET() {
  try {
    const pedidos = await getPedidos();
    return NextResponse.json({ success: true, data: pedidos });
  } catch (error) {
    console.error('Error in GET /api/pedidos:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener pedidos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.producto || !body.celular || !body.fecha) {
      return NextResponse.json(
        { success: false, error: 'Producto, celular y fecha son obligatorios' },
        { status: 400 }
      );
    }

    const nuevo = await createPedido(body);
    return NextResponse.json({ success: true, data: nuevo }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/pedidos:', error);
    return NextResponse.json({ success: false, error: 'Error al crear pedido' }, { status: 500 });
  }
}
