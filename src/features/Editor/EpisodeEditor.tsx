import { useState } from "react";
import { useParams } from "react-router-dom";
import useInitializeCurrentlyFocusedCommandOnReload from "../../hooks/helpers/Plotfield/useInitializeCurrentlyFocusedCommandOnReload";
import useNavigation from "./Context/Navigation/NavigationContext";
import EditorHeader from "./EditorHeader/EditorHeader";
import EditorMain from "./EditorMain";
import "./Flowchart/FlowchartStyles.css";
import useGetFirstTopologyBlock from "./PlotField/hooks/TopologyBlock/useGetFirstTopologyBlock";
import useUpdateRootTopologyBlockOnSearchResult from "./hooks/PlotfieldSearch/useUpdateRootTopologyBlockOnSearchResult";
import useUpdateValuesOnPageEnter from "./hooks/useUpdateValuesOnPageEnter";
import usePopulateSearch from "./hooks/PlotfieldSearch/helpers/usePopulateSearch";

export default function EpisodeEditor() {
  const { episodeId } = useParams();
  const { currentTopologyBlock, setCurrentTopologyBlock } = useNavigation();

  const [showHeader, setShowHeader] = useState(false);

  const { data: firstTopologyBlock } = useGetFirstTopologyBlock({
    episodeId: episodeId || "",
  });

  const [localTopologyBlockId] = useState(localStorage.getItem(`${episodeId}-topologyBlockId`));

  useUpdateValuesOnPageEnter({
    firstTopologyBlock,
    localTopologyBlockId,
    setCurrentTopologyBlockId: setCurrentTopologyBlock,
  });

  useUpdateRootTopologyBlockOnSearchResult({
    currentTopologyBlockId: currentTopologyBlock._id,
    setCurrentTopologyBlockId: setCurrentTopologyBlock,
  });

  usePopulateSearch({ currentTopologyBlockId: currentTopologyBlock._id });
  useInitializeCurrentlyFocusedCommandOnReload();
  return (
    <section className="p-[1rem] mx-auto max-w-[146rem] flex flex-col gap-[1rem] | containerScroll">
      <EditorHeader setShowHeader={setShowHeader} showHeader={showHeader} />
      {currentTopologyBlock._id?.trim().length ? <EditorMain setShowHeader={setShowHeader} /> : null}
    </section>
  );
}
