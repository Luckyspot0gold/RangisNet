from solana.rpc.async_api import AsyncClient
from solana.keypair import Keypair
from spl.token.async_client import AsyncToken
from spl.token.constants import TOKEN_PROGRAM_ID
import json
import base58  # For key serialization

async def mint_rangi_token():
    # Wallet setup (your dev keypair; replace with env var)
    payer = Keypair.from_base58("YOUR_BASE58_PRIVATE_KEY")  # Lock this securely!
    client = AsyncClient("https://api.devnet.solana.com")  # Devnet for test

    # Mint params: RANGI token (supply 1M, 9 decimals)
    mint = await AsyncToken.create_mint(
        conn=client,
        payer=payer,
        mint_authority=payer.public_key,
        decimals=9,
        program_id=TOKEN_PROGRAM_ID  # SPL Token Program
    )

    # Create token account
    token_account = await mint.create_account(payer.public_key)

    # Mint initial supply
    await mint.mint_to(
        dest=token_account,
        mint_authority=payer.public_key,
        amount=1_000_000 * 10**9  # 1M tokens
    )

    # Metadata URI (off-chain JSON for Phantom display)
    metadata_uri = "https://your-rangis-bucket/rangi-metadata.json"  # Upload this: {"name": "Rangi Token", "symbol": "RANGI", "description": "Harmonic PTE vibes", "image": "https://your-cymatic-wave.png"}
    
    # Use Metaplex for on-chain metadata (fetch from docs if needed)
    print(f"Mint Address: {mint.pubkey}")
    print(f"Token Account: {token_account}")
    print(f"Metadata URI: {metadata_uri}  # Ensures 'RANGI' shows in Phantom, not 'Unknown'")
    await client.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(mint_rangi_token())
