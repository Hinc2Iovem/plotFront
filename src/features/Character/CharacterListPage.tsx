import useFindoutWidthOfContainer from "@/hooks/UI/useFindoutWidthOfContainer";
import useDebounce from "@/hooks/utilities/useDebounce";
import GoBackButton from "@/ui/Buttons/StoryPage/GoBackButton";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharactersByType from "../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByType";
import CharacterFilters from "./CharacterFilters";
import CharacterItemDebounce from "./CharacterItemDebounce";
import NewCharacterForm from "./Form/NewCharacterForm";

export type CharacterTypes = "EmptyCharacter" | "MinorCharacter" | "MainCharacter";

export type SearchCharacterVariationTypes = "all" | "maincharacter" | "minorcharacter" | "emptycharacter";
export type StoryNewCharacterTypes = {
  characterId: string;
  characterImg?: string;
  characterType: Exclude<SearchCharacterVariationTypes, "all">;
  characterName: string;
  characterUnknownName?: string;
  characterDescription: string;
  characterTag?: string;
};

export default function CharacterListPage() {
  const { storyId } = useParams();
  const [searchCharacterType, setSearchCharacterType] = useState<SearchCharacterVariationTypes>("all");
  const [searchValue, setSearchValue] = useState("");
  const [created, setCreated] = useState<boolean | null>(null);
  const initCharacterObject = {
    characterId: "",
    characterImg: "",
    characterType: "" as Exclude<SearchCharacterVariationTypes, "all">,
    characterName: "",
    characterUnknownName: "",
    characterDescription: "",
    characterTag: "",
  };

  const [characterValue, setCharacterValue] = useState<StoryNewCharacterTypes>(initCharacterObject);
  const [initCharacterValue, setInitCharacterValue] = useState<StoryNewCharacterTypes>(initCharacterObject);

  const debouncedValue = useDebounce({ value: searchValue, delay: 600 });

  const { data: charactersDebounced } = useGetTranslationCharactersByType({
    debouncedValue,
    storyId: storyId || "",
    characterType: searchCharacterType === "all" ? ("" as SearchCharacterVariationTypes) : searchCharacterType,
    language: "russian",
  });

  const { ref, width } = useFindoutWidthOfContainer();

  return (
    <>
      <GoBackButton className="text-[25px]" link={`/stories/${storyId}`} />
      <section className="max-w-[1480px] mx-auto relative">
        <main className="my-[10px] flex md:flex-row flex-col-reverse gap-[5px] px-[5px]">
          <div
            ref={ref}
            className="w-full flex-grow h-screen border-border border-[1px] rounded-md relative overflow-y-auto | containerScroll"
          >
            <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[5px] justify-items-center p-[5px] rounded-md">
              {charactersDebounced &&
                charactersDebounced?.map((cd) => (
                  <CharacterItemDebounce
                    key={cd._id}
                    created={created}
                    setInitCharacterValue={setInitCharacterValue}
                    setCharacterValue={setCharacterValue}
                    characterValue={characterValue}
                    {...cd}
                  />
                ))}
            </div>
            <div className="h-[50px] w-full"></div>
          </div>
          <CharacterFilters
            width={width}
            searchValue={searchValue}
            setSearchCharacterType={setSearchCharacterType}
            setSearchValue={setSearchValue}
          />
          <NewCharacterForm
            setInitCharacterValue={setInitCharacterValue}
            characterValue={characterValue}
            initCharacterValue={initCharacterValue}
            setCharacterValue={setCharacterValue}
            searchCharacterType={searchCharacterType}
            searchValue={searchValue}
            setCreated={setCreated}
          />
        </main>
      </section>
    </>
  );
}
