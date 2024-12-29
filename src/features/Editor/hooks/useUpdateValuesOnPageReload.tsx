import { useEffect } from "react";
import { TopologyBlockTypes } from "../../../types/TopologyBlock/TopologyBlockTypes";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";

type UpdateValuesOnPageReloadTypes = {
  firstTopologyBlock: TopologyBlockTypes | undefined;
  localTopologyBlockId: string | null;
};

export default function useUpdateValuesOnPageReload({
  firstTopologyBlock,
  localTopologyBlockId,
}: UpdateValuesOnPageReloadTypes) {
  const { setItem } = useTypedSessionStorage<SessionStorageKeys>();
  useEffect(() => {
    const isReload = performance.getEntriesByType("navigation")[0]?.entryType === "reload";

    if (isReload && (firstTopologyBlock || localTopologyBlockId)) {
      setItem(
        "focusedTopologyBlock",
        localTopologyBlockId?.trim().length ? localTopologyBlockId : firstTopologyBlock?._id || ""
      );
      setItem(
        "focusedCommand",
        `none-${localTopologyBlockId?.trim().length ? localTopologyBlockId : firstTopologyBlock?._id}`
      );

      setItem("focusedCommandInsideType", "default?");
      // for search
      setItem("altArrowLeft", "");
      setItem("altArrowRight", "");
      setItem("altCurrent", "");
    }
  }, [firstTopologyBlock, localTopologyBlockId]);
}
