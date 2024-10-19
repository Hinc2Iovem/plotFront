import { KeyBindsCategoryTypes } from "../KeyBinds";

type KeyBindsCategoryBtnsTypes = {
  currentCategory: KeyBindsCategoryTypes;
  categoryNameEng: KeyBindsCategoryTypes;
  categoryName: string;
  setCurrentCategory: React.Dispatch<
    React.SetStateAction<KeyBindsCategoryTypes>
  >;
};

export default function KeyBindsCategoryBtns({
  categoryName,
  categoryNameEng,
  currentCategory,
  setCurrentCategory,
}: KeyBindsCategoryBtnsTypes) {
  return (
    <li>
      <button
        className={`text-[2rem] ${
          currentCategory === categoryNameEng
            ? "text-text-light underline"
            : "text-text-dark"
        } hover:text-text-light transition-all hover:underline focus-within:text-text-light focus-within:underline outline-none`}
        onClick={() => setCurrentCategory(categoryNameEng)}
      >
        {categoryName}
      </button>
    </li>
  );
}
