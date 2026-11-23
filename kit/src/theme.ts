import { loadFont as loadBodoni } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const serif = loadBodoni("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;
loadBodoni("italic", { weights: ["400"], subsets: ["latin"] });
export const sans = loadInter("normal", { weights: ["200", "300", "400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;

// Paleta SAR Solutions (brands/sar-solutions/brand.json + estilo "revista premium")
export const C = {
  ink: "#071530",
  navy: "#0B2A5B",
  blue: "#1E6BFF",
  cyan: "#22D3EE",
  white: "#FFFFFF",
  slate: "#94A3B8",
  mist: "#CBD5E1",
  paper: "#F3F5F9",
  line: "rgba(255,255,255,0.14)",
  ok: "#34D399",
  warn: "#FF5A6E",
};

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);
