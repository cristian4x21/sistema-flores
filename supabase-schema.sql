-- ==============================================================================
-- SISTEMA FLORES: ESQUEMA DE BASE DE DATOS PARA SUPABASE
-- Copia y pega este contenido en el "SQL Editor" de tu proyecto en supabase.com
-- ==============================================================================

-- 1. Crear tabla pedidos
CREATE TABLE IF NOT EXISTS public.pedidos (
    id TEXT PRIMARY KEY,
    celular TEXT NOT NULL,
    cliente TEXT,
    producto TEXT NOT NULL,
    hecho BOOLEAN DEFAULT false,
    entregado BOOLEAN DEFAULT false,
    pago_yape NUMERIC(10,2) DEFAULT 0.00,
    pago_efectivo NUMERIC(10,2) DEFAULT 0.00,
    saldo NUMERIC(10,2) DEFAULT 0.00,
    costo_delivery NUMERIC(10,2) DEFAULT 0.00,
    precio_producto NUMERIC(10,2) DEFAULT 0.00,
    ciudad TEXT DEFAULT 'Puno',
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    tipo_entrega TEXT DEFAULT 'Recojo',
    direccion TEXT,
    dedicatoria TEXT,
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS) y permitir lectura/escritura pública para la app
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso completo a pedidos" 
ON public.pedidos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. Índices para acelerar búsquedas y filtros por fecha y celular
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON public.pedidos(fecha);
CREATE INDEX IF NOT EXISTS idx_pedidos_celular ON public.pedidos(celular);
CREATE INDEX IF NOT EXISTS idx_pedidos_hecho ON public.pedidos(hecho);
CREATE INDEX IF NOT EXISTS idx_pedidos_entregado ON public.pedidos(entregado);

-- 4. Datos iniciales basados en la hoja de cálculo
INSERT INTO public.pedidos (id, celular, cliente, producto, hecho, entregado, pago_yape, pago_efectivo, saldo, costo_delivery, precio_producto, ciudad, fecha, hora, tipo_entrega, dedicatoria, notas)
VALUES
('PED-001', '990983812', 'Camila Flores', 'Ramo Rose', true, true, 30.00, 0.00, 0.00, 0.00, 30.00, 'Puno', CURRENT_DATE::text, '1:00 pm', 'Recojo', 'Con todo mi amor para la persona más especial.', 'Recoge en tienda a la 1pm puntual'),
('PED-002', '963238887', 'Dr. Víctor Quispe', 'Ramo Dama de la Justicia', true, true, 58.00, 0.00, 0.00, 8.00, 50.00, 'Puno', CURRENT_DATE::text, '12:00 pm', 'Delivery', 'Muchas felicitaciones por tu logro profesional.', 'Llamar al llegar'),
('PED-003', '921780243', 'Romina Condori', 'Ramo Romina', true, true, 31.50, 0.00, 0.00, 0.00, 31.50, 'Puno', CURRENT_DATE::text, '1:00 pm', 'Recojo', 'Feliz aniversario mi vida.', ''),
('PED-004', '902148756', 'Mary Torres', 'Merienda Mery + Chocolate', true, false, 69.00, 0.00, 0.00, 0.00, 69.00, 'Puno', CURRENT_DATE::text, '1:00 pm', 'Recojo', 'Que tengas un día maravilloso y dulce.', 'Viene a recoger su hermana'),
('PED-005', '990600700', 'Luciana Ramos', 'Ramo Linda', true, true, 0.00, 49.00, 0.00, 9.00, 40.00, 'Puno', CURRENT_DATE::text, '9:00 am', 'Delivery', 'Para la mujer más hermosa.', ''),
('PED-006', '974244331', 'Geraldine Mamani', 'Ramo Geraldine + Chocolate', true, true, 58.00, 0.00, 0.00, 0.00, 58.00, 'Puno', (CURRENT_DATE + INTERVAL '1 day')::date::text, '6:00 pm', 'Recojo', 'Feliz cumpleaños amiga bella!', ''),
('PED-007', '931366524', 'Karen Zapana', 'Collar + Pulsera Flor', true, true, 45.00, 0.00, 10.00, 10.00, 45.00, 'Juliaca', (CURRENT_DATE + INTERVAL '1 day')::date::text, '11:00 am', 'Delivery', 'Un detalle con mucho cariño para ti.', 'Falta pagar el delivery S/ 10 al entregar'),
('PED-008', '978360356', 'Esteban Cárdenas', 'Ramo Cumpleañero + Peluche', true, true, 75.00, 0.00, 0.00, 5.00, 70.00, 'Puno', (CURRENT_DATE + INTERVAL '1 day')::date::text, '12:00 pm', 'Delivery', '¡Feliz día! Que cumplas muchos años más.', ''),
('PED-009', '918389744', 'Diego Mendoza', 'Ramo Amor (Rosas Rojas)', true, false, 99.00, 0.00, 0.00, 8.00, 91.00, 'Puno', CURRENT_DATE::text, '6:00 pm', 'Delivery', 'Por muchos años más juntos, te amo.', ''),
('PED-010', '918822747', 'Sofía Apaza', 'Peluche Lotso Cumpleaños', true, false, 18.00, 0.00, 0.00, 0.00, 18.00, 'Puno', CURRENT_DATE::text, '4:00 pm', 'Recojo', 'Para mi sobrina favorita!', ''),
('PED-011', '980462113', 'Álvaro Huanca', 'Ramo 4 Rosas Azules + Choc', false, false, 30.00, 0.00, 23.00, 8.00, 45.00, 'Puno', CURRENT_DATE::text, '9:00 am', 'Delivery', 'Siempre estaré a tu lado. Te quiero.', 'Ojo: rosas azules teñidas, falta saldo S/ 23'),
('PED-012', '951234567', 'Mariana Beltrán', 'Ramo Mi Niña + Corona', false, false, 45.00, 0.00, 0.00, 0.00, 45.00, 'Juliaca', (CURRENT_DATE + INTERVAL '1 day')::date::text, '4:00 pm', 'Recojo', 'Para la princesa de la casa.', 'Empacar con moño rosado')
ON CONFLICT (id) DO NOTHING;
