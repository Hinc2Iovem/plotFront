import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useUpdateKeyText from "../../../../PlotField/hooks/Key/useUpdateKeyText";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchKeyResultTypes } from "../../../hooks/useGetPaginatedKey";
import { TempKeyTypes } from "./AllMightySearchMainContentKey";
import { toast } from "sonner";
import { toastErrorStyles } from "@/components/shared/toastStyles";

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
      toast("Поле пусто", toastErrorStyles);
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
      } h-full flex flex-col gap-[5px]`}
    >
      <form className="flex gap-[5px] p-[5px]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Ключ"
        />
        <Button className="w-full text-white text-[20px] bg-brand-gradient hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all max-w-[150px]">
          Изменить
        </Button>
      </form>
    </div>
  );
}
