import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharactersByStoryId from "../../../../../../../hooks/Fetching/Character/useGetAllCharactersByStoryId";
import useGetTranslationCharacters from "../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import usePlotfieldCommands from "../../../../Context/PlotFieldContext";
import {
  CharacterValueTypes,
  EmotionTypes,
} from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import PlotfieldCharactersPrompt from "./PlotfieldCharactersPrompt";

export type ExposedMethods = {
  updateCharacterNameOnBlur: () => void;
};

type PlotfieldCharacterPromptMainTypes = {
  characterName: string;
  plotfieldCommandId?: string;
  currentCharacterId: string;
  inputClasses?: string;
  imgClasses?: string;
  containerClasses?: string;
  characterValue: CharacterValueTypes;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setEmotionValue?: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  onChange?: (value: string) => void;
};

const PlotfieldCharacterPromptMain = ({
  setCharacterValue,
  setEmotionValue,
  currentCharacterId,
  characterValue,
  onChange,
  characterName,
  plotfieldCommandId,
  inputClasses,
  imgClasses,
  containerClasses,
}: PlotfieldCharacterPromptMainTypes) => {
  const { storyId } = useParams();
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const { updateCharacterProperties, updateEmotionProperties } = usePlotfieldCommands();
  const currentInput = useRef<HTMLInputElement>(null);
  const { data: allTranslatedCharacters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  const { data: allCharacters } = useGetAllCharactersByStoryId({
    storyId: storyId || "",
  });

  const combinedCharacters = useMemo(() => {
    if (allTranslatedCharacters && allCharacters) {
      return allCharacters.map((c) => {
        const currentTranslatedCharacter = allTranslatedCharacters.find((tc) => tc.characterId === c._id);
        return {
          characterImg: c?.img || "",
          characterId: c._id,
          characterName:
            currentTranslatedCharacter?.translations?.find((tc) => tc.textFieldName === "characterName")?.text || "",
        };
      });
    } else {
      return [];
    }
  }, [allTranslatedCharacters, allCharacters]);

  const filteredCharacters = useMemo(() => {
    if (combinedCharacters) {
      if (characterName?.trim().length) {
        return combinedCharacters.filter((cc) =>
          cc?.characterName?.toLowerCase().includes(characterName?.trim()?.toLowerCase())
        );
      } else {
        return combinedCharacters;
      }
    } else {
      return [];
    }
  }, [combinedCharacters, characterName]);

  const updateCharacterNameOnBlur = () => {
    if (!characterName?.trim().length) {
      return;
    }
    const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
      tc.translations?.find(
        (tct) => tct.textFieldName === "characterName" && tct.text?.toLowerCase() === characterName?.toLowerCase()
      )
    );
    if (!tranlsatedCharacter) {
      // TODO give possibility to create a new character here
      console.log("Non-existing character");
      return;
    }

    const character = allCharacters?.find((c) => c._id === tranlsatedCharacter?.characterId);

    if (currentCharacterId?.trim().length && currentCharacterId !== character?._id) {
      if (setEmotionValue) {
        setEmotionValue({
          _id: null,
          emotionName: null,
          imgUrl: null,
        });
        updateEmotionProperties({
          emotionId: "",
          emotionName: "",
          id: plotfieldCommandId || "",
          emotionImg: "",
        });
      }

      setCharacterValue({
        _id: character?._id || null,
        characterName:
          tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || null,
        imgUrl: character?.img || null,
      });

      updateCharacterProperties({
        characterId: character?._id || "",
        characterName: tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || "",
        id: plotfieldCommandId || "",
        characterImg: character?.img || "",
      });
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: filteredCharacters.length });

  return (
    <Popover open={showCharacterModal} onOpenChange={setShowCharacterModal}>
      <PopoverTrigger asChild>
        <div
          className={`${containerClasses ? containerClasses : "flex-grow flex justify-between items-center"} relative`}
        >
          <PlotfieldInput
            ref={currentInput}
            value={characterValue?.characterName || ""}
            onChange={(e) => {
              setShowCharacterModal(true);
              setCharacterValue((prev) => ({
                ...prev,
                characterName: e.target.value,
              }));
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            onBlur={updateCharacterNameOnBlur}
            className={`${inputClasses ? inputClasses : "h-[50px] w-full pr-[50px] text-text md:text-[17px]"}`}
            placeholder="Имя Персонажа"
          />

          <img
            src={characterValue?.imgUrl || ""}
            alt="CharacterImg"
            className={`${characterValue?.imgUrl?.trim().length ? "" : "hidden"} ${
              imgClasses ? imgClasses : "w-[40px] object-cover top-[5px] right-[3px] rounded-md absolute"
            }`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {filteredCharacters?.length ? (
          filteredCharacters?.map((c, i) => (
            <PlotfieldCharactersPrompt
              key={`${c.characterId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              setShowCharacterModal={setShowCharacterModal}
              plotfieldCommandId={plotfieldCommandId}
              setCharacterValue={setCharacterValue}
              setEmotionValue={setEmotionValue}
              currentCharacterId={currentCharacterId}
              {...c}
            />
          ))
        ) : !filteredCharacters?.length ? (
          <Button
            type="button"
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

export default PlotfieldCharacterPromptMain;
