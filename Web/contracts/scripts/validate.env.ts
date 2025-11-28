// scripts/validate-env.ts
import { HarmonicConfigValidator } from '../lib/harmonic-config';

function validateEnvironment() {
  console.log('🔊 Validating Harmonic Protocol Environment...\n');

  try {
    const config = HarmonicConfigValidator.validate({
      rpc: process.env.NEXT_PUBLIC_RPC!,
      contract: process.env.NEXT_PUBLIC_CONTRACT!,
    });

    console.log('✅ Environment Validation Successful!');
    console.log(`🌐 Network: ${config.network}`);
    console.log(`📝 Contract: ${config.contract}`);
    console.log(`🔗 RPC: ${config.rpc}`);
    
    return true;
  } catch (error) {
    console.error('❌ Environment Validation Failed:');
    console.error(error.message);
    
    // Suggest fixes
    console.log('\n💡 Suggested fixes:');
    console.log('1. Check if NEXT_PUBLIC_RPC is set in your .env.local file');
    console.log('2. Ensure NEXT_PUBLIC_CONTRACT is a valid Ethereum address');
    console.log('3. Verify your RPC endpoint is accessible');
    
    process.exit(1);
  }
}

// Run validation
validateEnvironment();
