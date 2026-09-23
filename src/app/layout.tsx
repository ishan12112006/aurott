import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileCartBar from '@/components/MobileCartBar';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OTT Cafe | Amity University Jaipur',
  description:
    'Order fresh food, shakes, momos, burgers, pasta and more from OTT Cafe at Amity University Jaipur. Quick campus counter pickup & live order tracking.',
  keywords: [
    'OTT Cafe',
    'Amity University Jaipur',
    'Amity Cafe',
    'Campus Food Ordering',
    'Cold Coffee',
    'Momos',
    'Out Of The Town',
  ],
  authors: [{ name: 'Ishan Panwar' }, { name: 'OTT Cafe Amity Jaipur' }],
  creator: 'Ishan Panwar',
  publisher: 'Ishan Panwar',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'OTT Cafe | Amity University Jaipur',
    description: 'Fresh food, shakes, momos, and more — right inside Amity University Jaipur.',
    url: 'https://ottcafe-amity.vercel.app',
    siteName: 'OTT Cafe Amity Jaipur',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#18181b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen flex flex-col bg-[#fdfbf9] text-[#18181b] font-sans selection:bg-[#e8959d] selection:text-white antialiased">
        <AdminAuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <CartDrawer />
            <MobileCartBar />
            <Footer />
          </CartProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
