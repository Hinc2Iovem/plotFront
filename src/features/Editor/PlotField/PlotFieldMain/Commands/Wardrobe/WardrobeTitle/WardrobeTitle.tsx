import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../Context/Search/SearchContext";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../../../../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";
import useUpdateWardrobeTranslationText from "../../../../hooks/Wardrobe/useUpdateWardrobeTranslationText";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import useGetCommandWardrobeTranslation from "@/features/Editor/PlotField/hooks/Wardrobe/useGetCommandWardrobeTranslation";

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

  const { data: translatedWardrobe } = useGetCommandWardrobeTranslation({
    commandId: plotFieldCommandId || "",
  });

  useEffect(() => {
    if (translatedWardrobe && !wardrobeTitle.trim().length) {
      translatedWardrobe.translations?.map((tw) => {
        if (tw.textFieldName === "commandWardrobeTitle") {
          setWardrobeTitle(tw.text);
        }
      });
    }
  }, [translatedWardrobe]);

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
    <form onSubmit={(e) => e.preventDefault()} className="flex-grow flex gap-[5px]">
      <PlotfieldInput
        value={wardrobeTitle}
        type="text"
        onBlur={onBlur}
        placeholder="Название гардероба"
        onChange={(e) => setWardrobeTitle(e.target.value)}
      />
      <Button
        type="button"
        disabled={updateWardrobeIsCurrentlyDressed.isPending}
        onClick={(e) => {
          setIsCurrentlyDressed((prev) => !prev);
          updateWardrobeIsCurrentlyDressed.mutate({
            isCurrentDressed: !isCurrentlyDressed,
          });
          e.currentTarget.blur();
        }}
        className={`text-[17px] rounded-md shadow-sm hover:scale-[1.01] ${
          isCurrentlyDressed ? "bg-green hover:shadow-green" : "bg-orange hover:shadow-orange"
        } px-[10px] text-text whitespace-nowrap hover:opacity-80 active:scale-[0.99] transition-all`}
      >
        {isCurrentlyDressed ? "Надето" : "Не надето"}
      </Button>
    </form>
  );
}
