import { useEffect, useState } from "react";
import useUpdateSoundText from "../../../../PlotField/hooks/Sound/useUpdateSoundText";
import { TempSoundTypes } from "./AllMightySearchMainContentSound";
import { AllMightySearchSoundResultTypes } from "../../../hooks/useGetPaginatedSounds";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../../AllMightySearch";
import { useParams } from "react-router-dom";

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
      console.error("Can not edit an empty sound");
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
      } h-full flex flex-col gap-[1rem]`}
    >
      <form className="flex gap-[1rem] p-[.5rem]" onSubmit={handleSubmit}>
        <PlotfieldInput
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="border-[1px]"
          placeholder="Звук"
        />
        <PlotfieldButton className="w-full bg-primary-darker hover:bg-primary max-w-[15rem]">Изменить</PlotfieldButton>
      </form>
    </div>
  );
}
