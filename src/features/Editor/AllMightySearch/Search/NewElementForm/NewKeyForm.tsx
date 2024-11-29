import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import useCreateNewKeyAsValue from "../../../PlotField/hooks/Key/useCreateNewKeyAsValue";
import { NewElementTypes } from "../MainContent/AllMightySearchMainContent";
import PlotfieldInput from "../../../../shared/Inputs/PlotfieldInput";
import PlotfieldButton from "../../../../shared/Buttons/PlotfieldButton";

type NewKeyFormTypes = {
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  showCreatingNewElement: boolean;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewKeyForm({
  setNewElement,
  setShowCreatingNewElement,
  showCreatingNewElement,
}: NewKeyFormTypes) {
  const { storyId } = useParams();
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && showCreatingNewElement) {
      inputRef.current.focus();
    }
  }, [inputRef, showCreatingNewElement]);

  const createNewKey = useCreateNewKeyAsValue({ storyId: storyId || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value?.trim().length) {
      console.log("Can not crete an empty key");
      return;
    }
    const keyId = generateMongoObjectId();
    setNewElement({
      _id: keyId,
      text: value,
      storyId: storyId || "",
    });

    setShowCreatingNewElement(false);
    createNewKey.mutate({ keyId, keyName: value });
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem]">
      <PlotfieldInput
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        className="border-[.1rem]"
        placeholder="Ключ"
      />
      <PlotfieldButton className="w-fit self-end bg-primary-darker ">Создать</PlotfieldButton>
    </form>
  );
}
