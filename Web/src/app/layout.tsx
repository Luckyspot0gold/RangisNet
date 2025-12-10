import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RangisNet - Multi-Sensory Trading Platform',
  description: 'Experience blockchain through sight, sound, and touch. Patent-pending Harmonic Resonance Model with 3D visualization, sonic feedback, and haptic confirmation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
