import { TranslationTextFieldNameAppearancePartsTypes } from "../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { AppearancePartVariationRusTypes } from "../types/StoryData/AppearancePart/AppearancePartTypes";

export const BodyTypes: TranslationTextFieldNameAppearancePartsTypes[] = [
  "art",
  "skin",
  "hair",
  "dress",
  "accessory",
  "body",
];

export const AllAppearancePartVariations: (TranslationTextFieldNameAppearancePartsTypes | "temp")[] = [
  "art",
  "skin",
  "hair",
  "dress",
  "accessory",
  "body",
  "temp",
];

export const AllAppearancePartRusVariations: AppearancePartVariationRusTypes[] = [
  "внешний вид",
  "волосы",
  "остальное",
  "кожа",
  "украшение",
  "тело",
  "татуировка",
];

export const appearancePartColors = {
  украшение: "bg-amber-500", // A bright amber for decorations.
  татуировка: "bg-blue-600", // A vibrant blue for tattoos.
  тело: "bg-gray-500", // Neutral gray for body.
  "внешний вид": "bg-indigo-600", // Indigo for general appearance.
  волосы: "bg-yellow-500", // Yellow to represent hair.
  остальное: "bg-green-600", // A fresh green for miscellaneous.
  кожа: "bg-pink-500", // A soft pink for skin.
};
