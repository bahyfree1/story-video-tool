// A style is a plain object. To add a new style: copy documentary.ts, change values, register it below.
export type Style = {
  name: string;
  fontFamily: string;
  backgrounds: Record<string, [string, string]>; // name -> gradient top/bottom
  defaultBg: string[];       // cycle of backgrounds when a line has none
  caption: {bg: string; color: string; highlight: string; size: number; radius: number; mode?: 'pill' | 'karaoke' | 'outline'};
  transition?: 'wipe' | 'slide' | 'zoom' | 'fade';
  charScale?: number;
  sparkles?: boolean;
  look?: string; // default character look name
  accent: string;
  stars: boolean;
  clouds: boolean;
  secondsPerVisual: number;  // roughly how often a visual changes
};
import {documentary} from './documentary';
import {kidsBright} from './kidsBright';
import {karaokeDark} from './karaokeDark';
import {kids3to5, kids6to8, kids9to12} from './kidsAges';
export const styles: Record<string, Style> = {documentary, kidsBright, karaokeDark, kids3to5, kids6to8, kids9to12};
