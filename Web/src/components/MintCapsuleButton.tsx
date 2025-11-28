"use client";
import { useState } from "react";
import { createWalletClient, custom, parseAbi, http } from "viem";
import { avalancheFuji } from "viem/chains";
import { CONTRACT, RPC } from "@/lib/chain";

const abi = parseAbi([
  "function mint(address to,(int16,int64,int64,int64,int64,int64) c,string uri,bytes sig)"
]);

export default function MintCapsuleButton({capsule}:{capsule:{
  k:number; omega:number; hri:number; theta:number; phi:number; uri:string; sig:`0x${string}`; }}) {
  const [tx,setTx]=useState<`0x${string}`|null>(null);
  return (
    <button onClick={async ()=>{
      const client = createWalletClient({ chain: avalancheFuji, transport: custom((window as any).ethereum) });
      const [addr] = await client.getAddresses();
      const milli=(x:number)=>BigInt(Math.round(x*1000));
      const c = { kMilli: Math.round(capsule.k*1000),
        omegaMilli: milli(capsule.omega), hriMilli: milli(capsule.hri),
        thetaMilli: milli(capsule.theta), phiMilli: milli(capsule.phi), timestamp: BigInt(Math.floor(Date.now()/1000)*1000) };
      const hash = await client.writeContract({ address: CONTRACT, abi, functionName:"mint",
        args:[addr,c,capsule.uri,capsule.sig], account: addr });
      setTx(hash);
    }} className="px-4 py-2 rounded bg-indigo-600 text-white">Mint Reality Capsule</button>
  );
}
