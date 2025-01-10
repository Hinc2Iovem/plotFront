import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../Context/Search/SearchContext";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../../../../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";
import useUpdateWardrobeTranslationText from "../../../../hooks/Wardrobe/useUpdateWardrobeTranslationText";

type WardrobeTitleTypes = {
  plotFieldCommandId: string;
  wardrobeTitle: string;
  topologyBlockId: string;
  commandWardrobeId: string;
  isCurrentlyDressed: boolean;
  allAppearanceNames: string[];
  setIsCurrentlyDressed: React.Dispatch<React.SetStateAction<boolean>>;
  setWardrobeTitle: React.Dispatch<React.SetStateAction<string>>;
};

export default function WardrobeTitle({
  isCurrentlyDressed,
  plotFieldCommandId,
  commandWardrobeId,
  allAppearanceNames,
  setIsCurrentlyDressed,
  setWardrobeTitle,
  topologyBlockId,
  wardrobeTitle,
}: WardrobeTitleTypes) {
  const { episodeId } = useParams();
  const { updateValue } = useSearch();

  const theme = localStorage.getItem("theme");

  const updateWardrobeTranslatedTitle = useUpdateWardrobeTranslationText({
    commandId: plotFieldCommandId,
    title: wardrobeTitle,
    topologyBlockId,
    language: "russian",
  });

  const updateWardrobeIsCurrentlyDressed = useUpdateWardrobeCurrentDressedAndCharacterId({
    commandWardrobeId,
  });

  const onBlur = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "wardrobe",
        id: plotFieldCommandId,
        type: "command",
        value: `${wardrobeTitle} ${allAppearanceNames.map((an) => `${an}`).join(" ")}`,
      });
      updateWardrobeTranslatedTitle.mutate();
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow flex gap-[1rem]">
      <PlotfieldInput
        value={wardrobeTitle}
        type="text"
        onBlur={onBlur}
        placeholder="Название гардероба"
        onChange={(e) => setWardrobeTitle(e.target.value)}
      />
      <button
        type="button"
        disabled={updateWardrobeIsCurrentlyDressed.isPending}
        onClick={(e) => {
          setIsCurrentlyDressed((prev) => !prev);
          updateWardrobeIsCurrentlyDressed.mutate({
            isCurrentDressed: !isCurrentlyDressed,
          });
          e.currentTarget.blur();
        }}
        className={`text-[1.4rem] rounded-md shadow-md ${
          isCurrentlyDressed
            ? `${
                theme === "light"
                  ? "bg-green-300 text-text-dark"
                  : "bg-green-400 text-text-light hover:bg-secondary hover:text-text-light focus-within:bg-secondary focus-within:text-text-light"
              }`
            : `${
                theme === "light"
                  ? "bg-secondary text-black"
                  : "hover:bg-green-400 hover:text-text-light bg-secondary text-text-light focus-within:bg-green-400 focus-within:text-text-light"
              }`
        } px-[1rem] whitespace-nowrap ${theme === "light" ? "outline-gray-300" : "outline-gray-600"}`}
      >
        {isCurrentlyDressed ? "Надето" : "Не надето"}
      </button>
    </form>
  );
}
