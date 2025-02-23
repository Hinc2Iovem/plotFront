import { useParams } from "react-router-dom";
import useInitializeCurrentlyFocusedCommandOnReload from "../../hooks/helpers/Plotfield/useInitializeCurrentlyFocusedCommandOnReload";
import { useGetStoredTopologyBlock } from "../../hooks/helpers/shared/LocalStorage/useStoredTopologyBlock";
import useNavigation from "./Context/Navigation/NavigationContext";
import EditorMain from "./EditorMain";
import useGetFirstTopologyBlock from "./PlotField/hooks/TopologyBlock/useGetFirstTopologyBlock";
import usePopulateSearch from "./hooks/PlotfieldSearch/helpers/usePopulateSearch";
import useUpdateRootTopologyBlockOnSearchResult from "./hooks/PlotfieldSearch/useUpdateRootTopologyBlockOnSearchResult";
import useUpdateValuesOnPageEnter from "./hooks/useUpdateValuesOnPageEnter";
import "./Flowchart/FlowchartStyles.css";

export default function EpisodeEditor() {
  const { episodeId } = useParams();
  const currentTopologyBlock = useNavigation((state) => state.currentTopologyBlock);
  const setCurrentTopologyBlock = useNavigation((state) => state.setCurrentTopologyBlock);

  const { data: firstTopologyBlock } = useGetFirstTopologyBlock({
    episodeId: episodeId || "",
  });

  const localTopologyBlockId = useGetStoredTopologyBlock();

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
    <section className="mx-auto flex flex-col gap-[10px] | containerScroll">
      {/* <EditorHeader setShowHeader={setShowHeader} showHeader={showHeader} /> */}
      {currentTopologyBlock._id?.trim().length ? <EditorMain /> : null}
    </section>
  );
}
