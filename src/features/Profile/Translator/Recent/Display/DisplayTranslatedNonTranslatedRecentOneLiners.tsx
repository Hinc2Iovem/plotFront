import { useEffect, useState } from "react";
import useGetTranslationCommandByCommandId from "../../../../../hooks/Fetching/Translation/PlotfieldCommands/useGetTranslationCommandByCommandId";
import useUpdateCommandTranslation, {
  CommandDynamicBodyNameVariationsTypes,
  CommandEndPointVariationsTypes,
} from "../../../../../hooks/Patching/Translation/useUpdateCommandTranslation";
import useDebounce from "../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCommandTypes } from "../../../../../types/Additional/TranslationTypes";
import "../../../../Editor/Flowchart/FlowchartStyles.css";

type DisplayTranslatedNonTranslatedRecentOneLinersTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translated: TranslationCommandTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function DisplayTranslatedNonTranslatedRecentOneLiners({
  translated,
  languageToTranslate,
  translateFromLanguage,
}: DisplayTranslatedNonTranslatedRecentOneLinersTypes) {
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

  useEffect(() => {
    if (translated) {
      setCommandId(translated.commandId);
      setTranslatedCommandName(translated.text || "");
      if (translated.textFieldName === "achievementName") {
        setDynamicCommandName("achievementName");
        setDynamicCommandEndPoint("achievements");
        setCommandTypeToRus("Ачивка");
      } else if (translated.textFieldName === "sayText") {
        setDynamicCommandName("text");
        setDynamicCommandEndPoint("say");
        setCommandTypeToRus("Реплика");
      } else if (translated.textFieldName === "commandWardrobeTitle") {
        setDynamicCommandName("title");
        setDynamicCommandEndPoint("wardrobes");
        setCommandTypeToRus("Тайтл Гардероба");
      }
    }
  }, [translated]);

  const { data: nonTranslatedCommand } = useGetTranslationCommandByCommandId({
    commandId,
    language: languageToTranslate,
  });

  useEffect(() => {
    if (nonTranslatedCommand) {
      nonTranslatedCommand.map((nt) => {
        setCommandName(nt.text);
      });
    } else {
      setCommandName("");
    }
  }, [nonTranslatedCommand, languageToTranslate]);

  const debouncedNameTranslated = useDebounce({
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
    updateCharacterTranslationTranslated.mutate({
      commandText: debouncedNameTranslated,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameTranslated]);

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
    updateCharacterTranslation.mutate({
      commandText: debouncedName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return (
    <div
      className={`h-fit sm:flex-row flex-col w-full flex gap-[.5rem] bg-primary-pastel-blue p-[.5rem] rounded-md`}
    >
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-white`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedCommandName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setTranslatedCommandName(e.target.value)}
          />
        </form>
      </div>
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-white`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={commandName}
            placeholder={commandTypeToRus}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setCommandName(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
