import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useGetTranslationCharacters from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldCharacterPromptMain from "../Prompts/Characters/PlotfieldCharacterPromptMain";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../../../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";
import CommandWardrobeCreateCharacter from "./CommandWardrobeCreateCharacter";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";

type CommandWardrobeCharacterTypes = {
  setShowAppearancePartVariationModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAppearancePartModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  characterId: string;
  commandWardrobeId: string;
  showCharacterModal: boolean;
};

export default function CommandWardrobeCharacter({
  characterId,
  showCharacterModal,
  setCharacterId,
  setShowAppearancePartModal,
  setShowAppearancePartVariationModal,
  setShowCharacterModal,
  commandWardrobeId,
}: CommandWardrobeCharacterTypes) {
  const { storyId } = useParams();
  const [characterImg, setCharacterImg] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [suggestCreateCharacterModal, setSuggestCreateCharacterModal] =
    useState(false);
  const { data: character } = useGetCharacterById({ characterId });
  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId,
    language: "russian",
  });
  useEffect(() => {
    if (character) {
      setCharacterImg(character?.img ?? "");
    }
  }, [character]);

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        if (tc.textFieldName === "characterName") {
          setCharacterName(tc.text);
        }
      });
    }
  }, [translatedCharacter]);

  const characterDebouncedValue = useDebounce({
    value: characterName,
    delay: 500,
  });

  const { data: allCharacters } = useGetTranslationCharacters({
    language: "russian",
    storyId: storyId || "",
  });

  const allMemoizedCharacterNames = useMemo(() => {
    return allCharacters?.map((c) =>
      c.translations
        ?.find((t) => t.textFieldName === "characterName")
        ?.text.toLowerCase()
    );
  }, [allCharacters]);

  const updateWardrobeCharacterId =
    useUpdateWardrobeCurrentDressedAndCharacterId({
      commandWardrobeId,
    });

  useEffect(() => {
    if (characterId?.trim().length) {
      updateWardrobeCharacterId.mutate({ characterId });
    }
  }, [characterId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName?.trim().length) {
      console.log("Заполните поле!");
      return;
    }
    if (allMemoizedCharacterNames?.includes(characterName.toLowerCase())) {
      // if character already exists
      const newCharacterId = allCharacters?.find((c) =>
        c.translations?.find(
          (t) => t.text.toLowerCase() === characterName.toLowerCase()
        )
      )?.characterId;
      updateWardrobeCharacterId.mutate({ characterId: newCharacterId });
    } else {
      setSuggestCreateCharacterModal(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full relative flex gap-[.5rem]"
      >
        <PlotfieldInput
          onClick={(e) => {
            e.stopPropagation();
            setShowAppearancePartModal(false);
            setShowAppearancePartVariationModal(false);
            setShowCharacterModal((prev) => !prev);
          }}
          value={characterName}
          onChange={(e) => {
            setShowCharacterModal(true);
            setCharacterName(e.target.value);
          }}
          placeholder="Имя Персонажа"
        />

        <img
          src={characterImg}
          alt="CharacterImg"
          className={`${
            characterImg?.trim().length ? "" : "hidden"
          } w-[3rem] object-cover rounded-md right-0 top-[1.5px] absolute`}
        />
        <PlotfieldCharacterPromptMain
          characterValue={characterName}
          debouncedValue={characterDebouncedValue}
          translateAsideValue="translate-y-[3.5rem]"
          setCharacterId={setCharacterId}
          setCharacterName={setCharacterName}
          setShowCharacterModal={setShowCharacterModal}
          showCharacterModal={showCharacterModal}
          setCharacterImg={setCharacterImg}
          commandIfId=""
          isElse={false}
        />
      </form>
      <CommandWardrobeCreateCharacter
        characterName={characterName}
        commandWardrobeId={commandWardrobeId}
        setShowModal={setSuggestCreateCharacterModal}
        showModal={suggestCreateCharacterModal}
      />
    </>
  );
}
