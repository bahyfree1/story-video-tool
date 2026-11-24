import type {Style} from './index';
import {documentary} from './documentary';
// Documentary look with big karaoke captions (no box, current word lit).
export const karaokeDark: Style = {...documentary, name: 'karaokeDark', caption: {...documentary.caption, bg: 'rgba(0,0,0,0)', size: 96, mode: 'karaoke'}};
