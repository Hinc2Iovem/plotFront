import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useSearch, { AllPossibleSearchTypes } from "../../../Context/Search/SearchContext";

type AddItemInsideSearchTypes = {
  id: string;
  text: string;
  commandName: string;
  topologyBlockId: string;
  type: AllPossibleSearchTypes;
};

export default function useAddItemInsideSearch({
  commandName,
  id,
  text,
  topologyBlockId,
  type,
}: AddItemInsideSearchTypes) {
  const { episodeId } = useParams();
  const { addItem } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName,
          id,
          text,
          topologyBlockId,
          type,
        },
      });
    }
  }, [episodeId, addItem, commandName, id, text, type, topologyBlockId]);
}
