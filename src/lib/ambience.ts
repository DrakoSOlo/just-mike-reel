/**
 * "Rain in the forest" — a tiny synthesised ambience.
 *
 * No audio file is downloaded: everything is generated with the Web Audio API
 * (filtered noise for the rain, a slow band for wind through the canopy, plus
 * sparse drips and distant birds), so the soundtrack costs zero bytes and
 * loops forever without a seam.
 */

export const AMBIENCE_KEY = "jm-ambience";

const TARGET_GAIN = 0.16;
const FADE = 1.2;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let nodes: AudioNode[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let playing = false;

const listeners = new Set<(on: boolean) => void>();

function notify() {
  for (const listener of listeners) listener(playing);
}

export function onAmbienceChange(listener: (on: boolean) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isAmbiencePlaying() {
  return playing;
}

function noiseBuffer(audio: AudioContext) {
  const length = audio.sampleRate * 3;
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  // Pink-ish noise (Voss-ish smoothing) — softer and more natural than white.
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99765 * b0 + white * 0.099;
    b1 = 0.963 * b1 + white * 0.2965;
    b2 = 0.57 * b2 + white * 1.0526;
    data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.22;
  }
  return buffer;
}

function loopSource(audio: AudioContext, buffer: AudioBuffer, detune = 0) {
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.playbackRate.value = 1 + detune;
  return source;
}

/** One rain drop landing on a leaf. */
function drip(audio: AudioContext, out: GainNode, at: number) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const freq = 900 + Math.random() * 1600;
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, at);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.45, at + 0.09);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.05, at + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + 0.2);
}

/** A distant bird, two or three notes. */
function bird(audio: AudioContext, out: GainNode, at: number) {
  const notes = 2 + Math.floor(Math.random() * 2);
  const base = 1800 + Math.random() * 1200;
  for (let i = 0; i < notes; i += 1) {
    const start = at + i * 0.16;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(base, start);
    osc.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.4), start + 0.07);
    osc.frequency.exponentialRampToValueAtTime(base * 0.9, start + 0.12);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.028, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.13);
    osc.connect(gain).connect(out);
    osc.start(start);
    osc.stop(start + 0.16);
  }
}

function scheduleDetail(audio: AudioContext, out: GainNode) {
  const tick = () => {
    if (!playing) return;
    const now = audio.currentTime;
    const drops = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < drops; i += 1) drip(audio, out, now + Math.random() * 2);
    if (Math.random() < 0.28) bird(audio, out, now + Math.random() * 2);
    timer = setTimeout(tick, 1400 + Math.random() * 2200);
  };
  tick();
}

export async function startAmbience() {
  if (playing) return;
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;

  ctx ??= new AudioCtor();
  const audio = ctx;
  if (audio.state === "suspended") await audio.resume();

  master = audio.createGain();
  master.gain.setValueAtTime(0.0001, audio.currentTime);
  master.gain.linearRampToValueAtTime(TARGET_GAIN, audio.currentTime + FADE);
  master.connect(audio.destination);

  const buffer = noiseBuffer(audio);

  // Steady rain: mid/high hiss rolled off so it stays behind the page.
  const rain = loopSource(audio, buffer);
  const rainFilter = audio.createBiquadFilter();
  rainFilter.type = "bandpass";
  rainFilter.frequency.value = 1500;
  rainFilter.Q.value = 0.4;
  const rainGain = audio.createGain();
  rainGain.gain.value = 0.85;
  rain.connect(rainFilter).connect(rainGain).connect(master);

  // Canopy / wind: low rumble with a slow breathing swell.
  const wind = loopSource(audio, buffer, -0.12);
  const windFilter = audio.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 320;
  const windGain = audio.createGain();
  windGain.gain.value = 0.5;
  wind.connect(windFilter).connect(windGain).connect(master);

  const lfo = audio.createOscillator();
  const lfoGain = audio.createGain();
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 0.22;
  lfo.connect(lfoGain).connect(windGain.gain);

  rain.start();
  wind.start();
  lfo.start();

  nodes = [rain, wind, lfo, rainFilter, windFilter, rainGain, windGain, lfoGain];
  playing = true;
  scheduleDetail(audio, master);
  notify();
}

export function stopAmbience() {
  if (!playing || !ctx || !master) return;
  const audio = ctx;
  const out = master;
  playing = false;
  if (timer) clearTimeout(timer);
  timer = null;
  out.gain.cancelScheduledValues(audio.currentTime);
  out.gain.setValueAtTime(out.gain.value, audio.currentTime);
  out.gain.linearRampToValueAtTime(0.0001, audio.currentTime + 0.6);
  const stopping = nodes;
  nodes = [];
  master = null;
  setTimeout(() => {
    for (const node of stopping) {
      const source = node as AudioScheduledSourceNode;
      if (typeof source.stop === "function") {
        try {
          source.stop();
        } catch {
          /* already stopped */
        }
      }
      node.disconnect();
    }
    out.disconnect();
  }, 700);
  notify();
}

export function toggleAmbience() {
  if (playing) stopAmbience();
  else void startAmbience();
}
