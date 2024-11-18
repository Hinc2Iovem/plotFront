import { useState } from "react";
import AllMightySearchMain from "./Search/AllMightySearchMain";
import AllMightySearchSidebar from "./Sidebar/AllMightySearchSidebar";

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
  const theme = localStorage.getItem("theme");

  const [currentCategory, setCurrentCategory] = useState("" as AllPossibleAllMightySearchCategoriesTypes);
  const [showKeyBinds, setShowKeyBinds] = useState(false);

  return (
    <>
      {showAllMightySearch ? (
        <section className={`flex w-full h-[calc(100vh-2.30rem)] bg-secondary relative`}>
          <button
            onClick={() => setShowAllMightySearch(false)}
            className={`w-[2.5rem] h-[1rem] shadow-inner ${
              theme === "light" ? "shadow-secondary-darker hover:shadow-md" : "shadow-gray-700 hover:scale-[1.03]"
            } transition-shadow rounded-md absolute top-[.5rem] right-[.5rem]`}
          >
            {/* Close AllMightySearch button */}
          </button>

          <AllMightySearchSidebar
            setCurrentCategory={setCurrentCategory}
            setShowKeyBinds={setShowKeyBinds}
            currentCategory={currentCategory}
            showKeyBinds={showKeyBinds}
          />

          {showKeyBinds ? null : <AllMightySearchMain currentCategory={currentCategory} />}
        </section>
      ) : null}
    </>
  );
}
