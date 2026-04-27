import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZUWAndaku - Immobilier & Véhicules Kinshasa',
  description: 'Location et vente maisons, parcelles, véhicules à Kinshasa RDC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
