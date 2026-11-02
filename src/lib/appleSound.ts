/** Apple sounds, synthesised so the site ships no audio files. */

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;

/** Browsers only allow audio after a click, tap, or key press. */
export function unlockSound() {
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  if (!noise) {
    noise = context.createBuffer(1, context.sampleRate * 0.4, context.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  }
}

/** One crack of the skin: a very short burst of filtered noise. */
function crack(at: number, frequency: number, volume: number) {
  if (!context || !noise) return;
  const source = context.createBufferSource();
  source.buffer = noise;
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  filter.Q.value = 0.9;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05 + Math.random() * 0.05);
  source.connect(filter).connect(gain).connect(context.destination);
  source.start(at, Math.random() * 0.25, 0.12);
}

function thump(at: number, from: number, to: number, volume: number, length: number) {
  if (!context) return;
  const oscillator = context.createOscillator();
  oscillator.frequency.setValueAtTime(from, at);
  oscillator.frequency.exponentialRampToValueAtTime(to, at + length);
  const gain = context.createGain();
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(at);
  oscillator.stop(at + length);
}

/** A bite: the snap of the teeth, then a run of smaller crunches. */
export function playBite() {
  if (!context || context.state !== "running") return;
  const now = context.currentTime;
  thump(now, 240, 90, 0.22, 0.07);
  crack(now, 2600, 0.5);
  for (let i = 1; i <= 5; i++) {
    crack(now + i * (0.03 + Math.random() * 0.03), 1600 + Math.random() * 2600, 0.34 - i * 0.04);
  }
}

