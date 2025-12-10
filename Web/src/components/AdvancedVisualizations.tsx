/**
 * ADVANCED MARKET VISUALIZATIONS
 * Beyond Base44 - Production-Grade 3D Metaphors
 * 
 * Includes:
 * - Boxing Ring: Volatility combat visualization
 * - Racing Track: Momentum speed visualization  
 * - Bull Riding: HODL strength visualization
 * - Cyber Wars: Attack/defense market battles
 * - Steam Train: Trend-following momentum
 * 
 * @copyright Reality Protocol LLC © 2025
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { AggregatedMarketData } from '@/lib/api-aggregator';
import type { BellConfiguration } from '@shared/bells';

interface VisualizationProps {
  marketData: AggregatedMarketData;
  activeBell: BellConfiguration;
}

/**
 * BOXING RING VISUALIZATION
 * Volatility = Punch intensity
 * Price change = Position in ring
 * Volume = Crowd energy
 */
export function BoxingRingVisualization({ marketData, activeBell }: VisualizationProps) {
  const boxerRef = useRef<THREE.Group>(null);
  const punchTrailRef = useRef<THREE.Points>(null);
  
  // Volatility determines punch speed
  const volatility = Math.abs(marketData.priceChange24h);
  const punchSpeed = volatility * 0.5;
  
  useFrame((state) => {
    if (boxerRef.current) {
      // Boxer position based on price change
      const xPos = (marketData.priceChange24h / 20) * 8; // -8 to +8
      boxerRef.current.position.x = THREE.MathUtils.lerp(
        boxerRef.current.position.x,
        xPos,
        0.05
      );
      
      // Punch animation
      const punchCycle = Math.sin(state.clock.elapsedTime * punchSpeed) * 0.5 + 0.5;
      boxerRef.current.position.z = punchCycle * 2 - 1;
      
      // Rotate based on momentum
      boxerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });
  
  return (
    <group>
      {/* Boxing ring floor */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.8}
        />
      </mesh>
      
      {/* Ring ropes */}
      {[-8, 0, 8].map((y, i) => (
        <group key={i}>
          <Line
            points={[[-10, y * 0.3, -10], [10, y * 0.3, -10]]}
            color="#ff0000"
            lineWidth={3}
          />
          <Line
            points={[[-10, y * 0.3, 10], [10, y * 0.3, 10]]}
            color="#ff0000"
            lineWidth={3}
          />
          <Line
            points={[[-10, y * 0.3, -10], [-10, y * 0.3, 10]]}
            color="#ff0000"
            lineWidth={3}
          />
          <Line
            points={[[10, y * 0.3, -10], [10, y * 0.3, 10]]}
            color="#ff0000"
            lineWidth={3}
          />
        </group>
      ))}
      
      {/* Corner posts */}
      {[[-10, -10], [10, -10], [-10, 10], [10, 10]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1, z]}>
          <cylinderGeometry args={[0.3, 0.3, 3, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
      ))}
      
      {/* Boxer (bull or bear) */}
      <group ref={boxerRef} position={[0, 0, 0]}>
        {/* Body */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 2, 0.8]} />
          <meshStandardMaterial
            color={marketData.priceChange24h >= 0 ? '#00ff00' : '#ff0000'}
            emissive={activeBell.hexColor}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color={activeBell.hexColor}
            emissive={activeBell.hexColor}
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* Boxing gloves */}
        <mesh position={[-0.8, 0.8, 0.6]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        <mesh position={[0.8, 0.8, 0.6]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        
        {/* Price label */}
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
        >
          ${marketData.price.toFixed(2)}
        </Text>
      </group>
      
      {/* Volatility indicator (punch impact) */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.4}
        color={volatility > 10 ? '#ff0000' : volatility > 5 ? '#ffff00' : '#00ff00'}
        anchorX="center"
      >
        Volatility: {volatility.toFixed(1)}%
      </Text>
      
      {/* Bell indicator */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.6}
        color={activeBell.hexColor}
        anchorX="center"
      >
        {activeBell.name} - {activeBell.frequency}Hz
      </Text>
    </group>
  );
}

/**
 * RACING TRACK VISUALIZATION
 * Speed = Price momentum
 * Track position = Current price
 * Acceleration = Volume
 */
export function RacingTrackVisualization({ marketData, activeBell }: VisualizationProps) {
  const carRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Line>(null);
  
  // Speed based on momentum
  const speed = Math.abs(marketData.priceChange24h) * 0.1;
  
  useFrame((state) => {
    if (carRef.current) {
      // Car position on circular track
      const trackRadius = 8;
      const angle = state.clock.elapsedTime * speed;
      carRef.current.position.x = Math.cos(angle) * trackRadius;
      carRef.current.position.z = Math.sin(angle) * trackRadius;
      
      // Tilt into turn
      carRef.current.rotation.y = angle + Math.PI / 2;
      carRef.current.rotation.z = Math.sin(angle * 2) * 0.2;
    }
  });
  
  return (
    <group>
      {/* Track surface */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 10, 64]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          roughness={0.9}
        />
      </mesh>
      
      {/* Track lines (zebra stripes) */}
      {Array.from({ length: 32 }, (_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * 8, -0.4, Math.sin(angle) * 8]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[0.5, 1]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#ffffff' : '#000000'} />
          </mesh>
        );
      })}
      
      {/* Race car */}
      <group ref={carRef}>
        {/* Car body */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.4, 1.6]} />
          <meshStandardMaterial
            color={activeBell.hexColor}
            emissive={activeBell.hexColor}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Wheels */}
        {[[-0.5, -0.8], [-0.5, 0.8], [0.5, -0.8], [0.5, 0.8]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
        
        {/* Speed indicator */}
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
        >
          {(speed * 100).toFixed(0)} MPH
        </Text>
      </group>
      
      {/* Price display */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.6}
        color={activeBell.hexColor}
        anchorX="center"
      >
        ${marketData.price.toFixed(2)}
      </Text>
      
      {/* Momentum arrow */}
      <mesh 
        position={[0, 2, 0]} 
        rotation={[0, 0, marketData.priceChange24h >= 0 ? Math.PI : 0]}
      >
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshBasicMaterial color={marketData.priceChange24h >= 0 ? '#00ff00' : '#ff0000'} />
      </mesh>
      
      {/* Bell frequency */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color={activeBell.hexColor}
        anchorX="center"
      >
        {activeBell.name} - {activeBell.frequency}Hz
      </Text>
    </group>
  );
}

/**
 * BULL RIDING VISUALIZATION
 * Bucking = Volatility
 * Ride time = HODL strength
 * Bull energy = Volume
 */
export function BullRidingVisualization({ marketData, activeBell }: VisualizationProps) {
  const bullRef = useRef<THREE.Group>(null);
  const riderRef = useRef<THREE.Group>(null);
  
  // Bucking intensity from volatility
  const buckIntensity = Math.abs(marketData.priceChange24h) * 0.1;
  
  useFrame((state) => {
    if (bullRef.current && riderRef.current) {
      // Bull bucking motion
      const buck = Math.sin(state.clock.elapsedTime * 3) * buckIntensity;
      const twist = Math.cos(state.clock.elapsedTime * 2) * buckIntensity * 0.5;
      
      bullRef.current.position.y = buck + 0.5;
      bullRef.current.rotation.x = buck * 0.3;
      bullRef.current.rotation.z = twist;
      
      // Rider trying to stay on
      riderRef.current.position.y = buck + 2;
      riderRef.current.rotation.x = -buck * 0.2;
      riderRef.current.rotation.z = -twist * 0.8;
    }
  });
  
  return (
    <group>
      {/* Arena floor */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial 
          color="#8b4513"
          roughness={0.9}
        />
      </mesh>
      
      {/* Arena fence */}
      {Array.from({ length: 32 }, (_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        return (
          <mesh 
            key={i} 
            position={[Math.cos(angle) * 11, 0.5, Math.sin(angle) * 11]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        );
      })}
      
      {/* Bull */}
      <group ref={bullRef} position={[0, 0.5, 0]}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1, 2.5]} />
          <meshStandardMaterial
            color={marketData.priceChange24h >= 0 ? '#8b4513' : '#654321'}
            roughness={0.8}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.3, 1.5]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        
        {/* Horns */}
        <mesh position={[-0.4, 0.8, 1.5]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.1, 0.6, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.4, 0.8, 1.5]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.1, 0.6, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Legs */}
        {[[-0.6, -1.5], [0.6, -1.5], [-0.6, 0.5], [0.6, 0.5]].map(([x, z], i) => (
          <mesh key={i} position={[x, -1, z]}>
            <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))}
      </group>
      
      {/* Rider */}
      <group ref={riderRef} position={[0, 2, 0]}>
        {/* Body */}
        <mesh>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial
            color={activeBell.hexColor}
            emissive={activeBell.hexColor}
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        
        {/* Cowboy hat */}
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[0.4, 0.3, 16]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 16]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        
        {/* Raised arm (one hand riding) */}
        <mesh position={[0.5, 0.3, 0]} rotation={[0, 0, -1.5]}>
          <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </group>
      
      {/* HODL timer */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
      >
        HODL TIME: {Math.abs(marketData.priceChange24h).toFixed(1)}s
      </Text>
      
      {/* Price */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color={activeBell.hexColor}
        anchorX="center"
      >
        ${marketData.price.toFixed(2)}
      </Text>
      
      {/* Bell frequency */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color={activeBell.hexColor}
        anchorX="center"
      >
        {activeBell.name} - {activeBell.frequency}Hz
      </Text>
    </group>
  );
}

/**
 * Wrapper component for canvas
 */
interface VisualizationCanvasProps extends VisualizationProps {
  type: 'boxing' | 'racing' | 'bullriding';
}

export function AdvancedVisualizationCanvas({ type, marketData, activeBell }: VisualizationCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000000' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} />
        <OrbitControls enablePan enableZoom enableRotate />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color={activeBell.hexColor} />
        
        {/* Visualization based on type */}
        {type === 'boxing' && <BoxingRingVisualization marketData={marketData} activeBell={activeBell} />}
        {type === 'racing' && <RacingTrackVisualization marketData={marketData} activeBell={activeBell} />}
        {type === 'bullriding' && <BullRidingVisualization marketData={marketData} activeBell={activeBell} />}
      </Canvas>
    </div>
  );
}
