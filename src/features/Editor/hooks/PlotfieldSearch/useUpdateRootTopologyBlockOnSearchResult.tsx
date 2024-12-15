import { useEffect } from "react";

type UpdateRootTopologyBlockOnSearchResultTypes = {
  setCurrentTopologyBlockId: ({ _id }: { _id: string }) => void;
  currentTopologyBlockId: string;
};

export default function useUpdateRootTopologyBlockOnSearchResult({
  currentTopologyBlockId,
  setCurrentTopologyBlockId,
}: UpdateRootTopologyBlockOnSearchResultTypes) {
  useEffect(() => {
    const updateCurrentTopologyBlockOnSearchResultTeleport = () => {
      const storedTopologyBlockId = sessionStorage.getItem("altCurrent");
      console.log("storedTopologyBlockId: ", storedTopologyBlockId);
      if (!storedTopologyBlockId?.trim().length) {
        return;
      }
      console.log("As expected");
      if (storedTopologyBlockId !== currentTopologyBlockId) {
        sessionStorage.setItem("altArrowLeft", currentTopologyBlockId);
        setCurrentTopologyBlockId({ _id: storedTopologyBlockId });
      }
    };

    window.addEventListener("storage", updateCurrentTopologyBlockOnSearchResultTeleport);
    return () => {
      window.removeEventListener("storage", updateCurrentTopologyBlockOnSearchResultTeleport);
    };
  }, [currentTopologyBlockId]);
}
