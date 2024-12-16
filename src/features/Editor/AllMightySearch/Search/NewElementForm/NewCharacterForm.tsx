import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetMainCharacterByStoryId from "../../../../../hooks/Fetching/Character/useGetMainCharacterByStoryId";
import useCreateCharacter from "../../../../../hooks/Posting/Character/useCreateCharacter";
import { TranslationCharacterObjectTypes } from "../../../../../types/Additional/TranslationTypes";
import { CharacterTypes } from "../../../../../types/StoryData/Character/CharacterTypes";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import AsideScrollable from "../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldButton from "../../../../../ui/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldTextarea from "../../../../../ui/Textareas/PlotfieldTextarea";
import PreviewImage from "../../../../../ui/shared/PreviewImage";
import { NewElementTypes } from "../MainContent/AllMightySearchMainContent";
import { ALL_CHARACTER_TYPES_RUS, CharacterRusTypes } from "../MainContent/Character/EditingCharacter";

type NewCharacterFormTypes = {
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  showCreatingNewElement: boolean;
  characterTypeFilter: CharacterTypes | "all";
  debouncedValueFilter: string;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

type TempCharacterType = {
  name: string;
  description?: string;
  nameTag?: string;
  unknownName?: string;
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

  const [characterTypeRus, setCharacterTypeRus] = useState<CharacterRusTypes>("" as CharacterRusTypes);
  useEffect(() => {
    if (currentCharacterType) {
      setCharacterTypeRus(
        currentCharacterType === "emptycharacter"
          ? "Третий План"
          : currentCharacterType === "maincharacter"
          ? "ГГ"
          : "Второй План"
      );
    }
  }, [currentCharacterType]);

  const [showTypes, setShowTypes] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: mainCharacter } = useGetMainCharacterByStoryId({ storyId: storyId || "", language: "russian" });
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);
  const [newCharacter, setNewCharacter] = useState<TempCharacterType>({
    name: "",
    description: "",
    nameTag: "",
    unknownName: "",
  });
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
    name: newCharacter.name,
    description: newCharacter.description,
    language: "russian",
    nameTag: newCharacter.nameTag,
    searchCharacterType: characterTypeFilter,
    unknownName: newCharacter.unknownName,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacter.name.trim().length) {
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
      amountOfWords: newCharacter.name.length,
      text: newCharacter.name,
      textFieldName: "characterName",
    });

    if (currentCharacterType === "minorcharacter") {
      if (!newCharacter.description?.trim().length || !newCharacter.unknownName?.trim().length) {
        console.error("Name, description and unknown name are required");
        return;
      }

      translations.push(
        {
          _id: unknownNameId,
          amountOfWords: newCharacter.unknownName.length,
          text: newCharacter.unknownName,
          textFieldName: "characterUnknownName",
        },
        {
          _id: descriptionId,
          amountOfWords: newCharacter.description.length,
          text: newCharacter.description,
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
    <form
      onSubmit={handleSubmit}
      className={`${showCreatingNewElement ? "" : "hidden"} w-full flex flex-col gap-[1rem] p-[1rem]`}
    >
      <div className="w-full flex gap-[1.5rem] flex-wrap">
        <div className="flex-grow relative min-w-[25rem]">
          <PlotfieldInput
            placeholder="Имя"
            value={newCharacter.name}
            onChange={(e) =>
              setNewCharacter((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="border-[1px]"
          />
          <div className="absolute px-[1rem] py-[.5rem] top-[-1rem] right-[1rem] bg-secondary">
            <p className="text-text-light text-[1.3rem]">Имя</p>
          </div>
        </div>
        {currentCharacterType === "minorcharacter" ? (
          <>
            <div className="flex-grow relative min-w-[25rem]">
              <PlotfieldInput
                placeholder="Скрытое Имя"
                value={newCharacter.unknownName}
                onChange={(e) =>
                  setNewCharacter((prev) => ({
                    ...prev,
                    unknownName: e.target.value,
                  }))
                }
                className="border-[1px]"
              />
              <div className="absolute px-[1rem] py-[.5rem] top-[-1rem] right-[1rem] bg-secondary">
                <p className="text-text-light text-[1.3rem]">Скрытое Имя</p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {currentCharacterType === "minorcharacter" ? (
        <div className="relative w-full mt-[.5rem]">
          <PlotfieldTextarea
            placeholder="Описание"
            value={newCharacter.description}
            onChange={(e) =>
              setNewCharacter((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="border-[1px] min-h-[7rem]"
          />
          <div className="absolute px-[1rem] py-[.5rem] top-[-1rem] right-[1rem] bg-secondary">
            <p className="text-text-light text-[1.3rem]">Описание</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-[1rem] py-[1rem] items-center justify-center">
        <div className="flex gap-[1rem] flex-grow flex-col min-w-[20rem]">
          <div className="relative w-full">
            <PlotfieldButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTypes((prev) => !prev);
              }}
              className="bg-primary-darker hover:bg-primary"
            >
              {characterTypeRus}
            </PlotfieldButton>
            <AsideScrollable
              ref={modalRef}
              className={`${showTypes ? "" : "hidden"} translate-y-[.5rem] h-fit gap-[.5rem] py-[1rem]`}
            >
              {ALL_CHARACTER_TYPES_RUS.map((ct) => (
                <NewCharacterFormCharacterTypeButton
                  mainCharacterAlreadyExists={!!mainCharacter?.characterId}
                  setCharacterType={setCurrentCharacterType}
                  setCharacterTypeRus={setCharacterTypeRus}
                  setShowTypes={setShowTypes}
                  characterTypeRus={characterTypeRus}
                  key={ct}
                  typeRus={ct}
                />
              ))}
            </AsideScrollable>
          </div>
          <div className="relative w-full">
            <PlotfieldInput
              className="w-full border-[1px]"
              value={newCharacter.nameTag}
              onChange={(e) =>
                setNewCharacter((prev) => ({
                  ...prev,
                  nameTag: e.target.value,
                }))
              }
              placeholder="Тэг"
            />
            <div className="absolute px-[1rem] py-[.5rem] top-[-1rem] right-[1rem] bg-secondary">
              <p className="text-text-light text-[1.3rem]">Тэг</p>
            </div>
          </div>
        </div>

        <div className="w-[20rem] h-[15rem] relative bg-primary rounded-md">
          <PreviewImage
            imagePreview={imagePreview}
            imgClasses="absolute w-[15rem] -translate-x-1/2 left-1/2 object-cover"
            setPreview={setImagePreview}
          />
        </div>
      </div>

      <div className="flex gap-[1rem] w-full">
        <PlotfieldButton onClick={() => setShowCreatingNewElement(false)} type="button" className="bg-primary-darker">
          Отмена
        </PlotfieldButton>
        <PlotfieldButton type="submit" className="bg-primary-darker">
          Создать
        </PlotfieldButton>
      </div>
    </form>
  );
}

type NewCharacterFormCharacterTypeButtonTypes = {
  typeRus: CharacterRusTypes;
  characterTypeRus: CharacterRusTypes;
  mainCharacterAlreadyExists: boolean;
  setShowTypes: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterType: React.Dispatch<React.SetStateAction<CharacterTypes>>;
  setCharacterTypeRus: React.Dispatch<React.SetStateAction<CharacterRusTypes>>;
};

function NewCharacterFormCharacterTypeButton({
  typeRus,
  mainCharacterAlreadyExists,
  characterTypeRus,
  setCharacterType,
  setCharacterTypeRus,
  setShowTypes,
}: NewCharacterFormCharacterTypeButtonTypes) {
  return (
    <AsideScrollableButton
      type="button"
      onClick={() => {
        const typeToEng: CharacterTypes =
          typeRus === "ГГ" ? "maincharacter" : typeRus === "Второй План" ? "minorcharacter" : "emptycharacter";
        setCharacterType(typeToEng);
        setCharacterTypeRus(typeRus);
        setShowTypes(false);
      }}
      className={`${typeRus === characterTypeRus ? "bg-primary text-text-light" : ""} ${
        mainCharacterAlreadyExists && typeRus === "ГГ" ? "hidden" : ""
      } `}
    >
      {typeRus}
    </AsideScrollableButton>
  );
}
