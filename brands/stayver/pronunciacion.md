# Glosario de pronunciación — STAYVER (voz H3, Qwen3 clon)

El guion usa la ortografía normal. Al texto que va al TTS se le aplica esta tabla (en `projects/curso-pnaa/scripts/tts_batch.py`).
Cada toma se revisa con Whisper (`small`, `es`).

| Término (guion) | Texto para el TTS | Estado | Notas |
|---|---|---|---|
| PNAA | pe, ene, a, a | ✅ validado (2026-10-08, piloto) | Whisper lo transcribe "PNAA" |
| PROFEPA | Profepa | ✅ validado (piloto) | En mayúsculas el TTS podría deletrearlo |
| NMX-AA-162 / 163 | ene, eme, equis, a a, ciento sesenta y dos / tres | pendiente | |
| SCFI | ese, ce, efe, i | pendiente | |
| NDA1 / NDA2 | ene, de, a, uno / dos | pendiente | |
| ASEA | Asea | pendiente | |
| EMA | Ema | pendiente | |
| SAAEL | sa, el | pendiente | Confirmar con el usuario |
| CONAGUA | Conagua | pendiente | |
| SCIAN | sián | pendiente | |
| RFC | erre, efe, ce | pendiente | |
| NOM-085-SEMARNAT | norma oficial ochenta y cinco de Semarnat | pendiente | |
| PROFEPA-02-001 | Profepa cero dos cero cero uno | pendiente | |
| Años (1992, 2026…) | mil novecientos noventa y dos, dos mil veintiséis | ✅ validado (piloto) | Se escriben con letra. ⚠️ "dos mil trece" salió como "dos mil tres" en una toma: revisar cada año con Whisper y regenerar si falla |
| 38 Bis | treinta y ocho bis | pendiente | |
| 17020 | diecisiete cero veinte | pendiente | |
| STAYVER | Stéiver | ✅ regla de la metodología | Se menciona 2 o 3 veces por video |
| STPS | ese, te, pe, ese | pendiente (curso de grúas, 2026-10-12) | |
| NOM 006 / 009 / 017 / 004 / 031 | nom cero cero seis / cero cero nueve / cero diecisiete / cero cero cuatro / cero treinta y uno | pendiente (curso de grúas) | En el guion se escribe "la NOM 006 de la STPS" |
| ASME B treinta | asme be treinta | pendiente (curso de grúas) | |
| nueve once (911) | nueve once | pendiente (curso de grúas) | Ya va con letra en el guion |

## Reglas de QC

- Si Whisper transcribe raro una palabra dentro de la escena completa, recorta el fragmento y vuelve a transcribirlo solo antes de regenerar. En el piloto, "anticlientes" en realidad decía "ante clientes".
- Cada toma nueva sale distinta (no es determinista), así que conviene generar 2 alternativas de la escena dudosa.
