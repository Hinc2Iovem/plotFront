import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SoundTypes } from "../../../../../types/StoryData/Sound/SoundTypes";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import PlotfieldButton from "../../../../../ui/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../../ui/Inputs/PlotfieldInput";
import useCreateSound from "../../../PlotField/hooks/Sound/useCreateSound";

type NewSoundFormTypes = {
  setNewElement: React.Dispatch<React.SetStateAction<SoundTypes>>;
  showCreatingNewElement: boolean;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewSoundForm({
  setNewElement,
  setShowCreatingNewElement,
  showCreatingNewElement,
}: NewSoundFormTypes) {
  const { storyId } = useParams();
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && showCreatingNewElement) {
      inputRef.current.focus();
    }
  }, [inputRef, showCreatingNewElement]);
  const createNewSound = useCreateSound({ storyId: storyId || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value?.trim().length) {
      console.log("Can not crete an empty sound");
      return;
    }
    const soundId = generateMongoObjectId();
    setNewElement({
      _id: soundId,
      soundName: value,
      storyId: storyId || "",
      isGlobal: false,
    });

    setShowCreatingNewElement(false);
    createNewSound.mutate({ soundId, soundName: value });
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem]">
      <PlotfieldInput
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        className="border-[.1rem]"
        placeholder="Звук"
      />
      <PlotfieldButton className="w-fit self-end bg-primary-darker ">Создать</PlotfieldButton>
    </form>
  );
}
