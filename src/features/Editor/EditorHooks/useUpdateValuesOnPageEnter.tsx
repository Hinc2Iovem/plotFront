import { useEffect } from "react";
import usePlotfieldCommands from "../PlotField/Context/PlotFieldContext";
import { useParams } from "react-router-dom";
import { TopologyBlockTypes } from "../../../types/TopologyBlock/TopologyBlockTypes";

type UpdateValuesOnPageEnterTypes = {
  firstTopologyBlock: TopologyBlockTypes | undefined;
  localTopologyBlockId: string | null;
  setCurrentTopologyBlockId: React.Dispatch<React.SetStateAction<string>>;
};

export default function useUpdateValuesOnPageEnter({
  firstTopologyBlock,
  localTopologyBlockId,
  setCurrentTopologyBlockId,
}: UpdateValuesOnPageEnterTypes) {
  const { episodeId } = useParams();
  const { updateFocuseReset } = usePlotfieldCommands();

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
        sessionStorage.setItem("focusedChoiceOption", "none");
        sessionStorage.setItem("focusedCommandInsideType", `default?`);
        // for search
        sessionStorage.setItem("altArrowLeft", "");
        sessionStorage.setItem("altArrowRight", "");
        sessionStorage.setItem("altCurrent", "");
        updateFocuseReset({ value: false });
      }

      setCurrentTopologyBlockId(localTopologyBlockId ? localTopologyBlockId : firstTopologyBlock?._id || "");
    }
  }, [firstTopologyBlock, localTopologyBlockId, updateFocuseReset, episodeId]);
}
