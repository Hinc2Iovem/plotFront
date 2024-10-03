import { useMemo } from "react";
import { UpdatedAtPossibleVariationTypes } from "./FiltersEverythingRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import useGetRecentTranslations from "../../../../../hooks/Fetching/Translation/Recent/useGetRecentTranslations";
import {
  TranslationAppearancePartTypes,
  TranslationCharacterCharacteristicTypes,
  TranslationCharacterTypes,
  TranslationCommandTypes,
  TranslationEpisodeTypes,
  TranslationSeasonTypes,
  TranslationStoryTypes,
} from "../../../../../types/Additional/TranslationTypes";

type MemoizeRefinedTranslationsTypes = {
  period: UpdatedAtPossibleVariationTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
};

type CombinedMultipleCommandsTranslatedAndNonTranslatedRecentTypes = {
  appearancePart: {
    translated: TranslationAppearancePartTypes[];
  };
  season: {
    translated: TranslationSeasonTypes[];
  };
  character: {
    translated: { characterGrouped: TranslationCharacterTypes[] }[];
  };
  episode: {
    translated: { episodeGrouped: TranslationEpisodeTypes[] }[];
  };
  story: {
    translated: { storyGrouped: TranslationStoryTypes[] }[];
  };
  oneLiners: {
    translated: TranslationCommandTypes[];
  };
  choice: {
    translated: TranslationCommandTypes[];
  };
  characteristic: {
    translated: TranslationCharacterCharacteristicTypes[];
  };
  getItem: {
    translated: { getItemGrouped: TranslationCommandTypes[] }[];
  };
};
export default function useMemoizeRefinedTranslations({
  period,
  translateFromLanguage,
}: MemoizeRefinedTranslationsTypes) {
  const { data: translatedRecent } = useGetRecentTranslations({
    language: translateFromLanguage,
    updateAt: period,
  });

  return useMemo(() => {
    if ((translatedRecent?.length || 0) > 0) {
      const combinedTranslations: CombinedMultipleCommandsTranslatedAndNonTranslatedRecentTypes =
        {
          appearancePart: {
            translated: [],
          },
          season: {
            translated: [],
          },
          character: {
            translated: [],
          },
          episode: {
            translated: [],
          },
          story: {
            translated: [],
          },
          oneLiners: {
            translated: [],
          },
          choice: {
            translated: [],
          },
          characteristic: {
            translated: [],
          },
          getItem: {
            translated: [],
          },
        };

      const characterTranslatedGroups: Record<
        string,
        TranslationCharacterTypes[]
      > = {};
      const episodeTranslatedGroups: Record<string, TranslationEpisodeTypes[]> =
        {};
      const storyTranslatedGroups: Record<string, TranslationStoryTypes[]> = {};
      const getItemTranslatedGroups: Record<string, TranslationCommandTypes[]> =
        {};

      (translatedRecent || []).forEach((tc) => {
        switch (tc.textFieldName) {
          case "characterName":
          case "characterDescription":
          case "characterUnknownName":
            if (!characterTranslatedGroups[tc.characterId || -1]) {
              characterTranslatedGroups[tc.characterId || -1] = [];
            }
            characterTranslatedGroups[tc.characterId || -1].push(
              tc as unknown as TranslationCharacterTypes
            );
            break;
          case "episodeName":
          case "episodeDescription":
            if (!episodeTranslatedGroups[tc.episodeId || -1]) {
              episodeTranslatedGroups[tc.episodeId || -1] = [];
            }
            episodeTranslatedGroups[tc.episodeId || -1].push(
              tc as unknown as TranslationEpisodeTypes
            );
            break;
          case "storyName":
          case "storyDescription":
          case "storyGenre":
            if (!storyTranslatedGroups[tc.storyId || -1]) {
              storyTranslatedGroups[tc.storyId || -1] = [];
            }
            storyTranslatedGroups[tc.storyId || -1].push(
              tc as unknown as TranslationStoryTypes
            );
            break;
          case "achievementName":
          case "sayText":
          case "commandWardrobeTitle":
            combinedTranslations.oneLiners.translated.push(
              tc as TranslationCommandTypes
            );
            break;
          case "choiceQuestion":
            combinedTranslations.choice.translated.push(
              tc as TranslationCommandTypes
            );
            break;
          case "characterCharacteristic":
            combinedTranslations.characteristic.translated.push(
              tc as unknown as TranslationCharacterCharacteristicTypes
            );
            break;
          case "buttonText":
          case "itemDescription":
          case "itemName":
            if (!getItemTranslatedGroups[tc.commandId || -1]) {
              getItemTranslatedGroups[tc.commandId || -1] = [];
            }
            getItemTranslatedGroups[tc.commandId || -1].push(
              tc as TranslationCommandTypes
            );
            break;
        }
      });

      combinedTranslations.character.translated = Object.keys(
        characterTranslatedGroups
      ).map((characterId) => ({
        characterGrouped: characterTranslatedGroups[characterId],
      }));
      combinedTranslations.episode.translated = Object.keys(
        episodeTranslatedGroups
      ).map((episodeId) => ({
        episodeGrouped: episodeTranslatedGroups[episodeId],
      }));
      combinedTranslations.story.translated = Object.keys(
        storyTranslatedGroups
      ).map((storyId) => ({
        storyGrouped: storyTranslatedGroups[storyId],
      }));
      combinedTranslations.getItem.translated = Object.keys(
        getItemTranslatedGroups
      ).map((commandId) => ({
        getItemGrouped: getItemTranslatedGroups[commandId],
      }));

      return combinedTranslations;
    }

    return {
      appearancePart: {
        translated: [],
      },
      season: {
        translated: [],
      },
      character: {
        translated: [],
      },
      episode: {
        translated: [],
      },
      story: {
        translated: [],
      },
      oneLiners: {
        translated: [],
      },
      choice: {
        translated: [],
      },
      characteristic: {
        translated: [],
      },
      getItem: {
        translated: [],
      },
    };
  }, [translatedRecent]);
}
