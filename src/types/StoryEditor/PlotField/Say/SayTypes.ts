export type CommandSideTypes = "right" | "left";
export type CommandSayVariationTypes =
  | "character"
  | "author"
  | "notify"
  | "hint";

export type SayTypes = {
  _id: string;
  plotFieldCommandId: string;
  commandSide: CommandSideTypes;
  characterId: string;
  type: CommandSayVariationTypes;
  characterEmotionId: string;
};
