import type { Metadata, Viewport } from 'next';
import { Caveat, Quicksand, Inter } from 'next/font/google';
import './globals.css';

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Loany Detalles - Control de Pedidos & Ramos',
  description: 'Loany Detalles • Flores, Regalos y Momentos (Puno & Juliaca)',
  icons: {
    icon: '/logo-loany-circle.png',
    apple: '/logo-loany-circle.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f59e0b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${caveat.variable} ${quicksand.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#fffdfa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
