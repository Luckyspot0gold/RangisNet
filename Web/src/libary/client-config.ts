import { ConfigValidationError } from './chain';

export const getHarmonicConfig = () => {
  if (typeof window === 'undefined') {
    throw new ConfigValidationError('Harmonic config can only be accessed client-side');
  }

  return {
    rpc: process.env.NEXT_PUBLIC_RPC || 'https://api.avax-test.network/ext/bc/C/rpc',
    contract: (process.env.NEXT_PUBLIC_CONTRACT || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`,
    harmonicSettings: {
      frequencyRange: [432, 444] as [number, number],
      maxAmplitude: 0.8,
      sampleRate: 44100
    }
  };
};
