import { HarmonicConfigValidator } from './harmonic-config';

export const getHarmonicConfig = () => {
  if (typeof window === 'undefined') {
    throw new ConfigValidationError('Harmonic config can only be accessed client-side');
  }

  return HarmonicConfigValidator.validate({
    rpc: process.env.NEXT_PUBLIC_RPC!,
    contract: process.env.NEXT_PUBLIC_CONTRACT! as `0x${string}`,
    harmonicSettings: {
      frequencyRange: [432, 444] as [number, number], // Your bell frequencies
      maxAmplitude: 0.8,
      sampleRate: 44100
    }
  });
};

// hooks/useHarmonicContract.ts
import { useAccount, useContractRead } from 'wagmi';
import { getHarmonicConfig } from '../lib/client-config';

export const useHarmonicContract = () => {
  const config = getHarmonicConfig();
  
  // Your contract ABI for harmonic functions
  const harmonicABI = [
    {
      name: 'getResonance',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'asset', type: 'address' }],
      outputs: [{ name: 'resonance', type: 'uint256' }]
    },
    {
      name: 'emitSonicEvent',
      type: 'function', 
      stateMutability: 'payable',
      inputs: [
        { name: 'eventType', type: 'uint8' },
        { name: 'frequency', type: 'uint256' },
        { name: 'amplitude', type: 'uint256' }
      ],
      outputs: []
    }
  ] as const;

  return {
    config,
    contract: {
      address: config.contract,
      abi: harmonicABI
    }
  };
};
