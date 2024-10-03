import { useEffect, useState } from "react";
import rejectImg from "../../../../../../assets/images/shared/rejectWhite.png";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useGetCommandWardrobe from "../hooks/Wardrobe/useGetCommandWardrobe";
import useGetCommandWardrobeTranslation from "../hooks/Wardrobe/useGetCommandWardrobeTranslation";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";
import useUpdateWardrobeTranslationText from "../hooks/Wardrobe/useUpdateWardrobeTranslationText";
import useGetAllWardrobeAppearancePartBlocks from "../hooks/Wardrobe/WardrobeAppearancePartBlock/useGetAllWardrobeAppearancePartBlocks";
import WardrobeAppearancePartBlock from "./WardrobeAppearancePartBlock";
import WardrobeCharacterAppearancePartForm from "./WardrobeCharacterAppearancePartForm";
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
  const [showAllAppearancePartBlocks, setShowAllAppearancePartBlocks] =
    useState(false);

  const { data: commandWardrobe } = useGetCommandWardrobe({
    plotFieldCommandId,
  });

  const { data: translatedWardrobe } = useGetCommandWardrobeTranslation({
    commandId: plotFieldCommandId || "",
  });

  const { data: allAppearancePartBlocks } =
    useGetAllWardrobeAppearancePartBlocks({ commandWardrobeId });

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

  const updateWardrobeIsCurrentlyDressed =
    useUpdateWardrobeCurrentDressedAndCharacterId({
      commandWardrobeId,
    });

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-light-blue rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white cursor-default">
          {nameValue}
        </h3>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow w-full flex gap-[1rem]"
      >
        <input
          value={wardrobeTitle}
          type="text"
          className=" w-full outline-gray-300 text-gray-600 text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]"
          placeholder="Название гардероба"
          onChange={(e) => setWardrobeTitle(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setIsCurrentlyDressed((prev) => !prev);
            updateWardrobeIsCurrentlyDressed.mutate({
              isCurrentDressed: !isCurrentlyDressed,
            });
          }}
          className={`text-[1.4rem] rounded-md shadow-md ${
            isCurrentlyDressed
              ? "bg-green-300 text-white"
              : "bg-white text-black"
          } px-[1rem] whitespace-nowrap outline-gray-300`}
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
          className="w-fit outline-gray-300 text-[1.3rem] self-end px-[1rem] bg-white rounded-md shadow-md py-[.5rem]"
        >
          Посмотреть Одежду
        </button>
      </div>
      <div
        onMouseLeave={() => setShowAllAppearancePartBlocks(false)}
        className={`${
          showAllAppearancePartBlocks ? "" : "hidden"
        } bottom-0 left-0 flex flex-col w-full bg-primary-light-blue rounded-md p-[.5rem] max-h-[17rem] absolute`}
      >
        <button
          onClick={() => setShowAllAppearancePartBlocks(false)}
          className="w-[3rem] rounded-full self-end outline-gray-500"
        >
          <img src={rejectImg} alt="X" className="w-full" />
        </button>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-[1rem] w-full h-[13rem] overflow-y-auto p-[.5rem] | containerScroll">
          {allAppearancePartBlocks?.map((a) => (
            <WardrobeAppearancePartBlock key={a._id} {...a} />
          ))}
        </div>
      </div>
    </div>
  );
}
