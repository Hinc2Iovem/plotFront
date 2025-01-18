import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useUpdateAchievementText from "../../../../PlotField/hooks/Achievement/Update/useUpdateAchievementText";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { AllMightySearchAchievementResultTypes } from "../../../hooks/useGetPaginatedTranslationAchievement";
import { TempAchievementTypes } from "./AllMightySearchMainContentAchievement";
import { toast } from "sonner";
import { toastErrorStyles } from "@/components/shared/toastStyles";

type EditingAchievementFormTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  startEditing: boolean;
  editingAchievement: TempAchievementTypes | null;
  setUpdatedAchievement: React.Dispatch<React.SetStateAction<TempAchievementTypes | null>>;
  setAllPaginatedResults: React.Dispatch<React.SetStateAction<AllMightySearchAchievementResultTypes[]>>;
  setStartEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EditingAchievementForm({
  currentCategory,
  setStartEditing,
  setUpdatedAchievement,
  setAllPaginatedResults,
  startEditing,
  editingAchievement,
}: EditingAchievementFormTypes) {
  const { storyId } = useParams();
  const [currentText, setCurrentText] = useState(editingAchievement?.text || "");

  const updateAchievement = useUpdateAchievementText({
    achievementId: editingAchievement?.achievementId || "",
    achievementName: currentText,
    storyId: storyId || "",
    language: "russian",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText?.trim().length) {
      toast("Поле пусто", toastErrorStyles);
      return;
    }

    setUpdatedAchievement({
      achievementId: editingAchievement?.achievementId || "",
      text: currentText,
      translatedAchievementId: editingAchievement?.translatedAchievementId || "",
    });

    setAllPaginatedResults((prev) =>
      prev.map((pp) => ({
        ...pp,
        results: pp.results.map((ppr) => ({
          ...ppr,
          translations:
            ppr.achievementId === editingAchievement?.achievementId
              ? ppr.translations?.map((pprt) =>
                  pprt.textFieldName === "achievementName"
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
    updateAchievement.mutate();
  };

  useEffect(() => {
    if (editingAchievement?.text) {
      setCurrentText(editingAchievement.text);
    }
  }, [editingAchievement]);

  return (
    <div
      className={`${currentCategory === "achievement" ? "" : "hidden"} ${
        startEditing ? "" : "hidden"
      } h-full flex flex-col gap-[5px]`}
    >
      <form className="flex gap-[5px] p-[5px]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Ачивка"
        />
        <Button className="w-full justify-center text-white text-[20px] bg-brand-gradient hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all max-w-[150px]">
          Изменить
        </Button>
      </form>
    </div>
  );
}
