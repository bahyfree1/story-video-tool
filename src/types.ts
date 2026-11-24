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
  lines: Line[];
};
