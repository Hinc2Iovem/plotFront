import CommandWardrobeCharacter from "../Character/CommandWardrobeCharacter";
import WardrobeAppearancePartsField from "./WardrobeAppearancePartsField";

type WardrobeCharacterAppearancePartFormTypes = {
  characterId: string;
  commandWardrobeId: string;
};

export type PossibleWardrobeAppearancePartVariationsTypes = "hair" | "dress" | "temp";

export default function WardrobeCharacterAppearancePartForm({
  commandWardrobeId,
  characterId,
}: WardrobeCharacterAppearancePartFormTypes) {
  return (
    <div onSubmit={(e) => e.preventDefault()} className="flex-grow flex flex-col gap-[5px] relative">
      <CommandWardrobeCharacter characterId={characterId} commandWardrobeId={commandWardrobeId} />
      <WardrobeAppearancePartsField commandWardrobeId={commandWardrobeId} />
    </div>
  );
}
