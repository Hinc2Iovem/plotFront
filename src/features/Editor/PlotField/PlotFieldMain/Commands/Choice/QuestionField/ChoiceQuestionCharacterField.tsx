import { useEffect, useRef, useState } from "react";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";
import PlotfieldCharacterPromptMain from "../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type ChoiceQuestionCharacterFieldTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  characterValue: CharacterValueTypes;
  choiceId: string;
};

export default function ChoiceQuestionCharacterField({
  choiceId,
  characterValue,
  setCharacterValue,
}: ChoiceQuestionCharacterFieldTypes) {
  const preventRerender = useRef(false);
  const [initValue, setInitValue] = useState<CharacterValueTypes>(characterValue);
  const updateChoice = useUpdateChoice({ choiceId });

  useEffect(() => {
    if (characterValue._id && preventRerender.current && characterValue._id !== initValue._id) {
      setInitValue(characterValue);
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
      }}
      className="flex-grow min-w-[200px]"
    >
      <PlotfieldCharacterPromptMain
        characterName={characterValue.characterName || ""}
        currentCharacterId={characterValue._id || ""}
        setCharacterValue={setCharacterValue}
        characterValue={characterValue}
        inputClasses="w-full pr-[35px] text-text md:text-[17px]"
        imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
      />
    </form>
  );
}
