/**
 * Biblioteca de escenas del curso ISO 9001. Las lecciones se describen como datos (src/lessons/*.ts)
 * y aquí se dibujan con el estilo aprobado en el piloto M01-L01: ink/paper alternados, Bodoni + Inter,
 * íconos lucide en insignias, cortinillas cian.
 *
 * Tiempos: cada `at` de una escena es un "cue": una frase (string) que se busca en las palabras de
 * Whisper de esa escena, o un número = segundos desde que arranca la voz de la escena.
 * Se resuelven antes de dibujar (resolveLesson) y un cue que no se encuentra truena el render.
 */
import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import * as Icons from "lucide-react";
import { C, sans, serif, s } from "./theme";
import { Headline, InkBackdrop, Kicker, MaskLine, Reveal, Rule, IconBadge, usePop, useIn } from "./ui";
import { AvatarColumn, Cap, Captions, Cierre, Entrada, LessonMeta, LessonTag, Scene, Soundtrack, Stock, VO } from "./course";

/* ───────────────────────── tipos de spec ───────────────────────── */

export type Cue = string | number;
export type Tone = "ok" | "warn" | "blue" | "cyan" | "neutral";
export type Item = { at?: Cue; icon?: string; text: string; sub?: string; tone?: Tone };

type Base = { theme?: "dark" | "light"; stock?: string; kicker?: string; title?: string; titleAt?: Cue; body?: string; bodyAt?: Cue; icon?: string };

export type SceneSpec =
  | (Base & { type: "hero"; chips?: Item[]; big?: { text: string; at?: Cue }[] })
  | (Base & { type: "rows"; items: Item[]; layout?: "right" | "full"; cols?: 1 | 2 | 3; header?: string; headerAt?: Cue })
  | (Base & { type: "compare"; cards: { label: string; tone: Tone; at?: Cue; items: Item[] }[] })
  | (Base & { type: "steps"; items: Item[]; numbered?: boolean; vertical?: boolean; result?: Item })
  | (Base & { type: "cycle"; segs: Item[]; center?: string; centerAt?: Cue; notes?: Item[] })
  | (Base & { type: "table"; head: string[]; rows: { at?: Cue; cells: string[]; hi?: boolean }[]; widths?: number[] })
  | (Base & { type: "heatmap"; marks: { at?: Cue; p: number; i: number; label: string; tone?: Tone }[]; legend?: boolean; side?: Item[] })
  | (Base & { type: "doc"; label: string; text: string; marks?: { frag: string; at?: Cue; tone?: Tone }[]; side?: Item[] })
  | (Base & { type: "stats"; items: { at?: Cue; value: string; label: string; sub?: string }[] })
  | (Base & { type: "fishbone"; problem: string; problemAt?: Cue; causes: Item[] })
  | (Base & { type: "timeline"; items: Item[] })
  | (Base & { type: "bands"; bands: { at?: Cue; label: string; items: string[] }[]; inLabel?: string; outLabel?: string })
  | (Base & { type: "avatar"; video: string; items: Item[]; chips?: Item[] });

export type LessonSpec = { meta: LessonMeta; scenes: SceneSpec[] };
export type Words = Record<string, { words: { w: string; s: number; e: number }[] }>;
export type Timeline = { intro: [number, number]; scenes: [number, number][]; vo: VO[]; outro: [number, number]; total: number };

/* ───────────────────────── resolución de cues ───────────────────────── */

const NUM: Record<string, string> = { uno: "1", dos: "2", tres: "3", cuatro: "4", cinco: "5", seis: "6", siete: "7", ocho: "8", nueve: "9", diez: "10", once: "11", doce: "12", trece: "13", catorce: "14", quince: "15", dieciseis: "16", diecisiete: "17", dieciocho: "18", diecinueve: "19", veinte: "20", veintiuno: "21", veintidos: "22", veintitres: "23", veinticuatro: "24", veinticinco: "25" };
const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w]/g, "");

function findCue(words: { w: string; s: number }[], phrase: string, lid: string, n: number): number {
  let occ = 1;
  const m = phrase.match(/^(.*)@(\d+)$/);
  if (m) { phrase = m[1]; occ = parseInt(m[2], 10); }
  const target = phrase.split(/\s+/).map(norm).filter(Boolean);
  const ws = words.map((w) => norm(w.w));
  const eq = (a: string, b: string) => a === b || NUM[a] === b || NUM[b] === a;
  let seen = 0;
  for (let i = 0; i + target.length <= ws.length; i++) {
    if (target.every((t, k) => eq(ws[i + k], t))) {
      seen++;
      if (seen === occ) return words[i].s;
    }
  }
  throw new Error(`[${lid}] cue no encontrado en escena ${n}: "${phrase}"`);
}

/** Recorre la spec y cambia cada cue (at, titleAt, bodyAt…) por segundos LOCALES de la escena. */
export function resolveLesson(spec: LessonSpec, tl: Timeline, words: Words, errs?: string[]): LessonSpec {
  const lid = spec.meta.id;
  if (spec.scenes.length !== tl.vo.length) throw new Error(`[${lid}] la spec tiene ${spec.scenes.length} escenas y hay ${tl.vo.length} audios`);
  const scenes = spec.scenes.map((sc, i) => {
    const n = i + 1;
    const voLocal = tl.vo[i].start - tl.scenes[i][0];
    const ws = words[`${String(n).padStart(2, "0")}.mp3`].words;
    const conv = (c: Cue | undefined, dflt: number): number =>
      c === undefined ? dflt : typeof c === "number" ? voLocal + c : (() => {
        try { return voLocal + findCue(ws, c, lid, n) - 0.12; } catch (e: any) { if (errs) { errs.push(e.message); return dflt; } throw e; }
      })();
    const walk = (o: any): any => {
      if (Array.isArray(o)) return o.map(walk);
      if (o && typeof o === "object") {
        const r: any = {};
        for (const [k, v] of Object.entries(o)) {
          if (k === "at" || k.endsWith("At")) r[k] = conv(v as Cue, voLocal + 0.3);
          else r[k] = walk(v);
        }
        if ("text" in o && !("at" in o)) r.at = voLocal + 0.3;
        return r;
      }
      return o;
    };
    const out = walk(sc);
    out.titleAt = conv(sc.titleAt, voLocal + 0.15);
    out.__vo = voLocal;
    out.__dur = tl.scenes[i][1] - tl.scenes[i][0];
    return out;
  });
  return { ...spec, scenes };
}

/* ───────────────────────── piezas visuales ───────────────────────── */

const toneColor = (t?: Tone) => (t === "ok" ? C.ok : t === "warn" ? C.warn : t === "blue" ? C.blue : t === "neutral" ? C.slate : C.cyan);
const Ico: React.FC<{ name?: string; size?: number; color?: string }> = ({ name, size = 28, color = C.cyan }) => {
  const I = (Icons as any)[name || "CircleCheck"] || Icons.CircleCheck;
  return <I size={size} color={color} strokeWidth={1.7} />;
};

/** Texto con *cursiva cian* (o azul en hoja clara). */
const Rich: React.FC<{ text: string; light?: boolean }> = ({ text, light }) => (
  <>
    {text.split(/(\*[^*]+\*)/).map((p, i) =>
      p.startsWith("*") ? <span key={i} style={{ fontStyle: "italic", color: light ? C.blue : C.cyan }}>{p.slice(1, -1)}</span> : <React.Fragment key={i}>{p}</React.Fragment>,
    )}
  </>
);

const Bg: React.FC<{ sc: any }> = ({ sc }) => {
  if (sc.stock) {
    return (
      <>
        <Stock src={`stock/${sc.stock}.mp4`} dur={sc.__dur} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,21,48,0.96) 30%, rgba(7,21,48,0.55))" }} />
        <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(7,21,48,0.8), transparent 40%)" }} />
      </>
    );
  }
  if (sc.theme === "light") {
    return (
      <AbsoluteFill style={{ background: C.paper }}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 78% 40%, rgba(30,107,255,0.10), transparent 55%)" }} />
      </AbsoluteFill>
    );
  }
  return <InkBackdrop glowX={sc.__glow ?? 70} glowY={40} />;
};

const Heading: React.FC<{ sc: any; width?: number; size?: number; style?: React.CSSProperties }> = ({ sc, width = 1300, size = 88, style }) => {
  const light = sc.theme === "light" && !sc.stock;
  const lines: string[] = (sc.title || "").split("\n");
  return (
    <div style={{ width, ...style }}>
      {sc.kicker ? <Kicker at={Math.max(0, sc.titleAt - 0.3)} color={light ? C.blue : C.cyan}>{sc.kicker}</Kicker> : null}
      {sc.kicker ? <div style={{ height: 26 }} /> : null}
      {lines.map((l, i) => (
        <MaskLine key={i} at={sc.titleAt + i * 0.35}>
          <Headline size={size} color={light ? C.navy : C.white}><Rich text={l} light={light} /></Headline>
        </MaskLine>
      ))}
      {sc.body ? (
        <Reveal at={sc.bodyAt ?? sc.titleAt + 0.8}>
          <div style={{ fontFamily: sans, fontWeight: 300, fontSize: 32, lineHeight: 1.45, color: light ? "#475569" : C.mist, marginTop: 30 }}>
            <Rich text={sc.body} light={light} />
          </div>
        </Reveal>
      ) : null}
    </div>
  );
};

const Card: React.FC<{ it: Item; light?: boolean; big?: boolean; style?: React.CSSProperties }> = ({ it, light, big, style }) => {
  const p = usePop(it.at as number);
  return (
    <div
      style={{
        display: "flex", alignItems: it.sub ? "flex-start" : "center", gap: 24, padding: big ? "30px 32px" : "20px 26px", borderRadius: 18,
        background: light ? C.white : "rgba(255,255,255,0.05)", border: light ? "none" : `1px solid ${C.line}`,
        boxShadow: light ? "0 10px 30px rgba(11,42,91,0.08)" : "none", opacity: p, transform: `translateY(${(1 - p) * 26}px)`, ...style,
      }}
    >
      {it.icon ? <IconBadge Icon={(Icons as any)[it.icon] || Icons.CircleCheck} size={big ? 30 : 26} color={light ? C.blue : toneColor(it.tone)} bg={light ? "rgba(30,107,255,0.10)" : "rgba(34,211,238,0.10)"} /> : null}
      <div>
        <div style={{ fontFamily: sans, fontSize: big ? 38 : 32, fontWeight: 500, color: light ? C.navy : C.white, lineHeight: 1.2 }}><Rich text={it.text} light={light} /></div>
        {it.sub ? <div style={{ fontFamily: sans, fontSize: big ? 25 : 23, fontWeight: 300, color: light ? "#475569" : C.mist, marginTop: 8, lineHeight: 1.35 }}>{it.sub}</div> : null}
      </div>
    </div>
  );
};

const Chip: React.FC<{ it: Item; light?: boolean }> = ({ it, light }) => {
  const p = usePop(it.at as number);
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 12, padding: "13px 22px", borderRadius: 40,
        background: light ? C.navy : "rgba(7,21,48,0.72)", border: `1px solid ${C.line}`, fontFamily: sans, fontSize: 21,
        letterSpacing: "0.16em", color: C.white, fontWeight: 500, opacity: p, transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      {it.icon ? <Ico name={it.icon} size={24} /> : null}
      {it.text.toUpperCase()}
    </div>
  );
};

/** Zona de contenido: debajo del título y por encima de los subtítulos, centrada vertical. */
const Zone: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", left: 120, right: 120, top, bottom: 170, display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>
);

/** Ícono grande decorativo a la derecha (portadas de escena). */
const Motif: React.FC<{ name: string; at: number; light: boolean }> = ({ name, at, light }) => {
  const f = useCurrentFrame();
  const p = usePop(at);
  const I = (Icons as any)[name] || Icons.CircleCheck;
  const float = Math.sin(f / 40) * 8;
  return (
    <div style={{ position: "absolute", right: 200, top: 250 + float, width: 440, height: 440, opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 220, border: `1px solid ${light ? "rgba(30,107,255,0.25)" : "rgba(34,211,238,0.30)"}` }} />
      <div style={{ position: "absolute", inset: 50, borderRadius: 170, border: `1px dashed ${light ? "rgba(30,107,255,0.25)" : "rgba(34,211,238,0.25)"}`, transform: `rotate(${f / 3}deg)` }} />
      <div style={{ position: "absolute", inset: 100, borderRadius: 120, background: light ? "rgba(30,107,255,0.10)" : "rgba(34,211,238,0.10)", boxShadow: light ? "none" : "0 0 80px rgba(30,107,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <I size={130} color={light ? C.blue : C.cyan} strokeWidth={1.2} />
      </div>
    </div>
  );
};

/* ───────────────────────── tipos de escena ───────────────────────── */

const SHero: React.FC<{ sc: any }> = ({ sc }) => (
  <>
    {sc.icon && !sc.stock ? <Motif name={sc.icon} at={sc.titleAt + 0.4} light={sc.theme === "light"} /> : null}
    <Heading sc={sc} width={sc.icon ? 1050 : 1150} size={sc.big ? 92 : 104} style={{ position: "absolute", left: 120, top: sc.big ? 170 : 250 }} />
    {sc.big ? (
      <div style={{ position: "absolute", left: 120, top: 520, display: "flex", gap: 90 }}>
        {sc.big.map((b: any, i: number) => (
          <Reveal key={i} at={b.at} y={20}>
            <div style={{ fontFamily: serif, fontSize: 120, color: C.cyan, lineHeight: 1 }}>{b.text}</div>
          </Reveal>
        ))}
      </div>
    ) : null}
    {sc.chips ? (
      <div style={{ position: "absolute", left: 120, top: sc.big ? 720 : 680, display: "flex", gap: 16, flexWrap: "wrap", width: 1500 }}>
        {sc.chips.map((c: Item, i: number) => <Chip key={i} it={c} light={sc.theme === "light" && !sc.stock} />)}
      </div>
    ) : null}
  </>
);

const SRows: React.FC<{ sc: any }> = ({ sc }) => {
  const light = sc.theme === "light" && !sc.stock;
  if (sc.layout === "full" || sc.cols > 1) {
    const cols = sc.cols || 2;
    return (
      <>
        <Heading sc={sc} width={1600} size={80} style={{ position: "absolute", left: 120, top: 120 }} />
        <Zone top={sc.body ? 480 : 380}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 26 }}>
            {sc.items.map((it: Item, i: number) => <Card key={i} it={it} light={light} big />)}
          </div>
        </Zone>
      </>
    );
  }
  return (
    <>
      <Heading sc={sc} width={780} size={84} style={{ position: "absolute", left: 120, top: 170 }} />
      <div style={{ position: "absolute", left: 1000, width: 800, top: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        {sc.header ? (
          <Reveal at={sc.headerAt ?? sc.items[0].at - 0.3} y={10}>
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 20, letterSpacing: "0.3em", color: light ? C.blue : C.cyan, marginBottom: 10 }}>{sc.header.toUpperCase()}</div>
          </Reveal>
        ) : null}
        {sc.items.map((it: Item, i: number) => <Card key={i} it={it} light={light} />)}
      </div>
    </>
  );
};

const SCompare: React.FC<{ sc: any }> = ({ sc }) => {
  const light = sc.theme === "light" && !sc.stock;
  return (
    <>
      <Heading sc={sc} width={1600} size={80} style={{ position: "absolute", left: 120, top: 120 }} />
      <Zone top={sc.body ? 480 : 370}>
        <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
          {sc.cards.map((cd: any, i: number) => <CompareCard key={i} cd={cd} light={light} />)}
        </div>
      </Zone>
    </>
  );
};
const CompareCard: React.FC<{ cd: any; light: boolean }> = ({ cd, light }) => {
  const p = usePop(cd.at ?? cd.items[0].at - 0.3);
  const col = toneColor(cd.tone);
  return (
    <div
      style={{
        flex: 1, borderRadius: 24, padding: "50px 54px 58px", background: light ? C.white : "rgba(255,255,255,0.04)",
        border: light ? "none" : `1px solid ${C.line}`, boxShadow: light ? "0 14px 40px rgba(11,42,91,0.10)" : "none",
        borderTop: `3px solid ${col}`, opacity: p, transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 21, letterSpacing: "0.3em", color: col, marginBottom: 30 }}>{cd.label.toUpperCase()}</div>
      <div style={{ display: "grid", gap: 42 }}>
        {cd.items.map((it: Item, i: number) => <MarkItem key={i} it={it} tone={cd.tone} light={light} />)}
      </div>
    </div>
  );
};
const MarkItem: React.FC<{ it: Item; tone: Tone; light: boolean }> = ({ it, tone, light }) => {
  const p = usePop(it.at as number);
  const col = toneColor(it.tone || tone);
  const Ic = it.icon ? (Icons as any)[it.icon] : tone === "warn" ? Icons.X : tone === "ok" ? Icons.Check : Icons.ChevronRight;
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", opacity: p, transform: `translateX(${(1 - p) * 26}px)` }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${col}22` }}>
        <Ic size={27} color={col} strokeWidth={2.2} />
      </div>
      <div>
        <div style={{ fontFamily: sans, fontSize: 42, fontWeight: 500, color: light ? C.navy : C.white, lineHeight: 1.2 }}>{it.text}</div>
        {it.sub ? <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 300, color: light ? "#475569" : C.mist, marginTop: 8 }}>{it.sub}</div> : null}
      </div>
    </div>
  );
};

const SSteps: React.FC<{ sc: any }> = ({ sc }) => {
  const light = sc.theme === "light" && !sc.stock;
  const n = sc.items.length;
  if (sc.vertical) {
    return (
      <>
        <Heading sc={sc} width={720} size={80} style={{ position: "absolute", left: 120, top: 170 }} />
        <div style={{ position: "absolute", left: 930, width: 880, top: 0, bottom: 140, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
          {sc.items.map((it: Item, i: number) => <Stair key={i} it={it} i={i} light={light} />)}
          {sc.result ? <Stair it={sc.result} i={n} light={light} result /> : null}
        </div>
      </>
    );
  }
  return (
    <>
      <Heading sc={sc} width={1600} size={80} style={{ position: "absolute", left: 120, top: 120 }} />
      <Zone top={sc.body ? 500 : 400}>
        <div style={{ display: "flex", gap: 22, alignItems: "stretch", minHeight: n > 4 ? 300 : 340 }}>
          {sc.items.map((it: Item, i: number) => <StepCard key={i} it={it} i={i} last={i === n - 1} light={light} numbered={sc.numbered !== false} n={n} />)}
        </div>
      </Zone>
    </>
  );
};
const StepCard: React.FC<{ it: Item; i: number; last: boolean; light: boolean; numbered: boolean; n: number }> = ({ it, i, last, light, numbered, n }) => {
  const p = usePop(it.at as number);
  return (
    <div style={{ flex: 1, position: "relative", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div
        style={{
          height: "100%", borderRadius: 20, padding: n > 5 ? "34px 22px" : "42px 32px", display: "flex", flexDirection: "column", justifyContent: "center", background: light ? C.white : "rgba(255,255,255,0.05)",
          border: light ? "none" : `1px solid ${C.line}`, boxShadow: light ? "0 10px 30px rgba(11,42,91,0.08)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          {numbered ? <span style={{ fontFamily: serif, fontSize: 48, color: light ? C.blue : C.cyan, lineHeight: 1 }}>{i + 1}</span> : null}
          {it.icon ? <Ico name={it.icon} size={n > 5 ? 38 : 46} color={light ? C.blue : C.cyan} /> : null}
        </div>
        <div style={{ fontFamily: sans, fontSize: n > 5 ? 28 : 34, fontWeight: 600, color: light ? C.navy : C.white, lineHeight: 1.22 }}>{it.text}</div>
        {it.sub ? <div style={{ fontFamily: sans, fontSize: n > 5 ? 21 : 25, fontWeight: 300, color: light ? "#475569" : C.mist, marginTop: 10, lineHeight: 1.35 }}>{it.sub}</div> : null}
      </div>
      {!last ? (
        <div style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
          <Icons.ChevronRight size={20} color={light ? C.blue : C.cyan} strokeWidth={3} />
        </div>
      ) : null}
    </div>
  );
};
const Stair: React.FC<{ it: Item; i: number; light: boolean; result?: boolean }> = ({ it, i, light, result }) => {
  const p = usePop(it.at as number);
  return (
    <div
      style={{
        marginLeft: i * 34, display: "flex", alignItems: "center", gap: 20, padding: "16px 24px", borderRadius: 14,
        background: result ? (light ? C.navy : "rgba(34,211,238,0.14)") : light ? C.white : "rgba(255,255,255,0.05)",
        border: result ? `1px solid ${C.cyan}` : light ? "none" : `1px solid ${C.line}`, boxShadow: light ? "0 8px 24px rgba(11,42,91,0.08)" : "none",
        opacity: p, transform: `translateX(${(1 - p) * 40}px)`,
      }}
    >
      <span style={{ fontFamily: serif, fontSize: 30, color: result ? C.cyan : light ? C.blue : C.cyan, minWidth: 34 }}>{result ? "→" : i + 1}</span>
      <div>
        <div style={{ fontFamily: sans, fontSize: 27, fontWeight: 500, color: result || !light ? C.white : C.navy, lineHeight: 1.25 }}>{it.text}</div>
        {it.sub ? <div style={{ fontFamily: sans, fontSize: 21, fontWeight: 300, color: result || !light ? C.mist : "#475569", marginTop: 4 }}>{it.sub}</div> : null}
      </div>
    </div>
  );
};

const SCycle: React.FC<{ sc: any }> = ({ sc }) => {
  const f = useCurrentFrame();
  const light = sc.theme === "light" && !sc.stock;
  const R = 300, cx = 360, cy = 360;
  const rot = interpolate(f, [0, s(sc.__dur)], [0, 12]);
  const pos = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  return (
    <>
      <Heading sc={sc} width={760} size={80} style={{ position: "absolute", left: 120, top: 170 }} />
      <div style={{ position: "absolute", left: 1010, top: 140, width: 720, height: 720 }}>
        <svg width={720} height={720} style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)` }}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={light ? "rgba(11,42,91,0.15)" : C.line} strokeWidth={2} strokeDasharray="6 10" />
        </svg>
        {sc.center ? (
          <Reveal at={sc.centerAt ?? sc.titleAt + 0.6} y={0} style={{ position: "absolute", left: cx - 140, top: cy - 140, width: 280, height: 280, borderRadius: 140, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: light ? C.navy : "rgba(30,107,255,0.18)", border: `1px solid ${C.cyan}` }}>
            <div style={{ fontFamily: serif, fontSize: 40, color: C.white, lineHeight: 1.1, padding: 20 }}>{sc.center}</div>
          </Reveal>
        ) : null}
        {sc.segs.map((it: Item, i: number) => {
          const [dx, dy] = pos[i % 4];
          return <CycleNode key={i} it={it} x={cx + dx * R} y={cy + dy * R} light={light} />;
        })}
      </div>
      {sc.notes ? (
        <div style={{ position: "absolute", left: 120, top: 560, width: 780, display: "grid", gap: 14 }}>
          {sc.notes.map((it: Item, i: number) => <Card key={i} it={it} light={light} />)}
        </div>
      ) : null}
    </>
  );
};
const CycleNode: React.FC<{ it: Item; x: number; y: number; light: boolean }> = ({ it, x, y, light }) => {
  const p = usePop(it.at as number);
  return (
    <div
      style={{
        position: "absolute", left: x - 125, top: y - 70, width: 250, minHeight: 140, borderRadius: 20, padding: "18px 16px",
        background: light ? C.white : C.navy, border: `1.5px solid ${C.cyan}`, boxShadow: `0 16px 40px rgba(0,0,0,${light ? 0.12 : 0.35})`,
        textAlign: "center", opacity: p, transform: `scale(${0.7 + 0.3 * p})`,
      }}
    >
      {it.icon ? <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Ico name={it.icon} size={30} color={light ? C.blue : C.cyan} /></div> : null}
      <div style={{ fontFamily: serif, fontSize: 36, color: light ? C.navy : C.white, lineHeight: 1.05 }}>{it.text}</div>
      {it.sub ? <div style={{ fontFamily: sans, fontSize: 19, color: light ? "#475569" : C.mist, marginTop: 8 }}>{it.sub}</div> : null}
    </div>
  );
};

const STable: React.FC<{ sc: any }> = ({ sc }) => {
  const light = sc.theme === "light" && !sc.stock;
  const w = sc.widths || sc.head.map(() => 1);
  const grid = w.map((x: number) => `${x}fr`).join(" ");
  const hp = useIn(sc.titleAt + 0.5, 0.6);
  return (
    <>
      <Heading sc={sc} width={1600} size={76} style={{ position: "absolute", left: 120, top: 110 }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: sc.body ? 450 : 350, borderRadius: 18, overflow: "hidden", background: light ? C.white : "rgba(255,255,255,0.03)", border: light ? "none" : `1px solid ${C.line}`, boxShadow: light ? "0 14px 40px rgba(11,42,91,0.10)" : "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: grid, background: light ? C.navy : "rgba(30,107,255,0.22)", opacity: hp }}>
          {sc.head.map((h: string, i: number) => (
            <div key={i} style={{ padding: "20px 26px", fontFamily: sans, fontWeight: 600, fontSize: 21, letterSpacing: "0.16em", color: C.white }}>{h.toUpperCase()}</div>
          ))}
        </div>
        {sc.rows.map((r: any, i: number) => <TRow key={i} r={r} grid={grid} light={light} n={sc.rows.length} />)}
      </div>
    </>
  );
};
const TRow: React.FC<{ r: any; grid: string; light: boolean; n: number }> = ({ r, grid, light, n }) => {
  const p = useIn(r.at, 0.6);
  const rowFont = n <= 4 ? 32 : n <= 6 ? 29 : 26;
  const rowPad = n <= 4 ? "26px 26px" : n <= 6 ? "20px 26px" : "15px 24px";
  return (
    <div style={{ display: "grid", gridTemplateColumns: grid, borderTop: `1px solid ${light ? "#E2E8F0" : C.line}`, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, background: r.hi ? (light ? "rgba(30,107,255,0.07)" : "rgba(34,211,238,0.08)") : "transparent" }}>
      {r.cells.map((c: string, i: number) => (
        <div key={i} style={{ padding: rowPad, fontFamily: sans, fontSize: rowFont, lineHeight: 1.3, color: light ? (i === 0 ? C.navy : "#334155") : i === 0 ? C.white : C.mist, fontWeight: i === 0 ? 600 : 400 }}>{c}</div>
      ))}
    </div>
  );
};

const SHeatmap: React.FC<{ sc: any }> = ({ sc }) => {
  const f = useCurrentFrame();
  const light = sc.theme === "light" && !sc.stock;
  const cell = 108, ox = 1080, oy = 200;
  const lvl = (v: number) => (v >= 15 ? "#E5484D" : v >= 8 ? "#F5A524" : "#30A46C");
  // posición del marcador: se mueve de una marca a la siguiente
  let mp = sc.marks[0];
  let prev = sc.marks[0];
  let k = 0;
  for (let i = 0; i < sc.marks.length; i++) if (f >= s(sc.marks[i].at)) { k = i; }
  mp = sc.marks[k]; prev = sc.marks[Math.max(0, k - 1)];
  const tt = interpolate(f, [s(mp.at), s(mp.at + 0.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mx = (prev.i + (mp.i - prev.i) * tt), my = (prev.p + (mp.p - prev.p) * tt);
  const show = usePop(sc.marks[0].at);
  const gp = useIn(sc.titleAt + 0.6, 0.8);
  return (
    <>
      <Heading sc={sc} width={820} size={78} style={{ position: "absolute", left: 120, top: 150 }} />
      {sc.side ? (
        <div style={{ position: "absolute", left: 120, top: 560, width: 820, display: "grid", gap: 14 }}>
          {sc.side.map((it: Item, i: number) => <Card key={i} it={it} light={light} />)}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: ox, top: oy, opacity: gp }}>
        {[5, 4, 3, 2, 1].map((p, r) => [1, 2, 3, 4, 5].map((im, c) => (
          <div key={`${p}${im}`} style={{ position: "absolute", left: c * cell, top: r * cell, width: cell - 6, height: cell - 6, borderRadius: 10, background: lvl(p * im), opacity: 0.85, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontSize: 24, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{p * im}</div>
        )))}
        <div style={{ position: "absolute", left: -34, top: (cell * 5) / 2, transform: "translate(-50%, -50%) rotate(-90deg)", fontFamily: sans, fontSize: 18, letterSpacing: "0.3em", color: light ? C.navy : C.mist, whiteSpace: "nowrap" }}>PROBABILIDAD</div>
        <div style={{ position: "absolute", left: 0, top: cell * 5 + 12, width: cell * 5, textAlign: "center", fontFamily: sans, fontSize: 18, letterSpacing: "0.3em", color: light ? C.navy : C.mist }}>IMPACTO</div>
        <div style={{ position: "absolute", left: (mx - 1) * cell - 6, top: (5 - my) * cell - 6, width: cell + 6, height: cell + 6, borderRadius: 14, border: `4px solid ${C.white}`, boxShadow: "0 0 0 3px #071530, 0 10px 30px rgba(0,0,0,0.4)", opacity: show, transform: `scale(${0.6 + 0.4 * show})` }} />
        <div style={{ position: "absolute", left: 0, top: cell * 5 + 56, width: cell * 5, textAlign: "center", fontFamily: sans, fontSize: 26, fontWeight: 600, color: light ? C.navy : C.white, opacity: show }}>
          {mp.label}
        </div>
      </div>
    </>
  );
};

const SDoc: React.FC<{ sc: any }> = ({ sc }) => {
  const f = useCurrentFrame();
  const light = sc.theme === "light" && !sc.stock;
  const p = usePop(sc.titleAt + 0.6);
  // resaltados: cada fragmento se subraya en su cue
  const parts: React.ReactNode[] = [];
  let rest = sc.text as string;
  const marks = [...(sc.marks || [])].sort((a: any, b: any) => sc.text.indexOf(a.frag) - sc.text.indexOf(b.frag));
  marks.forEach((m: any, i: number) => {
    const idx = rest.indexOf(m.frag);
    if (idx < 0) return;
    parts.push(<React.Fragment key={`t${i}`}>{rest.slice(0, idx)}</React.Fragment>);
    const h = interpolate(f, [s(m.at), s(m.at + 0.5)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const col = m.tone === "ok" ? "52,211,153" : m.tone === "warn" ? "255,90,110" : "34,211,238";
    parts.push(<span key={`m${i}`} style={{ backgroundImage: `linear-gradient(rgba(${col},0.35), rgba(${col},0.35))`, backgroundSize: `${h * 100}% 100%`, backgroundRepeat: "no-repeat", borderRadius: 4 }}>{m.frag}</span>);
    rest = rest.slice(idx + m.frag.length);
  });
  parts.push(<React.Fragment key="end">{rest}</React.Fragment>);
  return (
    <>
      <Heading sc={sc} width={sc.side ? 720 : 1600} size={78} style={{ position: "absolute", left: 120, top: 140 }} />
      <div
        style={{
          position: "absolute", left: sc.side ? 900 : 120, right: 120, top: sc.side ? 200 : 400, padding: "52px 60px", borderRadius: 8,
          background: "#FDFDFE", boxShadow: "0 40px 90px rgba(0,0,0,0.35)", opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${(1 - p) * -1.5}deg)`,
          borderTop: `6px solid ${C.blue}`,
        }}
      >
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 18, letterSpacing: "0.3em", color: C.blue, marginBottom: 22 }}>{sc.label.toUpperCase()}</div>
        <div style={{ fontFamily: serif, fontSize: sc.side ? 42 : 46, lineHeight: 1.45, color: C.navy }}>{parts}</div>
      </div>
      {sc.side ? (
        <div style={{ position: "absolute", left: 120, top: 560, width: 720, display: "grid", gap: 14 }}>
          {sc.side.map((it: Item, i: number) => <Card key={i} it={it} light={light} />)}
        </div>
      ) : null}
    </>
  );
};

const SStats: React.FC<{ sc: any }> = ({ sc }) => {
  const light = sc.theme === "light" && !sc.stock;
  return (
    <>
      <Heading sc={sc} width={1600} size={80} style={{ position: "absolute", left: 120, top: 140 }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 470, display: "flex", gap: 60 }}>
        {sc.items.map((it: any, i: number) => (
          <Reveal key={i} at={it.at} y={24} style={{ flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: 130, color: light ? C.blue : C.cyan, lineHeight: 1 }}>{it.value}</div>
            <Rule at={it.at + 0.3} width={160} color={light ? C.blue : C.cyan} style={{ margin: "22px 0", height: 2 }} />
            <div style={{ fontFamily: sans, fontSize: 32, color: light ? C.navy : C.white, fontWeight: 500 }}>{it.label}</div>
            {it.sub ? <div style={{ fontFamily: sans, fontSize: 23, color: light ? "#475569" : C.mist, marginTop: 8 }}>{it.sub}</div> : null}
          </Reveal>
        ))}
      </div>
    </>
  );
};

const SFishbone: React.FC<{ sc: any }> = ({ sc }) => {
  const light = sc.theme === "light" && !sc.stock;
  const sp = useIn(sc.problemAt ?? sc.titleAt + 0.5, 1.0);
  const ink = light ? C.navy : C.white;
  const x0 = 140, x1 = 1420, y = 640;
  const tops = sc.causes.slice(0, 3), bots = sc.causes.slice(3, 6);
  return (
    <>
      <Heading sc={sc} width={1600} size={76} style={{ position: "absolute", left: 120, top: 110 }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0} y1={y} x2={x0 + (x1 - x0) * sp} y2={y} stroke={light ? C.blue : C.cyan} strokeWidth={4} />
        {[...tops, ...bots].map((c: any, i: number) => {
          const top = i < 3;
          const bx = 330 + (i % 3) * 380;
          return <Bone key={i} at={c.at} x={bx} y={y} top={top} color={light ? C.blue : C.cyan} />;
        })}
      </svg>
      {[...tops, ...bots].map((c: any, i: number) => {
        const top = i < 3;
        const bx = 330 + (i % 3) * 380;
        return <BoneLabel key={i} it={c} x={bx - 150} y={top ? y - 250 : y + 190} ink={ink} light={light} />;
      })}
      <Reveal at={sc.problemAt ?? sc.titleAt + 0.5} y={0} style={{ position: "absolute", left: x1 + 10, top: y - 80, width: 360, minHeight: 160, borderRadius: 18, background: light ? C.navy : "rgba(255,90,110,0.15)", border: `1.5px solid ${C.warn}`, padding: "22px 24px", display: "flex", alignItems: "center" }}>
        <div style={{ fontFamily: sans, fontSize: 27, color: C.white, fontWeight: 600, lineHeight: 1.25 }}>{sc.problem}</div>
      </Reveal>
    </>
  );
};
const Bone: React.FC<{ at: number; x: number; y: number; top: boolean; color: string }> = ({ at, x, y, top, color }) => {
  const p = useIn(at, 0.6);
  const dx = 110 * p, dy = (top ? -170 : 170) * p;
  return <line x1={x + 110} y1={y} x2={x + 110 - dx} y2={y + dy} stroke={color} strokeWidth={3} opacity={0.9} />;
};
const BoneLabel: React.FC<{ it: Item; x: number; y: number; ink: string; light: boolean }> = ({ it, x, y, ink, light }) => {
  const p = usePop(it.at as number);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300, textAlign: "center", opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 14, background: light ? C.white : "rgba(255,255,255,0.06)", border: light ? "none" : `1px solid ${C.line}`, boxShadow: light ? "0 8px 24px rgba(11,42,91,0.08)" : "none" }}>
        {it.icon ? <Ico name={it.icon} size={26} color={light ? C.blue : C.cyan} /> : null}
        <span style={{ fontFamily: sans, fontSize: 28, fontWeight: 600, color: ink }}>{it.text}</span>
      </div>
      {it.sub ? <div style={{ fontFamily: sans, fontSize: 20, color: light ? "#475569" : C.mist, marginTop: 8 }}>{it.sub}</div> : null}
    </div>
  );
};

const STimeline: React.FC<{ sc: any }> = ({ sc }) => {
  const light = sc.theme === "light" && !sc.stock;
  const n = sc.items.length;
  const lp = useIn(sc.items[0].at, Math.max(1, (sc.items[n - 1].at - sc.items[0].at) + 0.6));
  const W = 1680, x0 = 120, y = 560;
  return (
    <>
      <Heading sc={sc} width={1600} size={78} style={{ position: "absolute", left: 120, top: 130 }} />
      <div style={{ position: "absolute", left: x0, top: y, width: W * lp, height: 3, background: light ? C.blue : C.cyan }} />
      {sc.items.map((it: Item, i: number) => {
        const x = x0 + (W / (n - 1 || 1)) * i;
        return <TPoint key={i} it={it} x={n === 1 ? x0 : x} y={y} up={i % 2 === 0} light={light} edge={i === 0 ? "l" : i === n - 1 ? "r" : "c"} />;
      })}
    </>
  );
};
const TPoint: React.FC<{ it: Item; x: number; y: number; up: boolean; light: boolean; edge: "l" | "r" | "c" }> = ({ it, x, y, up, light, edge }) => {
  const p = usePop(it.at as number);
  const w = 300;
  const left = edge === "l" ? x - 20 : edge === "r" ? x - w + 20 : x - w / 2;
  return (
    <>
      <div style={{ position: "absolute", left: x - 13, top: y - 12, width: 26, height: 26, borderRadius: 13, background: light ? C.blue : C.cyan, border: `4px solid ${light ? C.paper : C.ink}`, opacity: p, transform: `scale(${p})` }} />
      <div style={{ position: "absolute", left, width: w, top: up ? y - 210 : y + 44, textAlign: edge === "l" ? "left" : edge === "r" ? "right" : "center", opacity: p, transform: `translateY(${(1 - p) * (up ? 20 : -20)}px)` }}>
        {it.icon ? <div style={{ display: "flex", justifyContent: edge === "l" ? "flex-start" : edge === "r" ? "flex-end" : "center", marginBottom: 10 }}><Ico name={it.icon} size={32} color={light ? C.blue : C.cyan} /></div> : null}
        <div style={{ fontFamily: serif, fontSize: 38, color: light ? C.navy : C.white, lineHeight: 1.1 }}>{it.text}</div>
        {it.sub ? <div style={{ fontFamily: sans, fontSize: 21, color: light ? "#475569" : C.mist, marginTop: 8, lineHeight: 1.3 }}>{it.sub}</div> : null}
      </div>
    </>
  );
};

const SBands: React.FC<{ sc: any }> = ({ sc }) => {
  const light = sc.theme === "light" && !sc.stock;
  const ap = useIn(sc.bands[0].at, 1.0);
  return (
    <>
      <Heading sc={sc} width={1600} size={76} style={{ position: "absolute", left: 120, top: 110 }} />
      <div style={{ position: "absolute", left: 340, right: 340, top: 320, bottom: 180, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        {sc.bands.map((b: any, i: number) => <Band key={i} b={b} light={light} main={i === 1} />)}
      </div>
      {sc.inLabel ? (
        <div style={{ position: "absolute", left: 90, top: 480, width: 220, textAlign: "center", opacity: ap }}>
          <Icons.Users size={40} color={light ? C.blue : C.cyan} />
          <div style={{ fontFamily: sans, fontSize: 26, color: light ? C.navy : C.white, margin: "12px 0", lineHeight: 1.25 }}>{sc.inLabel}</div>
          <Icons.ArrowRight size={40} color={light ? C.blue : C.cyan} />
        </div>
      ) : null}
      {sc.outLabel ? (
        <div style={{ position: "absolute", right: 90, top: 480, width: 220, textAlign: "center", opacity: ap }}>
          <Icons.Smile size={40} color={light ? C.blue : C.cyan} />
          <div style={{ fontFamily: sans, fontSize: 26, color: light ? C.navy : C.white, margin: "12px 0", lineHeight: 1.25 }}>{sc.outLabel}</div>
          <Icons.ArrowRight size={40} color={light ? C.blue : C.cyan} />
        </div>
      ) : null}
    </>
  );
};
const Band: React.FC<{ b: any; light: boolean; main: boolean }> = ({ b, light, main }) => {
  const p = usePop(b.at);
  return (
    <div style={{ borderRadius: 20, padding: "28px 32px", background: main ? (light ? C.navy : "rgba(30,107,255,0.22)") : light ? C.white : "rgba(255,255,255,0.05)", border: light && !main ? "none" : `1px solid ${main ? C.cyan : C.line}`, boxShadow: light ? "0 10px 30px rgba(11,42,91,0.08)" : "none", opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 21, letterSpacing: "0.3em", color: main ? C.cyan : light ? C.blue : C.cyan, marginBottom: 18 }}>{b.label.toUpperCase()}</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        {b.items.map((t: string, i: number) => (
          <React.Fragment key={i}>
            {main && i > 0 ? <Icons.ChevronRight size={28} color={C.cyan} /> : null}
            <span style={{ padding: "14px 24px", borderRadius: 12, background: main ? "rgba(255,255,255,0.10)" : light ? C.paper : "rgba(255,255,255,0.06)", fontFamily: sans, fontSize: 31, color: main || !light ? C.white : C.navy }}>{t}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const SAvatar: React.FC<{ sc: any }> = ({ sc }) => (
  <>
    <AvatarColumn src={sc.video} voAt={sc.__vo} dur={sc.__dur} />
    <Heading sc={sc} width={900} size={84} style={{ position: "absolute", left: 120, top: 150 }} />
    <div style={{ position: "absolute", left: 120, top: 470, width: 860, display: "grid", gap: 16 }}>
      {sc.items.map((it: Item, i: number) => <Card key={i} it={it} />)}
    </div>
    {sc.chips ? (
      <div style={{ position: "absolute", left: 120, top: 860, display: "flex", gap: 12, width: 960 }}>
        {sc.chips.map((c: Item, i: number) => <Chip key={i} it={c} />)}
      </div>
    ) : null}
  </>
);

const BODY: Record<string, React.FC<{ sc: any }>> = {
  hero: SHero, rows: SRows, compare: SCompare, steps: SSteps, cycle: SCycle, table: STable, heatmap: SHeatmap,
  doc: SDoc, stats: SStats, fishbone: SFishbone, timeline: STimeline, bands: SBands, avatar: SAvatar,
};

const SceneView: React.FC<{ sc: any; id: string; i: number }> = ({ sc, id, i }) => {
  const B = BODY[sc.type];
  const light = sc.theme === "light" && !sc.stock;
  return (
    <AbsoluteFill style={{ background: light ? C.paper : C.ink }}>
      <Bg sc={{ ...sc, __glow: [70, 30, 80, 25, 60][i % 5] }} />
      <B sc={sc} />
      <LessonTag id={id} dark={light} />
    </AbsoluteFill>
  );
};

/* ───────────────────────── lección completa ───────────────────────── */

export const LessonVideo: React.FC<{ spec: LessonSpec; tl: Timeline; caps: Cap[] }> = ({ spec, tl, caps }) => {
  const froms: ("left" | "right" | "bottom")[] = ["right", "bottom", "right", "left", "bottom", "right"];
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Scene at={tl.intro} wipe={false}><Entrada meta={spec.meta} /></Scene>
      {spec.scenes.map((sc, i) => (
        <Scene key={i} at={tl.scenes[i]} from={froms[i % froms.length]}><SceneView sc={sc} id={spec.meta.id} i={i} /></Scene>
      ))}
      <Scene at={tl.outro} wipe={false}><Cierre /></Scene>
      <Captions caps={caps} />
      <Soundtrack vo={tl.vo} total={tl.total} />
    </AbsoluteFill>
  );
};

export { Sequence };
