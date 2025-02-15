import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";
import CharacterPromptCreationWrapper from "../../../components/CharacterPrompCreationWrapper/CharacterPromptCreationWrapper";
import { CharacterValueTypes } from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type ChoiceQuestionCharacterFieldTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  characterValue: CharacterValueTypes;
  choiceId: string;
};

export default function ChoiceQuestionCharacterField({
  choiceId,
  characterValue,
  setCharacterValue,
  setCharacterId,
}: ChoiceQuestionCharacterFieldTypes) {
  const updateChoice = useUpdateChoice({ choiceId });

  const handleOnBlur = (value: CharacterValueTypes) => {
    setCharacterId(value._id || "");
    setCharacterValue(value);
    updateChoice.mutate({ characterId: value._id || "" });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex-grow min-w-[200px]"
    >
      <CharacterPromptCreationWrapper
        initCharacterValue={characterValue}
        onBlur={handleOnBlur}
        inputClasses="w-full pr-[35px] text-text md:text-[17px]"
        imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
      />
    </form>
  );
}
