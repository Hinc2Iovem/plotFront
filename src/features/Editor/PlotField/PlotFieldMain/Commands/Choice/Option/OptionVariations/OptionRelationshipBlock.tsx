import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../../../Context/Search/SearchContext";
import useUpdateChoiceOption from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOption";
import useGetRelationshipOption from "../../../../../hooks/Choice/ChoiceOptionVariation/useGetRelationshipOption";
import PlotfieldCharacterPromptMain, { ExposedMethods } from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import usePrepareCharacterDataOptionRelationship from "./usePrepareCharacterDataOptionRelationship";

type OptionRelationshipBlockTypes = {
  choiceOptionId: string;
  debouncedValue: string;
};

export default function OptionRelationshipBlock({ choiceOptionId, debouncedValue }: OptionRelationshipBlockTypes) {
  const { episodeId } = useParams();
  const { data: optionRelationship } = useGetRelationshipOption({
    plotFieldCommandChoiceOptionId: choiceOptionId,
  });
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: null,
    characterName: null,
    imgUrl: null,
  });

  const theme = localStorage.getItem("theme");

  usePrepareCharacterDataOptionRelationship({ characterValue, setCharacterValue });

  const [showAllCharacters, setShowAllCharacters] = useState(false);

  const [amountOfPoints, setAmountOfPoints] = useState(optionRelationship?.amountOfPoints || "");

  useEffect(() => {
    if (optionRelationship) {
      setCharacterValue((prev) => ({
        ...prev,
        _id: optionRelationship.characterId,
      }));
      setAmountOfPoints(optionRelationship.amountOfPoints);
    }
  }, [optionRelationship]);

  const updateOptionRelationship = useUpdateChoiceOption({
    choiceOptionId,
  });

  const inputRef = useRef<ExposedMethods>(null);

  const onBlurCharacter = () => {
    if (inputRef.current) {
      inputRef.current.updateCharacterNameOnBlur();
    }
  };

  const preventRerender = useRef(false);

  useEffect(() => {
    if (characterValue._id?.trim().length && preventRerender.current) {
      updateOptionRelationship.mutate({
        characterId: characterValue._id,
      });
    }
    return () => {
      preventRerender.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterValue._id]);

  const onBlur = () => {
    if (amountOfPoints) {
      updateOptionRelationship.mutate({ amountOfPoints: +amountOfPoints });
    }
  };

  const { updateValue } = useSearch();

  const updateValues = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: `Choice - Relationship`,
        id: choiceOptionId,
        value: `${debouncedValue} ${
          typeof characterValue.characterName === "string" ? characterValue.characterName : ""
        } ${amountOfPoints}`,
        type: "choiceOption",
      });
    }
  };

  useEffect(() => {
    updateValues;
  }, [episodeId]);

  return (
    <div className="self-end w-full px-[.5rem] flex gap-[1rem] flex-grow flex-wrap mt-[.5rem]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowAllCharacters(false);
        }}
        className="w-full relative flex gap-[.5rem]"
      >
        <input
          onClick={(e) => {
            e.stopPropagation();
            setShowAllCharacters(true);
          }}
          value={characterValue.characterName || ""}
          onChange={(e) => {
            setShowAllCharacters(true);
            setCharacterValue((prev) => ({
              ...prev,
              characterName: e.target.value,
            }));
          }}
          onBlur={onBlurCharacter}
          placeholder="Имя Персонажа"
          className={`w-full text-[1.4rem] ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light bg-secondary rounded-md px-[1rem] py-[.5rem] shadow-md`}
        />

        <img
          src={characterValue.imgUrl || ""}
          alt="CharacterImg"
          className={`${
            characterValue.imgUrl?.trim().length ? "" : "hidden"
          } w-[3rem] absolute object-cover rounded-md right-0`}
        />
        <PlotfieldCharacterPromptMain
          setShowCharacterModal={setShowAllCharacters}
          showCharacterModal={showAllCharacters}
          translateAsideValue="translate-y-[3.5rem]"
          characterName={characterValue.characterName || ""}
          currentCharacterId={characterValue._id || ""}
          setCharacterValue={setCharacterValue}
          ref={inputRef}
        />
      </form>
      <input
        type="text"
        placeholder="Очки отношений"
        className={`flex-grow text-[1.3rem] px-[1rem] py-[.5rem] text-text-light ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } rounded-md shadow-md`}
        value={amountOfPoints || ""}
        onBlur={onBlur}
        onChange={(e) => setAmountOfPoints(+e.target.value)}
      />
    </div>
  );
}
