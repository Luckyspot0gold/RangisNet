// src/core/ProbabilityTensor.ts
// Optimized for real-time, on-chain + off-chain hybrid use
// Runs on browser, mobile, and Avalanche subnet nodes

export class RangisProbabilityTensor {
  // Realistic, usable dimensions (total ~9.6M elements = 38 MB Float32)
  static readonly SHAPE = {
    price: 256,      // 0.05% steps from -6.4% to +6.4% (covers 99.9% of moves)
    time: 96,        // 15-minute bins for 24h (perfect for intraday + daily)
    vol: 64,         // Volatility buckets 0–100% annualized, ~1.5% steps
    regime: 5,       // extreme_bear, bear, neutral, bull, extreme_bull
    sentiment: 5     // fear, uncertainty, neutral, confidence, euphoria
  } as const;

  readonly size = 256 * 96 * 64 * 5 * 5; // 9,830,400 elements
  readonly data = new Float32Array(this.size);
  readonly strides = this.computeStrides();

  // Current market state (updated every tick)
  current = {
    price: 0,      // normalized price index
    time: 0,
    vol: 0,
    regime: 2,     // neutral start
    sentiment: 2
  };

  private computeStrides() {
    const s = Object.values(RangisProbabilityTensor.SHAPE);
    const strides = new Uint32Array(s.length);
    strides[strides.length - 1] = 1;
    for (let i = s.length - 2; i >= 0; i--) {
      strides[i] = strides[i + 1] * s[i + 1];
    }
    return strides;
  }

  // Fast index access (used 1000s of times per second)
  private idx(p: number, t: number, v: number, r: number, s: number): number {
    return p * this.strides[0] +
           t * this.strides[1] +
           v * this.strides[2] +
           r * this.strides[3] +
           s * this.strides[4];
  }

  set(p: number, t: number, v: number, r: number, s: number, prob: number) {
    this.data[this.idx(p, t, v, r, s)] = prob;
  }

  get(p: number, t: number, v: number, r: number, s: number): number {
    return this.data[this.idx(p, t, v, r, s)] || 0;
  }

  // Normalize entire tensor (called after each update)
  normalize() {
    let sum = 0;
    for (let i = 0; i < this.data.length; i++) sum += this.data[i];
    if (sum > 0) {
      const norm = 1 / sum;
      for (let i = 0; i < this.data.length; i++) this.data[i] *= norm;
    }
  }

  // Extract 2D price-time probability surface (for visualization + haptics)
  getPriceTimeSurface(regime = this.current.regime, sentiment = this.current.sentiment) {
    const surface = new Float32Array(256 * 96);
    for (let p = 0; p < 256; p++) {
      for (let t = 0; t < 96; t++) {
        let prob = 0;
        for (let v = 0; v < 64; v++) {
          prob += this.get(p, t, v, regime, sentiment);
        }
        surface[p * 96 + t] = prob;
      }
    }
    return surface;
  }

  // Convert tensor slice → sensory output (your core magic)
  toSensory() {
    const surface = this.getPriceTimeSurface();
    const skew = this.computeSkew(surface);
    const kurtosis = this.computeKurtosis(surface);
    const entropy = this.computeEntropy(surface);

    return {
      // Harmonic
      baseFreq: 432 + skew * 100,                    // negative skew → lower tone
      harmonics: Math.min(12, Math.floor(entropy * 20)),

      // Haptic
      pattern: skew > 0.5 ? "ascending" : skew < -0.5 ? "descending" : "pulse",
      intensity: Math.sqrt(kurtosis) * 0.8,
      rhythm: entropy > 0.7 ? "chaotic" : "steady",

      // Visual
      colorDominant: skew > 0 ? "#ff3366" : "#33ccff",
      torusRotationSpeed: entropy * 10,
      cymaticComplexity: Math.floor(kurtosis * 5)
    };
  }

  private computeSkew(surface: Float32Array): number {
    // Simplified fast skew from 2D surface
    let sum = 0, mean = 0, count = 0;
    for (let i = 0; i < surface.length; i++) {
      mean += i * surface[i];
      sum += surface[i];
      count++;
    }
    mean /= sum;
    return (mean / count - 0.5) * 2; // -1 to +1
  }

  private computeKurtosis(surface: Float32Array): number {
    // Peakiness proxy
    let max = 0;
    for (let v of surface) if (v > max) max = v;
    return max * surface.length;
  }

  private computeEntropy(surface: Float32Array): number {
    let entropy = 0;
    for (let p of surface) {
      if (p > 0) entropy -= p * Math.log2(p);
    }
    return entropy / Math.log2(surface.length); // normalized 0–1
  }
}
