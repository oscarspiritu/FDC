import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans, serif, s } from "./theme";

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 progress starting at `at` seconds (scene-local), over `dur` seconds. */
export const useIn = (at: number, dur = 0.8) => {
  const f = useCurrentFrame();
  return interpolate(f, [s(at), s(at) + s(dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

export const usePop = (at: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - s(at), fps, config: { damping: 14, mass: 0.7 } });
};

/** Fade + rise reveal for any block. */
export const Reveal: React.FC<{ at: number; dur?: number; y?: number; x?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, dur = 0.8, y = 28, x = 0, style, children }) => {
  const p = useIn(at, dur);
  return (
    <div style={{ opacity: p, transform: `translate(${x * (1 - p)}px, ${y * (1 - p)}px)`, ...style }}>{children}</div>
  );
};

/** Line-by-line masked reveal, the editorial headline move. */
export const MaskLine: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const p = useIn(at, 0.9);
  return (
    <div style={{ overflow: "hidden", paddingTop: "0.16em", marginTop: "-0.16em", paddingBottom: "0.08em", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 140}%)`, opacity: p > 0 ? 1 : 0 }}>{children}</div>
    </div>
  );
};

export const Kicker: React.FC<{ at: number; children: React.ReactNode; color?: string }> = ({ at, children, color = C.cyan }) => {
  const p = useIn(at, 0.9);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, p * 1.5) }}>
      <div style={{ width: 56 * p, height: 2, background: color }} />
      <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 21, letterSpacing: "0.34em", color, textTransform: "uppercase" }}>{children}</div>
    </div>
  );
};

export const Headline: React.FC<{ size?: number; italic?: boolean; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 120, italic, color = C.white, children, style }) => (
  <div style={{ fontFamily: serif, fontWeight: 400, fontStyle: italic ? "italic" : "normal", fontSize: size, lineHeight: 1.0, letterSpacing: "-0.015em", color, ...style }}>{children}</div>
);

/** Thin rule that draws itself. */
export const Rule: React.FC<{ at: number; width: number; color?: string; style?: React.CSSProperties }> = ({ at, width, color = C.line, style }) => {
  const p = useIn(at, 1.1);
  return <div style={{ width: width * p, height: 1, background: color, ...style }} />;
};

/** Faint editorial grid + blue glow background. */
export const InkBackdrop: React.FC<{ glowX?: number; glowY?: number }> = ({ glowX = 70, glowY = 40 }) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 90) * 3;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${glowX + drift}% ${glowY}%, rgba(30,107,255,0.28), transparent 55%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          backgroundPosition: `${-f * 0.15}px 0px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Wipe-in wrapper: the incoming scene is revealed by a moving clip with a cyan leading edge. */
export const WipeIn: React.FC<{ dur: number; from?: "left" | "right" | "bottom"; children: React.ReactNode }> = ({ dur, from = "right", children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, s(dur)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const rest = (1 - p) * 100;
  const clip = from === "right" ? `inset(0 0 0 ${rest}%)` : from === "left" ? `inset(0 ${rest}% 0 0)` : `inset(${rest}% 0 0 0)`;
  const edge: React.CSSProperties =
    from === "bottom"
      ? { left: 0, right: 0, top: `${rest}%`, height: 3 }
      : from === "right"
      ? { top: 0, bottom: 0, left: `${rest}%`, width: 3 }
      : { top: 0, bottom: 0, left: `${100 - rest}%`, width: 3 };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>
      {p > 0 && p < 1 ? <div style={{ position: "absolute", background: C.cyan, boxShadow: `0 0 24px ${C.cyan}`, ...edge }} /> : null}
    </AbsoluteFill>
  );
};

export const IconBadge: React.FC<{ Icon: React.FC<any>; size?: number; color?: string; bg?: string }> = ({ Icon, size = 30, color = C.cyan, bg = "rgba(34,211,238,0.10)" }) => (
  <div style={{ width: size * 1.9, height: size * 1.9, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon size={size} color={color} strokeWidth={1.6} />
  </div>
);
