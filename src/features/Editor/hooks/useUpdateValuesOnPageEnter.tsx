import { useEffect } from "react";
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
  useEffect(() => {
    if (localTopologyBlockId || firstTopologyBlock) {
      const currentTopologyBlockId = sessionStorage.getItem("focusedTopologyBlock");
      if (!currentTopologyBlockId?.trim().length) {
        sessionStorage.setItem(
          `focusedTopologyBlock`,
          localTopologyBlockId ? localTopologyBlockId : firstTopologyBlock?._id || ""
        );

        // for search
        sessionStorage.setItem("altArrowLeft", "");
        sessionStorage.setItem("altArrowRight", "");
        sessionStorage.setItem("altCurrent", "");

        // focus
        sessionStorage.setItem(`focusedCommand`, ``);
        sessionStorage.setItem("focusedCommandInsideType", `default?`);
        sessionStorage.setItem(`focusedCommandType`, ``);
        sessionStorage.setItem(`focusedCommandParentId`, ``);
      }

      setCurrentTopologyBlockId(
        localTopologyBlockId ? { _id: localTopologyBlockId } : { _id: firstTopologyBlock?._id || "" }
      );
    }
  }, [firstTopologyBlock, localTopologyBlockId]);
}
