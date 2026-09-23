import { NextResponse } from 'next/server';
import { getPedidos } from '@/lib/orders-store';

export async function GET() {
  try {
    // Consulta simple para despertar la base de datos
    const pedidos = await getPedidos();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: pedidos.length,
      message: 'Sistema Flores activo y funcionando correctamente',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Keepalive check failed' },
      { status: 500 }
    );
  }
}
