import { useState } from "react";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import "../../Character/characterStyle.css";
import WardrobeHeaderChooceAppearaceType from "./WardrobeHeaderChooceAppearaceType";
import WardrobeHeaderChooseCharacter from "./WardrobeHeaderChooseCharacter";
import WardrobeHeaderCreateAppearancePart from "./WardrobeHeaderCreateAppearancePart";

type WardrobeHeaderTypes = {
  setBodyType: React.Dispatch<
    React.SetStateAction<TranslationTextFieldNameAppearancePartsTypes>
  >;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  bodyType: TranslationTextFieldNameAppearancePartsTypes;
  characterId: string;
};

export default function WardrobeHeader({
  bodyType,
  setBodyType,
  characterId,
  setCharacterId,
}: WardrobeHeaderTypes) {
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showBodyTypeModal, setShowBodyTypeModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="flex flex-col gap-[1rem]">
      <div className="flex gap-[1rem] flex-wrap">
        <WardrobeHeaderChooceAppearaceType
          bodyType={bodyType}
          setBodyType={setBodyType}
          setShowBodyTypeModal={setShowBodyTypeModal}
          setShowCharacterModal={setShowCharacterModal}
          showBodyTypeModal={showBodyTypeModal}
          setShowModal={setShowModal}
        />

        <WardrobeHeaderChooseCharacter
          setCharacterId={setCharacterId}
          setShowBodyTypeModal={setShowBodyTypeModal}
          setShowCharacterModal={setShowCharacterModal}
          showCharacterModal={showCharacterModal}
          setShowModal={setShowModal}
        />

        {characterId ? (
          <WardrobeHeaderCreateAppearancePart
            characterId={characterId}
            appearanceType={bodyType}
            setShowBodyTypeModal={setShowBodyTypeModal}
            setShowCharacterModal={setShowCharacterModal}
            setShowModal={setShowModal}
            showModal={showModal}
          />
        ) : null}
      </div>
    </header>
  );
}
