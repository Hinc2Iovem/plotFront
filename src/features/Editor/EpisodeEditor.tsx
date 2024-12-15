import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditorHeader from "./EditorHeader/EditorHeader";
import useUpdateRootTopologyBlockOnSearchResult from "./hooks/PlotfieldSearch/useUpdateRootTopologyBlockOnSearchResult";
import useUpdateValuesOnPageEnter from "./hooks/useUpdateValuesOnPageEnter";
import useUpdateValuesOnPageReload from "./hooks/useUpdateValuesOnPageReload";
import EditorMain from "./EditorMain";
import useGetFirstTopologyBlock from "./PlotField/hooks/TopologyBlock/useGetFirstTopologyBlock";
import useGetDataForPlotfieldSearch from "./hooks/PlotfieldSearch/useGetDataForPlotfieldSearch";
import useSearch from "./Context/Search/SearchContext";
import useNavigation from "./Context/Navigation/NavigationContext";
import "./Flowchart/FlowchartStyles.css";

export default function EpisodeEditor() {
  const { episodeId } = useParams();
  const { addItem } = useSearch();
  const { currentTopologyBlock, setCurrentTopologyBlock } = useNavigation();

  // basically when user uses plotfieldSearch and gets teleported to another block useEffect below triggers addItem and ui experiences strange behavior because of array's values update
  const [showHeader, setShowHeader] = useState(false);

  const { data: firstTopologyBlock } = useGetFirstTopologyBlock({
    episodeId: episodeId || "",
  });

  const [localTopologyBlockId] = useState(localStorage.getItem(`${episodeId}-topologyBlockId`));

  const { data } = useGetDataForPlotfieldSearch({
    episodeId: episodeId || "",
    currentLanguage: "russian",
    topologyBlockId: currentTopologyBlock._id,
  });

  useEffect(() => {
    if (data) {
      const episodeId = data.episodeId;
      for (const r of data.results) {
        addItem({ episodeId, item: r });
      }
    }
  }, [data]);

  useUpdateValuesOnPageEnter({
    firstTopologyBlock,
    localTopologyBlockId,
    setCurrentTopologyBlockId: setCurrentTopologyBlock,
  });
  useUpdateValuesOnPageReload({ firstTopologyBlock, localTopologyBlockId });

  useUpdateRootTopologyBlockOnSearchResult({
    currentTopologyBlockId: currentTopologyBlock._id,
    setCurrentTopologyBlockId: setCurrentTopologyBlock,
  });
  return (
    <section className="p-[1rem] mx-auto max-w-[146rem] flex flex-col gap-[1rem] | containerScroll">
      <EditorHeader setShowHeader={setShowHeader} showHeader={showHeader} />
      {currentTopologyBlock._id?.trim().length ? <EditorMain setShowHeader={setShowHeader} /> : null}
    </section>
  );
}
