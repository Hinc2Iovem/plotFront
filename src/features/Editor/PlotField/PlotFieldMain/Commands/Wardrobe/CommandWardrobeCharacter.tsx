import { useEffect, useRef, useState } from "react";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useGetCharacterWithTranslation from "../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../../../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";
import PlotfieldCharacterPromptMain, { ExposedMethods } from "../Prompts/Characters/PlotfieldCharacterPromptMain";
import CommandWardrobeCreateCharacter from "./CommandWardrobeCreateCharacter";

type CommandWardrobeCharacterTypes = {
  setShowAppearancePartVariationModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAppearancePartModal: React.Dispatch<React.SetStateAction<boolean>>;
  characterId: string;
  commandWardrobeId: string;
  showCharacterModal: boolean;
};

export default function CommandWardrobeCharacter({
  characterId,
  showCharacterModal,
  setShowAppearancePartModal,
  setShowAppearancePartVariationModal,
  setShowCharacterModal,
  commandWardrobeId,
}: CommandWardrobeCharacterTypes) {
  // TODO suggesting isn't implemented
  const [suggestCreateCharacterModal, setSuggestCreateCharacterModal] = useState(false);

  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({ currentCharacterId: characterId });
  const inputRef = useRef<ExposedMethods>(null);

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateCharacterNameOnBlur();
    }
  };

  const updateWardrobeCharacterId = useUpdateWardrobeCurrentDressedAndCharacterId({
    commandWardrobeId,
  });

  useEffect(() => {
    if (characterValue._id?.trim().length && characterId !== characterValue._id) {
      updateWardrobeCharacterId.mutate({ characterId });
    }
  }, [characterValue._id, characterId]);

  return (
    <>
      <form className="w-full relative flex gap-[.5rem]">
        <PlotfieldInput
          onClick={(e) => {
            e.stopPropagation();
            setShowAppearancePartModal(false);
            setShowAppearancePartVariationModal(false);
            setShowCharacterModal((prev) => !prev);
          }}
          onBlur={onBlur}
          value={characterValue.characterName || ""}
          onChange={(e) => {
            setShowCharacterModal(true);
            setCharacterValue((prev) => ({
              ...prev,
              characterName: e.target.value,
            }));
          }}
          placeholder="Имя Персонажа"
        />

        <img
          src={characterValue.imgUrl || ""}
          alt="CharacterImg"
          className={`${
            characterValue.imgUrl?.trim().length ? "" : "hidden"
          } w-[3rem] object-cover rounded-md right-0 top-[1.5px] absolute`}
        />
        <PlotfieldCharacterPromptMain
          translateAsideValue="translate-y-[3.5rem]"
          setShowCharacterModal={setShowCharacterModal}
          showCharacterModal={showCharacterModal}
          characterName={characterValue.characterName || ""}
          currentCharacterId={characterValue._id || ""}
          setCharacterValue={setCharacterValue}
          ref={inputRef}
        />
      </form>
      <CommandWardrobeCreateCharacter
        characterName={characterValue.characterName || ""}
        commandWardrobeId={commandWardrobeId}
        setShowModal={setSuggestCreateCharacterModal}
        showModal={suggestCreateCharacterModal}
      />
    </>
  );
}
