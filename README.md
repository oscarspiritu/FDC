# FDC · Fábrica de Cursos

Repositorio privado para **renderizar los videos de los cursos con GitHub Actions** (Remotion), sin usar la Mac de Selene ni el VPS.

## Estructura
- `kit/` proyecto Remotion base (kit SAR de curso-iso9001, Remotion 4.0.529), con logos, música y presentador.
- `brands/` perfiles de marca: SAR Solutions, SAR mujer, STAYVER, CAPES.
- `cursos/<curso>/` una carpeta por curso: `guiones/`, `public/<M01-L01>/` (voz, timeline, captions) y `src/lessons/` (escenas).
- `scripts/render_leccion.sh` renderiza una lección y normaliza el audio (loudnorm −16 LUFS).
- `.github/workflows/render.yml` workflow «Renderizar curso».

## Cómo se usa
Pestaña **Actions → Renderizar curso → Run workflow**: se elige el curso (ej. `nom-051`) y las lecciones (`M01-L01 M01-L02` o `todas`). Cada lección se renderiza en paralelo y el MP4 + .srt queda como descarga (2 días) en la página de la ejecución. Envío opcional a `/srv/fdc` con los secretos `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (ver Settings → Secrets and variables → Actions).

## Reglas
Sin secretos en el código (solo GitHub Secrets). Voces y clips pesados de `cursos/` van por Git LFS (`.gitattributes`). No se sube `node_modules` ni `out/`.
