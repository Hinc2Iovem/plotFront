import { useEffect, useRef, useState } from "react";
import PlotfieldButton from "../../../../../../../../ui/Buttons/PlotfieldButton";
import AsideScrollable from "../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollableButton from "../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useConditionBlocks from "../../Context/ConditionContext";
import useUpdateConditionStatus from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionStatus";
import { StatusTypes } from "../../../../../../../../types/StoryData/Status/StatusTypes";
import { AllPossibleStatuses } from "../../../../../../../../const/STATUSES";
import PlotfieldInput from "../../../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import { DebouncedCheckCharacterTypes } from "../../../Choice/ChoiceQuestionField";
import useSearch from "../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

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
  const [status, setStatus] = useState(typeof currentStatus === "string" ? currentStatus : "");
  const [showAllLangauges, setShowAllStatuses] = useState(false);

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const statusModalRef = useRef<HTMLDivElement>(null);

  const updateConditionStatus = useUpdateConditionStatus({ conditionBlockStatusId: conditionBlockVariationId });

  const [showCharacterPromptModal, setShowCharacterPromptModal] = useState(false);
  const [currentConditionName, setCurrentConditionName] = useState("");

  const [characterId, setCharacterId] = useState(currentCharacterId || "");

  const { data: currentCharacter } = useGetCharacterById({ characterId });
  const { data: translatedCharacter } = useGetTranslationCharacterById({ characterId, language: "russian" });

  const [characterImg, setCharacterImg] = useState("");
  const [debouncedCharacter, setDebouncedCharacter] = useState<DebouncedCheckCharacterTypes | null>(null);

  useEffect(() => {
    if (currentCharacter) {
      setCharacterImg(currentCharacter?.img || "");
    }
  }, [currentCharacter, characterId]);

  useEffect(() => {
    if (translatedCharacter) {
      setCurrentConditionName((translatedCharacter?.translations || [])[0].text || "");
    }
  }, [translatedCharacter, characterId]);

  // const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const debouncedConditionName = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  useEffect(() => {
    if (debouncedCharacter) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        characterId: debouncedCharacter.characterName,
        plotfieldCommandId,
        conditionBlockVariationId: conditionBlockVariationId,
      });

      setCurrentConditionName(debouncedCharacter.characterName);
      setCharacterImg(debouncedCharacter?.characterImg || "");
      setCharacterId(debouncedCharacter.characterId);

      updateConditionStatus.mutate({
        characterId: debouncedCharacter.characterId,
      });
    } else {
      console.error("Such character doesn't exist");
    }
  }, [debouncedCharacter]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "Condition - Status",
          id: conditionBlockVariationId,
          text: `${currentConditionName} ${status}`,
          topologyBlockId,
          type: "conditionVariation",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Status",
        id: conditionBlockVariationId,
        value: `${debouncedConditionName} ${status}`,
        type: "conditionVariation",
      });
    }
  }, [status, episodeId, debouncedConditionName]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });

  useOutOfModal({
    modalRef: statusModalRef,
    setShowModal: setShowAllStatuses,
    showModal: showAllLangauges,
  });

  return (
    <div className="relative flex gap-[.5rem] w-full">
      <div className="relative w-full">
        <PlotfieldInput
          type="text"
          placeholder="Персонаж"
          className="border-[3px] border-double border-dark-mid-gray"
          onClick={(e) => {
            setShowCharacterPromptModal((prev) => !prev);
            e.stopPropagation();
          }}
          value={currentConditionName}
          onChange={(e) => {
            if (!showCharacterPromptModal) {
              setShowCharacterPromptModal(true);
            }
            setCurrentConditionName(e.target.value);
          }}
        />
        {characterImg?.trim().length ? (
          <img
            src={characterImg}
            alt="CharacterImg"
            className="w-[3rem] absolute right-[5px] rounded-md top-[0px] translate-y-[3px]"
          />
        ) : null}
        <PlotfieldCharacterPromptMain
          characterValue={currentConditionName}
          setCharacterId={setCharacterId}
          setCharacterName={setCurrentConditionName}
          setShowCharacterModal={setShowCharacterPromptModal}
          showCharacterModal={showCharacterPromptModal}
          translateAsideValue="translate-y-[.5rem]"
          debouncedValue={debouncedConditionName}
          setCharacterImg={setCharacterImg}
          setDebouncedCharacter={setDebouncedCharacter}
          plotfieldCommandIfId=""
          isElse={false}
        />
      </div>

      <div className="relative w-fit">
        <PlotfieldButton
          onClick={(e) => {
            e.stopPropagation();
            setShowAllStatuses((prev) => !prev);
          }}
          type="button"
          className={`bg-primary-darker h-full hover:bg-primary transition-colors text-text-light w-full`}
        >
          {status?.trim().length ? status : "Статус"}
        </PlotfieldButton>

        <AsideScrollable
          ref={statusModalRef}
          className={`${showAllLangauges ? "" : "hidden"} w-fit right-0 translate-y-[.5rem]`}
        >
          {AllPossibleStatuses.map((l) => (
            <AsideScrollableButton
              key={l}
              onClick={() => {
                setStatus(l);
                setShowAllStatuses(false);
                updateConditionBlockVariationValue({
                  conditionBlockId,
                  conditionBlockVariationId,
                  plotfieldCommandId,
                  status: l,
                });

                updateConditionStatus.mutate({ status: l });
              }}
              type="button"
            >
              {l}
            </AsideScrollableButton>
          ))}
        </AsideScrollable>
      </div>
    </div>
  );
}
