export class HarmonicAudio {
  private ctx: AudioContext | null = null;
  private gains: GainNode[] = [];
  private freqs = [86.0,111.11,432.0,753.0,1074.0,1395.0,1618.0];
  async init() {
    if (this.ctx) return; this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.freqs.forEach(f=>{
      const osc = this.ctx!.createOscillator(); const g = this.ctx!.createGain();
      osc.frequency.value = f; osc.connect(g); g.connect(this.ctx!.destination); g.gain.value = 0.0; osc.start();
      this.gains.push(g);
    });
  }
  // omega: resonance, p: |alpha|^2, amps array length 7 in [0..1]
  update(omega:number, p:number, amps:number[]) {
    if (!this.ctx) return; const base = Math.min(1, Math.max(0, p));
    this.gains.forEach((g,i)=>{ g.gain.setTargetAtTime(base*amps[i], this.ctx!.currentTime, 0.05); });
    if (navigator.vibrate) navigator.vibrate([Math.min(300, Math.max(40, omega/10))]);
  }
}
