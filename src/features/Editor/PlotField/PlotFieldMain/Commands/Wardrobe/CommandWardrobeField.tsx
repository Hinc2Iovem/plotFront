import { useEffect, useState } from "react";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandWardrobe from "../../../hooks/Wardrobe/useGetCommandWardrobe";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";
import WardrobeAppearance from "./AppearanceParts/WardrobeAppearance";
import WardrobeTitle from "./WardrobeTitle/WardrobeTitle";
import "../Prompts/promptStyles.css";

type CommandWardrobeFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandWardrobeField({ plotFieldCommandId, topologyBlockId }: CommandWardrobeFieldTypes) {
  const [wardrobeTitle, setWardrobeTitle] = useState("");
  const [commandWardrobeId, setCommandWardrobeId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [isCurrentlyDressed, setIsCurrentlyDressed] = useState<boolean>(false);
  const { data: commandWardrobe } = useGetCommandWardrobe({
    plotFieldCommandId,
  });

  const [allAppearanceNames, setAllAppearanceNames] = useState<string[]>([]);

  useAddItemInsideSearch({
    commandName: "wardrobe",
    id: plotFieldCommandId,
    text: `${wardrobeTitle} ${allAppearanceNames.map((an) => `${an}`).join(" ")}`,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (commandWardrobe) {
      setCommandWardrobeId(commandWardrobe._id);
      setIsCurrentlyDressed(commandWardrobe?.isCurrentDressed || false);
      setCharacterId(commandWardrobe?.characterId || "");
    }
  }, [commandWardrobe]);

  return (
    <div className="flex gap-[5px] w-full rounded-md p-[5px] flex-col relative">
      <FocusedPlotfieldCommandNameField nameValue={"wardrobe"} plotFieldCommandId={plotFieldCommandId} />

      <WardrobeTitle
        allAppearanceNames={allAppearanceNames}
        commandWardrobeId={commandWardrobeId}
        isCurrentlyDressed={isCurrentlyDressed}
        plotFieldCommandId={plotFieldCommandId}
        setIsCurrentlyDressed={setIsCurrentlyDressed}
        setWardrobeTitle={setWardrobeTitle}
        topologyBlockId={topologyBlockId}
        wardrobeTitle={wardrobeTitle}
      />

      <WardrobeAppearance
        characterId={characterId}
        commandWardrobeId={commandWardrobeId}
        setAllAppearanceNames={setAllAppearanceNames}
      />
    </div>
  );
}
