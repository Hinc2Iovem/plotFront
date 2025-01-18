import { useState } from "react";
import AllMightySearchMain from "./Search/AllMightySearchMain";
import AllMightySearchSidebar from "./Sidebar/AllMightySearchSidebar";
import PlotfieldSearch from "./PlotfieldSearch/PlotfieldSearch";

type AllMightySearchTypes = {
  setShowAllMightySearch: React.Dispatch<React.SetStateAction<boolean>>;
  showAllMightySearch: boolean;
};

export type AllPossibleAllMightySearchCategoriesTypes =
  | "key"
  | "appearance"
  | "character"
  | "characteristic"
  | "achievement"
  | "music"
  | "sound";

export type AllPossibleAllMightySearchCategoriesRusTypes =
  | "ключи"
  | "внешний вид"
  | "персонажи"
  | "характеристики"
  | "ачивки"
  | "музыка"
  | "звуки";

export default function AllMightySearch({ setShowAllMightySearch, showAllMightySearch }: AllMightySearchTypes) {
  const [currentCategory, setCurrentCategory] = useState("" as AllPossibleAllMightySearchCategoriesTypes);
  const [showContent, setShowContent] = useState({
    showKeyBinds: false,
    showSearch: true,
  });

  return (
    <>
      {showAllMightySearch ? (
        <section className={`flex w-full h-[calc(100vh-23px)] bg-secondary rounded-md relative`}>
          <AllMightySearchSidebar
            setCurrentCategory={setCurrentCategory}
            setShowContent={setShowContent}
            currentCategory={currentCategory}
            showContent={showContent}
          />
          {showContent.showKeyBinds ? null : showContent.showSearch ? (
            <PlotfieldSearch setShowAllMightySearch={setShowAllMightySearch} />
          ) : (
            <AllMightySearchMain setCurrentCategory={setCurrentCategory} currentCategory={currentCategory} />
          )}
        </section>
      ) : null}
    </>
  );
}
