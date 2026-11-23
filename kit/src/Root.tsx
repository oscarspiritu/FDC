import React from "react";
import { Composition } from "remotion";
import { LessonVideo, resolveLesson } from "./kit";
import { LESSONS } from "./lessons/index";

// Cada curso aporta su propio src/lessons/index.ts (ver cursos/<slug>/). Aquí solo se registran sus lecciones.
export const RemotionRoot: React.FC = () => (
  <>
    {LESSONS.map((l) => {
      const Comp: React.FC = () => <LessonVideo spec={resolveLesson(l.spec, l.tl, l.words)} tl={l.tl} caps={l.caps} />;
      return <Composition key={l.id} id={l.id} component={Comp} durationInFrames={Math.round(l.tl.total * 30)} fps={30} width={1920} height={1080} />;
    })}
  </>
);
