import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useUpdateConditionAppearance from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionAppearance";
import useCreateAppearancePartOptimistic from "../../../../../../../../../hooks/Posting/AppearancePart/useCreateAppearancePartOptimistic";
import { generateMongoObjectId } from "../../../../../../../../../utils/generateMongoObjectId";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import AsideInformativeOrSuggestion from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/AsideInformativeOrSuggestion";
import InformativeOrSuggestionText from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionText";
import InformativeOrSuggestionButton from "../../../../../../../../../ui/Aside/AsideInformativeOrSuggestion/InformativeOrSuggestionButton";

type CreateNewValueModalTypes = {
  showCreateNewValueModal: boolean;
  conditionName: string;
  conditionBlockAppearanceId: string;
  setShowCreateNewValueModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueNonExisting: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateNewValueModal({
  setHighlightRedOnValueNonExisting,
  setShowCreateNewValueModal,
  showCreateNewValueModal,
  conditionName,
  conditionBlockAppearanceId,
}: CreateNewValueModalTypes) {
  const { storyId } = useParams();
  const focusOnBtnRef = useRef<HTMLButtonElement>(null);
  const createNewAppearanceModalRef = useRef<HTMLDivElement>(null);
  const updateConditionBlock = useUpdateConditionAppearance({
    conditionBlockAppearanceId,
  });

  useEffect(() => {
    if (focusOnBtnRef) {
      focusOnBtnRef.current?.focus();
    }
  }, []);

  const createNewAppearance = useCreateAppearancePartOptimistic({
    storyId: storyId || "",
    appearancePartName: conditionName,
  });

  const handleCreatingNewAppearance = () => {
    setShowCreateNewValueModal(false);
    setHighlightRedOnValueNonExisting(false);
    const appearanceId = generateMongoObjectId();
    createNewAppearance.mutate({ appearancePartId: appearanceId, currentLanguage: "russian" });
    updateConditionBlock.mutate({
      appearancePartId: appearanceId,
    });
  };

  useOutOfModal({
    modalRef: createNewAppearanceModalRef,
    setShowModal: setShowCreateNewValueModal,
    showModal: showCreateNewValueModal,
  });

  return (
    <AsideInformativeOrSuggestion
      ref={createNewAppearanceModalRef}
      className={`${showCreateNewValueModal ? "" : "hidden"}`}
    >
      <InformativeOrSuggestionText>Такой одежды не существует, хотите создать?</InformativeOrSuggestionText>
      <InformativeOrSuggestionButton ref={focusOnBtnRef} onClick={handleCreatingNewAppearance}>
        Создать
      </InformativeOrSuggestionButton>
    </AsideInformativeOrSuggestion>
  );
}
