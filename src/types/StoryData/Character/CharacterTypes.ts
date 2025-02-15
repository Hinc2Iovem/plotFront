export type CharacterTypes = "emptycharacter" | "minorcharacter" | "maincharacter";

export type CharacterRusTypes = "Обычный Персонаж" | "Второстепенный Персонаж" | "Главный Персонаж";
export const CHARACTER_RUS_TYPES = ["Обычный Персонаж", "Второстепенный Персонаж", "Главный Персонаж"];
export const CHARACTER_RUS_TYPES_WITHOUT_MC = ["Обычный Персонаж", "Второстепенный Персонаж"];

export type EmotionsTypes = {
  _id: string;
  emotionName: string;
  imgUrl?: string;
};

export type CharacterGetTypes = {
  _id: string;
  storyId: string;
  type: CharacterTypes;
  isMainCharacter: boolean;
  emotions: EmotionsTypes[];
  nameTag?: string;
  img?: string;
};
