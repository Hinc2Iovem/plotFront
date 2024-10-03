import { useState } from "react";
import WardrobeHeader from "./WardrobeHeader/WardrobeHeader";
import WardrobeItem from "./WardrobeItem";
import { BodyTypes } from "../../const/APPEARACE_PARTS";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import useGetAllAppearancePartsByCharacterIdAndType from "../../hooks/Fetching/AppearancePart/useGetAllAppearanceParts";

export default function Wardrobe() {
  const [bodyType, setBodyType] =
    useState<TranslationTextFieldNameAppearancePartsTypes>(BodyTypes[0]);
  const [characterId, setCharacterId] = useState("");

  const { data: appearanceParts } =
    useGetAllAppearancePartsByCharacterIdAndType({
      characterId,
      appearanceType: bodyType,
      language: "russian",
    });

  return (
    <section className="max-w-[146rem] p-[1rem] mx-auto">
      <WardrobeHeader
        setCharacterId={setCharacterId}
        characterId={characterId}
        setBodyType={setBodyType}
        bodyType={bodyType}
      />
      <main className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[1rem] justify-items-center justify-center w-full mt-[2rem]">
        {appearanceParts &&
          appearanceParts?.map((ap) => <WardrobeItem key={ap._id} {...ap} />)}
      </main>
    </section>
  );
}
