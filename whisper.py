import sys, json
from faster_whisper import WhisperModel
audio, out = sys.argv[1], sys.argv[2]
lang = sys.argv[3] if len(sys.argv)>3 else None
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, info = m.transcribe(audio, word_timestamps=True, language=lang)
res=[]
for s in segs:
    res.append({"start":s.start,"end":s.end,"text":s.text.strip(),"words":[{"w":w.word.strip(),"start":w.start,"end":w.end} for w in (s.words or [])]})
json.dump({"language":info.language,"segments":res}, open(out,"w"), ensure_ascii=False, indent=1)
print(info.language, len(res), "segments")
