// Generado por scripts/montar_leccion.py; no editar a mano.
import { LessonSpec, Timeline, Words } from "../kit";
import { Cap } from "../course";
import d0 from "./data/L33.json";
import d1 from "./data/M01-E01.json";
import d2 from "./data/M01-E02.json";
import d3 from "./data/M01-E03.json";
import d4 from "./data/M01-E04.json";
import d5 from "./data/M01-L01.json";
import d6 from "./data/M01-L02.json";
import d7 from "./data/M01-L03.json";
import d8 from "./data/M01-L04.json";
import d9 from "./data/M02-E05.json";
import d10 from "./data/M02-E06.json";
import d11 from "./data/M02-E07.json";
import d12 from "./data/M02-E08.json";
import d13 from "./data/M02-E09.json";
import d14 from "./data/M02-E10.json";
import d15 from "./data/M02-L05.json";
import d16 from "./data/M02-L06.json";
import d17 from "./data/M02-L07.json";
import d18 from "./data/M02-L08.json";
import d19 from "./data/M02-L09.json";
import d20 from "./data/M02-L10.json";
import d21 from "./data/M03-E11.json";
import d22 from "./data/M03-E12.json";
import d23 from "./data/M03-E13.json";
import d24 from "./data/M03-E14.json";
import d25 from "./data/M03-L11.json";
import d26 from "./data/M03-L12.json";
import d27 from "./data/M03-L13.json";
import d28 from "./data/M03-L14.json";
import d29 from "./data/M04-E15.json";
import d30 from "./data/M04-E16.json";
import d31 from "./data/M04-E17.json";
import d32 from "./data/M04-E18.json";
import d33 from "./data/M04-E19.json";
import d34 from "./data/M04-L15.json";
import d35 from "./data/M04-L16.json";
import d36 from "./data/M04-L18.json";
import d37 from "./data/M04-L19.json";
import d38 from "./data/M05-E20.json";
import d39 from "./data/M05-E21.json";
import d40 from "./data/M05-L20.json";
import d41 from "./data/M05-L21.json";
import d42 from "./data/M06-E22.json";
import d43 from "./data/M06-E23.json";
import d44 from "./data/M06-E24.json";
import d45 from "./data/M06-L22.json";
import d46 from "./data/M06-L23.json";
import d47 from "./data/M06-L24.json";
import d48 from "./data/M07-E25.json";
import d49 from "./data/M07-E26.json";
import d50 from "./data/M07-E27.json";
import d51 from "./data/M07-L25.json";
import d52 from "./data/M07-L26.json";
import d53 from "./data/M07-L27.json";
import d54 from "./data/M08-E28.json";
import d55 from "./data/M08-E29.json";
import d56 from "./data/M08-E30.json";
import d57 from "./data/M08-L28.json";
import d58 from "./data/M08-L29.json";
import d59 from "./data/M08-L30.json";
import d60 from "./data/M09-E31.json";
import d61 from "./data/M09-E32.json";
import d62 from "./data/M09-L31.json";
import d63 from "./data/M09-L32.json";
type Item = { id: string; spec: LessonSpec; tl: Timeline; words: Words; caps: Cap[] };
const mk = (id: string, d: any): Item => ({ id, spec: d.spec, tl: d.tl, words: d.words, caps: d.caps });
export const LESSONS: Item[] = [
  mk("L33", d0),
  mk("M01-E01", d1),
  mk("M01-E02", d2),
  mk("M01-E03", d3),
  mk("M01-E04", d4),
  mk("M01-L01", d5),
  mk("M01-L02", d6),
  mk("M01-L03", d7),
  mk("M01-L04", d8),
  mk("M02-E05", d9),
  mk("M02-E06", d10),
  mk("M02-E07", d11),
  mk("M02-E08", d12),
  mk("M02-E09", d13),
  mk("M02-E10", d14),
  mk("M02-L05", d15),
  mk("M02-L06", d16),
  mk("M02-L07", d17),
  mk("M02-L08", d18),
  mk("M02-L09", d19),
  mk("M02-L10", d20),
  mk("M03-E11", d21),
  mk("M03-E12", d22),
  mk("M03-E13", d23),
  mk("M03-E14", d24),
  mk("M03-L11", d25),
  mk("M03-L12", d26),
  mk("M03-L13", d27),
  mk("M03-L14", d28),
  mk("M04-E15", d29),
  mk("M04-E16", d30),
  mk("M04-E17", d31),
  mk("M04-E18", d32),
  mk("M04-E19", d33),
  mk("M04-L15", d34),
  mk("M04-L16", d35),
  mk("M04-L18", d36),
  mk("M04-L19", d37),
  mk("M05-E20", d38),
  mk("M05-E21", d39),
  mk("M05-L20", d40),
  mk("M05-L21", d41),
  mk("M06-E22", d42),
  mk("M06-E23", d43),
  mk("M06-E24", d44),
  mk("M06-L22", d45),
  mk("M06-L23", d46),
  mk("M06-L24", d47),
  mk("M07-E25", d48),
  mk("M07-E26", d49),
  mk("M07-E27", d50),
  mk("M07-L25", d51),
  mk("M07-L26", d52),
  mk("M07-L27", d53),
  mk("M08-E28", d54),
  mk("M08-E29", d55),
  mk("M08-E30", d56),
  mk("M08-L28", d57),
  mk("M08-L29", d58),
  mk("M08-L30", d59),
  mk("M09-E31", d60),
  mk("M09-E32", d61),
  mk("M09-L31", d62),
  mk("M09-L32", d63),
];
