import { useEffect, useState } from "react";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandWardrobe from "../../../hooks/Wardrobe/useGetCommandWardrobe";
import "../Prompts/promptStyles.css";
import WardrobeAppearance from "./AppearanceParts/WardrobeAppearance";
import WardrobeTitle from "./WardrobeTitle/WardrobeTitle";

type CommandWardrobeFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandWardrobeField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandWardrobeFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Wardrobe");
  const [wardrobeTitle, setWardrobeTitle] = useState("");
  const [commandWardrobeId, setCommandWardrobeId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [isCurrentlyDressed, setIsCurrentlyDressed] = useState<boolean>(false);
  const { data: commandWardrobe } = useGetCommandWardrobe({
    plotFieldCommandId,
  });

  const [allAppearanceNames, setAllAppearanceNames] = useState<string[]>([]);

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  useAddItemInsideSearch({
    commandName: nameValue || "wardrobe",
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
      <div className="min-w-[100px] flex-grow">
        <PlotfieldCommandNameField
          className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"} text-[30px] text-center`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
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
