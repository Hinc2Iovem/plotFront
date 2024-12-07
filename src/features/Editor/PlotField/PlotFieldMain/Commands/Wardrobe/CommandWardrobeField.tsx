import { useEffect, useRef, useState } from "react";
import rejectImg from "../../../../../../assets/images/shared/rejectWhite.png";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetCommandWardrobe from "../../../hooks/Wardrobe/useGetCommandWardrobe";
import useGetCommandWardrobeTranslation from "../../../hooks/Wardrobe/useGetCommandWardrobeTranslation";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../../../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";
import useUpdateWardrobeTranslationText from "../../../hooks/Wardrobe/useUpdateWardrobeTranslationText";
import useGetAllWardrobeAppearancePartBlocks from "../../../hooks/Wardrobe/WardrobeAppearancePartBlock/useGetAllWardrobeAppearancePartBlocks";
import "../Prompts/promptStyles.css";
import WardrobeAppearancePartBlock from "./WardrobeAppearancePartBlock";
import WardrobeCharacterAppearancePartForm from "./WardrobeCharacterAppearancePartForm";
import useSearch from "../../Search/SearchContext";
import { useParams } from "react-router-dom";

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
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Wardrobe");
  const [wardrobeTitle, setWardrobeTitle] = useState("");
  const [commandWardrobeId, setCommandWardrobeId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [isCurrentlyDressed, setIsCurrentlyDressed] = useState<boolean>(false);
  const [showAllAppearancePartBlocks, setShowAllAppearancePartBlocks] = useState(false);
  const theme = localStorage.getItem("theme");
  const { data: commandWardrobe } = useGetCommandWardrobe({
    plotFieldCommandId,
  });

  const [allAppearanceNames, setAllAppearanceNames] = useState([""]);

  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

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

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "wardrobe",
          id: plotFieldCommandId,
          text: `${wardrobeTitle}`,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  const updateWardrobeTranslatedTitle = useUpdateWardrobeTranslationText({
    commandId: plotFieldCommandId,
    title: wardrobeTitle,
    topologyBlockId,
    language: "russian",
  });

  const debouncedValue = useDebounce({ value: wardrobeTitle, delay: 500 });

  useEffect(() => {
    if (debouncedValue?.trim().length) {
      updateWardrobeTranslatedTitle.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const updateWardrobeIsCurrentlyDressed = useUpdateWardrobeCurrentDressedAndCharacterId({
    commandWardrobeId,
  });

  useOutOfModal({
    modalRef: appearancePartsRef,
    showModal: showAllAppearancePartBlocks,
    setShowModal: setShowAllAppearancePartBlocks,
  });

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "wardrobe",
        id: plotFieldCommandId,
        type: "command",
        value: `${wardrobeTitle} ${allAppearanceNames.map((an) => `${an}`).join(" ")}`,
      });
    }
  }, [allAppearanceNames, episodeId, wardrobeTitle]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full flex gap-[1rem]">
        <PlotfieldInput
          focusedSecondTime={focusedSecondTime}
          onBlur={() => {
            setFocusedSecondTime(false);
          }}
          setFocusedSecondTime={setFocusedSecondTime}
          value={wardrobeTitle}
          type="text"
          placeholder="Название гардероба"
          onChange={(e) => setWardrobeTitle(e.target.value)}
        />
        <button
          type="button"
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

      <WardrobeCharacterAppearancePartForm
        commandWardrobeId={commandWardrobeId}
        setCharacterId={setCharacterId}
        characterId={characterId}
      />

      <div className="w-full flex flex-col">
        <button
          onMouseOver={() => setShowAllAppearancePartBlocks(true)}
          className={`w-fit  ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-[1.4rem] text-text-dark hover:text-text-light self-end px-[1rem] bg-secondary rounded-md shadow-md py-[.5rem]`}
        >
          Посмотреть Одежду
        </button>
      </div>
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
