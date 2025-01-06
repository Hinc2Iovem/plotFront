import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandAchievement from "../../../hooks/Achievement/CommandAchievement/useGetCommandAchievement";
import useUpdateCommandAchievement from "../../../hooks/Achievement/Update/useUpdateCommandAchievement";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

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
  const { episodeId } = useParams();
  const [nameValue] = useState(command ?? "achievement");
  const [initialTextValue, setInitialTextValue] = useState("");
  const [currentAchievement, setCurrentAchievement] = useState({
    textValue: "",
    id: "",
  });
  const currentInput = useRef<HTMLInputElement | null>(null);
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;
  const { data: achievement } = useGetCommandAchievement({ plotFieldCommandId, language: "russian" });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "achievement",
    id: plotFieldCommandId,
    text: currentAchievement.textValue,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (achievement && !currentAchievement.textValue.trim().length) {
      setCurrentAchievement((prev) => ({
        ...prev,
        textValue: (achievement.translations || [])[0]?.text || "",
      }));
      setInitialTextValue((achievement.translations || [])[0]?.text || "");
    }
  }, [achievement]);

  useEffect(() => {
    if (achievement) {
      setCurrentAchievement((prev) => ({
        ...prev,
        id: achievement?.achievementId || "",
      }));
    }
  }, [achievement]);

  const { mutate: updateAchievementText } = useUpdateCommandAchievement({
    language: "russian",
    plotFieldCommandId,
    setCurrentAchievement,
  });

  const onBlur = () => {
    if (initialTextValue !== currentAchievement.textValue) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "achievement",
          id: plotFieldCommandId,
          type: "command",
          value: currentAchievement.textValue,
        });
      }
      updateAchievementText({ text: currentAchievement.textValue });
      setInitialTextValue(currentAchievement.textValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField
          className={`${
            isCommandFocused
              ? "bg-gradient-to-r from-brand-gradient-left from-0% to-brand-gradient-right to-90%"
              : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
        <PlotfieldInput
          ref={currentInput}
          value={currentAchievement.textValue}
          onBlur={onBlur}
          type="text"
          placeholder="Such a lovely day"
          onChange={(e) =>
            setCurrentAchievement((prev) => ({
              ...prev,
              textValue: e.target.value,
            }))
          }
        />
      </form>
    </div>
  );
}
