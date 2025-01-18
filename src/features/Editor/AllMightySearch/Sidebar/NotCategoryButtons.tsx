import { Button } from "@/components/ui/button";
import React from "react";
import { AllPossibleAllMightySearchCategoriesTypes } from "../AllMightySearch";

type NotCategoryButtonsTypes = {
  showContent: {
    showKeyBinds: boolean;
    showSearch: boolean;
  };
  setShowContent: React.Dispatch<
    React.SetStateAction<{
      showKeyBinds: boolean;
      showSearch: boolean;
    }>
  >;
  setCurrentCategory: React.Dispatch<React.SetStateAction<AllPossibleAllMightySearchCategoriesTypes>>;
  setShowAllMightySearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotCategoryButtons({
  setCurrentCategory,
  setShowContent,
  setShowAllMightySearch,
  showContent,
}: NotCategoryButtonsTypes) {
  return (
    <div className="flex flex-col gap-[5px]">
      <div className="flex gap-[5px] w-full">
        <Button
          onClick={() => {
            setShowContent(() => ({
              showKeyBinds: false,
              showSearch: true,
            }));
            setCurrentCategory("" as AllPossibleAllMightySearchCategoriesTypes);
          }}
          className={`${
            showContent.showSearch ? "bg-accent" : "border-border border-[3px]"
          } w-full text-heading text-[23px] py-[20px] hover:bg-accent focus-within:bg-accent active:scale-[.99] transition-all`}
        >
          Поиск
        </Button>

        <Button
          onClick={() => {
            setShowContent(() => ({
              showKeyBinds: true,
              showSearch: false,
            }));
            setCurrentCategory("" as AllPossibleAllMightySearchCategoriesTypes);
          }}
          className={`${
            showContent.showKeyBinds ? "bg-accent" : "border-border border-[3px]"
          } w-full text-heading text-[23px] py-[20px] hover:bg-accent focus-within:bg-accent active:scale-[.99] transition-all`}
        >
          Бинды
        </Button>
      </div>

      <Button
        onClick={() => setShowAllMightySearch(false)}
        className="text-text justify-center text-[23px] py-[20px] bg-accent hover:bg-brand-gradient focus-within:bg-brand-gradient active:scale-[.99] transition-all"
      >
        Назад
      </Button>
    </div>
  );
}
