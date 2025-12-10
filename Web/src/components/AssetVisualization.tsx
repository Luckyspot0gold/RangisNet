"use client";

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface Asset {
  symbol: string;
  balance: number;
  value: number;
  priceChange24h: number;
  resonanceScore?: number;
}

interface AssetVisualizationProps {
  assets: Asset[];
  selectedAsset?: string;
  onAssetSelect?: (symbol: string) => void;
}

function AssetSphere({ 
  asset, 
  position, 
  isSelected,
  onClick 
}: { 
  asset: Asset;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Calculate size based on value
  const size = Math.max(0.5, Math.min(2, Math.log10(asset.value + 1) * 0.3));
  
  // Calculate color based on price change
  const getColor = () => {
    if (asset.priceChange24h > 5) return '#00ff88'; // Strong green
    if (asset.priceChange24h > 0) return '#88ff88'; // Light green
    if (asset.priceChange24h < -5) return '#ff0088'; // Strong red
    if (asset.priceChange24h < 0) return '#ff8888'; // Light red
    return '#8888ff'; // Neutral blue
  };

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate based on resonance score
      const rotationSpeed = (asset.resonanceScore || 0.5) * 0.02;
      meshRef.current.rotation.y += rotationSpeed;
      
      // Pulse effect when selected or hovered
      if (isSelected || hovered) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={isSelected || hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {asset.symbol}
      </Text>
      
      <Text
        position={[0, size + 0.2, 0]}
        fontSize={0.2}
        color={getColor()}
        anchorX="center"
        anchorY="middle"
      >
        ${asset.value.toFixed(2)}
      </Text>
    </group>
  );
}

function Scene({ assets, selectedAsset, onAssetSelect }: AssetVisualizationProps) {
  // Arrange assets in a circle
  const radius = 5;
  const angleStep = (2 * Math.PI) / assets.length;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#667eea" />
      
      {assets.map((asset, index) => {
        const angle = index * angleStep;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <AssetSphere
            key={asset.symbol}
            asset={asset}
            position={[x, 0, z]}
            isSelected={selectedAsset === asset.symbol}
            onClick={() => onAssetSelect?.(asset.symbol)}
          />
        );
      })}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        maxDistance={20}
        minDistance={3}
      />
    </>
  );
}

export default function AssetVisualization({ 
  assets, 
  selectedAsset, 
  onAssetSelect 
}: AssetVisualizationProps) {
  if (assets.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        border: '1px solid rgba(102, 126, 234, 0.3)'
      }}>
        <p style={{ opacity: 0.5 }}>No assets to display</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '500px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      background: 'radial-gradient(circle at center, rgba(102, 126, 234, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)'
    }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <Scene 
          assets={assets} 
          selectedAsset={selectedAsset}
          onAssetSelect={onAssetSelect}
        />
      </Canvas>
    </div>
  );
}
