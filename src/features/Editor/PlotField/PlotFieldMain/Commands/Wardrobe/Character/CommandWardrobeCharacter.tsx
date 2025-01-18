import { useEffect, useState } from "react";
import useGetCharacterWithTranslation from "../../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../../../../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";
import PlotfieldCharacterPromptMain from "../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type CommandWardrobeCharacterTypes = {
  characterId: string;
  commandWardrobeId: string;
};

export default function CommandWardrobeCharacter({ characterId, commandWardrobeId }: CommandWardrobeCharacterTypes) {
  // TODO suggesting isn't implemented

  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({ currentCharacterId: characterId });
  const [initValue, setInitValue] = useState<CharacterValueTypes>({
    _id: characterId,
    characterName: "",
    imgUrl: "",
  });

  const updateWardrobeCharacterId = useUpdateWardrobeCurrentDressedAndCharacterId({
    commandWardrobeId,
  });

  useEffect(() => {
    if (characterValue._id?.trim().length && initValue._id !== characterValue._id) {
      updateWardrobeCharacterId.mutate({ characterId: characterValue._id });
      setInitValue(characterValue);
    }
  }, [characterValue._id]);

  return (
    <form className="w-full relative flex gap-[.5rem]">
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
