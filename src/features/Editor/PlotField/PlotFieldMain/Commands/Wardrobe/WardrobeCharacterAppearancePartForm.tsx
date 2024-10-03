import { useEffect, useState } from "react";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useCreateWardrobeAppearanceTypeBlock from "../hooks/Wardrobe/WardrobeAppearancePartBlock/useCreateWardrobeAppearanceTypeBlock";
import PlotfieldAppearancePartPromptMain from "../Prompts/AppearanceParts/PlotfieldAppearancePartPromptMain";
import CommandWardrobeChoosingAppearanceType from "./CommandWardrobeChoosingAppearanceType";
import CommandWardrobeCharacter from "./CommandWardrobeCharacter";

type WardrobeCharacterAppearancePartFormTypes = {
  characterId: string;
  commandWardrobeId: string;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
};

export type PossibleWardrobeAppearancePartVariationsTypes =
  | "hair"
  | "dress"
  | "other";

export default function WardrobeCharacterAppearancePartForm({
  commandWardrobeId,
  characterId,
  setCharacterId,
}: WardrobeCharacterAppearancePartFormTypes) {
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  const [appearancePartId, setAppearancePartId] = useState("");
  const [appearancePartName, setAppearancePartName] = useState("");
  const [appearancePartVariationType, setAppearancePartVariationType] =
    useState<PossibleWardrobeAppearancePartVariationsTypes>(
      "" as PossibleWardrobeAppearancePartVariationsTypes
    );
  const [
    showAppearancePartVariationModal,
    setShowAppearancePartVariationModal,
  ] = useState(false);
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
    <div
      onSubmit={(e) => e.preventDefault()}
      className="sm:w-[77%] flex-grow w-full flex flex-col gap-[1rem] relative"
    >
      <CommandWardrobeCharacter
        characterId={characterId}
        commandWardrobeId={commandWardrobeId}
        setCharacterId={setCharacterId}
        setShowAppearancePartModal={setShowAppearancePartModal}
        setShowAppearancePartVariationModal={
          setShowAppearancePartVariationModal
        }
        setShowCharacterModal={setShowCharacterModal}
        showCharacterModal={showCharacterModal}
      />
      <div className="w-full flex gap-[1rem] sm:flex-row flex-col">
        <CommandWardrobeChoosingAppearanceType
          setAppearancePartVariationType={setAppearancePartVariationType}
          setShowAppearancePartModal={setShowAppearancePartModal}
          setShowAppearancePartVariationModal={
            setShowAppearancePartVariationModal
          }
          setShowCharacterModal={setShowCharacterModal}
          showAppearancePartVariationModal={showAppearancePartVariationModal}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="w-full relative"
        >
          <input
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
            className="w-full text-[1.4rem] text-start outline-gray-300 bg-white rounded-md px-[1rem] py-[.5rem] shadow-md flex items-center justify-between"
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
