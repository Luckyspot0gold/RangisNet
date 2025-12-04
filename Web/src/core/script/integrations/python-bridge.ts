import { spawn } from 'child_process';

export async function mintSolanaToken(key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('python', ['scripts/mint-solana.py', key]);
    let output = '';
    proc.stdout.on('data', (data) => output += data);
    proc.on('close', (code) => code === 0 ? resolve(output) : reject(new Error(output)));
  });
}

// Usage: In PTE flow, if (rec === 'SEND') await mintSolanaToken(walletKey); // Cross-chain resonance
