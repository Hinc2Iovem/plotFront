import { AllKeyBinds, AllKeyBindsCharacterSubCategories } from "../../../../const/KEY_BINDS_CATEGORIES";
import { KeyBindsCategoryTypes, KeyBindsCharacterSubCategoryTypes } from "../KeyBinds";
import KeyBindsCategoryBtns from "./KeyBindsCategoryBtns";
import KeyBindsCharacterSubCategoryBtns from "./KeyBindsCharacterSubCategoryBtns";

type KeyBindsHeaderTypes = {
  currentCategory: KeyBindsCategoryTypes;
  setCurrentCategory: React.Dispatch<React.SetStateAction<KeyBindsCategoryTypes>>;
  characterSubCategory: KeyBindsCharacterSubCategoryTypes;
  setCharacterSubCategory: React.Dispatch<React.SetStateAction<KeyBindsCharacterSubCategoryTypes>>;
};

export default function KeyBindsHeader({
  characterSubCategory,
  currentCategory,
  setCharacterSubCategory,
  setCurrentCategory,
}: KeyBindsHeaderTypes) {
  return (
    <header className="w-full border-border border-[1px] rounded-md rounded-b-none">
      <ul className="w-full flex py-[5px] pb-[10px] border-b border-border">
        {Object.entries(AllKeyBinds).map((i) => (
          <KeyBindsCategoryBtns
            key={i[0]}
            categoryNameEng={i[0] as KeyBindsCategoryTypes}
            categoryName={i[1] as KeyBindsCategoryTypes}
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
          />
        ))}
      </ul>

      <ul className={`${currentCategory === "characters" ? "" : "hidden"} flex`}>
        {Object.entries(AllKeyBindsCharacterSubCategories).map((i) => (
          <KeyBindsCharacterSubCategoryBtns
            key={i[0]}
            characterSubCategoryNameEng={i[0] as KeyBindsCharacterSubCategoryTypes}
            characterSubCategoryName={i[1] as KeyBindsCharacterSubCategoryTypes}
            characterSubCategory={characterSubCategory}
            setCharacterSubCategory={setCharacterSubCategory}
          />
        ))}
      </ul>
    </header>
  );
}
