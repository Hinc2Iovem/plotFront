import { Button } from "@/components/ui/button";
import { KeyBindsCharacterSubCategoryTypes } from "../KeyBinds";

type KeyBindsCharacterSubCategoryBtnsTypes = {
  characterSubCategoryNameEng: KeyBindsCharacterSubCategoryTypes;
  characterSubCategory: KeyBindsCharacterSubCategoryTypes;
  characterSubCategoryName: string;
  setCharacterSubCategory: React.Dispatch<React.SetStateAction<KeyBindsCharacterSubCategoryTypes>>;
};
export default function KeyBindsCharacterSubCategoryBtns({
  characterSubCategory,
  characterSubCategoryName,
  characterSubCategoryNameEng,
  setCharacterSubCategory,
}: KeyBindsCharacterSubCategoryBtnsTypes) {
  return (
    <li>
      <Button
        variant={"link"}
        className={`text-[20px] ${
          characterSubCategory === characterSubCategoryNameEng
            ? "text-heading underline"
            : "text-accent focus-within:underline hover:text-heading hover:underline focus-within:text-heading"
        } transition-all outline-none`}
        onClick={() => setCharacterSubCategory(characterSubCategoryNameEng)}
      >
        {characterSubCategoryName}
      </Button>
    </li>
  );
}
