import { useEffect, useState } from "react";
import EditorHeader from "./EditorHeader/EditorHeader";
import EditorMain from "./EditorMain";
import "./Flowchart/FlowchartStyles.css";
import { useParams } from "react-router-dom";
import useGetFirstTopologyBlock from "./PlotField/PlotFieldMain/Commands/hooks/TopologyBlock/useGetFirstTopologyBlock";

export default function EpisodeEditor() {
  const [showHeader, setShowHeader] = useState(false);
  const { episodeId } = useParams();

  const { data: firstTopologyBlock } = useGetFirstTopologyBlock({
    episodeId: episodeId || "",
  });

  const [localTopologyBlockId] = useState(
    localStorage.getItem(`${episodeId}-topologyBlockId`)
  );

  const [currentTopologyBlockId, setCurrentTopologyBlockId] = useState(
    firstTopologyBlock?._id || ""
  );

  useEffect(() => {
    if (localTopologyBlockId) {
      setCurrentTopologyBlockId(localTopologyBlockId);
    } else if (firstTopologyBlock) {
      setCurrentTopologyBlockId(firstTopologyBlock._id);
    }
  }, [firstTopologyBlock, localTopologyBlockId]);

  return (
    <section className="p-[1rem] mx-auto max-w-[146rem] flex flex-col gap-[1rem] | containerScroll">
      <EditorHeader setShowHeader={setShowHeader} showHeader={showHeader} />
      {currentTopologyBlockId ? (
        <EditorMain
          setShowHeader={setShowHeader}
          currentTopologyBlockId={currentTopologyBlockId}
          setCurrentTopologyBlockId={setCurrentTopologyBlockId}
        />
      ) : null}
    </section>
  );
}
