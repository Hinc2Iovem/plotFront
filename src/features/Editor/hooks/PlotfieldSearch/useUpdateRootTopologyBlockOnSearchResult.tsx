import { useEffect } from "react";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";

type UpdateRootTopologyBlockOnSearchResultTypes = {
  setCurrentTopologyBlockId: ({ _id }: { _id: string }) => void;
  currentTopologyBlockId: string;
};

export default function useUpdateRootTopologyBlockOnSearchResult({
  currentTopologyBlockId,
  setCurrentTopologyBlockId,
}: UpdateRootTopologyBlockOnSearchResultTypes) {
  const { setItem, getItem } = useTypedSessionStorage<SessionStorageKeys>();

  useEffect(() => {
    const updateCurrentTopologyBlockOnSearchResultTeleport = () => {
      const storedTopologyBlockId = getItem("altCurrent");
      console.log("storedTopologyBlockId: ", storedTopologyBlockId);
      if (!storedTopologyBlockId?.trim().length) {
        return;
      }
      console.log("As expected");
      if (storedTopologyBlockId !== currentTopologyBlockId) {
        setItem("altArrowLeft", currentTopologyBlockId);
        setCurrentTopologyBlockId({ _id: storedTopologyBlockId });
      }
    };

    window.addEventListener("storage", updateCurrentTopologyBlockOnSearchResultTeleport);
    return () => {
      window.removeEventListener("storage", updateCurrentTopologyBlockOnSearchResultTeleport);
    };
  }, [currentTopologyBlockId]);
}
