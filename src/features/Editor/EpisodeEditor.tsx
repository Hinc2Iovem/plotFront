import { useState } from "react";
import EditorHeader from "./EditorHeader/EditorHeader";
import EditorMain from "./EditorMain";
import "./Flowchart/FlowchartStyles.css";

export default function EpisodeEditor() {
  const [showHeader, setShowHeader] = useState(false);
  return (
    <section className="p-[1rem] mx-auto max-w-[146rem] flex flex-col gap-[1rem] | containerScroll">
      <EditorHeader setShowHeader={setShowHeader} showHeader={showHeader} />
      <EditorMain setShowHeader={setShowHeader} />
    </section>
  );
}
