# Story Video Tool (Remotion, free, open source)

You give it: a script, a voice-over, and images. It builds a vertical (9:16) video.
Whisper (free, runs locally) is used only to time the captions to your voice.

## Folder per video
public/projects/<name>/
  script.txt   one sentence per line
  voice.mp3    your voice-over
  images/      your images

## script.txt format
text with *highlighted* words | directive=value | directive=value
Directives:
  photo=file.jpg        image card with slow zoom (file in images/)
  counter=10160:0:متر   number that counts from:to:unit
  bars=إيفرست:8849|الطيارة:10160   comparison bars
  scene=plane|mountain|heart|subscribe   built-in cartoon scenes
  bg=night|sky|sunset|rays|dark          background (otherwise cycles)

## Make a video
pip install faster-whisper
npm install
node scripts/make.mjs <name> [style] [lang]     # e.g. node scripts/make.mjs sample documentary ar
Output: out/<name>.mp4

## Add a style
Copy src/styles/documentary.ts, change colors/caption/speed, register it in src/styles/index.ts.
Styles: documentary (reference look), kidsBright (placeholder for kids ages).

## Add a scene or plugin
Add a component in src/components/Visuals.tsx and one line in src/Video.tsx.
