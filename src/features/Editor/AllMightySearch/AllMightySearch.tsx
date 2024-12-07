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
        <section className={`flex w-full h-[calc(100vh-2.30rem)] bg-secondary relative`}>
          <CloseAllMightySearchButton setShowAllMightySearch={setShowAllMightySearch} />
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

type CloseAllMightySearchButtonTypes = {
  setShowAllMightySearch: React.Dispatch<React.SetStateAction<boolean>>;
};

function CloseAllMightySearchButton({ setShowAllMightySearch }: CloseAllMightySearchButtonTypes) {
  const theme = localStorage.getItem("theme");

  return (
    <button
      onClick={() => setShowAllMightySearch(false)}
      className={`w-[2.5rem] h-[1rem] shadow-inner ${
        theme === "light" ? "shadow-secondary-darker hover:shadow-md" : "shadow-gray-700 hover:scale-[1.03]"
      } transition-shadow rounded-md absolute top-[.5rem] right-[.5rem]`}
    ></button>
  );
}
