import useEscapeOfModal from "../../../../hooks/UI/useEscapeOfModal";
import { AllPossibleAllMightySearchCategoriesTypes } from "../AllMightySearch";
import { NewElementTypes } from "./MainContent/AllMightySearchMainContent";
import NewKeyForm from "./NewElementForm/NewKeyForm";

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
        <NewKeyForm setNewElement={setNewElement} setShowCreatingNewElement={setShowCreatingNewElement} />
      ) : //   :
      //   currentCategory === "character" ? (
      //   ) : currentCategory === "characteristic" ? (
      //   ) : currentCategory === "appearance" ? (
      //   ) : currentCategory === "achievement" ? (
      //   ) : currentCategory === "music" ? (
      //   ) : currentCategory === "sound" ? (
      //   )
      null}
    </div>
  );
}
