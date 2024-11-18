import { CurrentlyAvailableLanguagesTypes } from "../../../Additional/CURRENTLY_AVAILABEL_LANGUAGES";

export type ConditionTypes = {
  _id: string;
  plotFieldCommandId: string;
  amountOfBlocks: number;
};

export type ConditionSignTypes = ">" | "<" | "=" | ">=" | "<=";

export type LogicalOperatorTypes = "&&" | "||";

export const AllConditionSigns: ConditionSignTypes[] = [">=", ">", "=", "<", "<="];

export type ConditionValueVariationType =
  | "key"
  | "appearance"
  | "character"
  | "characteristic"
  | "language"
  | "random"
  | "retry"
  | "status";

export type ConditionBlockTypes = {
  _id: string;
  conditionId: string;
  targetBlockId: string;
  isElse: boolean;
  orderOfExecution: number;

  logicalOperator: string;
};

export type ConditionKeyTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  conditionBlockId: string;
  commandKeyId: string;
};

export type ConditionAppearanceTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  conditionBlockId: string;
  currentlyDressed: boolean;
  appearancePartId: string;
};

export type ConditionRetryTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  conditionBlockId: string;
  amountOfRetries: number;
  sign: ConditionSignTypes;
};

export type ConditionCharacterTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  characterId: string;
  value: number;
  sign: ConditionSignTypes;
};

export type ConditionCharacteristicTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  characteristicId: string;
  secondCharacteristicId?: string;
  value?: number;
  sign: ConditionSignTypes;
};

export type ConditionLanguageTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
};

export type ConditionStatusTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  characterId: string;
  status: string;
};

export type ConditionRandomTypes = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isRandom: boolean;
};
