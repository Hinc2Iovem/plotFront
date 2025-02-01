import CommandWardrobeCharacter from "../Character/CommandWardrobeCharacter";
import WardrobeAppearancePartsField from "./WardrobeAppearancePartsField";

type WardrobeCharacterAppearancePartFormTypes = {
  characterId: string;
  commandWardrobeId: string;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
};

export type PossibleWardrobeAppearancePartVariationsTypes = "hair" | "dress" | "temp";

export default function WardrobeCharacterAppearancePartForm({
  commandWardrobeId,
  characterId,
  setCharacterId,
}: WardrobeCharacterAppearancePartFormTypes) {
  return (
    <div className="flex-grow flex flex-col gap-[5px] relative">
      <CommandWardrobeCharacter
        setCharacterId={setCharacterId}
        characterId={characterId}
        commandWardrobeId={commandWardrobeId}
      />
      <WardrobeAppearancePartsField characterId={characterId} commandWardrobeId={commandWardrobeId} />
    </div>
  );
}
