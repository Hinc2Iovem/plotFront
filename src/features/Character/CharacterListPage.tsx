import { useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharactersByType from "../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByType";
import useDebounce from "../../hooks/utilities/useDebounce";
import CharacterHeader from "./CharacterHeader/CharacterHeader";
import CharacterItemDebounce from "./CharacterItemDebounce";

export type CharacterTypes =
  | "EmptyCharacter"
  | "MinorCharacter"
  | "MainCharacter";

export type SearchCharacterVariationTypes =
  | "all"
  | "maincharacter"
  | "minorcharacter"
  | "emptycharacter";

export default function CharacterListPage() {
  const { storyId } = useParams();
  const [searchCharacterType, setSearchCharacterType] =
    useState<SearchCharacterVariationTypes>("all");
  const [searchValue, setSearchValue] = useState("");

  const debouncedValue = useDebounce({ value: searchValue, delay: 500 });
  const { data: charactersDebounced } = useGetTranslationCharactersByType({
    debouncedValue,
    storyId: storyId || "",
    characterType:
      searchCharacterType === "all"
        ? ("" as SearchCharacterVariationTypes)
        : searchCharacterType,
    language: "russian",
  });

  console.log(charactersDebounced);

  return (
    <section className="max-w-[146rem] p-[1rem] mx-auto relative">
      <CharacterHeader
        searchValue={searchValue}
        debouncedValue={debouncedValue}
        searchCharacterType={searchCharacterType}
        setSearchValue={setSearchValue}
        setSearchCharacterType={setSearchCharacterType}
      />

      <main className="mt-[2rem] grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[1rem] justify-items-center justify-center w-full">
        {charactersDebounced &&
          charactersDebounced?.map((cd) => (
            <CharacterItemDebounce key={cd._id} {...cd} />
          ))}
      </main>
    </section>
  );
}
