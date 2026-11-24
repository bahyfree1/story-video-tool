export type Word = {text: string; highlight: boolean; start: number; end: number};
export type Line = {
  words: Word[];
  start: number; // seconds
  end: number;
  directives: Record<string, string>;
};
export type Timeline = {
  project: string;
  style: string;
  fps: number;
  duration: number; // seconds
  hasVoice: boolean;
  hasMusic?: boolean;
  aspect?: '9:16' | '16:9' | '1:1';
  musicVolume?: number; // 0..1 while nobody speaks (ducked to 35% during speech)
  lines: Line[];
};
