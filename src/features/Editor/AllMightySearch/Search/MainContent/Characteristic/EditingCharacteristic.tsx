import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUpdateCharacteristicTranslation from "../../../../../../hooks/Patching/Translation/useUpdateCharacteristicTranslation";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchCharacteristicResultTypes } from "../../../hooks/useGetPaginatedTranslationCharacteristic";
import { TempCharacteristicTypes } from "./AllMightySearchMainContentCharacteristic";
import { toast } from "sonner";
import { toastErrorStyles } from "@/components/shared/toastStyles";

type EditingCharacteristicFormTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  startEditing: boolean;
  editingCharacteristic: TempCharacteristicTypes | null;
  setUpdatedCharacteristic: React.Dispatch<React.SetStateAction<TempCharacteristicTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchCharacteristicResultTypes[]>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EditingCharacteristicForm({
  currentCategory,
  setStartEditing,
  setUpdatedCharacteristic,
  setAllPaginatedResults,
  startEditing,
  editingCharacteristic,
}: EditingCharacteristicFormTypes) {
  const { storyId } = useParams();
  const [currentText, setCurrentText] = useState(editingCharacteristic?.text || "");

  const updateCharacteristic = useUpdateCharacteristicTranslation({
    characterCharacteristicId: editingCharacteristic?.characteristicId || "",
    storyId: storyId || "",
    language: "russian",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText?.trim().length) {
      toast("Поле пусто", toastErrorStyles);
      return;
    }

    setUpdatedCharacteristic({
      characteristicId: editingCharacteristic?.characteristicId || "",
      text: currentText,
      translatedCharacteristicId: editingCharacteristic?.translatedCharacteristicId || "",
    });

    setAllPaginatedResults((prev) =>
      prev.map((pp) => ({
        ...pp,
        results: pp.results.map((ppr) => ({
          ...ppr,
          translations:
            ppr.characteristicId === editingCharacteristic?.characteristicId
              ? ppr.translations?.map((pprt) =>
                  pprt.textFieldName === "characterCharacteristic"
                    ? {
                        ...pprt,
                        amountOfWords: currentText.length,
                        text: currentText,
                      }
                    : { ...pprt }
                )
              : ppr.translations,
        })),
      }))
    );
    setStartEditing(false);
    updateCharacteristic.mutate({
      characteristicName: currentText,
    });
  };

  useEffect(() => {
    if (editingCharacteristic?.text) {
      setCurrentText(editingCharacteristic.text);
    }
  }, [editingCharacteristic]);

  return (
    <div
      className={`${currentCategory === "characteristic" ? "" : "hidden"} ${
        startEditing ? "" : "hidden"
      } h-full flex flex-col gap-[5px]`}
    >
      <form className="flex gap-[5px] p-[5px]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Характеристика"
        />
        <Button className="w-full justify-center text-white text-[20px] bg-brand-gradient hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all max-w-[150px]">
          Изменить
        </Button>
      </form>
    </div>
  );
}
