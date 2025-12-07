import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RangisNet - Harmonic Trading Interface',
  description: 'PTE (Probability-Tactile-Execution) with ICM/Teleporter cross-chain routing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
