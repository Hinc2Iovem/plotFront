import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import PlotfieldInput from "../../../../../ui/Inputs/PlotfieldInput";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import useCreateNewKeyAsValue from "../../../PlotField/hooks/Key/useCreateNewKeyAsValue";
import { NewElementTypes } from "../MainContent/AllMightySearchMainContent";

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
      toast("Заполните поле", toastErrorStyles);
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
    toast("Новый ключ был создан", toastSuccessStyles);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-[5px]">
      <PlotfieldInput
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        className="border-[2px]"
        placeholder="Ключ"
      />
      <Button className="w-fit text-white self-end bg-brand-gradient hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all max-w-[150px]">
        Создать
      </Button>
    </form>
  );
}
