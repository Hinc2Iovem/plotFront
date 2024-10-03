export type ConditionTypes = {
  _id: string;
  plotFieldCommandId: string;
};
export type ConditionBlockTypes = {
  _id: string;
  conditionId: string;
  targetBlockId: string;
  isElse: boolean;
  orderOfExecution: number;
};

export type ConditionSignTypes = ">" | "<" | "=" | ">=" | "<=";

export const AllConditionSigns: ConditionSignTypes[] = [
  "<",
  "<=",
  "=",
  ">",
  ">=",
];

export type ConditionValueTypes = {
  _id: string;
  conditionBlockId: string;
  name: string;
  value: number;
  sign: ConditionSignTypes;
};
