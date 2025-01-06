import { useEffect, useRef, useState } from "react";
import rejectImg from "../../../../../../assets/images/shared/rejectWhite.png";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandWardrobe from "../../../hooks/Wardrobe/useGetCommandWardrobe";
import useGetCommandWardrobeTranslation from "../../../hooks/Wardrobe/useGetCommandWardrobeTranslation";
import useGetAllWardrobeAppearancePartBlocks from "../../../hooks/Wardrobe/WardrobeAppearancePartBlock/useGetAllWardrobeAppearancePartBlocks";
import WardrobeAppearanceNames from "./WardrobeAppearanceNames/WardrobeAppearanceNames";
import WardrobeAppearancePartBlock from "./AppearanceParts/WardrobeAppearancePartBlock";
import WardrobeTitle from "./WardrobeTitle/WardrobeTitle";
import WardrobeCharacterAppearancePartForm from "./AppearanceParts/WardrobeCharacterAppearancePartForm";
import "../Prompts/promptStyles.css";

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
  const [showAllAppearancePartBlocks, setShowAllAppearancePartBlocks] = useState(false);
  const { data: commandWardrobe } = useGetCommandWardrobe({
    plotFieldCommandId,
  });

  const [allAppearanceNames, setAllAppearanceNames] = useState<string[]>([]);

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const appearancePartsRef = useRef<HTMLDivElement>(null);

  const { data: translatedWardrobe } = useGetCommandWardrobeTranslation({
    commandId: plotFieldCommandId || "",
  });

  const { data: allAppearancePartBlocks } = useGetAllWardrobeAppearancePartBlocks({ commandWardrobeId });

  useEffect(() => {
    if (commandWardrobe) {
      setCommandWardrobeId(commandWardrobe._id);
      setIsCurrentlyDressed(commandWardrobe?.isCurrentDressed || false);
      setCharacterId(commandWardrobe?.characterId || "");
    }
  }, [commandWardrobe]);

  useEffect(() => {
    if (translatedWardrobe && !wardrobeTitle.trim().length) {
      translatedWardrobe.translations?.map((tw) => {
        if (tw.textFieldName === "commandWardrobeTitle") {
          setWardrobeTitle(tw.text);
        }
      });
    }
  }, [translatedWardrobe]);

  useAddItemInsideSearch({
    commandName: nameValue || "wardrobe",
    id: plotFieldCommandId,
    text: `${wardrobeTitle} ${allAppearanceNames.map((an) => `${an}`).join(" ")}`,
    topologyBlockId,
    type: "command",
  });

  useOutOfModal({
    modalRef: appearancePartsRef,
    showModal: showAllAppearancePartBlocks,
    setShowModal: setShowAllAppearancePartBlocks,
  });

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
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

      <WardrobeCharacterAppearancePartForm commandWardrobeId={commandWardrobeId} characterId={characterId} />

      <WardrobeAppearanceNames
        allAppearanceNames={allAppearanceNames}
        setShowAllAppearancePartBlocks={setShowAllAppearancePartBlocks}
      />

      <div
        ref={appearancePartsRef}
        className={`${
          showAllAppearancePartBlocks ? "" : "hidden"
        } bottom-0 left-0 flex flex-col w-full bg-primary-darker rounded-md p-[.5rem] max-h-[17rem] absolute`}
      >
        <button
          onClick={() => setShowAllAppearancePartBlocks(false)}
          className="w-[3rem] rounded-full self-end outline-gray-500"
        >
          <img src={rejectImg} alt="X" className="w-full" />
        </button>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-[1rem] w-full h-[13rem] overflow-y-auto p-[.5rem] | containerScroll">
          {allAppearancePartBlocks?.map((a) => (
            <WardrobeAppearancePartBlock key={a._id} {...a} setAllAppearanceNames={setAllAppearanceNames} />
          ))}
        </div>
      </div>
    </div>
  );
}
