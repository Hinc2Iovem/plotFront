import { useState } from "react";
import { useParams } from "react-router-dom";
import EditorHeader from "./EditorHeader/EditorHeader";
import useUpdateRootTopologyBlockOnSearchResult from "./EditorHooks/PlotfieldSearch/useUpdateRootTopologyBlockOnSearchResult";
import useUpdateValuesOnPageEnter from "./EditorHooks/useUpdateValuesOnPageEnter";
import useUpdateValuesOnPageReload from "./EditorHooks/useUpdateValuesOnPageReload";
import EditorMain from "./EditorMain";
import "./Flowchart/FlowchartStyles.css";
import useGetFirstTopologyBlock from "./PlotField/hooks/TopologyBlock/useGetFirstTopologyBlock";
import useGetSearchDataByEpisodeId from "./EditorHooks/PlotfieldSearch/useGetSearchDataByEpisodeId";

export default function EpisodeEditor() {
  const [showHeader, setShowHeader] = useState(false);
  const { episodeId } = useParams();

  const { data: firstTopologyBlock } = useGetFirstTopologyBlock({
    episodeId: episodeId || "",
  });

  const [localTopologyBlockId] = useState(localStorage.getItem(`${episodeId}-topologyBlockId`));

  const [currentTopologyBlockId, setCurrentTopologyBlockId] = useState(firstTopologyBlock?._id || "");

  useUpdateValuesOnPageEnter({ firstTopologyBlock, localTopologyBlockId, setCurrentTopologyBlockId });
  useUpdateValuesOnPageReload({ firstTopologyBlock, localTopologyBlockId });

  useGetSearchDataByEpisodeId({ currentTopologyBlockId, episodeId: episodeId || "", language: "russian" });
  useUpdateRootTopologyBlockOnSearchResult({ currentTopologyBlockId, setCurrentTopologyBlockId });
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
