"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import HamiltonianSphere from "@/components/HamiltonianSphere";
import { HarmonicAudio } from "@/components/harmonicaudio";
import MintCapsuleButton from "@/components/MintCapsuleButton";

export default function Page(){
  const [price,setPrice]=useState(0); const [omega,setOmega]=useState(432);
  const [k,setK]=useState(0); const [hri,setHri]=useState(0.5);
  const audioRef = useRef<HarmonicAudio>();
  useEffect(()=>{ audioRef.current = new HarmonicAudio(); audioRef.current.init(); },[]);
  useEffect(()=>{
    const tick=async()=>{
      const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true").then(r=>r.json());
      const p = r.bitcoin.usd, ch=r.bitcoin.usd_24h_change||0; setPrice(p);
      const intensity = Math.min(1, Math.abs(ch)/10);          // crude HRI_norm
      const omegaNew = 432 + 120*intensity; setOmega(omegaNew);
      setK(Math.max(-1, Math.min(1, 1-2*intensity)));          // map to planes
      setHri(intensity);
      const amps=[1-intensity, Math.max(0,(-ch)/10), 1-intensity, intensity, intensity*0.8, intensity*0.6, Math.min(1, Math.abs(ch)/8)];
      audioRef.current?.update(omegaNew, 0.5+ch/20, amps);
    };
    tick(); const id=setInterval(tick, 6000); return ()=>clearInterval(id);
  },[]);
  const theta = useMemo(()=> (180/Math.PI)*Math.acos(Math.max(-1,Math.min(1,k))),[k]);
  const capsule = useMemo(()=>({
    k, omega, hri, theta, phi: 0, uri: "ipfs://metadata.json", sig: "0x00" as `0x${string}`
  }),[k,omega,hri,theta]);

  return (
    <main style={{display:"grid",placeItems:"center",gap:18,padding:24}}>
      <h1>Hamiltonian Dimensional Bridge</h1>
      <div>BTC ${price.toFixed(2)} · ω {omega.toFixed(1)} Hz · k {k.toFixed(2)} · θ {theta.toFixed(1)}°</div>
      <HamiltonianSphere r={1}/>
      <MintCapsuleButton capsule={capsule}/>
      <p style={{opacity:.6,fontSize:12}}>Fuji testnet · demo signature placeholder</p>
    </main>
  );
}
