import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import { NewElementTypes } from "../MainContent/AllMightySearchMainContent";
import PlotfieldInput from "../../../../shared/Inputs/PlotfieldInput";
import PlotfieldButton from "../../../../shared/Buttons/PlotfieldButton";
import useCreateAchievement from "../../../PlotField/hooks/Achievement/useCreateAchievement";
import { TranslationTextFieldName } from "../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAchievementTypes } from "../../../../../types/Additional/TranslationTypes";

type NewAchievementFormTypes = {
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  showCreatingNewElement: boolean;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewAchievementForm({
  setNewElement,
  setShowCreatingNewElement,
  showCreatingNewElement,
}: NewAchievementFormTypes) {
  const { storyId } = useParams();
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && showCreatingNewElement) {
      inputRef.current.focus();
    }
  }, [inputRef, showCreatingNewElement]);

  const createNewAchievement = useCreateAchievement({ storyId: storyId || "", language: "russian", text: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value?.trim().length) {
      console.log("Can not crete an empty achievement");
      return;
    }
    const achievementId = generateMongoObjectId();
    setNewElement({
      _id: "",
      translations: [
        {
          _id: "",
          amountOfWords: value?.length || 0,
          text: value,
          textFieldName: TranslationTextFieldName.AchievementName as "achievementName",
        },
      ],
      language: "russian",
      storyId: storyId || "",
      achievementId: achievementId,
      createdAt: new Date(new Date().getTime()),
      updatedAt: new Date(new Date().getTime()),
    } as TranslationAchievementTypes);

    setShowCreatingNewElement(false);
    createNewAchievement.mutate({ bodyAchievementId: achievementId });
  };
  useEffect(() => {
    if (showCreatingNewElement) {
      setValue("");
    }
  }, [showCreatingNewElement]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem]">
      <PlotfieldInput
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        className="border-[.1rem]"
        placeholder="Ачивка"
      />
      <PlotfieldButton className="w-fit self-end bg-primary-darker">Создать</PlotfieldButton>
    </form>
  );
}
