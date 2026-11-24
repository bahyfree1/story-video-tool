"""Build timeline.json from script.txt + voice.mp3 using Whisper (free, local) for timing only.
The on-screen text always comes from YOUR script, not from Whisper's guess."""
import sys, json, os, re
proj, style = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "documentary")
lang = sys.argv[3] if len(sys.argv) > 3 else "ar"
base = f"public/projects/{proj}"
audio = f"{base}/voice.mp3"
lines = []
aspect = os.environ.get("ASPECT", "9:16")
spec_path = f"{base}/spec.json"
raw_lines = []
if os.path.exists(spec_path):
    # spec.json: {"style": "...", "lang": "ar", "aspect": "9:16", "musicVolume": 0.25, "lines": [{"text": "…*key*…", "scene": "map", "char": "happy", "tr": "slide"}]}
    spec = json.load(open(spec_path, encoding="utf-8"))
    style = spec.get("style", style); lang = spec.get("lang", lang); aspect = spec.get("aspect", aspect)
    for it in spec["lines"]:
        extra = "".join(f" | {k}={v}" for k, v in it.items() if k != "text")
        raw_lines.append(it["text"] + extra)
else:
    raw_lines = open(f"{base}/script.txt", encoding="utf-8").read().splitlines()
for raw in raw_lines:
    raw = raw.strip()
    if not raw or raw.startswith("#"):
        continue
    parts = [p.strip() for p in raw.split("|")]
    text, dirs = parts[0], {}
    for p in parts[1:]:
        if "=" in p:
            k, v = p.split("=", 1); dirs[k.strip()] = v.strip()
    words = []
    for tok in text.split():
        hl = tok.startswith("*") or tok.endswith("*")
        words.append({"text": tok.replace("*",""), "highlight": hl})
    if not words and not dirs:
        continue
    lines.append({"words": words, "directives": dirs})
flat = [(li, wi) for li, l in enumerate(lines) for wi in range(len(l["words"]))]
has_voice = os.path.exists(audio)
if has_voice:
    from faster_whisper import WhisperModel
    m = WhisperModel("small", device="cpu", compute_type="int8")
    segs, info = m.transcribe(audio, word_timestamps=True, language=lang or None)
    ww = [w for s in segs for w in (s.words or [])]
    total = ww[-1].end if ww else 1.0
    n, M = len(ww), len(flat)
    for k, (li, wi) in enumerate(flat):
        a = ww[min(n - 1, int(k * n / M))]
        b = ww[min(n - 1, max(int(k * n / M), int((k + 1) * n / M) - 1))]
        lines[li]["words"][wi]["start"], lines[li]["words"][wi]["end"] = a.start, b.end
    import subprocess
    dur = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",audio]).decode())
else:
    t = 0.0
    for li, wi in flat:
        lines[li]["words"][wi]["start"], lines[li]["words"][wi]["end"] = t, t + 0.4; t += 0.4
    dur = t + 1
for i, l in enumerate(lines):
    if l["words"]:
        l["start"] = l["words"][0]["start"] if i else 0.0
        l["end"] = l["words"][-1]["end"]
    else:
        l["start"] = lines[i-1]["end"] if i else 0.0; l["end"] = l["start"] + 2
for i in range(len(lines) - 1):
    lines[i]["end"] = lines[i + 1]["start"]
out = {"project": proj, "style": style, "fps": 30, "duration": dur + 0.3, "hasVoice": has_voice, "hasMusic": os.path.exists(f"{base}/music.mp3"), "aspect": aspect, "lines": lines}
json.dump(out, open(f"{base}/timeline.json", "w"), ensure_ascii=False, indent=1)
print("timeline:", len(lines), "lines,", round(dur, 1), "s")
