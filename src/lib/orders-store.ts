import { Pedido, PedidoInput } from '@/types/pedido';
import { INITIAL_PEDIDOS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

// Almacén en memoria para cuando no hay Supabase conectado aún (modo local / demo)
declare global {
  // eslint-disable-next-line no-var
  var __memoryPedidos: Pedido[] | undefined;
}

function getMemoryStore(): Pedido[] {
  if (!global.__memoryPedidos) {
    global.__memoryPedidos = [...INITIAL_PEDIDOS];
  }
  return global.__memoryPedidos;
}

export async function getPedidos(): Promise<Pedido[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('fecha', { ascending: false })
        .order('hora', { ascending: true });

      if (error) {
        console.error('Error fetching from Supabase, falling back to memory:', error);
        return getMemoryStore();
      }
      return data as Pedido[];
    } catch (err) {
      console.error('Supabase exception, fallback:', err);
      return getMemoryStore();
    }
  }

  return getMemoryStore();
}

export async function createPedido(input: PedidoInput): Promise<Pedido> {
  const calculatedSaldo = Math.max(
    0,
    (Number(input.precio_producto) || 0) +
      (Number(input.costo_delivery) || 0) -
      ((Number(input.pago_yape) || 0) + (Number(input.pago_efectivo) || 0))
  );

  const newPedido: Pedido = {
    ...input,
    id: `PED-${String(Date.now()).slice(-4)}`,
    saldo: input.saldo !== undefined ? Number(input.saldo) : calculatedSaldo,
    precio_producto: Number(input.precio_producto) || 0,
    costo_delivery: Number(input.costo_delivery) || 0,
    pago_yape: Number(input.pago_yape) || 0,
    pago_efectivo: Number(input.pago_efectivo) || 0,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .insert([newPedido])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error, fallback to memory:', error);
      } else if (data) {
        return data as Pedido;
      }
    } catch (err) {
      console.error('Supabase insert exception:', err);
    }
  }

  const store = getMemoryStore();
  store.unshift(newPedido);
  return newPedido;
}

export async function updatePedido(id: string, updates: Partial<Pedido>): Promise<Pedido | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error, fallback to memory:', error);
      } else if (data) {
        return data as Pedido;
      }
    } catch (err) {
      console.error('Supabase update exception:', err);
    }
  }

  const store = getMemoryStore();
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store[index] = {
    ...store[index],
    ...updates,
  };

  return store[index];
}

export async function deletePedido(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('pedidos').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error);
      } else {
        return true;
      }
    } catch (err) {
      console.error('Supabase delete exception:', err);
    }
  }

  const store = getMemoryStore();
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;

  store.splice(index, 1);
  return true;
}
