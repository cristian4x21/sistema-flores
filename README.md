# 🌸 Sistema de Control de Pedidos y Ramos — Florería (Puno y Juliaca)

Sistema web ágil, moderno y diseñado específicamente para el control operativo de una florería que elabora ramos y detalles personalizados, basado exactamente en el formato de tu hoja de cálculo.

---

## 🎯 Características Principales

1. **Diseño Basado en tu Hoja de Cálculo**:
   - **Hecho (Sí / No)**: Control de confección en taller. Cambia de estado con **un solo clic** (Verde = Listo, Rojo = Pendiente de armar).
   - **Nro. Celular (9 dígitos)**: Con validación peruana exacta y **botón directo de WhatsApp** con mensaje personalizado ya redactado.
   - **Producto / Detalle**: Ramos, peluches, meriendas, rosas azules, chocolates, etc.
   - **Ciudad**: Etiquetas visuales para **Puno** (verde) y **Juliaca** (morado).
   - **Modalidad y Delivery**: Diferenciación clara entre **Delivery** (con costo de envío y dirección) y **Recojo en Tienda**.
   - **Finanzas Claras**:
     - Monto pagado por **Yape / Plin**
     - Monto pagado en **Efectivo**
     - **Saldo a cobrar** calculado automáticamente y resaltado en rojo para evitar pérdidas.
   - **Entregado (Sí / No)**: Control de despacho y entrega al cliente.
   - **Dedicatoria para Tarjeta**: Sección para redactar el mensaje de regalo ("De: ... Para: ... Mensaje: ...").
   - **Comanda Imprimible**: Botón para imprimir comanda/ticket de ramo (formato 80mm o A4) para grapar al ramo antes de enviarlo.
   - **Exportar a Excel / CSV**: Descarga todos los pedidos en un clic compatible con Excel y Google Sheets.

2. **Doble Vista**:
   - **Vista Tabla (Estilo Hoja de Cálculo)**: Ideal para computadora de escritorio y recepción.
   - **Vista Tarjetas**: Ideal para teléfonos móviles de floristas y motorizados de delivery.

3. **Métricas en Tiempo Real**:
   - Ramos por confeccionar hoy.
   - Pedidos por entregar hoy.
   - Total recaudado en Soles (Yape + Efectivo).
   - Total de saldos pendientes por cobrar.

---

## 🚀 Cómo Probarlo en tu Computadora (Local)

1. Abre la terminal en la carpeta del proyecto:
   ```bash
   npm run dev
   ```
2. Abre tu navegador en [http://localhost:3000](http://localhost:3000).
   *El sistema ya incluye datos de prueba reales idénticos a los de tu imagen para que lo pruebes de inmediato sin configurar nada.*

---

## ☁️ Despliegue en Vercel (Gratis y Estable por 6+ Meses)

Este proyecto está construido con **Next.js 16**, optimizado para el plan gratuito de Vercel.

### Paso 1: Subir a GitHub
1. Inicializa Git y sube el proyecto a tu cuenta de GitHub:
   ```bash
   git add .
   git commit -m "Sistema Floreria inicial"
   git branch -M main
   # Agrega tu repositorio remoto:
   # git remote add origin https://github.com/tu-usuario/sistema-flores.git
   # git push -u origin main
   ```

### Paso 2: Crear el Proyecto en Vercel
1. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. Haz clic en **"Add New..."** -> **"Project"**.
3. Selecciona tu repositorio `sistema-flores` y haz clic en **"Deploy"**.
4. ¡Listo! Vercel te dará una URL pública accesible desde cualquier celular y computadora.

---

## 🗄️ Base de Datos en la Nube (Supabase Gratuita)

Para que los datos se guarden de forma permanente en la nube durante los 6 meses:

1. Crea una cuenta gratuita en [supabase.com](https://supabase.com).
2. Crea un nuevo proyecto (ej. `floreria-flores`).
3. Ve a **SQL Editor** en el menú izquierdo de Supabase, copia y pega el contenido del archivo `supabase-schema.sql` y dale clic a **Run**.
4. Ve a **Project Settings** -> **API** y copia:
   - **Project URL**
   - **anon public key**
   - **service_role key** (secreta)
5. En tu panel de **Vercel** (Settings -> Environment Variables), agrega las 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu clave anon
   - `SUPABASE_SERVICE_ROLE_KEY` = tu clave service role
6. Vuelve a desplegar o haz un commit, ¡y tu sistema estará conectado a la nube para siempre!

### 🛡️ ¿Por qué durará y aguantará 6 meses o más sin caerse?
1. **Sin caídas por inactividad**: El archivo `vercel.json` incluye un cron job (`/api/cron/keepalive`) que despierta la base de datos automáticamente cada 3 días para evitar que el plan gratuito de Supabase se pause por falta de uso.
2. **Arquitectura Serverless**: No hay servidores que reiniciar; Vercel maneja la disponibilidad al 99.9%.
3. **Respaldo Local Automático**: Si por algún motivo la conexión de red falla, la aplicación conmuta de forma segura para no dejar de responder.
