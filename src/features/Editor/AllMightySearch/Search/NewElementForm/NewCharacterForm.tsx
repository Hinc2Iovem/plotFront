import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetMainCharacterByStoryId from "../../../../../hooks/Fetching/Character/useGetMainCharacterByStoryId";
import useCreateCharacter from "../../../../../hooks/Posting/Character/useCreateCharacter";
import { TranslationCharacterObjectTypes } from "../../../../../types/Additional/TranslationTypes";
import { CharacterTypes } from "../../../../../types/StoryData/Character/CharacterTypes";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import { NewElementTypes } from "../MainContent/AllMightySearchMainContent";
import CharacterForm from "../MainContent/Character/CharacterForm";

type NewCharacterFormTypes = {
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  showCreatingNewElement: boolean;
  characterTypeFilter: CharacterTypes | "all";
  debouncedValueFilter: string;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewCharacterForm({
  setNewElement,
  setShowCreatingNewElement,
  showCreatingNewElement,
  characterTypeFilter,
  debouncedValueFilter,
}: NewCharacterFormTypes) {
  const { storyId } = useParams();
  const [currentCharacterType, setCurrentCharacterType] = useState<CharacterTypes>(
    characterTypeFilter !== "all" ? characterTypeFilter : ("minorcharacter" as CharacterTypes)
  );

  const { data: mainCharacter } = useGetMainCharacterByStoryId({ storyId: storyId || "", language: "russian" });
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);

  const [characterName, setCharacterName] = useState<string | undefined>("");
  const [characterDescription, setCharacterDescription] = useState<string | undefined>("");
  const [characterUnknownName, setCharacterUnknownName] = useState<string | undefined>("");
  const [characterNameTag, setCharacterNameTag] = useState<string | undefined>("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && showCreatingNewElement) {
      inputRef.current.focus();
    }
  }, [inputRef, showCreatingNewElement]);

  const createNewCharacter = useCreateCharacter({
    storyId: storyId || "",
    characterType: currentCharacterType,
    debouncedValue: debouncedValueFilter,
    name: characterName || "",
    description: characterDescription || "",
    language: "russian",
    nameTag: "",
    searchCharacterType: characterTypeFilter,
    unknownName: characterUnknownName || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName?.trim().length) {
      console.log("Can not crete an empty character");
      return;
    }

    if (currentCharacterType === "maincharacter" && mainCharacter?.characterId) {
      console.error("You can not create a main character when there's already existing one");
      return;
    }

    const characterId = generateMongoObjectId();
    const _id = generateMongoObjectId();

    const translations: TranslationCharacterObjectTypes[] = [];

    // Ids doesn't have any meaning, they won't be used immediately so I can just invalidate queries while user can do anything he wants to do, the only purpose of them here is to not break structure
    const nameId = generateMongoObjectId();
    const descriptionId = generateMongoObjectId();
    const unknownNameId = generateMongoObjectId();

    translations.push({
      _id: nameId,
      amountOfWords: characterName?.length,
      text: characterName,
      textFieldName: "characterName",
    });

    if (currentCharacterType === "minorcharacter") {
      if (!characterDescription?.trim().length || !characterUnknownName?.trim().length) {
        console.error("Name, description and unknown name are required");
        return;
      }

      translations.push(
        {
          _id: unknownNameId,
          amountOfWords: characterUnknownName.length,
          text: characterUnknownName,
          textFieldName: "characterUnknownName",
        },
        {
          _id: descriptionId,
          amountOfWords: characterDescription.length,
          text: characterDescription,
          textFieldName: "characterDescription",
        }
      );
    }

    setNewElement({
      storyId: storyId || "",
      characterId,
      _id,
      characterType: currentCharacterType,
      language: "russian",
      translations,
    });

    setShowCreatingNewElement(false);
    createNewCharacter.mutate({ characterId, img: typeof imagePreview === "string" ? imagePreview : "" });
  };

  return (
    <div className={`${showCreatingNewElement ? "" : "hidden"} w-full flex flex-col gap-[10px] p-[10px]`}>
      <CharacterForm
        characterDescription={characterDescription}
        characterName={characterName}
        characterNameTag={characterNameTag}
        characterType={currentCharacterType}
        characterUnknownName={characterUnknownName}
        onSubmit={handleSubmit}
        type={"create"}
        imagePreview={imagePreview}
        setCharacterDescription={setCharacterDescription}
        setCharacterName={setCharacterName}
        setCharacterNameTag={setCharacterNameTag}
        setCharacterType={setCurrentCharacterType}
        setCharacterUnknownName={setCharacterUnknownName}
        setImagePreview={setImagePreview}
        setStarted={setShowCreatingNewElement}
      />
    </div>
  );
}
