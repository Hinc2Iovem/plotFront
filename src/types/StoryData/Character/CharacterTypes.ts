export type CharacterTypes =
  | "emptycharacter"
  | "minorcharacter"
  | "maincharacter";

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
