// Synthesised studio audience. No audio files, just filtered noise.

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function audio() {
  ctx ??= new AudioContext();
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return { ctx, noise };
}

function clap(ctx: AudioContext, buf: AudioBuffer, out: AudioNode, at: number, gain: number) {
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 900 + Math.random() * 1600;
  band.Q.value = 0.8 + Math.random() * 1.2;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, at);
  env.gain.linearRampToValueAtTime(gain, at + 0.002);
  env.gain.exponentialRampToValueAtTime(0.0001, at + 0.05 + Math.random() * 0.05);
  const pan = ctx.createStereoPanner();
  pan.pan.value = Math.random() * 1.6 - 0.8;
  src.connect(band).connect(env).connect(pan).connect(out);
  src.start(at, Math.random() * 0.9, 0.12);
}

/** Roughly two seconds of applause: swells in, tails off. */
export function applause(seconds = 2.4) {
  const { ctx, noise } = audio();
  void ctx.resume();
  const master = ctx.createGain();
  master.gain.value = 0.55;
  master.connect(ctx.destination);
  const start = ctx.currentTime + 0.02;
  const claps = Math.round(seconds * 70);
  for (let i = 0; i < claps; i++) {
    // Denser early, sparser at the tail.
    const t = Math.pow(Math.random(), 1.6) * seconds;
    const swell = Math.min(1, t / 0.25) * (1 - (t / seconds) * 0.8);
    clap(ctx, noise, master, start + t, 0.25 + swell * 0.6);
  }
}

/** Ba-dum tss. */
export function rimshot() {
  const { ctx, noise } = audio();
  void ctx.resume();
  const t0 = ctx.currentTime + 0.02;

  const tom = (at: number, freq: number) => {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.frequency.setValueAtTime(freq, at);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.55, at + 0.18);
    env.gain.setValueAtTime(0.7, at);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
    osc.connect(env).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + 0.25);
  };
  tom(t0, 190);
  tom(t0 + 0.16, 150);

  const at = t0 + 0.36;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 6500;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.5, at);
  env.gain.exponentialRampToValueAtTime(0.0001, at + 1.1);
  src.connect(hp).connect(env).connect(ctx.destination);
  src.start(at, 0, 1.2);
}
