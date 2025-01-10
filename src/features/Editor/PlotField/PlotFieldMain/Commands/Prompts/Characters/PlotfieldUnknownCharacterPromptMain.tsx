import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharactersByStoryIdAndType from "../../../../../../../hooks/Fetching/Character/useGetAllCharactersByStoryIdAndType";
import useGetTranslationCharactersByStoryIdAndType from "../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByStoryIdAndType";
import PlotfieldUnknownCharactersPrompt from "./PlotfieldUnknownCharactersPrompt";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";

export type UnknownCharacterValueTypes = {
  characterUnknownName: string;
  characterImg?: string;
  characterId: string;
  characterName: string;
};

export type ExposedMethodsUnknownCharacter = {
  updateCharacterOnBlur: () => void;
};

type PlotfieldUnknownCharacterPromptMainTypes = {
  unknownName?: string;
  characterValue: UnknownCharacterValueTypes;
  onChange: (value: string) => void;
  setCharacterValue: React.Dispatch<React.SetStateAction<UnknownCharacterValueTypes>>;
};

const PlotfieldUnknownCharacterPromptMain = ({
  setCharacterValue,
  onChange,
  characterValue,
  unknownName,
}: PlotfieldUnknownCharacterPromptMainTypes) => {
  const { storyId } = useParams();
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);

  const { data: allTranslatedCharacters } = useGetTranslationCharactersByStoryIdAndType({
    storyId: storyId || "",
    language: "russian",
    type: "minorcharacter",
  });

  const { data: allCharacters } = useGetAllCharactersByStoryIdAndType({
    storyId: storyId || "",
    searchCharacterType: "minorcharacter",
  });

  const combinedCharacters = useMemo(() => {
    if (allTranslatedCharacters && allCharacters) {
      return allCharacters.map((c) => {
        const currentTranslatedCharacter = allTranslatedCharacters.find((tc) => tc.characterId === c._id);
        return {
          characterImg: c?.img || "",
          characterId: c._id,
          characterUnknownName:
            currentTranslatedCharacter?.translations?.find((tc) => tc.textFieldName === "characterUnknownName")?.text ||
            "",
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
      if (unknownName?.trim().length) {
        return combinedCharacters.filter((cc) =>
          cc?.characterUnknownName?.toLowerCase().includes(unknownName?.toLowerCase())
        );
      } else {
        return combinedCharacters;
      }
    } else {
      return [];
    }
  }, [combinedCharacters, unknownName]);

  const updateCharacterOnBlur = () => {
    const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
      tc.translations?.find(
        (tct) => tct.textFieldName === "characterUnknownName" && tct.text?.toLowerCase() === unknownName?.toLowerCase()
      )
    );
    if (!tranlsatedCharacter) {
      console.log("Non-existing character");
      return;
    }

    const character = allCharacters?.find((c) => c._id === tranlsatedCharacter?.characterId);

    if (setCharacterValue) {
      setCharacterValue({
        characterId: character?._id || "",
        characterUnknownName:
          tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterUnknownName")?.text || "",
        characterImg: character?.img || "",
        characterName: tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || "",
      });
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: filteredCharacters.length });

  return (
    <Popover open={showCharacterModal} onOpenChange={setShowCharacterModal}>
      <PopoverTrigger asChild>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex-grow flex justify-between items-center relative"
        >
          <PlotfieldInput
            ref={currentInput}
            onBlur={updateCharacterOnBlur}
            value={characterValue.characterUnknownName}
            onChange={(e) => {
              setShowCharacterModal(true);
              setCharacterValue((prev) => ({
                ...prev,
                characterUnknownName: e.target.value,
              }));
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            className={`w-full pr-[35px] text-text md:text-[17px]`}
            placeholder="Неизвестное Имя"
          />

          <img
            src={characterValue.characterImg}
            alt="CharacterImg"
            className={`${
              characterValue.characterImg?.trim().length ? "" : "hidden"
            } w-[30px] object-cover rounded-md right-0 absolute`}
          />
        </form>
      </PopoverTrigger>

      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={` flex-grow flex flex-col gap-[5px]`}>
        {filteredCharacters?.length ? (
          filteredCharacters?.map((c, i) => (
            <PlotfieldUnknownCharactersPrompt
              key={`${c.characterId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              setShowCharacterModal={setShowCharacterModal}
              setCharacterValue={setCharacterValue}
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

export default PlotfieldUnknownCharacterPromptMain;
