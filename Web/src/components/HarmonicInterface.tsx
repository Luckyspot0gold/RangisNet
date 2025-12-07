// components/HarmonicInterface.tsx
'use client';

export default function HarmonicInterface() {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'fuji';
  const contract = process.env.NEXT_PUBLIC_CONTRACT || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  return (
    <div className="harmonic-interface" style={{padding: '20px', border: '1px solid #00d4ff40', borderRadius: '8px'}}>
      <h2 style={{marginBottom: '16px'}}>RangisNet Harmonic Interface</h2>
      <p>Network: {network}</p>
      <p>Contract: {contract}</p>
      <p>Teleporter: 0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf</p>
      
      {/* Your harmonic visualization components */}
    </div>
  );
}

