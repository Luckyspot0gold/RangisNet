"use client";
import * as THREE from "three"; import { useEffect, useRef } from "react";
import { ConfigValidationError } from './chain';

const K = [1,0.75,0.5,0,-0.5,-0.75,-1];
const PHI = Array.from({length:24},(_,i)=>i*Math.PI/12);
const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export default function HamiltonianSphere({r=1}:{r?:number}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{ 
    const scene=new THREE.Scene(), cam=new THREE.PerspectiveCamera(60,1,0.1,100);
    const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(420,420);
    ref.current!.innerHTML=""; ref.current!.appendChild(renderer.domElement);
    cam.position.set(0,0,3); scene.add(new THREE.AmbientLight(0xffffff,1));
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(r,64,64),
      new THREE.MeshPhongMaterial({ color:0x0b1020, opacity:0.25, transparent:true }));
    scene.add(sphere);
    K.forEach(k=>{
      const theta=Math.acos(k), ring=new THREE.EllipseCurve(0,0,r*Math.sin(theta),r*Math.sin(theta),0,2*Math.PI);
      const pts=ring.getSpacedPoints(256).map(p=> new THREE.Vector3(p.x,p.y,0)
        .applyAxisAngle(new THREE.Vector3(1,0,0), theta));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color:0x00d1ff })));
    });
    PHI.forEach(phi=>{
      const pts:THREE.Vector3[]=[];
      for(let t=0;t<=Math.PI;t+=Math.PI/180){
        const x=r*Math.sin(t)*Math.cos(phi), y=r*Math.cos(t), z=r*Math.sin(t)*Math.sin(phi);
        pts.push(new THREE.Vector3(x,y,z));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color:0x2bdcff, opacity:0.5, transparent:true })));
    });
    const animate=()=>{ sphere.rotation.y+=0.004; renderer.render(scene,cam); requestAnimationFrame(animate); };
    animate(); return ()=>renderer.dispose();
  },[r]); 
  return <div ref={ref} />;
}interface HarmonicConfig {
  rpc: string;
  contract: `0x${string}`;
  network: 'mainnet' | 'testnet' | 'local';
  harmonicSettings?: {
    frequencyRange?: [number, number];
    maxAmplitude?: number;
    sampleRate?: number;
  };
}

export class HarmonicConfigValidator {
  private static knownNetworks = {
    mainnet: ['https://api.avax.network/ext/bc/C/rpc'],
    testnet: ['https://api.avax-test.network/ext/bc/C/rpc'],
    local: ['http://localhost:8545', 'http://127.0.0.1:8545']
  };

  static validate(config: Partial<HarmonicConfig>): HarmonicConfig {
    // RPC Validation
    if (!config.rpc) {
      throw new ConfigValidationError('RPC endpoint is required for harmonic protocol');
    }

    // Network-specific RPC validation
    const network = this.detectNetwork(config.rpc);
    if (!network) {
      throw new ConfigValidationError(`Unsupported RPC endpoint: ${config.rpc}`);
    }

    // Contract Address Validation
    if (!config.contract) {
      throw new ConfigValidationError('Harmonic contract address is required');
    }

    if (!ETH_ADDRESS_REGEX.test(config.contract)) {
      throw new ConfigValidationError(`Invalid harmonic contract address: ${config.contract}`);
    }

    // Harmonic-specific validations
    if (config.harmonicSettings) {
      this.validateHarmonicSettings(config.harmonicSettings);
    }

    return {
      rpc: config.rpc,
      contract: config.contract as `0x${string}`,
      network,
      harmonicSettings: config.harmonicSettings
    };
  }

  private static detectNetwork(rpc: string): HarmonicConfig['network'] {
    if (this.knownNetworks.mainnet.some(url => rpc.includes(url))) return 'mainnet';
    if (this.knownNetworks.testnet.some(url => rpc.includes(url))) return 'testnet';
    if (this.knownNetworks.local.some(url => rpc.includes(url))) return 'local';
    return 'mainnet'; // default fallback
  }

  private static validateHarmonicSettings(settings: NonNullable<HarmonicConfig['harmonicSettings']>) {
    const { frequencyRange, maxAmplitude, sampleRate } = settings;

    if (frequencyRange) {
      const [min, max] = frequencyRange;
      if (min < 20 || max > 20000) {
        throw new ConfigValidationError('Frequency range must be between 20Hz and 20kHz for human hearing');
      }
      if (min >= max) {
        throw new ConfigValidationError('Minimum frequency must be less than maximum frequency');
      }
    }

    if (maxAmplitude && (maxAmplitude < 0 || maxAmplitude > 1)) {
      throw new ConfigValidationError('Max amplitude must be between 0 and 1');
    }

    if (sampleRate && (sampleRate < 8000 || sampleRate > 192000)) {
      throw new ConfigValidationError('Sample rate must be between 8kHz and 192kHz');
    }
  }
}
