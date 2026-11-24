import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import type {Style} from '../styles';

const rand = (i: number) => {
  const x = Math.sin(i * 999.123) * 10000;
  return x - Math.floor(x);
};

export const Background: React.FC<{style: Style; bg: string; prevBg: string; localFrame: number; rays?: boolean}> = ({style, bg, prevBg, localFrame, rays}) => {
  const frame = useCurrentFrame();
  const [a, b] = style.backgrounds[bg] ?? Object.values(style.backgrounds)[0];
  const [pa, pb] = style.backgrounds[prevBg] ?? [a, b];
  const mix = interpolate(localFrame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(${pa}, ${pb})`}} />
      <AbsoluteFill style={{background: `linear-gradient(${a}, ${b})`, opacity: mix}} />
      {rays || bg === 'rays' ? (
        <AbsoluteFill style={{background: `repeating-conic-gradient(from ${frame * 0.4}deg at 50% 45%, rgba(255,255,255,0.14) 0deg 10deg, rgba(255,255,255,0) 10deg 20deg)`}} />
      ) : null}
      {style.stars && (bg === 'night' || bg === 'dark')
        ? Array.from({length: 40}).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: `${rand(i) * 100}%`, top: `${rand(i + 50) * 70}%`, width: 6 + rand(i + 9) * 8, height: 6 + rand(i + 9) * 8, borderRadius: '50%', background: '#fff', opacity: 0.35 + 0.65 * Math.abs(Math.sin(frame / 18 + i))}} />
          ))
        : null}
      {style.clouds
        ? Array.from({length: 4}).map((_, i) => {
            const x = ((frame * (0.6 + i * 0.25) + i * 400) % 1500) - 300;
            return (
              <div key={i} style={{position: 'absolute', left: x, top: 150 + i * 190, width: 260 + i * 40, height: 90, borderRadius: 90, background: 'rgba(255,255,255,0.16)', filter: 'blur(2px)'}} />
            );
          })
        : null}
    </AbsoluteFill>
  );
};
