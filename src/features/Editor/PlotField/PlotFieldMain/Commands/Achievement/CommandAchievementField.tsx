import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetTranslationAchievementEnabled from "../../../hooks/Achievement/useGetTranslationAchievementEnabled";
import useUpdateAchievementText from "../../../hooks/Achievement/useUpdateAchievementText";
import useSearch from "../../../../Context/Search/SearchContext";

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
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  const currentInput = useRef<HTMLInputElement | null>(null);

  const { data: translatedAchievement } = useGetTranslationAchievementEnabled({
    commandId: plotFieldCommandId,
  });

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "achievement",
          id: plotFieldCommandId,
          text: textValue,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (translatedAchievement && !textValue.trim().length) {
      setTextValue((translatedAchievement.translations || [])[0]?.text || "");
      setInitialTextValue((translatedAchievement.translations || [])[0]?.text || "");
    }
  }, [translatedAchievement]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateAchievementText = useUpdateAchievementText({
    achievementId: translatedAchievement?.achievementId || "",
    achievementName: debouncedValue,
    storyId: storyId || "",
    language: "russian",
  });

  useEffect(() => {
    if (initialTextValue !== debouncedValue && debouncedValue?.trim().length) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "achievement",
          id: plotFieldCommandId,
          type: "command",
          value: debouncedValue,
        });
      }
      updateAchievementText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

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
          type="text"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
