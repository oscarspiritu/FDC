#!/bin/bash
# Renderiza UNA lección de un curso y normaliza el audio (loudnorm -16 LUFS), igual que render_batch_vps.sh.
# Uso: scripts/render_leccion.sh <slug-curso> <M01-L01> [salida-dir]
# Lo usa el workflow de GitHub Actions; también sirve en cualquier computadora con Node 20 y ffmpeg.
set -euo pipefail
CURSO="$1"; LID="$2"; OUT="${3:-out}"
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
TRAB="$RAIZ/.trabajo/$CURSO"
rm -rf "$TRAB"; mkdir -p "$TRAB" "$RAIZ/$OUT/$CURSO"
# Copia del kit + lo propio del curso encima (lecciones y public/ de cada lección)
cp -R "$RAIZ/kit/." "$TRAB/"
[ -d "$RAIZ/cursos/$CURSO/src" ]    && cp -R "$RAIZ/cursos/$CURSO/src/."    "$TRAB/src/"
[ -d "$RAIZ/cursos/$CURSO/public" ] && cp -R "$RAIZ/cursos/$CURSO/public/." "$TRAB/public/"
cd "$TRAB"
[ -d node_modules ] || npm ci --no-audit --no-fund
CRF="${CRF:-23}"
npx remotion render "$LID" "$RAIZ/$OUT/$CURSO/$LID.raw.mp4" --crf="$CRF" --jpeg-quality=75 --log=error
ffmpeg -v error -y -i "$RAIZ/$OUT/$CURSO/$LID.raw.mp4" -map 0:v -map 0:a -c:v copy \
  -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$RAIZ/$OUT/$CURSO/$LID.mp4"
rm -f "$RAIZ/$OUT/$CURSO/$LID.raw.mp4"
[ -f "public/$LID/$LID.srt" ] && cp "public/$LID/$LID.srt" "$RAIZ/$OUT/$CURSO/$LID.srt" || true
echo "listo: $OUT/$CURSO/$LID.mp4"
