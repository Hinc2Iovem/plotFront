import { toastErrorStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useUpdateSoundText from "../../../../PlotField/hooks/Sound/useUpdateSoundText";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchSoundResultTypes } from "../../../hooks/useGetPaginatedSounds";
import { TempSoundTypes } from "./AllMightySearchMainContentSound";

type EditingSoundFormTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  startEditing: boolean;
  editingSound: TempSoundTypes | null;
  setUpdatedSound: React.Dispatch<React.SetStateAction<TempSoundTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchSoundResultTypes[]>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EditingSoundForm({
  currentCategory,
  setStartEditing,
  setUpdatedSound,
  setAllPaginatedResults,
  startEditing,
  editingSound,
}: EditingSoundFormTypes) {
  const { storyId } = useParams();
  const [currentText, setCurrentText] = useState(editingSound?.soundText || "");

  const updateSound = useUpdateSoundText({ soundId: editingSound?.soundId || "", storyId: storyId || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText?.trim().length) {
      toast("Поле пусто", toastErrorStyles);
      return;
    }

    setUpdatedSound({ soundId: editingSound?.soundId || "", soundText: currentText });
    setAllPaginatedResults((prev) =>
      prev.map((pp) => ({
        ...pp,
        results: pp.results.map((ppr) => ({
          ...ppr,
          soundName: ppr._id === editingSound?.soundId ? currentText : ppr.soundName,
        })),
      }))
    );
    setStartEditing(false);
    updateSound.mutate({ soundName: currentText });
  };

  useEffect(() => {
    if (editingSound?.soundText) {
      setCurrentText(editingSound.soundText);
    }
  }, [editingSound]);

  return (
    <div
      className={`${currentCategory === "sound" ? "" : "hidden"} ${
        startEditing ? "" : "hidden"
      } h-full flex flex-col gap-[10px]`}
    >
      <form className="flex gap-[5px] p-[5px]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Звук"
        />
        <Button className="w-full justify-center text-white text-[20px] bg-brand-gradient hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all max-w-[150px]">
          Изменить
        </Button>
      </form>
    </div>
  );
}
