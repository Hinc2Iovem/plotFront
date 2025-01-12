import { Input } from "@/components/ui/input";
import { SearchCharacterVariationTypes } from "./CharacterListPage";
import SelectCharacterType from "./shared/SelectCharacterType";

type CharacterFiltersTypes = {
  setSearchCharacterType: React.Dispatch<React.SetStateAction<SearchCharacterVariationTypes>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  width: number;
};

export default function CharacterFilters({
  searchValue,
  width,
  setSearchCharacterType,
  setSearchValue,
}: CharacterFiltersTypes) {
  return (
    <form
      style={{ width: `${width + 2}px` }}
      onSubmit={(e) => e.preventDefault()}
      className={`fixed bottom-0 border-border shadow-md shadow-background bg-background border-[1px] p-[2.5px] rounded-md flex sm:flex-row gap-[5px] flex-col`}
    >
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Джонатан Блоу"
        className="flex-grow text-heading md:text-[25px] border-border border-[1px] px-[10px] py-[5px]"
      />
      <SelectCharacterType<SearchCharacterVariationTypes>
        onValueChange={(v) => setSearchCharacterType(v)}
        withAll={true}
        triggerClasses="sm:w-[20%] min-w-[150px] capitalize flex-grow w-full text-text relative"
        valueClasses="capitalize text-text md:text-[25px] py-[20px]"
      />
    </form>
  );
}
