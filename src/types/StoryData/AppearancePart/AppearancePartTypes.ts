import { TranslationTextFieldNameAppearancePartsTypes } from "../../Additional/TRANSLATION_TEXT_FIELD_NAMES";

export type AppearancePartTypes = {
  characterId: string;
  _id: string;
  type: TranslationTextFieldNameAppearancePartsTypes | "temp";
  img?: string;
};

export type CreateAppearancePartTypes = {
  name: string;
  type: TranslationTextFieldNameAppearancePartsTypes;
};
