import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import PlotfieldButton from "../../../../../ui/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../../ui/Inputs/PlotfieldInput";
import { NewElementTypes } from "../MainContent/AllMightySearchMainContent";
import useCreateMusic from "../../../PlotField/hooks/Music/useCreateMusic";

type NewMusicFormTypes = {
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  showCreatingNewElement: boolean;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewMusicForm({
  setNewElement,
  setShowCreatingNewElement,
  showCreatingNewElement,
}: NewMusicFormTypes) {
  const { storyId } = useParams();
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && showCreatingNewElement) {
      inputRef.current.focus();
    }
  }, [inputRef, showCreatingNewElement]);
  const createNewMusic = useCreateMusic({ storyId: storyId || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value?.trim().length) {
      console.log("Can not crete an empty music");
      return;
    }
    const musicId = generateMongoObjectId();
    setNewElement({
      _id: musicId,
      musicName: value,
      storyId: storyId || "",
    });

    setShowCreatingNewElement(false);
    createNewMusic.mutate({ musicId, musicName: value });
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem]">
      <PlotfieldInput
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        className="border-[.1rem]"
        placeholder="Музыка"
      />
      <PlotfieldButton className="w-fit self-end bg-primary-darker ">Создать</PlotfieldButton>
    </form>
  );
}
