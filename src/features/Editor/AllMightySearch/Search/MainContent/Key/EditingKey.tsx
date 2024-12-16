import { useEffect, useState } from "react";
import useUpdateKeyText from "../../../../PlotField/hooks/Key/useUpdateKeyText";
import { TempKeyTypes } from "./AllMightySearchMainContentKey";
import { AllMightySearchKeyResultTypes } from "../../../hooks/useGetPaginatedKey";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";

type EditingKeyFormTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  startEditing: boolean;
  editingKey: TempKeyTypes | null;
  setUpdatedKey: React.Dispatch<React.SetStateAction<TempKeyTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchKeyResultTypes[]>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EditingKeyForm({
  currentCategory,
  setStartEditing,
  setUpdatedKey,
  setAllPaginatedResults,
  startEditing,
  editingKey,
}: EditingKeyFormTypes) {
  const [currentText, setCurrentText] = useState(editingKey?.keyText || "");

  const updateKey = useUpdateKeyText({ keyId: editingKey?.keyId || "", text: currentText });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText?.trim().length) {
      console.error("Can not edit an empty key");
      return;
    }

    setUpdatedKey({ keyId: editingKey?.keyId || "", keyText: currentText });
    setAllPaginatedResults((prev) =>
      prev.map((pp) => ({
        ...pp,
        results: pp.results.map((ppr) => ({
          ...ppr,
          text: ppr._id === editingKey?.keyId ? currentText : ppr.text,
        })),
      }))
    );
    setStartEditing(false);
    updateKey.mutate();
  };

  useEffect(() => {
    if (editingKey?.keyText) {
      setCurrentText(editingKey.keyText);
    }
  }, [editingKey]);

  return (
    <div
      className={`${currentCategory === "key" ? "" : "hidden"} ${
        startEditing ? "" : "hidden"
      } h-full flex flex-col gap-[1rem]`}
    >
      <form className="flex gap-[1rem] p-[.5rem]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Ключ"
        />
        <PlotfieldButton className="w-full bg-primary-darker hover:bg-primary max-w-[15rem]">Изменить</PlotfieldButton>
      </form>
    </div>
  );
}
