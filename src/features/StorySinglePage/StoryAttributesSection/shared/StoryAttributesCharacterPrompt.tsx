import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import usePrepareCharacterStateForFilter from "../hooks/usePrepareCharacterStateForFilter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { CharacterValueTypes } from "@/features/Editor/PlotField/PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type StoryAttributesCharacterPromptTypes = {
  inputClasses: string;
  imgClasses: string;
  characterValue: CharacterValueTypes;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
};

export default function StoryAttributesCharacterPrompt({
  characterValue,
  inputClasses,
  imgClasses,
  setCharacterValue,
}: StoryAttributesCharacterPromptTypes) {
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);
  const { filteredCharacters, allCharacters, allTranslatedCharacters } = usePrepareCharacterStateForFilter({
    characterName: characterValue.characterName || "",
  });
  // TODO: ne sdelal enter
  const buttonsRef = useModalMovemenetsArrowUpDown({ length: filteredCharacters.length });

  const updateCharacterNameOnBlur = () => {
    if (!characterValue.characterName?.trim().length) {
      return;
    }
    const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
      tc.translations?.find(
        (tct) =>
          tct.textFieldName === "characterName" &&
          tct.text?.trim()?.toLowerCase() === characterValue.characterName?.trim()?.toLowerCase()
      )
    );
    if (!tranlsatedCharacter) {
      // TODO give possibility to create a new character here
      console.log("Non-existing character");
      return;
    }

    const character = allCharacters?.find((c) => c._id === tranlsatedCharacter?.characterId);

    if (character?._id) {
      setCharacterValue({
        _id: character?._id || null,
        characterName:
          tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || null,
        imgUrl: character?.img || null,
      });
    }
  };

  return (
    <Popover open={showCharacterModal} onOpenChange={setShowCharacterModal}>
      <PopoverTrigger asChild>
        <div className="flex-grow flex justify-between items-center relative">
          <PlotfieldInput
            ref={currentInput}
            value={characterValue?.characterName || ""}
            onChange={(e) => {
              setShowCharacterModal(true);
              setCharacterValue((prev) => ({
                ...prev,
                characterName: e.target.value,
              }));
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
            <Button
              key={`${c.characterId}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCharacterValue({
                  _id: c.characterId,
                  characterName: c.characterName,
                  imgUrl: c.characterImg,
                });

                setShowCharacterModal(false);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              <p className="text-[16px] rounded-md">
                {c.characterName.length > 20 ? c.characterName.substring(0, 20) + "..." : c.characterName}
              </p>
              {c?.characterImg ? (
                <img src={c.characterImg || ""} alt="CharacterImg" className="w-[30px] rounded-md" />
              ) : null}
            </Button>
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
}
