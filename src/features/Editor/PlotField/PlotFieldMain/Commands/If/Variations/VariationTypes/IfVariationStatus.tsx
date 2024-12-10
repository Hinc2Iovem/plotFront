import { useEffect, useRef, useState } from "react";
import PlotfieldButton from "../../../../../../../shared/Buttons/PlotfieldButton";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useIfVariations from "../../Context/IfContext";
import { StatusTypes } from "../../../../../../../../types/StoryData/Status/StatusTypes";
import { AllPossibleStatuses } from "../../../../../../../../const/STATUSES";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import { DebouncedCheckCharacterTypes } from "../../../Choice/ChoiceQuestionField";
import useSearch from "../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";
import useUpdateIfStatus from "../../../../../hooks/If/BlockVariations/patch/useUpdateIfStatus";

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
  const [status, setStatus] = useState(typeof currentStatus === "string" ? currentStatus : "");
  const [showAllLangauges, setShowAllStatuses] = useState(false);

  const { updateIfVariationValue } = useIfVariations();

  const statusModalRef = useRef<HTMLDivElement>(null);

  const updateIfStatus = useUpdateIfStatus({ ifStatusId: ifVariationId });

  const [showCharacterPromptModal, setShowCharacterPromptModal] = useState(false);
  const [currentIfName, setCurrentIfName] = useState("");

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
      setCurrentIfName((translatedCharacter?.translations || [])[0].text || "");
    }
  }, [translatedCharacter, characterId]);

  // const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const debouncedIfName = useDebounce({
    delay: 700,
    value: currentIfName,
  });

  useEffect(() => {
    if (debouncedCharacter) {
      updateIfVariationValue({
        characterId: debouncedCharacter.characterName,
        plotfieldCommandId,
        ifVariationId: ifVariationId,
      });

      setCurrentIfName(debouncedCharacter.characterName);
      setCharacterImg(debouncedCharacter?.characterImg || "");
      setCharacterId(debouncedCharacter.characterId);

      updateIfStatus.mutate({
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
          commandName: "If - Status",
          id: ifVariationId,
          text: `${currentIfName} ${status}`,
          topologyBlockId,
          type: "ifVariation",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Status",
        id: ifVariationId,
        value: `${debouncedIfName} ${status}`,
        type: "ifVariation",
      });
    }
  }, [status, episodeId, debouncedIfName]);

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
          value={currentIfName}
          onChange={(e) => {
            if (!showCharacterPromptModal) {
              setShowCharacterPromptModal(true);
            }
            setCurrentIfName(e.target.value);
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
          characterValue={currentIfName}
          setCharacterId={setCharacterId}
          setCharacterName={setCurrentIfName}
          setShowCharacterModal={setShowCharacterPromptModal}
          showCharacterModal={showCharacterPromptModal}
          translateAsideValue="translate-y-[.5rem]"
          debouncedValue={debouncedIfName}
          setCharacterImg={setCharacterImg}
          setDebouncedCharacter={setDebouncedCharacter}
          commandIfId=""
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
          className={`bg-secondary h-full hover:bg-primary transition-colors text-text-light w-full`}
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
                updateIfVariationValue({
                  ifVariationId,
                  plotfieldCommandId,
                  status: l,
                });

                updateIfStatus.mutate({ status: l });
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
