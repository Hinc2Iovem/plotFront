import { Button } from "@/components/ui/button";
import { KeyBindsCategoryTypes } from "../KeyBinds";

type KeyBindsCategoryBtnsTypes = {
  currentCategory: KeyBindsCategoryTypes;
  categoryNameEng: KeyBindsCategoryTypes;
  categoryName: string;
  setCurrentCategory: React.Dispatch<React.SetStateAction<KeyBindsCategoryTypes>>;
};

export default function KeyBindsCategoryBtns({
  categoryName,
  categoryNameEng,
  currentCategory,
  setCurrentCategory,
}: KeyBindsCategoryBtnsTypes) {
  return (
    <li>
      <Button
        variant={"link"}
        className={`text-[30px] ${
          currentCategory === categoryNameEng
            ? "text-text underline"
            : "text-accent hover:text-text focus-within:underline focus-within:text-text hover:underline"
        }  transition-all outline-none`}
        onClick={() => setCurrentCategory(categoryNameEng)}
      >
        {categoryName}
      </Button>
    </li>
  );
}
