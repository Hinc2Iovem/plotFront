import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAppearancePartTypes } from "../../../../types/Additional/TranslationTypes";

type PaginatedAppearancePartTypes = {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
  results: TranslationAppearancePartTypes[];
  amountOfAppearanceParts: number;
};

export default function useGetPaginatedTranslationAppearanceParts({
  language = "russian",
  page,
  limit,
  characterId,
  type,
}: {
  language?: CurrentlyAvailableLanguagesTypes;
  page: number;
  limit: number;
  characterId: string;
  type: string;
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
      "character",
      characterId,
      "appearancePart",
      "type",
      type,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedAppearancePartTypes>(
          `/appearanceParts/paginated/translations?currentLanguage=${language}&page=${page}&limit=${limit}&characterId=${characterId}&type=${type}`
        )
        .then((r) => r.data),
    enabled: !!language && !!page && !!limit && !!characterId,
  });
}
