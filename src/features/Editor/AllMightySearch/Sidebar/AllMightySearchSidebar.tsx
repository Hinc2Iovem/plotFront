import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchAllTranslationAppearanceParts } from "../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import { fetchAllTranslationCharacteristics } from "../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import { getTranslationCharactersByType } from "../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByType";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { fetchAllTranslationAchievements } from "../../PlotField/hooks/Achievement/Translation/useGetAllTranslationAchievementByStoryId";
import { fetchAllKeys } from "../../PlotField/hooks/Key/useGetAllKeysByStoryId";
import { fetchAllMusic } from "../../PlotField/hooks/Music/useGetAllMusicByStoryId";
import { fetchAllSound } from "../../PlotField/hooks/Sound/useGetAllSoundsByStoryId";
import {
  AllPossibleAllMightySearchCategoriesRusTypes,
  AllPossibleAllMightySearchCategoriesTypes,
} from "../AllMightySearch";
import { fetchAllMightyPaginatedKey } from "../hooks/useGetPaginatedKey";
import { fetchAllMightyPaginatedMusic } from "../hooks/useGetPaginatedMusic";
import { fetchAllMightyPaginatedSounds } from "../hooks/useGetPaginatedSounds";
import { fetchAllMightyPaginatedTranslationAchievement } from "../hooks/useGetPaginatedTranslationAchievement";
import { fetchAllMightyPaginatedTranslationAppearancePart } from "../hooks/useGetPaginatedTranslationAppearancePart";
import { fetchAllMightyPaginatedTranslationCharacter } from "../hooks/useGetPaginatedTranslationCharacter";
import { fetchAllMightyPaginatedTranslationCharacteristic } from "../hooks/useGetPaginatedTranslationCharacteristic";
import NotCategoryButtons from "./NotCategoryButtons";

const AllMightySearchCategories: {
  [key in AllPossibleAllMightySearchCategoriesTypes]: AllPossibleAllMightySearchCategoriesRusTypes;
} = {
  key: "ключи",
  character: "персонажи",
  appearance: "внешний вид",
  characteristic: "характеристики",
  achievement: "ачивки",
  music: "музыка",
  sound: "звуки",
} as const;

type AllMightySearchCategoriesTypes = {
  setCurrentCategory: React.Dispatch<React.SetStateAction<AllPossibleAllMightySearchCategoriesTypes>>;
  setShowContent: React.Dispatch<
    React.SetStateAction<{
      showKeyBinds: boolean;
      showSearch: boolean;
    }>
  >;
  setShowAllMightySearch: React.Dispatch<React.SetStateAction<boolean>>;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  showContent: {
    showKeyBinds: boolean;
    showSearch: boolean;
  };
};

export default function AllMightySearchSidebar({
  currentCategory,
  showContent,
  setCurrentCategory,
  setShowContent,
  setShowAllMightySearch,
}: AllMightySearchCategoriesTypes) {
  return (
    <header className="w-[20%] min-w-fit flex flex-col gap-[10px] justify-between p-[10px] pr-0 mt-[10px]">
      <ul className="flex flex-col gap-[10px]">
        {Object.entries(AllMightySearchCategories).map(([key, value]) => (
          <AllMightySearchSidebarCategoryButton
            key={key}
            setCurrentCategory={setCurrentCategory}
            setShowContent={setShowContent}
            currentCategory={currentCategory}
            valueEng={key as AllPossibleAllMightySearchCategoriesTypes}
            valueRus={value}
          />
        ))}
      </ul>

      <NotCategoryButtons
        setCurrentCategory={setCurrentCategory}
        setShowAllMightySearch={setShowAllMightySearch}
        setShowContent={setShowContent}
        showContent={showContent}
      />
    </header>
  );
}

type AllMightySearchSidebarCategoryButtonTypes = {
  setCurrentCategory: React.Dispatch<React.SetStateAction<AllPossibleAllMightySearchCategoriesTypes>>;
  setShowContent: React.Dispatch<
    React.SetStateAction<{
      showKeyBinds: boolean;
      showSearch: boolean;
    }>
  >;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  valueEng: AllPossibleAllMightySearchCategoriesTypes;
  valueRus: AllPossibleAllMightySearchCategoriesRusTypes;
};

function AllMightySearchSidebarCategoryButton({
  valueEng,
  valueRus,
  currentCategory,
  setCurrentCategory,
  setShowContent,
}: AllMightySearchSidebarCategoryButtonTypes) {
  const { storyId } = useParams();
  const queryClient = useQueryClient();

  const hoverTimeout = useRef<number>(null);

  const handlePrefetches = () => {
    if (valueEng === "key") {
      queryClient.prefetchInfiniteQuery({
        queryKey: ["all-mighty-search", "story", storyId, "key", "paginated", "page", 1, "limit", 10],
        queryFn: () => fetchAllMightyPaginatedKey({ limit: 10, page: 1, storyId: storyId || "" }),
        initialPageParam: 1,
      });
      queryClient.prefetchQuery({
        queryKey: ["stories", storyId, "key"],
        queryFn: () => fetchAllKeys({ storyId: storyId || "" }),
      });
    } else if (valueEng === "character") {
      queryClient.prefetchInfiniteQuery({
        queryKey: [
          "all-mighty-search",
          "story",
          storyId,
          "character",
          "translation",
          "russian",
          "paginated",
          "page",
          1,
          "limit",
          10,
        ],
        queryFn: () =>
          fetchAllMightyPaginatedTranslationCharacter({
            limit: 10,
            page: 1,
            storyId: storyId || "",
            language: "russian",
          }),
        initialPageParam: 1,
      });
      queryClient.prefetchQuery({
        queryKey: ["translation", "russian", "character", "type", "all", "story", storyId, "search", ""],
        queryFn: () =>
          getTranslationCharactersByType({
            storyId: storyId || "",
            language: "russian",
            characterType: "all",
            debouncedValue: "",
          }),
      });
    } else if (valueEng === "appearance") {
      queryClient.prefetchInfiniteQuery({
        queryKey: [
          "all-mighty-search",
          "story",
          storyId,
          "appearancePart",
          "character",
          "",
          "type",
          "",
          "translation",
          "russian",
          "paginated",
          "page",
          1,
          "limit",
          10,
        ],
        queryFn: () =>
          fetchAllMightyPaginatedTranslationAppearancePart({
            limit: 10,
            page: 1,
            storyId: storyId || "",
            language: "russian",
            characterId: "",
            type: "" as TranslationTextFieldNameAppearancePartsTypes,
          }),
        initialPageParam: 1,
      });
      queryClient.prefetchQuery({
        queryKey: ["translation", "russian", "story", storyId, "appearancePart"],
        queryFn: () => fetchAllTranslationAppearanceParts({ storyId: storyId || "", language: "russian" }),
      });
    } else if (valueEng === "characteristic") {
      queryClient.prefetchInfiniteQuery({
        queryKey: [
          "all-mighty-search",
          "story",
          storyId,
          "characteristic",
          "translation",
          "russian",
          "paginated",
          "page",
          1,
          "limit",
          10,
        ],
        queryFn: () =>
          fetchAllMightyPaginatedTranslationCharacteristic({
            limit: 10,
            page: 1,
            storyId: storyId || "",
            language: "russian",
          }),
        initialPageParam: 1,
      });
      queryClient.prefetchQuery({
        queryKey: ["translation", "russian", "story", storyId, "characteristic"],
        queryFn: () => fetchAllTranslationCharacteristics({ storyId: storyId || "", language: "russian" }),
      });
    } else if (valueEng === "achievement") {
      queryClient.prefetchInfiniteQuery({
        queryKey: [
          "all-mighty-search",
          "story",
          storyId,
          "achievement",
          "translation",
          "russian",
          "paginated",
          "page",
          1,
          "limit",
          10,
        ],
        queryFn: () =>
          fetchAllMightyPaginatedTranslationAchievement({
            limit: 10,
            page: 1,
            storyId: storyId || "",
            language: "russian",
          }),
        initialPageParam: 1,
      });
      queryClient.prefetchQuery({
        queryKey: ["story", storyId, "translation", "russian", "achievements"],
        queryFn: () => fetchAllTranslationAchievements({ storyId: storyId || "", language: "russian" }),
      });
    } else if (valueEng === "music") {
      queryClient.prefetchInfiniteQuery({
        queryKey: ["all-mighty-search", "story", storyId, "music", "paginated", "page", 1, "limit", 10],
        queryFn: () =>
          fetchAllMightyPaginatedMusic({
            limit: 10,
            page: 1,
            storyId: storyId || "",
          }),
        initialPageParam: 1,
      });
      queryClient.prefetchQuery({
        queryKey: ["stories", storyId, "music"],
        queryFn: () => fetchAllMusic({ storyId: storyId || "" }),
      });
    } else if (valueEng === "sound") {
      queryClient.prefetchInfiniteQuery({
        queryKey: ["all-mighty-search", "story", storyId, "sound", "paginated", "page", 1, "limit", 10],
        queryFn: () =>
          fetchAllMightyPaginatedSounds({
            limit: 10,
            page: 1,
            storyId: storyId || "",
          }),
        initialPageParam: 1,
      });
      queryClient.prefetchQuery({
        queryKey: ["story", storyId, "sound"],
        queryFn: () => fetchAllSound({ storyId: storyId || "" }),
      });
    } else {
      console.log("Lol how");
      return;
    }
  };

  return (
    <Button
      onClick={() => {
        setShowContent(() => ({
          showKeyBinds: false,
          showSearch: false,
        }));
        setCurrentCategory(valueEng);
      }}
      onMouseEnter={() => {
        // @ts-expect-error type staff again, but working
        hoverTimeout.current = setTimeout(() => {
          handlePrefetches();
        }, 300);
      }}
      onMouseLeave={() => {
        if (hoverTimeout.current) {
          clearTimeout(hoverTimeout.current);
          // @ts-expect-error type staff again, but working
          hoverTimeout.current = null;
        }
      }}
      onFocus={() => {
        // @ts-expect-error type staff again, but working
        hoverTimeout.current = setTimeout(() => {
          handlePrefetches();
        }, 300);
      }}
      onBlur={() => {
        if (hoverTimeout.current) {
          clearTimeout(hoverTimeout.current);
          // @ts-expect-error type staff again, but working
          hoverTimeout.current = null;
        }
      }}
      className={`${
        valueEng === currentCategory ? "bg-accent translate-x-[10px]" : "hover:bg-accent focus-within:bg-accent"
      } capitalize text-[20px] shadow-none text-left text-paragraph hover:scale-[1.05] transition-all focus-within:scale-[1.05] focus-within:bg-accent focus-visible:scale-[1] hover:translate-x-[10px] active:translate-x-[10px] focus-within:translate-x-[10px]`}
    >
      {valueRus}
    </Button>
  );
}
