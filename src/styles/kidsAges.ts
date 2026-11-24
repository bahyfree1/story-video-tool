import type {Style} from './index';
// Kids styles by age. Same engine, different look and pace. Tune freely.
// 3-5: very big text, soft pastel, round and slow, big character.
export const kids3to5: Style = {
  name: 'kids3to5', fontFamily: 'StoryFont, sans-serif',
  backgrounds: {peach: ['#ffd6e0', '#fff1c9'], sky: ['#bfe9ff', '#f2fbff'], mint: ['#c9f7dc', '#f1fff7'], lemon: ['#fff3a8', '#ffe0b3']},
  defaultBg: ['peach', 'sky', 'mint', 'lemon'],
  caption: {bg: 'rgba(255,255,255,0.95)', color: '#3a2f6b', highlight: '#ff4f81', size: 92, radius: 64, mode: 'pill'},
  accent: '#ff7a59', stars: false, clouds: true, secondsPerVisual: 5, transition: 'zoom', charScale: 1.05, charBottom: 640, sparkles: true,
};
// 6-8: bright and playful, medium text.
export const kids6to8: Style = {
  name: 'kids6to8', fontFamily: 'StoryFont, sans-serif',
  backgrounds: {sky: ['#5bbcff', '#d8f2ff'], sun: ['#ffcf4a', '#ff8fa3'], grass: ['#7fe0a1', '#e2ffd8'], grape: ['#9b8cff', '#e0d9ff']},
  defaultBg: ['sky', 'sun', 'grass', 'grape'],
  caption: {bg: 'rgba(255,255,255,0.92)', color: '#232a63', highlight: '#ff3d71', size: 88, radius: 52, mode: 'pill'},
  accent: '#ffb300', stars: false, clouds: true, secondsPerVisual: 4, transition: 'slide', charScale: 1, sparkles: true,
};
// 9-12: faster, bolder outline captions, a bit more dramatic colors.
export const kids9to12: Style = {
  name: 'kids9to12', fontFamily: 'StoryFont, sans-serif',
  backgrounds: {night: ['#14183d', '#4b2a7a'], sunset: ['#ff8a4c', '#7a2a8f'], ocean: ['#0f6fb5', '#27c7c0'], lime: ['#2d2f6b', '#6bd36b']},
  defaultBg: ['ocean', 'sunset', 'night', 'lime'],
  caption: {bg: 'rgba(0,0,0,0)', color: '#ffffff', highlight: '#ffe14d', size: 92, radius: 0, mode: 'outline'},
  accent: '#ffe14d', stars: true, clouds: false, secondsPerVisual: 3, transition: 'wipe', charScale: 0.9, sparkles: true,
};
