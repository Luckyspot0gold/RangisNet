"use client";

/**
 * RangisHeartbeat - Multi-Sensory 3D Market Visualization
 * Combines Spinor, Bloch Sphere, and Torus geometries with
 * 7-Bell harmonic system for real-time market cognition
 */

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { 
  SEVEN_BELLS, 
  calculateActiveBell, 
  calculateFearGreedIndex,
  type BellConfiguration 
} from '@/lib/seven-bell-system';
import type { AggregatedMarketData } from '@/lib/api-aggregator';

interface RangisHeartbeatProps {
  marketData: AggregatedMarketData;
  enableAudio?: boolean;
  enableHaptics?: boolean;
  visualizationMode?: 'spinor' | 'bloch' | 'torus' | 'all';
}

/**
 * IMMACULATE SPINOR VISUALIZATION (Base44 Production Build)
 * Features:
 * - Horizontal lines: +/- market movement identification
 * - Needle: Points with price-in-time precision
 * - Vertical lines: Volume & Fear/Greed longitude/latitude
 * - VR-Ready: Full sphere coordinate system
 * 
 * @copyright Reality Protocol LLC © 2025
 */
function SpinorVisualization({ 
  marketData, 
  activeBell 
}: { 
  marketData: AggregatedMarketData;
  activeBell: BellConfiguration;
}) {
  const needleRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.LineSegments>(null);
  const priceHistoryRef = useRef<number[]>([]);
  
  // Calculate Fear & Greed Index (0-100)
  const fearGreedIndex = Math.abs(marketData.priceChange24h) > 10 
    ? (marketData.priceChange24h > 0 ? 80 : 20) // Extreme greed or fear
    : 50 + (marketData.priceChange24h * 3); // Neutral zone
  
  // Volume normalized (0-100)
  const volumeNormalized = Math.min(100, (marketData.volume24h / 1000000000) * 100);
  
  // Track price history for trail
  useFrame((state) => {
    // Update price history
    if (priceHistoryRef.current.length > 100) {
      priceHistoryRef.current.shift();
    }
    priceHistoryRef.current.push(marketData.price);
    
    if (needleRef.current) {
      // Needle angle based on price change (-90° to +90°)
      const angle = (marketData.priceChange24h / 20) * Math.PI / 2; // Max ±20% = ±90°
      needleRef.current.rotation.z = -angle; // Negative for clockwise up = positive
      
      // Needle position on sphere surface
      const theta = (fearGreedIndex / 100) * Math.PI * 2; // Longitude (0-360°)
      const phi = (volumeNormalized / 100) * Math.PI; // Latitude (0-180°)
      
      const radius = 4;
      needleRef.current.position.x = radius * Math.sin(phi) * Math.cos(theta);
      needleRef.current.position.y = radius * Math.cos(phi);
      needleRef.current.position.z = radius * Math.sin(phi) * Math.sin(theta);
      
      // Needle points outward from sphere center
      needleRef.current.lookAt(0, 0, 0);
      needleRef.current.rotateX(Math.PI); // Flip to point outward
    }
    
    // Rotate sphere wireframe slowly
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  // Create sphere wireframe with longitude/latitude lines
  const sphereGeometry = new THREE.SphereGeometry(4, 32, 16);
  const sphereEdges = new THREE.EdgesGeometry(sphereGeometry);

  return (
    <group>
      {/* Sphere wireframe (VR coordinate system) */}
      <lineSegments ref={sphereRef} geometry={sphereEdges}>
        <lineBasicMaterial color="#333333" transparent opacity={0.3} />
      </lineSegments>
      
      {/* HORIZONTAL LINES: +/- Market Movement Zones */}
      {[
        { y: 4, label: '+20%', color: '#00ff00' },    // Top (extreme bull)
        { y: 2, label: '+10%', color: '#88ff88' },    // Upper (bull)
        { y: 0, label: '0%', color: '#ffff00' },      // Equator (neutral)
        { y: -2, label: '-10%', color: '#ff8888' },   // Lower (bear)
        { y: -4, label: '-20%', color: '#ff0000' },   // Bottom (extreme bear)
      ].map(({ y, label, color }) => (
        <group key={y}>
          {/* Horizontal circle */}
          <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[Math.sqrt(16 - y * y), 0.02, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
          
          {/* Label */}
          <Text
            position={[5, y, 0]}
            fontSize={0.3}
            color={color}
            anchorX="left"
          >
            {label}
          </Text>
        </group>
      ))}
      
      {/* VERTICAL LINES: Volume & Fear/Greed Meridians */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const isVolumeMeridian = i % 3 === 0; // Every 90° = volume markers
        const color = isVolumeMeridian ? '#00ffff' : '#444444';
        const label = isVolumeMeridian 
          ? `${Math.round((i / 12) * 100)}% Vol` 
          : '';
        
        return (
          <group key={i}>
            {/* Meridian line */}
            <Line
              points={Array.from({ length: 50 }, (_, j) => {
                const phi = (j / 49) * Math.PI; // 0 to 180°
                return new THREE.Vector3(
                  4 * Math.sin(phi) * Math.cos(angle),
                  4 * Math.cos(phi),
                  4 * Math.sin(phi) * Math.sin(angle)
                );
              })}
              color={color}
              lineWidth={isVolumeMeridian ? 2 : 1}
              transparent
              opacity={isVolumeMeridian ? 0.7 : 0.3}
            />
            
            {/* Label at equator */}
            {isVolumeMeridian && (
              <Text
                position={[
                  4.5 * Math.cos(angle),
                  0,
                  4.5 * Math.sin(angle)
                ]}
                fontSize={0.25}
                color={color}
                anchorX="center"
              >
                {label}
              </Text>
            )}
          </group>
        );
      })}
      
      {/* NEEDLE: Price-in-time pointer */}
      <group ref={needleRef}>
        {/* Needle shaft */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.2, 16]} />
          <meshStandardMaterial
            color={activeBell.hexColor}
            emissive={activeBell.hexColor}
            emissiveIntensity={0.9}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        
        {/* Needle tip (cone) */}
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[0.15, 0.4, 16]} />
          <meshStandardMaterial
            color={activeBell.hexColor}
            emissive={activeBell.hexColor}
            emissiveIntensity={1.0}
            metalness={1.0}
            roughness={0.0}
          />
        </mesh>
        
        {/* Glowing sphere at needle base */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={activeBell.hexColor}
            emissive={activeBell.hexColor}
            emissiveIntensity={1.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Price label */}
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          ${marketData.price.toFixed(2)}
        </Text>
        
        {/* Time label */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.2}
          color="#888888"
          anchorX="center"
        >
          {new Date().toLocaleTimeString()}
        </Text>
      </group>
      
      {/* Center origin marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Axes helpers (X=red, Y=green, Z=blue) */}
      <axesHelper args={[5]} />
      
      {/* Bell frequency indicator */}
      <Text
        position={[0, -5.5, 0]}
        fontSize={0.5}
        color={activeBell.hexColor}
        anchorX="center"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {activeBell.name} - {activeBell.frequency}Hz
      </Text>
      
      {/* Fear & Greed Index display */}
      <Text
        position={[-5.5, 3, 0]}
        fontSize={0.3}
        color={fearGreedIndex > 60 ? '#00ff00' : fearGreedIndex < 40 ? '#ff0000' : '#ffff00'}
        anchorX="left"
      >
        F&G: {fearGreedIndex.toFixed(0)}
      </Text>
      
      {/* Volume display */}
      <Text
        position={[-5.5, 2.5, 0]}
        fontSize={0.3}
        color="#00ffff"
        anchorX="left"
      >
        Vol: {volumeNormalized.toFixed(0)}%
      </Text>
      
      {/* Change % display */}
      <Text
        position={[-5.5, 2, 0]}
        fontSize={0.3}
        color={marketData.priceChange24h >= 0 ? '#00ff00' : '#ff0000'}
        anchorX="left"
      >
        Δ: {marketData.priceChange24h >= 0 ? '+' : ''}{marketData.priceChange24h.toFixed(2)}%
      </Text>
    </group>
  );
}

/**
 * Bloch Sphere Visualization
 * Grid divisions show Hz and Market Volume (M.V.)
 */
function BlochSphereVisualization({ 
  marketData, 
  activeBell 
}: { 
  marketData: AggregatedMarketData;
  activeBell: BellConfiguration;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Generate latitude lines (Hz grid)
  const latitudes = Array.from({ length: 7 }, (_, i) => {
    const bellIndex = 6 - i; // Bell-7 to Bell-1
    const bell = SEVEN_BELLS[bellIndex];
    const theta = (i / 6) * Math.PI;
    const points: THREE.Vector3[] = [];
    
    for (let j = 0; j <= 64; j++) {
      const phi = (j / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(
        3 * Math.sin(theta) * Math.cos(phi),
        3 * Math.cos(theta),
        3 * Math.sin(theta) * Math.sin(phi)
      ));
    }
    
    return { points, bell };
  });

  // Generate longitude lines (M.V. grid)
  const longitudes = Array.from({ length: 12 }, (_, i) => {
    const phi = (i / 12) * Math.PI * 2;
    const points: THREE.Vector3[] = [];
    
    for (let j = 0; j <= 32; j++) {
      const theta = (j / 32) * Math.PI;
      points.push(new THREE.Vector3(
        3 * Math.sin(theta) * Math.cos(phi),
        3 * Math.cos(theta),
        3 * Math.sin(theta) * Math.sin(phi)
      ));
    }
    
    return points;
  });

  return (
    <group>
      {/* Transparent sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshPhysicalMaterial
          color={activeBell.hexColor}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Latitude lines (Hz grid) with Bell labels */}
      {latitudes.map((lat, i) => (
        <group key={`lat-${i}`}>
          <Line
            points={lat.points}
            color={lat.bell.hexColor}
            lineWidth={2}
          />
          <Text
            position={[3.5, 3 * Math.cos((i / 6) * Math.PI), 0]}
            fontSize={0.2}
            color={lat.bell.hexColor}
          >
            {lat.bell.frequency}Hz
          </Text>
        </group>
      ))}
      
      {/* Longitude lines (M.V. grid) */}
      {longitudes.map((points, i) => (
        <Line
          key={`lon-${i}`}
          points={points}
          color="#666666"
          lineWidth={1}
        />
      ))}
      
      {/* Market volume indicator on equator */}
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.3}
        color="#FFFFFF"
        anchorX="center"
      >
        M.V.: {(marketData.volume24h / 1e9).toFixed(2)}B
      </Text>
      
      {/* Axes */}
      <Line points={[[0, -3.5, 0], [0, 3.5, 0]]} color="#FF0000" lineWidth={2} />
      <Line points={[[-3.5, 0, 0], [3.5, 0, 0]]} color="#00FF00" lineWidth={2} />
      <Line points={[[0, 0, -3.5], [0, 0, 3.5]]} color="#0000FF" lineWidth={2} />
    </group>
  );
}

/**
 * Torus Visualization
 * Inner core twists with volatility
 * Fear & Greed sparkle effect
 */
function TorusVisualization({ 
  marketData, 
  activeBell,
  fearGreedIndex 
}: { 
  marketData: AggregatedMarketData;
  activeBell: BellConfiguration;
  fearGreedIndex: number;
}) {
  const torusRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [particles] = useState(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute particles around torus
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const majorRadius = 3;
      const minorRadius = 1;
      
      positions[i * 3] = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
      positions[i * 3 + 1] = minorRadius * Math.sin(phi);
      positions[i * 3 + 2] = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);
      
      // Color based on fear & greed
      const greedColor = new THREE.Color('#00FF00');
      const fearColor = new THREE.Color('#FF0000');
      const neutralColor = new THREE.Color('#FFFF00');
      
      let color: THREE.Color;
      if (fearGreedIndex > 60) {
        color = greedColor;
      } else if (fearGreedIndex < 40) {
        color = fearColor;
      } else {
        color = neutralColor;
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  });

  useFrame((state) => {
    if (torusRef.current) {
      // Calculate volatility-based twist
      const volatility = Math.abs(marketData.priceChange24h) / 100;
      const twistAmount = volatility * Math.PI;
      
      // Rotate torus
      torusRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * twistAmount;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      torusRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * twistAmount * 0.5;
    }
    
    if (particlesRef.current) {
      // Sparkle effect based on fear & greed
      const sparkleSpeed = (Math.abs(fearGreedIndex - 50) / 50) * 2;
      particlesRef.current.rotation.y = state.clock.elapsedTime * sparkleSpeed;
      
      // Pulsate particles
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      particlesRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Main torus with color changes */}
      <mesh ref={torusRef}>
        <torusGeometry args={[3, 1, 32, 100]} />
        <meshStandardMaterial
          color={activeBell.hexColor}
          emissive={activeBell.hexColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>
      
      {/* Fear & Greed sparkle particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Fear & Greed Index display */}
      <Text
        position={[0, -5, 0]}
        fontSize={0.5}
        color={fearGreedIndex > 60 ? '#00FF00' : fearGreedIndex < 40 ? '#FF0000' : '#FFFF00'}
        anchorX="center"
      >
        Fear & Greed: {fearGreedIndex.toFixed(0)}
      </Text>
    </group>
  );
}

/**
 * Main RangisHeartbeat Component
 */
export default function RangisHeartbeat({
  marketData,
  enableAudio = true,
  enableHaptics = false,
  visualizationMode = 'all'
}: RangisHeartbeatProps) {
  const [activeBell, setActiveBell] = useState<BellConfiguration>(SEVEN_BELLS[3]); // Default to Choir (432Hz)
  const [fearGreedIndex, setFearGreedIndex] = useState<number>(50);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Update active bell based on market data
  useEffect(() => {
    if (!marketData) return;
    
    const newBell = calculateActiveBell(
      marketData.priceChange24h,
      0.1, // volatility (can be calculated from price history)
      marketData.volume24h / 1e9, // normalized volume
      0.5 // sentiment (can be integrated from sentiment API)
    );
    
    setActiveBell(newBell);
    
    // Calculate fear & greed index
    const fgi = calculateFearGreedIndex(
      marketData.priceChange24h,
      0.1,
      marketData.volume24h / 1e9,
      marketData.priceChange24h / 100
    );
    setFearGreedIndex(fgi);
  }, [marketData]);

  // Audio engine - play bell frequency
  useEffect(() => {
    if (!enableAudio || !activeBell) return;
    
    // Initialize Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    
    // Stop previous oscillator
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }
    
    // Create new oscillator for bell frequency
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine'; // Pure sine wave
    oscillator.frequency.setValueAtTime(activeBell.frequency, audioContext.currentTime);
    
    // Fade in/out for smooth transitions
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillatorRef.current = oscillator;
    
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
    };
  }, [activeBell, enableAudio]);

  // Haptic feedback (if supported)
  useEffect(() => {
    if (!enableHaptics || !activeBell) return;
    
    if ('vibrate' in navigator) {
      // Vibrate pattern based on bell frequency
      const pattern = activeBell.id >= 5 
        ? [100, 50, 100] // High bells: short pulses
        : [200, 100, 200]; // Low bells: longer pulses
      
      navigator.vibrate(pattern);
    }
  }, [activeBell, enableHaptics]);

  return (
    <div className="w-full h-screen bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={activeBell.hexColor} />
        
        {/* Visualizations */}
        {(visualizationMode === 'spinor' || visualizationMode === 'all') && (
          <group position={[-8, 0, 0]}>
            <SpinorVisualization marketData={marketData} activeBell={activeBell} />
          </group>
        )}
        
        {(visualizationMode === 'bloch' || visualizationMode === 'all') && (
          <group position={[0, 0, 0]}>
            <BlochSphereVisualization marketData={marketData} activeBell={activeBell} />
          </group>
        )}
        
        {(visualizationMode === 'torus' || visualizationMode === 'all') && (
          <group position={[8, 0, 0]}>
            <TorusVisualization 
              marketData={marketData} 
              activeBell={activeBell}
              fearGreedIndex={fearGreedIndex}
            />
          </group>
        )}
      </Canvas>
      
      {/* HUD overlay */}
      <div className="absolute top-4 left-4 text-white">
        <div className="bg-black/50 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">RangisHeartbeat</h2>
          <p className="text-sm">Symbol: {marketData.symbol}</p>
          <p className="text-sm">Price: ${marketData.price.toFixed(2)}</p>
          <p className="text-sm">24h Change: {marketData.priceChange24h.toFixed(2)}%</p>
          <p className="text-sm">Volume: ${(marketData.volume24h / 1e9).toFixed(2)}B</p>
          <div className="mt-4">
            <p className="text-lg font-bold" style={{ color: activeBell.hexColor }}>
              {activeBell.name} - {activeBell.frequency}Hz
            </p>
            <p className="text-xs">{activeBell.marketCondition}</p>
            <p className="text-xs">{activeBell.emotionalState}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
