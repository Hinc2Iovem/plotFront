import { useEffect, useRef, useState } from "react";
import PlotfieldInput from "../../../../ui/Inputs/PlotfieldInput";
import useDebounce from "../../../../hooks/utilities/useDebounce";
import plus from "../../../../assets/images/shared/plus.png";
import reject from "../../../../assets/images/shared/rejectBlue.png";
import AllMightySearchMainContent from "./MainContent/AllMightySearchMainContent";
import { AllPossibleAllMightySearchCategoriesTypes } from "../AllMightySearch";

type AllMightySearchMainTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  setCurrentCategory: React.Dispatch<React.SetStateAction<AllPossibleAllMightySearchCategoriesTypes>>;
};

export default function AllMightySearchMain({ currentCategory, setCurrentCategory }: AllMightySearchMainTypes) {
  const [searchValue, setSearchValue] = useState("");
  const [showCreatingNewElement, setShowCreatingNewElement] = useState(false);
  const debouncedValue = useDebounce({ value: searchValue, delay: 500 });

  useEffect(() => {
    setShowCreatingNewElement(false);
  }, [currentCategory]);

  return (
    <main className="flex-grow p-[10px] mt-[10px] flex flex-col gap-[10px]">
      <AllMightySearchMainForm
        currentCategory={currentCategory}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <AllMightySearchMainNewElementButton
        setShowCreatingNewElement={setShowCreatingNewElement}
        showCreatingNewElement={showCreatingNewElement}
      />
      <AllMightySearchMainContent
        debouncedValue={debouncedValue}
        setCurrentCategory={setCurrentCategory}
        showCreatingNewElement={showCreatingNewElement}
        currentCategory={currentCategory}
        setShowCreatingNewElement={setShowCreatingNewElement}
      />
    </main>
  );
}

type AllMightySearchMainNewElementButtonTypes = {
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
  showCreatingNewElement: boolean;
};

function AllMightySearchMainNewElementButton({
  setShowCreatingNewElement,
  showCreatingNewElement,
}: AllMightySearchMainNewElementButtonTypes) {
  return (
    <div className="w-full flex justify-between">
      <button
        onClick={() => setShowCreatingNewElement((prev) => !prev)}
        className="w-[30px] rounded-md p-[1px] ml-auto bg-brand-gradient hover:scale-[1.05] transition-all active:scale-[1]"
      >
        <img src={showCreatingNewElement ? reject : plus} alt={showCreatingNewElement ? "x" : "+"} className="w-full" />
      </button>
    </div>
  );
}

type AllMightySearchMainFormTypes = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
};

function AllMightySearchMainForm({ currentCategory, searchValue, setSearchValue }: AllMightySearchMainFormTypes) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, currentCategory]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <PlotfieldInput
        ref={inputRef}
        type="text"
        name="mainInput"
        id="mainInput"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="flex-grow text-[15px]"
      />
    </form>
  );
}
