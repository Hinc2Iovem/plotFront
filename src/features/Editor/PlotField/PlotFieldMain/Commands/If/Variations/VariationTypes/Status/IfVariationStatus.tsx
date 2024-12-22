import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import { StatusTypes } from "../../../../../../../../../types/StoryData/Status/StatusTypes";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfStatus from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfStatus";
import useGetCharacterWithTranslation from "../../../../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import PlotfieldCharacterPromptMain, {
  ExposedMethods,
} from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import useIfVariations from "../../../Context/IfContext";
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

  const { updateIfVariationValue } = useIfVariations();

  const updateIfStatus = useUpdateIfStatus({ ifStatusId: ifVariationId });

  const [showCharacterPromptModal, setShowCharacterPromptModal] = useState(false);

  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({
    currentCharacterId: typeof currentCharacterId === "string" ? currentCharacterId : "",
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<ExposedMethods>(null);

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateCharacterNameOnBlur();
    }
  };

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

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });

  return (
    <div className="relative flex gap-[.5rem] w-full">
      <div className="relative w-full">
        <PlotfieldInput
          type="text"
          placeholder="Персонаж"
          className="border-[3px] border-double border-dark-mid-gray"
          onBlur={onBlur}
          onClick={(e) => {
            setShowCharacterPromptModal((prev) => !prev);
            e.stopPropagation();
          }}
          value={characterValue.characterName || ""}
          onChange={(e) => {
            if (!showCharacterPromptModal) {
              setShowCharacterPromptModal(true);
            }
            setCharacterValue((prev) => ({
              ...prev,
              characterName: e.target.value,
            }));
            updateValues(typeof characterValue.characterName === "string" ? characterValue.characterName : "", status);
          }}
        />
        {characterValue.imgUrl?.trim().length ? (
          <img
            src={characterValue.imgUrl}
            alt="CharacterImg"
            className="w-[3rem] absolute right-[5px] rounded-md top-[0px] translate-y-[3px]"
          />
        ) : null}
        <PlotfieldCharacterPromptMain
          setShowCharacterModal={setShowCharacterPromptModal}
          showCharacterModal={showCharacterPromptModal}
          translateAsideValue="translate-y-[.5rem]"
          characterName={characterValue.characterName || ""}
          currentCharacterId={characterValue._id || ""}
          setCharacterValue={setCharacterValue}
          ref={inputRef}
        />
      </div>

      <IfVariationStatusModal
        ifVariationId={ifVariationId}
        plotfieldCommandId={plotfieldCommandId}
        setStatus={setStatus}
        status={status}
      />
    </div>
  );
}
