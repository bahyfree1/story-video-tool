import React from 'react';
import {Composition, staticFile, continueRender, delayRender} from 'remotion';
import {Video} from './Video';
import type {Timeline} from './types';

const fontHandle = delayRender('font');
new FontFace('StoryFont', `url(${staticFile('fonts/NotoSansArabic-Bold.ttf')})`, {weight: '700'})
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(fontHandle);
  });

const empty: Timeline = {project: 'sample', style: 'documentary', fps: 30, duration: 5, hasVoice: false, lines: []};

export const Root: React.FC = () => (
  <Composition
    id="Story"
    component={Video}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={150}
    defaultProps={empty}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(30, Math.ceil(props.duration * props.fps)), fps: props.fps})}
  />
);
