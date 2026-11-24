import React from 'react';
import {Img, staticFile, interpolate, spring, useVideoConfig} from 'remotion';
import type {Style} from '../styles';

const Center: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 260}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, height: 920, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);

// Image as a taped "paper" card with slow Ken Burns zoom.
export const PhotoCard: React.FC<{src: string; localFrame: number; dur: number; style: Style; tilt: number}> = ({src, localFrame, dur, style, tilt}) => {
  const {fps} = useVideoConfig();
  const pop = spring({frame: localFrame, fps, config: {damping: 13}});
  const zoom = interpolate(localFrame, [0, dur], [1, 1.14], {extrapolateRight: 'clamp'});
  return (
    <Center>
      <div style={{transform: `rotate(${tilt * pop}deg) scale(${0.7 + 0.3 * pop})`, background: '#fffdf6', padding: 24, paddingBottom: 56, borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.45)', position: 'relative'}}>
        <div style={{position: 'absolute', top: -26, left: '50%', marginLeft: -90, width: 180, height: 50, background: 'rgba(255,225,120,0.85)', transform: 'rotate(-3deg)'}} />
        <div style={{width: 800, height: 760, overflow: 'hidden', borderRadius: 6}}>
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
        </div>
      </div>
    </Center>
  );
};

// Number that ticks from one value to another.
export const Counter: React.FC<{spec: string; localFrame: number; dur: number; style: Style}> = ({spec, localFrame, dur, style}) => {
  const [from, to, unit = ''] = spec.split(':');
  const v = interpolate(localFrame, [6, Math.max(12, dur - 8)], [Number(from), Number(to)], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Center>
      <div style={{textAlign: 'center', fontFamily: style.fontFamily, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,0.4)'}}>
        <div style={{fontSize: 230, fontWeight: 800, color: style.accent, direction: 'ltr'}}>{Math.round(v).toLocaleString('en-US')}</div>
        <div style={{fontSize: 90, fontWeight: 700}}>{unit}</div>
      </div>
    </Center>
  );
};

// Comparison bars: "label:value|label:value"
export const Bars: React.FC<{spec: string; localFrame: number; style: Style}> = ({spec, localFrame, style}) => {
  const items = spec.split('|').map((s) => {
    const [label, val] = s.split(':');
    return {label, val: Number(val)};
  });
  const max = Math.max(...items.map((i) => i.val));
  return (
    <Center>
      <div style={{display: 'flex', gap: 70, alignItems: 'flex-end', height: 700, fontFamily: style.fontFamily}}>
        {items.map((it, i) => {
          const h = interpolate(localFrame, [4 + i * 6, 30 + i * 6], [0, (it.val / max) * 600], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
              <div style={{color: '#fff', fontSize: 52, fontWeight: 700, direction: 'ltr'}}>{it.val.toLocaleString('en-US')}</div>
              <div style={{width: 230, height: h, borderRadius: 24, background: i % 2 ? style.accent : '#fff', boxShadow: '0 12px 30px rgba(0,0,0,0.35)'}} />
              <div style={{color: '#fff', fontSize: 54, fontWeight: 700}}>{it.label}</div>
            </div>
          );
        })}
      </div>
    </Center>
  );
};

// Built-in flat vector scenes (no image needed).
export const Scene: React.FC<{name: string; localFrame: number}> = ({name, localFrame}) => {
  const bob = Math.sin(localFrame / 10) * 18;
  if (name === 'mountain') {
    return (
      <Center>
        <svg width="900" height="760" viewBox="0 0 900 760">
          <polygon points="0,760 300,200 600,760" fill="#6e7fa8" />
          <polygon points="300,200 360,330 300,310 250,340" fill="#fff" />
          <polygon points="350,760 640,300 900,760" fill="#4d5c85" />
          <polygon points="640,300 690,400 640,385 600,410" fill="#fff" />
        </svg>
      </Center>
    );
  }
  if (name === 'heart') {
    const s = 1 + 0.08 * Math.sin(localFrame / 4);
    return (
      <Center>
        <svg width="620" height="620" viewBox="0 0 100 100" style={{transform: `scale(${s})`}}>
          <path d="M50 88 C10 56 6 28 26 20 C38 15 47 22 50 30 C53 22 62 15 74 20 C94 28 90 56 50 88Z" fill="#ff3b5c" />
        </svg>
      </Center>
    );
  }
  // default: plane
  const x = interpolate(localFrame, [0, 120], [-150, 150], {extrapolateRight: 'clamp'});
  return (
    <Center>
      <svg width="900" height="500" viewBox="0 0 900 500" style={{transform: `translate(${x}px, ${bob}px) rotate(-4deg)`}}>
        <ellipse cx="450" cy="250" rx="330" ry="62" fill="#f4f6fa" />
        <polygon points="620,250 760,150 800,150 730,250" fill="#d8dde8" />
        <polygon points="400,260 250,420 330,420 520,262" fill="#c9d0de" />
        <polygon points="400,240 260,90 340,90 520,238" fill="#dfe4ee" />
        {[170, 230, 290, 350, 410, 470].map((cx) => (
          <circle key={cx} cx={cx + 150} cy="238" r="14" fill="#5ab0ff" />
        ))}
        <ellipse cx="740" cy="240" rx="40" ry="28" fill="#5ab0ff" opacity="0.8" />
      </svg>
    </Center>
  );
};

export const Subscribe: React.FC<{localFrame: number; style: Style}> = ({localFrame, style}) => {
  const {fps} = useVideoConfig();
  const pop = spring({frame: localFrame, fps, config: {damping: 8}});
  return (
    <Center>
      <div style={{transform: `scale(${pop})`, background: '#e62117', color: '#fff', fontFamily: style.fontFamily, fontSize: 110, fontWeight: 800, padding: '40px 90px', borderRadius: 40, boxShadow: '0 16px 40px rgba(0,0,0,0.4)'}}>
        {'\u0627\u0634\u062a\u0631\u0643'}
      </div>
    </Center>
  );
};
