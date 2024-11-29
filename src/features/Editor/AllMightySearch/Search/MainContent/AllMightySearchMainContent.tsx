import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  TranslationAchievementTypes,
  TranslationAppearancePartTypes,
  TranslationCharacterCharacteristicTypes,
  TranslationCharacterTypes,
} from "../../../../../types/Additional/TranslationTypes";
import { MusicTypes } from "../../../../../types/StoryData/Music/MusicTypes";
import { SoundTypes } from "../../../../../types/StoryData/Sound/SoundTypes";
import { KeyTypes } from "../../../../../types/StoryEditor/PlotField/Key/KeyTypes";
import PlotfieldButton from "../../../../shared/Buttons/PlotfieldButton";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../AllMightySearch";
import AllMightyNewElementForm from "../AllMightyNewElementForm";
import AllMightySearchMainContentAchievement from "./Achievement/AllMightySearchMainContentAchievement";
import AllMightySearchMainContentAppearance from "./AppearancePart/AllMightySearchMainContentAppearance";
import AllMightySearchMainContentCharacter from "./Character/AllMightySearchMainContentCharacter";
import AllMightySearchMainContentCharacteristic from "./Characteristic/AllMightySearchMainContentCharacteristic";
import AllMightySearchMainContentKey from "./Key/AllMightySearchMainContentKey";
import AllMightySearchMainContentMusic from "./Music/AllMightySearchMainContentMusic";
import AllMightySearchMainContentSound from "./Sound/AllMightySearchMainContentSound";

type AllMightySearchMainContentTypes = {
  debouncedValue: string;
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  showCreatingNewElement: boolean;
  setCurrentCategory: React.Dispatch<React.SetStateAction<AllPossibleAllMightySearchCategoriesTypes>>;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

function ErrorFallback({
  error,
  setCurrentCategory,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
  setCurrentCategory: React.Dispatch<React.SetStateAction<AllPossibleAllMightySearchCategoriesTypes>>;
}) {
  return (
    <div>
      <h2 className="text-[1.5rem] text-red-400">Error: {error.message}</h2>
      <PlotfieldButton
        onClick={() => {
          setCurrentCategory("" as AllPossibleAllMightySearchCategoriesTypes);
          resetErrorBoundary();
        }}
      >
        Обновить
      </PlotfieldButton>
    </div>
  );
}

export type NewElementTypes =
  | null
  | KeyTypes
  | TranslationCharacterTypes
  | TranslationCharacterCharacteristicTypes
  | TranslationAppearancePartTypes
  | TranslationAchievementTypes
  | MusicTypes
  | SoundTypes;

export default function AllMightySearchMainContent({
  currentCategory,
  debouncedValue,
  showCreatingNewElement,
  setShowCreatingNewElement,
  setCurrentCategory,
}: AllMightySearchMainContentTypes) {
  const [newElement, setNewElement] = useState<NewElementTypes | null>(null);
  return (
    <ErrorBoundary FallbackComponent={(error) => <ErrorFallback setCurrentCategory={setCurrentCategory} {...error} />}>
      <div className={`${showCreatingNewElement ? "hidden" : ""} h-full overflow-auto`}>
        {currentCategory === "key" ? (
          <AllMightySearchMainContentKey
            currentCategory={currentCategory}
            setNewElement={setNewElement}
            newElement={newElement}
            debouncedValue={debouncedValue}
          />
        ) : currentCategory === "character" ? (
          <AllMightySearchMainContentCharacter
            setNewElement={setNewElement}
            currentCategory={currentCategory}
            newElement={newElement}
            debouncedValue={debouncedValue}
          />
        ) : currentCategory === "characteristic" ? (
          <AllMightySearchMainContentCharacteristic
            currentCategory={currentCategory}
            setNewElement={
              setNewElement as React.Dispatch<React.SetStateAction<TranslationCharacterCharacteristicTypes | null>>
            }
            newElement={newElement as TranslationCharacterCharacteristicTypes}
            debouncedValue={debouncedValue}
          />
        ) : currentCategory === "appearance" ? (
          <AllMightySearchMainContentAppearance
            setNewElement={setNewElement as React.Dispatch<React.SetStateAction<TranslationAppearancePartTypes | null>>}
            currentCategory={currentCategory}
            newElement={newElement as TranslationAppearancePartTypes}
            debouncedValue={debouncedValue}
            characterId=""
            type={"" as "temp"}
          />
        ) : currentCategory === "achievement" ? (
          <AllMightySearchMainContentAchievement
            currentCategory={currentCategory}
            setNewElement={setNewElement as React.Dispatch<React.SetStateAction<TranslationAchievementTypes | null>>}
            newElement={newElement as TranslationAchievementTypes}
            debouncedValue={debouncedValue}
          />
        ) : currentCategory === "music" ? (
          <AllMightySearchMainContentMusic
            currentCategory={currentCategory}
            setNewElement={setNewElement as React.Dispatch<React.SetStateAction<MusicTypes | null>>}
            newElement={newElement as MusicTypes}
            debouncedValue={debouncedValue}
          />
        ) : currentCategory === "sound" ? (
          <AllMightySearchMainContentSound
            currentCategory={currentCategory}
            setNewElement={setNewElement as React.Dispatch<React.SetStateAction<SoundTypes | null>>}
            newElement={newElement as SoundTypes}
            debouncedValue={debouncedValue}
          />
        ) : null}
      </div>
      <AllMightyNewElementForm
        currentCategory={currentCategory}
        newElement={newElement}
        setNewElement={setNewElement}
        showCreatingNewElement={showCreatingNewElement}
        setShowCreatingNewElement={setShowCreatingNewElement}
      />
    </ErrorBoundary>
  );
}
