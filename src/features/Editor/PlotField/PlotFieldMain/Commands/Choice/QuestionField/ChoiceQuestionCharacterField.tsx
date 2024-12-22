import { useEffect, useRef } from "react";
import PlotfieldCharacterPromptMain, { ExposedMethods } from "../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";

type ChoiceQuestionCharacterFieldTypes = {
  setShowAllCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllEmotions: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  showAllCharacters: boolean;
  characterValue: CharacterValueTypes;
  choiceId: string;
};

export default function ChoiceQuestionCharacterField({
  showAllCharacters,
  choiceId,
  setShowAllCharacters,
  setShowAllEmotions,
  characterValue,
  setCharacterValue,
}: ChoiceQuestionCharacterFieldTypes) {
  const preventRerender = useRef(false);
  const inputRef = useRef<ExposedMethods>(null);

  const updateChoice = useUpdateChoice({ choiceId });

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current?.updateCharacterNameOnBlur();
    }
  };

  useEffect(() => {
    if (characterValue._id && preventRerender.current) {
      updateChoice.mutate({ characterId: characterValue._id });
    }
    return () => {
      preventRerender.current = true;
    };
  }, [characterValue]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowAllCharacters(false);
      }}
      className="w-full relative flex gap-[.5rem] bg-primary rounded-md"
    >
      <PlotfieldInput
        onClick={(e) => {
          e.stopPropagation();
          setShowAllCharacters(true);
          setShowAllEmotions(false);
        }}
        onBlur={handleBlur}
        value={characterValue.characterName || ""}
        onChange={(e) => {
          setShowAllCharacters(true);
          setCharacterValue((prev) => ({
            ...prev,
            characterName: e.target.value,
          }));
        }}
        placeholder="Имя Персонажа"
      />

      <img
        src={characterValue?.imgUrl || ""}
        alt="CharacterImg"
        className={`${
          characterValue.imgUrl?.trim().length ? "" : "hidden"
        } w-[3rem] object-cover top-[1.5px] rounded-md right-0 absolute`}
      />
      <PlotfieldCharacterPromptMain
        setShowCharacterModal={setShowAllCharacters}
        showCharacterModal={showAllCharacters}
        translateAsideValue={"translate-y-[3.5rem]"}
        characterName={characterValue.characterName || ""}
        currentCharacterId={characterValue._id || ""}
        setCharacterValue={setCharacterValue}
        ref={inputRef}
      />
    </form>
  );
}
