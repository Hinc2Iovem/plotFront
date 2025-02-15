import React from "react";
import useGetCharacterWithTranslation from "../../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../../../../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";
import CharacterPromptCreationWrapper from "../../../components/CharacterPrompCreationWrapper/CharacterPromptCreationWrapper";

type CommandWardrobeCharacterTypes = {
  characterId: string;
  commandWardrobeId: string;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
};

export default function CommandWardrobeCharacter({
  characterId,
  setCharacterId,
  commandWardrobeId,
}: CommandWardrobeCharacterTypes) {
  // TODO suggesting isn't implemented
  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({ currentCharacterId: characterId });

  const updateWardrobeCharacterId = useUpdateWardrobeCurrentDressedAndCharacterId({
    commandWardrobeId,
  });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full relative flex gap-[.5rem]">
      <CharacterPromptCreationWrapper
        initCharacterValue={characterValue}
        onBlur={(value) => {
          setCharacterValue(value);
          setCharacterId(value._id || "");
          updateWardrobeCharacterId.mutate({ characterId: value._id || "" });
        }}
        inputClasses="w-full pr-[35px] text-text md:text-[17px]"
        imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
      />
    </form>
  );
}
