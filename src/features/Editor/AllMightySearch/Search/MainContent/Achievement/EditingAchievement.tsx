import { useEffect, useState } from "react";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import useUpdateAchievementText from "../../../../PlotField/hooks/Achievement/useUpdateAchievementText";
import { TempAchievementTypes } from "./AllMightySearchMainContentAchievement";
import { AllMightySearchAchievementResultTypes } from "../../../hooks/useGetPaginatedTranslationAchievement";
import { useParams } from "react-router-dom";

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
      console.error("Can not edit an empty achievement");
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
      } h-full flex flex-col gap-[1rem]`}
    >
      <form className="flex gap-[1rem] p-[.5rem]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Ачивка"
        />
        <PlotfieldButton className="w-full bg-primary-darker hover:bg-primary max-w-[15rem]">Изменить</PlotfieldButton>
      </form>
    </div>
  );
}
