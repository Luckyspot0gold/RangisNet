// HAMILTONIAN McCREA ASSET COGNITION SENSORY BRIDGE
// Maps 7-Bell resonance to spherical cognitive grid for x402 agent payments
// Integrates McCrea Metrics™ with Sonic Event Codes™ for Avalanche

class McCreaCognitiveGrid {
  constructor(baseFreq = 432.89) {  // Solfeggio base for Bell equilibrium
    this.baseFreq = baseFreq;
    this.latitudePlanes = {
      'ASCENDED_TRADING': { k: 1.0, freqMultiplier: 1.2, bell: 7 },     // Coherence peak
      'QUANTUM_CERTAINTY': { k: 0.75, freqMultiplier: 1.1, bell: 6 },   // TMP stability
      'RESONANT_FLOW': { k: 0.5, freqMultiplier: 1.0, bell: 5 },        // HRI horizon
      'BASE_REALITY': { k: 0.0, freqMultiplier: 1.0, bell: 4 },         // Equilibrium
      'PROBABILITY_EDGE': { k: -0.5, freqMultiplier: 0.9, bell: 3 },    // Uncertainty
      'PHASE_TRANSITION': { k: -0.75, freqMultiplier: 0.8, bell: 2 },   // Vortex
      'GROUND_STATE': { k: -1.0, freqMultiplier: 0.7, bell: 1 }         // Floor
    };
    
    this.longitudeAxes = {
      'PRIME_MERIDIAN': { phi: 0, axis: 'i', label: 'PRICE/MOMENTUM' },      // What?
      'ENERGY_MERIDIAN': { phi: 90, axis: 'j', label: 'VOLUME/ENERGY' },     // How strong?
      'TIME_MERIDIAN': { phi: 180, axis: '-i', label: 'TIME/STABILITY' },    // How long?
      'SENTIMENT_MERIDIAN': { phi: 270, axis: '-j', label: 'SENTIMENT/FEAR' } // Why?
    };
    
    this.cognitiveZones = {
      'POSITIVE_MOMENTUM|HIGH_ENERGY|STABLE': 'BULL_COHERENCE',
      'NEGATIVE_MOMENTUM|HIGH_ENERGY|STABLE': 'REVERSION_VORTEX',
      'POSITIVE_MOMENTUM|LOW_ENERGY|UNSTABLE': 'FALSE_BULL_TRAP',
      'NEGATIVE_MOMENTUM|LOW_ENERGY|UNSTABLE': 'BEAR_GRAVITY_WELL',
      'POSITIVE_MOMENTUM|HIGH_ENERGY|UNSTABLE': 'MOMENTUM_EXPLOSION',
      'NEGATIVE_MOMENTUM|HIGH_ENERGY|UNSTABLE': 'PANIC_CASCADE',
      'POSITIVE_MOMENTUM|LOW_ENERGY|STABLE': 'QUIET_ACCUMULATION',
      'NEGATIVE_MOMENTUM|LOW_ENERGY|STABLE': 'DEAD_CAT_BOUNCE'
    };
  }

  // Calculate spherical inclination (theta) from bell coherence (0-1 normalized)
  calculateInclination(coherence) {
    // Map 0 (ground) to π/2 (equator), 1 (ascended) to 0 (north pole)
    return Math.acos(2 * coherence - 1);  // [-1,1] k -> [π, 0]
  }

  // Calculate azimuth (phi) from momentum/volume vectors
  calculateAzimuth(momentum, volume) {
    // atan2 for quadrant-aware phi: momentum (x), volume (y)
    return Math.atan2(volume, momentum);  // [-π, π] radians, normalize to [0, 2π]
  }

  // Map resonance to nearest latitude plane
  getLatitudePlane(theta) {
    const k = Math.cos(theta);  // Project to k-axis
    let closestPlane = null;
    let minDiff = Infinity;
    
    Object.entries(this.latitudePlanes).forEach(([name, plane]) => {
      const diff = Math.abs(k - plane.k);
      if (diff < minDiff) {
        minDiff = diff;
        closestPlane = name;
      }
    });
    
    return { ...this.latitudePlanes[closestPlane], name: closestPlane };
  }

  // Map phi to primary meridian
  getLongitudeMeridian(phi) {
    const normalizedPhi = ((phi + Math.PI) % (2 * Math.PI));  // [0, 2π]
    let closestMeridian = null;
    let minDiff = Infinity;
    
    Object.entries(this.longitudeAxes).forEach(([name, meridian]) => {
      const diff = Math.abs(normalizedPhi * (180 / Math.PI) - meridian.phi);  // Degrees
      if (diff < minDiff) {
        minDiff = diff;
        closestMeridian = name;
      }
    });
    
    return this.longitudeAxes[closestMeridian];
  }

  // Core mapping: Bell resonance + market data -> grid coords + state
  mapResonanceToGrid(bellFrequencies, marketData) {
    const theta = this.calculateInclination(bellFrequencies.coherence);
    const phi = this.calculateAzimuth(marketData.momentum, marketData.volume);
    
    const x = Math.sin(theta) * Math.cos(phi);  // i-proj (momentum)
    const y = Math.sin(theta) * Math.sin(phi);  // j-proj (energy)
    const z = Math.cos(theta);                  // k-proj (stability)
    
    const zoneKey = [
      x >= 0 ? 'POSITIVE_MOMENTUM' : 'NEGATIVE_MOMENTUM',
      y >= 0 ? 'HIGH_ENERGY' : 'LOW_ENERGY',
      z >= 0 ? 'STABLE' : 'UNSTABLE'
    ].join('|');
    
    const cognitiveState = this.cognitiveZones[zoneKey] || 'QUANTUM_SUPERPOSITION';
    const plane = this.getLatitudePlane(theta);
    const meridian = this.getLongitudeMeridian(phi);
    
    // Tune frequency for haptic/audio output (7-Bell integration)
    const tunedFreq = this.baseFreq * plane.freqMultiplier;
    
    return {
      coordinates: { theta: theta * (180 / Math.PI), phi: phi * (180 / Math.PI), x, y, z },  // Degrees for viz
      cognitiveState,
      resonanceLevel: plane,
      cognitiveAxis: meridian,
      tunedFrequency: tunedFreq,
      bell: plane.bell,
      hapticIntensity: Math.abs(z)  // |k| for vibration strength (0-1)
    };
  }

  // Emit Sonic Event Code™ for x402 agents (WebSocket-ready)
  emitRangiSignal(gridMapping, chain = 'Avalanche') {
    return {
      chain,
      symbol: 'AVAX',  // Or dynamic
      stability_index: gridMapping.resonanceLevel.k,
      execution_risk: 1 - Math.abs(gridMapping.coordinates.z),  // Inverted |k| for risk
      harmonics: [this.baseFreq, gridMapping.tunedFrequency, gridMapping.tunedFrequency * 1.5],  // Chord
      intensity: gridMapping.hapticIntensity,
      signal_mode: gridMapping.cognitiveState.toLowerCase().replace(/_/g, '-'),
      rangiSignal: `0x${Buffer.from(JSON.stringify(gridMapping.coordinates), 'utf8').toString('hex').slice(0, 8)}...`,  // Truncated hash
      timestamp: Date.now(),
      agentAction: gridMapping.cognitiveState.includes('COHERENCE') ? 'EXECUTE_PAYMENT' : 'PAUSE_AND_ROUTE'  // x402 hook
    };
  }

  // Render grid to live sphere (Three.js/Canvas export: vertices/colors for overlay)
  renderToSphere(gridMapping) {
    const { theta, phi } = gridMapping.coordinates;
    const radius = 1;  // Sphere radius
    
    // Latitude rings: Horizontal lines at plane k-values
    const latRings = Object.values(this.latitudePlanes).map(plane => ({
      y: plane.k * radius,  // k -> y in Cartesian
      color: plane.k > 0 ? 0x00ff00 : 0xff0000,  // Green (stable) / Red (unstable)
      opacity: Math.abs(plane.k)  // Fade at poles
    }));
    
    // Longitude meridians: Vertical lines at axis phis
    const lonMeridians = Object.values(this.longitudeAxes).map(axis => ({
      phiRad: (axis.phi * Math.PI / 180),
      xzPoints: Array.from({length: 50}, (_, i) => {
        const t = (i / 49) * Math.PI;  // Param along meridian
        return {
          x: radius * Math.sin(t) * Math.cos(axis.phiRad),
          z: radius * Math.sin(t) * Math.sin(axis.phiRad)
        };
      }),
      color: 0x0000ff  // Blue meridians
    }));
    
    // Octant zones: Color fills for cognitive states (e.g., Bull Coherence = green octant)
    const octantColors = {
      'BULL_COHERENCE': 0x00ff88,
      'REVERSION_VORTEX': 0x88ff00,
      // ... add all 8
    };
    
    return {
      latitudeRings,
      longitudeMeridians,
      currentPosition: { theta, phi },  // Highlight active point
      octantColor: octantColors[gridMapping.cognitiveState] || 0xffffff,
      hapticPattern: gridMapping.hapticIntensity > 0.7 ? [100, 50, 100] : [200]  // ms pulses for mobile
    };
  }
}

// ACTIVATION & INTEGRATION EXAMPLE (Wire to your harmonic-stream.js)
function activateCognitiveBridge(marketData, bellFrequencies) {
  const grid = new McCreaCognitiveGrid();
  
  const mapping = grid.mapResonanceToGrid(bellFrequencies, marketData);
  const rangiSignal = grid.emitRangiSignal(mapping);
  
  // Log for demo (stream to WebSocket in prod)
  console.log('🧠 COGNITIVE STATE ANALYSIS:');
  console.log('📍 Grid Position:', mapping.coordinates);
  console.log('🧭 Primary Axis:', mapping.cognitiveAxis.label);
  console.log('🎵 Tuned Frequency (Bell ' + mapping.bell + '):', mapping.tunedFrequency + ' Hz');
  console.log('📳 Haptic Intensity:', mapping.hapticIntensity);
  console.log('🗺️ Sphere Render Data:', grid.renderToSphere(mapping));
  console.log('🔊 Sonic Event Code™:', JSON.stringify(rangiSignal, null, 2));
  
  // x402 Agent Trigger Example
  if (rangiSignal.agentAction === 'EXECUTE_PAYMENT') {
    console.log('💸 Agent: Proceeding with AVAX tx – Bull Coherence confirmed!');
    // e.g., call x402 payment API
  } else {
    console.log('⏸️ Agent: Routing to subnet – Phase Transition detected.');
  }
  
  return { mapping, rangiSignal };
}

// MOCK AVAX DATA TEST (Replace with real RPC pull)
const mockBellFreqs = { coherence: 0.971, stability: 0.940 };  // From 7-Bells
const mockMarket = { momentum: 0.642, volume: 0.766, sentiment: 0.227 };

activateCognitiveBridge(mockMarket, mockBellFreqs);

// Export for dashboard integration (e.g., quantum-rangi-copy-87c224f3.base44.app)
module.exports = { McCreaCognitiveGrid, activateCognitiveBridge };
