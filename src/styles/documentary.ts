import type {Style} from './index';
// Matches the reference video: dark dramatic gradients, white captions in a dark pill, yellow key words.
export const documentary: Style = {
  name: 'documentary',
  fontFamily: 'StoryFont, sans-serif',
  backgrounds: {
    night: ['#0b1030', '#2a1b5e'],
    sunset: ['#ff9a3c', '#6a1b6e'],
    sky: ['#4aa8ff', '#bfe6ff'],
    rays: ['#ff8a00', '#ffb347'],
    dark: ['#10131c', '#262b3a'],
  },
  defaultBg: ['night', 'sky', 'sunset', 'dark'],
  caption: {bg: 'rgba(15,18,30,0.82)', color: '#ffffff', highlight: '#ffd93b', size: 74, radius: 44},
  accent: '#ffd93b',
  stars: true,
  clouds: true,
  secondsPerVisual: 3,
};
