import { useEffect, useRef, useState } from "react";
import useUpdateCommandTranslation, {
  CommandDynamicBodyNameVariationsTypes,
  CommandEndPointVariationsTypes,
} from "../../../../../../hooks/Patching/Translation/useUpdateCommandTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { CombinedTranslatedAndNonTranslatedPlotTypes } from "../../Filters/FiltersEverythingPlot";
import "../../../../../Editor/Flowchart/FlowchartStyles.css";

type DisplayTranslatedNonTranslatedPlotOneLinersTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
} & CombinedTranslatedAndNonTranslatedPlotTypes;

export default function DisplayTranslatedNonTranslatedPlotOneLiners({
  nonTranslated,
  translated,
  languageToTranslate,
  translateFromLanguage,
}: DisplayTranslatedNonTranslatedPlotOneLinersTypes) {
  const [translatedCommandName, setTranslatedCommandName] = useState("");
  const [commandTypeToRus, setCommandTypeToRus] = useState("");
  const [commandName, setCommandName] = useState("");
  const [commandId, setCommandId] = useState("");
  const [dynamicCommandName, setDynamicCommandName] =
    useState<CommandDynamicBodyNameVariationsTypes>(
      "" as CommandDynamicBodyNameVariationsTypes
    );
  const [dynamicCommandEndPoint, setDynamicCommandEndPoint] =
    useState<CommandEndPointVariationsTypes>(
      "" as CommandEndPointVariationsTypes
    );
  const hasMounted = useRef(false);

  useEffect(() => {
    if (translated) {
      setCommandId(translated.commandId);
      if (translated.textFieldName === "achievementName") {
        setDynamicCommandName("achievementName");
        setDynamicCommandEndPoint("achievements");
        setTranslatedCommandName(translated.text);
        setCommandTypeToRus("Ачивка");
      } else if (translated.textFieldName === "sayText") {
        setDynamicCommandName("text");
        setDynamicCommandEndPoint("say");
        setTranslatedCommandName(translated.text);
        setCommandTypeToRus("Реплика");
      } else if (translated.textFieldName === "commandWardrobeTitle") {
        setDynamicCommandName("title");
        setDynamicCommandEndPoint("wardrobes");
        setTranslatedCommandName(translated.text);
        setCommandTypeToRus("Тайтл Гардероба");
      }
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      setCommandName(nonTranslated.text);
    } else {
      setCommandName("");
    }
  }, [nonTranslated, languageToTranslate]);

  const translatedDebouncedName = useDebounce({
    value: translatedCommandName,
    delay: 500,
  });

  const updateCharacterTranslationTranslated = useUpdateCommandTranslation({
    language: translateFromLanguage,
    commandId,
    commandEndPoint: dynamicCommandEndPoint,
    dynamicCommandName,
  });

  useEffect(() => {
    if (hasMounted.current && translatedDebouncedName.trim().length) {
      updateCharacterTranslationTranslated.mutate({
        commandText: translatedDebouncedName,
      });
    } else {
      hasMounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedDebouncedName]);

  const debouncedName = useDebounce({
    value: commandName,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateCommandTranslation({
    language: languageToTranslate,
    commandId,
    commandEndPoint: dynamicCommandEndPoint,
    dynamicCommandName,
  });

  useEffect(() => {
    if (hasMounted.current && debouncedName.trim().length) {
      updateCharacterTranslation.mutate({
        commandText: debouncedName,
      });
    } else {
      hasMounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return (
    <div
      className={`h-fit sm:flex-row flex-col w-full flex gap-[.5rem] bg-primary-darker p-[.5rem] rounded-md`}
    >
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-secondary`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedCommandName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setTranslatedCommandName(e.target.value)}
          />
        </form>
      </div>
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-secondary`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={commandName}
            placeholder={commandTypeToRus}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setCommandName(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
