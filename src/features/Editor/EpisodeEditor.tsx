import { useEffect, useState } from "react";
import EditorHeader from "./EditorHeader/EditorHeader";
import EditorMain from "./EditorMain";
import "./Flowchart/FlowchartStyles.css";
import { useParams } from "react-router-dom";
import useGetFirstTopologyBlock from "./PlotField/hooks/TopologyBlock/useGetFirstTopologyBlock";
import usePlotfieldCommands from "./PlotField/Context/PlotFieldContext";

export default function EpisodeEditor() {
  const [showHeader, setShowHeader] = useState(false);
  const { episodeId } = useParams();

  const { data: firstTopologyBlock } = useGetFirstTopologyBlock({
    episodeId: episodeId || "",
  });

  const { updateFocuseReset } = usePlotfieldCommands();

  const [localTopologyBlockId] = useState(localStorage.getItem(`${episodeId}-topologyBlockId`));

  const [currentTopologyBlockId, setCurrentTopologyBlockId] = useState(firstTopologyBlock?._id || "");

  useEffect(() => {
    if (localTopologyBlockId || firstTopologyBlock) {
      const currentTopologyBlockId = sessionStorage.getItem("focusedTopologyBlock");
      const currentEpisodeId = sessionStorage.getItem("episode");
      if (!currentTopologyBlockId?.trim().length || currentEpisodeId !== episodeId) {
        sessionStorage.setItem(
          `focusedTopologyBlock`,
          localTopologyBlockId ? localTopologyBlockId : firstTopologyBlock?._id || ""
        );
        sessionStorage.setItem("episode", `${episodeId}`);
        sessionStorage.setItem(
          `focusedCommand`,
          `none-${localTopologyBlockId ? localTopologyBlockId : firstTopologyBlock?._id || ""}`
        );
        sessionStorage.setItem("focusedCommandIf", `none`);
        sessionStorage.setItem("focusedCommandCondition", `none`);
        sessionStorage.setItem("focusedCommandChoice", `none`);
        sessionStorage.setItem("focusedConditionBlock", `none`);
        sessionStorage.setItem("focusedChoiceOption", `none`);
        sessionStorage.setItem("focusedCommandInsideType", `default?`);
        updateFocuseReset({ value: false });
      }

      setCurrentTopologyBlockId(localTopologyBlockId ? localTopologyBlockId : firstTopologyBlock?._id || "");
    }
  }, [firstTopologyBlock, localTopologyBlockId, updateFocuseReset, episodeId]);

  useEffect(() => {
    const isReload = performance.getEntriesByType("navigation")[0]?.entryType === "reload";

    if (isReload && (firstTopologyBlock || localTopologyBlockId)) {
      sessionStorage.setItem(
        "focusedTopologyBlock",
        localTopologyBlockId?.trim().length ? localTopologyBlockId : firstTopologyBlock?._id || ""
      );
      sessionStorage.setItem(
        "focusedCommand",
        `none-${localTopologyBlockId?.trim().length ? localTopologyBlockId : firstTopologyBlock?._id}`
      );
      sessionStorage.setItem("focusedCommandIf", "none");
      sessionStorage.setItem("focusedCommandCondition", "none");
      sessionStorage.setItem("focusedCommandChoice", "none");
      sessionStorage.setItem("focusedConditionBlock", "none");
      sessionStorage.setItem("focusedChoiceOption", "none");
      sessionStorage.setItem("focusedCommandInsideType", "default?");
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
