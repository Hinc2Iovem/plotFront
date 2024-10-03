import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useGetTranslationAchievementEnabled from "../hooks/Achievement/useGetTranslationAchievementEnabled";
import useUpdateAchievementText from "../hooks/Achievement/useUpdateAchievementText";

type CommandAchievementFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandAchievementField({
  plotFieldCommandId,
  topologyBlockId,
  command,
}: CommandAchievementFieldTypes) {
  const { storyId } = useParams();
  const [nameValue] = useState(command ?? "achievement");
  const [initialTextValue, setInitialTextValue] = useState("");
  const [textValue, setTextValue] = useState("");

  const { data: translatedAchievement } = useGetTranslationAchievementEnabled({
    commandId: plotFieldCommandId,
  });

  useEffect(() => {
    if (translatedAchievement && !textValue.trim().length) {
      setTextValue((translatedAchievement.translations || [])[0]?.text || "");
      setInitialTextValue(
        (translatedAchievement.translations || [])[0]?.text || ""
      );
    }
  }, [translatedAchievement]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateAchievementText = useUpdateAchievementText({
    commandId: plotFieldCommandId,
    achievementName: debouncedValue,
    storyId: storyId || "",
    topologyBlockId,
    language: "russian",
  });

  useEffect(() => {
    if (initialTextValue !== debouncedValue && debouncedValue?.trim().length) {
      updateAchievementText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-light-blue rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white cursor-default">
          {nameValue}
        </h3>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow w-full"
      >
        <input
          value={textValue}
          type="text"
          className=" w-full outline-gray-300 text-gray-600 text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
