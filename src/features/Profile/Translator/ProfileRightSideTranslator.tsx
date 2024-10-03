import { useState } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import "../../Editor/Flowchart/FlowchartStyles.css";
import FiltersEverythingCharacterForAppearancePart from "./AboutCharacter/Filters/FiltersEverythingCharacterForAppearancePart";
import FiltersEverythingCharacterForCharacter from "./AboutCharacter/Filters/FiltersEverythingCharacterForCharacter";
import FiltersEverythingCharacterForCharacteristic from "./AboutCharacter/Filters/FiltersEverythingCharacterForCharacteristic";
import FiltersEverythingStoryForEpisode from "./AboutStory/Filters/FiltersEverythingStoryForEpisode";
import FiltersEverythingStoryForSeason from "./AboutStory/Filters/FiltersEverythingStoryForSeason";
import FiltersEverythingStoryForStory from "./AboutStory/Filters/FiltersEverythingStoryForStory";
import FiltersEverythingPlot from "./Plot/Filters/FiltersEverythingPlot";
import ProfileRightSideTranslatorHeader from "./ProfileRightSideTranslatorHeader";
import FiltersEverythingRecent from "./Recent/Filters/FiltersEverythingRecent";

export type PossibleCategoryVariationTypes =
  | "everythingCharacter"
  | "everythingStory"
  | "everythingPlot"
  | "recent";

export type AllPossibleSubCategoryTypes =
  | "Персонажи"
  | "Внешний Вид"
  | "Характеристики"
  | "Эпизоды"
  | "Сезоны"
  | "Истории";

export default function ProfileRightSideTranslator() {
  const [translateFromLanguage, setTranslateFromLanguage] =
    useState<CurrentlyAvailableLanguagesTypes>(
      "" as CurrentlyAvailableLanguagesTypes
    );
  const [translateToLanguage, setTranslateToLanguage] =
    useState<CurrentlyAvailableLanguagesTypes>(
      "" as CurrentlyAvailableLanguagesTypes
    );
  const [prevTranslateFromLanguage, setPrevTranslateFromLanguage] =
    useState<CurrentlyAvailableLanguagesTypes>(
      "" as CurrentlyAvailableLanguagesTypes
    );
  const [prevTranslateToLanguage, setPrevTranslateToLanguage] =
    useState<CurrentlyAvailableLanguagesTypes>(
      "" as CurrentlyAvailableLanguagesTypes
    );

  const [category, setCategory] = useState<PossibleCategoryVariationTypes>(
    "" as PossibleCategoryVariationTypes
  );
  const [subCategory, setSubCategory] = useState<AllPossibleSubCategoryTypes>(
    "" as AllPossibleSubCategoryTypes
  );

  return (
    <section className="w-full flex flex-col gap-[1.5rem]">
      <ProfileRightSideTranslatorHeader
        category={category}
        setCategory={setCategory}
        setSubCategory={setSubCategory}
        subCategory={subCategory}
        setPrevTranslateFromLanguage={setPrevTranslateFromLanguage}
        setPrevTranslateToLanguage={setPrevTranslateToLanguage}
        setTranslateFromLanguage={setTranslateFromLanguage}
        setTranslateToLanguage={setTranslateToLanguage}
        translateFromLanguage={translateFromLanguage}
        translateToLanguage={translateToLanguage}
      />
      <main className="w-full flex flex-col gap-[1rem]">
        <div className="flex flex-col w-full gap-[1rem]">
          {subCategory === "Персонажи" ? (
            <FiltersEverythingCharacterForCharacter
              translateFromLanguage={translateFromLanguage}
              translateToLanguage={translateToLanguage}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
            />
          ) : subCategory === "Характеристики" ? (
            <FiltersEverythingCharacterForCharacteristic
              translateFromLanguage={translateFromLanguage}
              translateToLanguage={translateToLanguage}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
            />
          ) : subCategory === "Внешний Вид" ? (
            <FiltersEverythingCharacterForAppearancePart
              translateFromLanguage={translateFromLanguage}
              translateToLanguage={translateToLanguage}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
            />
          ) : subCategory === "Эпизоды" ? (
            <FiltersEverythingStoryForEpisode
              translateFromLanguage={translateFromLanguage}
              translateToLanguage={translateToLanguage}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
            />
          ) : subCategory === "Сезоны" ? (
            <FiltersEverythingStoryForSeason
              translateFromLanguage={translateFromLanguage}
              translateToLanguage={translateToLanguage}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
            />
          ) : subCategory === "Истории" ? (
            <FiltersEverythingStoryForStory
              translateFromLanguage={translateFromLanguage}
              translateToLanguage={translateToLanguage}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
            />
          ) : category === "everythingPlot" ? (
            <FiltersEverythingPlot
              translateFromLanguage={translateFromLanguage}
              translateToLanguage={translateToLanguage}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
            />
          ) : category === "recent" ? (
            <FiltersEverythingRecent
              translateFromLanguage={translateFromLanguage}
              translateToLanguage={translateToLanguage}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
            />
          ) : null}
        </div>
      </main>
    </section>
  );
}
