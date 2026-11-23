/**
 * Piezas comunes a todas las lecciones del curso ISO 9001 (SAR Solutions):
 * entrada y cierre estándar, subtítulos quemados, etiqueta de lección, fondos
 * de Pexels, columna de avatar y la mezcla de música con ducking bajo la voz.
 */
import React from "react";
import {
  AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame,
} from "remotion";
import { C, sans, s } from "./theme";
import { Headline, InkBackdrop, Kicker, MaskLine, Reveal, Rule, useIn, WipeIn } from "./ui";

export type Cap = { text: string; s: number; e: number };
export type VO = { file: string; start: number; dur: number };
export type LessonMeta = { id: string; modulo: string; titulo: string; tituloItalic?: string; curso?: string };

/* ───────────── Logo SAR (capas claras) con el reveal aprobado ───────────── */

const LOGO = { w: 846, h: 608, sq: "#3D8BFF" };
const SQUARES = [
  [48, 126, 35, 42], [103, 189, 34, 42], [374, 325, 35, 43], [436, 116, 34, 43],
  [520, 84, 35, 42], [591, 390, 35, 43], [662, 310, 35, 42], [679, 1, 35, 42],
];

export const LogoReveal: React.FC<{ width: number; at?: number }> = ({ width, at = 0.2 }) => {
  const f = useCurrentFrame();
  const k = width / LOGO.w;
  const sar = useIn(at, 0.9);
  const sol = useIn(at + 0.8, 0.9);
  const h = LOGO.h * k;
  return (
    <div style={{ position: "relative", width, height: h }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - sar) * 100}% 0)`, transform: `translateY(${(1 - sar) * 30}px)` }}>
        <Img src={staticFile("logo/sar_light.png")} style={{ width, height: h }} />
      </div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - sol) * 100}% 0 0)`, opacity: Math.min(1, sol * 2) }}>
        <Img src={staticFile("logo/solutions_light.png")} style={{ width, height: h }} />
      </div>
      {SQUARES.map(([x, y, w, hh], i) => {
        const p = spring({ frame: f - s(at + 0.4 + i * 0.07), fps: 30, config: { damping: 13, mass: 0.6 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: x * k, top: y * k, width: w * k, height: hh * k, background: LOGO.sq,
              opacity: Math.min(1, p * 1.4), boxShadow: `0 0 ${18 * (1 - Math.min(1, p))}px ${LOGO.sq}`,
              transform: `translate(${(1 - p) * -60}px, ${(1 - p) * 70}px) scale(${0.4 + 0.6 * p})`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ───────────── Entrada estándar (≈3.6 s) ───────────── */

export const Entrada: React.FC<{ meta: LessonMeta }> = ({ meta }) => (
  <AbsoluteFill>
    <InkBackdrop glowX={50} glowY={40} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <LogoReveal width={250} at={0.1} />
      <Rule at={1.1} width={120} color={C.cyan} style={{ height: 2, margin: "40px 0 34px" }} />
      <Reveal at={1.25} y={10}>
        <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 22, letterSpacing: "0.34em", color: C.cyan, textAlign: "center" }}>
          {(meta.curso ?? "ISO 9001:2015").toUpperCase()} · {meta.modulo.toUpperCase()}
        </div>
      </Reveal>
      <div style={{ height: 26 }} />
      <MaskLine at={1.5}><Headline size={84} style={{ textAlign: "center" }}>{meta.titulo}</Headline></MaskLine>
      {meta.tituloItalic ? (
        <MaskLine at={1.75}><Headline size={84} italic style={{ textAlign: "center", color: C.mist }}>{meta.tituloItalic}</Headline></MaskLine>
      ) : null}
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ───────────── Cierre estándar (≈4.5 s) ───────────── */

export const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, s(0.6)], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <InkBackdrop glowX={50} glowY={36} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: 20 }}>
        <LogoReveal width={400} at={0.2} />
        <Rule at={1.2} width={150} color={C.cyan} style={{ height: 2, margin: "40px 0 36px" }} />
        <MaskLine at={1.4}>
          <Headline size={60} style={{ letterSpacing: "0.05em", textAlign: "center" }}>CONTINÚA CON LA SIGUIENTE LECCIÓN</Headline>
        </MaskLine>
        <Reveal at={1.9} y={10}>
          <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 24, letterSpacing: "0.3em", color: C.mist, marginTop: 30 }}>
            SAR-SOLUTIONS.COM.MX
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── Subtítulos quemados ───────────── */

export const Captions: React.FC<{ caps: Cap[] }> = ({ caps }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const c = caps.find((x) => t >= x.s && t < x.e);
  if (!c) return null;
  const a = interpolate(t, [c.s, c.s + 0.12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 58, pointerEvents: "none" }}>
      <div
        style={{
          fontFamily: sans, fontWeight: 500, fontSize: 42, lineHeight: 1.25, color: C.white, textAlign: "center",
          padding: "12px 30px 14px", borderRadius: 12, background: "rgba(7,21,48,0.78)", maxWidth: 1500,
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)", opacity: a, borderBottom: `2px solid ${C.cyan}`,
        }}
      >
        {c.text}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── Etiqueta de lección (esquina superior derecha) ───────────── */

export const LessonTag: React.FC<{ id: string; dark?: boolean; curso?: string }> = ({ id, dark, curso = "ISO 9001" }) => (
  <div
    style={{
      position: "absolute", right: 64, top: 52, fontFamily: sans, fontWeight: 500, fontSize: 17, letterSpacing: "0.3em",
      color: dark ? "rgba(11,42,91,0.55)" : "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 14,
    }}
  >
    <span style={{ width: 30, height: 1, background: dark ? "rgba(11,42,91,0.4)" : "rgba(255,255,255,0.4)" }} />
    {curso} · {id.replace("-", " · ")}
  </div>
);

/* ───────────── Fondo de video (Pexels) con push-in lento ───────────── */

export const Stock: React.FC<{ src: string; dur: number; pos?: string; startFrom?: number; rate?: number }> = ({ src, dur, pos = "50% 50%", startFrom = 0, rate = 1 }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, s(dur)], [1.08, 1.0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} muted startFrom={s(startFrom)} playbackRate={rate}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})` }} />
    </AbsoluteFill>
  );
};

/* ───────────── Columna de avatar (derecha, se funde con el fondo) ───────────── */

export const AvatarColumn: React.FC<{ src: string; voAt: number; dur: number }> = ({ src, voAt, dur }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, s(dur)], [1.05, 1.0]);
  const inP = useIn(0, 0.8);
  const box: React.CSSProperties = { width: 864, height: 1080, objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "55% 30%" };
  return (
    <div
      style={{
        position: "absolute", right: 0, top: 0, width: 864, height: 1080, overflow: "hidden", opacity: inP,
        WebkitMaskImage: "linear-gradient(to right, transparent 0px, black 220px)",
        maskImage: "linear-gradient(to right, transparent 0px, black 220px)",
      }}
    >
      {/* foto fija mientras arranca la voz, luego el video del avatar */}
      <Img src={staticFile("common/presentador.png")} style={box} />
      <Sequence from={s(voAt)}>
        <OffthreadVideo src={staticFile(src)} muted style={{ ...box, position: "absolute", left: 0, top: 0 }} />
      </Sequence>
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(7,21,48,0.85), transparent 38%)" }} />
    </div>
  );
};

/* ───────────── Escena con cortinilla ───────────── */

export const Scene: React.FC<{ at: [number, number]; from?: "left" | "right" | "bottom"; wipe?: boolean; children: React.ReactNode }> = ({ at, from = "right", wipe = true, children }) => (
  <Sequence from={s(at[0])} durationInFrames={s(at[1] - at[0])}>
    {wipe ? <WipeIn dur={0.65} from={from}>{children}</WipeIn> : children}
  </Sequence>
);

/* ───────────── Voz + música con ducking ───────────── */

export const Soundtrack: React.FC<{ vo: VO[]; total: number; music?: string }> = ({ vo, total, music = "common/musica.mp3" }) => {
  const BED = 0.12, DUCK = 0.045;
  const vol = (fr: number) => {
    const t = fr / 30;
    let v = BED;
    for (const { start, dur } of vo) {
      const d = Math.min(
        interpolate(t, [start - 0.4, start], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        interpolate(t, [start + dur, start + dur + 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      );
      v = Math.min(v, BED - (BED - DUCK) * d);
    }
    const fadeIn = interpolate(t, [0, 0.8], [0, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(t, [total - 1.5, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return v * fadeIn * fadeOut;
  };
  return (
    <>
      {vo.map((v) => (
        <Sequence key={v.file} from={s(v.start)}>
          <Audio src={staticFile(v.file)} />
        </Sequence>
      ))}
      <Audio src={staticFile(music)} volume={vol} />
    </>
  );
};

export { Headline, InkBackdrop, Kicker, MaskLine, Reveal, Rule };

/* ───────────── Marca de agua antipiratería (logo en esquina + patrón tenue) ───────────── */

export const Watermark: React.FC<{ light?: boolean }> = ({ light }) => {
  const corner = light ? 0.58 : 0.5;
  const pattern = light ? 0.065 : 0.06;
  const tone: React.CSSProperties = light ? { filter: "brightness(0.18) saturate(0)" } : {};
  const cells = Array.from({ length: 5 * 4 });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ opacity: pattern, transform: "rotate(-18deg) scale(1.35)", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(4, 1fr)", alignItems: "center", justifyItems: "center", ...tone }}>
        {cells.map((_, i) => (
          <Img key={i} src={staticFile("logo/sar_light.png")} style={{ width: 230 }} />
        ))}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 56, bottom: 44, opacity: corner, ...tone }}>
        <Img src={staticFile("logo/sar_light.png")} style={{ width: 120 }} />
      </div>
    </AbsoluteFill>
  );
};
