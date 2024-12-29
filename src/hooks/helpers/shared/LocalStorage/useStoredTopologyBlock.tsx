import { useParams } from "react-router-dom";
import { useTypedLocalStorage } from "./useTypedLocalStorage";

export function useGetStoredTopologyBlock() {
  const { episodeId } = useParams();
  const { getItem } = useTypedLocalStorage<Record<string, string>>();
  const localTopologyBlockId = getItem(`${episodeId}-topologyBlockId`);

  return localTopologyBlockId;
}

type SetStoredTopologyBlockTypes = {
  topologyBlockId: string;
};

export function useSetStoredTopologyBlock({ topologyBlockId }: SetStoredTopologyBlockTypes) {
  const { episodeId } = useParams();
  const { setItem } = useTypedLocalStorage<Record<string, string>>();
  setItem(`${episodeId}-topologyBlockId`, topologyBlockId);
}
