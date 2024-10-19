import { KeyBindsCharacterSubCategoryTypes } from "../KeyBinds";

type KeyBindsCharacterSubCategoryBtnsTypes = {
  characterSubCategoryNameEng: KeyBindsCharacterSubCategoryTypes;
  characterSubCategory: KeyBindsCharacterSubCategoryTypes;
  characterSubCategoryName: string;
  setCharacterSubCategory: React.Dispatch<
    React.SetStateAction<KeyBindsCharacterSubCategoryTypes>
  >;
};
export default function KeyBindsCharacterSubCategoryBtns({
  characterSubCategory,
  characterSubCategoryName,
  characterSubCategoryNameEng,
  setCharacterSubCategory,
}: KeyBindsCharacterSubCategoryBtnsTypes) {
  return (
    <li>
      <button
        className={`text-[2rem] ${
          characterSubCategory === characterSubCategoryNameEng
            ? "text-light-gray underline"
            : "text-text-dark"
        } hover:text-light-gray transition-all hover:underline focus-within:text-light-gray focus-within:underline outline-none`}
        onClick={() => setCharacterSubCategory(characterSubCategoryNameEng)}
      >
        {characterSubCategoryName}
      </button>
    </li>
  );
}
