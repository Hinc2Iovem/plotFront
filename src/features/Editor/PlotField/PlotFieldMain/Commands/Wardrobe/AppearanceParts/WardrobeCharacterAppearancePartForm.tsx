import { useEffect, useState } from "react";
import useDebounce from "../../../../../../../hooks/utilities/useDebounce";
import useCreateWardrobeAppearanceTypeBlock from "../../../../hooks/Wardrobe/WardrobeAppearancePartBlock/useCreateWardrobeAppearanceTypeBlock";
import CommandWardrobeChoosingAppearanceType from "./CommandWardrobeChoosingAppearanceType";
import CommandWardrobeCharacter from "../Character/CommandWardrobeCharacter";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldAppearancePartPromptMain from "../../Prompts/AppearanceParts/PlotfieldAppearancePartPromptMain";

type WardrobeCharacterAppearancePartFormTypes = {
  characterId: string;
  commandWardrobeId: string;
};

export type PossibleWardrobeAppearancePartVariationsTypes = "hair" | "dress" | "temp";

export default function WardrobeCharacterAppearancePartForm({
  commandWardrobeId,
  characterId,
}: WardrobeCharacterAppearancePartFormTypes) {
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  const [appearancePartId, setAppearancePartId] = useState("");
  const [appearancePartName, setAppearancePartName] = useState("");
  const [appearancePartVariationType, setAppearancePartVariationType] =
    useState<PossibleWardrobeAppearancePartVariationsTypes>("" as PossibleWardrobeAppearancePartVariationsTypes);
  const theme = localStorage.getItem("theme");
  const [showAppearancePartVariationModal, setShowAppearancePartVariationModal] = useState(false);
  const [showAppearancePartModal, setShowAppearancePartModal] = useState(false);

  const createAppearancePartBlock = useCreateWardrobeAppearanceTypeBlock({
    appearancePartId,
    commandWardrobeId,
  });

  useEffect(() => {
    if (appearancePartId?.trim().length) {
      createAppearancePartBlock.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appearancePartId]);

  useEffect(() => {
    if (createAppearancePartBlock.data) {
      setAppearancePartName("");
    }
  }, [createAppearancePartBlock]);

  const appearancePartDebouncedValue = useDebounce({
    value: appearancePartName,
    delay: 500,
  });

  return (
    <div onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full flex flex-col gap-[1rem] relative">
      <CommandWardrobeCharacter
        characterId={characterId}
        commandWardrobeId={commandWardrobeId}
        setShowAppearancePartModal={setShowAppearancePartModal}
        setShowAppearancePartVariationModal={setShowAppearancePartVariationModal}
        setShowCharacterModal={setShowCharacterModal}
        showCharacterModal={showCharacterModal}
      />
      <div className="w-full flex gap-[1rem] sm:flex-row flex-col">
        <CommandWardrobeChoosingAppearanceType
          setAppearancePartVariationType={setAppearancePartVariationType}
          setShowAppearancePartModal={setShowAppearancePartModal}
          setShowAppearancePartVariationModal={setShowAppearancePartVariationModal}
          setShowCharacterModal={setShowCharacterModal}
          showAppearancePartVariationModal={showAppearancePartVariationModal}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="w-full relative"
        >
          {/* TODO can be better, I mean sending request to backend, */}
          <PlotfieldInput
            onBlur={() => {}}
            onClick={(e) => {
              e.stopPropagation();
              setShowCharacterModal(false);
              setShowAppearancePartVariationModal(false);
              setShowAppearancePartModal((prev) => !prev);
            }}
            placeholder="Одежда"
            value={appearancePartName || ""}
            onChange={(e) => {
              setAppearancePartName(e.target.value);
              setShowAppearancePartModal(true);
            }}
            className={`w-full text-[1.4rem] text-start ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } text-text-light bg-secondary rounded-md px-[1rem] py-[.5rem] shadow-md flex items-center justify-between`}
          />
          <PlotfieldAppearancePartPromptMain
            appearancePartDebouncedValue={appearancePartDebouncedValue}
            setAppearancePartId={setAppearancePartId}
            appearancePartVariationType={appearancePartVariationType}
            characterId={characterId}
            setShowAppearancePartModal={setShowAppearancePartModal}
            showAppearancePartModal={showAppearancePartModal}
          />
        </form>
      </div>
    </div>
  );
}
