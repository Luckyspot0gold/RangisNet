// TEMPORARILY DISABLED FOR BUILD - needs proper refactoring
// This file has been simplified for build compatibility

export class SensoryMapper {
  mapToAudio(prm: {probability: number; resonanceFreq: number;}): {freq: number; duration: number;} {
    // Sonification: Market calm (low VIX) = soothing 432Hz; volatility = rising tones
    const baseFreq = 432 + (1 - prm.probability) * 200; // Scale to 432-632Hz
    return { freq: prm.resonanceFreq || baseFreq, duration: 500 }; // ms pulse
  }

  mapToHaptic(prm: {probability: number;}): {intensity: number; pattern: 'buzz' | 'pulse';} {
    // Haptics: Success = gentle pulse; failure = intense buzz (<50ms latency)
    const intensity = prm.probability * 100;
    return { intensity, pattern: intensity > 0.7 ? 'pulse' : 'buzz' };
  }

  mapToVisual(prm: {resonanceFreq: number;}): {color: string; wave: string;} {
    // Cymatics: Freq to color/wave (e.g., high freq = blue sine waves)
    const hue = (prm.resonanceFreq % 360);
    return { color: `hsl(${hue}, 70%, 50%)`, wave: 'sine' }; // For WebGL render
  }
}

// Global mapper instance
export const Mapper = new SensoryMapper();
