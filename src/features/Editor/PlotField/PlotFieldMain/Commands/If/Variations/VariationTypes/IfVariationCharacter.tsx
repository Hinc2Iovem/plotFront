import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import { DebouncedCheckCharacterTypes } from "../../../Choice/ChoiceQuestionField";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import useIfVariations from "../../Context/IfContext";
import IfSignField from "../IfSignField";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import IfFieldName from "./shared/IfFieldName";
import useSearch from "../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";
import useUpdateIfCharacter from "../../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacter";

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
  const { getIfVariationById, updateIfVariationValue } = useIfVariations();

  const [currentIfName, setCurrentIfName] = useState("");
  const [currentIfValue, setCurrentIfValue] = useState(
    getIfVariationById({
      plotfieldCommandId,
      ifVariationId: ifCharacterId,
    })?.value || null
  );

  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const [characterId, setCharacterId] = useState(currentCharacterId || "");

  const { data: currentCharacter } = useGetCharacterById({ characterId });
  const { data: translatedCharacter } = useGetTranslationCharacterById({ characterId, language: "russian" });

  const [characterImg, setCharacterImg] = useState("");
  const [debouncedCharacter, setDebouncedCharacter] = useState<DebouncedCheckCharacterTypes | null>(null);

  useEffect(() => {
    if (currentCharacter && characterImg !== currentCharacter.img) {
      setCharacterImg(currentCharacter?.img || "");
    }
  }, [currentCharacter, characterId]);

  useEffect(() => {
    if (translatedCharacter && currentIfName !== (translatedCharacter?.translations || [])[0]?.text) {
      setCurrentIfName((translatedCharacter?.translations || [])[0].text || "");
    }
  }, [translatedCharacter, characterId]);

  // const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const updateIf = useUpdateIfCharacter({
    ifCharacterId,
  });

  const debouncedIfName = useDebounce({
    delay: 700,
    value: currentIfName,
  });

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "If - Character",
          id: ifCharacterId,
          text: `${debouncedIfName} ${currentIfValue}`,
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
        commandName: "If - Character",
        id: ifCharacterId,
        value: `${debouncedIfName} ${currentIfValue}`,
        type: "ifVariation",
      });
    }
  }, [debouncedIfName, episodeId, currentIfValue]);

  useEffect(() => {
    if (debouncedCharacter) {
      updateIfVariationValue({
        characterId: debouncedCharacter.characterName,
        plotfieldCommandId,
        ifVariationId: ifCharacterId,
      });

      setCurrentIfName(debouncedCharacter.characterName);
      setCharacterImg(debouncedCharacter?.characterImg || "");
      setCharacterId(debouncedCharacter.characterId);

      updateIf.mutate({
        characterId: debouncedCharacter.characterId,
      });
    } else {
      console.error("Such character doesn't exist");
    }
  }, [debouncedCharacter]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });

  return (
    <div className="w-full flex gap-[1rem] flex-col">
      <div className="w-full flex gap-[.5rem]">
        <div className="flex-grow min-w-[10rem] relative">
          <PlotfieldInput
            type="text"
            focusedSecondTime={focusedSecondTime}
            onBlur={() => {
              setFocusedSecondTime(false);
            }}
            setFocusedSecondTime={setFocusedSecondTime}
            placeholder="Персонаж"
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
            className={`border-[3px] border-double border-dark-mid-gray `}
          />
          {characterImg ? (
            <img src={characterImg} alt="CharacterImg" className="w-[3rem] absolute right-[3px] rounded-md top-[3px]" />
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

        <div className="w-[7rem]">
          <IfSignField plotfieldCommandId={plotfieldCommandId} ifVariationId={ifCharacterId} type="character" />
        </div>

        <IfValueField
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

type IfValueFieldTypes = {
  plotfieldCommandId: string;
  setShowCharacterPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentIfValue: React.Dispatch<React.SetStateAction<number | null>>;
  currentIfValue: number | null;
  showCharacterPromptModal: boolean;
  ifVariationId: string;
};

function IfValueField({
  plotfieldCommandId,
  showCharacterPromptModal,
  ifVariationId,
  currentIfValue,
  setCurrentIfValue,
  setShowCharacterPromptModal,
}: IfValueFieldTypes) {
  const { updateIfVariationValue } = useIfVariations();
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateIf = useUpdateIfCharacter({
    ifCharacterId: ifVariationId,
  });

  return (
    <div className="min-w-[10rem] flex-grow relative">
      <PlotfieldInput
        type="text"
        focusedSecondTime={focusedSecondTime}
        onBlur={() => {
          setFocusedSecondTime(false);
          setCurrentlyActive(false);
        }}
        onClick={() => {
          setCurrentlyActive(true);
        }}
        setFocusedSecondTime={setFocusedSecondTime}
        placeholder="Значение"
        value={currentIfValue || ""}
        onChange={(e) => {
          if (showCharacterPromptModal) {
            setShowCharacterPromptModal(false);
          }
          setCurrentlyActive(true);
          updateIf.mutate({ value: +e.target.value });
          setCurrentIfValue(+e.target.value);

          updateIfVariationValue({
            plotfieldCommandId,
            ifVariationId,
            ifValue: +e.target.value,
          });
        }}
        className={`text-[1.5rem] border-[3px] border-double border-dark-mid-gray `}
      />
      <IfFieldName currentlyActive={currentlyActive} text="Персонаж" />
    </div>
  );
}
