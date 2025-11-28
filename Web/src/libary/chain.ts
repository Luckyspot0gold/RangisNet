export const RPC = process.env.NEXT_PUBLIC_RPC!;
export const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT as `0x${string}`;
// lib/config.ts
export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(`Config Validation Error: ${message}`);
    this.name = 'ConfigValidationError';
  }
}

// Ethereum address validation
const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const RPC_URL_REGEX = /^https?:\/\/.+/;

export const validateRPC = (rpc: string): string => {
  if (!rpc) {
    throw new ConfigValidationError('RPC URL is required');
  }
  
  if (!RPC_URL_REGEX.test(rpc)) {
    throw new ConfigValidationError(`Invalid RPC URL format: ${rpc}`);
  }
  
  return rpc;
};

export const validateContractAddress = (address: string): `0x${string}` => {
  if (!address) {
    throw new ConfigValidationError('Contract address is required');
  }
  
  if (!ETH_ADDRESS_REGEX.test(address)) {
    throw new ConfigValidationError(`Invalid Ethereum address: ${address}`);
  }
  
  return address as `0x${string}`;
};

// Validated exports
export const RPC = validateRPC(process.env.NEXT_PUBLIC_RPC!);
export const CONTRACT = validateContractAddress(process.env.NEXT_PUBLIC_CONTRACT!);
