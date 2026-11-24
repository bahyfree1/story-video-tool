import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import type {Timeline} from './types';
import {styles} from './styles';
import {Background} from './components/Background';
import {Caption} from './components/Caption';
import {PhotoCard, Counter, Bars, Scene, Subscribe} from './components/Visuals';
import {Character, Mood} from './components/Character';
import {FallScene, PlaneScene, MountainScene, MapScene, ScaleScene, BalanceScene, CandleScene, StampScene, Sparkles} from './components/Scenes';
import {interpolate} from 'remotion';

export const Video: React.FC<Timeline> = (tl) => {
  const {fps} = useVideoConfig();
  const style = styles[tl.style] ?? styles.documentary;
  const bgNames = style.defaultBg;
  let defaultIdx = 0;
  const lines = tl.lines.map((l, i) => {
    const bg = l.directives.bg ?? bgNames[defaultIdx++ % bgNames.length];
    return {l, bg};
  });
  return (
    <AbsoluteFill style={{fontFamily: style.fontFamily}}>
      {tl.hasVoice ? <Audio src={staticFile(`projects/${tl.project}/voice.mp3`)} /> : null}
      {lines.map(({l, bg}, i) => {
        const from = Math.round(l.start * fps);
        const end = i + 1 < lines.length ? Math.round(lines[i + 1].l.start * fps) : Math.round(tl.duration * fps);
        const dur = Math.max(1, end - from);
        const prevBg = i > 0 ? lines[i - 1].bg : bg;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <LineScene line={l} bg={bg} prevBg={prevBg} dur={dur} style={style} project={tl.project} idx={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

import {useCurrentFrame} from 'remotion';
const LineScene: React.FC<{line: Timeline['lines'][number]; bg: string; prevBg: string; dur: number; style: ReturnType<typeof Object>; project: string; idx: number}> = ({line, bg, prevBg, dur, style, project, idx}) => {
  const f = useCurrentFrame();
  const d = line.directives;
  const st = style as any;
  let visual: React.ReactNode = <PlaneScene f={f} dur={dur} />;
  let defaultChar: Mood | 'none' = 'talk';
  if (d.photo) { visual = <PhotoCard src={`projects/${project}/images/${d.photo}`} localFrame={f} dur={dur} style={st} tilt={idx % 2 ? 3 : -3} />; defaultChar = 'none'; }
  else if (d.counter) { visual = <Counter spec={d.counter} localFrame={f} dur={dur} style={st} />; defaultChar = 'none'; }
  else if (d.bars) { visual = <Bars spec={d.bars} localFrame={f} style={st} />; defaultChar = 'none'; }
  else if (d.scale) { visual = <ScaleScene spec={d.scale} f={f} dur={dur} style={st} />; defaultChar = 'none'; }
  else if (d.balance) { visual = <BalanceScene spec={d.balance} f={f} />; defaultChar = 'none'; }
  else if (d.stamp) { visual = <StampScene text={d.stamp} f={f} />; defaultChar = 'none'; }
  else if (d.scene === 'subscribe') { visual = <Subscribe localFrame={f} style={st} />; defaultChar = 'happy'; }
  else if (d.scene === 'fall') { visual = <FallScene f={f} style={st} />; defaultChar = 'none'; }
  else if (d.scene === 'map') { visual = <MapScene f={f} dur={dur} style={st} />; }
  else if (d.scene === 'mountain') { visual = <MountainScene f={f} />; }
  else if (d.scene === 'candle') { visual = <CandleScene f={f} />; defaultChar = 'sad'; }
  else if (d.scene === 'plane') { visual = <PlaneScene f={f} dur={dur} />; }
  else if (d.scene) { visual = <Scene name={d.scene} localFrame={f} />; }
  const ch = (d.char ?? defaultChar) as Mood | 'none';
  // slow camera drift plus a circle-wipe reveal at the start of each scene
  const zoom = interpolate(f, [0, dur], [1, 1.06], {extrapolateRight: 'clamp'});
  const wipe = interpolate(f, [0, 12], [0, 150], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{clipPath: `circle(${wipe}% at 50% 55%)`}}>
      <Background style={st} bg={bg} prevBg={prevBg} localFrame={f} />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Sparkles f={f} color={st.accent} />
        {visual}
        {ch !== 'none' ? (
          <div style={{position: 'absolute', bottom: 520, [idx % 2 ? 'right' : 'left']: -10}}>
            <Character mood={ch} localFrame={f} flip={idx % 2 === 1} size={d.scene === 'fall' ? 400 : 520} />
          </div>
        ) : null}
      </AbsoluteFill>
      <Caption line={line} style={st} localFrame={f} />
    </AbsoluteFill>
  );
};
