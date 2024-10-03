import { useEffect, useState } from "react";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useUpdateChoiceOption from "../../../hooks/Choice/ChoiceOption/useUpdateChoiceOption";
import useGetRelationshipOption from "../../../hooks/Choice/ChoiceOptionVariation/useGetRelationshipOption";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";

type OptionRelationshipBlockTypes = {
  choiceOptionId: string;
};

export default function OptionRelationshipBlock({
  choiceOptionId,
}: OptionRelationshipBlockTypes) {
  const { data: optionRelationship } = useGetRelationshipOption({
    plotFieldCommandChoiceOptionId: choiceOptionId,
  });
  const [characterId, setCharacterId] = useState("");
  const [characterImg, setCharacterImg] = useState("");
  const [characterName, setCharacterName] = useState("");

  const { data: character } = useGetCharacterById({ characterId });

  useEffect(() => {
    if (character) {
      setCharacterImg(character?.img || "");
    }
  }, [character]);
  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId,
    language: "russian",
  });

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        if (tc.textFieldName === "characterName") {
          setCharacterName(tc?.text || "");
        }
      });
    }
  }, [translatedCharacter]);

  useEffect(() => {
    if (optionRelationship) {
      setCharacterId(optionRelationship.characterId);
    }
  }, [optionRelationship]);

  const [showAllCharacters, setShowAllCharacters] = useState(false);

  const [amountOfPoints, setAmountOfPoints] = useState(
    optionRelationship?.amountOfPoints || ""
  );

  useEffect(() => {
    if (optionRelationship) {
      setAmountOfPoints(optionRelationship.amountOfPoints);
    }
  }, [optionRelationship]);

  const updateOptionRelationship = useUpdateChoiceOption({
    choiceOptionId,
  });

  useEffect(() => {
    if (amountOfPoints) {
      updateOptionRelationship.mutate({ amountOfPoints: +amountOfPoints });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountOfPoints]);

  useEffect(() => {
    if (characterId?.trim().length) {
      updateOptionRelationship.mutate({
        characterId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  const characterDebouncedValue = useDebounce({
    value: characterName,
    delay: 500,
  });
  return (
    <div className="self-end w-full px-[.5rem] flex gap-[1rem] flex-grow flex-wrap mt-[.5rem]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowAllCharacters(false);
        }}
        className="w-full relative flex gap-[.5rem] items-center"
      >
        <input
          onClick={(e) => {
            e.stopPropagation();
            setShowAllCharacters(true);
          }}
          value={characterName}
          onChange={(e) => {
            setShowAllCharacters(true);
            setCharacterName(e.target.value);
          }}
          placeholder="Имя Персонажа"
          className="flex-grow text-[1.4rem] outline-gray-300 bg-white rounded-md px-[1rem] py-[.5rem] shadow-md"
        />

        <img
          src={characterImg}
          alt="CharacterImg"
          className={`${
            characterImg?.trim().length ? "" : "hidden"
          } w-[3rem] object-cover rounded-md self-end`}
        />
        <PlotfieldCharacterPromptMain
          characterDebouncedValue={characterDebouncedValue}
          setCharacterId={setCharacterId}
          setCharacterName={setCharacterName}
          setShowCharacterModal={setShowAllCharacters}
          showCharacterModal={showAllCharacters}
          setCharacterImg={setCharacterImg}
        />
      </form>
      <input
        type="text"
        placeholder="Очки характеристики"
        className="flex-grow  text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-gray-300 rounded-md shadow-md"
        value={amountOfPoints || ""}
        onChange={(e) => setAmountOfPoints(+e.target.value)}
      />
    </div>
  );
}
