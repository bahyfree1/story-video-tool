import React from 'react';
import {useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';

export type Mood = 'talk' | 'happy' | 'shock' | 'think' | 'fall' | 'sad';

export type Look = {skin: string; hair: string; outfit: string; scarf: string; pants: string; hat?: string};
export const defaultLook: Look = {skin: '#ffd3b0', hair: '#f6c744', outfit: '#2d6fd6', scarf: '#e84855', pants: '#23304f', hat: '#2d6fd6'};

// One recurring flat-vector character. Change `look` to restyle. Mood changes arms, eyes and mouth.
export const Character: React.FC<{mood: Mood; look?: Look; talking?: boolean; localFrame: number; flip?: boolean; size?: number}> = ({mood, look = defaultLook, talking = true, localFrame, flip, size = 560}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: localFrame, fps, config: {damping: 11, stiffness: 120}});
  const bob = Math.sin(frame / 9) * 8;
  const blink = frame % 90 > 85 ? 0.1 : 1;
  const w = Math.sin(frame / 4);
  let la = 8, ra = -8, rot = 0, eyeR = 14, mouth = 'smile';
  if (mood === 'happy') { ra = -160 + w * 14; la = 10; }
  if (mood === 'shock') { la = 150 + w * 6; ra = -150 - w * 6; eyeR = 20; mouth = 'o'; }
  if (mood === 'think') { ra = 150; la = 10; mouth = 'flat'; }
  if (mood === 'fall') { la = 125 + w * 10; ra = -125 - w * 10; rot = Math.sin(frame / 7) * 10; eyeR = 20; mouth = 'o'; }
  if (mood === 'sad') { la = 5; ra = -5; mouth = 'sad'; }
  const open = talking && mouth === 'smile' ? 4 + 16 * Math.abs(Math.sin(frame / 3)) : 0;
  const mouthEl =
    mouth === 'o' ? <ellipse cx="200" cy="215" rx="16" ry="22" fill="#7a2230" /> :
    mouth === 'flat' ? <rect x="182" y="212" width="36" height="6" rx="3" fill="#7a2230" /> :
    mouth === 'sad' ? <path d="M178 224 Q200 202 222 224" stroke="#7a2230" strokeWidth="7" fill="none" strokeLinecap="round" /> :
    open > 6 ? <ellipse cx="200" cy="212" rx="22" ry={open} fill="#7a2230" /> :
    <path d="M176 208 Q200 232 224 208" stroke="#7a2230" strokeWidth="7" fill="none" strokeLinecap="round" />;
  const arm = (x: number, a: number) => (
    <g transform={`translate(${x} 305) rotate(${a})`}>
      <rect x="-18" y="-6" width="36" height="150" rx="18" fill={look.outfit} />
      <circle cx="0" cy="148" r="22" fill={look.skin} />
    </g>
  );
  return (
    <div style={{width: size, height: size * 1.6, transform: `translateY(${bob}px) scale(${(0.6 + 0.4 * enter) * (flip ? -1 : 1)}, ${0.6 + 0.4 * enter}) rotate(${rot}deg)`, opacity: Math.min(1, enter * 2), filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.35))'}}>
      <svg viewBox="0 0 400 640" width="100%" height="100%">
        <ellipse cx="200" cy="165" rx="108" ry="125" fill={look.hair} />
        <rect x="150" y="470" width="46" height="130" rx="20" fill={look.pants} />
        <rect x="204" y="470" width="46" height="130" rx="20" fill={look.pants} />
        <ellipse cx="170" cy="605" rx="40" ry="18" fill="#1a1a2e" />
        <ellipse cx="230" cy="605" rx="40" ry="18" fill="#1a1a2e" />
        {arm(138, la)}
        <rect x="128" y="270" width="144" height="215" rx="62" fill={look.outfit} />
        <rect x="158" y="262" width="84" height="26" rx="13" fill={look.scarf} />
        {arm(262, ra)}
        <circle cx="200" cy="170" r="86" fill={look.skin} />
        <circle cx="150" cy="198" r="14" fill="#ff9ea0" opacity="0.55" />
        <circle cx="250" cy="198" r="14" fill="#ff9ea0" opacity="0.55" />
        <ellipse cx="168" cy="165" rx="12" ry={eyeR * blink} fill="#fff" /><circle cx="168" cy="166" r={6 * blink + 1} fill="#222" />
        <ellipse cx="232" cy="165" rx="12" ry={eyeR * blink} fill="#fff" /><circle cx="232" cy="166" r={6 * blink + 1} fill="#222" />
        <path d="M148 140 Q168 128 188 140" stroke="#6b4a1e" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M212 140 Q232 128 252 140" stroke="#6b4a1e" strokeWidth="6" fill="none" strokeLinecap="round" />
        {mouthEl}
        <path d="M112 160 Q120 70 200 68 Q282 70 290 160 Q250 105 200 112 Q150 105 112 160Z" fill={look.hair} />
        {look.hat ? (<g><rect x="140" y="48" width="120" height="34" rx="12" fill={look.hat} /><rect x="160" y="30" width="80" height="26" rx="10" fill={look.hat} /></g>) : null}
      </svg>
    </div>
  );
};
