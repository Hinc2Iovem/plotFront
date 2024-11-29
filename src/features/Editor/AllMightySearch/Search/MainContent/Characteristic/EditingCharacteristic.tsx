import { useEffect, useState } from "react";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { TempCharacteristicTypes } from "./AllMightySearchMainContentCharacteristic";
import { AllMightySearchCharacteristicResultTypes } from "../../../hooks/useGetPaginatedTranslationCharacteristic";
import { useParams } from "react-router-dom";
import useUpdateCharacteristicTranslation from "../../../../../../hooks/Patching/Translation/useUpdateCharacteristicTranslation";

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
      console.error("Can not edit an empty characteristic");
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
      } h-full flex flex-col gap-[1rem]`}
    >
      <form className="flex gap-[1rem] p-[.5rem]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Характеристика"
        />
        <PlotfieldButton className="w-full bg-primary-darker hover:bg-primary max-w-[15rem]">Изменить</PlotfieldButton>
      </form>
    </div>
  );
}
