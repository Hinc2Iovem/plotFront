export type ConditionTypes = {
  _id: string;
  plotFieldCommandId: string;
  amountOfBlocks: number;
};

export type ConditionSignTypes = ">" | "<" | "=" | ">=" | "<=";

export const AllConditionSigns: ConditionSignTypes[] = [
  "<",
  "<=",
  "=",
  ">",
  ">=",
];

export type ConditionValueVariationType =
  | "key"
  | "appearance"
  | "character"
  | "characteristic"
  | "else";

export type ConditionBlockTypes = {
  _id: string;
  conditionId: string;
  targetBlockId: string;
  isElse: boolean;
  orderOfExecution: number;
  characterId?: string;
  appearancePartId?: string;
  characteristicId?: string;
  commandKeyId?: string;
  type: ConditionValueVariationType;
  name: string;
  value: string;
  sign: ConditionSignTypes;
};
