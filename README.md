# Story Video Tool (Remotion, free, open source)

You give it: a script, a voice-over, and images. It builds a video (9:16, 16:9 or 1:1).
Whisper (free, runs locally) is used only to time the captions to your voice. The text on screen is always yours.

## Folder per video: public/projects/<name>/
  script.txt   one sentence per line (or spec.json, see below)
  voice.mp3    your voice-over
  images/      your images
  music.mp3    optional background music (ducks automatically while words are spoken)

## script.txt
text with *highlighted* words | directive=value | directive=value
  photo=file.jpg   image card with slow zoom         counter=10160:0:unit   ticking number
  bars=a:8849|b:10160   comparison bars              scale=10160:0:unit     vertical scale with moving marker
  balance=left:right    tilting balance scale        stamp=TEXT             stamp slams in
  scene=fall|plane|map|mountain|candle|heart|subscribe
  char=talk|happy|shock|think|fall|sad|none          the recurring cartoon character
  look=stewardess|boy|girl|cat|scientist   change the character (or set "look" in a style)
  bg=<background name from the style>                tr=wipe|slide|zoom|fade   scene transition

## spec.json (alternative, easy for scripts/AI to write)
{"style":"kids6to8","lang":"ar","aspect":"9:16","lines":[{"text":"hello *world*","scene":"plane","char":"happy"}]}

## Make a video
pip install faster-whisper
npm install
node scripts/make.mjs <name> [style] [lang]     # output: out/<name>.mp4  (ASPECT=16:9 env or "aspect" in spec.json)
node scripts/preview.mjs <name> [style]         # quick contact sheet of 6 frames, no full render
Note: put NotoSansArabic-Bold.ttf (SIL OFL font) in public/fonts/ (it is not in this repo; the Drive zip has it). Whisper "small" downloads ~460MB on first run.

## Styles (src/styles)
documentary (reference look, pill captions), kidsBright, kids3to5, kids6to8, kids9to12 (outline captions, faster).
Caption modes: pill | karaoke | outline (karaokeDark = documentary + karaoke).
Images: lines with no visual directive automatically get the next unused image from images/ (sorted by file name) as a Ken Burns photo card. Set AUTOPHOTOS=0 to turn that off. Add your own: node scripts/new-style.mjs myStyle

## Add a scene
Add a component in src/components/Scenes.tsx and one branch in src/Video.tsx.

## Ideas studied (ideas only, no code copied)
short-video-maker (MIT): music mood, REST/MCP API idea. reelspec (MIT): JSON spec of what appears when, verification tooling.
remotion template-tiktok: word-level captions with Whisper. Remotion itself is free for individuals and small companies.
