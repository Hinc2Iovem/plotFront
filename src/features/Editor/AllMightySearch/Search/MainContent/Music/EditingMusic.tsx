import { toastErrorStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useUpdateMusicText from "../../../../PlotField/hooks/Music/useUpdateMusicText";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchMusicResultTypes } from "../../../hooks/useGetPaginatedMusic";
import { TempMusicTypes } from "./AllMightySearchMainContentMusic";

type EditingMusicFormTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  startEditing: boolean;
  editingMusic: TempMusicTypes | null;
  setUpdatedMusic: React.Dispatch<React.SetStateAction<TempMusicTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchMusicResultTypes[]>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EditingMusicForm({
  currentCategory,
  setStartEditing,
  setUpdatedMusic,
  setAllPaginatedResults,
  startEditing,
  editingMusic,
}: EditingMusicFormTypes) {
  const { storyId } = useParams();
  const [currentText, setCurrentText] = useState(editingMusic?.musicText || "");

  const updateMusic = useUpdateMusicText({ musicId: editingMusic?.musicId || "", storyId: storyId || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText?.trim().length) {
      toast("Поле пусто", toastErrorStyles);
      return;
    }

    setUpdatedMusic({ musicId: editingMusic?.musicId || "", musicText: currentText });
    setAllPaginatedResults((prev) =>
      prev.map((pp) => ({
        ...pp,
        results: pp.results.map((ppr) => ({
          ...ppr,
          musicName: ppr._id === editingMusic?.musicId ? currentText : ppr.musicName,
        })),
      }))
    );
    setStartEditing(false);
    updateMusic.mutate({ musicName: currentText });
  };

  useEffect(() => {
    if (editingMusic?.musicText) {
      setCurrentText(editingMusic.musicText);
    }
  }, [editingMusic]);

  return (
    <div
      className={`${currentCategory === "music" ? "" : "hidden"} ${
        startEditing ? "" : "hidden"
      } h-full flex flex-col gap-[5px]`}
    >
      <form className="flex gap-[5px] p-[5px]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Музыка"
        />
        <Button className="w-full justify-center text-white text-[20px] bg-brand-gradient hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all max-w-[150px]">
          Изменить
        </Button>
      </form>
    </div>
  );
}
