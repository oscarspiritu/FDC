#!/usr/bin/env python3
"""
Monta una lección de un curso para el render de Remotion.

Entrada (por lección <id>, dentro de cursos/<curso>/):
  lessons/<id>.json                 definición: meta, voz y escenas (texto + visual)
  audio/<id>/01.mp3, 02.mp3 ...     una voz por escena (la genera la Mac con voz_mac.py)
  audio/<id>/01.words.json ...      palabras con tiempos de Whisper: {"words":[{"w":"hola","s":0.0,"e":0.4}]}
Salida:
  public/<id>/NN.mp3                audios copiados
  public/<id>/<id>.srt              subtítulos
  src/lessons/data/<id>.json        spec + timeline + palabras + subtítulos (lo importa src/lessons/index.ts)
Uso: scripts/montar_leccion.py <curso> <id> [<id> ...]   |   scripts/montar_leccion.py <curso> --indice
"""
import json, os, re, shutil, subprocess, sys, unicodedata

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INTRO, OUTRO = 3.6, 4.5
LEAD, TAIL, MIN_ESCENA = 0.6, 0.7, 3.8
NUM = {"uno": "1", "dos": "2", "tres": "3", "cuatro": "4", "cinco": "5", "seis": "6", "siete": "7", "ocho": "8", "nueve": "9", "diez": "10", "once": "11", "doce": "12"}

def norm(t):
    return re.sub(r"[^\w]", "", unicodedata.normalize("NFD", t.lower()).encode("ascii", "ignore").decode())

def dur(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return float(out.strip())

def eq(a, b):
    return a == b or NUM.get(a) == b or NUM.get(b) == a

def arregla_cues(o, words, dur_voz, avisos, idesc):
    """Cue que no aparece en las palabras de Whisper -> segundos proporcionales (cueFrac)."""
    ws = [norm(w["w"]) for w in words]
    if isinstance(o, dict):
        if isinstance(o.get("at"), str):
            cue = o["at"]; m = re.match(r"^(.*)@(\d+)$", cue); occ = int(m.group(2)) if m else 1; cue = m.group(1) if m else cue
            t = [norm(x) for x in cue.split() if norm(x)]
            hits = [i for i in range(len(ws) - len(t) + 1) if all(eq(ws[i + k], t[k]) for k in range(len(t)))]
            if len(hits) < occ:
                o["at"] = round(float(o.get("cueFrac", 0.3)) * dur_voz, 2)
                avisos.append(f"{idesc}: cue «{cue}» no hallado; uso {o['at']} s")
        o.pop("cueFrac", None)
        for v in o.values(): arregla_cues(v, words, dur_voz, avisos, idesc)
    elif isinstance(o, list):
        for v in o: arregla_cues(v, words, dur_voz, avisos, idesc)

def caps_de(palabras_abs, maxw=8):
    caps, cur = [], []
    def cierra():
        if cur: caps.append({"text": " ".join(w["w"] for w in cur), "s": cur[0]["s"], "e": cur[-1]["e"] + 0.15})
    for w in palabras_abs:
        cur.append(w)
        if len(cur) >= maxw or re.search(r"[.!?:;]$", w["w"]): cierra(); cur = []
    cierra()
    for i in range(len(caps) - 1):
        caps[i]["e"] = min(caps[i]["e"], caps[i + 1]["s"])
    return caps

def ts(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}"

def monta(curso, lid):
    base = os.path.join(RAIZ, "cursos", curso)
    les = json.load(open(f"{base}/lessons/{lid}.json", encoding="utf-8"))
    scenes = les["scenes"]; avisos = []
    t = INTRO; tl_scenes, vo, words, caps_words = [], [], {}, []
    spec_scenes = []
    pub = f"{base}/public/{lid}"; os.makedirs(pub, exist_ok=True)
    for i, sc in enumerate(scenes):
        n = f"{i + 1:02d}"
        mp3 = f"{base}/audio/{lid}/{n}.mp3"; wj = f"{base}/audio/{lid}/{n}.words.json"
        d = dur(mp3); w = json.load(open(wj, encoding="utf-8"))["words"]
        shutil.copy(mp3, f"{pub}/{n}.mp3")
        largo = max(MIN_ESCENA, LEAD + d + TAIL)
        tl_scenes.append([round(t, 3), round(t + largo, 3)])
        vo.append({"file": f"{lid}/{n}.mp3", "start": round(t + LEAD, 3), "dur": round(d, 3)})
        words[f"{n}.mp3"] = {"words": w}
        caps_words += [{"w": x["w"], "s": round(t + LEAD + x["s"], 3), "e": round(t + LEAD + x["e"], 3)} for x in w]
        v = json.loads(json.dumps(sc["visual"]))
        arregla_cues(v, w, d, avisos, f"{lid} escena {n}")
        spec_scenes.append(v)
        t += largo
    outro = [round(t, 3), round(t + OUTRO, 3)]
    tl = {"intro": [0, INTRO], "scenes": tl_scenes, "vo": vo, "outro": outro, "total": outro[1]}
    caps = caps_de(caps_words)
    os.makedirs(f"{base}/src/lessons/data", exist_ok=True)
    json.dump({"spec": {"meta": les["meta"], "scenes": spec_scenes}, "tl": tl, "words": words, "caps": caps},
              open(f"{base}/src/lessons/data/{lid}.json", "w", encoding="utf-8"), ensure_ascii=False)
    with open(f"{pub}/{lid}.srt", "w", encoding="utf-8") as f:
        for k, c in enumerate(caps, 1):
            f.write(f"{k}\n{ts(c['s'])} --> {ts(c['e'])}\n{c['text']}\n\n")
    return avisos, tl["total"]

def indice(curso):
    base = os.path.join(RAIZ, "cursos", curso)
    ids = sorted(f[:-5] for f in os.listdir(f"{base}/src/lessons/data") if f.endswith(".json"))
    L = ['// Generado por scripts/montar_leccion.py; no editar a mano.',
         'import { LessonSpec, Timeline, Words } from "../kit";', 'import { Cap } from "../course";']
    for i, lid in enumerate(ids): L.append(f'import d{i} from "./data/{lid}.json";')
    L.append('type Item = { id: string; spec: LessonSpec; tl: Timeline; words: Words; caps: Cap[] };')
    L.append('const mk = (id: string, d: any): Item => ({ id, spec: d.spec, tl: d.tl, words: d.words, caps: d.caps });')
    L.append('export const LESSONS: Item[] = [')
    for i, lid in enumerate(ids): L.append(f'  mk("{lid}", d{i}),')
    L.append('];')
    open(f"{base}/src/lessons/index.ts", "w", encoding="utf-8").write("\n".join(L) + "\n")
    return ids

if __name__ == "__main__":
    curso = sys.argv[1]; args = sys.argv[2:]
    if args == ["--indice"]:
        print(len(indice(curso)), "lecciones en el índice"); sys.exit(0)
    for lid in args:
        av, total = monta(curso, lid)
        print(f"{lid}: {total:.1f} s", *av, sep="\n  " if av else "")
    print(len(indice(curso)), "lecciones en el índice")
