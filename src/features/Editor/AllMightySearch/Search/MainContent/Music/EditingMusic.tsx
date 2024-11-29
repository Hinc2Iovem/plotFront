import { useEffect, useState } from "react";
import useUpdateMusicText from "../../../../PlotField/hooks/Music/useUpdateMusicText";
import { TempMusicTypes } from "./AllMightySearchMainContentMusic";
import { AllMightySearchMusicResultTypes } from "../../../hooks/useGetPaginatedMusic";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { useParams } from "react-router-dom";

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
      console.error("Can not edit an empty music");
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
      } h-full flex flex-col gap-[1rem]`}
    >
      <form className="flex gap-[1rem] p-[.5rem]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Музыка"
        />
        <PlotfieldButton className="w-full bg-primary-darker hover:bg-primary max-w-[15rem]">Изменить</PlotfieldButton>
      </form>
    </div>
  );
}
