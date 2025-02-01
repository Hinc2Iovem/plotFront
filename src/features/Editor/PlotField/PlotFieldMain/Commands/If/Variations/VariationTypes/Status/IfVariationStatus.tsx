import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StatusTypes } from "../../../../../../../../../types/StoryData/Status/StatusTypes";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfStatus from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfStatus";
import useGetCharacterWithTranslation from "../../../../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useCommandIf from "../../../Context/IfContext";
import IfVariationStatusCharacterField from "./IfVariationStatusCharacterField";
import IfVariationStatusModal from "./IfVariationStatusModal";

type IfVariationStatusTypes = {
  ifVariationId: string;
  plotfieldCommandId: string;
  topologyBlockId: string;
  currentCharacterId: string | null;
  currentStatus: StatusTypes | null;
};

export default function IfVariationStatus({
  currentStatus,
  ifVariationId,
  plotfieldCommandId,
  currentCharacterId,
  topologyBlockId,
}: IfVariationStatusTypes) {
  const { episodeId } = useParams();
  const [status, setStatus] = useState<StatusTypes>(
    typeof currentStatus === "string" ? currentStatus : ("" as StatusTypes)
  );

  const { updateIfVariationValue } = useCommandIf();

  const updateIfStatus = useUpdateIfStatus({ ifStatusId: ifVariationId });

  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({
    currentCharacterId: typeof currentCharacterId === "string" ? currentCharacterId : "",
  });

  useEffect(() => {
    if (characterValue) {
      updateIfVariationValue({
        characterId: characterValue.characterName || "",
        plotfieldCommandId,
        ifVariationId: ifVariationId,
      });

      updateIfStatus.mutate({
        characterId: characterValue._id || "",
      });
    } else {
      console.error("Such character doesn't exist");
    }
  }, [characterValue]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "If - Status",
    id: ifVariationId,
    text: `${typeof characterValue.characterName === "string" ? characterValue.characterName : ""} ${status}`,
    topologyBlockId,
    type: "ifVariation",
  });

  const updateValues = (characterName: string, status: StatusTypes) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Status",
        id: ifVariationId,
        value: `${characterName} ${status}`,
        type: "ifVariation",
      });
    }
  };

  useEffect(() => {
    if (status) {
      updateValues(characterValue.characterName || "", status);
    }
  }, [status]);

  return (
    <div className="relative flex gap-[5px] w-full">
      <IfVariationStatusCharacterField
        characterValue={characterValue}
        ifVariationId={ifVariationId}
        plotfieldCommandId={plotfieldCommandId}
        setCharacterValue={setCharacterValue}
      />

      <IfVariationStatusModal
        ifVariationId={ifVariationId}
        plotfieldCommandId={plotfieldCommandId}
        setStatus={setStatus}
        status={status}
      />
    </div>
  );
}
