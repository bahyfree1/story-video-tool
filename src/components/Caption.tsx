import React from 'react';
import {spring, useVideoConfig} from 'remotion';
import type {Line} from '../types';
import type {Style} from '../styles';

// Black outline made from shadows (works in every renderer, unlike text-stroke).
const OUTLINE = [[-5,0],[5,0],[0,-5],[0,5],[-4,-4],[4,-4],[-4,4],[4,4],[-6,0],[6,0],[0,6],[0,-6]].map(([x,y]) => `${x}px ${y}px 0 #000`).join(', ');

// Three caption looks: pill (reference), karaoke (big, current word lit, no box), outline (heavy stroked text).
export const Caption: React.FC<{line: Line; style: Style; localFrame: number}> = ({line, style, localFrame}) => {
  const {fps} = useVideoConfig();
  const c = style.caption;
  const mode = c.mode ?? 'pill';
  const pop = spring({frame: localFrame, fps, config: {damping: 14, stiffness: 160}});
  const t = line.start + localFrame / fps;
  const box: React.CSSProperties = mode === 'pill'
    ? {background: c.bg, borderRadius: c.radius, padding: '32px 48px', boxShadow: '0 12px 40px rgba(0,0,0,0.35)'}
    : {padding: '10px 20px'};
  const strokeCss: React.CSSProperties = mode === 'outline'
    ? {textShadow: OUTLINE}
    : mode === 'karaoke' ? {textShadow: `${OUTLINE}, 0 6px 24px rgba(0,0,0,0.6)`} : {};
  return (
    <div style={{position: 'absolute', left: 50, right: 50, bottom: 300, display: 'flex', justifyContent: 'center', transform: `scale(${0.85 + 0.15 * pop})`, opacity: Math.min(1, pop * 1.5)}}>
      <div dir="rtl" style={{...box, color: c.color, fontSize: c.size, fontWeight: 700, fontFamily: style.fontFamily, lineHeight: 1.45, textAlign: 'center', maxWidth: 980}}>
        {line.words.map((w, i) => {
          const active = t >= w.start && t < w.end;
          const spoken = t >= w.start - 0.05;
          const lit = mode === 'karaoke' ? active : w.highlight;
          return (
            <span key={i} style={{...strokeCss, color: lit || (mode === 'karaoke' && w.highlight && spoken) ? c.highlight : c.color, display: 'inline-block', marginInline: 8, opacity: spoken ? 1 : 0.3, transform: active ? 'scale(1.12) translateY(-5px)' : 'scale(1)'}}>
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
