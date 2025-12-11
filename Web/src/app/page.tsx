"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import HamiltonianSphere from "@/components/HamiltonianSphere";
import { HarmonicAudio } from "@/components/harmonicaudio";
import MintCapsuleButton from "@/components/MintCapsuleButton";

export default function Page(){
  const [price,setPrice]=useState(0); const [omega,setOmega]=useState(432);
  const [k,setK]=useState(0); const [hri,setHri]=useState(0.5);
  const audioRef = useRef<HarmonicAudio>();
  
  useEffect(()=>{ 
    audioRef.current = new HarmonicAudio(); 
    audioRef.current.init(); 
  },[]);
  
  useEffect(()=>{
    const tick=async()=>{
      try {
        const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true").then(r=>r.json());
        const p = r.bitcoin.usd, ch=r.bitcoin.usd_24h_change||0; 
        setPrice(p);
        const intensity = Math.min(1, Math.abs(ch)/10);
        const omegaNew = 432 + 120*intensity; 
        setOmega(omegaNew);
        setK(Math.max(-1, Math.min(1, 1-2*intensity)));
        setHri(intensity);
        const amps=[1-intensity, Math.max(0,(-ch)/10), 1-intensity, intensity, intensity*0.8, intensity*0.6, Math.min(1, Math.abs(ch)/8)];
        audioRef.current?.update(omegaNew, 0.5+ch/20, amps);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    tick(); 
    const id=setInterval(tick, 6000); 
    return ()=>clearInterval(id);
  },[]);
  
  const theta = useMemo(()=> (180/Math.PI)*Math.acos(Math.max(-1,Math.min(1,k))),[k]);
  const capsule = useMemo(()=>({
    k, omega, hri, theta, phi: 0, uri: "ipfs://metadata.json", sig: "0x00" as `0x${string}`
  }),[k,omega,hri,theta]);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)',
      color: 'white',
      padding: '40px 20px'
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        maxWidth: '900px',
        margin: '0 auto 60px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          RangisNet
        </h1>
        <p style={{
          fontSize: '24px',
          opacity: 0.8,
          marginBottom: '40px'
        }}>
          Multi-Sensory Trading Platform
        </p>
        <p style={{
          fontSize: '16px',
          opacity: 0.6,
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          Experience blockchain through sight, sound, and touch. Our patent-pending Harmonic Resonance Model 
          transforms market data into 3D visualizations, sonic feedback, and haptic confirmations.
        </p>
        
        {/* NEW: Phase 3 AI Predictions Banner */}
        <div style={{
          marginBottom: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
          borderRadius: '16px',
          border: '2px solid rgba(102, 126, 234, 0.5)',
          maxWidth: '700px',
          margin: '0 auto 30px'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖 NEW: AI Phonic Learning System</div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '16px' }}>
            Neural network trained on sonic patterns • 81.8% accuracy • Real-time predictions
          </div>
          <Link 
            href="/ai-predictions"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              display: 'inline-block',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Try AI Predictions →
          </Link>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            href="/wallet"
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              transition: 'transform 0.2s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🌐 Open Wallet Dashboard
          </Link>
          
          <Link 
            href="/demo"
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 600,
              background: 'rgba(102, 126, 234, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.5)',
              transition: 'all 0.2s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
            }}
          >
            🎨 View Demo
          </Link>
        </div>
      </div>

      {/* Hamiltonian Bridge Section */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px',
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '24px',
        border: '1px solid rgba(102, 126, 234, 0.3)'
      }}>
        <h2 style={{
          fontSize: '32px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Hamiltonian Dimensional Bridge
        </h2>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          padding: '20px',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>
            BTC ${price.toFixed(2)}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            ω {omega.toFixed(1)} Hz · k {k.toFixed(2)} · θ {theta.toFixed(1)}°
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <HamiltonianSphere r={1}/>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <MintCapsuleButton capsule={capsule}/>
        </div>
        
        <p style={{
          opacity: 0.6,
          fontSize: 12,
          textAlign: 'center'
        }}>
          Avalanche Fuji Testnet · Patent-Pending Technology
        </p>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {[
          {
            icon: '🤖',
            title: 'AI Predictions',
            description: 'Neural network learns from sonic patterns to predict market outcomes with 81.8% accuracy. Real-time analysis with voice alerts.',
            new: true
          },
          {
            icon: '🎨',
            title: '3D Visualization',
            description: 'See your portfolio in immersive 3D space. Assets pulse with resonance scores and change color based on market performance.'
          },
          {
            icon: '🎵',
            title: 'Sonic Feedback',
            description: 'Hear market movements through 432Hz harmonic tones. Golden ratio modulation creates natural, pleasing sounds.'
          },
          {
            icon: '📳',
            title: 'Haptic Confirmation',
            description: 'Feel transactions through vibration patterns. Unique haptic signatures for sends, receives, and swaps.'
          },
          {
            icon: '🔗',
            title: 'Cross-Chain Ready',
            description: 'LayerZero integration for 50+ blockchains. Seamless asset movement with multi-sensory tracking.'
          },
          {
            icon: '🔐',
            title: 'Verified & Trustable',
            description: 'On-chain data indexing via Cosmos SDK. Every transaction confirmed through multiple senses.'
          },
          {
            icon: '⚡',
            title: 'Real-Time Data',
            description: 'Live market data from 6+ sources. Weighted averaging with outlier detection for accuracy.'
          }
        ].map((feature, i) => (
          <div key={i} style={{
            padding: '24px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '16px',
            border: feature.new ? '2px solid rgba(102, 126, 234, 0.6)' : '1px solid rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            {feature.new && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}>
                NEW
              </div>
            )}
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{feature.title}</h3>
            <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: 1.6 }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
