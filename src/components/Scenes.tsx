import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Style} from '../styles';
import {Character, Mood} from './Character';

const Area: React.FC<{children: React.ReactNode; top?: number; height?: number}> = ({children, top = 200, height = 1000}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, height, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible'}}>{children}</div>
);

// Cloud layers that move at different speeds (parallax). dir=1 moves up (falling feel), dir=0 sideways.
export const CloudLayers: React.FC<{up?: boolean; f: number}> = ({up, f}) => (
  <>
    {Array.from({length: 9}).map((_, i) => {
      const sp = 3 + (i % 3) * 3;
      const sz = 160 + (i % 4) * 70;
      const x = (i * 211) % 1000;
      const y = up ? 2200 - ((f * sp + i * 330) % 2600) : 200 + (i * 170) % 900;
      const xx = up ? x : ((x + f * (sp / 3)) % 1400) - 200;
      return <div key={i} style={{position: 'absolute', left: xx, top: y, width: sz, height: sz * 0.42, borderRadius: sz, background: 'rgba(255,255,255,0.7)', boxShadow: `${sz * 0.25}px -${sz * 0.12}px 0 rgba(255,255,255,0.7)`}} />;
    })}
  </>
);

export const FallScene: React.FC<{f: number; style: Style}> = ({f}) => (
  <>
    <CloudLayers up f={f} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{position: 'absolute', left: 140 + i * 160, top: ((f * 40 + i * 300) % 1500) + 100, width: 6, height: 140, background: 'rgba(255,255,255,0.5)', borderRadius: 4}} />
    ))}
    <Area><Character mood="fall" localFrame={f} size={440} talking={false} /></Area>
  </>
);

export const PlaneScene: React.FC<{f: number; dur: number}> = ({f, dur}) => {
  const x = interpolate(f, [0, dur], [-260, 260], {extrapolateRight: 'clamp'});
  const bob = Math.sin(f / 10) * 18;
  return (
    <>
      <CloudLayers f={f} />
      <Area>
        <svg width="1000" height="520" viewBox="0 0 900 500" style={{transform: `translate(${x}px, ${bob}px) rotate(-4deg)`}}>
          <ellipse cx="450" cy="250" rx="340" ry="64" fill="#f4f6fa" />
          <rect x="130" y="236" width="640" height="14" fill="#e84855" />
          <polygon points="620,250 770,140 815,140 735,250" fill="#d8dde8" />
          <polygon points="400,262 240,430 330,430 530,264" fill="#c9d0de" />
          <polygon points="400,238 250,80 340,80 530,236" fill="#dfe4ee" />
          {[170, 230, 290, 350, 410, 470].map((cx) => <circle key={cx} cx={cx + 150} cy="226" r="14" fill="#5ab0ff" />)}
          <ellipse cx="750" cy="236" rx="42" ry="28" fill="#5ab0ff" opacity="0.85" />
        </svg>
      </Area>
    </>
  );
};

export const MountainScene: React.FC<{f: number}> = ({f}) => {
  const d = (k: number) => Math.sin(f / 60) * k;
  return (
    <Area top={150} height={1100}>
      <svg width="1080" height="1000" viewBox="0 0 1080 1000">
        <circle cx="850" cy="170" r="90" fill="#ffe27a" opacity="0.95" />
        <g transform={`translate(${d(12)} 0)`}>
          <polygon points="-50,1000 300,420 650,1000" fill="#7f8fb8" />
        </g>
        <g transform={`translate(${-d(16)} 0)`}>
          <polygon points="200,1000 620,200 1100,1000" fill="#5a6a98" />
          <polygon points="620,200 700,350 620,330 560,370" fill="#fff" />
        </g>
        <polygon points="-100,1000 400,640 900,1000" fill="#3f4d7a" />
        <g opacity="0.9"><line x1="620" y1="200" x2="620" y2="120" stroke="#fff" strokeWidth="6" /><polygon points="620,120 700,145 620,170" fill="#e84855" /></g>
      </svg>
    </Area>
  );
};

export const MapScene: React.FC<{f: number; dur: number; style: Style}> = ({f, dur, style}) => {
  const p = interpolate(f, [8, Math.max(20, dur - 10)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const path = 'M170 780 C 300 500, 500 700, 620 460 S 850 300, 900 220';
  const {fps} = useVideoConfig();
  const pin = spring({frame: f - 14, fps, config: {damping: 8}});
  return (
    <Area top={170} height={1000}>
      <svg width="1000" height="950" viewBox="0 0 1000 950">
        <rect x="20" y="40" width="960" height="860" rx="50" fill="#f3ead2" stroke="#fff" strokeWidth="10" />
        <path d="M80 200 Q200 120 330 190 T520 150 Q640 260 560 380 Q440 420 330 360 Q180 330 80 200Z" fill="#9fd48b" />
        <path d="M560 560 Q700 500 850 580 Q920 700 800 800 Q640 840 560 700Z" fill="#9fd48b" />
        <path d="M120 600 Q220 560 300 640 Q320 760 200 780 Q100 720 120 600Z" fill="#9fd48b" />
        <path d={path} stroke="#e84855" strokeWidth="10" strokeDasharray="26 18" fill="none" pathLength={1} style={{strokeDasharray: '0.03 0.02', strokeDashoffset: 1 - p}} />
        <circle cx="170" cy="780" r="22" fill="#2d6fd6" />
        <g transform={`translate(900 220) scale(${pin})`}><path d="M0 0 C-50 -70 -50 -120 0 -120 C50 -120 50 -70 0 0Z" fill="#e84855" /><circle cx="0" cy="-85" r="16" fill="#fff" /></g>
      </svg>
    </Area>
  );
};

// Vertical scale with a marker moving between two values. spec: "from:to:unit"
export const ScaleScene: React.FC<{spec: string; f: number; dur: number; style: Style}> = ({spec, f, dur, style}) => {
  const [from, to, unit = ''] = spec.split(':');
  const max = Math.max(Number(from), Number(to), 1);
  const v = interpolate(f, [6, Math.max(12, dur - 8)], [Number(from), Number(to)], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = 880 - (v / max) * 800;
  return (
    <Area top={170} height={1000}>
      <svg width="900" height="960" viewBox="0 0 900 960">
        <rect x="380" y="60" width="26" height="840" rx="13" fill="rgba(255,255,255,0.8)" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <g key={i}><line x1="340" x2="450" y1={880 - i * 80} y2={880 - i * 80} stroke="#fff" strokeWidth="5" /><text x="320" y={890 - i * 80} fill="#fff" fontSize="38" textAnchor="end" fontFamily="sans-serif">{Math.round((max / 10) * i).toLocaleString('en-US')}</text></g>
        ))}
        <g transform={`translate(393 ${y})`}>
          <circle r="34" fill={style.accent} stroke="#fff" strokeWidth="8" />
          <rect x="60" y="-40" width="330" height="80" rx="40" fill={style.accent} />
          <text x="225" y="18" fill="#111" fontSize="52" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">{Math.round(v).toLocaleString('en-US')} {unit}</text>
        </g>
      </svg>
    </Area>
  );
};

// Balance scale: spec "left:right" tilts to the heavier side (second wins if it starts with !)
export const BalanceScene: React.FC<{spec: string; f: number}> = ({spec, f}) => {
  const [l, r] = spec.split(':');
  const tilt = interpolate(f, [4, 40], [0, -10], {extrapolateRight: 'clamp'}) + Math.sin(f / 8) * 1.2;
  return (
    <Area top={200} height={950}>
      <svg width="1000" height="900" viewBox="0 0 1000 900">
        <rect x="480" y="260" width="40" height="540" rx="12" fill="#fff" />
        <rect x="360" y="780" width="280" height="40" rx="18" fill="#fff" />
        <g transform={`rotate(${tilt} 500 260)`}>
          <rect x="130" y="244" width="740" height="30" rx="15" fill="#ffd93b" />
          <g transform={`rotate(${-tilt} 160 274)`}><line x1="160" y1="274" x2="160" y2="450" stroke="#fff" strokeWidth="6" /><path d="M40 450 H280 Q260 560 160 560 Q60 560 40 450Z" fill="#e84855" /><text x="160" y="520" fill="#fff" fontSize="46" fontWeight="800" textAnchor="middle" fontFamily="StoryFont, sans-serif">{l}</text></g>
          <g transform={`rotate(${-tilt} 840 274)`}><line x1="840" y1="274" x2="840" y2="450" stroke="#fff" strokeWidth="6" /><path d="M720 450 H960 Q940 560 840 560 Q740 560 720 450Z" fill="#2d6fd6" /><text x="840" y="520" fill="#fff" fontSize="46" fontWeight="800" textAnchor="middle" fontFamily="StoryFont, sans-serif">{r}</text></g>
        </g>
      </svg>
    </Area>
  );
};

export const CandleScene: React.FC<{f: number}> = ({f}) => {
  const fl = 1 + Math.sin(f / 3) * 0.08 + Math.sin(f / 1.7) * 0.04;
  return (
    <Area>
      <svg width="500" height="800" viewBox="0 0 500 800">
        <circle cx="250" cy="260" r="200" fill="rgba(255,200,80,0.18)" />
        <rect x="190" y="360" width="120" height="360" rx="14" fill="#f8f1e0" />
        <rect x="246" y="330" width="8" height="40" fill="#333" />
        <g transform={`translate(250 330) scale(${fl} ${fl * 1.1}) translate(-250 -330)`}><path d="M250 190 C 205 260 215 330 250 330 C 285 330 295 260 250 190Z" fill="#ffb02e" /><path d="M250 250 C 232 290 238 325 250 325 C 262 325 268 290 250 250Z" fill="#fff3a0" /></g>
      </svg>
    </Area>
  );
};

export const StampScene: React.FC<{text: string; f: number}> = ({text, f}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 7, stiffness: 160}});
  return (
    <Area>
      <div style={{transform: `rotate(-10deg) scale(${3 - 2 * s})`, opacity: Math.min(1, s * 2), border: '16px solid #e84855', color: '#e84855', fontSize: 170, fontWeight: 900, padding: '10px 50px', borderRadius: 24, background: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif', letterSpacing: 6}}>{text}</div>
    </Area>
  );
};

export const Sparkles: React.FC<{f: number; color: string}> = ({f, color}) => (
  <>
    {Array.from({length: 14}).map((_, i) => {
      const t = (f * (1 + (i % 3) * 0.5) + i * 17) % 90;
      const x = (i * 173) % 1040 + 20;
      const y = 1250 - t * 12 - (i % 4) * 40;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 16 + (i % 3) * 8, height: 16 + (i % 3) * 8, background: color, opacity: Math.max(0, 0.7 - t / 130), transform: `rotate(${f * 3 + i * 40}deg)`, borderRadius: 4}} />;
    })}
  </>
);
