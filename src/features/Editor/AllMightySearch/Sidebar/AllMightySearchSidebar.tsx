import { useQueryClient } from "@tanstack/react-query";
import PlotfieldButton from "../../../shared/Buttons/PlotfieldButton";
import {
  AllPossibleAllMightySearchCategoriesRusTypes,
  AllPossibleAllMightySearchCategoriesTypes,
} from "../AllMightySearch";
import { useParams } from "react-router-dom";
import { fetchAllKeys } from "../../PlotField/hooks/Key/useGetAllKeysByStoryId";
import { fetchAllSound } from "../../PlotField/hooks/Sound/useGetAllSoundsByStoryId";
import { fetchAllMusic } from "../../PlotField/hooks/Music/useGetAllMusicByStoryId";
import { fetchAllTranslationAchievements } from "../../PlotField/hooks/Achievement/useGetAllTranslationAchievementByStoryId";
import { fetchAllTranslationCharacteristics } from "../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import { fetchAllTranslationAppearanceParts } from "../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";
import { getTranslationCharactersByType } from "../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByType";
import { useRef } from "react";
import { fetchAllMightyPaginatedKey } from "../hooks/useGetPaginatedKey";
import { fetchAllMightyPaginatedTranslationCharacter } from "../hooks/useGetPaginatedTranslationCharacter";
import { fetchAllMightyPaginatedTranslationAppearancePart } from "../hooks/useGetPaginatedTranslationAppearancePart";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { fetchAllMightyPaginatedTranslationCharacteristic } from "../hooks/useGetPaginatedTranslationCharacteristic";
import { fetchAllMightyPaginatedTranslationAchievement } from "../hooks/useGetPaginatedTranslationAchievement";
import { fetchAllMightyPaginatedMusic } from "../hooks/useGetPaginatedMusic";
import { fetchAllMightyPaginatedSounds } from "../hooks/useGetPaginatedSounds";

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
  setShowKeyBinds: React.Dispatch<React.SetStateAction<boolean>>;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  showKeyBinds: boolean;
};

export default function AllMightySearchSidebar({
  currentCategory,
  showKeyBinds,
  setCurrentCategory,
  setShowKeyBinds,
}: AllMightySearchCategoriesTypes) {
  return (
    <header className="w-[20%] min-w-fit flex flex-col gap-[1rem] justify-between p-[1rem] mt-[1rem]">
      <ul className="flex flex-col gap-[1rem]">
        {Object.entries(AllMightySearchCategories).map(([key, value]) => (
          <AllMightySearchSidebarCategoryButton
            key={key}
            setCurrentCategory={setCurrentCategory}
            setShowKeyBinds={setShowKeyBinds}
            currentCategory={currentCategory}
            valueEng={key as AllPossibleAllMightySearchCategoriesTypes}
            valueRus={value}
          />
        ))}
      </ul>

      <PlotfieldButton
        onClick={() => {
          setShowKeyBinds((prev) => !prev);
          setCurrentCategory("" as AllPossibleAllMightySearchCategoriesTypes);
        }}
        className={`${showKeyBinds ? "bg-primary" : ""} text-center text-[2.3rem]`}
      >
        Бинды
      </PlotfieldButton>
    </header>
  );
}

type AllMightySearchSidebarCategoryButtonTypes = {
  setCurrentCategory: React.Dispatch<React.SetStateAction<AllPossibleAllMightySearchCategoriesTypes>>;
  setShowKeyBinds: React.Dispatch<React.SetStateAction<boolean>>;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  valueEng: AllPossibleAllMightySearchCategoriesTypes;
  valueRus: AllPossibleAllMightySearchCategoriesRusTypes;
};

function AllMightySearchSidebarCategoryButton({
  valueEng,
  valueRus,
  currentCategory,
  setCurrentCategory,
  setShowKeyBinds,
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
      queryClient.prefetchQuery({
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
      queryClient.prefetchQuery({
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
      });
      queryClient.prefetchQuery({
        queryKey: ["translation", "russian", "story", storyId, "appearancePart"],
        queryFn: () => fetchAllTranslationAppearanceParts({ storyId: storyId || "", language: "russian" }),
      });
    } else if (valueEng === "characteristic") {
      queryClient.prefetchQuery({
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
      });
      queryClient.prefetchQuery({
        queryKey: ["translation", "russian", "story", storyId, "characteristic"],
        queryFn: () => fetchAllTranslationCharacteristics({ storyId: storyId || "", language: "russian" }),
      });
    } else if (valueEng === "achievement") {
      queryClient.prefetchQuery({
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
      });
      queryClient.prefetchQuery({
        queryKey: ["story", storyId, "translation", "russian", "achievements"],
        queryFn: () => fetchAllTranslationAchievements({ storyId: storyId || "", language: "russian" }),
      });
    } else if (valueEng === "music") {
      queryClient.prefetchQuery({
        queryKey: ["all-mighty-search", "story", storyId, "music", "paginated", "page", 1, "limit", 10],
        queryFn: () =>
          fetchAllMightyPaginatedMusic({
            limit: 10,
            page: 1,
            storyId: storyId || "",
          }),
      });
      queryClient.prefetchQuery({
        queryKey: ["stories", storyId, "music"],
        queryFn: () => fetchAllMusic({ storyId: storyId || "" }),
      });
    } else if (valueEng === "sound") {
      queryClient.prefetchQuery({
        queryKey: ["all-mighty-search", "story", storyId, "sound", "paginated", "page", 1, "limit", 10],
        queryFn: () =>
          fetchAllMightyPaginatedSounds({
            limit: 10,
            page: 1,
            storyId: storyId || "",
          }),
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
    <PlotfieldButton
      onClick={() => {
        setShowKeyBinds(false);
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
        valueEng === currentCategory ? "scale-[1.05] bg-primary translate-x-[1rem]" : ""
      } capitalize text-[2rem] text-left hover:scale-[1.05] transition-all focus-within:scale-[1.05] focus-within:bg-primary focus-visible:scale-[1] hover:translate-x-[1rem] active:translate-x-[1rem] focus-within:translate-x-[1rem]`}
    >
      {valueRus}
    </PlotfieldButton>
  );
}
