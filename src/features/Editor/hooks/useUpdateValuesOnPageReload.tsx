import { useEffect } from "react";
import { TopologyBlockTypes } from "../../../types/TopologyBlock/TopologyBlockTypes";

type UpdateValuesOnPageReloadTypes = {
  firstTopologyBlock: TopologyBlockTypes | undefined;
  localTopologyBlockId: string | null;
};

export default function useUpdateValuesOnPageReload({
  firstTopologyBlock,
  localTopologyBlockId,
}: UpdateValuesOnPageReloadTypes) {
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
      // for search
      sessionStorage.setItem("altArrowLeft", "");
      sessionStorage.setItem("altArrowRight", "");
      sessionStorage.setItem("altCurrent", "");
    }
  }, [firstTopologyBlock, localTopologyBlockId]);
}
