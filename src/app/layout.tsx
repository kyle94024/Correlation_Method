import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nueva Psychology | Correlational Studies Example',
  description: 'THIS IS NOT A REAL CORRELATIONAL STUDY. THIS SURVEY IS NOT SCIENTIFICALLY SOUND. IT\'S JUST FOR FUN.',
  keywords: ['correlation', 'psychology', 'study', 'nueva', 'statistics'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f8fafc',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
