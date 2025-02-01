import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCharacterWithTranslation from "../../../../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useCommandIf from "../../../Context/IfContext";
import IfSignField from "../../IfSignField";
import IfVariationCharacterField from "./IfVariationCharacterField";
import IfVariationValueField from "./IfVariationValueField";

type IfVariationCharacterTypes = {
  plotfieldCommandId: string;
  currentCharacterId: string;
  topologyBlockId: string;
  ifCharacterId: string;
};

export default function IfVariationCharacter({
  plotfieldCommandId,
  currentCharacterId,
  topologyBlockId,
  ifCharacterId,
}: IfVariationCharacterTypes) {
  const { episodeId } = useParams();
  const [showCharacterPromptModal, setShowCharacterPromptModal] = useState(false);
  const { getIfVariationById } = useCommandIf();
  const [currentSign, setCurrentSign] = useState<ConditionSignTypes>(
    getIfVariationById({
      plotfieldCommandId,
      ifVariationId: ifCharacterId,
    })?.sign || ("" as ConditionSignTypes)
  );
  const [currentIfValue, setCurrentIfValue] = useState(
    getIfVariationById({
      plotfieldCommandId,
      ifVariationId: ifCharacterId,
    })?.value || null
  );

  const [initialCharacterId, setInitialCharacterId] = useState("");
  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({ currentCharacterId });

  useEffect(() => {
    if (typeof characterValue._id === "string" && characterValue && !initialCharacterId) {
      setInitialCharacterId(characterValue._id);
    }
  }, [characterValue]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "If - Character",
    id: ifCharacterId,
    text: `${characterValue.characterName} ${currentIfValue}`,
    topologyBlockId,
    type: "ifVariation",
  });

  const updateValues = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Character",
        id: ifCharacterId,
        value: `${
          typeof characterValue.characterName === "string" ? characterValue.characterName : ""
        } ${currentSign} ${currentIfValue}`,
        type: "ifVariation",
      });
    }
  };

  useEffect(() => {
    updateValues();
  }, [currentSign, characterValue.characterName]);

  return (
    <div className="w-full flex gap-[10px] flex-col">
      <div className="w-full flex gap-[5px] flex-wrap">
        <IfVariationCharacterField
          setCharacterValue={setCharacterValue}
          characterValue={characterValue}
          ifCharacterId={ifCharacterId}
          plotfieldCommandId={plotfieldCommandId}
        />

        <div className="w-fit">
          <IfSignField
            setCurrentSign={setCurrentSign}
            currentSign={currentSign}
            plotfieldCommandId={plotfieldCommandId}
            ifVariationId={ifCharacterId}
            type="character"
          />
        </div>

        <IfVariationValueField
          plotfieldCommandId={plotfieldCommandId}
          setShowCharacterPromptModal={setShowCharacterPromptModal}
          showCharacterPromptModal={showCharacterPromptModal}
          ifVariationId={ifCharacterId}
          setCurrentIfValue={setCurrentIfValue}
          currentIfValue={currentIfValue}
        />
      </div>
    </div>
  );
}
