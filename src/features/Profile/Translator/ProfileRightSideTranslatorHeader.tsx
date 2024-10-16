import { useRef, useState } from "react";
import {
  AllPossibleSubCategoryTypes,
  PossibleCategoryVariationTypes,
} from "./ProfileRightSideTranslator";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import ProfileTranslatorHeaderLanguageModal from "./ProfileTranslatorHeaderLanguageModal";

const CATEGORIES = ["Касаемое Персонажа", "Касаемое Истории", "Сюжет"];

type ProfileRightSideTranslatorHeaderTypes = {
  setTranslateFromLanguage: React.Dispatch<
    React.SetStateAction<CurrentlyAvailableLanguagesTypes>
  >;
  setTranslateToLanguage: React.Dispatch<
    React.SetStateAction<CurrentlyAvailableLanguagesTypes>
  >;
  setPrevTranslateFromLanguage: React.Dispatch<
    React.SetStateAction<CurrentlyAvailableLanguagesTypes>
  >;
  setPrevTranslateToLanguage: React.Dispatch<
    React.SetStateAction<CurrentlyAvailableLanguagesTypes>
  >;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  setSubCategory: React.Dispatch<
    React.SetStateAction<AllPossibleSubCategoryTypes>
  >;
  setCategory: React.Dispatch<
    React.SetStateAction<PossibleCategoryVariationTypes>
  >;
  category: PossibleCategoryVariationTypes;
  subCategory: AllPossibleSubCategoryTypes;
};

export default function ProfileRightSideTranslatorHeader({
  category,
  subCategory,
  setCategory,
  setSubCategory,
  setTranslateFromLanguage,
  setTranslateToLanguage,
  setPrevTranslateFromLanguage,
  setPrevTranslateToLanguage,
  translateFromLanguage,
  translateToLanguage,
}: ProfileRightSideTranslatorHeaderTypes) {
  return (
    <header className="flex flex-col gap-[1rem] p-[.5rem] bg-secondary-darker rounded-md shadow-sm">
      <div className="flex gap-[1rem] flex-col z-[3] w-full">
        <div className="flex gap-[1rem] z-[3] w-full">
          <ProfileRightSideTranslatorCategory
            name={"Недавние"}
            category={category}
            subCategory={subCategory}
            setCategory={setCategory}
            setSubCategory={setSubCategory}
          />
        </div>
        <div className="flex gap-[1rem] flex-wrap z-[3] w-full">
          {CATEGORIES.map((c) => (
            <ProfileRightSideTranslatorCategory
              key={c}
              name={c}
              category={category}
              subCategory={subCategory}
              setCategory={setCategory}
              setSubCategory={setSubCategory}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full justify-between">
        <ProfileTranslatorHeaderLanguageModal
          key={"Перевести с"}
          setPrevValue={setPrevTranslateFromLanguage}
          takenValue={translateToLanguage}
          setValue={setTranslateFromLanguage}
          value={translateFromLanguage}
          text="Перевести с"
        />
        <ProfileTranslatorHeaderLanguageModal
          key={"Перевести на"}
          setPrevValue={setPrevTranslateToLanguage}
          takenValue={translateFromLanguage}
          setValue={setTranslateToLanguage}
          value={translateToLanguage}
          text="Перевести на"
        />
      </div>
    </header>
  );
}

const SUB_CATEGORIES_FOR_CHARACTER = [
  "Персонажи",
  "Внешний Вид",
  "Характеристики",
];
const SUB_CATEGORIES_FOR_STORY = ["Эпизоды", "Сезоны", "Истории"];

type ProfileRightSideTranslatorCategoryTypes = {
  setSubCategory: React.Dispatch<
    React.SetStateAction<AllPossibleSubCategoryTypes>
  >;
  setCategory: React.Dispatch<
    React.SetStateAction<PossibleCategoryVariationTypes>
  >;
  name: string;
  category: PossibleCategoryVariationTypes;
  subCategory: AllPossibleSubCategoryTypes;
};
function ProfileRightSideTranslatorCategory({
  category,
  setSubCategory,
  setCategory,
  subCategory,
  name,
}: ProfileRightSideTranslatorCategoryTypes) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const nameToEng: PossibleCategoryVariationTypes =
    name === "Касаемое Персонажа"
      ? "everythingCharacter"
      : name === "Касаемое Истории"
      ? "everythingStory"
      : name === "Недавние"
      ? "recent"
      : "everythingPlot";

  useOutOfModal({ modalRef, setShowModal, showModal });

  return (
    <div className="flex-grow rounded-md shadow-md relative whitespace-nowrap">
      <button
        onClick={(e) => {
          if (nameToEng !== "everythingPlot" && nameToEng !== "recent") {
            e.stopPropagation();
            setShowModal((prev) => !prev);
          } else {
            setCategory(nameToEng);
            setSubCategory("" as AllPossibleSubCategoryTypes);
          }
        }}
        className={`text-[1.5rem] w-full rounded-md ${
          category === nameToEng
            ? "text-text-dark bg-primary-darker"
            : "text-gray-700 bg-secondary"
        } hover:bg-primary-darker hover:text-text-dark transition-all px-[1rem] py-[.5rem] outline-gray-400`}
      >
        {name}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showModal ? "" : "hidden"
        } z-[2] flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[1rem] p-[1rem]`}
      >
        {nameToEng === "everythingCharacter" ? (
          <>
            {SUB_CATEGORIES_FOR_CHARACTER.map((c) => (
              <ProfileRightSideTranslatorHeaderDisplaySubCategories
                key={c}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                nameToEng={nameToEng}
                setCategory={setCategory}
                setShowModal={setShowModal}
                c={c}
              />
            ))}
          </>
        ) : nameToEng === "everythingStory" ? (
          <>
            {SUB_CATEGORIES_FOR_STORY.map((c) => (
              <ProfileRightSideTranslatorHeaderDisplaySubCategories
                key={c}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                nameToEng={nameToEng}
                setCategory={setCategory}
                setShowModal={setShowModal}
                c={c}
              />
            ))}
          </>
        ) : null}
      </aside>
    </div>
  );
}

type ProfileRightSideTranslatorHeaderDisplaySubCategoriesTypes = {
  nameToEng: PossibleCategoryVariationTypes;
  setCategory: React.Dispatch<
    React.SetStateAction<PossibleCategoryVariationTypes>
  >;
  setSubCategory: React.Dispatch<
    React.SetStateAction<AllPossibleSubCategoryTypes>
  >;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  subCategory: AllPossibleSubCategoryTypes;
  c: string;
};

function ProfileRightSideTranslatorHeaderDisplaySubCategories({
  nameToEng,
  setCategory,
  setSubCategory,
  setShowModal,
  subCategory,
  c,
}: ProfileRightSideTranslatorHeaderDisplaySubCategoriesTypes) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowModal(false);
        setCategory(nameToEng);
        setSubCategory(c as AllPossibleSubCategoryTypes);
      }}
      className={`${
        c === subCategory
          ? "bg-primary-darker text-text-dark px-[1rem] py-[.5rem] rounded-md shadow-sm w-full"
          : "text-gray-700 bg-secondary"
      } text-[1.5rem] hover:bg-primary-darker hover:text-text-dark transition-all px-[1rem] py-[.5rem] rounded-md outline-gray-400`}
      key={c}
    >
      {c}
    </button>
  );
}
