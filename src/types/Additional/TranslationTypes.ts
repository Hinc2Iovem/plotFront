import { CharacterTypes } from "../StoryData/Character/CharacterTypes";
import { EpisodeStatusTypes } from "../StoryData/Episode/EpisodeTypes";
import { ChoiceOptionVariationsTypes } from "../StoryEditor/PlotField/Choice/ChoiceTypes";
import { CurrentlyAvailableLanguagesTypes } from "./CURRENTLY_AVAILABEL_LANGUAGES";
import {
  TranslationTextFieldNameAchievementTypes,
  TranslationTextFieldNameAppearancePartsTypes,
  TranslationTextFieldNameCharacterCharacteristicTypes,
  TranslationTextFieldNameCharacterTypes,
  TranslationTextFieldNameChoiceOptionTypes,
  TranslationTextFieldNameChoiceTypes,
  TranslationTextFieldNameCommandTypes,
  TranslationTextFieldNameCommandWardrobeTypes,
  TranslationTextFieldNameEpisodeTypes,
  TranslationTextFieldNameGetItemTypes,
  TranslationTextFieldNameSayTypes,
  TranslationTextFieldNameSeasonTypes,
  TranslationTextFieldNameStoryTypes,
} from "./TRANSLATION_TEXT_FIELD_NAMES";

export type AllTranslationTextFieldNamesTypes =
  | TranslationTextFieldNameAppearancePartsTypes
  | TranslationTextFieldNameCharacterCharacteristicTypes
  | TranslationTextFieldNameCharacterTypes
  | TranslationTextFieldNameChoiceOptionTypes
  | TranslationTextFieldNameCommandTypes
  | TranslationTextFieldNameEpisodeTypes
  | TranslationTextFieldNameSeasonTypes
  | TranslationTextFieldNameStoryTypes;

export type GetTranslationTypes = {
  path: string;
  id: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

type AchievementTranslationsTypes = {
  _id: string;
  text: string;
  textFieldName: TranslationTextFieldNameAchievementTypes;
  amountOfWords: number;
};

export type TranslationAchievementTypes = {
  _id: string;
  commandId: string;
  storyId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
  translations?: AchievementTranslationsTypes[];
  updatedAt: string;
  createdAt: string;
};

type GetItemTranslationsTypes = {
  _id: string;
  text: string;
  textFieldName: TranslationTextFieldNameGetItemTypes;
  amountOfWords: number;
};

export type TranslationGetItemTypes = {
  _id: string;
  commandId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
  translations?: GetItemTranslationsTypes[];
  updatedAt: string;
  createdAt: string;
};

type SayTranslationsTypes = {
  _id: string;
  text: string;
  textFieldName: TranslationTextFieldNameSayTypes;
  amountOfWords: number;
};

export type TranslationSayTypes = {
  _id: string;
  commandId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
  translations?: SayTranslationsTypes[];
  updatedAt: string;
  createdAt: string;
};

type CommandWardrobeTranslationsTypes = {
  _id: string;
  text: string;
  textFieldName: TranslationTextFieldNameCommandWardrobeTypes;
  amountOfWords: number;
};

export type TranslationCommandWardrobeTypes = {
  _id: string;
  commandId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
  translations?: CommandWardrobeTranslationsTypes[];
  updatedAt: string;
  createdAt: string;
};

type ChoiceTranslationsTypes = {
  text: string;
  _id: string;
  textFieldName: TranslationTextFieldNameChoiceTypes;
  amountOfWords: number;
};

export type TranslationChoiceTypes = {
  _id: string;
  commandId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
  translations?: ChoiceTranslationsTypes[];
  updatedAt: string;
  createdAt: string;
};

export type TranslationCommandTypes = {
  _id: string;
  commandId: string;
  language: CurrentlyAvailableLanguagesTypes;
  text: string;
  amountOfWords: number;
  textFieldName: TranslationTextFieldNameCommandTypes;
};

type AppearancePartTranslationsTypes = {
  text: string;
  _id: string;
  amountOfWords: number;
  textFieldName: TranslationTextFieldNameAppearancePartsTypes;
};

export type TranslationAppearancePartTypes = {
  _id: string;
  appearancePartId: string;
  characterId: string;
  type: TranslationTextFieldNameAppearancePartsTypes;
  language: CurrentlyAvailableLanguagesTypes;
  translations: AppearancePartTranslationsTypes[];
  createdAt: string;
  updatedAt: string;
};

type TranslationCharacterObjectTypes = {
  text: string;
  _id: string;
  amountOfWords: number;
  textFieldName: TranslationTextFieldNameCharacterTypes;
};
export type TranslationCharacterTypes = {
  _id: string;
  characterId: string;
  storyId: string;
  characterType: CharacterTypes;
  language: CurrentlyAvailableLanguagesTypes;
  translations?: TranslationCharacterObjectTypes[];
};

type EpisodeTranslationsTypes = {
  text: string;
  _id: string;
  amountOfWords: number;
  textFieldName: TranslationTextFieldNameEpisodeTypes;
};

export type TranslationEpisodeTypes = {
  _id: string;
  episodeId: string;
  seasonId: string;
  episodeStatus: EpisodeStatusTypes;
  language: CurrentlyAvailableLanguagesTypes;
  translations: EpisodeTranslationsTypes[];
  createdAt: string;
  updatedAt: string;
};

type SeasonTranslationsTypes = {
  text: string;
  _id: string;
  amountOfWords: number;
  textFieldName: TranslationTextFieldNameSeasonTypes;
};

export type TranslationSeasonTypes = {
  _id: string;
  seasonId: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
  translations: SeasonTranslationsTypes[];
  createdAt: string;
  updatedAt: string;
};

type StoryTranslationsTypes = {
  text: string;
  _id: string;
  amountOfWords: number;
  textFieldName: TranslationTextFieldNameStoryTypes;
};

export type TranslationStoryTypes = {
  _id: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
  storyStatus: EpisodeStatusTypes;
  translations: StoryTranslationsTypes[];
  updatedAt: string;
  createdAt: string;
};

export type ChoiceOptionTranslationsTypes = {
  text: string;
  _id: string;
  amountOfWords: number;
  textFieldName: TranslationTextFieldNameChoiceOptionTypes;
};

export type TranslationChoiceOptionTypes = {
  _id: string;
  plotFieldCommandChoiceId: string;
  choiceOptionId: string;
  type: ChoiceOptionVariationsTypes;
  language: CurrentlyAvailableLanguagesTypes;
  translations: ChoiceOptionTranslationsTypes[];
  updatedAt: string;
  createdAt: string;
};

type CharacteristicsTranslationsTypes = {
  text: string;
  _id: string;
  amountOfWords: number;
  textFieldName: TranslationTextFieldNameCharacterCharacteristicTypes;
};

export type TranslationCharacterCharacteristicTypes = {
  _id: string;
  storyId: string;
  characteristicId: string;
  language: CurrentlyAvailableLanguagesTypes;
  translations: CharacteristicsTranslationsTypes[];
  createdAt: string;
  updatedAt: string;
};

export type RecentTranslationTypes = {
  _id: string;
  commandId?: string;
  appearancePartId?: string;
  characterId?: string;
  commandLibraryId?: string;
  episodeId?: string;
  seasonId?: string;
  storyId?: string;
  choiceOptionId?: string;
  characterCharacteristicId?: string;
  language: CurrentlyAvailableLanguagesTypes;
  textFieldName: AllTranslationTextFieldNamesTypes;
  text: string;
  amountOfWords: number;
  updatedAt: Date;
  createdAt: Date;
};
