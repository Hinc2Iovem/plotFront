import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetTranslationAchievementEnabled from "../../../hooks/Achievement/useGetTranslationAchievementEnabled";
import useUpdateAchievementText from "../../../hooks/Achievement/useUpdateAchievementText";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandAchievement from "../../../hooks/Achievement/useGetCommandAchievement";

type CommandAchievementFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandAchievementField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandAchievementFieldTypes) {
  const { storyId, episodeId } = useParams();
  const [nameValue] = useState(command ?? "achievement");
  const [initialTextValue, setInitialTextValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [achievementId, setAchievementId] = useState("");
  const currentInput = useRef<HTMLInputElement | null>(null);

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;
  // because of this hook, I don't need useGetTranslationAchievemnetEnabled here
  const { data: achievement } = useGetCommandAchievement({ plotFieldCommandId, language: "russian" });
  const { data: translatedAchievement } = useGetTranslationAchievementEnabled({
    achievementId,
    language: "russian",
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "achievement",
    id: plotFieldCommandId,
    text: textValue,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (translatedAchievement && !textValue.trim().length) {
      setTextValue((translatedAchievement.translations || [])[0]?.text || "");
      setInitialTextValue((translatedAchievement.translations || [])[0]?.text || "");
    }
  }, [translatedAchievement]);

  useEffect(() => {
    if (achievement) {
      setAchievementId(achievement?.achievementId || "");
    }
  }, [achievement]);

  const updateAchievementText = useUpdateAchievementText({
    achievementId: translatedAchievement?.achievementId || "",
    achievementName: textValue,
    storyId: storyId || "",
    language: "russian",
  });

  const onBlur = () => {
    if (initialTextValue !== textValue) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "achievement",
          id: plotFieldCommandId,
          type: "command",
          value: textValue,
        });
      }
      updateAchievementText.mutate();
      setInitialTextValue(textValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
        <PlotfieldInput
          ref={currentInput}
          value={textValue}
          onBlur={onBlur}
          type="text"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
