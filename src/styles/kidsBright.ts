import type {Style} from './index';
// Placeholder for the kids styles. Light, no dark drama. Real per-age styles come later.
export const kidsBright: Style = {
  name: 'kidsBright',
  fontFamily: 'StoryFont, sans-serif',
  backgrounds: {
    sky: ['#8fd3ff', '#e8f8ff'],
    sun: ['#ffe27a', '#ffb3c7'],
    mint: ['#b8f2d0', '#e6fff2'],
  },
  defaultBg: ['sky', 'sun', 'mint'],
  caption: {bg: 'rgba(255,255,255,0.92)', color: '#2b2b55', highlight: '#ff4f81', size: 80, radius: 50},
  accent: '#ff4f81',
  stars: false,
  clouds: true,
  secondsPerVisual: 4,
};
