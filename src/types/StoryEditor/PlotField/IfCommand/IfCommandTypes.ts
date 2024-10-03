import { ConditionSignTypes } from "../Condition/ConditionTypes";

export type IfCommandTypes = {
  _id: string;
  plotFieldCommandId: string;
  amountOfCommandsInsideElse: number;
  amountOfCommandsInsideIf: number;
};

export type IfValueTypes = {
  _id: string;
  plotFieldCommandIfId: string;
  name: string;
  value: number;
  sign: ConditionSignTypes;
};
