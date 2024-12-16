import { CurrentlyAvailableLanguagesTypes } from "../../../Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { ConditionSignTypes } from "../Condition/ConditionTypes";

export type IfCommandTypes = {
  _id: string;
  plotFieldCommandId: string;
  amountOfCommandsInsideIf: number;
  logicalOperator: string;
};

export type IfValueTypes = {
  _id: string;
  plotfieldCommandIfId: string;
  name: string;
  value: number;
  sign: ConditionSignTypes;
};

export type IfKeyTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  ifId: string;
  commandKeyId: string;
};

export type IfAppearanceTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  ifId: string;
  currentlyDressed: boolean;
  appearancePartId: string;
};

export type IfRetryTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  ifId: string;
  amountOfRetries: number;
  sign: ConditionSignTypes;
};

export type IfCharacterTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  characterId: string;
  value: number;
  sign: ConditionSignTypes;
};

export type IfCharacteristicTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  characteristicId: string;
  secondCharacteristicId?: string;
  value?: number;
  sign: ConditionSignTypes;
};

export type IfLanguageTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
};

export type IfStatusTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  characterId: string;
  status: string;
};

export type IfRandomTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isRandom: boolean;
};
