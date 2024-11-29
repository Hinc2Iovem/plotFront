import useEscapeOfModal from "../../../../hooks/UI/useEscapeOfModal";
import {
  TranslationAppearancePartTypes,
  TranslationCharacterCharacteristicTypes,
} from "../../../../types/Additional/TranslationTypes";
import { SoundTypes } from "../../../../types/StoryData/Sound/SoundTypes";
import { AllPossibleAllMightySearchCategoriesTypes } from "../AllMightySearch";
import { NewElementTypes } from "./MainContent/AllMightySearchMainContent";
import NewAchievementForm from "./NewElementForm/NewAchievementForm";
import NewAppearanceForm from "./NewElementForm/NewAppearanceForm";
import NewCharacterForm from "./NewElementForm/NewCharacterForm";
import NewCharacteristicForm from "./NewElementForm/NewCharacteristicForm";
import NewKeyForm from "./NewElementForm/NewKeyForm";
import NewMusicForm from "./NewElementForm/NewMusicForm";
import NewSoundForm from "./NewElementForm/NewSoundForm";

type AllMightyNewElementFormTypes = {
  currentCategory: AllPossibleAllMightySearchCategoriesTypes;
  showCreatingNewElement: boolean;
  newElement: NewElementTypes;
  setNewElement: React.Dispatch<React.SetStateAction<NewElementTypes>>;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AllMightyNewElementForm({
  showCreatingNewElement,
  currentCategory,
  setNewElement,
  setShowCreatingNewElement,
}: AllMightyNewElementFormTypes) {
  useEscapeOfModal({ setValue: setShowCreatingNewElement, value: showCreatingNewElement });

  return (
    <div className={`${showCreatingNewElement ? "" : "hidden"}`}>
      {currentCategory === "key" ? (
        <NewKeyForm
          showCreatingNewElement={showCreatingNewElement}
          setNewElement={setNewElement}
          setShowCreatingNewElement={setShowCreatingNewElement}
        />
      ) : currentCategory === "character" ? (
        <NewCharacterForm
          showCreatingNewElement={showCreatingNewElement}
          setNewElement={setNewElement}
          setShowCreatingNewElement={setShowCreatingNewElement}
          characterTypeFilter="all"
          debouncedValueFilter=""
        />
      ) : currentCategory === "achievement" ? (
        <NewAchievementForm
          showCreatingNewElement={showCreatingNewElement}
          setNewElement={setNewElement}
          setShowCreatingNewElement={setShowCreatingNewElement}
        />
      ) : currentCategory === "music" ? (
        <NewMusicForm
          showCreatingNewElement={showCreatingNewElement}
          setNewElement={setNewElement}
          setShowCreatingNewElement={setShowCreatingNewElement}
        />
      ) : currentCategory === "sound" ? (
        <NewSoundForm
          showCreatingNewElement={showCreatingNewElement}
          setNewElement={setNewElement as React.Dispatch<React.SetStateAction<SoundTypes>>}
          setShowCreatingNewElement={setShowCreatingNewElement}
        />
      ) : currentCategory === "characteristic" ? (
        <NewCharacteristicForm
          showCreatingNewElement={showCreatingNewElement}
          setNewElement={setNewElement as React.Dispatch<React.SetStateAction<TranslationCharacterCharacteristicTypes>>}
          setShowCreatingNewElement={setShowCreatingNewElement}
        />
      ) : currentCategory === "appearance" ? (
        <NewAppearanceForm
          showCreatingNewElement={showCreatingNewElement}
          setNewElement={setNewElement as React.Dispatch<React.SetStateAction<TranslationAppearancePartTypes>>}
          setShowCreatingNewElement={setShowCreatingNewElement}
        />
      ) : null}
    </div>
  );
}
