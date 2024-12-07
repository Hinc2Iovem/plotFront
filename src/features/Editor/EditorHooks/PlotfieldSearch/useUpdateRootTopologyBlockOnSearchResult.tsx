import { useEffect } from "react";

type UpdateRootTopologyBlockOnSearchResultTypes = {
  setCurrentTopologyBlockId: React.Dispatch<React.SetStateAction<string>>;
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
        setCurrentTopologyBlockId(storedTopologyBlockId);
      }
    };

    window.addEventListener("storage", updateCurrentTopologyBlockOnSearchResultTeleport);
    return () => {
      window.removeEventListener("storage", updateCurrentTopologyBlockOnSearchResultTeleport);
    };
  }, [currentTopologyBlockId]);
}
