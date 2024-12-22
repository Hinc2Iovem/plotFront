import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StatusTypes } from "../../../../../../../../../types/StoryData/Status/StatusTypes";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCharacterWithTranslation from "../../../../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import ConditionVariationStatusCharacterField from "./ConditionVariationStatusCharacterField";
import StatusModal from "./StatusModal";

type ConditionBlockVariationStatusTypes = {
  conditionBlockId: string;
  conditionBlockVariationId: string;
  plotfieldCommandId: string;
  topologyBlockId: string;
  currentCharacterId: string | null;
  currentStatus: StatusTypes | null;
};

export default function ConditionBlockVariationStatus({
  currentStatus,
  conditionBlockId,
  conditionBlockVariationId,
  plotfieldCommandId,
  currentCharacterId,
  topologyBlockId,
}: ConditionBlockVariationStatusTypes) {
  const { episodeId } = useParams();

  const [status, setStatus] = useState<StatusTypes>(
    typeof currentStatus === "string" ? currentStatus : ("" as StatusTypes)
  );
  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({
    currentCharacterId: typeof currentCharacterId === "string" ? currentCharacterId : "",
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "Condition - Status",
    id: conditionBlockVariationId,
    text: `${typeof characterValue.characterName === "string" ? characterValue.characterName : ""} ${status}`,
    topologyBlockId,
    type: "conditionVariation",
  });

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Status",
        id: conditionBlockVariationId,
        value: `${typeof characterValue.characterName === "string" ? characterValue.characterName : ""} ${status}`,
        type: "conditionVariation",
      });
    }
  }, [status, episodeId, characterValue]);

  return (
    <div className="relative flex gap-[.5rem] w-full">
      <ConditionVariationStatusCharacterField
        characterValue={characterValue}
        conditionBlockId={conditionBlockId}
        conditionBlockVariationId={conditionBlockVariationId}
        plotfieldCommandId={plotfieldCommandId}
        setCharacterValue={setCharacterValue}
      />

      <StatusModal
        conditionBlockId={conditionBlockId}
        conditionBlockVariationId={conditionBlockVariationId}
        plotfieldCommandId={plotfieldCommandId}
        setStatus={setStatus}
        status={status}
      />
    </div>
  );
}
