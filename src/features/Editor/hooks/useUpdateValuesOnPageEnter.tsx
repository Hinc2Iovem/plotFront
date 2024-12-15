import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TopologyBlockTypes } from "../../../types/TopologyBlock/TopologyBlockTypes";

type UpdateValuesOnPageEnterTypes = {
  firstTopologyBlock: TopologyBlockTypes | undefined;
  localTopologyBlockId: string | null;
  setCurrentTopologyBlockId: ({ _id }: { _id: string }) => void;
};

export default function useUpdateValuesOnPageEnter({
  firstTopologyBlock,
  localTopologyBlockId,
  setCurrentTopologyBlockId,
}: UpdateValuesOnPageEnterTypes) {
  const { episodeId } = useParams();

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
        ({ value: false });
      }

      setCurrentTopologyBlockId(
        localTopologyBlockId ? { _id: localTopologyBlockId } : { _id: firstTopologyBlock?._id || "" }
      );
    }
  }, [firstTopologyBlock, localTopologyBlockId, episodeId]);
}
