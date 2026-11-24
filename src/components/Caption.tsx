import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Line} from '../types';
import type {Style} from '../styles';

export const Caption: React.FC<{line: Line; style: Style; localFrame: number}> = ({line, style, localFrame}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const c = style.caption;
  const pop = spring({frame: localFrame, fps, config: {damping: 14, stiffness: 160}});
  const t = line.start + localFrame / fps;
  return (
    <div style={{position: 'absolute', left: 50, right: 50, bottom: 300, display: 'flex', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * pop})`, opacity: Math.min(1, pop * 1.5)}}>
      <div
        dir="rtl"
        style={{
          background: c.bg, color: c.color, borderRadius: c.radius, padding: '32px 48px', fontSize: c.size, fontWeight: 700,
          fontFamily: style.fontFamily, lineHeight: 1.45, textAlign: 'center', boxShadow: '0 12px 40px rgba(0,0,0,0.35)', maxWidth: 980,
        }}
      >
        {line.words.map((w, i) => (
          <span key={i} style={{color: w.highlight ? c.highlight : c.color, display: 'inline-block', marginInline: 8, opacity: t >= w.start - 0.05 ? 1 : 0.25, transform: t >= w.start && t < w.end ? 'scale(1.1) translateY(-4px)' : 'scale(1)'}}>
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
};
