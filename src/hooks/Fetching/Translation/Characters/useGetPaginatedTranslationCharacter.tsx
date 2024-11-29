import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../types/Additional/TranslationTypes";

type PaginatedCharacterTypes = {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
  results: TranslationCharacterTypes[];
  amountOfCharacter: number;
};

export default function useGetPaginatedTranslationCharacter({
  language = "russian",
  page,
  limit,
  storyId,
  characterType,
}: {
  language?: CurrentlyAvailableLanguagesTypes;
  page: number;
  limit: number;
  storyId: string;
  characterType: string;
}) {
  return useQuery({
    queryKey: [
      "paginated",
      "page",
      page,
      "limit",
      limit,
      "translation",
      language,
      "story",
      storyId,
      "character",
      characterType,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedCharacterTypes>(
          `/characters/paginated/list/translations?currentLanguage=${language}&page=${page}&limit=${limit}&storyId=${storyId}&characterType=${characterType}`
        )
        .then((r) => r.data),
    enabled: !!language && !!page && !!limit && !!storyId,
  });
}
