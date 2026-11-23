// Vacío a propósito: el workflow lo reemplaza con el de cursos/<slug>/src/lessons/index.ts al renderizar.
import { LessonSpec, Timeline, Words } from "../kit";
import { Cap } from "../course";

export const LESSONS: { id: string; spec: LessonSpec; tl: Timeline; words: Words; caps: Cap[] }[] = [];
