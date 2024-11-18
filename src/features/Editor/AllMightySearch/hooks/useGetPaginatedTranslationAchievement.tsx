import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAchievementTypes } from "../../../../types/Additional/TranslationTypes";

type GetPaginatedTranslationAchievementTypes = {
  storyId: string;
  page: number;
  limit: number;
  language: CurrentlyAvailableLanguagesTypes;
};

export type AllMightySearchAchievementResultTypes = {
  next: {
    page: number;
    limit: number;
  };
  prev: {
    page: number;
    prev: number;
  };
  results: TranslationAchievementTypes[];
  amountOfElements: number;
};

export const fetchAllMightyPaginatedTranslationAchievement = async ({
  limit,
  page,
  storyId,
  language,
}: GetPaginatedTranslationAchievementTypes): Promise<AllMightySearchAchievementResultTypes> => {
  return await axiosCustomized
    .get(
      `/achievements/stories/translation/paginated/allMightySearch?storyId=${storyId}&page=${page}&limit=${limit}&currentLanguage=${language}`
    )
    .then((r) => r.data);
};

export default function useGetPaginatedTranslationAchievement({
  storyId,
  limit,
  page,
  language,
}: GetPaginatedTranslationAchievementTypes) {
  return useQuery({
    queryKey: [
      "all-mighty-search",
      "story",
      storyId,
      "achievement",
      "translation",
      language,
      "paginated",
      "page",
      page,
      "limit",
      limit,
    ],
    queryFn: () => fetchAllMightyPaginatedTranslationAchievement({ limit, page, storyId, language }),
  });
}
