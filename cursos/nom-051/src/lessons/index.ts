// Se llena al terminar los guiones aprobados (specs de escenas + timelines). Misma forma que el kit base.
import { LessonSpec, Timeline, Words } from "../kit";
import { Cap } from "../course";

export const LESSONS: { id: string; spec: LessonSpec; tl: Timeline; words: Words; caps: Cap[] }[] = [];
