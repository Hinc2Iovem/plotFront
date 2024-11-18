import { ErrorBoundary } from "react-error-boundary";
import { AllPossibleAllMightySearchCategoriesTypes } from "../../AllMightySearch";
import AllMightySearchMainContentAchievement from "./AllMightySearchMainContentAchievement";
import AllMightySearchMainContentAppearance from "./AllMightySearchMainContentAppearance";
import AllMightySearchMainContentCharacter from "./AllMightySearchMainContentCharacter";
import AllMightySearchMainContentCharacteristic from "./AllMightySearchMainContentCharacteristic";
import AllMightySearchMainContentKey from "./AllMightySearchMainContentKey";
import AllMightySearchMainContentMusic from "./AllMightySearchMainContentMusic";
import AllMightySearchMainContentSound from "./AllMightySearchMainContentSound";
import AllMightyNewElementForm from "../AllMightyNewElementForm";
import { useState } from "react";
import { KeyTypes } from "../../../../../types/StoryEditor/PlotField/Key/KeyTypes";

type AllMightySearchMainContentTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  debouncedValue: string;
  showCreatingNewElement: boolean;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

function ErrorFallback({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>;
}

export type NewElementTypes = null | KeyTypes;

export default function AllMightySearchMainContent({
  currentCategory,
  debouncedValue,
  showCreatingNewElement,
  setShowCreatingNewElement,
}: AllMightySearchMainContentTypes) {
  const [newElement, setNewElement] = useState<NewElementTypes | null>(null);
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={`${showCreatingNewElement ? "hidden" : ""} h-full overflow-auto`}>
        {currentCategory === "key" ? (
          <AllMightySearchMainContentKey newElement={newElement} debouncedValue={debouncedValue} />
        ) : currentCategory === "character" ? (
          <AllMightySearchMainContentCharacter debouncedValue={debouncedValue} />
        ) : currentCategory === "characteristic" ? (
          <AllMightySearchMainContentCharacteristic debouncedValue={debouncedValue} />
        ) : currentCategory === "appearance" ? (
          <AllMightySearchMainContentAppearance debouncedValue={debouncedValue} />
        ) : currentCategory === "achievement" ? (
          <AllMightySearchMainContentAchievement debouncedValue={debouncedValue} />
        ) : currentCategory === "music" ? (
          <AllMightySearchMainContentMusic debouncedValue={debouncedValue} />
        ) : currentCategory === "sound" ? (
          <AllMightySearchMainContentSound debouncedValue={debouncedValue} />
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
