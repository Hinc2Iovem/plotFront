type WardrobeAppearanceNamesTypes = {
  allAppearanceNames: string[];
  setShowAllAppearancePartBlocks: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WardrobeAppearanceNames({
  allAppearanceNames,
  setShowAllAppearancePartBlocks,
}: WardrobeAppearanceNamesTypes) {
  const theme = localStorage.getItem("theme");

  return (
    <div className="w-full flex sm:flex-row flex-col gap-[1rem]">
      <div className="flex flex-wrap w-[70%] gap-[.5rem]">
        {allAppearanceNames.length
          ? allAppearanceNames.map((n, i) => (
              <button
                className="uppercase border-secondary border-[.1rem] hover:bg-secondary self-center flex-grow rounded-md px-[1rem] py-[.5rem] opacity-80 hover:opacity-100 transition-all text-text-light text-[1.3rem]"
                key={n + i}
              >
                {n}
              </button>
            ))
          : null}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowAllAppearancePartBlocks(true);
        }}
        className={`w-fit  ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } self-start  flex-grow text-[1.4rem] text-text-dark hover:text-text-light px-[1rem] bg-secondary rounded-md shadow-md py-[.5rem]`}
      >
        Посмотреть Одежду
      </button>
    </div>
  );
}
