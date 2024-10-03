import { useQueryClient } from "@tanstack/react-query";
import { SearchCharacterVariationTypes } from "../CharacterListPage";
import { getTranslationCharactersByType } from "../../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByType";
import { useParams } from "react-router-dom";

type CharacterHeaderSearchTypeBtnsProps = {
  setSearchCharacterType: React.Dispatch<
    React.SetStateAction<SearchCharacterVariationTypes>
  >;
  searchCharacterType: SearchCharacterVariationTypes;
};

export default function CharacterHeaderSearchTypeBtns({
  setSearchCharacterType,
  searchCharacterType,
}: CharacterHeaderSearchTypeBtnsProps) {
  const { storyId } = useParams();
  const queryClient = useQueryClient();

  const prefetchCharacters = ({
    characterType,
  }: {
    characterType: SearchCharacterVariationTypes;
  }) => {
    queryClient.prefetchQuery({
      queryKey: [
        "translation",
        "russian",
        "character",
        "type",
        characterType,
        "story",
        storyId,
        "search",
        "",
      ],
      queryFn: () =>
        getTranslationCharactersByType({
          language: "russian",
          storyId: storyId || "",
          characterType,
          debouncedValue: "",
        }),
    });
  };

  return (
    <div className="flex gap-[1rem] flex-wrap">
      <button
        onMouseEnter={() =>
          prefetchCharacters({
            characterType: "" as SearchCharacterVariationTypes,
          })
        }
        onFocus={() =>
          prefetchCharacters({
            characterType: "" as SearchCharacterVariationTypes,
          })
        }
        onClick={() => setSearchCharacterType("all")}
        className={`${
          searchCharacterType === "all"
            ? "text-white bg-primary-pastel-blue"
            : "text-gray-700 bg-white hover:text-white hover:bg-primary-pastel-blue"
        } text-[1.4rem] rounded-md shadow-md px-[1rem] py-[.5rem] transition-all active:scale-[0.99]`}
      >
        Все
      </button>
      <button
        onClick={() => setSearchCharacterType("maincharacter")}
        onMouseEnter={() =>
          prefetchCharacters({ characterType: "maincharacter" })
        }
        onFocus={() => prefetchCharacters({ characterType: "maincharacter" })}
        className={`${
          searchCharacterType === "maincharacter"
            ? "text-white bg-primary-pastel-blue"
            : "text-gray-700 bg-white hover:text-white hover:bg-primary-pastel-blue"
        } text-[1.4rem] rounded-md shadow-md px-[1rem] py-[.5rem] transition-all active:scale-[0.99]`}
      >
        Главный персонаж
      </button>
      <button
        onMouseEnter={() =>
          prefetchCharacters({ characterType: "minorcharacter" })
        }
        onFocus={() => prefetchCharacters({ characterType: "minorcharacter" })}
        onClick={() => setSearchCharacterType("minorcharacter")}
        className={`${
          searchCharacterType === "minorcharacter"
            ? "text-white bg-primary-pastel-blue"
            : "text-gray-700 bg-white hover:text-white hover:bg-primary-pastel-blue"
        } text-[1.4rem] rounded-md shadow-md px-[1rem] py-[.5rem] transition-all active:scale-[0.99]`}
      >
        Второстепенные персонажи
      </button>
      <button
        onMouseEnter={() =>
          prefetchCharacters({ characterType: "emptycharacter" })
        }
        onFocus={() => prefetchCharacters({ characterType: "emptycharacter" })}
        onClick={() => setSearchCharacterType("emptycharacter")}
        className={`${
          searchCharacterType === "emptycharacter"
            ? "text-white bg-primary-pastel-blue"
            : "text-gray-700 bg-white hover:text-white hover:bg-primary-pastel-blue"
        } text-[1.4rem] rounded-md shadow-md px-[1rem] py-[.5rem] transition-all active:scale-[0.99]`}
      >
        Персонажи третьего плана
      </button>
    </div>
  );
}
